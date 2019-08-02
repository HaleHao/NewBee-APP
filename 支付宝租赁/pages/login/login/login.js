

const app = getApp()
var interval = null //倒计时函数
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

  },

  bindKeyInput(e) {
    console.log(e.detail.value)
    this.setData({
      newphone: e.detail.value,
    });
    console.log(this.data.newphone)
  },

  resent() {
    let that = this;
    console.log(that.data.newphone)

    if (that.data.newphone == '' || that.data.newphone == undefined) {
      my.showToast({
        type: 'exception',
        content: '请填写手机号',
        duration: 3000,
      });
      return;
    }
    if (!(/^1\d{10}$/.test(that.data.newphone))) {
      my.showToast({
        type: 'exception',
        content: '手机号格式不正确',
        duration: 3000,
      });
      return;
    }

    let url = app.url + 'api/Lease/Forget_PassWord';
    let data = {
      users_phone: that.data.newphone
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
    interval = setInterval(function () {
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


  // 获取auth_code
  getuserfo() {
    my.getAuthCode({
      scopes: ['auth_user'],
      success: authcode => {
        let url = app.url + 'api/Alipay/login';
        console.log(authcode)
        let data = {
          auth_code: authcode.authCode
        };
        app.appRequest('post', url, data, (res) => {
          console.log(res)
          if (res.code == 200) {
            my.hideLoading();
            console.log(res.data.user_auth_id, "----")
            my.setStorageSync({ key:"user_auth_id",data:res.data.user_auth_id})
            this.setData({
              user_auth_id: res.data.user_auth_id,
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
      },
    });
  },

  formSubmit: function (e) {

    let user_auth_id = my.getStorageSync({
      key: 'user_auth_id', // 缓存数据的key
    }).data;

    console.log(user_auth_id, "授权id")

    if (user_auth_id) {
      console.log('form发生了submit事件，携带数据为：', e.detail.value)
      let phone = e.detail.value.newphone;
      let yzm = e.detail.value.code;
      if (yzm == '' || yzm == undefined) {
        my.showToast({
          type: 'exception',
          content: '请填写验证码',
          duration: 3000,
        });
        return;
      }
      let url = app.url + 'api/Order/ThreeLogin';
      let data = {
        type: 1,
        phone: phone,
        yzm: yzm,
        user_auth_id: user_auth_id
      };
      app.appRequest('post', url, data, (res) => {
        console.log(res)
        if (res.code == 200) {
          my.hideLoading();
          my.setStorageSync({
            key: 'userinfos',
            data: {
              userinfos: res.data
            }
          });
          my.navigateTo({
            url: '../../index/index'
          });
        } else {
          my.showToast({
            type: 'fail',
            content: res.message,
            duration: 3000,
          });
        }
      }, (err) => {
        console.log('请求错误信息：' + err);
      });
    } else {


      this.getuserfo()

    }
  },
});
