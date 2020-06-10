uniform vec3 u_resolution;

uniform vec3 u_primary_color;
uniform vec3 u_secondary_color;
uniform vec3 u_third_color;

uniform float u_time;

varying vec2 vUv;


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec3 res = u_resolution;

    vec4 tex_primary = vec4(u_primary_color.x, u_primary_color.y, u_primary_color.z, 1.0);
    vec4 tex_secondary = vec4(u_secondary_color.x, u_secondary_color.y, u_secondary_color.z, 1.0);
    vec4 tex_third = vec4(u_third_color.x, u_third_color.y, u_third_color.z, 1.0);

    fragColor = tex_secondary;
}

void main()
{
    mainImage(gl_FragColor, vUv * u_resolution.xy);
}