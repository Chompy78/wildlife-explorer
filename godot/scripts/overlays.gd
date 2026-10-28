class_name Overlays
extends RefCounted
## Modal overlays shared by the play screens: photo reveal, quizzes, Journal, Photo Album, celebration.


# --- photo reveal --------------------------------------------------------------------------------------------

static func photo_reveal(host: Control, animal: Dictionary, key: String, collected: Array, great: bool, bonus_fact: String, is_new_fact: bool) -> void:
	var m := UI.modal(host, animal["name"], "New photo!")
	var body: VBoxContainer = m["body"]
	var tex := Data.load_photo(key)
	var show_quality: bool = animal["id"] != "lost-puppy"
	if tex:
		var shown := tex
		var frame := PanelContainer.new()
		var sb := StyleBoxFlat.new()
		sb.set_corner_radius_all(30)
		sb.bg_color = Color.WHITE
		frame.add_theme_stylebox_override("panel", sb)
		frame.clip_children = CanvasItem.CLIP_CHILDREN_AND_DRAW
		var pic := UI.photo(shown, Vector2(0, 460))
		pic.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
		if not great and show_quality:
			var mat := ShaderMaterial.new()
			mat.shader = load("res://shaders/blur.gdshader")
			pic.material = mat
		frame.add_child(pic)
		body.add_child(frame)
	if great:
		body.add_child(UI.label("✨ Great shot!", 30, Color("#8a5a00"), true))
	if show_quality:
		body.add_child(UI.label("Crisp and sharp!" if great else "Keep practicing - aim for the glowing zone!", 26, UI.TEXT, true))
	var total := Data.photo_count(animal["id"])
	var have := Data.count_collected(animal["id"], collected)
	body.add_child(UI.label("%d of %d photos collected%s" % [have, total, " — collection complete!" if have >= total else "."], 26))
	body.add_child(UI.button("Continue Exploring", "primary", m["close"]))
	var fact := Data.fact_for_key(animal["id"], key)
	if fact != "":
		var fc := UI.card(Color("#eef7ff") if not is_new_fact else Color("#fff6d6"), 22, 18)
		var fcol := UI.vbox(6)
		fc.add_child(fcol)
		fcol.add_child(UI.eyebrow("Did you know?"))
		fcol.add_child(UI.label(fact, 26))
		if is_new_fact:
			fcol.add_child(UI.label("✨ This is new!", 22, Color("#8a5a00"), true))
		body.add_child(fc)
	if bonus_fact != "":
		var bc := UI.card(Color("#f2ecff"), 22, 18)
		var bcol := UI.vbox(6)
		bc.add_child(bcol)
		bcol.add_child(UI.eyebrow("🎓 Bonus fact!"))
		bcol.add_child(UI.label(bonus_fact, 26))
		body.add_child(bc)
	if not great:
		Sfx.new_photo()


# --- "where does it belong?" quiz (non-native animals) -----------------------------------------------------------

static func habitat_quiz(host: Control, animal: Dictionary) -> void:
	if not animal.has("nonNative"):
		return
	var info: Dictionary = animal["nonNative"]
	var m := UI.modal(host, animal["name"], "Where does it belong?")
	var body: VBoxContainer = m["body"]
	var correct := Data.destination(info["correctHabitatId"])
	body.add_child(UI.label("Great photo! But the %s doesn't naturally live here. Where do you think it actually belongs?" % animal["name"], 28))
	var grid := UI.vbox(12)
	body.add_child(grid)
	for d in Data.destinations:
		if not d["quizEligible"]:
			continue
		grid.add_child(UI.button("%s %s" % [d["icon"], d["name"]], "card", func():
			grid.queue_free()
			var ok: bool = d["id"] == info["correctHabitatId"]
			var text := ("Great work! %s naturally lives in the %s. " % [animal["name"], correct["name"]]) if ok \
				else ("Good try! %s actually comes from the %s, not the %s. " % [animal["name"], correct["name"], d["name"]])
			body.add_child(UI.label(text + info["impactNote"], 28))
			body.add_child(UI.button("Continue Exploring", "primary", m["close"]))))


