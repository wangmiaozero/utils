import axios from 'axios'
//创建axios实例
const service = axios.create({
  //打包的时候把这个换成你域名 /api
  baseURL:'/api', //'http://txm_home_test.xindianmao.com',
  timeout: 15000 //请求超出时间
})

//请求拦截
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

//响应拦截
service.interceptors.response.use(
  response=>{
    const { errcode, msg, data } = response.data
    if (errcode === 0) {
      return data
    } else {
      return promptError(errcode,msg,response.data)
    }
  },
  error => {
    const { status, statusText, data } = error.response
    return promptError(status, data.msg || statusText, error.response)

  }
)

/**
 * 提示错误
 * @param CODE 错误码
 * @param MSG 错误提示
 * @param REJECT reject 内容
 * @returns {Promise<never>}
 */
const promptError = (CODE, MSG, REJECT) => {
  //错误描述
  return Promise.reject(REJECT)
}
export { service as axios}

