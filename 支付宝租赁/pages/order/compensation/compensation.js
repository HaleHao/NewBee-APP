
const app = getApp()
Page({
  data: {
    money: '',
    orderid: '',
    payway: 3
  },
  onLoad(query) {
    this.setData({
      orderid: query.id
    })
    this.getmoney()
  },

  radioChange: function(e) {
    console.log('你选择的框架是：', e.detail.value)
    this.setData({
      payway: e.detail.value
    })
  },
  getmoney() {
    let url = app.url + 'api/Lease_Order/getMaintenance';
    let data = {
      order_id: this.data.orderid
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "money")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        this.setData({
          money: resdata.service_money
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
  },
  submit() {
    if (this.data.money == '' || !this.data.money) {
      return
    }
    //余额支付
    let url = app.url + 'api/Lease_Order/maintenancePay';
    let data = {
      order_id: this.data.orderid,
      pay_way: this.data.payway
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "money")
      my.hideLoading();
      if (res.code == 200) {
        if (this.data.payway == 3) {
          my.alert({
            title: res.message,
            buttonText: '确定',
            success: () => {
              my.navigateTo({
                url: '/pages/order/orderlist/orderlist'
              });
            },
          });
        } else {
          my.tradePay({
            tradeNO: res.data,
            success: function (res) {
              console.log(res, '支付回调成功')
              if (res.resultCode == 9000) {
                my.alert({
                  title: '支付成功',
                  success: () => {
                    my.navigateTo({
                      url: '/pages/order/orderlist/orderlist?activeTab=2'
                    });
                  },
                });
              }
              if (res.resultCode == 4000 || res.resultCode == 6001 || res.resultCode == 6002) {
                my.alert({
                  title: '支付失败',
                  success: () => {
                    my.navigateTo({
                      url: '/pages/order/orderlist/orderlist'
                    });
                  },
                });
              }
            },
            fail: function (res) {
              console.log(res, '支付回调失败')
            },
          });
        }
      } else {
        my.showToast({
          type: 'fail',
          content:res.message|| '请求失败' ,
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);

    });
  }
});
