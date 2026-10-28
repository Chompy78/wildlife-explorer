extends Node
## Calm synthesized sound (no audio files): shutter, great-shot and new-photo effects plus a quiet,
## slowly swelling noise bed per habitat. One mute switch, remembered in user://settings.cfg.

signal mute_changed

const RATE := 22050
const SETTINGS_PATH := "user://settings.cfg"

# Same recipes as the web game's src/audio/sound.ts.
const AMBIENT := {
	"park": ["lowpass", 700.0, 0.4, 0.035, 0.12],
	"forest": ["bandpass", 1400.0, 0.6, 0.03, 0.18],
	"lake": ["lowpass", 900.0, 0.8, 0.04, 0.4],
	"mountains": ["lowpass", 380.0, 0.5, 0.05, 0.08],
	"rainforest": ["bandpass", 2200.0, 0.8, 0.03, 0.25],
	"safari": ["bandpass", 600.0, 0.5, 0.035, 0.1],
	"desert": ["bandpass", 700.0, 0.4, 0.03, 0.06],
	"arctic": ["bandpass", 1800.0, 0.3, 0.03, 0.05],
	"coral-reef": ["lowpass", 600.0, 1.2, 0.04, 0.3],
	"wetlands": ["bandpass", 1000.0, 0.7, 0.03, 0.2],
	"coastal": ["lowpass", 1100.0, 0.4, 0.06, 0.15],
	"grassland": ["bandpass", 900.0, 0.4, 0.03, 0.12],
	"taiga": ["lowpass", 500.0, 0.6, 0.04, 0.1],
	"volcanic-highlands": ["lowpass", 250.0, 1.0, 0.05, 0.35],
	"alien-planet": ["bandpass", 1500.0, 2.5, 0.025, 0.5],
}

var muted := false
var _effects := {}
var _ambient_cache := {}
var _ambient_player: AudioStreamPlayer
var _wanted_ambient := ""
var _playing_ambient := ""
var _fx_players: Array[AudioStreamPlayer] = []


func _ready() -> void:
	var cfg := ConfigFile.new()
	if cfg.load(SETTINGS_PATH) == OK:
		muted = bool(cfg.get_value("sound", "muted", false))
	_ambient_player = AudioStreamPlayer.new()
	add_child(_ambient_player)
	for i in 3:
		var p := AudioStreamPlayer.new()
		add_child(p)
		_fx_players.append(p)
	_effects["shutter"] = _tones([[1800.0, 0.0, 0.05, 0.04, true], [900.0, 0.06, 0.07, 0.04, true]])
	_effects["great"] = _tones([[660.0, 0.1, 0.25, 0.12, false], [880.0, 0.2, 0.25, 0.12, false], [1320.0, 0.3, 0.45, 0.12, false]])
	_effects["new_photo"] = _tones([[523.0, 0.0, 0.3, 0.12, false], [659.0, 0.12, 0.3, 0.12, false], [784.0, 0.24, 0.5, 0.12, false]])
	_effects["correct"] = _tones([[784.0, 0.0, 0.2, 0.1, false], [1047.0, 0.1, 0.3, 0.1, false]])


func set_muted(value: bool) -> void:
	muted = value
	var cfg := ConfigFile.new()
	cfg.set_value("sound", "muted", muted)
	cfg.save(SETTINGS_PATH)
	_sync_ambient()
	mute_changed.emit()


# --- effects -------------------------------------------------------------------------------------------------

func play(effect: String) -> void:
	if muted or not _effects.has(effect):
		return
	for p in _fx_players:
		if not p.playing:
			p.stream = _effects[effect]
			p.play()
			return
	_fx_players[0].stream = _effects[effect]
	_fx_players[0].play()


func shutter() -> void: play("shutter")
func great_shot() -> void: play("great")
func new_photo() -> void: play("new_photo")
func correct() -> void: play("correct")


