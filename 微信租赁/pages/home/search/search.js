const app = getApp()
var Util = require('../../../utils/http.js');
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
    this.setData({
      value: options.name,
    })
    this.commonSearch(options.name)
  },

  onblur(e) {
    this.setData({
      keyword: e.detail,
      list: [],
    })
  },

  Search() {
    let keyword = this.data.keyword
    this.commonSearch(keyword)
  },

  onSearch(e) {
    this.commonSearch(e.detail)
  },

  commonSearch(e) {
    let data = {
      goods_name: e
    }
    Util.post('Lease/search_goods', data)
      .then(res => {
        console.log(res)
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            list: resdata
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


  oncancel() {

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