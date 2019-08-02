const app = getApp()
var Util = require('../../../utils/http.js');
Page({
  data: {
    newphone: '',
    time: '获取验证码', //倒计时 
    currentTime: 60, //限制60s
    isClick: false, //获取验证码按钮，默认允许点击  
    userInfo: '',
    user_auth_id: ''
  },

  onLoad() {
    if (!wx.getStorageSync('userId')) {
      this.setData({
        is_getuserinfo: true,
      })
    }
  },

  bindgetuserinfo: function(e) {
    var that = this;
    app.globalData.userInfo = e;
    console.log(e)
    if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
      wx.showToast({
        title: '已拒绝授权',
        icon: 'none',
      })
    } else {
      let sex = e.detail.userInfo.gender == 1 ? '男' : '女';
      let data = {
        code: app.globalData.code,
        sex: sex,
        province: e.detail.userInfo.province,
        city: e.detail.userInfo.city,
        nickname: e.detail.userInfo.nickName,
        avatar: e.detail.userInfo.avatarUrl,
      };
      console.log(data)
      Util.post('Mini_Wechat/login', data)
        .then(res => {
          wx.hideLoading()
          console.log(res, 'FaceRecognition')
          if (res.code == 200) {
            console.log(res)
            var data = res.data;
            that.setData({
              is_getuserinfo: false,
              user_auth_id: data.user_auth_id,
            });
            this.formSubmit()
          }
          if (data.code == 400) {
            wx.showToast({
              title: "授权失败",
              icon: 'none',
              duration: 2000
            });
            return false;
          }
        })
    }
  },

  bindKeyInput(e) {
    this.setData({
      newphone: e.detail.value,
    });
  },
  bindyzm(e) {
    this.setData({
      yzm: e.detail.value,
    });
  },
  resent() {
    let that = this;
    console.log(that.data.newphone)
    if (!that.data.newphone) {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none',
        duration: 3000,
      });
      return;
    }
    if (!(/^1\d{10}$/.test(that.data.newphone))) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 3000,
      });
      return;
    }
    let data = {
      users_phone: that.data.newphone
    };
    Util.post('Lease/Forget_PassWord', data)
      .then(res => {
        console.log(res, 'Forget_PassWord')
        if (res.code == 200) {
          console.log(res)
          // this.setData({
          //   state: res.state
          // })
          this.code();
        }
      })
  },

  code() {
    var currentTime = this.data.currentTime,
      that = this;
    console.log(that.data.isClick)
    console.log(currentTime)
    let interval = setInterval(function() {
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
  },


  formSubmit: function(e) {
    let user_auth_id = this.data.user_auth_id
    if (user_auth_id) {
      // console.log('form发生了submit事件，携带数据为：', e.detail.value)
      let phone = this.data.newphone;
      let yzm = this.data.yzm;
      if (!yzm) {
        wx.showToast({
          title: '请填写验证码',
          icon: 'none',
          duration: 2000,
        });
        return;
      }
      let data = {
        type: 4,
        phone: phone,
        yzm: yzm,
        user_auth_id: user_auth_id
      };
      Util.post('Order/ThreeLogin', data)
        .then(res => {
          console.log(res, 'ThreeLogin')
          if (res.code == 200) {
            wx.setStorageSync('userinfos', res.data);
            wx.setStorageSync('userId', res.data.users_id)
            wx.redirectTo({
              url: '/pages/index/index'
            })
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none',
              duration: 2000,
            });
          }
        })
    }
  },

});