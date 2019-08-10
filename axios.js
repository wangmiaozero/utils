import axios from 'axios'
import qs from 'qs'
import router from '../../router'
import {Loading, Message} from 'element-ui'
let loadinginstace; //load加载
/**
 * axios请求拦截器
 * @param {object} config axios请求配置对象
 * @return {object} 请求成功或失败时返回的配置对象或者promise error对象
 * **/
axios.interceptors.request.use(config => {
  // 这里的config包含每次请求的内容
  //判断localStorage中是否存在api_token
  if (localStorage.getItem('api_token')) {
    //  存在将api_token写入 request header
    config.headers.apiToken = `${localStorage.getItem('api_token')}`;
  }
  loadinginstace = Loading.service({fullscreen: true}) // 请求打开loading
  return config;
}, err => {
  Message.error({
    message: '退出登陆',
    onClose: function () {
      //关闭时的回调函数, 参数为被关闭的 message 实例
      router.push({name: 'error-404'});
    }
  })
  return Promise.reject(err);
})
/**
 * axios 响应拦截器
 * @param {object} response 从服务端响应的数据对象或者error对象
 * @return {object} 响应成功或失败时返回的响应对象或者promise error对象
 **/
axios.interceptors.response.use(response => {
  loadinginstace.close();  // 响应成功关闭loading
  return response
}, error => {
  Message.error({
    message: '退出登陆',
    onClose: function () {
      router.push({name: 'error-404'});
    }
  })
  return Promise.resolve(error.response)
});
/**
 * 状态码
 */
function statusCode(response) {
  switch (response.status) {
    case 401:
      Message.error({
        message: '未授权，请登录',
        onClose: function () {
          router.push({name: 'error-404'});
        }
      })
      break
    case 403:
      Message.error({
        message: '拒绝访问',
        onClose: function () {
          router.push({name: 'error-403'});
        }
      })
      break
    case 404:
      Message.error({
        message: '请求地址出错',
        onClose: function () {
          router.push({name: 'error-404'});
        }
      })
      break
    case 408:
      Message.error({
        message: '请求超时',
        onClose: function () {
          router.push({name: 'error-404'});
        }
      })
      break
    case 500:
      Message.error({
        message: '服务器内部错误',
        onClose: function () {
          router.push({name: 'error-500'});
        }
      })
      break
    default:
      return response
  }
}
/**
 * 请求发出后检查返回的状态码,统一捕获正确和错误的状态码，正确就直接返回response,错误就自定义一个返回对象
 * @param {object} response 响应对象
 * @return {object} 响应正常就返回响应数据否则返回错误信息
 **/
function checkStatus(response) {
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    if (response.data.resultCode == '-1') {
      Message.error({
        message: '请求出错',
        onClose: function () {
          router.push({name: 'error-404'});
        }
      })
    } else {
      return response
    }
  }else {
    // 异常状态下，把错误信息返回去
    return statusCode(response)
    // return {
    //   data:{
    //     status: 404,
    //     resultCode:'-1',
    //     resultMsg:'网络异常',
    //   }
    // }
  }
}
/**
 * 检查完状态码后需要检查后如果成功了就需要检查后端的状态码处理网络正常时后台语言返回的响应
 * @param {object} res 是后台返回的对象或者自定义的网络异常对象，不是http 响应对象
 * @return {object} 返回后台传过来的数据对象，包含code,message,data等属性，
 */
function checkCode(res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.data && (res.status !== 200)) {
    return statusCode(res)
  }
  return res
}
// 请求方式的配置
export default {
  post(url, data) {  //  post
    return axios({
      method: 'post',
      baseURL: process.env.BASE_URL,
      url,
      data: qs.stringify(data),
      timeout: 5000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  get(url, params) {  // get
    return axios({
      method: 'get',
      baseURL: process.env.BASE_URL,
      url,
      params, // get 请求时带的参数
      timeout: 5000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  }
}
