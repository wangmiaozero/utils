const Koa = require('koa')
const Router = require('koa-router')
const fs = require('fs')
const path = require('path')
const views = require('koa-views')
const dlXlsx = require('./dlXlsx.js')
const app = new Koa()
const router = new Router()
const config = require('./config/index')
const { getIPAddress } = require('./getIP')
const timeFn = require('./time')
//加载模版引擎
app.use(
  views(path.join(__dirname, './views'), {
    extension: 'html'
  })
)

//页面渲染
router.get('/', async ctx => {
  await ctx.render('main')
})
//下载请求处理
router.get('/download', async ctx => {
  //生成xlsx文件
  await dlXlsx()
  //类型
  ctx.type = '.xlsx'
  //请求返回，生成的xlsx文件 readFileSync()方法是其同步方法的版本
  ctx.body = fs.readFileSync(`output.xlsx`)
  //请求返回后，删除生成的xlsx文件 要删除文件的路径',回调函数
  fs.unlink('output.xlsx', err => {
    if (!err) {
      console.log('删除成功!')
    }
  })
})
// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods())
app.listen(config.port, config.ip, () => {
  console.log(
    ` serve runing at http://${getIPAddress()}:${
      config.port
    } \n serve runing at http://localhost:${config.port}`
  )
})
