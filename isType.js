var IStype = function(data) {
  var toString = Object.prototype.toString
  var dataType =
    data instanceof Element
      ? 'element' // 为了统一DOM节点类型输出
      : toString
          .call(data)
          .replace(/\[object\s(.+)\]/, '$1')
          .toLowerCase()
  return dataType
}
module.exports = { IStype }
