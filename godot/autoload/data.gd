extends Node
## Read-only game data, loaded from data/game_data.json (generated from the web game's TypeScript tables by
## scripts/export-godot-data.ts, so both versions share one source of truth).

const DATA_PATH := "res://data/game_data.json"

var raw: Dictionary = {}
var animals: Array = []
var animal_by_id: Dictionary = {}
var biomes: Array = []
var biome_by_id: Dictionary = {}
var destinations: Array = []
var roles: Array = []
var park_locations: Array = []
var park_map_coordinates: Dictionary = {}
var photo_counts: Dictionary = {}
var facts: Dictionary = {}
var bonus_facts: Dictionary = {}
var forest_animal_ids: Array = []
var common_milestone_ids: Array = []
var quest: Dictionary = {}
var achievements: Dictionary = {}


func _ready() -> void:
	load_data()


func load_data() -> void:
	var file := FileAccess.open(DATA_PATH, FileAccess.READ)
	if file == null:
		push_error("Missing %s - run scripts/export-godot-data.ts" % DATA_PATH)
		return
	var parsed = JSON.parse_string(file.get_as_text())
	if typeof(parsed) != TYPE_DICTIONARY:
		push_error("Bad game data JSON")
		return
	raw = parsed
	animals = raw["animals"]
	for a in animals:
		animal_by_id[a["id"]] = a
	biomes = raw["biomes"]
	for b in biomes:
		biome_by_id[b["id"]] = b
	destinations = raw["destinations"]
	roles = raw["roles"]
	park_locations = raw["parkLocations"]
	park_map_coordinates = raw["parkMapCoordinates"]
	photo_counts = raw["photoCounts"]
	facts = raw["facts"]
	bonus_facts = raw["bonusFacts"]
	forest_animal_ids = raw["forestAnimalIds"]
	common_milestone_ids = raw["commonMilestoneAnimalIds"]
	quest = raw["lostPuppyQuest"]
	achievements = raw["achievements"]


# --- animals -------------------------------------------------------------------------------------------

func animal(id: String) -> Dictionary:
	return animal_by_id.get(id, {})


func photo_count(id: String) -> int:
	return int(photo_counts.get(id, 0))


func all_photo_keys() -> Array:
	var keys: Array = []
	for id in photo_counts:
		for i in range(1, photo_count(id) + 1):
			keys.append("%s-%d" % [id, i])
	return keys


func photo_path(key: String) -> String:
	return "res://assets/animals/%s.jpg" % key


func load_photo(key: String) -> Texture2D:
	var path := photo_path(key)
	if ResourceLoader.exists(path):
		return load(path) as Texture2D
	return null


func count_collected(id: String, collected: Array) -> int:
	var found := 0
	for i in range(1, photo_count(id) + 1):
		if collected.has("%s-%d" % [id, i]):
			found += 1
	return found


func is_collection_complete(id: String, collected: Array) -> bool:
	var count := photo_count(id)
	return count > 0 and count_collected(id, collected) >= count


func first_collected_variant(id: String, collected: Array) -> int:
	for i in range(1, photo_count(id) + 1):
		if collected.has("%s-%d" % [id, i]):
			return i
	return 0


## A random variant the player doesn't have yet, or 0 if the animal has no art or the set is complete.
func pick_uncollected_variant(id: String, collected: Array) -> int:
	var open: Array = []
	for i in range(1, photo_count(id) + 1):
		if not collected.has("%s-%d" % [id, i]):
			open.append(i)
	if open.is_empty():
		return 0
	return open[randi() % open.size()]


func variant_of_key(id: String, key: String) -> int:
	return int(key.substr(id.length() + 1))


func fact_for_key(id: String, key: String) -> String:
	var list: Array = facts.get(id, [])
	var v := variant_of_key(id, key)
	return list[v - 1] if v >= 1 and v <= list.size() else ""


func bonus_fact_for_key(id: String, key: String) -> String:
	var list: Array = bonus_facts.get(id, [])
	var v := variant_of_key(id, key)
	return list[v - 1] if v >= 1 and v <= list.size() else ""


func learned_facts(id: String, collected: Array, include_bonus := false) -> Array:
	var list: Array = facts.get(id, [])
	var bonus: Array = bonus_facts.get(id, [])
	var learned: Array = []
	for i in range(1, list.size() + 1):
		if collected.has("%s-%d" % [id, i]):
			learned.append(list[i - 1])
			if include_bonus and i <= bonus.size():
				learned.append(bonus[i - 1])
	return learned


func total_fact_count(id: String, include_bonus := false) -> int:
	var base: int = (facts.get(id, []) as Array).size()
	var extra: int = (bonus_facts.get(id, []) as Array).size()
	return base + extra if include_bonus and extra > 0 else base


# --- biomes --------------------------------------------------------------------------------------------

func biome(id: String) -> Dictionary:
	return biome_by_id.get(id, {})


func is_biome(id: String) -> bool:
	return biome_by_id.has(id)


func biome_animal_ids(b: Dictionary) -> Array:
	var ids: Array = []
	for loc in b["locations"]:
		ids.append_array(loc["animalIds"])
	return ids


func all_biome_animal_ids() -> Array:
	var ids: Array = []
	for b in biomes:
		ids.append_array(biome_animal_ids(b))
	return ids


func park_animals() -> Array:
	var biome_ids := all_biome_animal_ids()
	return animals.filter(func(a): return not forest_animal_ids.has(a["id"]) and not biome_ids.has(a["id"]))


func forest_animals() -> Array:
	return animals.filter(func(a): return forest_animal_ids.has(a["id"]))


func destination(id: String) -> Dictionary:
	for d in destinations:
		if d["id"] == id:
			return d
	return {}


func role_name(role_id) -> String:
	for r in roles:
		if r["id"] == role_id:
			return r["name"]
	return "No role selected"


func park_location(location_name: String) -> Dictionary:
	for l in park_locations:
		if l["name"] == location_name:
			return l
	return {}
