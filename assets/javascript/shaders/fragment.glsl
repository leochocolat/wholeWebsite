uniform vec3 u_resolution;

uniform vec3 u_primary_color;
uniform vec3 u_secondary_color;
uniform vec3 u_third_color;

uniform sampler2D u_noise_texture;

uniform float u_primary_position;
uniform float u_secondary_position;
uniform float u_third_position;

uniform float u_time;

varying vec2 vUv;


vec4 LinearVertGradient(float yCoord, vec4 color_1, float alpha_color_1, float location_color_1, vec4 color_2, float alpha_color_2, float location_color_2, vec4 color_3, float alpha_color_3, float location_color_3) {
  color_1.a = alpha_color_1;
  color_2.a = alpha_color_2;
  color_3.a = alpha_color_3;
  
  float mPct1 = smoothstep(location_color_1, location_color_2, yCoord);
  
  return mix(color_1, color_2, mPct1);
}

void main() {
  vec4 primary_color = vec4(u_primary_color.x, u_primary_color.y, u_primary_color.z, 1.0);
  vec4 secondary_color = vec4(u_secondary_color.x, u_secondary_color.y, u_secondary_color.z, 1.0);
  vec4 third_color = vec4(u_third_color.x, u_third_color.y, u_third_color.z, 1.0);

  float noise = texture2D(u_noise_texture, vUv).r;

  vec4 gradientTexel = LinearVertGradient(vUv.y, primary_color, 1.0, u_primary_position, secondary_color, 1.0, u_secondary_position, third_color, 1.0, u_third_position);
  gradientTexel.rgb += mix(-0.5/255.0, 0.5/255.0, noise);
  
	gl_FragColor = gradientTexel;
}