# --- Tutorial Park ranger quiz ---------------------------------------------------------------------------------------

const PARK_QUIZ_ANIMALS := ["duck", "frog", "butterfly", "rabbit", "lizard", "park-bird", "rare-owl"]


static func _quiz_questions(save: Dictionary) -> Array:
	var candidates: Array = []
	for id in PARK_QUIZ_ANIMALS:
		var a := Data.animal(id)
		if a.is_empty():
			continue
		var learned := Data.learned_facts(id, save["collectedPhotoVariants"])
		candidates.append({"id": id, "name": a["name"], "fact": learned.pick_random() if learned.size() > 0 else a["funFact"]})
	candidates.shuffle()
	var out: Array = []
	for q in candidates.slice(0, mini(5, candidates.size())):
		var others: Array = candidates.filter(func(c): return c["id"] != q["id"])
		others.shuffle()
		var choices: Array = others.slice(0, 2).map(func(c): return c["name"])
		choices.append(q["name"])
		choices.shuffle()
		out.append({"name": q["name"], "fact": q["fact"], "choices": choices})
	return out


static func biome_quiz(host: Control, on_complete: Callable) -> void:
	var questions := _quiz_questions(Save.data)
	if questions.is_empty():
		on_complete.call()
		return
	var m := UI.modal(host, "Which animal is this about?", "Ranger Quiz")
	_quiz_show(m, questions, 0, on_complete)


static func _quiz_clear(body: VBoxContainer) -> void:
	for c in body.get_children():
		c.queue_free()


static func _quiz_show(m: Dictionary, questions: Array, i: int, on_complete: Callable) -> void:
	var body: VBoxContainer = m["body"]
	_quiz_clear(body)
	var q: Dictionary = questions[i]
	body.add_child(UI.eyebrow("Question %d of %d" % [i + 1, questions.size()]))
	body.add_child(UI.label("“%s”" % q["fact"], 28))
	for choice in q["choices"]:
		body.add_child(UI.button(choice, "card", func(): _quiz_answer(m, questions, i, choice, on_complete)))


static func _quiz_answer(m: Dictionary, questions: Array, i: int, choice: String, on_complete: Callable) -> void:
	var body: VBoxContainer = m["body"]
	_quiz_clear(body)
	var q: Dictionary = questions[i]
	var last: bool = i == questions.size() - 1
	var line := "That's right - it's the %s!" if choice == q["name"] else "Good try! That one is about the %s."
	body.add_child(UI.label(line % q["name"], 30))
	var next_text := "See my badge" if last else "Next question"
	body.add_child(UI.button(next_text, "primary", func(): _quiz_next(m, questions, i, on_complete)))


static func _quiz_next(m: Dictionary, questions: Array, i: int, on_complete: Callable) -> void:
	if i < questions.size() - 1:
		_quiz_show(m, questions, i + 1, on_complete)
		return
	var body: VBoxContainer = m["body"]
	_quiz_clear(body)
	body.add_child(UI.label("🎖️", 90))
	body.add_child(UI.eyebrow("Achievement unlocked"))
	body.add_child(UI.heading("Tutorial Park Ranger", 40))
	body.add_child(UI.label("You finished the Tutorial Park ranger quiz! Find your new badge anytime in the Journal.", 28))
	body.add_child(UI.button("Continue Exploring", "primary", m["close"]))
	on_complete.call()


static func celebration(host: Control, on_close: Callable) -> void:
	var m := UI.modal(host, "Tutorial Park complete!", "Wild Camper unlocked", on_close)
	var body: VBoxContainer = m["body"]
	body.add_child(UI.label("🚐", 100))
	body.add_child(UI.label("You helped the puppy, photographed the Rare Owl and found Whisper Grove. The Wild Camper is ready - visit it from the park, and plan your next wildlife journey.", 28))
	body.add_child(UI.button("Continue", "primary", m["close"]))
	Sfx.new_photo()


