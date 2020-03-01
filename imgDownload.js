function downloadIame (imgsrc,name){
  let image = new Image();
  image.setAttribute('crossOrigin', 'anonymous');
  image.onload = function(){
    let canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    let context =canvas.getContext('2d')
    context.drawImage(imagem, 0, 0, image.width,image.height);
    let url = canvas.toDataURL('image/png');//得到图片的base64编码数据
    let a = document.createElement('a');
    let event = new MouseEvent('click');//创建一个点击事件
    a.download = name || 'photo'; // 设置图片名字
    a.href = url; // 将生成URL设置为 < a.href > 属性
    a.dispatchEvent(event); //触发a的单击事件
  }
  image.src = imgsrc;
}
downloadIame('./4.png','jiayi')