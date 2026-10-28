extends Node
## Headless tests: godot4 --headless --path godot res://tests/tests.tscn  (see scripts/test-godot.sh)
## Mirrors the web game's state tests for the rules ported to GDScript.

var failures := 0
var checks := 0


func check(cond: bool, label: String) -> void:
	checks += 1
	if not cond:
		failures += 1
		print("  FAIL: ", label)


func _ready() -> void:
	check(Data.animals.size() >= 90, "data loaded: %d animals" % Data.animals.size())
	test_data()
	test_save_and_migration()
	test_photography()
	test_quest_flow()
	test_biomes()
	test_shot_rating()
	test_mini_games()
	print("%d checks, %d failed" % [checks, failures])
	get_tree().quit(1 if failures > 0 else 0)


func test_data() -> void:
	check(Data.biomes.size() == 13, "13 data-driven biomes")
	for b in Data.biomes:
		check(b["locations"].size() == 3, "%s has 3 sections" % b["id"])
		for loc in b["locations"]:
			check(loc["animalIds"].size() == 2, "%s/%s has 2 animals" % [b["id"], loc["name"]])
			for id in loc["animalIds"]:
				check(not Data.animal(id).is_empty(), "animal %s exists" % id)
	check(Data.photo_count("duck") == 5, "duck has 5 photos")
	check(Data.photo_count("sloth") == 0, "sloth has no art yet")
	check(Data.fact_for_key("duck", "duck-2") != "", "duck-2 has a fact")
	check(Data.load_photo("duck-1") != null, "duck-1 photo loads")
	check(Data.learned_facts("duck", ["duck-1", "duck-3"]).size() == 2, "two facts learned from two photos")


func test_save_and_migration() -> void:
	var d := GameLogic.default_save()
	check(d["schemaVersion"] == 15, "schema 15")
	check(d["lakeLocation"] == "Shoreline", "lake starts at Shoreline")
	check(d["alienPlanetLocation"] == "Crystal Meadow", "alien planet starts at Crystal Meadow")
	var m := GameLogic.migrate({})
	check(m["currentLocation"] == "Park Entrance", "empty save migrates")
	m = GameLogic.migrate({"rainforestLocation": "The Moon", "lakeLocation": "Open Water"})
	check(m["rainforestLocation"] == "Forest Floor", "garbage section rejected")
	check(m["lakeLocation"] == "Open Water", "valid section kept")
	m = GameLogic.migrate({"lastPlayArea": "desert", "wildCamperUnlocked": true})
	check(m["lastPlayArea"] == "desert", "play area restored once camper unlocked")
	m = GameLogic.migrate({"lastPlayArea": "desert", "wildCamperUnlocked": false})
	check(m["lastPlayArea"] == "park", "play area ignored while camper locked")
	m = GameLogic.migrate({"photographedAnimals": ["duck", "not-an-animal"], "collectedPhotoVariants": ["duck-1", "duck-99"]})
	check(m["photographedAnimals"] == ["duck"], "unknown animals dropped")
	check(m["collectedPhotoVariants"] == ["duck-1"], "unknown photo keys dropped")


func test_photography() -> void:
	var s := GameLogic.default_save()
	var after := GameLogic.photograph_in_park(s, "duck")
	check(after["photographedAnimals"].has("duck"), "duck photographed")
	check(after["collectedPhotoVariants"].size() == 1, "one variant collected")
	check(s["photographedAnimals"].is_empty(), "input save is not mutated")
	for i in 10:
		after = GameLogic.photograph_in_park(after, "duck")
	check(after["collectedPhotoVariants"].size() == 5, "never more than 5 distinct variants")
	check(after["photographCounts"]["duck"] == 11, "practice count keeps rising")
	check(GameLogic.photograph_in_park(s, "rare-owl")["photographedAnimals"].is_empty(), "owl needs spotting first")
	check(GameLogic.photograph_in_park(s, "lost-puppy")["photographedAnimals"].is_empty(), "quest animal is never photographed")
	var forest := GameLogic.photograph_in_forest(s, "cane-toad")
	check(forest["reportedInvasiveSpecies"].has("cane-toad"), "non-native sighting reported")
	check(GameLogic.photograph_in_forest(s, "duck")["photographedAnimals"].is_empty(), "forest ignores park animals")


