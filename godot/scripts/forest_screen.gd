class_name ForestScreen
extends Screen

const SECTIONS := [
	{"name": "Forest Arrival", "icon": "🌲", "text": "A quiet clearing beside the camper track."},
	{"name": "Fern Trail", "icon": "🌿", "text": "One short trail under shady leaves."},
]


func _ready() -> void:
	build("forest", "Milestone 5", "Forest Arrival", [
		SoundToggle.new(),
		UI.button("Return to Wild Camper", "primary", func(): main.return_to_camper()),
		UI.button("Home", "secondary", func(): main.go_home()),
	])
	set_message("You have arrived quietly at the forest edge.")
	add_dock_button("camera", "📷", "Camera", open_camera)
	add_dock_button("journal", "📖", "Journal", func(): Overlays.journal(self))
	add_dock_button("about", "ℹ️", "About", func():
		var m := UI.modal(self, "A quiet arrival", "Forest")
		m["body"].add_child(UI.label("Follow the Fern Trail and photograph what you find.", 28)))
	_render()


func animals_here() -> Array:
	var ids: Array = Data.forest_animal_ids if Save.data["forestLocation"] == "Fern Trail" else ["forest-wren"]
	return ids.map(func(id): return Data.animal(id))


func _render() -> void:
	for c in content.get_children():
		c.queue_free()
	var strip := UI.card(Color(1, 1, 1, 0.9), 24, 20)
	strip.add_child(UI.label("%s  Observe from a respectful distance and take photos without disturbing wildlife." % Save.data["forestLocation"], 26))
	content.add_child(strip)
	for sec in SECTIONS:
		var active: bool = Save.data["forestLocation"] == sec["name"]
		content.add_child(UI.rich_button(sec["name"], sec["text"], "active" if active else "card", func():
			Save.apply(GameLogic.move_in_forest(Save.data, sec["name"]))
			_render(), sec["icon"]))
	set_dock_badge("camera", animals_here().size())


func open_camera() -> void:
	var m := UI.modal(self, "Camera")
	var panel := CameraPanel.new()
	m["body"].add_child(panel)
	panel.setup(animals_here(), m["overlay"])
	panel.photographed.connect(func(id: String, great: bool):
		handle_photo(id, great, func(s, a): return GameLogic.photograph_in_forest(s, a))
		panel.refresh())
