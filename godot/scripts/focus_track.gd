class_name FocusTrack
extends Control
## The camera's sweep track: a pale bar, a gold sweet spot in the middle and a marker moving along it.

var marker := 0.0
var spot_width := 0.2


func _init() -> void:
	custom_minimum_size = Vector2(0, 34)
	size_flags_horizontal = Control.SIZE_EXPAND_FILL


func set_state(new_marker: float, new_width: float) -> void:
	if absf(new_marker - marker) > 0.0005 or absf(new_width - spot_width) > 0.0005:
		marker = new_marker
		spot_width = new_width
		queue_redraw()


func _draw() -> void:
	var h := 14.0
	var y := (size.y - h) / 2.0
	var bar := StyleBoxFlat.new()
	bar.bg_color = Color(0.15, 0.44, 0.26, 0.2)
	bar.set_corner_radius_all(7)
	draw_style_box(bar, Rect2(0, y, size.x, h))
	var spot := StyleBoxFlat.new()
	spot.bg_color = Color("#f1b83b")
	spot.set_corner_radius_all(7)
	var sw := size.x * spot_width
	draw_style_box(spot, Rect2((size.x - sw) / 2.0, y - 3.0, sw, h + 6.0))
	var cx := size.x * marker
	draw_circle(Vector2(cx, size.y / 2.0), 15.0, Color("#267043"))
	draw_circle(Vector2(cx, size.y / 2.0), 11.0, Color.WHITE)
