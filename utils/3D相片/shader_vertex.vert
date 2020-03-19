attribute vec2 a_pos;
attribute vec2 a_uv;
uniform mat4 u_proj;
varying vec2 v_uv;
void main() {
  v_uv = a_uv; // 将纹理坐标传递到片元着色器
  gl_Position = u_proj * vec4(a_pos, 0.0, 1.0);
}