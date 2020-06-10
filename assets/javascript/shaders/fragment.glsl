uniform vec3 iResolution;
uniform float iTime;
uniform float iTimeDelta;
uniform float iFrame;

varying vec2 vUv;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 position = fragCoord.xy;
    vec2 uv = fragCoord.xy / iResolution.xy;
    // vec2 uv = vUv;

	fragColor = vec4(1.0, 1.0, 1.0, 1.0);
}

void main()
{
    mainImage(gl_FragColor, vUv * iResolution.xy);
}