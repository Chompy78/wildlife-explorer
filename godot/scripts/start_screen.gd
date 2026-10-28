class_name StartScreen
extends Screen


func _ready() -> void:
	build("start", "", "")
	var save: Dictionary = Save.data
	content.alignment = BoxContainer.ALIGNMENT_CENTER
	content.size_flags_vertical = Control.SIZE_EXPAND_FILL
	var hero := UI.card(Color(1, 1, 1, 0.92), 40, 40)
	var col := UI.vbox(20)
	hero.add_child(col)
	col.add_child(UI.eyebrow("Milestone 4.1"))
	var title := UI.heading("Wildlife Explorer", 76)
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	col.add_child(title)
	var pitch := UI.label("Finish Tutorial Park, unlock the Wild Camper, and visit a world of calm wildlife habitats.", 28)
	pitch.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	col.add_child(pitch)
	if Save.has_save():
		var summary := UI.card(Color("#f3f9ee"), 22, 18)
		var s := UI.vbox(4)
		summary.add_child(s)
		s.add_child(UI.label("Saved adventure", 26, UI.TEXT, true))
		s.add_child(UI.muted("Role: %s" % Data.role_name(save["selectedRole"])))
		s.add_child(UI.muted("Animal photos: %d" % save["photographedAnimals"].size()))
		var q: Dictionary = save["questProgress"]["lostPuppy"]
		s.add_child(UI.muted("Lost Puppy: %s" % ("Completed" if q["completed"] else "In progress" if q["started"] else "Not started")))
		s.add_child(UI.muted("Wild Camper: %s" % ("Hub visited" if save["camperVisited"] else "Unlocked" if save["wildCamperUnlocked"] else "Locked")))
		col.add_child(s.get_parent())
	var new_btn := UI.button("New Game", "primary", func(): main.new_game())
	col.add_child(new_btn)
	var cont := UI.button("Continue", "secondary", func(): main.continue_game())
	cont.disabled = not Save.has_save()
	col.add_child(cont)
	col.add_child(UI.button("Mini Games", "secondary", func(): main.show_minigames()))
	var reset := UI.button("Reset Save", "ghost", func(): _confirm_reset())
	col.add_child(reset)
	content.add_child(hero)


func _confirm_reset() -> void:
	var m := UI.modal(self, "Reset your save?")
	m["body"].add_child(UI.label("This erases your photos, quests and Journal on this device. This cannot be undone.", 28))
	var row := UI.flow(12)
	row.add_child(UI.button("Yes, reset", "camper", func():
		Save.reset()
		Save.write()
		m["close"].call()
		main.show_start()))
	m["body"].add_child(row)
