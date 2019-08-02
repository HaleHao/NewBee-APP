const app = getApp()
var Util = require('../../../utils/http.js');
Page({
  data: {
    orderid: '',
    shopaddress: '',
    expectdate: '',
    numval: ''
  },
  onLoad(query) {
    console.log(query)
    this.setData({
      orderid: query.id,
      expectdate: query.expectdate
    })
    this.getdefaultshop()
  },

  getdefaultshop() {
    let data = {
      order_id: this.data.orderid,
    };
    Util.post('Lease_Order/getStore',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            shopaddress: resdata,
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

  choosetime() {
    wx.navigateTo({
      url: '/pages/order/calendar/calendar?orderid=' + this.data.orderid + '&sendBack=sendBack'
    });
  },

  bindKeyInput(e) {
    this.setData({
      numval: e.detail.value,
    });
  },

  express() {
    if (this.data.expectdate == '' || this.data.numval == '') {
      wx.showToast({
        title: "还有未填写",
        icon: 'none',
        duration: 3000,
      });
      return
    }
    let data = {
      order_id: this.data.orderid,
      time: this.data.expectdate,
      express_no: this.data.numval
    };
    Util.post('Lease_Order/surrender',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          wx.showModal({
            title: '提示',
            content: '操作成功',
            confirmText:'确定',
            cancelText:'取消',
            success (res) {
              if (res.confirm) {
                  wx.navigateBack({
                      delta: 2
                  })
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
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

});
