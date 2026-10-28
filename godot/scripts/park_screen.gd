class_name ParkScreen
extends Screen
## Tutorial Park: the illustrated map with pins, the Lost Puppy quest, discoveries and the tutorial checklist.

var _map: Control
var _prev_unlocked := false
var _camper_button: Button


func _ready() -> void:
	_prev_unlocked = Save.data["wildCamperUnlocked"]
	_camper_button = UI.button("🚐 Enter Wild Camper", "camper", func(): main.open_camper())
	build("park", "Tutorial Park", "Wildlife Explorer", [SoundToggle.new(), _camper_button, UI.button("Home", "secondary", func(): main.go_home())])
	set_message("Welcome to Tutorial Park. Try visiting Duck Pond, Open Meadow, Forest Trail, or the Strange Old Tree.")
	add_dock_button("camera", "📷", "Camera", open_camera)
	add_dock_button("quest", "🐾", "Quest", open_quest)
	add_dock_button("clue", "🔍", "Clue", open_clue)
	add_dock_button("discover", "🔭", "Discover", open_discover)
	add_dock_button("progress", "✅", "Progress", open_progress)
	add_dock_button("journal", "📖", "Journal", func(): Overlays.journal(self))
	add_dock_button("about", "ℹ️", "About", open_about)
	_render()


func current_location() -> Dictionary:
	return Data.park_location(Save.data["currentLocation"])


func animals_here() -> Array:
	return GameLogic.park_animals_for(Save.data["currentLocation"], Save.data)


func _render() -> void:
	var save: Dictionary = Save.data
	_camper_button.visible = save["wildCamperUnlocked"]
	for c in content.get_children():
		c.queue_free()
	var loc := current_location()
	var strip := UI.card(Color(1, 1, 1, 0.9), 24, 20)
	strip.add_child(UI.label("%s  %s" % [loc["name"], loc["description"]], 26))
	content.add_child(strip)
	_build_map()
	set_dock_badge("camera", animals_here().size())
	_dock_visible("clue", GameLogic.location_clue(save) != "")
	_dock_visible("discover", save["currentLocation"] == "Strange Old Tree" or save["wildCamperUnlocked"])


func _dock_visible(key: String, show: bool) -> void:
	if _dock_buttons.has(key):
		_dock_buttons[key][0].visible = show


func _build_map() -> void:
	_map = Control.new()
	_map.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_map.custom_minimum_size = Vector2(0, 900)
	_map.resized.connect(func(): _map.custom_minimum_size.y = _map.size.x * 1.5)
	content.add_child(_map)
	var frame := PanelContainer.new()
	var sb := StyleBoxFlat.new()
	sb.set_corner_radius_all(34)
	frame.add_theme_stylebox_override("panel", sb)
	frame.clip_children = CanvasItem.CLIP_CHILDREN_AND_DRAW
	frame.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	var tex := Data.load_asset("tutorial-park/park-map.jpg", 1024)
	var img := UI.photo(tex)
	img.stretch_mode = TextureRect.STRETCH_SCALE
	frame.add_child(img)
	_map.add_child(frame)
	var save: Dictionary = Save.data
	for loc in GameLogic.visible_park_locations(save):
		var coords: Dictionary = Data.park_map_coordinates[loc["name"]]
		var top := float(str(coords["top"]).trim_suffix("%")) / 100.0
		var left := float(str(coords["left"]).trim_suffix("%")) / 100.0
		var hidden: bool = loc["status"] == "hidden"
		var active: bool = loc["name"] == save["currentLocation"]
		var icon: String = "🔒" if hidden and not GameLogic.sees_locked_preview(save["selectedRole"]) else loc["icon"]
		var pin := UI.button("%s %s" % [icon, loc["name"]], "active" if active else "card", func(): _go(loc["name"]))
		pin.autowrap_mode = TextServer.AUTOWRAP_OFF
		pin.custom_minimum_size = Vector2(0, 58)
		pin.add_theme_font_size_override("font_size", 22)
		pin.set_anchors_preset(Control.PRESET_TOP_LEFT)
		pin.anchor_left = left
		pin.anchor_right = left
		pin.anchor_top = top
		pin.anchor_bottom = top
		pin.grow_horizontal = Control.GROW_DIRECTION_BOTH
		pin.grow_vertical = Control.GROW_DIRECTION_BOTH
		if hidden:
			pin.modulate = Color(1, 1, 1, 0.85)
		_map.add_child(pin)


