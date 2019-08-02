const app = getApp()
Page({
  data: {
    banklist: [],
    index: '',
    isShow: false,
    second: 60,
  },
  onLoad() {
    this.getdata()
  },
  getdata() {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Order/GetBank';
    let data = {};
    app.appRequest('post', url, data, (res) => {
      console.log(res, "Lease/Forget_PassWord")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        this.setData({
          banklist: resdata
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
      my.hideLoading();
    });
  },
  phones(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 发送验证码
  getCode() {
    if (!this.data.phone) {
      my.showToast({
        type: 'fail',
        content: '手机号为空',
        duration: 2000,
        success: () => {
        },
      });
      return;
    }

    if (!/^[1]{1}[0-9]{10}/.test(this.data.phone)) {
      my.showToast({
        type: 'fail',
        content: '手机号错误',
        duration: 2000,
        success: () => {
        },
      });
      return;
    }
    let that = this;
    let data = {
      users_phone: that.data.phone
    }
    let url = app.url + 'api/Lease/Forget_PassWord';
    app.appRequest('post', url, data, (res) => {
      console.log(res, 'sendSms')
      let resdata = res.data;
      if (res.code == 200) {
        this.code()
        my.showToast({
          type: 'success',
          content: res.msg,
          duration: 3000,
          success: () => {
          },
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
      my.hideLoading();
    });
  },
  // 倒计时
  code() {
    let that = this, second = 60;
    that.setData({
      isShow: true //按钮1隐藏，按钮2显示
    })
    time = setInterval(function () {
      if (second <= 1) {
        clearInterval(time);
        that.setData({
          isShow: false,
          second: 60
        })
        return false
      }
      second--;
      that.setData({
        second: second
      })
    }, 1000)
  },


  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      index: e.detail.value,
    });
  },


  codes(e) {

  },

  onsubmit(e) {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Order/AddUserBank';
    let banklist = this.data.banklist;
    let index = this.data.index;
    let userid = my.getStorageSync({ key: 'userinfos' })
    let data = {
      users_id: userid.data,
      open_bank: banklist[index].bank_name,
      bank_code: e.detail.value.cardnum,
      realname: e.detail.value.name,
      IDcrad: e.detail.value.idcard,
      phone: e.detail.value.phone,
      yzm: e.detail.value.code,
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "Order/AddUserBank")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        my.showToast({
          type: 'success',
          content: res.message,
          duration: 3000,
          success: () => {
            my.navigateBack({
              delta: 1
            })
          }
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
      my.hideLoading();
    });
  }

});
