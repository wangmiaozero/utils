precision mediump float;
uniform sampler2D u_Sampler;
varying vec2 v_UV;
varying float v_Slope;

void main() {
    vec4 color = texture2D( u_Sampler, v_UV );
    if( v_Slope > 0.0 ) {
        color = mix( color, vec4(0.0, 0.0, 0.0, 1.0), v_Slope * 300.0 );
    }
    if( v_Slope < 0.0 ) {
        color = mix( color, vec4(1.0), abs(v_Slope) * 300.0 );
    }
    if(v_UV.x < 0.0 || v_UV.x > 1.0 || v_UV.y < 0.0 || v_UV.y > 1.0) {
        color.a = 0.0;
    }
    gl_FragColor = color;
}