func _go(location_name: String) -> void:
	var loc := Data.park_location(location_name)
	if loc.is_empty():
		return
	if loc["status"] == "hidden" and not (location_name == "Whisper Grove" and Save.data["whisperGroveDiscovered"]):
		set_message("Whisper Grove is hidden. Explore the old tree after helping the puppy.")
		return
	Save.apply(GameLogic.visit_location(Save.data, location_name))
	set_message("You arrived at %s. %s" % [location_name, loc["gameplayNote"]])
	_render()


## Shows the Wild Camper celebration (and then the ranger quiz) the first time the camper unlocks.
func _after_change() -> void:
	var unlocked: bool = Save.data["wildCamperUnlocked"]
	if not _prev_unlocked and unlocked:
		Overlays.celebration(self, func():
			if not Save.data["achievements"].has("tutorial-park-ranger"):
				Overlays.biome_quiz(self, func(): Save.apply(GameLogic.unlock_achievement(Save.data, "tutorial-park-ranger"))))
	_prev_unlocked = unlocked
	_render()


func open_camera() -> void:
	var m := UI.modal(self, "Camera")
	var panel := CameraPanel.new()
	m["body"].add_child(panel)
	panel.setup(animals_here(), m["overlay"])
	panel.photographed.connect(func(id: String, great: bool):
		handle_photo(id, great, func(s, a): return GameLogic.photograph_in_park(s, a))
		panel.refresh()
		_after_change())


func open_quest() -> void:
	var m := UI.modal(self, "Lost Puppy Quest")
	_quest_body(m)


func _quest_body(m: Dictionary) -> void:
	var body: VBoxContainer = m["body"]
	for c in body.get_children():
		c.queue_free()
	var save: Dictionary = Save.data
	var q: Dictionary = save["questProgress"]["lostPuppy"]
	var here: String = save["currentLocation"]
	body.add_child(UI.eyebrow("Quest"))
	body.add_child(UI.heading(Data.quest["name"], 38))
	body.add_child(UI.label(Data.quest["description"], 26))
	body.add_child(UI.label("Hint: %s" % GameLogic.quest_hint(save), 26, UI.TEXT, true))
	var steps := [["Talk to owner", q["started"]], ["Find pawprints", q["foundPawprints"]], ["Find chew toy", q["foundToy"]], ["Find puppy", q["foundPuppy"]], ["Reunite puppy", q["completed"]]]
	for st in steps:
		body.add_child(UI.label("%s %s" % ["✅" if st[1] else "⬜", st[0]], 28))
	var apply := func(next: Dictionary, msg: String):
		Save.apply(next)
		set_message(msg)
		_after_change()
		_quest_body(m)
	if not q["started"] and here == "Park Entrance":
		body.add_child(UI.button("Talk to Owner", "primary", func(): apply.call(GameLogic.start_quest(Save.data), "The owner says the puppy wandered off calmly. Look for pawprints in Open Meadow.")))
	if q["started"] and not q["foundPawprints"] and here == "Open Meadow":
		body.add_child(UI.button("Look at Pawprints", "primary", func(): apply.call(GameLogic.find_pawprints(Save.data), "You found gentle pawprints in the grass. They lead toward Forest Trail.")))
	if q["foundPawprints"] and not q["foundToy"] and here == "Forest Trail":
		body.add_child(UI.button("Pick Up Chew Toy", "primary", func(): apply.call(GameLogic.find_chew_toy(Save.data), "You found a small chew toy near the trail. The puppy must be close.")))
	if q["foundToy"] and not q["foundPuppy"] and here == "Forest Trail":
		body.add_child(UI.button("Find Puppy", "primary", func(): apply.call(GameLogic.find_puppy(Save.data), "You found the puppy sitting calmly near the trail. Return to Park Entrance.")))
	if q["foundPuppy"] and not q["completed"] and here == "Park Entrance":
		body.add_child(UI.button("Reunite Puppy", "primary", func():
			var prev: Array = Save.data["collectedPhotoVariants"]
			var updated := GameLogic.complete_quest(Save.data)
			apply.call(updated, "The puppy is reunited with the owner. Lost Puppy quest complete!")
			for key in updated["collectedPhotoVariants"]:
				if not prev.has(key):
					Overlays.photo_reveal(self, Data.animal("lost-puppy"), key, updated["collectedPhotoVariants"], false, "", false)))
	if q["completed"]:
		body.add_child(UI.label("✅ Completed - puppy helped and reunited.", 28, Color("#2a7a45"), true))


