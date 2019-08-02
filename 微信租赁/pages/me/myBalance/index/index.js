// pages/me/myBalance/index/index.js
var Util = require('../../../../utils/http.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navlist: [
      { title: '押金' },
      { title: '托管收益' },
      { title: '推广金' },
      { title: '红包' },
      { title: '邀请码' }
    ],
  type: 1,
    activeTab: 0,
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userId = wx.getStorageSync('userId');
    let data = {
      users_id:userId
    };
    Util.post('Buy_Order/GetPayData',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            resdata,
          })
        } else {
          wx.showToast({
             title: res.message,
             icon: 'none',
            duration: 2000,
          });
        }
      })
      this.manmey()
  },

manmey(){
    let userId = wx.getStorageSync('userId');
    let type = this.data.activeTab
    let data = {
         users_id:userId,
      type: type + 1
    };
    Util.post('Order/GetBalance',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
        this.setData({
          maney: resdata.users_balance,
          money: resdata.money
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

onChange(event) {
    let index=event.detail.index
    this.setData({
      activeTab:index 
    })
    this.manmey();
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