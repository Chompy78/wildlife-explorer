#!/usr/bin/env bash
# Copies the web game's art into the Godot project as raw ".dat" files (godot/assets is git-ignored:
# public/assets stays the single source of truth). The ".dat" name keeps Godot from re-importing each image
# as a huge texture; Data.load_asset() decodes them at runtime. Run before testing or exporting.
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
rm -rf "$here/godot/assets"
mkdir -p "$here/godot/assets"
cd "$here/public/assets"
find . -type f \( -name '*.jpg' -o -name '*.png' \) | while read -r f; do
  mkdir -p "$here/godot/assets/$(dirname "$f")"
  cp "$f" "$here/godot/assets/$f.dat"
done
echo "synced $(find "$here/godot/assets" -type f | wc -l) asset files"
