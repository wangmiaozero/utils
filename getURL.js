function GetRequest(value) {
  var url = value; //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
  var str = url.substr(1);
  let strs = str.split("&");
  for(var i = 0; i < strs.length; i ++) {
  theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
  }
  }
  return theRequest;
}

module.exports = {
  GetRequest
}

/* 
 使用方法
import getURl from '../../utils/getURL.js'
var Request = new Object();
Request = getURl.GetRequest(location.hash);
console.log(Request) 

*/