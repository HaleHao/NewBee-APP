const app = getApp()
Page({
  data: {
    orderid: '',
    expectdate: '',
    timeIndex: "", //时间段
    timeList: [],//时间段
    usersId: '',
    getaddress: '',
    shopaddress: ''
  },
  onLoad(query) {
    let res = my.getStorageSync({ key: 'userinfos' });
    console.log(res.data)

    this.setData({
      usersId: res.data.userinfos.users_id
    })
    console.log(query)
    this.setData({
      orderid: query.id,
      expectdate: query.expectdate
    })

    this.gettimequantumarr();
    this.getdefaultaddress();
    this.getdefaultshop();
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
  choose() {
    my.navigateTo({
      url: '/pages/order/address/addresslist/addresslist'
    });
  },
  //选择退租时间
  choosetime() {
    my.navigateTo({
      url: '/pages/order/calendar/calendar?orderid=' + this.data.orderid + '&appointmentExpress=appointmentExpress'
    });
  },
  //选择配送时间段
  timechange(e) {
    console.log(e.detail.value)
    this.setData({
      timeIndex: e.detail.value,
      timetext: this.data.timeList[e.detail.value]
    });

    //判断可选择时间段
    let newdate = new Date()
    if (this.data.expectdate == `${newdate.getFullYear()}/${newdate.getMonth() + 1}/${newdate.getDate()}`) {
      let end = this.data.split('-')[1].split(':')[0]
      //+1小时
      newdate = new Date().getTime() + 1000 * 60 * 60
      newdate = new Date(newdate)
      let newhours = newdate.getHours()
      if (newhours >= end) {
        Toast("不在配送时间段")
        this.data.timetext = ''
        return
      }
    }
  },
  //寄件地址
  getdefaultaddress() {
    let url = app.url + 'api/Lease/ads_select';
    let data = {
      users_id: this.data.usersId
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "ads_select")
      if (res.code == 200) {
        let resdata = res.data;
        console.log(resdata)
        for (let v of resdata) {
          if (v.ads_state == 2) {
            this.setData({
              getaddress: v
            })
          }
        }

        my.hideLoading();

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
  //收件地址
  getdefaultshop() {
    let url = app.url + 'api/Lease_Order/getStore';
    let data = {
      order_id: this.data.orderid
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "getStore")
      if (res.code == 200) {
        let resdata = res.data;
        console.log(resdata)
        this.setData({
          shopaddress: resdata
        })
        my.hideLoading();

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
          console.log(v[0])
          arr.push(v[0])
        }
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

  submit() {
    if (this.data.expectdate == '' || this.data.timetext == '' || !this.data.getaddress.ads_id || !this.data.shopaddress.store_id) {
      my.showToast({
        type: 'exception',
        content: '请填写完整',
        duration: 3000,
      });
      return
    }

    let url = app.url + 'api/Lease_Order/onlineAppointment';
    let data = {
      order_id: this.data.orderid,
      ads_id: this.data.getaddress.ads_id,
      store_id: this.data.shopaddress.store_id,
      year: this.data.expectdate,
      time: this.data.timetext
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "onlineAppointment")
      if (res.code == 200) {
        my.removeStorageSync({ //收货地址
          key: 'adsSelect',
        });
        my.hideLoading();
        my.confirm({
          content: '操作成功',
          confirmButtonText: '确定',
          success: (result) => {
            if (result.confirm == true) {
              my.navigateBack({
                delta: 4
              })
            }
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
    });


  }
});
