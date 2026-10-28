class_name GameLogic
extends RefCounted
## Pure game rules, ported from the web game's src/state/*.ts. Every function takes a save Dictionary and
## returns a changed copy (never mutating the input), so the rules are easy to test.

const SCHEMA_VERSION := 15
const PARK_LOCATIONS := ["Park Entrance", "Duck Pond", "Open Meadow", "Forest Trail", "Strange Old Tree", "Whisper Grove"]


# --- save defaults and migration -----------------------------------------------------------------------

static func default_quest() -> Dictionary:
	return {"started": false, "foundPawprints": false, "foundToy": false, "foundPuppy": false, "completed": false}


static func default_save() -> Dictionary:
	var save := {
		"schemaVersion": SCHEMA_VERSION,
		"selectedRole": null,
		"discoveredAnimals": [],
		"photographedAnimals": [],
		"discoveredLocations": ["Park Entrance"],
		"currentLocation": "Park Entrance",
		"questProgress": {"lostPuppy": default_quest()},
		"rareOwlSpotted": false,
		"whisperGroveDiscovered": false,
		"wildCamperUnlocked": false,
		"camperVisited": false,
		"camperIntroductionSeen": false,
		"selectedDestination": null,
		"lastPlayArea": "park",
		"forestLocation": "Forest Arrival",
		"reportedInvasiveSpecies": [],
		"collectedPhotoVariants": [],
		"photographCounts": {},
		"achievements": [],
	}
	for b in Data.biomes:
		save[b["saveKey"]] = b["locations"][0]["name"]
	return save


static func _known(value, allowed: Array) -> Array:
	var out: Array = []
	if typeof(value) == TYPE_ARRAY:
		for item in value:
			if typeof(item) == TYPE_STRING and allowed.has(item) and not out.has(item):
				out.append(item)
	return out


static func migrate(input) -> Dictionary:
	var p: Dictionary = input if typeof(input) == TYPE_DICTIONARY else {}
	var save := default_save()
	var valid_animals: Array = Data.animals.map(func(a): return a["id"])
	var valid_destinations: Array = Data.destinations.map(func(d): return d["id"])
	var qp = p.get("questProgress", {})
	var lp = qp.get("lostPuppy", {}) if typeof(qp) == TYPE_DICTIONARY else {}
	if typeof(lp) != TYPE_DICTIONARY:
		lp = {}
	save["selectedRole"] = p["selectedRole"] if typeof(p.get("selectedRole")) == TYPE_STRING else null
	save["discoveredAnimals"] = _known(p.get("discoveredAnimals"), valid_animals)
	save["photographedAnimals"] = _known(p.get("photographedAnimals"), valid_animals)
	var locs := _known(p.get("discoveredLocations"), PARK_LOCATIONS)
	save["discoveredLocations"] = locs if not locs.is_empty() else ["Park Entrance"]
	save["currentLocation"] = p["currentLocation"] if PARK_LOCATIONS.has(p.get("currentLocation")) else "Park Entrance"
	for k in ["started", "foundPawprints", "foundToy", "foundPuppy", "completed"]:
		save["questProgress"]["lostPuppy"][k] = bool(lp.get(k, false))
	save["rareOwlSpotted"] = bool(p.get("rareOwlSpotted", false))
	save["whisperGroveDiscovered"] = bool(p.get("whisperGroveDiscovered", false))
	var unlocked := bool(p.get("wildCamperUnlocked", false))
	save["wildCamperUnlocked"] = unlocked
	save["camperVisited"] = unlocked and bool(p.get("camperVisited", false))
	save["camperIntroductionSeen"] = unlocked and bool(p.get("camperIntroductionSeen", false))
	save["selectedDestination"] = p["selectedDestination"] if unlocked and valid_destinations.has(p.get("selectedDestination")) else null
	var area = p.get("lastPlayArea")
	save["lastPlayArea"] = area if unlocked and (area == "forest" or area == "camper" or Data.is_biome(str(area))) else "park"
	save["forestLocation"] = "Fern Trail" if p.get("forestLocation") == "Fern Trail" else "Forest Arrival"
	for b in Data.biomes:
		var saved = p.get(b["saveKey"])
		var ok := false
		for loc in b["locations"]:
			if loc["name"] == saved:
				ok = true
		save[b["saveKey"]] = saved if ok else b["locations"][0]["name"]
	save["reportedInvasiveSpecies"] = _known(p.get("reportedInvasiveSpecies"), valid_animals)
	save["collectedPhotoVariants"] = _known(p.get("collectedPhotoVariants"), Data.all_photo_keys())
	var counts := {}
	var raw_counts = p.get("photographCounts", {})
	if typeof(raw_counts) == TYPE_DICTIONARY:
		for id in valid_animals:
			var c = raw_counts.get(id)
			if (typeof(c) == TYPE_FLOAT or typeof(c) == TYPE_INT) and c > 0:
				counts[id] = int(floor(c))
	save["photographCounts"] = counts
	save["achievements"] = _known(p.get("achievements"), Data.achievements.keys())
	return save