func open_clue() -> void:
	var clue := GameLogic.location_clue(Save.data)
	var m := UI.modal(self, "Nearby Clue")
	m["body"].add_child(UI.eyebrow("Nearby clue"))
	m["body"].add_child(UI.label(clue if clue != "" else "Nothing unusual here right now.", 28))


func open_discover() -> void:
	var m := UI.modal(self, "Special Discoveries")
	_discover_body(m)


func _discover_body(m: Dictionary) -> void:
	var body: VBoxContainer = m["body"]
	for c in body.get_children():
		c.queue_free()
	var save: Dictionary = Save.data
	var at_tree: bool = save["currentLocation"] == "Strange Old Tree"
	var can_grove: bool = at_tree and save["questProgress"]["lostPuppy"]["completed"] and not save["whisperGroveDiscovered"]
	if at_tree and not save["rareOwlSpotted"]:
		body.add_child(UI.button("Look Carefully for the Rare Owl", "primary", func():
			Save.apply(GameLogic.spot_rare_owl(Save.data))
			set_message("You quietly spotted the Rare Owl perched in the Strange Old Tree. Try taking a photo.")
			_after_change()
			_discover_body(m)))
	if at_tree and save["rareOwlSpotted"]:
		body.add_child(UI.label("🦉 Rare Owl spotted. Use the camera to photograph it.", 28, Color("#2a7a45"), true))
	if at_tree and not save["questProgress"]["lostPuppy"]["completed"]:
		body.add_child(UI.muted("Whisper Grove clue: helping the puppy first may reveal a quieter path."))
	if can_grove:
		body.add_child(UI.button("Follow the Quiet Path to Whisper Grove", "primary", func():
			Save.apply(GameLogic.discover_whisper_grove(Save.data))
			set_message("You found Whisper Grove - a peaceful hidden nature place behind the old tree.")
			_after_change()
			_discover_body(m)))
	if save["whisperGroveDiscovered"]:
		body.add_child(UI.label("🌺 Whisper Grove discovered.", 28, Color("#2a7a45"), true))
	if save["wildCamperUnlocked"]:
		body.add_child(UI.label("🚐 You unlocked the Wild Camper!", 28, UI.ORANGE, true))
	if not at_tree and not save["wildCamperUnlocked"]:
		body.add_child(UI.muted("Visit the Strange Old Tree to look for something special."))


func open_progress() -> void:
	var m := UI.modal(self, "Tutorial Progress")
	for item in GameLogic.tutorial_items(Save.data):
		m["body"].add_child(UI.label("%s %s" % ["✅" if item["done"] else "🔒" if item["locked"] else "⬜", item["label"]], 28))


func open_about() -> void:
	var m := UI.modal(self, "Explore the park", "Wildlife photography")
	var tex := Data.load_asset("tutorial-park/park-direction.png", 900)
	if tex:
		var pic := UI.photo(tex, Vector2(0, 340))
		pic.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
		m["body"].add_child(pic)
	m["body"].add_child(UI.label("Visit each location and photograph wildlife calmly. Finish Tutorial Park by helping the puppy, photographing Rare Owl, and discovering Whisper Grove.", 28))
