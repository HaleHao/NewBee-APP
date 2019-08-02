// pages/me/userinfo/security/newpassword/newpassword.js
const app = getApp()
var Util = require('../../../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  formSubmit: function(e) {
   let users_id = wx.getStorageSync('userId');  
    let users_pwd = e.detail.value.oldpw;
    let new_pwd = e.detail.value.newpw;
    if (new_pwd == "" || users_pwd == '') {
         wx.showToast({
          title: '请填写密码',
          icon: 'success',
          duration: 2000,
        });
    }
    let data = {
      users_pwd: users_pwd,
      new_pwd: new_pwd,
      users_id: JSON.stringify(users_id),
    };
    Util.post('Lease/update_pwd',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
         wx.showToast({
          title: res.message,
          icon: 'success',
          duration: 1000,
        });
      setTimeout(()=>{
            wx.reLaunch({
              url: '../../../me/me'
            });
         },2000)
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