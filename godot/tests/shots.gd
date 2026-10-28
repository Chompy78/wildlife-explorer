extends Node
## Renders key screens to PNG files for visual review: godot4 --path godot res://tests/shots.tscn -- <out_dir>
## Needs a display (e.g. a virtual one) and the GL Compatibility renderer.

var main: Control
var out_dir := "/tmp"


func _ready() -> void:
	var args := OS.get_cmdline_user_args()
	if args.size() > 0:
		out_dir = args[0]
	get_window().size = Vector2i(720, 1280)
	main = load("res://scenes/main.tscn").instantiate()
	add_child(main)
	await _wait(3)
	var s := GameLogic.default_save()
	s["selectedRole"] = "zoologist"
	s["wildCamperUnlocked"] = true
	s["camperIntroductionSeen"] = true
	Save.apply(s)
	main.show_start(); await _snap("start")
	main.show_role_select(); await _snap("roles")
	main.show_park(); await _snap("park")
	main.show_camper(); await _snap("camper")
	main.open_biome("alien-planet"); await _snap("alien")
	var screen: BiomeScreen = main.current
	screen.open_camera(); await _snap("camera")
	var panel := _find_camera(screen)
	panel._tap("crystal-hopper"); await _snap("camera_after_tap")
	main.open_biome("lake"); await _snap("lake")
	var lake: BiomeScreen = main.current
	lake.open_camera(); await _wait(2)
	_find_camera(lake)._tap("great-blue-heron"); await _snap("reveal")
	main.show_minigames(); await _snap("minigames")
	var g: MiniGamesScreen = main.current
	g._open("memory"); await _snap("memory")
	g._open("who"); await _snap("who")
	g._open("pattern"); await _wait(6); await _snap("pattern")
	main.show_camper()
	await _wait(2)
	(main.current as CamperScreen).open_planner(); await _snap("planner")
	main.show_park(); await _wait(2)
	Overlays.journal(main.current); await _snap("journal")
	get_tree().quit(0)


func _wait(frames: int) -> void:
	for i in frames:
		await get_tree().process_frame


func _snap(name: String) -> void:
	await _wait(6)
	var img := get_viewport().get_texture().get_image()
	img.save_png("%s/%s.png" % [out_dir, name])


func _find_camera(node: Node) -> CameraPanel:
	for c in node.get_children():
		if c is CameraPanel:
			return c
		var f := _find_camera(c)
		if f:
			return f
	return null
