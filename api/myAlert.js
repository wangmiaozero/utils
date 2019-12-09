/* eslint-disable no-new */
window.alert = function (text) {
  // 透明遮罩层
  let mask = document.createElement('div')
  mask.style.position = 'fixed'
  mask.style.zIndex = 1000000
  mask.style.top = 0
  mask.style.bottom = 0
  mask.style.left = 0
  mask.style.right = 0
  // 实现alert
  let div = document.createElement('div')
  div.style.backgroundColor = '#000'
  div.style.color = '#fff'
  div.style.position = 'fixed'
  div.style.zIndex = 9999999
  div.style.opacity = 0.7
  div.style.top = '20%'
  div.style.left = '50%'
  div.style.lineHeight = '50px'
  div.style.borderRadius = '4px'
  div.style.fontSize = '0.24rem'
  div.style.textAlign = 'center'
  div.style.padding = '0 10px'
  div.className = 'animated  bounceInDown'
  div.id = 'alert'
  div.innerHTML = text
  document.getElementsByTagName('body')[0].appendChild(div)
  document.getElementsByTagName('body')[0].appendChild(mask)
  let selfObj = document.getElementById('alert')
  // 动态调整位置
  let alertWidth = window.getComputedStyle(selfObj, null).width
  div.style.marginLeft = -parseInt(alertWidth) / 2 + 'px'
  setTimeout(function () {
    document.getElementsByTagName('body')[0].removeChild(div)
    document.getElementsByTagName('body')[0].removeChild(mask)
  }, 3000)
}
