const genUid = () => {
  var length = 20
  var soupLength = genUid.soup_.length
  var id = []
  for (var i = 0; i < length; i++) {
    id[i] = genUid.soup_.charAt(Math.random() * soupLength)
  }
  return id.join('')
}
genUid.soup_ = '!#$%()*+,-./:;=?@[]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
genUid() // ;l`yCPc9A8IuK}?N6,%}
