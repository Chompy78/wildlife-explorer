#!/usr/bin/env bash
# Exports the Godot port as a web build into godot/build/web (single-threaded, so it needs no special
# server headers). Serve it with:  python3 -m http.server -d godot/build/web 8060
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
"$here/scripts/sync-godot-assets.sh" >/dev/null
godot="${GODOT:-$HOME/.local/bin/godot4}"
mkdir -p "$here/godot/build/web"
"$godot" --headless --path "$here/godot" --import >/dev/null 2>&1 || true
"$godot" --headless --path "$here/godot" --export-release Web "$here/godot/build/web/index.html" 2>&1 | grep -E "ERROR|error|Export" | grep -v "leaked" || true
ls -la "$here/godot/build/web" | head -12
