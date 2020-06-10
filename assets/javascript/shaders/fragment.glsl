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

//shadertoy
vec2 hash( vec2 x )  // replace this by something better
{
    const vec2 k = vec2( 0.3183099, 0.3678794 );
    x = x*k + k.yx;
    return -1.0 + 2.0*fract( 16.0 * k*fract( x.x*x.y*(x.x+x.y)) );
}

float noise( in vec2 p )
{
    vec2 i = floor( p );
    vec2 f = fract( p );
	
	vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                     dot( hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                     dot( hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

// -----------------------------------------------

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 p = fragCoord.xy / u_resolution.xy;

	vec2 uv = p*vec2(u_resolution.x/u_resolution.y,1.0);
	
	float f = 0.0;
	
    uv *= 8.0;
    mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
    f  = 0.5000*noise( uv ); uv = m*uv;
    f += 0.2500*noise( uv ); uv = m*uv;
    f += 0.1250*noise( uv ); uv = m*uv;
    f += 0.0625*noise( uv ); uv = m*uv;

	f = 0.5 + 0.5*f;
	
    f *= smoothstep( 0.0, 0.005, abs(p.x-0.6) );	
	
	fragColor = vec4( f * u_primary_color.x, f * u_primary_color.y, f * u_primary_color.z, 1.0 );
}

void main()
{
    mainImage(gl_FragColor, vUv * u_resolution.xy);
}