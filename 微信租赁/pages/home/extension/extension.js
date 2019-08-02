// pages/home/extension/extension.js
const app = getApp()
var Util = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iscode:false,
    images:'',
    act:0,
  },
  getcode(){
    this.setData({
      iscode:true
    })
  },
  onclose(){
    this.setData({
      iscode: false
    })
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
    let userId = wx.getStorageSync('userId');
    let data = {
      users_id:userId,
    };
    Util.post('Generalize/getCommission', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
          info: res.data
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

  getcode(){
    let userId = wx.getStorageSync('userId');
    let data = {
      users_id:userId,
    };
    Util.post('Generalize/getQrCode', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
        this.setData({
          images: res.message,
          iscode:true,
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


  hidCha(){
    this.setData({
      act:0,
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
    return {
      title: '数码租赁小程序',
      desc: '邀请好友',
      path: 'pages/login/login/login?token=',
    };
  }
})