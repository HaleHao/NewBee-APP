//  小数计算 乘法
function accMul (arg1,arg2){  
    var m=0,s1=arg1.toString(),
    s2=arg2.toString();  
    try{
    m+=s1.split(".")[1].length}catch(e){}  
    try{
    m+=s2.split(".")[1].length}catch(e){}  
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
}
//  小数计算 减法
function accSub (arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(2);
}
function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
      r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
      r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
      var cm = Math.pow(10, c);
      if (r1 > r2) {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", "")) * cm;
      } else {
        arg1 = Number(arg1.toString().replace(".", "")) * cm;
        arg2 = Number(arg2.toString().replace(".", ""));
      }
    } else {
      arg1 = Number(arg1.toString().replace(".", ""));
      arg2 = Number(arg2.toString().replace(".", ""));
    }
    return ((arg1 + arg2) / m).toFixed(2);
}

/**
 * base64压缩（图片-canvas互转）
 * @param {file} base64 base64图片数据
 * @param {string} mimeType 输出图片格式
 * @return {Blob} data 图片处理完成后的Blob二进制
 */

function Compress(base64, mimeType){
  const MAX_WIDTH = 800

  let cvs = document.createElement('canvas')
  let img = document.createElement('img')
  img.crossOrigin = 'anonymous'
  return new Promise((resolve, reject) => {
    img.src = base64
    // 图片偏移值
    let offetX = 0
    img.onload = () => {
      if (img.width > MAX_WIDTH) {
        cvs.width = MAX_WIDTH
        cvs.height = img.height * MAX_WIDTH / img.width
        offetX = (img.width - MAX_WIDTH) / 2
      } else {
        cvs.width = img.width
        cvs.height = img.height
      }
      let ctx = cvs.getContext("2d").drawImage(img, 0, 0, cvs.width, cvs.height)
      // let imageData = cvs.toDataURL(mimeType)
      // resolve(imageData)

      cvs.toBlob((res)=>{
        resolve(res)
      }, mimeType)
    }
  })
}
// 是否在微信内
function isWeiXin(){
  let UA = navigator.userAgent.toLowerCase();
  if (UA.match(/MicroMessenger/i) == "micromessenger") {
    return true
  }else {
    return false
  }
}

export {
  accMul,
  accSub,
  accAdd,
  Compress,
  isWeiXin
}