# tones: [freq, start, duration, peak, square]
func _tones(tones: Array) -> AudioStreamWAV:
	var total := 0.0
	for t in tones:
		total = maxf(total, float(t[1]) + float(t[2]) + 0.02)
	var n := int(total * RATE)
	var buf := PackedFloat32Array()
	buf.resize(n)
	for t in tones:
		var start: int = int(float(t[1]) * RATE)
		var length: int = int(float(t[2]) * RATE)
		for i in length:
			if start + i >= n:
				break
			var time: float = float(i) / RATE
			var phase: float = TAU * float(t[0]) * time
			var wave: float = signf(sin(phase)) if t[4] else sin(phase)
			# soft attack and release so nothing clicks
			var attack: float = minf(1.0, time / 0.015)
			var release: float = minf(1.0, float(length - i) / (0.02 * RATE))
			buf[start + i] += wave * float(t[3]) * attack * release
	return _to_wav(buf, RATE, false)


func _to_wav(buf: PackedFloat32Array, rate: int, loop: bool) -> AudioStreamWAV:
	var bytes := PackedByteArray()
	bytes.resize(buf.size() * 2)
	for i in buf.size():
		bytes.encode_s16(i * 2, int(clampf(buf[i], -1.0, 1.0) * 32767.0))
	var wav := AudioStreamWAV.new()
	wav.format = AudioStreamWAV.FORMAT_16_BITS
	wav.mix_rate = rate
	wav.stereo = false
	wav.data = bytes
	if loop:
		wav.loop_mode = AudioStreamWAV.LOOP_FORWARD
		wav.loop_begin = 0
		wav.loop_end = buf.size()
	return wav


# --- ambient bed -----------------------------------------------------------------------------------------------

## Asks for a habitat's ambient bed ("" stops it). Follows the mute switch.
func set_ambient(kind: String) -> void:
	_wanted_ambient = kind
	_sync_ambient()


func _sync_ambient() -> void:
	if _ambient_player == null:
		return
	if _playing_ambient != "" and (muted or _playing_ambient != _wanted_ambient):
		_ambient_player.stop()
		_playing_ambient = ""
	if _playing_ambient == "" and _wanted_ambient != "" and not muted and AMBIENT.has(_wanted_ambient):
		_ambient_player.stream = _ambient_stream(_wanted_ambient)
		_ambient_player.volume_db = -6.0
		_ambient_player.play()
		_playing_ambient = _wanted_ambient


func _ambient_stream(kind: String) -> AudioStreamWAV:
	if _ambient_cache.has(kind):
		return _ambient_cache[kind]
	var r: Array = AMBIENT[kind]
	var rate := 11025
	var seconds := 8
	var n := rate * seconds
	var cycles := maxi(1, roundi(float(r[4]) * seconds))
	# biquad coefficients (RBJ cookbook)
	var w0 := TAU * float(r[1]) / rate
	var alpha := sin(w0) / (2.0 * float(r[2]))
	var b0: float
	var b1: float
	var b2: float
	if r[0] == "lowpass":
		b0 = (1.0 - cos(w0)) / 2.0
		b1 = 1.0 - cos(w0)
		b2 = b0
	else:
		b0 = alpha
		b1 = 0.0
		b2 = -alpha
	var a0 := 1.0 + alpha
	var a1 := -2.0 * cos(w0)
	var a2 := 1.0 - alpha
	var rng := RandomNumberGenerator.new()
	rng.seed = hash(kind)
	var buf := PackedFloat32Array()
	buf.resize(n)
	var x1 := 0.0
	var x2 := 0.0
	var y1 := 0.0
	var y2 := 0.0
	var level := float(r[3]) * 4.0
	for i in n:
		var x := rng.randf() * 2.0 - 1.0
		var y := (b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0
		x2 = x1
		x1 = x
		y2 = y1
		y1 = y
		var swell := 1.0 + 0.5 * sin(TAU * cycles * float(i) / n)
		buf[i] = y * level * swell
	var wav := _to_wav(buf, rate, true)
	_ambient_cache[kind] = wav
	return wav
