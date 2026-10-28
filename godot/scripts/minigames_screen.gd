class_name MiniGamesScreen
extends Screen
## Seven calm mini games. No timers, no losing, no rewards, and they never touch the save.

const GAMES := [
	["memory", "🃏", "Memory Match", "Flip the cards and find every matching pair of animals."],
	["who", "🔍", "Who Am I?", "Read the clue and guess which animal it is."],
	["find", "👀", "Spot the Animal", "One animal is different. Can you spot it in the group?"],
	["habitat", "🗺️", "Where Do I Live?", "Pick the place each animal calls home."],
	["pattern", "🎶", "Pattern Parade", "Watch the animals light up, then repeat the pattern."],
	["count", "🔢", "Count Them Up", "How many of one animal are hiding in the crowd?"],
	["time", "🌗", "Day or Night?", "Pick when each animal is most active."],
]

var _all_games_button: Button
var _game_token := 0  # bumps whenever a game closes, so pending timers know to stop


func _ready() -> void:
	_all_games_button = UI.button("All games", "secondary", func(): _menu())
	build("minigames", "Just for fun", "Mini Games", [SoundToggle.new(), _all_games_button, UI.button("Home", "secondary", func(): main.go_home())])
	_menu()


func _clear() -> void:
	_game_token += 1
	for c in content.get_children():
		c.queue_free()


func _menu() -> void:
	_clear()
	_all_games_button.visible = false
	set_message("Pick a game. There is no timer and nothing to lose.")
	for g in GAMES:
		content.add_child(UI.rich_button(g[2], g[3], "primary", func(): _open(g[0]), g[1]))


func _open(id: String) -> void:
	_clear()
	_all_games_button.visible = true
	match id:
		"memory": _memory()
		"who": _choice("Who Am I?", MiniLogic.who_am_i_round, false)
		"habitat": _choice("Where Do I Live?", MiniLogic.habitat_round, true)
		"time": _choice("Day or Night?", MiniLogic.time_round, true)
		"find": _find()
		"count": _count()
		"pattern": _pattern()


func _panel(title: String) -> VBoxContainer:
	var card := UI.card(Color(1, 1, 1, 0.78), 28, 24)
	var col := UI.vbox(14)
	card.add_child(col)
	col.add_child(UI.heading(title, 42))
	content.add_child(card)
	return col


# --- Memory Match ----------------------------------------------------------------------------------------------

func _memory() -> void:
	var col := _panel("Memory Match")
	var deck := MiniLogic.memory_deck(6)
	var open: Array = []
	var matched: Array = []
	var st := {"moves": 0, "busy": false}
	var info := UI.muted("")
	col.add_child(info)
	var grid := GridContainer.new()
	grid.columns = 4
	grid.add_theme_constant_override("h_separation", 12)
	grid.add_theme_constant_override("v_separation", 12)
	col.add_child(grid)
	var status := UI.label("", 28, UI.TEXT, true)
	col.add_child(status)
	var buttons := {}
	var refresh := func():
		info.text = "Pairs found: %d / 6 · Tries: %d" % [matched.size(), st["moves"]]
		for card in deck:
			var b: Button = buttons[card["key"]]
			var up: bool = open.has(card["key"]) or matched.has(card["animal_id"])
			b.text = card["emoji"] if up else "❓"
			b.disabled = matched.has(card["animal_id"])
			b.add_theme_font_size_override("font_size", 52)
		if matched.size() == 6:
			status.text = "🎉 You found every pair in %d tries!" % st["moves"]
	for card in deck:
		var b := UI.button("❓", "card")
		b.custom_minimum_size = Vector2(150, 150)
		b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		b.alignment = HORIZONTAL_ALIGNMENT_CENTER
		b.pressed.connect(func():
			if st["busy"] or open.has(card["key"]) or matched.has(card["animal_id"]):
				return
			Sfx.shutter()
			open.append(card["key"])
			if open.size() == 2:
				st["moves"] += 1
				var a: Dictionary = deck.filter(func(c): return c["key"] == open[0])[0]
				var c2: Dictionary = deck.filter(func(c): return c["key"] == open[1])[0]
				if a["animal_id"] == c2["animal_id"]:
					Sfx.new_photo()
					matched.append(a["animal_id"])
					open.clear()
				else:
					st["busy"] = true
					var token := _game_token
					await get_tree().create_timer(0.8).timeout
					if token != _game_token:
						return
					open.clear()
					st["busy"] = false
			refresh.call())
		buttons[card["key"]] = b
		grid.add_child(b)
	col.add_child(UI.button("New cards", "secondary", func(): _open("memory")))
	refresh.call()


