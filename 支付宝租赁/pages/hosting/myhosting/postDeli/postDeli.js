const app = getApp()
Page({
  data: {
    typenum: 0,
    Datatime: ''
  },

  onLoad(e) {
    this.setData({
      trust_id: e.trust_id
    })
    this.getSFTime()
  },
  getSFTime() {
    let data = {
    }
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Lease_Order/getSFTime';
    app.appRequest('post', url, data, (res) => {
      console.log(res, "getSFTime")
      my.hideLoading();
      if (res.code == 200) {
        this.setData({
          array: res.data
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


  changetag(e) {
    this.setData({
      typenum: e.currentTarget.dataset.typenum
    })
  },

  bindTimeChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let array = this.data.array;
    let time = array[e.detail.value][0]
    console.log(time)
    this.setData({
      index: e.detail.value,
      time: time
    })
  },
  onShow() {
    console.log(this.data.Datatime)
    let res = my.getStorageSync({
      key: 'adsSelect', // 缓存数据的key
    });
    if (res) {
      let getaddress = res.data.adsSelect
      this.setData({
        getaddress: getaddress
      })
    }
  },

  submit(e) {
    let trust_id = this.data.trust_id, Datatime = this.data.Datatime, time = this.data.time, getaddress = this.data.getaddress, selfShop = this.data.selfShop
    let data = {
      trust_id: trust_id,
      year: Datatime,
      time: time,
      ads_id: getaddress.ads_id,
      store_id: selfShop.store_id,
    }
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Trusteeship/onlineAppointment';
    app.appRequest('post', url, data, (res) => {
      console.log(res, "onlineAppointment")
      my.hideLoading();
      if (res.code == 200) {
        my.showToast({
          type: 'success',
          content: res.message,
          duration: 3000,
          success: () => {
            my.navigateBack({
              delta: 1
            })
          },

        });
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
  numbers(e) {
    this.setData({
      numbers: e.detail.value
    })
  },


  submitdddd(e) {
    let trust_id = this.data.trust_id,
      numbers = this.data.numbers
    let data = {
      trust_id: trust_id,
      express_no: numbers,
    }
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Trusteeship/surrender';
    app.appRequest('post', url, data, (res) => {
      console.log(res, "surrender")
      my.hideLoading();
      if (res.code == 200) {
        my.showToast({
          type: 'success',
          content: res.message,
          duration: 3000,
          success: () => {
            my.navigateBack({
              delta: 1
            })
          },
        });
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

});
