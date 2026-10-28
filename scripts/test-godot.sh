#!/usr/bin/env bash
# Runs the Godot port's headless tests (rules, save migration, shot rating, mini game rounds).
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
"$here/scripts/sync-godot-assets.sh" >/dev/null
godot="${GODOT:-$HOME/.local/bin/godot4}"
"$godot" --headless --path "$here/godot" --import >/dev/null 2>&1 || true
"$godot" --headless --path "$here/godot" res://tests/tests.tscn 2>&1 | grep -v "^Godot Engine" 
exit "${PIPESTATUS[0]}"
