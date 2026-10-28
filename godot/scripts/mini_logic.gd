class_name MiniLogic
extends RefCounted
## Mini game rounds (port of src/data/miniGames.ts). No timers, no losing, nothing saved.

const MOODS := ["day", "dusk", "night"]
const MOOD_LABELS := {"day": "☀️ Day", "dusk": "🌅 Dusk", "night": "🌙 Night"}
const MOOD_PATTERNS := {"day": "day|morning|afternoon", "dusk": "evening|dusk", "night": "night"}


static func game_animals() -> Array:
	return Data.animals.filter(func(a): return a["rarity"] != "quest")


static func shuffled(items: Array) -> Array:
	var out := items.duplicate()
	out.shuffle()
	return out


## Animals for one round never share an emoji (two different turtles would look identical on a card).
static func pick_animals(count: int) -> Array:
	var seen := {}
	var picked: Array = []
	for a in shuffled(game_animals()):
		if seen.has(a["emoji"]):
			continue
		seen[a["emoji"]] = true
		picked.append(a)
		if picked.size() == count:
			break
	return picked


static func memory_deck(pairs: int) -> Array:
	var cards: Array = []
	for a in pick_animals(pairs):
		for copy in 2:
			cards.append({"key": "%s-%d" % [a["id"], copy], "animal_id": a["id"], "emoji": a["emoji"], "name": a["name"]})
	return shuffled(cards)


## Hides the animal's name (and its last word, e.g. "Heron") in its fun fact.
static func mask_name(text: String, animal_name: String) -> String:
	var words := animal_name.split(" ")
	var forms: Array = [animal_name]
	if words[words.size() - 1] != animal_name:
		forms.append(words[words.size() - 1])
	var out := text
	for form in forms:
		if form.length() <= 2:
			continue
		var re := RegEx.new()
		re.compile("(?i)" + _escape(form) + "(es|s)?")
		out = re.sub(out, "???", true)
	return out


static func _escape(s: String) -> String:
	var re := RegEx.new()
	re.compile("[.*+?^${}()|\\[\\]\\\\]")
	return re.sub(s, "\\$0", true)


static func _with_distractors(correct, others: Array, count: int) -> Array:
	var unique: Array = []
	for o in others:
		if o != correct and not unique.has(o):
			unique.append(o)
	var picks := shuffled(unique).slice(0, count - 1)
	picks.append(correct)
	return shuffled(picks)


static func who_am_i_round() -> Dictionary:
	var picked := pick_animals(4)
	var animal: Dictionary = picked[0]
	var names: Array = []
	for i in range(1, picked.size()):
		names.append(picked[i]["name"])
	return {"animal": animal, "prompt": mask_name(animal["funFact"], animal["name"]), "answer": animal["name"], "choices": _with_distractors(animal["name"], names, 4)}


static func habitat_round() -> Dictionary:
	var candidates := game_animals()
	var animal: Dictionary = candidates[randi() % candidates.size()]
	var habitats: Array = candidates.map(func(a): return a["habitat"])
	return {"animal": animal, "prompt": "Where does the %s live?" % animal["name"], "answer": animal["habitat"], "choices": _with_distractors(animal["habitat"], habitats, 3)}


static func find_round(tile_count: int) -> Dictionary:
	var two := pick_animals(2)
	var tiles: Array = [two[0]]
	for i in tile_count - 1:
		tiles.append(two[1])
	return {"target": two[0], "tiles": shuffled(tiles)}


static func count_round() -> Dictionary:
	var two := pick_animals(2)
	var answer := 2 + randi() % 5
	var tiles: Array = []
	for i in answer:
		tiles.append(two[0])
	for i in 12 - answer:
		tiles.append(two[1])
	var choices: Array = []
	for n in [answer, answer - 1, answer + 1, answer + 2]:
		if n >= 1 and not choices.has(n):
			choices.append(n)
	choices.sort()
	return {"target": two[0], "tiles": shuffled(tiles), "answer": answer, "choices": choices.slice(0, 4)}


static func is_active_at(animal: Dictionary, mood: String) -> bool:
	var re := RegEx.new()
	re.compile("(?i)" + MOOD_PATTERNS[mood])
	return re.search(animal["activeTime"]) != null


## The one mood an animal is clearly active in, or "" if it matches none or several.
static func clear_time_of_day(animal: Dictionary) -> String:
	var matches: Array = MOODS.filter(func(m): return is_active_at(animal, m))
	return matches[0] if matches.size() == 1 else ""


static func time_round() -> Dictionary:
	var candidates := game_animals().filter(func(a): return clear_time_of_day(a) != "")
	var animal: Dictionary = candidates[randi() % candidates.size()]
	var choices: Array = MOODS.map(func(m): return MOOD_LABELS[m])
	return {"animal": animal, "prompt": "When is the %s most active?" % animal["name"], "answer": MOOD_LABELS[clear_time_of_day(animal)], "choices": choices}


static func extend_pattern(sequence: Array, pad_size: int) -> Array:
	var out := sequence.duplicate()
	out.append(randi() % pad_size)
	return out
