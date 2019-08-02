const app = getApp()
Page({
  data: {
    orderid: '',
    shopaddress: '',
    expectdate: '',
    numval: ''
  },
  onLoad(query) {
    console.log(query)
    this.setData({
      orderid: query.id,
      expectdate: query.expectdate
    })
    this.getdefaultshop()
  },
  getdefaultshop() {
    let url = app.url + 'api/Lease_Order/getStore';
    let data = {
      order_id: this.data.orderid,
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "getStore")
      if (res.code == 200) {
        let resdata = res.data;
        console.log(resdata)

        my.hideLoading();
        this.setData({
          shopaddress: resdata,

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

  choosetime() {
    my.navigateTo({
      url: '/pages/order/calendar/calendar?orderid=' + this.data.orderid + '&sendBack=sendBack'
    });
  },

  bindKeyInput(e) {
    console.log(e.detail.value)
    this.setData({
      numval: e.detail.value,
    });
  },

  express() {
    if (this.data.expectdate == '' || this.data.numval == '') {
      my.showToast({
        type: 'exception',
        content: '还有未填写',
        duration: 3000,
      });
      return
    }
    let url = app.url + 'api/Lease_Order/surrender';
    let data = {
      order_id: this.data.orderid,
      time: this.data.expectdate,
      express_no: this.data.numval
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "surrender")
      if (res.code == 200) {
        my.hideLoading();
        my.confirm({
          content: '操作成功',
          confirmButtonText: '确定',
          success: (result) => {
            if (result.confirm == true) {
              my.navigateBack({
                delta: 2
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
