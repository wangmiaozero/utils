import $http from './index';
export const user_list  = () =>{ return $http.post('/txm/txmadmin/user_list')}
export const getBanner = () => {return $http.get('/txm/txmhome/get_banner_list')}

