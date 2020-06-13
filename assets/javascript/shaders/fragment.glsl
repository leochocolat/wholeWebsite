uniform vec3 u_resolution;

uniform vec3 u_primary_color;
uniform vec3 u_secondary_color;

uniform float u_primary_position;
uniform float u_secondary_position;

uniform float u_time;

varying vec2 vUv;

vec4 LinearVertGradient(float yCoord, vec4 color_1, float alpha_color_1, float location_color_1, vec4 color_2, float alpha_color_2, float location_color_2) {
  color_1.a = alpha_color_1;
  color_2.a = alpha_color_2;
  
  float mPct = smoothstep(location_color_1, location_color_2, yCoord);
  
  return mix(color_1, color_2, mPct);
}

void main() {
    vec4 primary_color = vec4(u_primary_color.x, u_primary_color.y, u_primary_color.z, 1.0);
    vec4 secondary_color = vec4(u_secondary_color.x, u_secondary_color.y, u_secondary_color.z, 1.0);

	vec4 pixelOut = LinearVertGradient(vUv.y, primary_color, 1.0, u_primary_position, secondary_color, 1.0, u_secondary_position);		
  
	gl_FragColor = pixelOut;
}