import $http from '@/api/index';
export const ubussiteinfo  = () =>{ return $http.get('/admin/ubussiteinfo/info')}
export const getBanner = () => {return $http.get('/txm/txmhome/get_banner_list')}

