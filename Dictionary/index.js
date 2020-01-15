/*=======字典========*/
var Dictionary = function() {
  this.data = []
  this.find = find
  this.add = add
  this.remove = remove
}
//查找
var find = function(key) {
  return this.data[key]
}
//添加
var add = function(key, value) {
  this.data[key] = value
}
//移除
var remove = function(key) {
  delete this.data[key]
}

/*======测试========*/
var d = new Dictionary()
d.add('name', '张三')
d.add('age', '12')
d.add('sex', '男')
console.log(d)
console.log(d.find('age'))
d.remove('age')
console.log(d)
