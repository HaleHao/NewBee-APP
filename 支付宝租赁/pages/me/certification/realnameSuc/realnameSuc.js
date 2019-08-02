const app = getApp()
Page({
  data: {},

  onLoad() {
    this.getData();
  },

  getData() {
   my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let res = my.getStorageSync({ key: 'userinfos' });
    let url = app.url + 'api/Order/GetIDCard';
    let data = {
      users_id: res.data.userinfos.users_id,
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "CheckIDCard")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        console.log(resdata)
          this.setData({
             info:resdata
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


});
