const app = getApp()
var Util = require('../../../utils/http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadData(options.id)
    this.img();
  },

  loadData(id) {
    let data = {
      scene_id: id,
      page: 1
    };
    Util.post('Lease/Scene_goods', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            goods: resdata
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

  img() {
    Util.post('Lease/hender_img')
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            img: resdata
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