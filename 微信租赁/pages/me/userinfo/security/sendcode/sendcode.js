// pages/me/userinfo/security/sendcode/sendcode.js
const app = getApp()
var Util = require('../../../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    time: '发送验证码', //倒计时 
    currentTime: 60, //限制60s
    isClick: true, //获取验证码按钮，默认允许点击 

  },
  next(){
    wx.redirectTo({
      url: '../newphone/newphone',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    console.log(option)
    this.setData({
      phone: option.phone
    })
    this.resent()
  },

  resent() {
    var that=this;
    let data = {
      users_phone: this.data.phone
    };
    Util.post('Lease/Forget_PassWord',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
         wx.showToast({
          title: '发送成功',
          icon: 'success',
          duration: 3000,
        });
         mian()
        } else {
          wx.showToast({
             title: res.message,
             icon: 'success',
            duration: 2000,
          });
        }
    })
  function mian(){
    // 60s倒计时 setInterval功能用于循环,时间显示
    var currentTime = that.data.currentTime;
    var interval = setInterval(function() {
      currentTime--; //减1s
      that.setData({
        time: currentTime + '秒后获取',
      })
     if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 60,
          isClick: false
        })
      }
    }, 1000)
    }
  },
  code(e){
     this.setData({
      code:e.detail.value
     })
  },

  next() {
    let data = {
     users_phone:this.data.phone,
      yzm:this.data.code
    };
    Util.post('Lease/Reset_pwd',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          wx.redirectTo({
            url: '../newphone/newphone'
          })
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