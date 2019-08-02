const app = getApp()
const utils = require('../../utils/algorithm.js');
Page({
  data: {
    typenum: 0,
    weekarr: [],
    weeki: '',
    iscoupons: false,
    goods_id: '',
    usersId: '',
    timeIndex: "", //时间段
    timeList: [],//时间段
    Dinsurance: false, //保险
    checked: false,
    hire_cate: 1,
    detail: '',
    getaddress: '',//地址
    expectdate: '',//期望收货时间
    selfShop: '',//自取门店
    people: '',//自取人
    isdisabled: true, //租期
    weekval: "", //租期
    couponlist: [],//优惠券
    couponmoney: 0,//优惠券
    couponsid: '',
    freight: 0, //运费
    timequantumtext: "", //时间段
    timetext: '',
    rent: 0, //租金
    sum: 0,
    remark: "",
    isconsent: true, //协议
    checkbox: '',
    sumed: '',
    sumedd: '',
    ordertype: '',//order_type为预下单
    faceRet: false,
  },


  onLoad(query) {
    console.log(query)
    this.setData({
      goods_id: query.id,
      expectdate: query.expectdate,
      ordertype: query.ordertype
    })

    if (query.type) {
      this.setData({
        typenum: query.type
      })
    } else {
      this.data.typenum = 0
    }

    let users_id;
    if (query.friendid) {
      users_id = query.friendid
    } else {
      let res = my.getStorageSync({ key: 'userinfos' });
      users_id = res.data.userinfos.users_id
    }
    this.setData({
      usersId: users_id
    })

    let weekval = my.getStorageSync({ key: 'weekval' });
    if (weekval.data == null) {
      this.data.weekval == ''
    } else {
      this.setData({
        weekval: weekval.data.weekval,
      })
      this.weekval()
    }
    console.log(this.data.weekval, "this.data.weekval")
    console.log(this.data.weekarr[this.data.weeki], "this.data.weekarr[this.data.weeki]")
    this.getotherprice();
    this.getadsselect();
  },


  onShow() {
    //自取地址
    // let selfShop = my.getStorageSync({ key: 'selfShop' });

    console.log(this.data.selfShop, 'selfShop')
    // if (selfShop.data == null) {

    //  } else {
    //   this.setData({
    //     selfShop: selfShop.data.selfShop
    //   })
    // }

    let people = my.getStorageSync({ key: 'people' });

    console.log(people.data, 'people')
    if (people.data == null) { } else {
      this.setData({
        people: people.data.people
      })
    }

    //收货地址
    let adsSelect = my.getStorageSync({ key: 'adsSelect' });
    console.log(adsSelect.data, 'adsSelect')
    if (adsSelect.data == null) { } else {
      this.setData({
        getaddress: adsSelect.data.adsSelect
      })
    }

    let weeki = my.getStorageSync({ key: 'weeki' });
    if (weeki.data == null) { } else {
      this.setData({
        weeki: weeki.data.weeki,
        isdisabled: false
      })
    }
    let weekval = my.getStorageSync({ key: 'weekval' });
    if (weekval.data == null) {
      this.data.weekval == ''
    } else {
      this.setData({
        weekval: weekval.data.weekval,
      })
      this.weekval()
    }

  },
  onReady() {
    // 页面加载完成
    this.typenum();
  },

  // 显示选择天数
  typenum() {
    if (this.data.typenum == 0) {
      if (this.data.hire_cate == 1 || this.data.hire_cate == 3) {
        this.setData({
          weekarr: ["天"],
          couponmoney: 0,
        })
      }
      if (this.data.hire_cate == 2) {
        this.setData({
          weekarr: ["天", "小时"]
        })
      }
      if (this.data.weekval) {
        this.weekval()
      }
    }
    if (this.data.typenum == 1 || this.data.typenum == 2) {
      if (this.data.getaddress != "") {
        this.getfreight()
      } else {
        // this.calculatesum()
      }
      this.setData({
        weekarr: ["天"],
        couponmoney: 0,
      })
      if (this.data.weekval) {
        this.weekval()
      }
    }
  },

  // 获取租金
  weekval() {
    let weekarr = this.data.weekarr;
    let weeki = this.data.weeki;
    if (weekarr == '') {
      this.data.rent = 0;
      return;
    }
    if (this.data.weekval <= 0) {
      this.data.weekval = 1
      my.showToast({
        type: 'exception',
        content: '不能为小于0',
        duration: 3000,
      });
      return;
    }
    let url = app.url + 'api/Order/GetHirePrice';
    let data = {
      goods_id: this.data.goods_id,
      rent_num: this.data.weekval,
      unt: this.data.weekarr[this.data.weeki] == "天" ? "1" : "2"
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "GetHirePrice")
      if (res.code == 200) {
        let resdata = res.data;
        console.log(resdata)
        my.hideLoading();
        this.setData({
          rent: resdata,
          rettwo: resdata,

        })
        this.calculatesum();
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

  },

  //全局计算
  calculatesum() {
    // console.log("放心用" + this.data.checked)
    // console.log("运费" + this.data.freight)
    // console.log("优惠券" + this.data.couponmoney)
    // console.log("押金" + this.data.detail.gd_deposit)
    // console.log("租金金额" + this.data.rent)
    if (this.data.checked) {
      //放心用
      let a = utils.accAdd(this.data.rent, this.data.detail.gd_deposit); //租金+押金
      let b = utils.accAdd(a, this.data.freight);  //+运费
      let c = utils.accAdd(b, this.data.detail.safe_price);  //+保险

      this.setData({
        // sum: utils.accSub(c, this.data.couponmoney) //-优惠券
        sum: c
      })

    } else {
      let a = utils.accAdd(this.data.rent, this.data.detail.gd_deposit); //租金+押金
      let b = utils.accAdd(a, this.data.freight);  //+运费

      this.setData({
        // sum: utils.accSub(b, this.data.couponmoney) //-优惠券
        sum: b
      })


    }
  },

  //页面数据
  getotherprice() {
    let url = app.url + 'api/Order/GetGoodsDetail';
    let data = {
      goods_id: this.data.goods_id,
      users_id: this.data.usersId,
      sku: '',
      cart_id: ''
    };
    app.appRequest('post', url, data, (res) => {
      my.hideLoading();
      console.log(res, "GetGoodsDetail")
      if (res.code == 200) {
        let resdata = res.data;
        this.setData({
          Dinsurance: resdata.safe_status == 2 ? true : false, //是否强制购买保险：1是2不是
          hire_cate: resdata.hire_cate, //如果是2时，有小时这个参数，否则只有天
          detail: resdata
        })
        console.log(this.data.Dinsurance)
        if (this.data.Dinsurance) { //强制购买保险 禁用按钮
          this.setData({
            checked: true,
            sum: utils.accAdd(resdata.pay_safe, resdata.safe_price)
          })
        } else {
          this.setData({
            checked: false,
            sum: resdata.pay_safe
          })
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

  // 获取收货地址
  getadsselect() {
    let url = app.url + 'api/Lease/ads_select';
    let data = {
      users_id: this.data.usersId,
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "ads_select")
      if (res.code == 200) {
        let resdata = res.data;
        my.hideLoading();
        console.log(resdata)
        for (let v of resdata) {
          if (v.ads_state == 2) {
            this.setData({
              getaddress: v
            })
          }
        }
      } else {
        this.setData({
          getaddress: ""
        })
        my.showToast({
          type: 'fail',
          content: res.message,
          duration: 3000,
        });
      }
      this.getaddress();
    }, (err) => {
      console.log('请求错误信息：' + err);
    });
  },

  getaddress() {
    if (this.data.typenum == 1 || this.data.typenum == 2) {
      if (this.data.getaddress != "") {
        this.getfreight()
      }
    }
  },

  //运费
  getfreight() {
    let url = app.url + 'api/Order/ExpressPrice';
    let data = {
      type: this.data.typenum,
      ads_id: this.data.getaddress.ads_id,
      goods_id: this.data.goods_id,
      sku: '',
      time: '',
      order_type: 1  //订单类型：1正式订单2预约订单
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "ads_select------------")
      if (res.code == 200) {
        let resdata = res.data;
        my.hideLoading();
        this.setData({
          freight: resdata.price,
          timeList: resdata.timelist
        })
        this.calculatesum();
      } else {
        this.setData({
          freight: 0
        })
        this.calculatesum();
        console.log(res.message)
        if (res.message == '请选择其他起租时间！') { } else {
          my.showToast({
            type: 'fail',
            content: '请求失败',
            duration: 3000,
          })
        }
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
    });
  },

  switchChange(e) {
    console.log('switchChange 事件，值:', e.detail.value)
    //保险费计算
    this.setData({
      checked: e.detail.value
    })
    this.calculatesum()
    // console.log(this.data.sum)
  },

  // 优惠券列表
  showcoupons() {
    let weekarr = this.data.weekarr;
    let weeki = this.data.weeki;
    if (!weekarr[weeki]) {
      my.showToast({
        type: 'exception',
        content: '请填写租期',
        duration: 3000,
      });
      return
    }
    if (this.data.rent == 0) {
      my.showToast({
        type: 'exception',
        content: '请重新填写租期',
        duration: 3000,
      });
      return
    }

    let url = app.url + 'api/Order/GetUserCoupons';
    let data = {
      users_id: this.data.usersId,
      goods_id: this.data.goods_id,
      money: this.data.rettwo   //订单金额
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "GetUserCoupons")
      if (res.code == 200) {
        let resdata = res.data;
        my.hideLoading();
        console.log(resdata)
        this.setData({
          iscoupons: true,
          couponlist: resdata //优惠券
        })
      } else {
        my.showToast({
          type: 'exception',
          content: res.message,
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
    // this.data.renttwo - item.coupons_money

    console.log(this.data.rettwo)

    this.setData({
      // rent: Number(this.data.renttwo) - Number(item.coupons_money),
      rent: utils.accSub(this.data.rettwo, item.coupons_money),
      couponmoney: item.coupons_money,
      couponsid: item.coupons_id,
      iscoupons: false
    })
    this.calculatesum();
  },

  onclose() {
    //关闭优惠券弹窗
    this.setData({
      iscoupons: false
    })
  },

  changetag(e) {
    this.setData({
      typenum: e.currentTarget.dataset.typenum
    })
    console.log(this.data.typenum, "typenum----")
    this.typenum();
  },


  choosetime() {
    if (this.data.typenum == 0) {
      if (this.data.selfShop == "") {
        my.showToast({
          type: 'exception',
          content: '请选择自取地点',
          duration: 3000,
        });
        return
      }
      let selfShop = this.data.selfShop;
      my.navigateTo({
        url: '/pages/order/calendar/calendar?id=' + this.data.goods_id + '&typenum=' + this.data.typenum + '&ads_id=' + selfShop.store_id
      });

    } else {
      if (this.data.getaddress == "") {
        my.showToast({
          type: 'exception',
          content: '请选择收货地址',
          duration: 3000,
        });
        return
      }
      let getaddress = this.data.getaddress;
      my.navigateTo({
        url: '/pages/order/calendar/calendar?id=' + this.data.goods_id + '&typenum=' + this.data.typenum + '&ads_id=' + getaddress.ads_id
      });
    }

  },

  //选择租期
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
        weekval: e.detail.value
      }
    });
    let weekval = my.getStorageSync({ key: 'weekval' });
    this.setData({
      weekval: weekval.data.weekval,
    });
    this.weekval();
  },

  //特殊需求备注
  bindremarkInput(e) {
    console.log(e.detail.value)
    this.setData({
      remark: e.detail.value,
    });
  },
  onChange(e) {
    console.log(e.detail.value)
    this.setData({
      isconsent: e.detail.value
    })
  },
  //总价
  calculatesums() {
    if (this.data.sum - 0 < 0) {
      return 0
    }
    return this.data.sum
  },

  //选择配送时间段
  timechange(e) {
    console.log(e.detail.value)
    this.setData({
      timeIndex: e.detail.value,
      timetext: this.data.timeList[e.detail.value]
    });

  },
  // 前往实名认证
  isrealname() {
    var data = {
      users_id: this.data.usersId
    }
    let url = app.url + 'api/Lease/user_price';
    app.appRequest('post', url, data, (res) => {
      console.log(res, "Order/AddOrder")
      if (res.code == 200) {
        let resdata = res.data;
        my.hideLoading();
        console.log(resdata)
        if (resdata.is_idcard == 0) {
          my.confirm({
            title: '温馨提示',
            content: '您还未实名认证，是否前往?',
            confirmButtonText: '前往',
            cancelButtonText: '继续',
            success: (result) => {
              my.ap.faceVerify({
                bizId: '545689787654767653', //业务请求的唯一标识，需要保证唯一性
                bizType: '2', //业务场景参数，必须填写‘2’，代表刷脸认证  
                success: (res) => {
                  my.alert({
                    content: JSON.stringify(res),
                  });
                },
                fail: (res) => {
                  my.alert({
                    content: JSON.stringify(res),
                  });
                }
              });
              // my.navigateTo({
              //   url: '/pages/me/certification/realnameSuc/realnameSuc'
              // });
            },
          });
        }
      } else {
        my.showToast({
          type: 'exception',
          content: res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
    });
  },

  // face() {

  // },

  nextface() {
    console.log(this.data.ordertype)
    // this.isrealname();
    if (this.data.isconsent) {
      //同意协议
      console.log(this.data.typenum, "typenum00000000000")
      if (this.data.typenum == 0) {
        if (this.data.selfShop == "" || this.data.selfShop == undefined) {
          my.showToast({
            type: 'exception',
            content: '请选择自取地点',
            duration: 3000,
          });
          return
        }
        if (this.data.expectdate == "" || this.data.expectdate == undefined) {
          my.showToast({
            type: 'exception',
            content: '请选择自取时间',
            duration: 3000,
          });
          return
        }
        if (this.data.people == "" || this.data.people == undefined) {
          my.showToast({
            type: 'exception',
            content: '请填写自取人',
            duration: 3000,
          });
          return
        }

        if (this.data.weekarr[this.data.weeki] == "" || this.data.weekarr[this.data.weeki] == undefined) {
          my.showToast({
            type: 'exception',
            content: '请选择租期方式',
            duration: 3000,
          });
          return
        }
        if (this.data.weekval == "" || this.data.weekval == undefined) {
          my.showToast({
            type: 'exception',
            content: '请填写租期',
            duration: 3000,
          });
          return
        }
        var data = {
          unt: this.data.weekarr[this.data.weeki] == "天" ? 1 : 2,
          rent_num: this.data.weekval,
          goods_id: this.data.goods_id,
          users_id: this.data.usersId,
          users_name: this.data.people.name,
          users_phone: this.data.people.phone,
          users_type: this.data.people.type == 0 ? 1 : 2,  //1本人2朋友
          store_id: this.data.selfShop.store_id,
          order_delivery_time: this.data.expectdate,
          safe_status: this.data.checked ? 1 : 2,// 是否支付保险：1是2否
          delivery_way: this.data.typenum == 0 ? 3 : this.data.typenum == 1 ? 1 : 2,
          qwsh_time: "",
          sku: '',
          time: "",
          ads_id: "",
          way_price: "",
          remark: "",
          timelist: '',
          coupons_id: this.data.couponsid || '',
          order_type: this.data.ordertype == 'order_type' ? 2 : 1  //订单类型：1正式订单2预约订单
        };
      }
      if (this.data.typenum == 1) {
        if (this.data.getaddress == "" || this.data.getaddress == undefined) {
          my.showToast({
            type: 'exception',
            content: '请选择地址',
            duration: 3000,
          });
          return
        }
        if (this.data.weekarr[this.data.weeki] == "" || this.data.weekarr[this.data.weeki] == undefined) {
          my.showToast({
            type: 'exception',
            content: '请选择租期方式',
            duration: 3000,
          });
          return
        }
        if (this.data.weekval == "" || this.data.weekval == undefined) {
          my.showToast({
            type: 'exception',
            content: '请填写租期',
            duration: 3000,
          });
          return
        }

        if (this.data.expectdate == "" || this.data.expectdate == undefined) {
          my.showToast({
            type: 'exception',
            content: '请选择期望收到的日期',
            duration: 3000,
          });
          return
        }

        var data = {
          unt: this.data.weekarr[this.data.weeki] == "天" ? 1 : 2,
          rent_num: this.data.weekval,
          goods_id: this.data.goods_id,
          users_id: this.data.usersId,
          safe_status: this.data.checked ? 1 : 2,// 是否支付保险：1是2否
          delivery_way: this.data.typenum == 0 ? 3 : this.data.typenum == 1 ? 1 : 2,
          qwsh_time: this.data.expectdate,
          sku: '',
          ads_id: this.data.getaddress.ads_id,
          way_price: this.data.freight,
          users_name: "",
          users_phone: "",
          users_type: "",
          store_id: "",
          order_delivery_time: "",
          time: "",
          remark: "",
          timelist: "",
          coupons_id: this.data.couponsid || '',
          order_type: this.data.ordertype == 'order_type' ? 2 : 1
        };
      }
      if (this.data.typenum == 2) {
        if (this.data.getaddress == "" || this.data.getaddress == undefined) {
          my.showToast({
            type: 'exception',
            content: '请选择地址',
            duration: 3000,
          });
          return
        }

        if (this.data.weekarr[this.data.weeki] == "" || this.data.weekarr[this.data.weeki] == undefined) {
          my.showToast({
            type: 'exception',
            content: '请选择租期方式',
            duration: 3000,
          });
          return
        }
        if (this.data.weekval == "" || this.data.weekval == undefined) {
          my.showToast({
            type: 'exception',
            content: '请填写租期',
            duration: 3000,
          });
          return
        }

        if (this.data.expectdate == "" || this.data.expectdate == undefined) {
          my.showToast({
            type: 'exception',
            content: '请选择期望收到的日期',
            duration: 3000,
          });
          return
        }

        if (this.data.timetext == "" || this.data.timetext == undefined) {
          my.showToast({
            type: 'exception',
            content: '请选择配送时间段',
            duration: 3000,
          });
          return
        }
        var data = {
          unt: this.data.weekarr[this.data.weeki] == "天" ? 1 : 2,
          rent_num: this.data.weekval,
          goods_id: this.data.goods_id,
          users_id: this.data.usersId,
          safe_status: this.data.checked ? 1 : 2,// 是否支付保险：1是2否
          delivery_way: this.data.typenum == 0 ? 3 : this.data.typenum == 1 ? 1 : 2,
          qwsh_time: this.data.expectdate,
          sku: '',
          ads_id: this.data.getaddress.ads_id,
          way_price: this.data.freight,
          remark: this.data.remark,
          timelist: this.data.timetext,
          users_name: "",
          users_phone: "",
          users_type: "",
          store_id: "",
          order_delivery_time: "",
          time: "",
          coupons_id: this.data.couponsid || '',
          order_type: this.data.ordertype == 'order_type' ? 2 : 1
        };
      }
      face();
      function face() {
        my.ap.faceVerify({
          bizId: Date.parse(new Date()) + Math.random().toString().slice(-6),
          bizType: '2',
          success: (res) => {
            if (res.faceRetCode == 1000) {
              let url = app.url + 'api/Order/AddOrder';
              app.appRequest('post', url, data, (res) => {
                console.log(res, "Order/AddOrder")
                if (res.code == 200) {
                  let resdata = res.data;
                  my.hideLoading();
                  console.log(resdata)
                  // 提交订单清缓存
                  my.removeStorageSync({ //租期  
                    key: 'weeki',
                  });
                  my.navigateTo({
                    url: '/pages/order/pay/pay?id=' + resdata
                  });
                } else {
                  my.showToast({
                    type: 'exception',
                    content: res.message,
                    duration: 3000,
                  });
                }
              }, (err) => {
                console.log('请求错误信息：' + err);
              });
            } else {
              my.alert({
                title: '认证失败'
              });
            }
          }, fail: (res) => {
            my.alert({
              content: JSON.stringify(res),
            });
          }
        });
      }
    } else {
      my.showToast({
        type: 'exception',
        content: '请先同意租赁协议',
        duration: 3000,
      });
    }



  }

});
