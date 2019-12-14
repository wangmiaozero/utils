const Koa = require('koa')
const router = require('koa-router')()
const fs = require('fs')
const nodeExcel = require('excel-export')
const csv = require('csv')
const dict = require('gbk-dict').init() //调用gbk-dict中的init这个方法
const xlsx = require('node-xlsx')
const { getIPAddress } = require('./getIP')
const config = require('./config/index')
const app = new Koa()
app.use(router.routes())
router.get('/', ctx => {
  ctx.body = fs.readFileSync('./index.html', 'utf-8')
})

//导出Excel，xlsx格式
router.get('/exportexcel', async ctx => {
  async function readydata() {
    //做点什么，如从数据库取数据
    let exceldata = [
      { name: '张三', age: '20', sex: '男', birthday: '1998-10-10' },
      { name: '李四', age: '21', sex: '男', birthday: '1997-08-08' },
      { name: '王五', age: '22', sex: '男', birthday: '1996-06-06' },
      { name: '赵六', age: '20', sex: '男', birthday: '1998-12-12' }
    ]
    return exceldata
  }
  //导出
  async function exportdata(v) {
    let conf = {}
    conf.name = 'mysheet' //表格名
    let alldata = new Array()
    for (let i = 0; i < v.length; i++) {
      let arr = new Array()
      arr.push(v[i].name)
      arr.push(v[i].age)
      arr.push(v[i].sex)
      arr.push(v[i].birthday)
      alldata.push(arr)
    }
    //决定列名和类型
    conf.cols = [
      {
        caption: '姓名',
        type: 'string'
      },
      {
        caption: '年龄',
        type: 'number'
      },
      {
        caption: '性别',
        type: 'string'
      },
      {
        caption: '出生日期',
        type: 'string'
        //width:280
      }
    ]
    conf.rows = alldata //填充数据
    let result = nodeExcel.execute(conf)
    //最后3行express框架是这样写
    // res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    // res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
    // res.end(result, 'binary');
    let data = new Buffer(result, 'binary')
    ctx.set('Content-Type', 'application/vnd.openxmlformats')
    ctx.set('Content-Disposition', 'attachment; filename=' + 'Report.xlsx')
    ctx.body = data
  }
  let r = await readydata()
  r = await exportdata(r)
})
//导入Excel，xlsx格式
const xlsxfile = 'E:/xlsx格式.xlsx'
router.post('/importexcelxlsx', async ctx => {
  async function analysisdata() {
    return new Promise((resolve, reject) => {
      //解析xlsx
      let obj = xlsx.parse(xlsxfile)
      resolve(obj)
    })
  }
  async function readdata(v) {
    console.log('xlsx =', v) //xlsx = [ { name: 'Sheet1', data: [ [Array], [Array], [Array] ] } ]
    console.log('数据 = ', v[0]) //数据 =  { name: 'Sheet1',
    //        data: [ [ '姓名', '年龄' ], [ '张三', 20 ], [ '李四', 30 ] ]}
    console.log('要上传的数据 = ', v[0].data) //要上传的数据 =  [ [ '姓名', '年龄' ], [ '张三', 20 ], [ '李四', 30 ] ]
    ctx.body = v
  }
  let r = await analysisdata()
  r = await readdata(r)
})
//导入Excel，csv格式
const csvfile = 'E:/csv格式.csv'
router.post('/importexcelcsv', async ctx => {
  async function analysisdata() {
    return new Promise((resolve, reject) => {
      //解析csv
      let output = new Array() //创建数组
      let parser = csv.parse({ delimiter: ',' }) //调用csv模块的parse方法
      let input = fs.createReadStream(csvfile) //调用fs模块的createReadStream方法
      input.on('data', function(data) {
        parser.write(dict.gbkToUTF8(data))
      })
      input.on('close', function() {
        parser.end()
      }) //读取操作的缓存装不下，只能分成几次发送，每次发送会触发一个data事件，发送结束会触发end事件
      parser.on('readable', function() {
        while ((record = parser.read())) {
          output.push(record)
        }
      })
      parser.on('finish', function() {
        resolve(output)
        //output是整个数据的数组
      })
    })
  }
  async function readdata(v) {
    console.log('csv =', v) //csv = [ [ '姓名', '年龄' ], [ '张三', '20' ], [ '李四', '30' ] ]
    ctx.body = v
  }
  let r = await analysisdata()
  r = await readdata(r)
})
app.listen(config.port, config.ip, () => {
  console.log(
    ` serve runing at http://${getIPAddress()}:${
      config.port
    } \n serve runing at http://localhost:${config.port}`
  )
})
