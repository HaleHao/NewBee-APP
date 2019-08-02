const app = getApp()
const utils = require('../../../utils/algorithm.js');
Page({
  data: {
    selected: 1,
    typenum: 0,
    payway: 3,
    usersId: '',
    getaddress: '',
    selfShop: '',
    orderid: '',
    people: '',
    info: '',
    goodsimg: '',
    iscoupons: false,
    couponlist: [],
    couponmoney: '',
    freight: 0, //运费
    timeList: [],//时间段
    timetext: '',
    timeIndex: '',
    sum: 0,
    adsSelect:{},
  },
  onLoad(query) {
    console.log(query)
    this.setData({
      orderid: query.id,
      expectdate: query.expectdate
    })
    let res = my.getStorageSync({ key: 'userinfos' });
    console.log(res.data)
    this.setData({
      usersId: res.data.userinfos.users_id
    })
  },

  onShow() {
    // 页面显示
    //自取地址
    let selfShop = my.getStorageSync({ key: 'selfShop' });
    console.log(selfShop.data, 'selfShop')

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

    if (selfShop.data == null) { } else {
      this.setData({
        selfShop: selfShop.data.selfShop,
      })
    }

    let people = my.getStorageSync({ key: 'people' });
    console.log(people.data, 'people')
    if (people.data == null) { } else {
      this.setData({
        people: people.data.people
      })
    }
    this.getdefaultaddress();
    this.getinfo();
  },


  getdefaultaddress() {
    let url = app.url + 'api/Lease/ads_select';
    let data = {
      users_id: this.data.usersId,
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
            this.getaddress(v.ads_id)
          }
        }
      } else {
        this.setData({
          getaddress: ""
        })
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

  getinfo() {
    let url = app.url + 'api/Buy_Order/BuyGoodsDetail';
    let data = {
      users_id: this.data.usersId,
      type: this.data.selected,
      order_id: this.data.orderid,
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "info")
      my.hideLoading();
      if (res.code == 200) {
        let resdata = res.data;
        this.setData({
          info: resdata,
          goodsimg: resdata.gd_img[0],
        })
        this.calculateRules()
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

  selfShop() {
    my.navigateTo({
      url: '/pages/order/locationList/locationList?orderid=' + this.data.orderid + '&shopping=shopping'
    });
  },

  choosetime() {
    if (this.data.selfShop == "") {
      my.showToast({
        type: 'exception',
        content: '请选择自取地点',
        duration: 3000,
      });
      return
    }
    my.navigateTo({
      url: '/pages/order/calendar/calendar?orderid=' + this.data.orderid + '&shopping=shopping'
    });
  },

  choose(e) {
    this.setData({
      selected: e.currentTarget.dataset.selected
    })
    this.getinfo()
    this.calculateRules();
  },


  changetag(e) {
    this.setData({
      typenum: e.currentTarget.dataset.typenum
    })
    this.typenum(this.data.typenum)
  },

  typenum(val) {
    if (val == 0) {
      this.calculateRules()
    }
    if (val == 1 || val == 2) {
      if (this.data.getaddress != "") {
        this.getfreight()
      } else {
        this.calculateRules()
      }
    }
  },
  getaddress(val) {
    if (this.data.typenum == 1 || this.data.typenum == 2) {
      if (val != "") {
        this.getfreight()
      }
    }
  },
  showcoupons() {
    console.log(this.data.info.yf_price)
    let url = app.url + 'api/Order/GetUserCoupons';
    let data = {
      users_id: this.data.usersId,
      goods_id: this.data.info.goods_id,
      money: this.data.info.yf_price
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "GetUserCoupons")
      if (res.code == 200) {
        my.hideLoading();
        let resdata = res.data;
        console.log(resdata)
        this.setData({
          iscoupons: true,
          couponlist: resdata
        })

      } else {
        this.setData({
          getaddress: ""
        })
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
  //选择优惠券
  choosecoupon(e) {
    var item = e.currentTarget.dataset.item
    console.log(item, "receive")
    this.setData({
      couponmoney: item.coupons_money,
      couponsid: item.coupons_id,
      iscoupons: false
    })
    this.calculateRules()
  },

  getfreight() {
    let url = app.url + 'api/Buy_Order/BuyExpressPrice';
    let data = {
      type: this.data.typenum,
      ads_id: this.data.getaddress.ads_id,
      order_id: this.data.orderid
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "BuyExpressPrice")
      if (res.code == 200) {
        my.hideLoading();
        let resdata = res.data;
        this.setData({
          freight: resdata.price,
          arrivaltime: resdata.arrival_time,
          timeList: resdata.timelist
        })
        console.log(this.data.timeList)
        this.calculateRules()
      } else {
        this.setData({
          getaddress: ""
        })
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
  onclose() {
    this.setData({
      iscoupons: false
    })

  },

  radioChange: function (e) {
    console.log('你选择的框架是：', e.detail.value)
    this.setData({
      payway: e.detail.value
    })
  },


  //全局计算
  calculateRules() {

    if (this.data.selected == 1) {

      console.log('001')

      if (this.data.typenum == 0) {
        console.log('002')

        if (this.data.couponmoney != '') {
          console.log('003')
          this.setData({
            sum: utils.accSub(this.data.info.yf_price, this.data.couponmoney) // -优惠券
          })
        } else {

          this.setData({
            sum: this.data.info.yf_price
          })
        }

      } else {
        if (this.data.couponmoney != '') {
          let a = utils.accSub(this.data.info.yf_price, this.data.couponmoney)// -优惠券
          this.setData({
            sum: utils.accAdd(a, this.data.freight)
          })

        } else {
          this.setData({
            sum: utils.accAdd(this.data.info.yf_price || '', this.data.freight)
          })
        }
      }
    }
    if (this.data.selected == 2) {
      this.setData({
        sum: this.data.info.yf_price
      })
    }
  },

  submit() {
    if (this.data.selected == 1) {
      if (this.data.typenum == 0) {
        if (this.data.selfShop == "") {
          my.showToast({
            type: 'exception',
            content: '请填写自取地点',
            duration: 3000,
          });
          return
        }
        if (this.data.expectdate == "") {
          my.showToast({
            type: 'exception',
            content: '请填写自取时间',
            duration: 3000,
          });
          return
        }
        if (this.data.people == "") {
          my.showToast({
            type: 'exception',
            content: '请填写自取人',
            duration: 3000,
          });
          return
        }
        var data = {
          users_id: this.data.usersId,
          type: this.data.selected,
          order_id: this.data.orderid,
          qwsh_time: '',
          pay_way: this.data.payway,
          delivery_way: this.data.typenum == 0 ? 3 : this.data.typenum == 1 ? 1 : 2,
          store_id: this.data.selfShop.store_id,
          order_delivery_time: this.data.expectdate,
          users_name: this.data.people.name,
          users_phone: this.data.people.phone,
          users_type: this.data.people.type == 0 ? 1 : 2,
          ads_id: '',
          way_price: '',
          timelist: '',
          time: '',
          remark: '',
          coupons_id: ''
        };
      }
      if (this.typenum == 1) {
        if (this.data.getaddress == "") {
          my.showToast({
            type: 'exception',
            content: '请选择收货地址',
            duration: 3000,
          });
          return
        }
        var data = {
          users_id: this.data.usersId,
          type: this.data.selected,
          order_id: this.data.orderid,
          qwsh_time: this.data.arrivaltime,
          pay_way: this.data.payway,
          delivery_way: this.data.typenum == 0 ? 3 : this.data.typenum == 1 ? 1 : 2,
          store_id: '',
          order_delivery_time: '',
          users_name: '',
          users_phone: '',
          users_type: '',
          ads_id: this.data.getaddress.ads_id,
          way_price: this.data.freight,
          timelist: '',
          time: '',
          remark: '',
          coupons_id: ''
        };
      }
      if (this.data.typenum == 2) {
        if (this.data.getaddress == "") {
          my.showToast({
            type: 'exception',
            content: '请选择收货地址',
            duration: 3000,
          });
          return
        }
        if (this.data.timetext == "") {
          my.showToast({
            type: 'exception',
            content: '请选择配送时间段',
            duration: 3000,
          });
          return
        }
        var data = {
          users_id: this.data.usersId,
          type: this.data.selected,
          order_id: this.data.orderid,
          qwsh_time: this.data.arrivaltime,
          pay_way: this.data.payway,
          delivery_way: this.data.typenum == 0 ? 3 : this.data.typenum == 1 ? 1 : 2,
          store_id: '',
          order_delivery_time: '',
          users_name: '',
          users_phone: '',
          users_type: '',
          ads_id: this.data.getaddress.ads_id,
          way_price: this.data.freight,
          timelist: this.data.timetext,
          time: '',
          remark: '',
          coupons_id: ''
        };
      }

      let url = app.url + 'api/Buy_Order/BuyAddOrder';
      app.appRequest('post', url, data, (res) => {
        console.log(res, "BuyAddOrder")
        if (res.code == 200) {
          let resdata = res.data
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
        } else {
          my.showToast({
            type: 'fail',
            content: res.message,
            duration: 3000,
          });
        }
      }, (err) => {
        console.log('请求错误信息：' + err);
      });

    }

    if (this.data.selected == 2) {
      let data = {
        users_id: this.data.usersId,
        type: this.data.selected,
        order_id: this.data.orderid,
        qwsh_time: this.data.arrivaltime,
        pay_way: this.data.payway,
        delivery_way: '',
        store_id: '',
        order_delivery_time: '',
        users_name: '',
        users_phone: '',
        users_type: '',
        ads_id: '',
        way_price: '',
        timelist: '',
        time: '',
        remark: '',
        coupons_id: ''
      };
      let url = app.url + 'api/Buy_Order/BuyAddOrder';
      app.appRequest('post', url, data, (res) => {
        console.log(res, "BuyAddOrder")
        let resdata = res.data
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
});
