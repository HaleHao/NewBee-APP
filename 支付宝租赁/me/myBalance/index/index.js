const app = getApp()
Page({
  data: {
    navlist: [
      { title: '押金' },
      { title: '托管收益' },
      { title: '推广金' },
      { title: '红包' },
      { title: '邀请码' },
    ],
    type: 1,
    activeTab: 0,
  },
  onLoad() {
    this.manmey()
  },


  manmey(e) {
    let userid = my.getStorageSync({ key: 'userinfos' })
    console.log(userid)
    let type = this.data.activeTab
    let url = app.url + 'api/Order/GetBalance';
    let data = {
      users_id: userid.data,
      type: type + 1
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "GetBalance")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        this.setData({
          maney: resdata.users_balance,
          money: resdata.money
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

  handleTabClick({ index }) {
    this.setData({
      activeTab: index,
    });

    this.manmey();
  },



});
