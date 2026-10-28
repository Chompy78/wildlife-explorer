class_name UI
extends RefCounted
## Small UI toolkit: the game's look (colours match the web version) and helpers for building screens in code.

const GREEN := Color("#267043")
const GREEN_HOVER := Color("#1d5e37")
const PALE := Color("#dff0d4")
const PALE_HOVER := Color("#cfe6c2")
const CARD := Color("#f8fff3")
const CARD_HOVER := Color("#eaf7e2")
const PANEL := Color("#fdfffb")
const TEXT := Color("#19402b")
const MUTED := Color("#4d6b58")
const GOLD := Color("#f1b83b")
const ORANGE := Color("#a55c16")
const WHITE := Color("#ffffff")

const BIOME_BACKGROUNDS := {
	"start": ["#f6f2b8", "#e3f1ec"], "park": ["#eaf0b4", "#d9eed4"], "forest": ["#cde5b0", "#e2f2d3"],
	"camper": ["#f3efbd", "#e4f1e6"], "minigames": ["#fde7b8", "#f3dfc2"],
	"lake": ["#bfdcea", "#d9eef3"], "mountains": ["#d3dcea", "#e6ecf2"], "safari": ["#f0dcae", "#f6ebcc"],
	"rainforest": ["#a9d9b4", "#cde9cf"], "desert": ["#f2d9a4", "#f8ebc8"], "arctic": ["#d5e8f4", "#eef6fb"],
	"coral-reef": ["#aee0ea", "#d3f1f2"], "wetlands": ["#bfe0c8", "#dcefdc"], "coastal": ["#bcdaf0", "#e1f0f8"],
	"grassland": ["#dfe9ac", "#eef3cf"], "taiga": ["#c4dccb", "#e0eee3"], "volcanic-highlands": ["#e8c9b8", "#f5e3d8"],
	"alien-planet": ["#c9bdf0", "#e4dcf8"],
}


# --- theme ---------------------------------------------------------------------------------------------------

static func make_theme() -> Theme:
	var theme := Theme.new()
	var base := FontFile.new()
	base.load_dynamic_font("res://fonts/Quicksand-Regular.ttf")
	var bold := FontFile.new()
	bold.load_dynamic_font("res://fonts/Quicksand-Bold.ttf")
	var emoji := FontFile.new()
	emoji.load_dynamic_font("res://fonts/NotoColorEmoji.ttf")
	base.fallbacks = [emoji]
	bold.fallbacks = [emoji]
	theme.default_font = base
	theme.default_font_size = 28
	theme.set_font("bold", "Label", bold)
	theme.set_font("font", "Button", bold)
	return theme


static func bold_font() -> Font:
	var f := FontFile.new()
	f.load_dynamic_font("res://fonts/Quicksand-Bold.ttf")
	return f


static func box(bg: Color, radius := 26, border := Color(0, 0, 0, 0), border_w := 0, pad_x := 28, pad_y := 18) -> StyleBoxFlat:
	var s := StyleBoxFlat.new()
	s.bg_color = bg
	s.set_corner_radius_all(radius)
	s.border_color = border
	s.set_border_width_all(border_w)
	s.content_margin_left = pad_x
	s.content_margin_right = pad_x
	s.content_margin_top = pad_y
	s.content_margin_bottom = pad_y
	s.shadow_color = Color(0.1, 0.3, 0.17, 0.14)
	s.shadow_size = 6
	s.shadow_offset = Vector2(0, 4)
	return s


# --- text ----------------------------------------------------------------------------------------------------

static func label(text: String, size := 28, color := TEXT, bold := false) -> Label:
	var l := Label.new()
	l.text = text
	l.add_theme_font_size_override("font_size", size)
	l.add_theme_color_override("font_color", color)
	if bold:
		l.add_theme_font_override("font", bold_font())
	l.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	l.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	return l


static func heading(text: String, size := 52) -> Label:
	return label(text, size, Color("#1b4a2e"), true)


static func eyebrow(text: String) -> Label:
	return label(text.to_upper(), 22, GREEN, true)


static func muted(text: String, size := 24) -> Label:
	return label(text, size, MUTED)


# --- controls ------------------------------------------------------------------------------------------------

