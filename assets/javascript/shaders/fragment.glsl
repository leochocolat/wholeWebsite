uniform vec3 u_resolution;

uniform vec3 u_primary_color;
uniform vec3 u_secondary_color;
uniform vec3 u_third_color;

uniform float u_time;

varying vec2 vUv;

// void mainImage( out vec4 fragColor, in vec2 fragCoord )
// {
// 	vec2 position = fragCoord.xy;
//     vec2 uv = fragCoord.xy / u_resolution.xy;
//     // vec2 uv = vUv;

// 	fragColor = vec4(1.0, 1.0, 1.0, 1.0);
// }

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec3 res = u_resolution;

    vec4 tex_1 = vec4(u_primary_color.x, u_primary_color.y, u_primary_color.y, 1.0);
    vec4 tex_2 = vec4(u_secondary_color.x, u_secondary_color.y, u_secondary_color.y, 1.0);
    // fragColor = mix(tex_1, tex_2, 1.0);

    // fragColor = vec4(u_secondary_color.x, u_secondary_color.y, u_secondary_color.z, 1.0);
    fragColor = vec4(0.0, 0.0, 0.0, 1.0);
}

void main()
{
    mainImage(gl_FragColor, vUv * u_resolution.xy);
}