uniform float u_Distance;
attribute vec2 a_Position;
varying vec2 v_UV;
varying float v_Slope;

float PI = 3.14159;
float scale = 0.8;

void main() {

    float x = a_Position.x;
    float y = a_Position.y;

    float amplitude = 1.0 - scale; // 振幅
    float period = 2.0;  // 周期
    float waveLength = 2.0 * scale;

    v_UV = (mat3(0.625,0,0, 0,0.625,0, 0.5,0.5,1) * vec3(x, y, 1.0)).xy;
    y += amplitude * ( (x - (-scale)) / waveLength) * sin(2.0 * PI * (x - u_Distance));

    float x2 = x - 0.001;
    float y2 = a_Position.y + amplitude * ( (x2 - (-scale)) / waveLength) * sin(2.0 * PI * (x2 - u_Distance));

    v_Slope = y - y2;
    gl_Position = vec4(vec2(x, y), 0.0, 1.0);
}
