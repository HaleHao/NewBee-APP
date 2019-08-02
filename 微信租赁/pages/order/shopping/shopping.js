const app = getApp()
const utils = require('../../../utils/algorithm.js');
var Util = require('../../../utils/http.js');
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
    timeList: [], //时间段
    timetext: '',
    timeIndex: '',
    sum: 0,
    adsSelect: {},
  },


  onLoad(query) {
    console.log(query)
    this.setData({
      orderid: query.id,
      expectdate: query.expectdate
    })
    let userId = wx.getStorageSync('userId');
    this.setData({
      usersId: userId
    })
    this.getinfo();
    this.getdefaultaddress()
  },

  onShow() {
    let res = this;
    let selfShop = res.data.selfShop
    let getaddress = res.data.getaddress
    let people = res.data.people

    console.log(getaddress, this.data.selected)

    if (getaddress && this.data.typenum == 1 || getaddress && this.data.typenum == 2) {
      console.log('008')
      this.setData({
        getaddress: getaddress
      })
      this.getfreight()
    }
    if (selfShop) {
      this.setData({
        selfShop: selfShop,
      })
    }
    if (people) {
      this.setData({
        people: people
      })
    }

  },


  getdefaultaddress() {
    let data = {
      users_id: this.data.usersId,
    };
    Util.post('Lease/ads_select', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          for (let v of resdata) {
            if (v.ads_state == 2) {
              this.setData({
                getaddress: v
              })
              this.getaddress(v.ads_id)
            }
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000,
          });
        }
      })
  },

  getinfo() {
    let url = app.url + 'api/Buy_Order/BuyGoodsDetail';
    let data = {
      users_id: this.data.usersId,
      type: this.data.selected,
      order_id: this.data.orderid,
    };
    Util.post('Buy_Order/BuyGoodsDetail', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            info: resdata,
            goodsimg: resdata.gd_img[0],
          })
          this.calculateRules()
        } else {

          // wx.showToast({
          //   title: res.message,
          //   icon: 'none',
          //   duration: 2000,
          // });
          wx.showModal({
            title: '提示',
            content: res.message,
            showCancel: false,
            confirmText: '确定',
            success: function (res) {
              if (res.confirm)
                wx.navigateBack({
                  delta: 1,
                })
            },
            fail: function (res) { },
            complete: function (res) { },
          })



        }
      })
  },

  selfShop() {
    wx.navigateTo({
      url: '/pages/order/locationList/locationList?orderid=' + this.data.orderid + '&shopping=shopping'
    });
  },

  choosetime() {
    if (this.data.selfShop == "") {
      wx.showToast({
        title: '请选择自取地点',
        icon: 'none',
        duration: 3000,
      });
      return
    }
    wx.navigateTo({
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
    let data = {
      users_id: this.data.usersId,
      goods_id: this.data.info.goods_id,
      money: this.data.info.yf_price
    };
    Util.post('Order/GetUserCoupons', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            iscoupons: true,
            couponlist: resdata
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000,
          });
        }
      })
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
    Util.post('Buy_Order/BuyExpressPrice', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            freight: resdata.price,
            arrivaltime: resdata.arrival_time,
            timeList: resdata.timelist
          })
          this.calculateRules()
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000,
          });
        }
      })
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
          let a = utils.accSub(this.data.info.yf_price, this.data.couponmoney) // -优惠券
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
    function showToast(title) {
      wx.showToast({
        icon: 'none',
        title: title,
        duration: 2000,
      });
    }
    if (this.data.selected == 1) {
      if (this.data.typenum == 0) {
        if (!this.data.selfShop) {
          showToast("请填写自取地点");
          return
        }
        if (!this.data.expectdate) {
          showToast("请填写自取时间");
          return
        }

        if (!this.data.people) {
          showToast("请填写自取人");
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
      if (this.data.typenum == 1) {

        if (!this.data.getaddress) {
          showToast("请选择收货地址");
          return
        }
        
        // if (!this.data.expectdate) {
        //   showToast("请选择期望收到的日期");
        //   return
        // }
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
        if (!this.data.getaddress) {
          showToast("请选择地址");
          return
        }
        if (!this.data.timetext) {
          showToast("请选择配送时间段");
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

      Util.post('Buy_Order/BuyAddOrder', data)
        .then(res => {
          let resdata = res.data;
          if (res.code == 200) {
            if (this.data.payway == 3) {
              wx.showModal({
                title: '提示',
                content: '支付成功',
                cancelText: '取消',
                confirmText: '确定',
                success: () => {
                  wx.reLaunch({
                    url: '/pages/order/orderlist/orderlist?activeTab=2'
                  });
                },
              });
            } else {
              wx.requestPayment({
                timeStamp: resdata.timeStamp,
                nonceStr: resdata.nonceStr,
                package: resdata.package,
                signType: 'MD5',
                paySign: resdata.paySign,
                success: function (res) {
                  wx.showModal({
                    title: '提示',
                    content: '支付成功',
                    confirmText: '确定',
                    success: (res) => {
                      if (res.confirm)
                        wx.reLaunch({
                          url: '/pages/order/orderlist/orderlist?activeTab=2'
                        });

                    },
                  });
                },
                fail: function (res) {
                  wx.showToast({
                    title: "支付失败",
                    duration: 3000
                  })
                }
              })
            }
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none',
              duration: 2000,
            });
          }
        })
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
      Util.post('Buy_Order/BuyAddOrder', data)
        .then(res => {
          let resdata = res.data;
          if (res.code == 200) {
            if (this.data.payway == 3) {
              wx.showModal({
                title: '提示',
                content: '支付成功',
                cancelText: '取消',
                confirmText: '确定',
                success: () => {
                  wx.reLaunch({
                    url: '/pages/order/orderlist/orderlist?activeTab=2'
                  });
                },
              });
            } else {
              wx.requestPayment({
                timeStamp: order.timeStamp,
                nonceStr: order.nonceStr,
                package: order.package,
                signType: 'MD5',
                paySign: order.paySign,
                success: function (res) {
                  wx.showModal({
                    title: '提示',
                    content: '支付成功',
                    confirmText: '确定',
                    success: () => {
                      wx.reLaunch({
                        url: '/pages/order/orderlist/orderlist?activeTab=2'
                      });
                    },
                  });
                },
                fail: function (res) {
                  wx.showToast({
                    title: "支付失败",
                    duration: 3000
                  })
                }
              })
            }
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none',
              duration: 2000,
            });
          }
        })
    }
  },
});