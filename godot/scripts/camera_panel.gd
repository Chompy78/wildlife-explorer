class_name CameraPanel
extends PanelContainer
## The camera: a marker sweeps along each animal's track and a tap while it is in the glowing zone is a
## Great Shot. Every tap still takes a photo. Adds shot feedback (flash, Perfect, streaks), an optional zoom
## dial and a cosmetic time-of-day mood. Port of CameraPanel.tsx.

signal photographed(animal_id: String, great: bool)

var animals_here: Array = []
var flash_host: Control

var zoom := "wide"
var mood := "day"
var streak := 0
var best_streak := 0
var score := 0
var shots := 0
var reduced_motion := false

var _start_ms := 0
var _offsets := {}
var _targets := {}  # id -> {track, button, great_label, pulse, cycle_ms, max_width, species_count, complete}
var _col: VBoxContainer
var _list: VBoxContainer
var _feedback: Label
var _zoom_blurb: Label
var _mood_desc: Label
var _mood_buttons := {}
var _zoom_buttons := {}
var _panel_style: StyleBoxFlat
var _tinted: Array = []  # labels whose colour follows the mood

const MOODS := {
	"day": {"label": "Day", "icon": "☀️", "bg": "#f7f4e2", "fg": "#19402b", "desc": "Bright and warm. Most animals are out and about."},
	"dusk": {"label": "Dusk", "icon": "🌅", "bg": "#f6e2c3", "fg": "#19402b", "desc": "Golden light as the day winds down."},
	"night": {"label": "Night", "icon": "🌙", "bg": "#26324d", "fg": "#eef1fa", "desc": "Quiet and dark. Only a few animals stay active."},
}


func setup(animals: Array, host: Control) -> void:
	animals_here = animals
	flash_host = host
	reduced_motion = _prefers_reduced_motion()
	_start_ms = Time.get_ticks_msec()
	size_flags_horizontal = Control.SIZE_EXPAND_FILL
	_col = UI.vbox(14)
	add_child(_col)
	_build_controls()
	refresh()


static func _prefers_reduced_motion() -> bool:
	if OS.has_feature("web"):
		var v = JavaScriptBridge.eval("window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches")
		return bool(v)
	return false


func _build_controls() -> void:
	var picker := UI.flow(10)
	for id in MOODS:
		var b := UI.button("%s %s" % [MOODS[id]["icon"], MOODS[id]["label"]], "secondary", func(): _set_mood(id))
		b.custom_minimum_size = Vector2(0, 56)
		b.add_theme_font_size_override("font_size", 24)
		_mood_buttons[id] = b
		picker.add_child(b)
	var snd := SoundToggle.new()
	snd.custom_minimum_size = Vector2(0, 56)
	picker.add_child(snd)
	_col.add_child(picker)
	_mood_desc = UI.muted(MOODS["day"]["desc"], 22)
	_col.add_child(_mood_desc)
	_tinted.append(_mood_desc)
	var hint := UI.muted("Tap the shutter while the marker is in the glowing zone for a Great Shot!", 22)
	_col.add_child(hint)
	_tinted.append(hint)
	var zooms := UI.flow(10)
	for id in ShotRating.ZOOM_LEVELS:
		var z: Dictionary = ShotRating.ZOOMS[id]
		var b := UI.button("%s %s" % [z["icon"], z["label"]], "secondary", func(): _set_zoom(id))
		b.custom_minimum_size = Vector2(0, 56)
		b.add_theme_font_size_override("font_size", 24)
		_zoom_buttons[id] = b
		zooms.add_child(b)
	_col.add_child(zooms)
	_zoom_blurb = UI.muted("", 22)
	_col.add_child(_zoom_blurb)
	_tinted.append(_zoom_blurb)
	_feedback = UI.label("", 26, UI.TEXT, true)
	_col.add_child(_feedback)
	_tinted.append(_feedback)
	_list = UI.vbox(14)
	_col.add_child(_list)
	_style_toggles()
	_apply_mood()


func _style_toggles() -> void:
	for id in _mood_buttons:
		_restyle(_mood_buttons[id], id == mood)
	for id in _zoom_buttons:
		_restyle(_zoom_buttons[id], id == zoom)
	var z: Dictionary = ShotRating.ZOOMS[zoom]
	_zoom_blurb.text = "%s Score: %d" % [z["blurb"], score]


func _restyle(b: Button, on: bool) -> void:
	var s := UI.button("", "gold" if on else "secondary")
	for state in ["normal", "hover", "pressed"]:
		b.add_theme_stylebox_override(state, s.get_theme_stylebox(state))


func _set_mood(id: String) -> void:
	mood = id
	_style_toggles()
	_apply_mood()
	refresh()


func _set_zoom(id: String) -> void:
	zoom = id
	_start_ms = Time.get_ticks_msec()
	_style_toggles()
	refresh()


func _apply_mood() -> void:
	var m: Dictionary = MOODS[mood]
	_mood_desc.text = m["desc"]
	for l in _tinted:
		if is_instance_valid(l):
			l.add_theme_color_override("font_color", Color(m["fg"]))
	add_theme_stylebox_override("panel", UI.box(Color(m["bg"]), 26, Color(0.14, 0.39, 0.24, 0.12), 1, 22, 22))


