const app = getApp()
var Util = require('../../../../utils/http.js');


Page({
  /**
   * 页面的初始数据
   */
  data: {
    tel: '10086',
    helplist:[]
  },
  cell(){
    wx.makePhoneCall({
      phoneNumber: '1340000' // 仅为示例，并非真实的电话号码
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
    this.gettel()
  },

getData(){
    Util.post('Lease/help')
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            helplist: resdata
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
gettel(){
    Util.post('Order/GetServiceTel')
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
        this.setData({
          tel: resdata
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

  cell() {
    wx.makePhoneCall({
      phoneNumber:this.data.tel,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
,

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