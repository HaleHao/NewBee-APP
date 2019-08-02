const app = getApp()
var interval = null //倒计时函数
Page({
  data: {
    phone: '',
    time: '重新发送', //倒计时 
    currentTime: 60, //限制60s
    isClick: false, //获取验证码按钮，默认允许点击  
  },
  onLoad(option) {
    console.log(option)
    this.setData({
      phone: option.phone
    })

    this.getcode()
  },
  getcode() {
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Lease/Forget_PassWord';
    let data = {
      users_phone: this.data.phone
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res)
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        my.showToast({
          type: 'success',
          content: '发送成功',
          duration: 3000,
        });
      } else {
        my.showToast({
          type: 'fail',
          content: '请求失败',
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err.errMsg);
      my.hideLoading();
    });
  },

  resent() {
    let that = this;
    let url = app.url + 'api/Lease/Forget_PassWord';
    let data = {
      users_phone: this.data.phone
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
  next() {
    my.redirectTo({
      url: '../newphone/newphone'
    })
  }
});