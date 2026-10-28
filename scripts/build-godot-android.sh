#!/usr/bin/env bash
# Exports the Godot port as an Android APK (arm64, debug-signed, for private sideloading) into
# godot/build/android. Needs the Godot Android export templates, a JDK and the Android SDK configured in
# Godot's editor settings (export/android/*).
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
"$here/scripts/sync-godot-assets.sh" >/dev/null
godot="${GODOT:-$HOME/.local/bin/godot4}"
mkdir -p "$here/godot/build/android"
"$godot" --headless --path "$here/godot" --import >/dev/null 2>&1 || true
"$godot" --headless --path "$here/godot" --export-debug Android "$here/godot/build/android/WildlifeExplorer.apk" 2>&1 | grep -E "ERROR|error|Export" | grep -v leaked || true
ls -la "$here/godot/build/android"
