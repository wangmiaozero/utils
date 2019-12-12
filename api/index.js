import Vue from 'vue'
import axios from 'axios'
import config from './config'
import ViewUI from 'view-design'
// 因为Vue的底层原理也是往js原型上挂载方法,所以我们可以把axios挂载在全局
// console.log(process.env.BASE_API)
Vue.prototype.$http = axios
// // 全局配置baseURL
// axios.defaults.baseURL = 'http://www.litc.pro:9999/v1';
// 循环获取config对象的所有属性
// 将所有属性赋值给axios.defaults
// 自动挂载config的配置到axios默认配置中
for (const k in config) {
  axios.defaults[k] = config[k]
}
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么 X-WWW-FORM-URLENCODED
  config.headers["Content-Type"] = "application/json;charset=UTF-8";
  if (config.method == "get") {
    config.data = true;
  }
  config.headers["Content-Type"] = "application/json";
  let token = localStorage.getItem('token') || ''
  config.headers.Authorization = token
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  checkResponseCode(response)
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
const checkResponseCode = response => {
  switch (response.data.errcode) {
    case 0:
      return response.data
      break;
    case 500:
      ViewUI.Message.error(response.data.errmsg)
      return response.data
      break;
    case 404:
      ViewUI.Message.error(response.data.errmsg)
      return response.data
      break;
    //token失效
    case 40001:
      ViewUI.Message.error(response.data.errmsg)
      return response.data
      break;
    case -1:
      return  ViewUI.Message.error(response.data.errmsg),response.data
      break;
  }
}
export default axios
