
const app = getApp()
var Util = require('../../../utils/http.js');
Page({
  data: {
    money: '',
    orderid: '',
    payway: 3
  },
  onLoad(query) {
    this.setData({
      orderid: query.id
    })
    this.getmoney()
  },

  radioChange: function(e) {
    console.log('你选择的框架是：', e.detail.value)
    this.setData({
      payway: e.detail.value
    })
  },
  getmoney() {
    let data = {
      order_id: this.data.orderid
    };
     Util.post('Lease_Order/getMaintenance',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
        this.setData({
          money: resdata.service_money
        });
        } else {
          wx.showToast({
             title: res.message,
             icon: 'none',
            duration: 2000,
          });
        }
      })
  },


  submit() {
    if (this.data.money == '' || !this.data.money) {
      return
    }
    //余额支付
    let data = {
      order_id: this.data.orderid,
      pay_way: this.data.payway
    };
    Util.post('Lease_Order/maintenancePay',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
        if (this.data.payway == 3) {
              wx.showModal({
              title: '提示',
              content: '支付成功',
              cancelText:'取消',
              confirmText:'确定',
              success: () => {
                wx.reLaunch({
                  url: '/pages/order/orderlist/orderlist'
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
                  success: function (res) {
                        wx.showModal({
                        title: '提示',
                        content: '支付成功',
                        confirmText:'确定',
                        success: () => {
                          wx.reLaunch({
                            url: '/pages/order/orderlist/orderlist'
                          });
                        },
                      });
                  },
                  fail: function (res) {
                     wx.showToast({
                        title: "支付失败",
                        duration: 3000
                     })
                  }
               })
            }
        } else {
          wx.showToast({
             title: res.message,
             icon: 'none',
            duration: 2000,
          });
        }
      })
  }
});
