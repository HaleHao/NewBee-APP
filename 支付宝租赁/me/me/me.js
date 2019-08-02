const app = getApp()
Page({
  data: {
    usersId: ''
  },
  onLoad() {
    let res = my.getStorageSync({ key: 'userinfos' });
    console.log(res.data)

    // this.setData({
    //   usersId: res.data.userinfos.users_id
    // })
    
    this.setData({
      usersId: res.data
    })


    console.log(this.data.usersId)
    this.getheader()
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
        // this.setData({
        //   detail: resdata
        // })
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