# --- Journal and Photo Album ---------------------------------------------------------------------------------------------

static func _is_discovered(animal: Dictionary, save: Dictionary) -> bool:
	var id: String = animal["id"]
	return save["photographedAnimals"].has(id) \
		or (id == "lost-puppy" and save["questProgress"]["lostPuppy"]["completed"]) \
		or (id == "rare-owl" and save["rareOwlSpotted"])


static func journal(host: Control) -> void:
	var m := UI.modal(host, "Collection Book", "Wildlife Journal")
	var body: VBoxContainer = m["body"]
	var show_biomes: Callable
	show_biomes = func():
		for c in body.get_children():
			c.queue_free()
		var save: Dictionary = Save.data
		body.add_child(UI.muted("Photos, discoveries, and animals helped during the adventure."))
		var entries: Array = [
			["🌳", "Tutorial Park", "Tutorial Park Animals", Data.park_animals()],
			["🌲", "Forest", "Forest Animals", Data.forest_animals()],
		]
		for b in Data.biomes:
			var ids := Data.biome_animal_ids(b)
			entries.append([b["journalIcon"], b["name"], b["journalTitle"], Data.animals.filter(func(a): return ids.has(a["id"]))])
		for e in entries:
			var list: Array = e[3]
			var found := list.filter(func(a): return _is_discovered(a, save)).size()
			body.add_child(UI.rich_button(e[1], "%d of %d discovered" % [found, list.size()], "card", func(): _journal_list(m, show_biomes, e[2], list), e[0]))
		body.add_child(UI.rich_button("Places & Rewards", "Whisper Grove, Wild Camper, achievements", "card", func(): _journal_rewards(m, show_biomes), "🏅"))
	show_biomes.call()


static func _journal_list(m: Dictionary, back: Callable, title: String, list: Array) -> void:
	var body: VBoxContainer = m["body"]
	for c in body.get_children():
		c.queue_free()
	body.add_child(UI.button("← Back to biomes", "secondary", back))
	body.add_child(UI.heading(title, 38))
	var save: Dictionary = Save.data
	for animal in list:
		body.add_child(_journal_entry(m["overlay"], animal, save))


static func _journal_entry(host: Control, animal: Dictionary, save: Dictionary) -> Control:
	var id: String = animal["id"]
	var photographed: bool = save["photographedAnimals"].has(id)
	var helped: bool = id == "lost-puppy" and save["questProgress"]["lostPuppy"]["completed"]
	var discovered := _is_discovered(animal, save)
	var card := UI.card(Color("#fbfff7") if discovered else Color("#edf0ec"), 24, 18)
	var row := UI.hbox(16)
	card.add_child(row)
	var icon: Control = UI.animal_icon(animal, save["collectedPhotoVariants"], 100) if discovered else UI.label("⬜" if animal["availableInMilestone"] else "🔒", 56)
	row.add_child(icon)
	var col := UI.vbox(6)
	row.add_child(col)
	col.add_child(UI.label(animal["name"] if discovered or animal["availableInMilestone"] else "%s - later" % animal["name"], 30, UI.TEXT, true))
	if helped:
		col.add_child(UI.label("Status: Helped and reunited with owner.", 24))
	if discovered and not helped:
		col.add_child(UI.label("Habitat: %s" % animal["habitat"], 24))
	if discovered:
		col.add_child(UI.label(animal["funFact"], 24))
	var total := Data.photo_count(id)
	if discovered and total > 0:
		col.add_child(UI.muted("%d of %d photos collected" % [Data.count_collected(id, save["collectedPhotoVariants"]), total]))
		var facts_eligible := GameLogic.unlocks_bonus_facts(save["selectedRole"], animal)
		var learned := Data.learned_facts(id, save["collectedPhotoVariants"], facts_eligible)
		col.add_child(UI.muted("💡 %d of %d facts learned" % [learned.size(), Data.total_fact_count(id, facts_eligible)]))
		for f in learned:
			col.add_child(UI.label("• " + f, 22))
		col.add_child(UI.button("Open photo album", "secondary", func(): album(host, animal)))
	if animal.has("nonNative") and photographed:
		col.add_child(UI.label("Logged for the park rangers: %s" % animal["nonNative"]["impactNote"], 22, Color("#8a5a00")))
	if not discovered:
		col.add_child(UI.muted("Not discovered yet."))
	return card


