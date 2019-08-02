const app = getApp()
Page({
  data: {
    usersId: '',
    detail: '',
    avatar: '/assets/headimg.png'
  },
  onLoad() {
    let res = my.getStorageSync({ key: 'userinfos' });
    if (res.data == null) {
      my.reLaunch({
        url: '/pages/login/login/login'
      });
    } else {
      this.setData({
        usersId: res.data.userinfos.users_id
      })
    }
  },
  onShow() {
    this.getheader();
    this.getUserDetail();
  },
  getheader() {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Lease_Order/getHeadPicture';
    let data = {
      users_id: this.data.usersId
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "getHeadPicture")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        console.log(resdata)
        if (resdata) {
          this.setData({
            avatar: resdata
          })
        }
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

  getUserDetail() {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Lease/users_detail';
    let data = {
      users_id: this.data.usersId
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "getHeadPicture")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        console.log(resdata)
        this.setData({
          detail: resdata
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
