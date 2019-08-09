import { axios } from '@/utils/axios/request'

//获取home轮播图
export const getBanner = () => {
  return axios.get('/txm/txmhome/get_banner_list')
}
// 获取账号
export const get_recommend = () => {
  return axios.get('/txm/txmhome/get_recommend_list')
}
// 抖音列表
export const get_list_douyin = (data) => {
  return axios.post('/txm/txmhome/shop_list_douyin',data)
}
//获取详情页
export const get_shop_detail = (data) =>{
  return axios.get(`/txm/txmhome/get_shop_detail?${data}`,)
}
//发送验证码
export const get_check_code = (data) => {
  return axios.post(`/txm/txmlogin/send_sms?${data}`)
}
//用户用手机号登录或者注册
export const userLogin = (data) =>{
  return axios.get(`/txm/txmlogin/user_login_mobile?${data}`,)
}
// 用户退出
export const outUser = (data) =>{
  return axios.post(`/txm/txmlogin/user_out?${data}`)
}
//用户用账号密码登录
export const user_login_password = (data) =>{
  return axios.get(`/txm/txmlogin/user_login_password?${data}`)
}

