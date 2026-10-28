class_name CamperScreen
extends Screen

const STATIONS := {
	"route-map": ["Route Map", "🗺️", "The route map shows every habitat you can visit. Pin one in the Journey Planner, then travel there."],
	"field-desk": ["Field Desk", "📝", "The field desk holds gentle expedition notes and space for future wildlife research."],
	"gear-rack": ["Gear Rack", "🎒", "The gear rack stores a camera bag, notebook, water bottle, and safe observation equipment."],
	"photo-wall": ["Photo Wall", "🖼️", "The photo wall celebrates discoveries without collecting or removing wildlife from habitats."],
}
var station := "route-map"


func _ready() -> void:
	build("camper", "Milestone 4.1 Hub", "Wild Camper", [
		UI.button("Return to Tutorial Park", "secondary", func(): main.open_park()),
		UI.button("Home", "secondary", func(): main.go_home()),
	])
	set_message("Route Map selected.")
	add_dock_button("journey", "🗺️", "Journey Planner", open_planner)
	add_dock_button("journal", "📖", "Journal", func(): Overlays.journal(self))
	add_dock_button("about", "ℹ️", "About", func():
		var m := UI.modal(self, "Your mobile base", "Wild Camper")
		m["body"].add_child(UI.label("The Wild Camper is where you plan journeys. Pin a destination, then travel there.", 28)))
	_render()
	if not Save.data["camperIntroductionSeen"]:
		var m := UI.modal(self, "Welcome to the Wild Camper", "Your new mobile base", func(): Save.apply(GameLogic.acknowledge_camper_intro(Save.data)))
		m["body"].add_child(UI.label("🚐", 90))
		m["body"].add_child(UI.label("Inspect the stations, review Tutorial Park discoveries, and pin a destination to the route map. Then travel there from the Journey Planner.", 28))
		m["body"].add_child(UI.button("Got it", "primary", m["close"]))


func _render() -> void:
	for c in content.get_children():
		c.queue_free()
	var strip := UI.card(Color(1, 1, 1, 0.9), 24, 20)
	strip.add_child(UI.label("%s  %s" % [STATIONS[station][0], STATIONS[station][2]], 26))
	content.add_child(strip)
	var grid := GridContainer.new()
	grid.columns = 2
	grid.add_theme_constant_override("h_separation", 14)
	grid.add_theme_constant_override("v_separation", 14)
	content.add_child(grid)
	for id in STATIONS:
		var b := UI.button("%s\n%s" % [STATIONS[id][1], STATIONS[id][0]], "active" if id == station else "card", func():
			station = id
			set_message("%s selected." % STATIONS[id][0])
			_render())
		b.custom_minimum_size = Vector2(0, 150)
		b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		b.alignment = HORIZONTAL_ALIGNMENT_CENTER
		grid.add_child(b)
	if station == "photo-wall":
		content.add_child(_photo_wall())
	var sel: Dictionary = Data.destination(str(Save.data["selectedDestination"]))
	set_dock_badge("journey", 1 if not sel.is_empty() else 0)


func _photo_wall() -> Control:
	var save: Dictionary = Save.data
	var card := UI.card(Color("#fffdf2"), 24, 20)
	var col := UI.vbox(6)
	card.add_child(col)
	col.add_child(UI.label("Discovery Summary", 30, UI.TEXT, true))
	var photographed: Array = Data.animals.filter(func(a): return save["photographedAnimals"].has(a["id"]))
	var common := photographed.filter(func(a): return Data.common_milestone_ids.has(a["id"])).size()
	var non_native := Data.animals.filter(func(a): return a.has("nonNative")).size()
	var lines := [
		"%d of %d common animals photographed" % [common, Data.common_milestone_ids.size()],
		"Rare Owl: %s" % ("photographed" if save["photographedAnimals"].has("rare-owl") else "not photographed"),
		"Non-native sightings reported: %d of %d" % [save["reportedInvasiveSpecies"].size(), non_native],
		"Photos collected: %d of %d" % [save["collectedPhotoVariants"].size(), Data.all_photo_keys().size()],
		"Lost Puppy: %s" % ("helped and reunited" if save["questProgress"]["lostPuppy"]["completed"] else "not completed"),
		"Whisper Grove: %s" % ("discovered" if save["whisperGroveDiscovered"] else "hidden"),
	]
	for l in lines:
		col.add_child(UI.label("• " + l, 24))
	if photographed.is_empty():
		col.add_child(UI.muted("Photographed animals will appear here."))
	else:
		var chips := UI.flow(8)
		for a in photographed:
			chips.add_child(UI.label("%s %s" % [a["emoji"], a["name"]], 22, UI.MUTED))
		col.add_child(chips)
	return card


func open_planner() -> void:
	var m := UI.modal(self, "Destinations", "Journey planner")
	var body: VBoxContainer = m["body"]
	body.add_child(UI.muted("Pin a destination to the route map, then travel there. Every destination is ready to visit."))
	var detail := UI.vbox(10)
	body.add_child(detail)
	var render_detail: Callable
	render_detail = func():
		for c in detail.get_children():
			c.queue_free()
		var sel: Dictionary = Data.destination(str(Save.data["selectedDestination"]))
		if sel.is_empty():
			detail.add_child(UI.label("No destination pinned yet. Choose one above to plan your next wildlife journey.", 26))
			return
		detail.add_child(UI.label("%s  %s pinned to route map" % [sel["icon"], sel["name"]], 30, UI.TEXT, true))
		detail.add_child(UI.label(sel["preview"], 26))
		if sel["id"] == "forest":
			detail.add_child(UI.button("Travel to Forest", "primary", func():
				m["close"].call()
				main.open_forest()))
		elif Data.is_biome(sel["id"]):
			detail.add_child(UI.button("Travel to %s" % sel["name"], "primary", func():
				m["close"].call()
				main.open_biome(sel["id"])))
		detail.add_child(UI.button("Clear pinned destination", "secondary", func():
			Save.apply(GameLogic.clear_destination(Save.data))
			set_message("Pinned destination cleared.")
			render_detail.call()
			_render()))
	for d in Data.destinations:
		var pinned: bool = Save.data["selectedDestination"] == d["id"]
		body.add_child(UI.rich_button(d["name"], "%s\n%s" % [d["tagline"], "✓ Selected - Ready to visit" if pinned else "Ready to visit"], "active" if pinned else "card", func():
			Save.apply(GameLogic.select_destination(Save.data, d["id"]))
			set_message("%s pinned to the route map." % d["name"])
			m["close"].call()
			open_planner()
			_render(), d["icon"]))
	render_detail.call()
