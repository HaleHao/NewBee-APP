const app = getApp()
Page({
  data: {

    typenum: 0,
    navlist: [
      { title: '全部' },
      { title: '审核中' },
      { title: '托管中' },
      { title: '已退回' }
    ],
    activeTab: 0,
    navlist2: [
      { title: '全部' },
      { title: '审核中' },
      { title: '托管中' },
    ],
    activeTab2: 0,
  },
  onLoad() {
    this.getlist()
  },

  getlist(e) {
    let res = my.getStorageSync({ key: 'userinfos' });
    console.log(res)
    let activeTab = this.data.activeTab

    let url = app.url + 'api/Trusteeship/queryTrusteeship';
    let data = {
      // users_id: 165,
      users_id: res.data.userinfos.users_id,
      state: activeTab
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "Trusteeship/queryTrusteeship")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        this.setData({
          listLeft: resdata,
        })
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
  },



  getlist2(e) {
    let res = my.getStorageSync({ key: 'userinfos' });
    console.log(res)
    let activeTab2= this.data.activeTab2

    let url = app.url + 'api/Trusteeship/queryNohardware';
    let data = {
      // users_id: 165,
      users_id: res.data.userinfos.users_id,
      state: activeTab2
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "Trusteeship/queryNohardware")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        this.setData({
          listRight: resdata,
        })
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
  },

  changetag1(e) {
    this.setData({
      typenum: e.currentTarget.dataset.typenum
    })
     this.getlist()
  },

  changetag2(e) {
    this.setData({
      typenum: e.currentTarget.dataset.typenum
    })
  },


  handleTabClick({ index }) {
    this.setData({
      activeTab: index,
    });
    this.getlist()
  },


  handleTabClick2({ index }) {
    this.setData({
      activeTab2: index,
    });


  },

  gohostCancel() {
    my.navigateTo({
      url: '../hostCancel/hostCancel'
    });
  },
  gopay() {
    my.navigateTo({
      url: '../pay/pay'
    });
  }
});