# --- helpers ---------------------------------------------------------------------------------------------

static func with_unique(list: Array, value) -> Array:
	var out := list.duplicate()
	if not out.has(value):
		out.append(value)
	return out


static func bump(counts: Dictionary, key: String) -> Dictionary:
	var out := counts.duplicate()
	out[key] = int(out.get(key, 0)) + 1
	return out


static func has_photographed(save: Dictionary, animal_id: String) -> bool:
	return save["photographedAnimals"].has(animal_id)


## Records a photo of any animal: discovered, photographed, rangers' report for non-native, the next
## uncollected photo variant (if the animal has art) and the practice count.
static func record_photo(save: Dictionary, animal_id: String) -> Dictionary:
	var animal := Data.animal(animal_id)
	var s := save.duplicate(true)
	var variant := Data.pick_uncollected_variant(animal_id, save["collectedPhotoVariants"])
	s["discoveredAnimals"] = with_unique(s["discoveredAnimals"], animal_id)
	s["photographedAnimals"] = with_unique(s["photographedAnimals"], animal_id)
	if animal.has("nonNative"):
		s["reportedInvasiveSpecies"] = with_unique(s["reportedInvasiveSpecies"], animal_id)
	if variant > 0:
		s["collectedPhotoVariants"] = with_unique(s["collectedPhotoVariants"], "%s-%d" % [animal_id, variant])
	s["photographCounts"] = bump(s["photographCounts"], animal_id)
	return s


# --- tutorial progression ----------------------------------------------------------------------------

static func is_tutorial_complete(save: Dictionary) -> bool:
	return save["questProgress"]["lostPuppy"]["completed"] and save["whisperGroveDiscovered"] and save["photographedAnimals"].has("rare-owl")


static func check_tutorial_completion(save: Dictionary) -> Dictionary:
	if save["wildCamperUnlocked"] or not is_tutorial_complete(save):
		return save
	var s := save.duplicate(true)
	s["wildCamperUnlocked"] = true
	return s


static func common_photo_count(save: Dictionary) -> int:
	var n := 0
	for id in save["photographedAnimals"]:
		if Data.common_milestone_ids.has(id):
			n += 1
	return n


static func tutorial_items(save: Dictionary) -> Array:
	var photos := common_photo_count(save)
	var quest_done: bool = save["questProgress"]["lostPuppy"]["completed"]
	return [
		{"label": "Choose role", "done": save["selectedRole"] != null, "locked": false},
		{"label": "Visit Duck Pond", "done": save["discoveredLocations"].has("Duck Pond"), "locked": false},
		{"label": "Photograph first animal", "done": photos >= 1, "locked": false},
		{"label": "Photograph 3 common animals", "done": photos >= 3, "locked": false},
		{"label": "Photograph all common animals", "done": photos >= Data.common_milestone_ids.size(), "locked": false},
		{"label": "Complete Lost Puppy quest", "done": quest_done, "locked": false},
		{"label": "Spot Rare Owl", "done": save["rareOwlSpotted"], "locked": false},
		{"label": "Photograph Rare Owl", "done": save["photographedAnimals"].has("rare-owl"), "locked": not save["rareOwlSpotted"]},
		{"label": "Find Whisper Grove", "done": save["whisperGroveDiscovered"], "locked": not quest_done},
		{"label": "Unlock Wild Camper", "done": save["wildCamperUnlocked"], "locked": false},
	]


# --- Tutorial Park -----------------------------------------------------------------------------------------

## Animals that can be photographed in a Park location.
static func park_animals_for(location_name: String, save: Dictionary) -> Array:
	return Data.animals.filter(func(a):
		if a["habitat"] != location_name:
			return false
		if a["id"] == "rare-owl":
			return save["rareOwlSpotted"]
		return a["availableInMilestone"] and a["rarity"] == "common")


