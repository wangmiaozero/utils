import Vue from 'vue'
import axios from 'axios'
import config from './config'
import router from '../router'

//因为Vue的底层原理也是往js原型上挂载方法,所以我们可以把axios挂载在全局
Vue.prototype.$http = axios;
// // 全局配置baseURL
// axios.defaults.baseURL = 'http://www.litc.pro:9999/v1';
//循环获取config对象的所有属性
//将所有属性赋值给axios.defaults
//自动挂载config的配置到axios默认配置中
for(const k in config){
    axios.defaults[k]=config[k]
}
const service = axios.create({
  //打包的时候把这个换成你域名 /api
 baseURL:'/api',
// baseURL:'http://api.taoxinmei.com', 
// baseURL:'http://api_test.taoxinmei.com', 
  headers: {
    'X-Custom-Header': 'foobar',
    'Content-Type': 'X-WWW-FORM-URLENCODED',
    'Access-Control-Allow-Credentials' : true,
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Methods':'GET,POST',
    'Access-Control-Allow-Headers':'application/json',
  },
  timeout: 15000 //请求超出时间
})
/* // 全局的 axios 默认值
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json'
axios.defaults.headers.patch['Content-Type'] = 'application/json' */
// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    let token = localStorage.getItem('token')||''
    config.headers.Authorization = token
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

  // 添加响应拦截器
  service.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    //console.log(response.data)
   // response = response.data
   checkResponseCode(response)
    return response;
  }, function (error) {
    // 对响应错误做点什么
     //后台服务异常  404 504 请求超时等
    //window.console.err(error, error.response, error.message)
   /*  Vue.prototype.$message({
      showClonse:true,
      type:'error',
      message:error.response.data.errMsg
    }) */
    return Promise.reject(error);
  });

  const checkResponseCode = response => {
    switch (response.data.code) {
      case 0:
        return Promise.reject(response.data)
      case 500:
        alert("服务异常500")
        console.log("我是拦截")
        break;
      case 404:
         alert("请求出错(404)")
        return Promise.reject(response.data)
        //token失效
      case 40001:
         alert("token失效")
       return Promise.reject(response.data)
    }
   }
  export default service
