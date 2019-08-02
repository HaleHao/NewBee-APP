const app = getApp()
Page({
  data: {
    isinput: false,
    phone: '',
    users_pwd: ''
  },
  onLoad(query) {
    console.log(query.phone)
    this.setData({
      phone: query.phone
    })
  },

  changeinput(e) {
    console.log(e.detail.value)
    this.setData({
      users_pwd: e.detail.value
    })
    if (e.detail.value == '') {
      this.setData({
        isinput: false
      })
    } else {
      this.setData({
        isinput: true
      })
    }
  },

  submit() {
    let url = app.url + 'api/Lease/New_pwd';
    let data = {
      users_phone: this.data.phone,
      users_pwd: this.data.users_pwd
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res)
      if (res.code == 200) {
        my.hideLoading();
        my.navigateTo({
          url: '../../index/index'
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

  }
});
