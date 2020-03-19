/**
 * shader 相关工具方法
 */
var ShaderUtil = {
  /**
   * 创建着色器
   * @param gl
   * @param source 着色器代码
   * @param type 着色器类型
   */
  createShader: function (gl, source, type) {
    // 创建Shader对象
    var shader = gl.createShader(type)
    // 传入shader代码
    gl.shaderSource(shader, source)
    // 编译shader
    gl.compileShader(shader)
    // 获取编译结果
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      // 打印错误信息
      console.error('Compile shader source fail:\n\n' + source, '\n\n=====error log======\n\n', gl.getShaderInfoLog(shader))
      // 编译失败则删除着色器对象
      gl.deleteShader(shader)
      return null
    }

    return shader

  },

  /**
   * 创建 program
   * @param gl
   * @param vertexShader 顶点着色器对象
   * @param fragmentShader 片元着色器对象
   * @param validate 是否需要语法校验（开发时启用）
   */
  createProgram: function (gl, vertexShader, fragmentShader, validate) {

    // 创建空的 program 对象
    var program = gl.createProgram()
    // 将 顶点着色器对象 附着到 program
    gl.attachShader(program, vertexShader)
    // 将 片元着色器对象 附着到 program
    gl.attachShader(program, fragmentShader)
    // 链接 program 和已附着的 shader
    gl.linkProgram(program)

    // 获取链接状态
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      // 打印错误日志
      console.error('Creating shader program fail:\n', gl.getProgramInfoLog(program))
      // 链接失败则删除着色器对象
      gl.deleteProgram(program)
      return null
    }

    // 语法校验
    if (validate) {
      gl.validateProgram(program)
      if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('Error validating shader program:\n', gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
        return null
      }
    }

    gl.detachShader(program, vertexShader)
    gl.detachShader(program, fragmentShader)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)

    return program
  },

  /**
   * 通过顶点和片元着色器的源码创建program对象
   */
  createProgramFromSrc: function (gl, vertexShaderSrc, fragmentShaderSrc, validate) {
    var vShader = ShaderUtil.createShader(gl, vertexShaderSrc, gl.VERTEX_SHADER)
    var fShader = ShaderUtil.createShader(gl, fragmentShaderSrc, gl.FRAGMENT_SHADER)
    if (!vShader || !fShader) {
      // 任意一个创建失败就删除shader
      gl.deleteShader(vShader)
      gl.deleteShader(fShader)
      return null
    }
    return ShaderUtil.createProgram(
      gl,
      vShader,
      fShader,
      validate
    )
  },

  getSrcFromUrl: function (url, callback) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onreadystatechange = function () {
      //0：未初始化，还没有调用 open() 方法。
      //1：请求中，已调用 send() 方法，正在发送请求。
      //2：收到响应
      //3：正在解析响应内容。
      //4：内容解析完毕。
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          callback(xhr.responseText)
        }
      }
    }
    xhr.send()
  }
}

/**
 * 自定义shaders对象（包括顶点、片元着色器）
 * @param gl
 * @param vShaderSrc
 * @param fShaderSrc
 * @constructor
 */
var Shaders = function (gl, vShaderSrc, fShaderSrc) {
  var program = ShaderUtil.createProgramFromSrc(gl, vShaderSrc, fShaderSrc, true)

  if (program) {
    this.program = program
    this.gl = gl
    gl.useProgram(this.program)
  }

  /**
   * @return {Shaders}
   */
  this.activate = function () {
    gl.useProgram(program)
    return this
  }

  /**
   * @return {Shaders}
   */
  this.deactivate = function () {
    gl.useProgram(null)
    return this
  }

  /**
   * function helps clean up resources when shader is no longer needed.
   */
  this.dispose = function () {
    // 如果当前program激活状态则禁用
    if (gl.getParameter(gl.CURRENT_PROGRAM === program)) {
      this.deactivate()
    }
    gl.deleteProgram(program)
  }

}
