export default {
  install(Vue) {
    var that = this
    // 1. 添加全局方法或属性
    // ue.global = this
    // 2. 添加全局资源
    // 3. 注入组件
    Vue.mixin({
      created() {
        this.global = that
      }
    })
    // 大于一的整数验证，this.$jfjl，所有验证方法无判空功能，如若判空，请用required: true
    Vue.prototype.$zsReg = (rule, value, callback) => {
      let reg = /^(([1-9]\d+)|[1-9])?$/ //大于一的整数
      if (reg.test(value) || !value) {
        callback()
      } else {
        return callback(new Error('请输入大于1的整数'))
      }
    }
    // 金额的校验
    Vue.prototype.$jeReg = (rule, value, callback) => {
      if (value > 200 || value < 1) {
        callback(new Error('请输入小于200并且大于1的数字'))
      } else {
        let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/ //1-200的数字，小数点后保留两位
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('请输入正确的金额'))
        }
      }
    }
    Vue.prototype.$jeRegMax = (rule, value, callback) => {
      let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/ //小数点后保留两位
      if (reg.test(value) || !value) {
        callback()
      } else {
        return callback(new Error('请输入正确的金额'))
      }
    }
    // 手机号的验证
    Vue.prototype.$sjhReg = (rule, value, callback) => {
      let reg = /^1[345789]\d{9}$/ //手机号码正则
      if (reg.test(value)) {
        callback()
      } else {
        return callback(new Error('请输入正确的手机号'))
      }
    }
    // 密码校验
    Vue.prototype.$parsswordReg = (rule, value, callback) => {
      let reg = /^(?![0-9]*$)[a-zA-Z0-9]{6,20}$/ //密码校验
      if (reg.test(value)) {
        callback()
      } else {
        return callback(
          new Error('密码需要包含6-20位数字或字母，至少包含一位字母')
        )
      }
    }
    Vue.prototype.$webReg = (rule, value, callback) => {
      let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/ //网址的校验
      if (reg.test(value)) {
        callback()
      } else {
        return callback(new Error('链接地址不正确'))
      }
    }
    Vue.prototype.$dateFormat = timestamp => {
      var date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-'
      var M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      var D =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      var h =
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      var m =
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':'
      var s =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + M + D + h + m + s
    }
    Vue.prototype.$dateFormatDay = timestamp => {
      var date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-'
      var M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      var D =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      return Y + M + D
    }
  }
}
/* import global from './global'
Vue.use(global) */
