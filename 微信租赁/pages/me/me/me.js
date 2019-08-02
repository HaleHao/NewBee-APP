// pages/me/me/me.js
const app = getApp()
var Util = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    usersId: '',
    detail: '',
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
  },
  
  getheader() {
    let data = {
      users_id: this.data.usersId
    };
    Util.post('Lease_Order/getHeadPicture',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          if (resdata) {
            this.setData({
              avatar: resdata
            })
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 2000,
          });
        }
      })
  },
getUserDetail() {
    let data = {
      users_id: this.data.usersId
    };
    Util.post('Lease/users_detail',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
        this.setData({
          detail: resdata
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
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getheader();
    this.getUserDetail();
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
  // onPullDownRefresh: function () {

  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})