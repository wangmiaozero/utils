precision highp float;
uniform sampler2D u_sampler;
uniform sampler2D u_sampler_depth;// 深度贴图采样器
uniform vec2 u_offset;// 深度贴图的偏移
varying vec2 v_uv;
void main() {
  float depth = texture2D(u_sampler_depth, v_uv).r;// 获取深度信息
  gl_FragColor = texture2D(u_sampler, v_uv + depth * u_offset);
}