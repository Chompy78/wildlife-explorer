shader_type canvas_item;
// A soft blur for a missed Great Shot (the web game's CSS blur(3px)).
uniform float radius = 2.4;

void fragment() {
	vec2 px = TEXTURE_PIXEL_SIZE * radius;
	vec4 sum = vec4(0.0);
	for (int x = -4; x <= 4; x++) {
		for (int y = -4; y <= 4; y++) {
			sum += texture(TEXTURE, UV + vec2(float(x), float(y)) * px);
		}
	}
	COLOR = sum / 81.0;
}
