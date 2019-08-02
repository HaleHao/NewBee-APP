
/**
 * 获取时间
 */
function formatTime(date, day = 1) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/**
 * 获取日期
 */
function formatdate(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
  if (day == 1) {
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  } else {
    return [year, month, day].map(formatNumber).join('-')
  }
}

/**
 * 获取30天后的日期
 */
function formatdatethree(date) {
  var date2 = new Date(date);
  date2.setDate(date.getDate() + 30);

  var year = date2.getFullYear()
  var month = date2.getMonth() + 1
  var day = date2.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function prettyTimeBefore(diff, day_diff) {

}

function sleep(time) {
  var startTime = Date.now();
  var nowTime = 0;
  while (1) {
    nowTime = Date.now();
    if ((nowTime - startTime) > time) {
      return;
    }
  }
}

function prettyTime(time) {
  var nowTime = new Date().getTime();
  var diff = (nowTime - time) / 1000;
  var dayDiff = Math.floor(diff / 86400);
  var isPrev = diff > 0;
  if (diff < 0) {
    diff = Math.abs(diff);
    dayDiff = Math.abs(dayDiff);
  }
  if (diff < 60) {
    return '现在';
  }
  if (diff < 120) {
    return isPrev ? '一分钟前' : '一分钟后';
  }
}

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function formatTimeTwo(number, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}


//  小数计算 乘法
function accMul(arg1, arg2) {
  var m = 0, s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length
  } catch (e) { }
  try {
    m += s2.split(".")[1].length
  } catch (e) { }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
//  小数计算 减法
function accSub(arg1, arg2) {
  var r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
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


module.exports = {
  formatTime: formatTime,
  formatdate: formatdate,
  formatdatethree: formatdatethree,
  sleep: sleep,
  formatTimeTwo: formatTimeTwo,
  accMul: accMul,
  accSub: accSub,
  accAdd: accAdd
}
