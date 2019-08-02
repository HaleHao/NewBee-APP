const app = getApp()
Page({
  data: {
    usersId: '',
    info: '',
    payway: 3,
    buyid: ''
  },
  onLoad(query) {
    console.log(query)
    this.setData({
      buyid: query.id
    })
    let res = my.getStorageSync({ key: 'userinfos' });
    console.log(res.data)
    this.setData({
      usersId: res.data.userinfos.users_id
    })

    this.getinfo();
  },
  getinfo() {
    let url = app.url + 'api/Buy_Order/GetPayData';
    let data = {
      users_id: this.data.usersId
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "info")
      if (res.code == 200) {
        my.hideLoading();
        let resdata = res.data;
        console.log(resdata)
        this.setData({
          info: resdata,
        })
      } else if (res.code == 400) {
        my.alert({
          title: res.message,
          buttonText: '确定',
          success: () => {
            my.navigateBack({
              delta: 1
            })
          },
        });
      }
      else {
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
  radioChange: function(e) {
    console.log('你选择的框架是：', e.detail.value)
    this.setData({
      payway: e.detail.value
    })
  },

  submit() {
    let url = app.url + 'api/Buy_Order/GetPay'
    let data = {
      users_id: this.data.usersId,
      buyorder_id: this.data.buyid,
      pay_way: this.data.payway
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res)
     let resdata=res.data
      if (res.code == 200) {
        my.hideLoading();
        if (this.data.payway == 3) {
          my.alert({
            title: '支付成功',
            buttonText: '确定',
            success: () => {
              my.navigateTo({
                url: '/pages/order/orderlist/orderlist?typenum=1'
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
      }
      else {
        my.showToast({
          type: 'fail',
          content:res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
    });
  }
});
