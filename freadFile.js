const fs = require('fs')
const path = require('path')
// 读
function ReadFilePromise(name) {
  return new Promise(function(resolve, reject) {
    fs.readFile(
      path.join(__dirname, `../views/files/${name}`),
      'utf8',
      (err, data) => {
        if (err) return reject(err)
        resolve(data)
      }
    )
  })
}
// 写
function writeFilePromise(name, msg) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(
      path.join(__dirname, `../views/files/${name}`),
      msg,
      'utf8',
      (err, data) => {
        if (err) return reject('写文件出错了，错误是：' + err)
        resolve(data)
      }
    )
  })
}
// 添加 '\r\n' + msg + '\r\n'
function appendFilePromise(name, msg) {
  return new Promise(function(resolve, reject) {
    fs.appendFile(
      path.join(__dirname, `../views/files/${name}`),
      msg,
      'utf8',
      (err, data) => {
        if (err) return reject('写文件出错了，错误是：' + err)
        resolve(data)
      }
    )
  })
}

module.exports = { ReadFilePromise, writeFilePromise, appendFilePromise }
