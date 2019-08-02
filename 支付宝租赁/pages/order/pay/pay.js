const app = getApp()
Page({
  data: {
    items: [
      { num: '4', type: '支付宝', imgicon: "/assets/ali.png" },
      { num: '3', type: '余额', imgicon: "/assets/balance.png", checked: true },
    ],
    orderid: '',
    usersId: '',
    info: '',
    payway: 3
  },
  onLoad(query) {
    console.log(query)
    this.setData({
      orderid: query.id
    })
    let res = my.getStorageSync({ key: 'userinfos' });
    console.log(res.data)
    this.setData({
      usersId: res.data.userinfos.users_id
    })

    this.getinfo()
  },
  getinfo() {
    let url = app.url + 'api/Order/GetPayData';
    let data = {
      users_id: this.data.usersId,
      order_id: this.data.orderid
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "GetPayData")
      if (res.code == 200) {
        let resdata = res.data;
        my.hideLoading();
        this.setData({
          info: resdata,
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

  radioChange: function (e) {
    console.log('你选择的框架是：', e.detail.value)
    this.setData({
      payway: e.detail.value
    })
  },

  pay() {
    //4:支付宝，3：余额
    let url = app.url + 'api/Order/GetPay';
    let data = {
      users_id: this.data.usersId,
      order_id: this.data.orderid,
      pay_way: this.data.payway
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "Order/GetPay")
      if (res.code == 200) {
        let resdata = res.data;
        my.hideLoading();
        if (this.data.payway == 3) {
          my.alert({
            title: '支付成功',
            buttonText: '确定',
            success: () => {
              my.navigateTo({
                url: '/pages/order/orderlist/orderlist?activeTab=2'
              });
            },
          });
        } else {
          my.tradePay({
            tradeNO: resdata,
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
      } else if (res.code == 400) {
        my.showToast({
          type: 'fail',
          content: "暂无余额",
          duration: 3000,
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
});
