const dateFormatter = (formatter, date) => {
  date = date ? new Date(date) : new Date()
  const Y = date.getFullYear() + '',
    M = date.getMonth() + 1,
    D = date.getDate(),
    H = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds()
  return formatter
    .replace(/YYYY|yyyy/g, Y)
    .replace(/YY|yy/g, Y.substr(2, 2))
    .replace(/MM/g, (M < 10 ? '0' : '') + M)
    .replace(/DD/g, (D < 10 ? '0' : '') + D)
    .replace(/HH|hh/g, (H < 10 ? '0' : '') + H)
    .replace(/mm/g, (m < 10 ? '0' : '') + m)
    .replace(/ss/g, (s < 10 ? '0' : '') + s)
}

dateFormatter('YYYY-MM-DD HH:mm', '1995/02/15 13:55') // 1995-02-15 13:55
function createdTime() {
  var now = new Date()
  let year = now.getFullYear() //得到年份
  let month = now.getMonth() //得到月份
  let date = now.getDate() //得到日期
  let day = now.getDay() //得到周几
  let hour = now.getHours() //得到小时
  let minu = now.getMinutes() //得到分钟
  let sec = now.getSeconds() //得到秒
  var MS = now.getMilliseconds() //获取毫秒
  let week
  month = month + 1
  if (month < 10) month = '0' + month
  if (date < 10) date = '0' + date
  if (hour < 10) hour = '0' + hour
  if (minu < 10) minu = '0' + minu
  if (sec < 10) sec = '0' + sec
  if (MS < 100) MS = '0' + MS
  let arr_week = new Array(
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六'
  )
  week = arr_week[day]
  let time = `${year}年${month}月${date}日${' '}${hour}${':'}${minu}${':'}${sec}${' '}${week}`
  let timeOne = `${year}-${month}-${date}${' '}${hour}${':'}${minu}${':'}${sec}${' '}${week}`
  let timeTwo = `${year}-${month}-${date}${' '}${hour}${':'}${minu}${':'}${sec}${' '}`
  let data = {
    time: time,
    timeOne: timeOne,
    timeTwo: timeTwo,
    now: new Date(now).getTime()
  }
  return data
}
module.exports = { createdTime, dateFormatter }
