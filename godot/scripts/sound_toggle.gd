class_name SoundToggle
extends Button
## One mute switch for effects and ambient sound (remembered between visits).


func _ready() -> void:
	var s := UI.button("", "secondary")
	for state in ["normal", "hover", "pressed", "focus"]:
		add_theme_stylebox_override(state, s.get_theme_stylebox(state))
	add_theme_font_size_override("font_size", 26)
	add_theme_color_override("font_color", Color("#1f5133"))
	add_theme_color_override("font_hover_color", Color("#1f5133"))
	add_theme_color_override("font_pressed_color", Color("#1f5133"))
	custom_minimum_size = Vector2(0, 64)
	pressed.connect(func(): Sfx.set_muted(not Sfx.muted))
	Sfx.mute_changed.connect(_refresh)
	_refresh()


func _refresh() -> void:
	text = "%s Sound %s" % ["🔇" if Sfx.muted else "🔊", "off" if Sfx.muted else "on"]
