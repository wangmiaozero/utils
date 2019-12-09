import axios from './index'
// eslint-disable-next-line camelcase
export const user_list = () => { return axios.post('/txm/txmadmin/user_list') }
export const getBanner = () => { return axios.get('/txm/txmhome/get_banner_list') }
