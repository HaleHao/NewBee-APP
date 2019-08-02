const app = getApp()
Page({
  data: {
    items: [
      { num: '4', type: '支付宝', imgicon: "/assets/ali.png" },
      { num: '3', type: '余额', imgicon: "/assets/balance.png", checked: true },
    ],
    weekarr: ["天"],
    weeki: 0,
    weekval: "",
    rent: 0,
    orderid: '',
    payway: 3,
    usersId: ''
  },
  onLoad(query) {
    this.setData({
      orderid: query.id
    })

    let res = my.getStorageSync({ key: 'userinfos' });
    console.log(res.data)
    this.setData({
      usersId: res.data.userinfos.users_id
    })
  },

  onWeekChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    my.setStorageSync({
      key: 'weeki',
      data: {
        weeki: e.detail.value
      }
    });
    let weeki = my.getStorageSync({ key: 'weeki' });
    this.setData({
      weeki: weeki.data.weeki,
      isdisabled: false
    })
  },

  //填写天数
  bindKeyInput(e) {
    console.log(e.detail.value)
    my.setStorageSync({
      key: 'weekval',
      data: {
        weekval: e.detail.valu
      }
    });
    let weekval = e.detail.value;
    this.setData({
      weekval: e.detail.value,
    });
    if (!weekval||weekval==0) {
      my.showToast({
        type: 'exception',
        content: '数量不能为空',
        duration: 3000,
      });
      this.setData({
        rent: 0,
      });
      return;
    }
    this.weekval()
  },
  weekval() {
    let url = app.url + 'api/Lease_Order/orderRelet';
    let data = {
      order_id: this.data.orderid,
      day: this.data.weekval
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "orderRelet")
      if (res.code == 200) {
        let resdata = res.data;
        console.log(resdata)
        my.hideLoading();
        this.setData({
          rent: resdata,
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
  radioChange: function(e) {
    console.log('你选择的框架是：', e.detail.value)
    this.setData({
      payway: e.detail.value
    })
  },

  pay() {
    if (this.data.weekval == "" || this.data.weekval == undefined) {
      my.showToast({
        type: 'exception',
        content: '请填写续租时间',
        duration: 3000,
      });
      return;
    }
  let res = my.getStorageSync({ key: 'userinfos' });
  let users_id = res.data.userinfos.users_id;
    //4:支付宝，3：余额
    let url = app.url + 'api/Lease_Order/orderRenew';
    let data = {
      users_id:users_id,
    //  users_id:383,
      order_id: this.data.orderid,
      pay_way: this.data.payway,
      day: this.data.weekval,
      money: this.data.rent,
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "orderRenew")
      if (res.code == 200) {
        let resdata = res.data;
        my.hideLoading();
        if (this.data.payway == 3) {
          my.alert({
            title: '支付成功',
            buttonText: '确定',
            success: () => {
              my.navigateTo({
                url: '/pages/order/orderlist/orderlist'
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
                        url: '/pages/order/orderlist/orderlist'
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
          content: '请求失败',
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);

    });
  },
});
