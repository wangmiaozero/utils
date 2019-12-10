import axios from './index'
// eslint-disable-next-line camelcase
export const user_list = () => { return axios.post('/txm/txmadmin/user_list') }
// eslint-disable-next-line no-sequences
export const getCode = (data) => { return axios.get(`/yy/yylogin/get_check_code?${data}`,) }
