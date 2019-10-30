function unitConvert(num) {
  var moneyUnits = ['元', '万', '亿', '万亿']
  var dividend = 10000
  var curentNum = num
  //转换数字
  var curentUnit = moneyUnits[0]
  //转换单位
  for (var i = 0; i < 4; i++) {
    curentUnit = moneyUnits[i]
    if (strNumSize(curentNum) < 5) {
      break
    }
    curentNum = curentNum / dividend
  }
  var m = { num: 0, unit: '' }
  m.num = curentNum.toFixed(2)
  m.unit = curentUnit
  return m.num + m.unit
}

function strNumSize(tempNum) {
  var stringNum = tempNum.toString()
  var index = stringNum.indexOf('.')
  var newNum = stringNum
  if (index != -1) {
    newNum = stringNum.substring(0, index)
  }
  return newNum.length
}

// 金额以万为单位 - 去除小数点多余的0
/* console.log('金额以万为单位::', unitConvert(231100))
console.log('金额以万为单位::', unitConvert(3000))
console.log('金额以万为单位::', unitConvert(1000.0, 2))
console.log('金额以万为单位::', unitConvert(100.0, 2))
console.log('金额以万为单位::', unitConvert(10.0, 2))
console.log('金额以万为单位::', unitConvert(2.0, 2))
console.log('金额以万为单位::', unitConvert(23101023, 2))
console.log('金额以万为单位::', unitConvert(802322323232)) */
module.exports = { unitConvert }