## kind: primary | secondary | camper | card | active | dark | ghost
static func button(text: String, kind := "primary", on_press := Callable()) -> Button:
	var b := Button.new()
	b.text = text
	b.custom_minimum_size = Vector2(0, 72)
	b.focus_mode = Control.FOCUS_ALL
	b.add_theme_font_size_override("font_size", 28)
	var bg := GREEN
	var hover := GREEN_HOVER
	var fg := WHITE
	var border := Color(0, 0, 0, 0)
	var bw := 0
	match kind:
		"secondary":
			bg = PALE
			hover = PALE_HOVER
			fg = Color("#1f5133")
		"camper":
			bg = ORANGE
			hover = Color("#8c4c11")
		"card":
			bg = CARD
			hover = CARD_HOVER
			fg = TEXT
			border = Color(0.18, 0.49, 0.29, 0.18)
			bw = 2
		"active":
			bg = PALE
			hover = Color("#d3e8c6")
			fg = TEXT
			border = GREEN
			bw = 3
		"gold":
			bg = Color("#fff3c2")
			hover = Color("#ffe9a0")
			fg = TEXT
			border = GOLD
			bw = 3
		"ghost":
			bg = Color(0, 0, 0, 0)
			hover = Color(0.15, 0.4, 0.25, 0.08)
			fg = Color("#346244")
	var radius := 28 if kind != "card" and kind != "active" and kind != "gold" else 24
	b.add_theme_stylebox_override("normal", box(bg, radius, border, bw))
	b.add_theme_stylebox_override("hover", box(hover, radius, border, bw))
	b.add_theme_stylebox_override("pressed", box(hover, radius, border, bw))
	b.add_theme_stylebox_override("focus", box(bg, radius, GOLD, 4))
	var disabled := box(bg.lerp(Color.WHITE, 0.55), radius, border, bw)
	b.add_theme_stylebox_override("disabled", disabled)
	for c in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color"]:
		b.add_theme_color_override(c, fg)
	b.add_theme_color_override("font_disabled_color", fg.lerp(Color.WHITE, 0.4))
	if kind == "card" or kind == "active" or kind == "gold":
		b.alignment = HORIZONTAL_ALIGNMENT_LEFT
		b.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	if on_press.is_valid():
		b.pressed.connect(on_press)
	return b


## A tappable card with a bold title and a normal-weight description (a plain Button can only hold one
## font). kind: card | active | primary | gold. Returns the card; `on_press` runs when it is tapped.
static func rich_button(title: String, desc := "", kind := "card", on_press := Callable(), icon := "") -> PanelContainer:
	var bg := CARD
	var border := Color(0.18, 0.49, 0.29, 0.18)
	var bw := 2
	var fg := TEXT
	var sub := MUTED
	match kind:
		"active":
			bg = PALE
			border = GREEN
			bw = 3
		"primary":
			bg = GREEN
			border = Color(0, 0, 0, 0)
			bw = 0
			fg = WHITE
			sub = Color("#d8ecdc")
		"gold":
			bg = Color("#fff3c2")
			border = GOLD
			bw = 3
	var panel := PanelContainer.new()
	panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	panel.custom_minimum_size = Vector2(0, 96)
	panel.add_theme_stylebox_override("panel", box(bg, 24, border, bw, 24, 18))
	var row := hbox(18)
	row.mouse_filter = Control.MOUSE_FILTER_IGNORE
	panel.add_child(row)
	if icon != "":
		var il := label(icon, 52, fg)
		il.autowrap_mode = TextServer.AUTOWRAP_OFF
		il.custom_minimum_size = Vector2(72, 0)
		il.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		il.size_flags_horizontal = Control.SIZE_SHRINK_BEGIN
		il.size_flags_vertical = Control.SIZE_SHRINK_CENTER
		row.add_child(il)
	var col := vbox(4)
	col.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	row.add_child(col)
	col.add_child(label(title, 30, fg, true))
	if desc != "":
		col.add_child(label(desc, 24, sub))
	var hit := Button.new()
	hit.flat = true
	hit.focus_mode = Control.FOCUS_ALL
	var hover := StyleBoxFlat.new()
	hover.bg_color = Color(1, 1, 1, 0.22)
	hover.set_corner_radius_all(24)
	var focus := StyleBoxFlat.new()
	focus.bg_color = Color(0, 0, 0, 0)
	focus.set_corner_radius_all(24)
	focus.border_color = GOLD
	focus.set_border_width_all(4)
	hit.add_theme_stylebox_override("normal", StyleBoxEmpty.new())
	hit.add_theme_stylebox_override("hover", hover)
	hit.add_theme_stylebox_override("pressed", hover)
	hit.add_theme_stylebox_override("focus", focus)
	panel.add_child(hit)
	if on_press.is_valid():
		hit.pressed.connect(on_press)
	return panel


static func card(color := PANEL, radius := 28, pad := 24) -> PanelContainer:
	var p := PanelContainer.new()
	p.add_theme_stylebox_override("panel", box(color, radius, Color(0.14, 0.39, 0.24, 0.12), 1, pad, pad))
	p.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	return p


static func vbox(sep := 16) -> VBoxContainer:
	var v := VBoxContainer.new()
	v.add_theme_constant_override("separation", sep)
	v.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	return v


static func hbox(sep := 16) -> HBoxContainer:
	var h := HBoxContainer.new()
	h.add_theme_constant_override("separation", sep)
	return h


static func flow(sep := 12) -> HFlowContainer:
	var f := HFlowContainer.new()
	f.add_theme_constant_override("h_separation", sep)
	f.add_theme_constant_override("v_separation", sep)
	f.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	return f


static func scroll() -> ScrollContainer:
	var s := ScrollContainer.new()
	s.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	s.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	s.size_flags_vertical = Control.SIZE_EXPAND_FILL
	return s


