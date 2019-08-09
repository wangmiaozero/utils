export default ({ config, response }) => {
  const debug = true
  if (debug) {
    // 请求
    if (config) {
      window.console.groupCollapsed(`%c[${config.method}]`, 'color:#ffb400', config.baseURL + config.url)
      // console.log('%c[Content-Type]', 'color:#ffb400', config.method, config.headers[config.method]['Content-Type'])
      // console.log('%c[X-Access-Token]', 'color:#ffb400', config.headers['X-Access-Token'])
      if (config.method === 'get' || config.method === 'delete') {
        window.console.log('%c[params]', 'color:#ffb400', config.params)
      } else {
        window.console.log('%c[data]', 'color:#ffb400', config.data)
      }
      window.console.dir(config)
      window.console.groupEnd()
    }

    // 响应
    if (response) {
      if (response.data.code === 0) {
      window.console.groupCollapsed(`%c[响应成功]`, 'color:#27ae60', response.config.url)
      window.console.log('%c[data]', 'color:#ffb400', response.data.data)
      window.console.dir(response.data)
      window.console.groupEnd()
      } else {
      window.console.group(`%c[响应错误]`, 'color:#e1514c', response.config.url)
      window.console.log('%c[code]', 'color:#e1514c', response.data.code)
      window.console.log('%c[msg]', 'color:#e1514c', response.data.msg)
      window.console.groupEnd()
      }
    }
  }
}
