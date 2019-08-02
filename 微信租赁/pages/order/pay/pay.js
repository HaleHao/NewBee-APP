const app = getApp()
var Util = require('../../../utils/http.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    items: [{
        num: '6',
        type: '微信',
        imgicon: "/assets/weixin.png"
      },
      {
        num: '3',
        type: '余额',
        imgicon: "/assets/balance.png",
        checked: true
      },
    ],
    payway: 3,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userId = wx.getStorageSync('userId');
    this.setData({
      usersId: userId,
      orderid: options.id
    })
    this.getinfo()
  },

  getinfo() {
    let data = {
      users_id: this.data.usersId,
      order_id: this.data.orderid
    };
    Util.post('Order/GetPayData', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            info: resdata,
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 2000,
          });
        }
      })
  },
  radioChange: function(e) {
    console.log('你选择的框架是：', e.detail.value)
    this.setData({
      payway: e.detail.value
    })
  },

  pay() {
    let data = {
      users_id: this.data.usersId,
      order_id: this.data.orderid,
      pay_way: this.data.payway
    };
    Util.post('Order/GetPay', data)
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

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})