const app = getApp();
Page({
  data: {
    issignin: false,
    day: 0,
    modalOpened: false,
  },
  onLoad() { },

  onModalClick() {
    this.setData({
      modalOpened: false,
    });
  },
  onModalClose() {
    this.setData({
      modalOpened: false,
    });
  },

  onShow() {
    let res = my.getStorageSync({ key: 'userinfos' });
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Order/GetSigninData';
    let data = {
      users_id: res.data.userinfos.users_id,
    };
    app.appRequest('post', url, data, (res) => {
      my.hideLoading();
      if (res.code == 200) {
        this.setData({
          infos: res.data
        })
      } else {
        my.showToast({
          type: 'fail',
          content: res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      my.hideLoading();
    });

    this.getdata();
    // this.setTaskRead();
    this.getTaskNoRead();
  },


  getdata() {
    let res = my.getStorageSync({ key: 'userinfos' });
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Generalize/UserTaskNumber';
    let data = {
      users_id: res.data.userinfos.users_id,
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
          content: res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      my.hideLoading();
    });
  },


  setTaskRead() {
    let res = my.getStorageSync({ key: 'userinfos' });
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Generalize/setTaskRead';
    let data = {
      users_id: res.data.userinfos.users_id,
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
          content: res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      my.hideLoading();
    });
  },

  // btn() {
  //   let read = this.data.read;
  //   let res = my.getStorageSync({ key: 'userinfos' });
  //   my.showLoading({ content: '加载中...' });
  //   let url = app.url + 'api/Generalize/setTaskRead';
  //   let data = {
  //     score: JSON.stringify(read),
  //     money: [],
  //   };
  //   app.appRequest('post', url, data, (res) => {
  //     my.hideLoading();
  //     if (res.code == 200) {

  //     } else {
  //       my.showToast({
  //         type: 'fail',
  //         content: res.message,
  //         duration: 3000,
  //       });
  //     }
  //   }, (err) => {
  //     my.hideLoading();
  //   });
  // },

  getTaskNoRead() {
    let res = my.getStorageSync({ key: 'userinfos' });
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Generalize/getTaskNoRead';
    let data = {
      users_id: res.data.userinfos.users_id,
    };
    app.appRequest('post', url, data, (res) => {
      my.hideLoading();
      if (res.code == 200) {
        if (res.data.length > 0) {
          let modalOpened;
          if (res.data[0].is_read == 0) {
            modalOpened = true
          } else {
            modalOpened = false
          }
          this.setData({
            modalOpened: modalOpened,
            model: res.data[0],
            read: res.data,
          })
        }
      } else {
        my.showToast({
          type: 'fail',
          content: res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      my.hideLoading();
    });
  },


  signNow() {
    let timestamp = Date.parse(new Date());
    let timestr = timestamp / 1000;
    let res = my.getStorageSync({ key: 'userinfos' });
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Order/UserSignin';
    let data = {
      users_id: res.data.userinfos.users_id,
      date_time: timestr,
    };
    app.appRequest('post', url, data, (res) => {
      my.hideLoading();
      if (res.code == 200) {
        my.showToast({
          type: 'success',
          content: res.message,
          duration: 3000,
          success: () => {
            this.onShow()
          },
        });
        // this.show();
      } else {
        my.showToast({
          type: 'fail',
          content: res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      my.hideLoading();
    });
  },



  onShareAppMessage() {
    return {
      title: '数码租赁小程序',
      desc: '唤醒好友',
      path: 'pages/login/login/login?wakeup=',
    };
  },

  gotis() {
    my.alert({
      title: '',
      content: '进入产品详情点击分享按钮，分享给好友即可领取奖励喔。',
    });
  },

  go() {
    my.navigateTo({
      url: '../questionnaire/questionnaire'
    });
  },

  goredpacket() {
    my.navigateTo({
      url: '../redpacket/redpacket/redpacket'
    });
  },

  onModalClick() {
    this.setData({
      modalOpened: false
    })
  }
});
