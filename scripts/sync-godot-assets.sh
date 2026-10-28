#!/usr/bin/env bash
# Copies the web game's art into the Godot project (godot/assets is git-ignored: public/assets stays the
# single source of truth). Run before opening, testing or exporting the Godot project.
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$here/godot/assets"
rsync -a --delete --exclude='*.import' "$here/public/assets/" "$here/godot/assets/"
echo "synced $(find "$here/godot/assets" -type f | wc -l) asset files"
