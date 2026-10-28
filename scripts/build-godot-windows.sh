#!/usr/bin/env bash
# Exports the Godot port as a single Windows .exe (data embedded) into godot/build/windows.
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
"$here/scripts/sync-godot-assets.sh" >/dev/null
godot="${GODOT:-$HOME/.local/bin/godot4}"
mkdir -p "$here/godot/build/windows"
"$godot" --headless --path "$here/godot" --import >/dev/null 2>&1 || true
"$godot" --headless --path "$here/godot" --export-release "Windows Desktop" "$here/godot/build/windows/WildlifeExplorer.exe" 2>&1 | grep -E "ERROR|error" | grep -v leaked || true
ls -la "$here/godot/build/windows"
