extends Node
## Smoke test: builds every screen and overlay in a real scene tree and exercises the main buttons, so a
## runtime script error shows up as "SCRIPT ERROR" in the output (scripts/test-godot.sh fails on that).

var main: Control
var opened := 0


func _ready() -> void:
	main = load("res://scenes/main.tscn").instantiate()
	add_child(main)
	await _frames(2)
	_unlock_everything()
	await _screens()
	await _overlays()
	await _games()
	print("smoke: opened %d screens/overlays" % opened)
	get_tree().quit(0)


func _frames(n := 2) -> void:
	for i in n:
		await get_tree().process_frame


func _unlock_everything() -> void:
	var s := GameLogic.default_save()
	s["selectedRole"] = "zoologist"
	s["wildCamperUnlocked"] = true
	s["camperIntroductionSeen"] = true
	Save.apply(s)


func _screens() -> void:
	main.show_start(); await _frames(); opened += 1
	main.show_role_select(); await _frames(); opened += 1
	main.show_park(); await _frames(); opened += 1
	main.show_forest(); await _frames(); opened += 1
	main.show_camper(); await _frames(); opened += 1
	main.show_minigames(); await _frames(); opened += 1
	for b in Data.biomes:
		main.open_biome(b["id"])
		await _frames()
		opened += 1
		var screen: BiomeScreen = main.current
		for loc in b["locations"]:
			screen._go(loc["name"])
			await _frames()


func _overlays() -> void:
	# Camera on the first section of every biome, then take a photo of each animal.
	for b in Data.biomes:
		main.open_biome(b["id"])
		await _frames()
		var screen: BiomeScreen = main.current
		for loc in b["locations"]:
			screen._go(loc["name"])
			screen.open_camera()
			await _frames(3)
			opened += 1
			for id in loc["animalIds"]:
				var panel := _find_camera(screen)
				panel._tap(id)
				await _frames(2)
				opened += 1
			_close_modals(screen)
			await _frames()
	main.show_park()
	await _frames()
	var park: ParkScreen = main.current
	for loc in GameLogic.PARK_LOCATIONS:
		park._go(loc)
	park.open_camera(); await _frames(2); opened += 1
	park.open_quest(); await _frames(2); opened += 1
	park.open_clue(); await _frames(2); opened += 1
	park.open_discover(); await _frames(2); opened += 1
	park.open_progress(); await _frames(2); opened += 1
	park.open_about(); await _frames(2); opened += 1
	Overlays.journal(park); await _frames(2); opened += 1
	Overlays.album(park, Data.animal("duck")); await _frames(2); opened += 1
	Overlays.celebration(park, func(): pass); await _frames(2); opened += 1
	Overlays.biome_quiz(park, func(): pass); await _frames(2); opened += 1
	Overlays.habitat_quiz(park, Data.animal("cane-toad")); await _frames(2); opened += 1
	Overlays.photo_reveal(park, Data.animal("duck"), "duck-1", ["duck-1"], false, "bonus", true); await _frames(2); opened += 1
	Overlays.photo_reveal(park, Data.animal("duck"), "duck-2", ["duck-1", "duck-2"], true, "", false); await _frames(2); opened += 1
	main.show_camper()
	await _frames()
	var camper: CamperScreen = main.current
	camper.open_planner(); await _frames(2); opened += 1
	main.show_forest()
	await _frames()
	var forest: ForestScreen = main.current
	forest.open_camera(); await _frames(2); opened += 1


func _find_camera(node: Node) -> CameraPanel:
	for c in node.get_children():
		if c is CameraPanel:
			return c
		var found := _find_camera(c)
		if found:
			return found
	return null


func _close_modals(screen: Node) -> void:
	for c in screen.get_children():
		if c is Control and c.z_index == 50:
			c.queue_free()


func _games() -> void:
	main.show_minigames()
	await _frames()
	var g: MiniGamesScreen = main.current
	for id in ["memory", "who", "find", "habitat", "pattern", "count", "time"]:
		g._open(id)
		await _frames(3)
		opened += 1