## Rebuilds the animal list from the current save (called after every photo).
func refresh() -> void:
	for c in _list.get_children():
		c.queue_free()
	_targets.clear()
	var save: Dictionary = Save.data
	var total := ShotRating.total_photos(save)
	if animals_here.is_empty():
		_list.add_child(UI.label("No common animals are ready to photograph here yet.", 26))
		return
	for animal in animals_here:
		_list.add_child(_make_target(animal, save, total))


func _make_target(animal: Dictionary, save: Dictionary, total: int) -> Control:
	var id: String = animal["id"]
	var difficulty := ShotRating.effective_difficulty(save["selectedRole"], animal)
	var tuning: Dictionary = ShotRating.FOCUS[difficulty]
	var zt: Dictionary = ShotRating.ZOOMS[zoom]
	var cycle: float = tuning["cycle_ms"] * zt["speed"]
	var max_width: float = tuning["max_width"] * zt["width"]
	var species_count := int(save["photographCounts"].get(id, 0))
	var complete := Data.is_collection_complete(id, save["collectedPhotoVariants"])
	var photographed: bool = GameLogic.has_photographed(save, id)
	if not _offsets.has(id):
		_offsets[id] = randf() * 2200.0
	var card := UI.card(Color("#2c7a4a"), 28, 22)
	var row := UI.hbox(18)
	card.add_child(row)
	row.add_child(UI.animal_icon(animal, save["collectedPhotoVariants"], 110))
	var col := UI.vbox(10)
	row.add_child(col)
	var title := "%s — collection complete" % animal["name"] if complete else ("Retake %s" % animal["name"] if photographed else "Photograph %s" % animal["name"])
	var shutter := UI.button(title, "gold", func(): _tap(id))
	shutter.disabled = complete
	col.add_child(shutter)
	var info := {"button": shutter, "cycle": cycle, "max_width": max_width, "species": species_count, "total": total, "complete": complete, "great_label": null, "track": null, "on_ms": 0.0}
	var width := ShotRating.sweet_spot_width(max_width, species_count, total)
	info["width"] = width
	if not complete:
		if not reduced_motion:
			var track := FocusTrack.new()
			track.spot_width = width
			col.add_child(track)
			info["track"] = track
		if MiniLogic.is_active_at(animal, mood):
			col.add_child(UI.label("Most active now", 22, Color("#fff3c4"), true))
		if animal.has("photographyTip"):
			col.add_child(UI.label("💡 " + animal["photographyTip"]["hint"], 22, Color("#e4f3e8")))
		col.add_child(UI.label("Great Shots: %d / %d" % [species_count, int(ShotRating.SPECIES_MASTERY)], 20, Color("#d3e6d8"), true))
	_targets[id] = info
	return card


func _now_ms() -> float:
	return float(Time.get_ticks_msec() - _start_ms)


func _marker_for(id: String) -> float:
	var t: Dictionary = _targets[id]
	return ShotRating.triangle_wave(_now_ms() + _offsets[id], t["cycle"])


func _is_great_now(id: String) -> bool:
	var t: Dictionary = _targets[id]
	if reduced_motion:
		# calm on/off glow instead of a moving marker
		var on_ms: float = t["cycle"] * t["width"]
		return fposmod(_now_ms() + _offsets[id], t["cycle"]) < on_ms
	return absf(_marker_for(id) - 0.5) <= t["width"] / 2.0


func _process(_delta: float) -> void:
	for id in _targets:
		var t: Dictionary = _targets[id]
		if t["complete"]:
			continue
		var great := _is_great_now(id)
		if t["track"]:
			(t["track"] as FocusTrack).set_state(_marker_for(id), t["width"])
		var b: Button = t["button"]
		if t.get("pulse", false) != great:
			t["pulse"] = great
			b.add_theme_stylebox_override("normal", UI.box(Color("#ffe9a0") if great else Color("#fff3c2"), 24, Color("#f1b83b"), 8 if great else 3))


func _tap(id: String) -> void:
	var t: Dictionary = _targets[id]
	var great := _is_great_now(id)
	var rating := "great" if great else "nice"
	if not reduced_motion:
		rating = ShotRating.rate(_marker_for(id), t["width"])
	streak = ShotRating.next_streak(streak, rating)
	best_streak = maxi(best_streak, streak)
	score += ShotRating.points(rating, zoom)
	shots += 1
	_feedback.text = ShotRating.message(rating, streak) + (" (Best streak: %d)" % best_streak if best_streak >= 2 else "")
	_style_toggles()
	Sfx.shutter()
	if great:
		Sfx.great_shot()
	_flash()
	photographed.emit(id, great)


func _flash() -> void:
	if flash_host == null or not is_instance_valid(flash_host) or reduced_motion:
		return
	var f := ColorRect.new()
	f.color = Color(1, 1, 1, 0.8)
	f.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	f.mouse_filter = Control.MOUSE_FILTER_IGNORE
	flash_host.add_child(f)
	var tw := f.create_tween()
	tw.tween_property(f, "modulate:a", 0.0, 0.35)
	tw.tween_callback(f.queue_free)
