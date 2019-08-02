// pages/me/me/me.js
const app = getApp()
var Util = require('../../../../utils/http.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
     
  },

  upload(){
    let that=this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // const tempFilePaths = res.tempFilePaths[0];
        let src = res.tempFilePaths[0];
        let formData={
            users_id: that.data.usersId,
            file: src,
          }
          app.imgRequestpt(src,formData,(res) => {
          console.log(res, "getHeadPicture")
          wx.showToast({
            title: "上传成功",
            icon: 'success',
            duration: 2000,
          });
        }, (err) => {
          console.log('请求错误信息：' + err);
        });
        that.setData({
          headerimg: src
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userId = wx.getStorageSync('userId');
    if (!userId) {
      wx.reLaunch({
        url: '/pages/login/login/login'
      });
    } else {
      this.setData({
        usersId: userId
      })
    }
   this.getdata()
  },

getdata(){
    let data = {
      users_id: this.data.usersId
    };
    Util.post('Lease_Order/getHeadPicture',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          if (res.data == [] || res.data) {
            this.setData({
              headerimg: res.data
            })
          } else {
            headerimg: false
          }
        } else {
          wx.showToast({
             title: res.message,
             icon: 'success',
            duration: 2000,
          });
        }
      })
},





  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})