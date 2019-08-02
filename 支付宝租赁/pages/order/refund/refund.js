const app = getApp()
Page({
  data: {
    typenum: 0,
    selected: 0,
    iscode: false,
    usersId: '',
    orderid: '',
    codeimg: '',
    getaddress: '',
    expectdate: '',
    timeIndex: "", //时间段
    timeList: [],//时间段

  },
  onLoad(query) {
    console.log(query)
    this.setData({
      orderid: query.id,
      expectdate: query.expectdate
    })

    if (query.type) {
      this.setData({
        typenum: query.type
      })
    }
    let res = my.getStorageSync({ key: 'userinfos' });
    console.log(res.data)
    this.setData({
      usersId: res.data.userinfos.users_id
    })
    this.getdefaultaddress();
    this.gettimequantumarr()
  },
  onShow() {
    // 页面显示
    //收货地址
    let adsSelect = my.getStorageSync({ key: 'adsSelect' });
    console.log(adsSelect.data, 'adsSelect')
    if (adsSelect.data == null) { } else {
      this.setData({
        getaddress: adsSelect.data.adsSelect
      })
    }
  },
  onShareAppMessage() {
    return {
      title: '数码租赁小程序',
      desc: '朋友代还',
      path: '../friendRepay/friendRepay',
    };
  },

  changetag(e) {
    this.setData({
      typenum: e.currentTarget.dataset.typenum
    })
  },
  choose(e) {
    this.setData({
      selected: e.currentTarget.dataset.selected
    })
  },
  onclose() {
    this.setData({
      iscode: false
    })
  },
  //获取时间段
  gettimequantumarr() {
    let url = app.url + 'api/Lease_Order/getSFTime';
    let data = {};
    app.appRequest('post', url, data, (res) => {
      console.log(res, "getSFTime")
      if (res.code == 200) {
        my.hideLoading();
        let resdata = res.data;
        console.log(resdata)
        let arr = []
        for (let v of resdata) {
         
          arr.push(v[0])
        }
         console.log(arr)
        this.setData({
          timeList: arr
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
    });

  },

  //选择配送时间段
  timechange(e) {
    console.log(e.detail.value)
    this.setData({
      timeIndex: e.detail.value,
      timetext: this.data.timeList[e.detail.value]
    });
  },

  choosetime() {
    my.navigateTo({
      url: '/pages/order/calendar/calendar?orderid=' + this.data.orderid + '&refund=refund' + '&typenum=' + this.data.typenum
    });
  },
  getdefaultaddress() {
    let url = app.url + 'api/Lease/ads_select';
    let data = {
      users_id: this.data.usersId
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "ads_select")
      if (res.code == 200) {
        my.hideLoading();
        let resdata = res.data;
        console.log(resdata)
        for (let v of resdata) {
          if (v.ads_state == 2) {
            this.setData({
              getaddress: v
            })
          }
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
    });
  },
  showcode() {
    if (this.data.typenum == 0) {
      let url = app.url + 'api/Lease_Order/pickupCode';
      let data = {
        order_id: this.data.orderid,
        users_id: this.data.usersId,
        way: 2
      };
      app.appRequest('post', url, data, (res) => {
        console.log(res, "pickupCode")
        if (res.code == 200) {
          let resdata = res.data;
          console.log(resdata)

          my.hideLoading();
          this.setData({
            codeimg: resdata,
            iscode: true
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
      });
    }
  },
  //平台配送
  submit() {
    if (this.data.expectdate == '' || this.data.timetext == '' || this.data.getaddress.ads_id == '') {
      my.showToast({
        type: 'exception',
        content: '还有未填写',
        duration: 3000,
      });
    }
    let url = app.url + 'api/Lease_Order/delivery';
    let data = {
      order_id: this.data.orderid,
      year: this.data.expectdate,
      time: this.data.timetext,
      ads_id: this.data.getaddress.ads_id
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "delivery")
      if (res.code == 200) {
        my.hideLoading();
        my.removeStorageSync({ //收货地址
          key: 'adsSelect',
        });
        my.navigateBack({
          delta: 3
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
    });
  }
});
