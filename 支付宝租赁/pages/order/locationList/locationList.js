const app = getApp()
Page({
  data: {
    list: [],
    goods_id: '',
    checkedNum: '',
    shopping: '',
    pagenum: 1,
    resdata: []
  },
  onLoad(query) {
    console.log(query)
    this.setData({
      goods_id: query.id,
      orderid: query.orderid,
      shopping: query.shopping
    })
    this.getLocation(query.chose);
  },
  getLocation(chose) {
    let that = this;
    my.getLocation({
      success(res) {
        my.hideLoading();
        console.log(res, "getLocation")
        that.setData({
          lat: res.latitude,
          lng: res.longitude
        })
        if (chose) {
          that.getGetSelfShoptwo()
        } else {
          that.getGetSelfShop()
        }
      },
      fail() {
        my.hideLoading();
        my.alert({ title: '定位失败' });
      },
    })
  },

  getGetSelfShoptwo() {
    var url = app.url + 'api/Trusteeship/getStore';
    var data = {
      lat: this.data.lat,
      lng: this.data.lng,
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "api/GetSelfShop")
      my.hideLoading();
      if (res.code == 200) {
        console.log(this.data.list)
        let resdata = res.data;
        this.setData({
          resdata: resdata,
          list: resdata.concat(this.data.list)
        })
      }
    }, (err) => {
      console.log('请求错误信息：' + err.errMsg);
      my.hideLoading();
    });
  },

  getGetSelfShop() {
    if (this.data.shopping == "shopping") {
      var url = app.url + 'api/Buy_Order/BuySelfShop';
      var data = {
        lat: this.data.lat,
        lng: this.data.lng,
        order_id: this.data.orderid,
        page: this.data.pagenum
      };
    } else {
      var url = app.url + 'api/Order/GetSelfShop';
      var data = {
        lat: this.data.lat,
        lng: this.data.lng,
        goods_id: this.data.goods_id,
        page: this.data.pagenum
      };
    }
    app.appRequest('post', url, data, (res) => {
      console.log(res, "api/GetSelfShop")
      my.hideLoading();
      if (res.code == 200) {
        console.log(this.data.list)
        let resdata = res.data;
        this.setData({
          resdata: resdata,
          list: resdata.concat(this.data.list)
        })
      }
    }, (err) => {
      console.log('请求错误信息：' + err.errMsg);
      my.hideLoading();
    });
  },

  radioChange: function (e) {
    // my.setStorageSync({
    //   key: 'selfShop',
    //   data: {
    //     selfShop: this.data.list[e.detail.value]
    //   }
    // });
    console.log('你选择的框架是：', e.detail.value)
    this.setData({
      checkedNum: e.detail.value
    })
  },

  goback() {
    let checkedNum = this.data.checkedNum,
      list = this.data.list
    if (checkedNum < -1) {
      my.showToast({
        type: 'exception',
        content: '请选择地址',
        duration: 3000,
      });
    } else {
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];  //当前页面
      var prevPage = pages[pages.length - 2]; //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        selfShop: list[checkedNum]
      })
      my.navigateBack();
    }
  },

  onReachBottom() {
    // 页面被拉到底部
    let page = ++this.data.pagenum;
    this.setData({
      pagenum: page
    })
    console.log(this.data.pagenum)
    this.getGetSelfShop()
  },
});
