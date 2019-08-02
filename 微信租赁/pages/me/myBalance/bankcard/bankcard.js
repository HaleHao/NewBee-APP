var Util = require('../../../../utils/http.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  onShow(e) {
    this.manmey()
  },

  onbank(e) {
    let id = e.currentTarget.dataset.id

    let text = e.currentTarget.dataset.text

    let code = e.currentTarget.dataset.code

    let info = {
      user_bank_id: e.currentTarget.dataset.id,
      open_bank: e.currentTarget.dataset.text,
      bank_code: e.currentTarget.dataset.code,
    }
     wx.setStorageSync('info',info);
    wx.navigateBack({
      delta: 1
    })
  },

  manmey(e) {
    let userId = wx.getStorageSync('userId');
    let data={
      users_id:userId
    }
    Util.post('Order/GetCash',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
        this.setData({
          list: resdata
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