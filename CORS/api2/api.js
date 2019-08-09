import Vue from 'vue'
import modules from '@/api'

const api = {
//实例化axios  用$api代替
  install(Vue) {
    Vue.prototype.$api = modules
    Vue.$api = modules
  },
  $api: modules
}

Vue.use(api)