static func photograph_in_park(save: Dictionary, animal_id: String) -> Dictionary:
	var animal := Data.animal(animal_id)
	if animal.is_empty():
		return save
	if animal_id == "rare-owl" and not save["rareOwlSpotted"]:
		return save
	if animal["rarity"] != "common" and animal_id != "rare-owl":
		return save
	return check_tutorial_completion(record_photo(save, animal_id))


static func visible_park_locations(save: Dictionary) -> Array:
	var out: Array = []
	for l in Data.park_locations:
		var copy: Dictionary = l.duplicate()
		if copy["name"] == "Whisper Grove" and save["whisperGroveDiscovered"]:
			copy["status"] = "available"
		out.append(copy)
	return out


static func visit_location(save: Dictionary, location_name: String) -> Dictionary:
	var loc := Data.park_location(location_name)
	if loc.is_empty():
		return save
	if location_name == "Whisper Grove" and not save["whisperGroveDiscovered"]:
		return save
	if loc["status"] == "hidden" and location_name != "Whisper Grove":
		return save
	var s := save.duplicate(true)
	s["currentLocation"] = location_name
	s["discoveredLocations"] = with_unique(s["discoveredLocations"], location_name)
	return s


static func spot_rare_owl(save: Dictionary) -> Dictionary:
	if save["currentLocation"] != "Strange Old Tree":
		return save
	var s := save.duplicate(true)
	s["rareOwlSpotted"] = true
	s["discoveredAnimals"] = with_unique(s["discoveredAnimals"], "rare-owl")
	return s


static func discover_whisper_grove(save: Dictionary) -> Dictionary:
	if save["currentLocation"] != "Strange Old Tree" or not save["questProgress"]["lostPuppy"]["completed"]:
		return save
	var s := save.duplicate(true)
	s["whisperGroveDiscovered"] = true
	s["currentLocation"] = "Whisper Grove"
	s["discoveredLocations"] = with_unique(s["discoveredLocations"], "Whisper Grove")
	return check_tutorial_completion(s)


static func location_clue(save: Dictionary) -> String:
	var q: Dictionary = save["questProgress"]["lostPuppy"]
	var here: String = save["currentLocation"]
	if here == "Open Meadow" and q["started"] and not q["foundPawprints"]:
		return "You notice small marks pressed into the soft grass."
	if here == "Forest Trail" and q["foundPawprints"] and not q["foundToy"]:
		return "A bright object is partly hidden beside a fallen leaf."
	if here == "Forest Trail" and q["foundToy"] and not q["foundPuppy"]:
		return "A gentle rustling sound comes from farther along the trail."
	if here == "Strange Old Tree" and not save["rareOwlSpotted"]:
		return "A quiet shape is tucked between the upper branches."
	if here == "Strange Old Tree" and q["completed"] and not save["whisperGroveDiscovered"]:
		return "The returned puppy revealed where a narrow path begins behind the tree."
	return ""


# --- Lost Puppy quest ---------------------------------------------------------------------------------------

static func _patch_quest(save: Dictionary, patch: Dictionary) -> Dictionary:
	var s := save.duplicate(true)
	for k in patch:
		s["questProgress"]["lostPuppy"][k] = patch[k]
	return s


static func start_quest(save: Dictionary) -> Dictionary:
	if save["questProgress"]["lostPuppy"]["completed"]:
		return save
	return _patch_quest(save, {"started": true})


static func find_pawprints(save: Dictionary) -> Dictionary:
	var q: Dictionary = save["questProgress"]["lostPuppy"]
	if not q["started"] or q["completed"]:
		return save
	return _patch_quest(save, {"foundPawprints": true})


static func find_chew_toy(save: Dictionary) -> Dictionary:
	var q: Dictionary = save["questProgress"]["lostPuppy"]
	if not q["started"] or not q["foundPawprints"] or q["completed"]:
		return save
	return _patch_quest(save, {"foundToy": true})


static func find_puppy(save: Dictionary) -> Dictionary:
	var q: Dictionary = save["questProgress"]["lostPuppy"]
	if not q["started"] or not q["foundPawprints"] or not q["foundToy"] or q["completed"]:
		return save
	return _patch_quest(save, {"foundPuppy": true})


static func complete_quest(save: Dictionary) -> Dictionary:
	var q: Dictionary = save["questProgress"]["lostPuppy"]
	if not q["started"] or not q["foundPawprints"] or not q["foundToy"] or not q["foundPuppy"] or q["completed"]:
		return save
	var s := _patch_quest(save, {"completed": true})
	var variant := Data.pick_uncollected_variant("lost-puppy", save["collectedPhotoVariants"])
	s["discoveredAnimals"] = with_unique(s["discoveredAnimals"], "lost-puppy")
	if variant > 0:
		s["collectedPhotoVariants"] = with_unique(s["collectedPhotoVariants"], "lost-puppy-%d" % variant)
	return check_tutorial_completion(s)


