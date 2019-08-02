const app = getApp();
Page({
  data: {
    images:'',
    act:0,
  },
  onLoad() {},

  onShow(){
    let userinfos = my.getStorageSync({ key: 'userinfos' });
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Generalize/getCommission';
    let data = {
      users_id:userinfos.data.userinfos.users_id,
    };
    app.appRequest('post', url, data, (res) => {
      my.hideLoading();
      if (res.code == 200) {
        this.setData({
          info: res.data
        })
      } else {
        my.showToast({
          type: 'fail',
          content: '请求失败',
          duration: 3000,
        });
      }
    }, (err) => {
      my.hideLoading();
    });
  },

  getcode(){
    let userinfos = my.getStorageSync({ key: 'userinfos' });
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Generalize/getQrCode';
    let data = {
      users_id:userinfos.data.userinfos.users_id,
    };
    app.appRequest('post', url, data, (res) => {
      my.hideLoading();
      if (res.code == 200) {
        this.setData({
          images: res.message,
          act:1,
        })
      } else {
        my.showToast({
          type: 'fail',
          content: '请求失败',
          duration: 3000,
        });
      }
    }, (err) => {
      my.hideLoading();
    });
  },
  hidCha(){
    this.setData({
      act:0,
    })
  },

  onShareAppMessage() {
    return {
      title: '数码租赁小程序',
      desc: '邀请好友',
      path: 'pages/login/login/login?token=',
    };
  },
});
