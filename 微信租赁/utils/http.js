export function post(url, data) {
  wx.showLoading({
    mask: true,
    title: '加载中...'
  })
  return request(url, 'POST', data)
}
const host = 'https://admin.newbee-smart.com/Api/'

function request(url, method, data, header = {
  'Content-Type': 'application/x-www-form-urlencoded'
}) {
  return new Promise((resolve, reject) => {
    wx.request({
      data,
      method,
      header,
      url: host + url,
      success: function (res) {
        resolve(res.data)
      },
      fail: err => {
        wx.showToast({
          title: '网络出错',
          icon: 'none'
        })
        reject(err)
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  })
}