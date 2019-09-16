const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
var md5 = require('./md5.js')
var app = getApp()
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//const url = "http://api_wx.xdm.com/"
//测试环境
// const url = "http://sendbox_wxapi.xindianmao.com/"
//正式环境
const url = "https://apiwx.xindianmao.com/"

const imgUrl = 'https://api.29ul.cn/'

var request = function (url1, method, data, func) {
  var time = new Date().getTime()
  var timestamp = time + 'XDM' + 'rtertDFGDS456798xdm';
  var d = { sign: md5.hexMD5(timestamp),check_time:time}
  d = Object.assign(d,data)
  wx.showLoading({
    title: 'Loading',
    mask:true
  })
  wx.request({
    url: url + url1,
    method: method,
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    }, // 设置请求的 header
    data: d,
    success: function (res) {
      setTimeout(function(){
        wx.hideLoading()
      },1000)
      switch (res.data.code) {
        case 0:
          func(res);
          break;
        case -1:
          break;
        default:
          func(res);
          // setTimeout(
          //   function(){
          //     wx.hideLoading('加载完成')
          //   }
          //  ,500            
          // )
          break;
      }
    },
    fail: function (e) {
        wx.hideLoading()
      wx.showModal({
        title: '提示',
        content: '请求超时了...',
        showCancel: false,
        confirmText: "知道了",
        confirmColor: "#3385ff"
      })
    },
    complete: function (res) {
    }
  })
}
var getToken = g => {
  wx.getStorage({
    key: 'token',
    success: function (res) {
      return res.data
    },
  })
}

module.exports = {
  formatTime: formatTime,
  url: url,
  request: request,
  imgUrl: imgUrl
}
