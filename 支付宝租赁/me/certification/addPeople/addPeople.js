const app = getApp()
Page({
  data: {
    array: ["父母", "朋友", "兄弟", "姐妹"],
    index: -1,
    info: {
      sign: '请选择'
    },

    from: "addpeople"

  },


  onLoad(e) {
    console.log(e)
    if (e.info) {
      let info = JSON.parse(e.info)
      console.log(info, "info")
      this.setData({
        info: info,
        urgent_sign: info.sign,
        from: "deitpeople"
      })
    }
  },

  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    let array = this.data.array;
    this.setData({
      urgent_sign: array[e.detail.value],
      index: e.detail.value,
    });
  },

  deitpeople(e) {
    console.log(e)
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let userid = my.getStorageSync({ key: 'users_id' })
    let url = app.url + 'api/Lease/urgent_update';

    let data = {
      urgent_id: this.data.info.id,
      urgent_phone: e.detail.value.phone,
      urgent_name: e.detail.value.name,
      urgent_sign: this.data.urgent_sign
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "urgent_update")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        my.showToast({
          type: 'success',
          content: res.message,
          duration: 2000,
          success: () => {
            // 在three页面内 navigateBack，将返回one页面
            my.navigateBack({
              delta: 1
            })
          },
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
      my.hideLoading();
    });
  },

  addpeople(e) {
    console.log(e)
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let userid = my.getStorageSync({ key: 'users_id' })
    let url = app.url + 'api/Lease/Add_urgent';

    let data = {
      users_id: userid.data,
      urgent_phone: e.detail.value.phone,
      urgent_name: e.detail.value.name,
      urgent_sign: this.data.urgent_sign
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "CheckIDCard")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        my.showToast({
          type: 'success',
          content: res.message,
          duration: 2000,
          success: () => {
            // 在three页面内 navigateBack，将返回one页面
            my.navigateBack({
              delta: 1
            })
          },
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
      my.hideLoading();
    });

  },

});
