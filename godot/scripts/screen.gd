class_name Screen
extends Control
## Base for every full-screen view: background, a header with title and buttons, a scrolling content area,
## a message box and a thumb-friendly dock of round action buttons along the bottom.

var main: Node
var content: VBoxContainer
var message_label: Label
var dock: HFlowContainer
var _dock_buttons := {}
var _root: VBoxContainer
var _message_card: Control


func build(bg_key: String, eyebrow_text: String, title_text: String, header_buttons: Array = []) -> void:
	set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	add_child(UI.gradient_bg(bg_key))
	var margin := MarginContainer.new()
	margin.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	for side in ["left", "right"]:
		margin.add_theme_constant_override("margin_" + side, 24)
	margin.add_theme_constant_override("margin_top", 28)
	margin.add_theme_constant_override("margin_bottom", 24)
	add_child(margin)
	_root = UI.vbox(16)
	margin.add_child(_root)

	if eyebrow_text != "" or title_text != "":
		var titles := UI.vbox(0)
		if eyebrow_text != "":
			titles.add_child(UI.eyebrow(eyebrow_text))
		titles.add_child(UI.heading(title_text, 54))
		_root.add_child(titles)
	if header_buttons.size() > 0:
		var row := UI.flow(12)
		for b in header_buttons:
			b.custom_minimum_size = Vector2(0, 64)
			b.add_theme_font_size_override("font_size", 26)
			row.add_child(b)
		_root.add_child(row)

	var sc := UI.scroll()
	_root.add_child(sc)
	content = UI.vbox(18)
	sc.add_child(content)

	_message_card = UI.card(Color(1, 1, 1, 0.88), 24, 20)
	message_label = UI.label("", 26)
	_message_card.add_child(message_label)
	_message_card.visible = false
	_root.add_child(_message_card)

	dock = UI.flow(12)
	dock.alignment = FlowContainer.ALIGNMENT_CENTER
	dock.visible = false
	_root.add_child(dock)


func set_message(text: String) -> void:
	message_label.text = text
	_message_card.visible = text != ""


## Adds a big round-ish dock button with an icon over a label. Returns the Button.
func add_dock_button(key: String, icon: String, caption: String, on_press: Callable) -> Button:
	var b := UI.button("%s\n%s" % [icon, caption], "primary", on_press)
	b.custom_minimum_size = Vector2(150, 110)
	b.add_theme_font_size_override("font_size", 24)
	b.alignment = HORIZONTAL_ALIGNMENT_CENTER
	dock.add_child(b)
	dock.visible = true
	_dock_buttons[key] = [b, icon, caption]
	return b


func set_dock_badge(key: String, count: int) -> void:
	if not _dock_buttons.has(key):
		return
	var info: Array = _dock_buttons[key]
	info[0].text = "%s%s\n%s" % [info[1], " %d" % count if count > 0 else "", info[2]]


func remove_dock_button(key: String) -> void:
	if _dock_buttons.has(key):
		_dock_buttons[key][0].queue_free()
		_dock_buttons.erase(key)


## The shared photo flow for every play screen: record the photo with `photograph_fn(save, animal_id)`,
## then show the reveal (with role bonus facts) and the "where does it belong" quiz for non-native animals.
func handle_photo(animal_id: String, great: bool, photograph_fn: Callable) -> void:
	var animal := Data.animal(animal_id)
	if animal.is_empty():
		return
	var before: Dictionary = Save.data
	var is_new_report: bool = animal.has("nonNative") and not before["reportedInvasiveSpecies"].has(animal_id)
	var prev: Array = before["collectedPhotoVariants"]
	var updated: Dictionary = photograph_fn.call(before, animal_id)
	Save.apply(updated)
	set_message(("Great shot! %s added to your Wildlife Journal." if great else "Great photo! %s added to your Wildlife Journal.") % animal["name"])
	var new_key := ""
	for key in updated["collectedPhotoVariants"]:
		if not prev.has(key):
			new_key = key
	if new_key != "":
		var bonus := ""
		var role = before["selectedRole"]
		if GameLogic.unlocks_bonus_facts(role, animal):
			bonus = Data.bonus_fact_for_key(animal_id, new_key)
		elif GameLogic.bonus_first_photo_fact(role) and Data.count_collected(animal_id, prev) == 0:
			bonus = animal["funFact"]
		Overlays.photo_reveal(self, animal, new_key, updated["collectedPhotoVariants"], great, bonus, Data.count_collected(animal_id, prev) == 0)
	elif Data.photo_count(animal_id) == 0:
		set_message("%s %s" % [message_label.text, animal["funFact"]])
	if is_new_report:
		Overlays.habitat_quiz(self, animal)
