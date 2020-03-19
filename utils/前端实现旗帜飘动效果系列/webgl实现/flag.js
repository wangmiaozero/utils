(function () {

  var canvas = document.getElementById('flag-canvas')
  var gl

  var imgWidth, imgHeight
  var canvasWidth, canvasHeight

  var image = new Image()

  var vShaderSrc, fShaderSrc

  var eleSize = 0  // 每个顶点分量大小
  var vertexCount = 0 // 顶点数量

  ShaderUtil.getSrcFromUrl('vertexShader.vert', function (src) {
    vShaderSrc = src
    onAllLoaded()
  })
  ShaderUtil.getSrcFromUrl('fragmentShader.frag', function (src) {
    fShaderSrc = src
    onAllLoaded()
  })

  function onAllLoaded () {
    if (!vShaderSrc || !fShaderSrc) {
      return false
    }

    image.src = './flag.jpg'
    image.onload = function () {

      var IMG_MAX_WIDTH = 800
      var IMG_MAX_HEIGHT = 600
      imgWidth = Math.floor(image.width)
      imgHeight = Math.floor(image.height)
      if (imgWidth > IMG_MAX_WIDTH) {
        imgHeight *= (IMG_MAX_WIDTH / imgWidth)
        imgWidth = IMG_MAX_WIDTH
      }
      if (imgHeight > IMG_MAX_HEIGHT) {
        imgWidth *= (IMG_MAX_HEIGHT / imgHeight)
        imgHeight = IMG_MAX_HEIGHT
      }
      canvasWidth = imgWidth
      canvasHeight = imgHeight
      canvas.width = canvasWidth
      canvas.height = canvasHeight

      gl = canvas.getContext('webgl')
      if (!gl) {
        throw Error('浏览器不支持WebGL')
      }

      var shader = new Shaders(gl, vShaderSrc, fShaderSrc)

      var aPosition = gl.getAttribLocation(shader.program, 'a_Position')
      var uDistance = gl.getUniformLocation(shader.program, 'u_Distance')

      // 创建顶点缓冲区
      createVerticesBuffer()
      // a_Position指向缓冲区对象
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, eleSize * 2, 0)
      // 允许a_Position访问缓冲区
      gl.enableVertexAttribArray(aPosition)

      // 创建纹理对象
      createTexture()
      var uSampler = gl.getUniformLocation(shader.program, 'u_Sampler')
      // 将0号纹理传给取色器变量
      gl.uniform1i(uSampler, 0)

      draw()
      tick()

      function draw () {
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount)
      }

      var speed = 1

      var stop = false
      var timeLast = Date.now()
      var timeNow
      var delta
      var fps = 70
      var interval = 1000 / fps

      var distance = 0

      function tick () {
        if (stop) return false
        timeNow = Date.now()
        delta = timeNow - timeLast
        if (delta > interval) {
          timeLast = timeNow
          distance += delta * 0.001 * speed
          gl.uniform1f(uDistance, distance)
          draw()
        }
        requestAnimationFrame(tick)
      }
    }

  }

  /**
   * 创建顶点缓冲区
   */
  function createVerticesBuffer () {
    var vertices = []
    var x
    for (var i = 0; i <= imgWidth; i++) {
      x = -1 + 2 * i / imgWidth  // webgl 坐标 -1 -> 1
      vertices.push(x, -1, x, 1)  // 每列的上下顶点坐标
    }
    vertexCount = 2 * (imgWidth + 1)
    vertices = new Float32Array(vertices)
    eleSize = vertices.BYTES_PER_ELEMENT

    var buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    return buffer
  }

  /**
   * 创建纹理
   */
  function createTexture () {
    // 创建纹理对象
    var texture = gl.createTexture()

    // Y轴翻转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
    // 开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0)
    // 绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture)
    // 设置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    // 传入纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
  }

})()
