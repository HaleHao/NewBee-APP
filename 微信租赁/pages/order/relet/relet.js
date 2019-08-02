const app = getApp()
var Util = require('../../../utils/http.js');
Page({
  data: {
    items: [
      { num: '6', type: '微信', imgicon: "/assets/weixin.png" },
      { num: '3', type: '余额', imgicon: "/assets/balance.png", checked: true },
    ],
    weekarr: ["天"],
    weeki: 0,
    weekval: "",
    rent: 0,
    orderid: '',
    payway: 3,
    usersId: ''
  },

  onLoad(query) {
    this.setData({
      orderid: query.id
    })
    let userId = wx.getStorageSync('userId');
    this.setData({
      usersId: userId,
    })
  },

  onWeekChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    wx.setStorageSync('weeki', e.detail.value);
    // let weeki = wx.getStorageSync({ key: 'weeki' });
    this.setData({
      weeki: e.detail.value,
      isdisabled: false
    })
  },

  //填写天数
  bindKeyInput(e) {
    console.log(e.detail.value)
    wx.setStorageSync('weekval', e.detail.value);
    let weekval = e.detail.value;
    this.setData({
      weekval: e.detail.value,
    });
    if (!weekval || weekval == 0) {
      wx.showToast({
        title: '请填写续租时间',
        icon: 'none',
        duration: 3000,
      });
      this.setData({
        rent: 0,
      });
      return;
    }
    this.weekval()
  },

  weekval() {
    let url = app.url + 'api/Lease_Order/orderRelet';
    let data = {
      order_id: this.data.orderid,
      day: this.data.weekval
    };
    Util.post('Lease_Order/orderRelet', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            rent: resdata,
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

  pay() {

    if (this.data.weekval == "" || this.data.weekval == undefined) {
      wx.showToast({
        title: '请填写续租时间',
        icon: 'none',
        duration: 3000,
      });
      return;
    }

    let userId = wx.getStorageSync('userId');
    //4:支付宝，3：余额
    let url = app.url + 'api/Lease_Order/orderRenew';
    let data = {
      users_id: userId,
      order_id: this.data.orderid,
      pay_way: this.data.payway,
      day: this.data.weekval,
      money: this.data.rent,
    };

    Util.post('Lease_Order/orderRenew', data)
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
              success: function (res) {
                wx.showModal({
                  title: '提示',
                  content: '支付成功',
                  confirmText: '确定',
                  success: (res) => {
                    if (res.confirm) {
                      wx.reLaunch({
                        url: '/pages/order/orderlist/orderlist?activeTab=2'
                      });
                    }
                  },
                });
              },
              fail: function (res) {
                wx.showToast({
                  title: "支付失败",
                  duration: 2000
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
  },
});
