const app = getApp()
var Util = require('../../../utils/http.js');

Page({
  data: {
    usersId: '',
    info: '',
    payway: 3,
    buyid: ''
  },
  onLoad(query) {
    console.log(query)
    this.setData({
      buyid: query.id
    })

    let userId = wx.getStorageSync('userId');
    this.setData({
      usersId: userId,
    })
    this.getinfo();
  },

  getinfo() {
    let data = {
      users_id: this.data.usersId
    };
    Util.post('Buy_Order/GetPayData', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
           info: resdata,
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000,
          });
        }
      })
  },


  radioChange: function (e) {
    console.log('你选择的框架是：', e.detail.value)
    this.setData({
      payway: e.detail.value
    })
  },
  submit() {
 let data = {
      users_id: this.data.usersId,
      buyorder_id: this.data.buyid,
      pay_way: this.data.payway
    };
    Util.post('Buy_Order/GetPay', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          if (this.data.payway == 3) {
            wx.showModal({
              title: '提示',
              content: '支付成功',
              cancelText: '取消',
              confirmText: '确定',
              success: () => {
                wx.reLaunch({
                  url: '/pages/order/orderlist/orderlist?activeTab=2'
                });
              },
            });
          } else {
            wx.requestPayment({
              timeStamp: resdata.timeStamp,
              nonceStr: resdata.nonceStr,
              package: resdata.package,
              signType: 'MD5',
              paySign: resdata.paySign,
              success: function(res) {
                wx.showModal({
                  title: '提示',
                  content: '支付成功',
                  confirmText: '确定',
                  success: () => {
                    wx.reLaunch({
                      url: '/pages/order/orderlist/orderlist?activeTab=2'
                    });
                  },
                });
              },
              fail: function(res) {
                wx.showToast({
                  title: "支付失败",
                  duration: 3000
                })
              }
            })
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 2000,
          });
        }
      })
  }
});
