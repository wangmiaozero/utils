const express = require('express')
const multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const upload = multer({ storage: storage })

const app = express()

app.get('/file/:name', function (req, res, next) {
  res.sendFile(req.params.name, { root: __dirname + '/public/' })
})

app.post('/upload', upload.single('avatar'), function (req, res, next) {
  res.json({ msg: 'upload over' })
})

const server = app.listen(3000, function () {
  const host = server.address().address
  const port = server.address().port
  console.log('server listening at %s:%s', host, port)
})