# --- multiple choice (Who Am I?, Where Do I Live?, Day or Night?) -----------------------------------------------------

func _choice(title: String, build_round: Callable, show_emoji: bool) -> void:
	var col := _panel(title)
	var score := {"right": 0}
	var holder := UI.vbox(12)
	col.add_child(holder)
	var show: Callable
	show = func():
		for c in holder.get_children():
			c.queue_free()
		var round: Dictionary = build_round.call()
		holder.add_child(UI.muted("Correct: %d" % score["right"]))
		var prompt: String = round["prompt"]
		if show_emoji:
			prompt = "%s  %s" % [round["animal"]["emoji"], prompt]
		holder.add_child(UI.label(prompt, 32))
		var feedback := UI.label("", 28, UI.TEXT, true)
		var state := {"solved": false}
		for choice in round["choices"]:
			var b := UI.button(str(choice), "card")
			b.pressed.connect(func():
				if state["solved"]:
					return
				if choice == round["answer"]:
					state["solved"] = true
					score["right"] += 1
					Sfx.correct()
					for s in ["normal", "hover", "pressed"]:
						b.add_theme_stylebox_override(s, UI.box(Color("#c8eed2"), 24, Color("#2a7a45"), 3))
					feedback.text = "✅ Yes! It's the %s. %s" % [round["answer"], round["animal"]["emoji"]]
					holder.add_child(UI.button("Next", "primary", show))
				else:
					for s in ["normal", "hover", "pressed"]:
						b.add_theme_stylebox_override(s, UI.box(Color("#fde9c4"), 24, Color("#d9a23a"), 3))
					feedback.text = "Not quite - try another one!")
			holder.add_child(b)
		holder.add_child(feedback)
	show.call()


# --- Spot the Animal ---------------------------------------------------------------------------------------------------

func _find() -> void:
	var col := _panel("Spot the Animal")
	var holder := UI.vbox(12)
	col.add_child(holder)
	var score := {"n": 0}
	var show: Callable
	show = func():
		for c in holder.get_children():
			c.queue_free()
		var round := MiniLogic.find_round(12)
		holder.add_child(UI.muted("Found: %d" % score["n"]))
		holder.add_child(UI.label("One of these is a different animal. Which is it?", 30))
		var grid := GridContainer.new()
		grid.columns = 4
		grid.add_theme_constant_override("h_separation", 10)
		grid.add_theme_constant_override("v_separation", 10)
		holder.add_child(grid)
		var feedback := UI.label("", 28, UI.TEXT, true)
		var state := {"found": false}
		for animal in round["tiles"]:
			var b := UI.button(animal["emoji"], "card")
			b.custom_minimum_size = Vector2(0, 120)
			b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			b.alignment = HORIZONTAL_ALIGNMENT_CENTER
			b.add_theme_font_size_override("font_size", 52)
			b.pressed.connect(func():
				if state["found"]:
					return
				if animal["id"] == round["target"]["id"]:
					state["found"] = true
					score["n"] += 1
					Sfx.correct()
					feedback.text = "✅ Found it - the %s!" % animal["name"]
					holder.add_child(UI.button("Next", "primary", show))
				else:
					feedback.text = "Not that one - look closer!")
			grid.add_child(b)
		holder.add_child(feedback)
	show.call()


# --- Count Them Up -------------------------------------------------------------------------------------------------------

