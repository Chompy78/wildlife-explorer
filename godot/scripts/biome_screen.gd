class_name BiomeScreen
extends Screen
## The shared play screen for every data-driven biome (Lake ... Alien Planet): same camera -> photo reveal ->
## optional quiz flow as the Park and Forest over a config-supplied set of sections.

var biome_id := ""
var biome: Dictionary


func _ready() -> void:
	biome = Data.biome(biome_id)
	build(biome_id, biome["eyebrow"], biome["screenTitle"], [
		SoundToggle.new(),
		UI.button("Return to Wild Camper", "primary", func(): main.return_to_camper()),
		UI.button("Home", "secondary", func(): main.go_home()),
	])
	set_message(biome["arrivalMessage"])
	add_dock_button("camera", "📷", "Camera", open_camera)
	add_dock_button("journal", "📖", "Journal", func(): Overlays.journal(self))
	add_dock_button("about", "ℹ️", "About", open_about)
	_render()


func current_location() -> Dictionary:
	var saved: String = Save.data[biome["saveKey"]]
	for loc in biome["locations"]:
		if loc["name"] == saved:
			return loc
	return biome["locations"][0]


func animals_here() -> Array:
	var out: Array = []
	for id in current_location()["animalIds"]:
		out.append(Data.animal(id))
	return out


func _render() -> void:
	for c in content.get_children():
		c.queue_free()
	var here := current_location()
	var strip := UI.card(Color(1, 1, 1, 0.9), 24, 20)
	strip.add_child(UI.label("%s  %s Observe from a respectful distance and take photos without disturbing wildlife." % [here["name"], here["description"]], 26))
	content.add_child(strip)
	for loc in biome["locations"]:
		var active: bool = loc["name"] == here["name"]
		content.add_child(UI.rich_button(loc["name"], loc["description"], "active" if active else "card", func(): _go(loc["name"]), loc["icon"]))
	set_dock_badge("camera", animals_here().size())


func _go(location_name: String) -> void:
	Save.apply(GameLogic.move_in_biome(Save.data, biome_id, location_name))
	for loc in biome["locations"]:
		if loc["name"] == location_name:
			set_message("You arrived at %s. %s" % [loc["name"], loc["description"]])
	_render()


func open_camera() -> void:
	var m := UI.modal(self, "Camera")
	var panel := CameraPanel.new()
	m["body"].add_child(panel)
	panel.setup(animals_here(), m["overlay"])
	panel.photographed.connect(func(id: String, great: bool):
		handle_photo(id, great, func(s, a): return GameLogic.photograph_in_biome(s, biome_id, a))
		panel.refresh())


func open_about() -> void:
	var m := UI.modal(self, biome["aboutTitle"], biome["name"])
	m["body"].add_child(UI.label(biome["aboutText"], 28))
