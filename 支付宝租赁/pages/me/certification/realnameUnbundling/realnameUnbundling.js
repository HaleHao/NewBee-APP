
const app = getApp()
Page({
  data: {
     time:'发送验证码',
        isClick:false,
            currentTime:60,
  },
  onLoad() {

  },

 phone(e){
     this.setData({
      phone:e.detail.value
     })
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
   var interval = setInterval(function() {
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

  bindsubmit(e) {
   let that = this;
   let url = app.url + 'api/Order/UntyingOCR';
    let data = {
      users_id: usersId,
      users_phone:e.detail.value.phone,
      idcard_number:e.detail.value.idcard,
      yzm:e.detail.value.code,
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res)
         my.hideLoading();
      if (res.code == 200) {
           my.showToast({
             type: 'success',
            content:res.message,
            duration: 1000,
          }); 
           setTimeout(()=>{
              wx.reLaunch({
                url: '../../../me/me'
              });
           },2000)
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