func test_quest_flow() -> void:
	var s := GameLogic.default_save()
	check(GameLogic.find_pawprints(s) == s, "pawprints need the quest started")
	s = GameLogic.start_quest(s)
	s = GameLogic.find_pawprints(s)
	s = GameLogic.find_chew_toy(s)
	s = GameLogic.find_puppy(s)
	s = GameLogic.complete_quest(s)
	check(s["questProgress"]["lostPuppy"]["completed"], "quest completes in order")
	check(s["collectedPhotoVariants"].size() == 1, "reunion keepsake photo awarded")
	check(not s["wildCamperUnlocked"], "camper still locked")
	s["currentLocation"] = "Strange Old Tree"
	s = GameLogic.spot_rare_owl(s)
	s = GameLogic.discover_whisper_grove(s)
	s = GameLogic.photograph_in_park(s, "rare-owl")
	check(s["wildCamperUnlocked"], "tutorial complete unlocks the Wild Camper")
	check(GameLogic.is_tutorial_complete(s), "tutorial complete")


func test_biomes() -> void:
	var s := GameLogic.default_save()
	check(GameLogic.enter_biome(s, "desert") == s, "cannot enter a biome while camper locked")
	s["wildCamperUnlocked"] = true
	var e := GameLogic.enter_biome(s, "desert")
	check(e["lastPlayArea"] == "desert" and e["selectedDestination"] == "desert", "enter desert")
	check(GameLogic.move_in_biome(e, "desert", "Oasis Edge")["desertLocation"] == "Oasis Edge", "move within biome")
	check(GameLogic.move_in_biome(e, "desert", "The Moon")["desertLocation"] == "Sand Dunes", "unknown section ignored")
	var p := GameLogic.photograph_in_biome(e, "desert", "fennec-fox")
	check(p["photographedAnimals"].has("fennec-fox"), "biome animal photographed")
	check(p["collectedPhotoVariants"].is_empty(), "no art -> no collectible photo")
	check(GameLogic.photograph_in_biome(e, "desert", "duck")["photographedAnimals"].is_empty(), "other animals ignored")
	for b in Data.biomes:
		var enter := GameLogic.enter_biome(s, b["id"])
		check(enter["lastPlayArea"] == b["id"], "can enter %s" % b["id"])


func test_shot_rating() -> void:
	check(ShotRating.rate(0.5, 0.3) == "perfect", "centre is perfect")
	check(ShotRating.rate(0.55, 0.3) == "great", "inside the spot is great")
	check(ShotRating.rate(0.1, 0.3) == "nice", "outside is nice")
	check(ShotRating.next_streak(2, "great") == 3 and ShotRating.next_streak(5, "nice") == 0, "streaks")
	check(ShotRating.points("great", "close") == 75 and ShotRating.points("nice", "macro") == 20, "zoom points")
	check(not ShotRating.message("nice", 0).to_lower().contains("miss"), "no harsh wording")
	var w := ShotRating.sweet_spot_width(0.28, 0, 0)
	check(absf(w - 0.098) < 0.001, "fresh medium width ~0.098 (got %f)" % w)
	check(absf(ShotRating.triangle_wave(0.0, 1000.0)) < 0.001 and absf(ShotRating.triangle_wave(500.0, 1000.0) - 1.0) < 0.001, "triangle wave")
	var owl := Data.animal("rare-owl")
	check(ShotRating.effective_difficulty("animal-researcher", owl) == "medium", "researcher eases rare owl")
	check(ShotRating.effective_difficulty("zoologist", owl) == "hard", "other roles do not")


func test_mini_games() -> void:
	check(MiniLogic.memory_deck(6).size() == 12, "memory deck has 12 cards")
	check(MiniLogic.mask_name("Ducks have waterproof feathers.", "Duck") == "??? have waterproof feathers.", "mask name")
	check(MiniLogic.mask_name("The Heron stands still.", "Great Blue Heron") == "The ??? stands still.", "mask last word")
	for i in 40:
		var r := MiniLogic.who_am_i_round()
		check(r["choices"].has(r["answer"]) and not str(r["prompt"]).to_lower().contains(str(r["answer"]).to_lower()), "who-am-i round is fair")
		var h := MiniLogic.habitat_round()
		check(h["choices"].has(h["answer"]), "habitat round has its answer")
		var c := MiniLogic.count_round()
		check(c["tiles"].filter(func(a): return a["id"] == c["target"]["id"]).size() == c["answer"] and c["choices"].has(c["answer"]), "count round adds up")
		var t := MiniLogic.time_round()
		check(t["choices"].has(t["answer"]), "time round has its answer")
	var f := MiniLogic.find_round(12)
	check(f["tiles"].filter(func(a): return a["id"] == f["target"]["id"]).size() == 1, "exactly one target tile")
	check(MiniLogic.clear_time_of_day({"activeTime": "Day and night"}) == "", "two moods is not clear")
	check(MiniLogic.clear_time_of_day({"activeTime": "Night"}) == "night", "night")
	check(MiniLogic.extend_pattern([0, 1], 4).size() == 3, "pattern grows by one")
