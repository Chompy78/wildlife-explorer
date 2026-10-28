class_name RoleScreen
extends Screen


func _ready() -> void:
	build("start", "Choose your explorer", "Pick a role")
	content.add_child(UI.muted("Each role gives a small bonus (Custom Character is saved for later). No role is the best choice - pick whichever explorer sounds most fun."))
	for role in Data.roles:
		content.add_child(UI.rich_button(role["name"], role["description"], "card", func(): main.select_role(role["id"])))
