const app = getApp()
var Util = require('../../../../utils/http.js')
Page({
  data: {},

  onLoad() {

  },

  card1(e) {
    let that=this;
    wx.chooseImage({
      count: 1,
      success: (res) => {
        console.log(res)
        let src = res.tempFilePaths[0];
        app.imgRequest(src, (res) => {
          console.log(res, "getHeadPicture")
          that.setData({
           img11: img1
          })
        }, (err) => {
          console.log('请求错误信息：' + err);
          wx.hideLoading();
        });
        that.setData({
      src1: src
        })
      },
    });
  },

  card2(e) {
    let that=this;
    wx.chooseImage({
      count: 1,
      success: (res) => {
        console.log(res)
        let src = res.tempFilePaths[0];
        app.imgRequest(src, (res) => {
          console.log(res, "getHeadPicture")
          that.setData({
             img2: img2
          })
        }, (err) => {
          console.log('请求错误信息：' + err);
          wx.hideLoading();
        });
        that.setData({
          src2: src
        })
      },
    });
  },
  next(e) {
    let userId = wx.getStorageSync('userId');
    let data = {
      users_id: userId,
      file:this.data.img11,
      file1: this.data.img2,
    };
    Util.post('Alipay/CheckIDCard',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            shoplist: resdata
          })
        } else {
          wx.showToast({
             title: res.message,
             icon: 'success',
            duration: 2000,
          });
        }
      })
  },

});