func _count() -> void:
	var col := _panel("Count Them Up")
	var holder := UI.vbox(12)
	col.add_child(holder)
	var score := {"n": 0}
	var show: Callable
	show = func():
		for c in holder.get_children():
			c.queue_free()
		var round := MiniLogic.count_round()
		holder.add_child(UI.muted("Correct: %d" % score["n"]))
		holder.add_child(UI.label("How many %s %s can you see?" % [round["target"]["name"], round["target"]["emoji"]], 32))
		var grid := GridContainer.new()
		grid.columns = 4
		holder.add_child(grid)
		for animal in round["tiles"]:
			var l := UI.label(animal["emoji"], 52)
			l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
			l.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			grid.add_child(l)
		var feedback := UI.label("", 28, UI.TEXT, true)
		var state := {"solved": false}
		var row := UI.flow(12)
		for n in round["choices"]:
			var b := UI.button(str(n), "card")
			b.custom_minimum_size = Vector2(150, 80)
			b.pressed.connect(func():
				if state["solved"]:
					return
				if n == round["answer"]:
					state["solved"] = true
					score["n"] += 1
					Sfx.correct()
					feedback.text = "✅ Yes, %d!" % n
					holder.add_child(UI.button("Next", "primary", show))
				else:
					feedback.text = "Not quite - count again!")
			row.add_child(b)
		holder.add_child(row)
		holder.add_child(feedback)
	show.call()


# --- Pattern Parade --------------------------------------------------------------------------------------------------------

func _pattern() -> void:
	var col := _panel("Pattern Parade")
	var pad := MiniLogic.pick_animals(4)
	var st := {"seq": MiniLogic.extend_pattern([], 4), "progress": 0, "playing": false}
	var info := UI.muted("")
	col.add_child(info)
	var grid := GridContainer.new()
	grid.columns = 2
	grid.add_theme_constant_override("h_separation", 14)
	grid.add_theme_constant_override("v_separation", 14)
	col.add_child(grid)
	var status := UI.label("Watch the animals...", 28, UI.TEXT, true)
	col.add_child(status)
	var buttons: Array[Button] = []
	for i in pad.size():
		var b := UI.button(pad[i]["emoji"], "card")
		b.custom_minimum_size = Vector2(0, 170)
		b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		b.alignment = HORIZONTAL_ALIGNMENT_CENTER
		b.add_theme_font_size_override("font_size", 72)
		b.disabled = true
		buttons.append(b)
		grid.add_child(b)
	var light := func(i: int, on: bool):
		for s in ["normal", "disabled"]:
			buttons[i].add_theme_stylebox_override(s, UI.box(Color("#fff3c2") if on else Color("#f8fff3"), 24, Color("#f1b83b") if on else Color(0.18, 0.49, 0.29, 0.18), 6 if on else 2))
	var watch: Callable
	watch = func():
		var token := _game_token
		st["playing"] = false
		for b in buttons:
			b.disabled = true
		info.text = "Pattern length: %d" % st["seq"].size()
		await get_tree().create_timer(0.6).timeout
		for i in st["seq"]:
			if token != _game_token:
				return
			light.call(i, true)
			Sfx.shutter()
			await get_tree().create_timer(0.45).timeout
			if token != _game_token:
				return
			light.call(i, false)
			await get_tree().create_timer(0.25).timeout
		if token != _game_token:
			return
		st["playing"] = true
		st["progress"] = 0
		status.text = "Your turn - repeat the pattern!"
		for b in buttons:
			b.disabled = false
	for i in buttons.size():
		buttons[i].pressed.connect(func():
			if not st["playing"]:
				return
			Sfx.shutter()
			if st["seq"][st["progress"]] != i:
				status.text = "Let's watch it once more."
				watch.call()
				return
			if st["progress"] + 1 == st["seq"].size():
				Sfx.new_photo()
				if st["seq"].size() >= 8:
					status.text = "🎉 You remembered the whole parade!"
					st["seq"] = MiniLogic.extend_pattern([], 4)
				else:
					status.text = "✅ Got it! Now %d in a row." % (st["seq"].size() + 1)
					st["seq"] = MiniLogic.extend_pattern(st["seq"], 4)
				watch.call()
			else:
				st["progress"] += 1)
	watch.call()
