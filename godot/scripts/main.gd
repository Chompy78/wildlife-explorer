extends Control
## Owns the current screen and the navigation between screens (the Godot twin of App.tsx).

var current: Control


func _ready() -> void:
	theme = UI.make_theme()
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	show_start()


func _swap(screen: Control, ambient := "") -> void:
	if current and is_instance_valid(current):
		current.queue_free()
	current = screen
	screen.set("main", self)
	add_child(screen)
	Sfx.set_ambient(ambient)


func go_home() -> void:
	show_start()


func show_start() -> void:
	_swap(StartScreen.new())


func show_role_select() -> void:
	_swap(RoleScreen.new())


func show_minigames() -> void:
	_swap(MiniGamesScreen.new())


func show_park() -> void:
	_swap(ParkScreen.new(), "park")


func show_forest() -> void:
	_swap(ForestScreen.new(), "forest")


func show_camper() -> void:
	_swap(CamperScreen.new())


func show_biome(id: String) -> void:
	var s := BiomeScreen.new()
	s.biome_id = id
	_swap(s, Data.biome(id)["ambient"])


# --- flows used by the screens ------------------------------------------------------------------------------------

func new_game() -> void:
	Save.reset()
	Save.write()
	show_role_select()


func continue_game() -> void:
	var d: Dictionary = Save.data
	if d["selectedRole"] == null:
		show_role_select()
		return
	var area: String = d["lastPlayArea"]
	if d["wildCamperUnlocked"] and area == "forest":
		show_forest()
	elif d["wildCamperUnlocked"] and area == "camper":
		show_camper()
	elif d["wildCamperUnlocked"] and Data.is_biome(area):
		show_biome(area)
	else:
		show_park()


func select_role(role_id: String) -> void:
	var d: Dictionary = Save.data.duplicate(true)
	d["selectedRole"] = role_id
	Save.apply(d)
	show_park()


func open_camper() -> void:
	Save.apply(GameLogic.enter_camper(Save.data))
	show_camper()


func open_park() -> void:
	Save.apply(GameLogic.return_to_park(Save.data))
	show_park()


func open_forest() -> void:
	Save.apply(GameLogic.enter_forest(Save.data))
	show_forest()


func open_biome(id: String) -> void:
	Save.apply(GameLogic.enter_biome(Save.data, id))
	show_biome(id)


func return_to_camper() -> void:
	Save.apply(GameLogic.return_to_camper(Save.data))
	show_camper()