static func quest_hint(save: Dictionary) -> String:
	var q: Dictionary = save["questProgress"]["lostPuppy"]
	if q["completed"]:
		return "The puppy has been reunited. Great helping!"
	if q["foundPuppy"]:
		return "Return to Park Entrance for the gentle reunion."
	if q["foundToy"]:
		return "Look carefully on the Forest Trail. The puppy may be nearby."
	if q["foundPawprints"]:
		return "The pawprints point toward the Forest Trail. Look for a chew toy."
	if q["started"]:
		return "Search Open Meadow for gentle pawprint clues."
	return "Talk to the owner at Park Entrance to start helping."


static func unlock_achievement(save: Dictionary, id: String) -> Dictionary:
	var s := save.duplicate(true)
	s["achievements"] = with_unique(s["achievements"], id)
	return s


# --- Wild Camper, Forest and biomes ---------------------------------------------------------------------------

static func enter_camper(save: Dictionary) -> Dictionary:
	if not save["wildCamperUnlocked"]:
		return save
	var s := save.duplicate(true)
	s["camperVisited"] = true
	s["lastPlayArea"] = "camper"
	return s


static func return_to_park(save: Dictionary) -> Dictionary:
	var s := save.duplicate(true)
	s["lastPlayArea"] = "park"
	return s


static func acknowledge_camper_intro(save: Dictionary) -> Dictionary:
	if not save["wildCamperUnlocked"]:
		return save
	var s := save.duplicate(true)
	s["camperIntroductionSeen"] = true
	return s


static func select_destination(save: Dictionary, id: String) -> Dictionary:
	if not save["wildCamperUnlocked"]:
		return save
	var s := save.duplicate(true)
	s["selectedDestination"] = id
	return s


static func clear_destination(save: Dictionary) -> Dictionary:
	if not save["wildCamperUnlocked"]:
		return save
	var s := save.duplicate(true)
	s["selectedDestination"] = null
	return s


static func enter_forest(save: Dictionary) -> Dictionary:
	if not save["wildCamperUnlocked"]:
		return save
	var s := save.duplicate(true)
	s["selectedDestination"] = "forest"
	s["lastPlayArea"] = "forest"
	return s


static func move_in_forest(save: Dictionary, location: String) -> Dictionary:
	var s := save.duplicate(true)
	s["forestLocation"] = location
	return s


static func photograph_in_forest(save: Dictionary, animal_id: String) -> Dictionary:
	if not Data.forest_animal_ids.has(animal_id):
		return save
	return record_photo(save, animal_id)


static func return_to_camper(save: Dictionary) -> Dictionary:
	var s := save.duplicate(true)
	s["lastPlayArea"] = "camper"
	s["camperVisited"] = true
	return s


static func enter_biome(save: Dictionary, id: String) -> Dictionary:
	if not save["wildCamperUnlocked"]:
		return save
	var s := save.duplicate(true)
	s["selectedDestination"] = id
	s["lastPlayArea"] = id
	return s


static func move_in_biome(save: Dictionary, id: String, location_name: String) -> Dictionary:
	var b := Data.biome(id)
	if b.is_empty():
		return save
	for loc in b["locations"]:
		if loc["name"] == location_name:
			var s := save.duplicate(true)
			s[b["saveKey"]] = location_name
			return s
	return save


static func photograph_in_biome(save: Dictionary, biome_id: String, animal_id: String) -> Dictionary:
	var b := Data.biome(biome_id)
	if b.is_empty() or not Data.biome_animal_ids(b).has(animal_id):
		return save
	return record_photo(save, animal_id)


# --- role bonuses (port of src/data/roleBonuses.ts) ------------------------------------------------------------

static func unlocks_bonus_facts(role, animal: Dictionary) -> bool:
	if role == "conservation-ranger":
		return animal["rarity"] == "common"
	if role == "animal-researcher":
		return animal["rarity"] == "rare"
	return false


static func bonus_first_photo_fact(role) -> bool:
	return role == "zoologist"


static func sees_locked_preview(role) -> bool:
	return role == "explorer"


static func bonus_photo_slot(role) -> bool:
	return role == "wildlife-photographer"
