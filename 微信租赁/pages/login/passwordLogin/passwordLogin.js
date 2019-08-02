// pages/login/passwordLogin/passwordLogin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isinput: false,
    phoneval: '',
    pwval: ''
  },
  changeinput1(e) {
    console.log(e.detail.value)
    this.setData({
      phoneval: e.detail.value
    })
    if (e.detail.value != '' && this.data.pwval != '') {
      this.setData({
        isinput: true
      })
    } else {
      this.setData({
        isinput: false
      })
    }
  },
  changeinput2(e) {
    console.log(e.detail.value)
    this.setData({
      pwval: e.detail.value
    })
    if (e.detail.value != '' && this.data.phoneval != '') {
      this.setData({
        isinput: true
      })
    } else {
      this.setData({
        isinput: false
      })
    }
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