const app = getApp()
Page({
  data: {
    isinput: false,
    val: [],
    tel: ''
  },
  onLoad(query) {
    console.log(query)
    this.setData({
      tel: query.tel
    })

    this.getcode();
  },
  getcode() {
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Lease/Forget_PassWord';
    let data = {
      users_phone: this.data.tel
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
  changeinput(e) {
    console.log(e.detail.value)
    this.setData({
      val: e.detail.value.split("")
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
  resent() {
    this.getcode();
  },
  submit() {

    console.log('submit事件，携带数据为：', this.data.val)
    let arr = this.data.val;
    let arrvalue = '';//用于存放取出的数组的值
    for (let v of arr) {
      arrvalue = arrvalue + v;//数组的索引是从0开始的
    }
    console.log(arrvalue);
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Lease/Yzm_Login';
    let data = {
      users_phone: this.data.tel,
      yzm: arrvalue
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res)
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        console.log(resdata.users_id)
        my.setStorageSync({
          key: 'userinfo',
          data: {
            users_id: resdata.users_id,
            phone:resdata.users_phone
          }
        });
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
      console.log('请求错误信息：' + err.errMsg);
      my.hideLoading();
    });
  },
});
