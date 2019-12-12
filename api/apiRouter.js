import axios from './index'
// eslint-disable-next-line camelcase
// 发送验证码
export const sendCode = (data) => { return axios.post('/yy/yylogin/send_sms',data) }
// eslint-disable-next-line no-sequences
// 用户直接手机登录 因为忘记密码和这个接口是同一个
export const usersignup = (data) => { return axios.post(`/yy/yylogin/user_login_mobile`,data) }
// 用户账号密码登录
export const usersignin = (data) => { return axios.post(`/yy/yylogin/user_login_password`,data) }
// 用户退出登录
export const userOut= (data) => { return axios.get(`/yy/yylogin/user_out`) }