static func _journal_rewards(m: Dictionary, back: Callable) -> void:
	var body: VBoxContainer = m["body"]
	for c in body.get_children():
		c.queue_free()
	var save: Dictionary = Save.data
	body.add_child(UI.button("← Back to biomes", "secondary", back))
	body.add_child(UI.heading("Places and Rewards", 38))
	body.add_child(_special("🌺" if save["whisperGroveDiscovered"] else "🔒", "Whisper Grove", save["whisperGroveDiscovered"], \
		"Discovered - a peaceful hidden natural area." if save["whisperGroveDiscovered"] else "Hidden. Help animals and explore the Strange Old Tree area."))
	body.add_child(_special("🚐" if save["wildCamperUnlocked"] else "🔒", "Wild Camper", save["wildCamperUnlocked"], \
		"Unlocked - Tutorial Park complete!" if save["wildCamperUnlocked"] else "Locked. Complete Lost Puppy, photograph Rare Owl, and discover Whisper Grove."))
	body.add_child(UI.heading("Achievements", 34))
	for id in Data.achievements:
		var a: Dictionary = Data.achievements[id]
		var got: bool = save["achievements"].has(id)
		body.add_child(_special(a["icon"] if got else "🔒", a["name"], got, a["description"] if got else "Not earned yet."))


static func _special(icon: String, title: String, discovered: bool, text: String) -> Control:
	var card := UI.card(Color("#fbfff7") if discovered else Color("#edf0ec"), 24, 18)
	var row := UI.hbox(16)
	card.add_child(row)
	row.add_child(UI.label(icon, 56))
	var col := UI.vbox(4)
	row.add_child(col)
	col.add_child(UI.label(title, 30, UI.TEXT, true))
	col.add_child(UI.label(text, 24))
	return card


static func album(host: Control, animal: Dictionary) -> void:
	var save: Dictionary = Save.data
	var total := Data.photo_count(animal["id"])
	var m := UI.modal(host, animal["name"], "Photo Album")
	var body: VBoxContainer = m["body"]
	body.add_child(UI.muted("%d of %d photos collected" % [Data.count_collected(animal["id"], save["collectedPhotoVariants"]), total]))
	var grid := GridContainer.new()
	grid.columns = 2
	grid.add_theme_constant_override("h_separation", 14)
	grid.add_theme_constant_override("v_separation", 14)
	body.add_child(grid)
	for v in range(1, total + 1):
		var key := "%s-%d" % [animal["id"], v]
		var slot := PanelContainer.new()
		var sb := StyleBoxFlat.new()
		sb.set_corner_radius_all(22)
		sb.bg_color = Color("#e6efe3")
		slot.add_theme_stylebox_override("panel", sb)
		slot.clip_children = CanvasItem.CLIP_CHILDREN_AND_DRAW
		slot.custom_minimum_size = Vector2(280, 280)
		slot.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		if save["collectedPhotoVariants"].has(key):
			var pic := UI.photo(Data.load_photo(key), Vector2(280, 280))
			pic.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
			slot.add_child(pic)
		else:
			var lock := UI.label("🔒", 64)
			lock.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
			lock.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
			slot.add_child(lock)
		grid.add_child(slot)
	if GameLogic.bonus_photo_slot(save["selectedRole"]) and animal["id"] != "lost-puppy":
		body.add_child(UI.muted("🔒 Bonus photo — coming soon"))
