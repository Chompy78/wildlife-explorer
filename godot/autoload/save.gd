extends Node
## Holds the player's save and writes it to user:// (browser storage on the web build).

signal changed

const SAVE_PATH := "user://wildlife_explorer_save.json"

var data: Dictionary = {}


func _ready() -> void:
	data = load_game()


func load_game() -> Dictionary:
	if not FileAccess.file_exists(SAVE_PATH):
		return GameLogic.default_save()
	var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file == null:
		return GameLogic.default_save()
	var parsed = JSON.parse_string(file.get_as_text())
	return GameLogic.migrate(parsed)


func has_save() -> bool:
	return data["selectedRole"] != null or not data["photographedAnimals"].is_empty() \
		or data["questProgress"]["lostPuppy"]["started"] or data["wildCamperUnlocked"]


func apply(new_data: Dictionary) -> void:
	data = new_data
	write()
	changed.emit()


func write() -> void:
	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(data))


func reset() -> void:
	if FileAccess.file_exists(SAVE_PATH):
		DirAccess.remove_absolute(SAVE_PATH)
	data = GameLogic.default_save()
	changed.emit()
