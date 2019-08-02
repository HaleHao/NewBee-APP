const app = getApp()
var Util = require('../../../utils/http.js');

Page({
  data: {
    contentval: '',
    orderid: '',
    evapicture: '',
    denyimg: '',
  },
  onLoad(query) {
    console.log(query)
    this.setData({
      orderid: query.id
    })
  },
  onTextarea: function (e) {
    console.log(e.detail.value)
    this.setData({
      contentval: e.detail.value
    })
  },


  upload() {
    let that = this;
    wx.chooseImage({
      count: 1,
      success: (res) => {
        console.log(res)
        let src = res.tempFilePaths[0];
        app.imgRequestOrder(src, (res) => {
          console.log(res, "getHeadPicture")
          that.setData({
            evapicture: img1
          })
        }, (err) => {
          console.log('请求错误信息：' + err);
        });
        that.setData({
          denyimg: src
        })
      },
    });
  },


  submit() {
    if (this.data.contentval == "" || !this.data.evapicture) {
      wx.showToast({
        title: '还有未填写',
        icon: 'none',
        duration: 3000,
      });
      return
    }
    var data = {
      order_id: this.data.orderid,
      content: this.data.contentval,
      image: this.data.evapicture
    };
    Util.post('Lease_Order/afterConfirmation2', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1000,
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
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
