class_name ShotRating
extends RefCounted
## Shot feedback and zoom tuning (port of src/data/shotRating.ts). Display only - every tap takes a photo.

const PERFECT_FRACTION := 0.2
const BASE_POINTS := {"nice": 10, "great": 50, "perfect": 100}
const ZOOM_LEVELS := ["wide", "close", "macro"]
const ZOOMS := {
	"wide": {"label": "Wide", "icon": "🔭", "speed": 1.0, "width": 1.0, "multiplier": 1.0, "blurb": "Relaxed. The whole scene."},
	"close": {"label": "Close", "icon": "📷", "speed": 0.8, "width": 0.8, "multiplier": 1.5, "blurb": "A little quicker. 1.5x points."},
	"macro": {"label": "Macro", "icon": "🔬", "speed": 0.6, "width": 0.65, "multiplier": 2.0, "blurb": "Fast and fine. 2x points."},
}


static func rate(position: float, width: float) -> String:
	var distance := absf(position - 0.5)
	if distance <= (width * PERFECT_FRACTION) / 2.0:
		return "perfect"
	return "great" if distance <= width / 2.0 else "nice"


static func next_streak(streak: int, rating: String) -> int:
	return 0 if rating == "nice" else streak + 1


static func message(rating: String, streak: int) -> String:
	if rating == "nice":
		return "Nice shot! Tap while the marker is in the glowing zone for a Great Shot."
	var base := "✨ Perfect shot!" if rating == "perfect" else "Great shot!"
	return "%s 🔥 %d in a row!" % [base, streak] if streak >= 2 else base


static func points(rating: String, zoom: String) -> int:
	return roundi(BASE_POINTS[rating] * ZOOMS[zoom]["multiplier"])


# --- sweet-spot tuning (port of CameraPanel.tsx) ----------------------------------------------------------

const FOCUS := {
	"easy": {"cycle_ms": 2200.0, "max_width": 0.42},
	"medium": {"cycle_ms": 1600.0, "max_width": 0.28},
	"hard": {"cycle_ms": 1100.0, "max_width": 0.16},
}
const MIN_WIDTH := 0.05
const START_FRACTION := 0.35
const SPECIES_MASTERY := 5.0
const GLOBAL_MASTERY := 60.0
const GLOBAL_BONUS := 0.15


static func sweet_spot_width(max_width: float, species_count: int, total_count: int) -> float:
	var species_fraction := START_FRACTION + (1.0 - START_FRACTION) * minf(1.0, species_count / SPECIES_MASTERY)
	var global_fraction := GLOBAL_BONUS * minf(1.0, total_count / GLOBAL_MASTERY)
	return maxf(MIN_WIDTH, max_width * (species_fraction + global_fraction))


static func triangle_wave(elapsed_ms: float, cycle_ms: float) -> float:
	var half := cycle_ms / 2.0
	var phase := fposmod(elapsed_ms, cycle_ms)
	return phase / half if phase <= half else (cycle_ms - phase) / half


## Role bonus: the Animal Researcher finds rare animals one tier easier.
static func effective_difficulty(role, animal: Dictionary) -> String:
	if role == "animal-researcher" and animal["rarity"] == "rare":
		return {"hard": "medium", "medium": "easy", "easy": "easy"}[animal["photoDifficulty"]]
	return animal["photoDifficulty"]


static func total_photos(save: Dictionary) -> int:
	var n := 0
	for k in save["photographCounts"]:
		n += int(save["photographCounts"][k])
	return n
