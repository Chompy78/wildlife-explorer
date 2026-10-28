#!/usr/bin/env bash
# Runs the Godot port's headless tests: rules/data checks, then a smoke test that builds every screen.
# Fails on any failed check or any script error.
set -uo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
"$here/scripts/sync-godot-assets.sh" >/dev/null
godot="${GODOT:-$HOME/.local/bin/godot4}"
"$godot" --headless --path "$here/godot" --import >/dev/null 2>&1 || true
fail=0
out="$("$godot" --headless --path "$here/godot" res://tests/tests.tscn 2>&1 | grep -v '^Godot Engine')"; echo "$out"
echo "$out" | grep -q "SCRIPT ERROR" && fail=1
echo "$out" | grep -qE "[0-9]+ checks, 0 failed" || fail=1
out="$("$godot" --headless --path "$here/godot" res://tests/smoke.tscn 2>&1 | grep -v '^Godot Engine')"; echo "$out"
echo "$out" | grep -q "SCRIPT ERROR" && fail=1
echo "$out" | grep -q "smoke: opened" || fail=1
exit $fail