static func margin(child: Control, m := 24) -> MarginContainer:
	var c := MarginContainer.new()
	for side in ["left", "right", "top", "bottom"]:
		c.add_theme_constant_override("margin_" + side, m)
	c.add_child(child)
	return c


static func gradient_bg(key: String) -> TextureRect:
	var colors: Array = BIOME_BACKGROUNDS.get(key, BIOME_BACKGROUNDS["start"])
	var g := Gradient.new()
	g.colors = PackedColorArray([Color(colors[0]), Color(colors[1])])
	var tex := GradientTexture2D.new()
	tex.gradient = g
	tex.fill_from = Vector2(0, 0)
	tex.fill_to = Vector2(0.6, 1)
	tex.width = 64
	tex.height = 128
	var rect := TextureRect.new()
	rect.texture = tex
	rect.stretch_mode = TextureRect.STRETCH_SCALE
	rect.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	rect.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	rect.mouse_filter = Control.MOUSE_FILTER_IGNORE
	return rect


static func photo(texture: Texture2D, min_size := Vector2(0, 0)) -> TextureRect:
	var t := TextureRect.new()
	t.texture = texture
	t.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	t.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	t.custom_minimum_size = min_size
	return t


## A rounded thumbnail of an animal's first collected photo, or its emoji.
static func animal_icon(animal: Dictionary, collected: Array, size := 96) -> Control:
	var variant := Data.first_collected_variant(animal["id"], collected)
	if variant > 0:
		var t := Data.load_photo("%s-%d" % [animal["id"], variant])
		if t:
			var holder := PanelContainer.new()
			holder.custom_minimum_size = Vector2(size, size)
			var sb := StyleBoxFlat.new()
			sb.set_corner_radius_all(18)
			sb.bg_color = Color.WHITE
			sb.set_content_margin_all(0)
			sb.set_expand_margin_all(0)
			holder.add_theme_stylebox_override("panel", sb)
			holder.clip_children = CanvasItem.CLIP_CHILDREN_AND_DRAW
			var tr := photo(t, Vector2(size, size))
			tr.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_COVERED
			holder.add_child(tr)
			return holder
	var l := label(animal["emoji"], int(size * 0.62))
	l.custom_minimum_size = Vector2(size, size)
	l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	l.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	l.size_flags_horizontal = Control.SIZE_SHRINK_BEGIN
	return l


# --- modal -----------------------------------------------------------------------------------------------------

## Opens a modal over `host`. Returns {"overlay", "body", "close"}: add content to body.
static func modal(host: Control, title: String, eyebrow_text := "", on_close := Callable()) -> Dictionary:
	var overlay := Control.new()
	overlay.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	overlay.z_index = 50
	var dim := ColorRect.new()
	dim.color = Color(0.05, 0.14, 0.09, 0.55)
	dim.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	overlay.add_child(dim)
	var frame := MarginContainer.new()
	frame.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	for side in ["left", "right"]:
		frame.add_theme_constant_override("margin_" + side, 28)
	frame.add_theme_constant_override("margin_top", 70)
	frame.add_theme_constant_override("margin_bottom", 70)
	overlay.add_child(frame)
	var center := CenterContainer.new()
	frame.add_child(center)
	var panel := PanelContainer.new()
	panel.add_theme_stylebox_override("panel", box(PANEL, 34, Color(0.14, 0.39, 0.24, 0.12), 1, 30, 28))
	panel.custom_minimum_size = Vector2(620, 0)
	center.add_child(panel)
	var col := vbox(18)
	panel.add_child(col)
	var head := hbox(16)
	var titles := vbox(2)
	if eyebrow_text != "":
		titles.add_child(eyebrow(eyebrow_text))
	titles.add_child(heading(title, 44))
	head.add_child(titles)
	var close_btn := button("Close", "secondary")
	close_btn.custom_minimum_size = Vector2(150, 64)
	close_btn.size_flags_vertical = Control.SIZE_SHRINK_BEGIN
	head.add_child(close_btn)
	col.add_child(head)
	var sc := scroll()
	sc.custom_minimum_size = Vector2(0, 200)
	col.add_child(sc)
	var body := vbox(18)
	sc.add_child(body)
	host.add_child(overlay)
	var close := func():
		if is_instance_valid(overlay):
			overlay.queue_free()
		if on_close.is_valid():
			on_close.call()
	close_btn.pressed.connect(close)
	# Size the scroll area to its content, up to the space the screen has.
	var fit := func():
		if not is_instance_valid(sc):
			return
		await host.get_tree().process_frame
		await host.get_tree().process_frame
		if not is_instance_valid(sc):
			return
		var avail: float = host.get_viewport_rect().size.y - 140.0 - head.size.y - 120.0
		sc.custom_minimum_size.y = minf(body.get_combined_minimum_size().y + 8.0, maxf(avail, 240.0))
	fit.call()
	body.minimum_size_changed.connect(func(): fit.call())
	close_btn.grab_focus.call_deferred()
	return {"overlay": overlay, "body": body, "close": close, "panel": panel}
