import Vue from 'vue'
import axios from 'axios'
import config from './config'

// 因为Vue的底层原理也是往js原型上挂载方法,所以我们可以把axios挂载在全局
Vue.prototype.$http = axios
// // 全局配置baseURL
// axios.defaults.baseURL = 'http://www.litc.pro:9999/v1';
// 循环获取config对象的所有属性
// 将所有属性赋值给axios.defaults
// 自动挂载config的配置到axios默认配置中
for (const k in config) {
  axios.defaults[k] = config[k]
}
axios.defaults.headers.post['Content-Type'] = 'application/json'
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么 X-WWW-FORM-URLENCODED
  config.headers["Content-Type"] = "application/json";
  if (config.method == "get") {
    config.data = true;
  }
  config.headers["H-TOKEN"] = "2333";
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
  // console.log(response.data)
  response = response.data
  return response
}, function (error) {
  // 对响应错误做点什么
  Vue.prototype.$message({
    showClonse: true,
    type: 'error',
    message: error
  })
  return Promise.reject(error)
})
export default axios
