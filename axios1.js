import axios from 'axios'               // 引入axios
import router from '../../router'       // 引入路由
import {
  Message
} from 'element-ui';                    // 引入ele-ui的消息提示部分
import querystring from 'querystring'   // querystring 转化参数在后台表单格式提交时需要使用

let cancel, promiseArr = {}
const CancelToken = axios.CancelToken;

// "请求" 拦截器,过滤重复的请求
axios.interceptors.request.use(config => {
  //发起请求时，取消掉当前正在进行的相同请求
  if (promiseArr[config.url]) {
    promiseArr[config.url]('操作取消')
    promiseArr[config.url] = cancel
  } else {
    promiseArr[config.url] = cancel
  }
  return config
}, error => {
  return Promise.reject(error)
})

// "响应" 拦截器即异常处理 
axios.interceptors.response.use(response => {
  // 获取token并把token放在sessionStorage中,根据实际需求选择存储方式即可
  let list = response.data.list;      // 根据实际数据结构取得返回的token
  if (list.hasOwnProperty("token")) {
    sessionStorage.setItem('token', list.token);
    axios.defaults.headers.token = sessionStorage.getItem('token');
  }
  return response;
}, err => {
  // 请求的错误判断,根据不同的错误码不同消息提醒
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '错误请求'
        break;
      case 401:
        err.message = '未授权，请重新登录'
        break;
      case 403:
        router.push("/")
        err.message = '拒绝访问，请重新登录'
        break;
      case 404:
        err.message = '请求错误,未找到该资源'
        break;
      case 405:
        err.message = '请求方法未允许'
        break;
      case 408:
        err.message = '请求超时'
        break;
      case 500:
        err.message = '服务器端出错'
        break;
      case 501:
        err.message = '网络未实现'
        break;
      case 502:
        err.message = '网络错误'
        break;
      case 503:
        err.message = '服务不可用'
        break;
      case 504:
        err.message = '网络超时'
        break;
      case 505:
        err.message = 'http版本不支持该请求'
        break;
      default:
        err.message = `连接错误${err.response.status}`
    }
  } else {
    err.message = "连接到服务器失败"
  }
  Message.error(err.message)                     // 错误提示,记得引入message
  return Promise.resolve(err.response)
})

// 设置默认
axios.defaults.baseURL = url;                   // 请求的公共地址(例如：api.XXX.com)

//设置默认请求头
axios.defaults.headers = {
  "content-type": "application/json",           // 设置传输类型(json,form表单)
  "token": sessionStorage.getItem('token')      // token
}

axios.defaults.timeout = 10000                  // 响应时间

// 各种请求方式,仿照get的方式写即可
export default {
  //get请求
  get(url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: url,
        params: querystring.stringify(param),   // 表单形式提交
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res)
      })
    })
  },
  //post请求
  post(url, param) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: url,
        data: JSON.stringify(param),           //json方式提交
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resolve(res)
      })
    })
  },
  put(url, param) {

  },
  delete(url, param) {

  }
};