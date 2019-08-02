const app = getApp()
var Util = require('../../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: '发送验证码',
    isClick: false,
    currentTime: 60,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  phone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  resent() {
    var that = this;
    if (!/^[1]{1}[0-9]{10}/.test(this.data.phone)) {
      wx.showToast({
        title: '手机号码错误',
        icon: 'none',
      })
      return;
    }
    let data = {
      users_phone: this.data.phone
    };
    Util.post('Lease/Forget_PassWord', data)
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

    function mian() {
      // 60s倒计时 setInterval功能用于循环,时间显示
      var currentTime = that.data.currentTime;
      var interval = setInterval(function() {
        currentTime--; //减1s
        that.setData({
          time: currentTime + '秒后获取',
          isClick: true,
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

  bindsubmit(e) {
    let userId = wx.getStorageSync('userId');

    let data = {
      users_id: userId,
      users_phone: e.detail.value.phone,
      idcard_number: e.detail.value.idcard,
      yzm: e.detail.value.code,
    };


    if (!e.detail.value.idcard) {
      wx.showToast({
        title: '请填写身份证号',
        icon: 'none',
      })
      return
    }

    if (!e.detail.value.phone) {
      wx.showToast({
        title: '请填写手机号码',
        icon: 'none',
      })
      return
    }

    if (!e.detail.value.code) {
      wx.showToast({
        title: '请填写验证码',
        icon: 'none',
      })
      return
    }


    Util.post('Order/UntyingOCR', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          wx.showToast({
            title: res.message,
            icon: 'success',
            duration: 1000,
          });
          setTimeout(() => {
            wx.reLaunch({
              url: '../../../me/me'
            });
          }, 2000)
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