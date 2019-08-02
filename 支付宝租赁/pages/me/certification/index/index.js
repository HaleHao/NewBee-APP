

const app = getApp()
Page({
  data: {
    realname: 0
  },

  onLoad() {
    this.getData()
  },


  getData() {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let res = my.getStorageSync({ key: 'userinfos' });
    let url = app.url + 'api/Lease/user_price';
    let data = {
      users_id:res.data.userinfos.users_id
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "store_select")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        console.log(resdata)
        this.setData({
          users_money: resdata.users_money,
          is_idcard:resdata.is_idcard,
          is_chsi:resdata.is_chsi
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

  onShareAppMessage() {
    return {
      title: '欢迎加入数码租赁',
      desc: '',
      path: 'pages/index/index'
    };
  },
});
