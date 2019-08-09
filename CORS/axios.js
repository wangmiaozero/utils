
import axios from 'axios'
import printLog from './log'

//创建axios实例
const fetch = axios.create({
  baseURL:'/api',
  timeout: 15000
})

// 修改 axios 实例默认配置
fetch.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
fetch.defaults.headers.put['Content-Type'] = 'application/json'
fetch.defaults.headers.patch['Content-Type'] = 'application/json'

//request拦截器
fetch.interceptors.request.use(
  config =>{
    if (config.method === 'get') {
      if (config.params === undefined) {
        config.params = {}
      }
      config.params = {
        ...config.params,
        ...(config.params.filter
          ? {
          filter: JSON.stringify(config.params.filter)
          }
          :{})
      }
    }
    printLog({ config })
    return config
  },
  error =>{
    //网络没建立成功
   window.console.error(error)
    return Promise.reject(error)
  }
)

//response拦截器
fetch.interceptors.response.use(
  response =>{
    printLog({ response })
    if (response.status === 200) {
      return checkResponseCode(response)
    } else {
      //window.console.log(response)
    }
  },
  error => {
    //后台服务异常  404 504 请求超时等
    //window.console.err(error, error.response, error.message)
    return Promise.reject(error.response)
  }
)

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

export default fetch

