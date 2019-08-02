const app = getApp()
var interval = null //倒计时函数
Page({
  data: {
    newphone: '',
    time: '重新发送', //倒计时 
    currentTime: 60, //限制60s
    isClick: false, //获取验证码按钮，默认允许点击  

  },
  onLoad() { },
  bindKeyInput(e) {
    console.log(e.detail.value)
    this.setData({
      newphone: e.detail.value,
    });
    console.log(this.data.newphone)
  },
  resent() {
    console.log(this.data.newphone)
    let that = this;
    let url = app.url + 'api/Lease/Forget_PassWord';
    let data = {
      users_phone: this.data.newphone
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res)
      if (res.code == 200) {
        my.hideLoading();
        my.showToast({
          type: 'success',
          content: '发送成功',
          duration: 3000,
        });
        that.setData({
          isClick: true,
        })
      } else {
        my.showToast({
          type: 'fail',
          content: '请求失败',
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
    });
    // 60s倒计时 setInterval功能用于循环,时间显示
    var currentTime = that.data.currentTime;
    console.log(that.data.isClick)
    console.log(currentTime)
    interval = setInterval(function() {
      currentTime--; //减1s
      that.setData({
        time: currentTime + '秒后获取'
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

    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let newphone = e.detail.value.newphone;
    let code = e.detail.value.code;
    let res = my.getStorageSync({ key: 'userinfos' });
    if (code == "" || code == undefined) {
      my.showToast({
        type: 'exception',
        content: '请填写验证码',
        duration: 3000,
      });
    }
    let url = app.url + 'api/Lease/update_phone';
    let data = {
      users_phone: newphone,
      users_id: JSON.stringify(res.data.userinfos.users_id),
      yzm: code
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res)
      if (res.code == 200) {
        my.hideLoading();
        my.showToast({
          type: 'success',
          content: '修改成功',
          duration: 3000,
        });
        my.navigateTo({
          url: '../../../me/me'
        });
      } else {
        my.showToast({
          type: 'fail',
          content: '请求失败',
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
    });
  },
});
