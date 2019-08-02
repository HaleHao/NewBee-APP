const app = getApp()
var Util = require('../../utils/http.js');
const utils = require('../../utils/algorithm.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selfShop: '',
    typenum: 0,
    checked: true,
    weekarr: [],
    weeki: -1,
    iscoupons: false, //优惠券
    getaddress: "", //配送地址
    freight: 0, //运费
    rent: 0, //租金
    isconsent: true, //协议
    isdisabled: true
  },


  // 头部切换
  changetag(e) {

    this.setData({
      typenum: e.currentTarget.dataset.typenum,
      weekval: "",
      rent: 0,
      freight: 0,
    })
    if (e.currentTarget.dataset.typenum == 0) {
      this.setData({
        freight: 0,
      })
      this.calculatesum();
    }

    if (e.currentTarget.dataset.typenum == 1 && this.data.ads_state || e.currentTarget.dataset.typenum == 2 && this.data.ads_state) {
      this.getfreight();
    }


  },

  onChange(event) {
    console.log(event)
    this.setData({
      checked: event.detail
    });
  },

  // 选择天数
  onWeekChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      weeki: e.detail.value,
      isdisabled: false
    });
    if (this.data.weekval) {
      this.weekval()
    }
  },

  bindKeyInput(e) {
    this.setData({
      weekval: e.detail.value
    })
    this.weekval();
  },

  showcoupons() {
    let weekarr = this.data.weekarr;
    let weeki = this.data.weeki;
    if (!weekarr[weeki]) {
      wx.showToast({
        icon: 'none',
        title: '请填写租期',
        duration: 3000,
      });
      return
    }
    if (this.data.rent == 0) {
      wx.showToast({
        icon: 'none',
        title: '请重新填写租期',
        duration: 3000,
      });
      return
    }
    let data = {
      users_id: this.data.usersId,
      goods_id: this.data.goods_id,
      money: this.data.rentbackup //订单金额
    };
    Util.post('Order/GetUserCoupons', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            iscoupons: true,
            couponlist: resdata //优惠券
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 2000,
          });
        }
      })
  },

  onclose() {
    this.setData({
      iscoupons: false
    })
  },
  //选择优惠券
  choosecoupon(e) {
    var item = e.currentTarget.dataset.item
    this.setData({
      rent: utils.accSub(this.data.rentbackup, item.coupons_money),
      couponmoney: item.coupons_money,
      couponsid: item.coupons_id,
      iscoupons: false
    })
    this.calculatesum();
  },

  choosetime() {
    if (this.data.typenum == 0) {
      if (this.data.selfShop == "") {
        wx.showToast({
          icon: 'none',
          title: '请选择自取地点',
          duration: 3000,
        });
        return
      }
      let selfShop = this.data.selfShop;
      wx.navigateTo({
        url: '/pages/order/calendar/calendar?id=' + this.data.goods_id + '&typenum=' + this.data.typenum + '&ads_id=' + selfShop.store_id
      });
    } else {
      if (this.data.getaddress == "") {
        wx.showToast({
          icon: 'none',
          title: '请选择收货地址',
          duration: 3000,
        });
        return
      }
      let getaddress = this.data.getaddress;
      wx.navigateTo({
        url: '/pages/order/calendar/calendar?id=' + this.data.goods_id + '&typenum=' + this.data.typenum + '&ads_id=' + getaddress.ads_id
      });
    }
  },

  //选择配送时间段
  timechange(e) {
    console.log(e.detail.value)
    this.setData({
      timeIndex: e.detail.value,
      timetext: this.data.timeList[e.detail.value]
    });
  },

  switchChange(e) {
    console.log('switchChange 事件，值:', e.detail.value)
    let Dinsurance;
    //保险费计算
    this.setData({
      Dinsurance: e.detail.value
    })
    this.calculatesum()
  },

  submit() {
    wx.navigateTo({
      url: '/pages/order/pay/pay'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options, "options")
    let usersId = wx.getStorageSync('userId');
    this.setData({
      goods_id: options.goods_id,
      usersId,
      expectdate: options.date,
    })
    this.getotherprice();
    this.getadsselect();
  },

  //页面数据
  getotherprice() {
    let data = {
      goods_id: this.data.goods_id,
      users_id: this.data.usersId,
      sku: '',
      cart_id: ''
    };
    Util.post('Order/GetGoodsDetail', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          let Dinsurance = resdata.safe_status == 2 ? true : false //是否强制购买保险：1是2不是
          let sum = Dinsurance ? utils.accAdd(resdata.pay_safe, resdata.safe_price) : resdata.pay_safe //总价格
          let hire_cate = resdata.hire_cate
          let weekarr = ['天']
          hire_cate == 2 ? weekarr.push('小时') : weekarr
          this.setData({
            Dinsurance,
            weekarr,
            hire_cate, //如果是2时，有小时这个参数，否则只有天
            sum,
            detail: resdata,
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 2000,
          });
        }
      })
  },

  // 获取收货地址
  getadsselect() {
    let data = {
      users_id: this.data.usersId,
    };
    Util.post('Lease/ads_select', data)
      .then(res => {
        let resdata = res.data;
        console.log(resdata)
        if (res.code == 200) {
          for (let v of resdata) {
            //默认地址
            if (v.ads_state == 2) {
              this.setData({
                ads_state: true,
                getaddress: v
              })
            }
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 2000,
          });

        }
      })
  },

  // 运费
  getfreight() {
    let data = {
      type: this.data.typenum,
      ads_id: this.data.getaddress.ads_id,
      goods_id: this.data.goods_id,
      sku: '',
      time: '',
      order_type: 1 //订单类型：1正式订单2预约订单
    };
    Util.post('Order/ExpressPrice', data)
      .then(res => {
        let resdata = res.data;
        console.log(resdata)
        if (res.code == 200) {
          this.setData({
            freight: resdata.price,
            timeList: resdata.timelist
          })
          this.calculatesum();
        } else {
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 2000,
          });
          this.calculatesum();

        }
      })
  },

  // 租金
  weekval() {
    let weekarr = this.data.weekarr;
    let weeki = this.data.weeki;
    if (weekarr == '') {
      this.data.rent = 0;
      return;
    }
    if (this.data.weekval <= 0) {
      wx.showToast({
        icon: 'none',
        title: '不能为小于0',
        duration: 2000,
      });
      return;
    }
    let unt = this.data.weekarr[this.data.weeki] == "天" ? "1" : "2"
    let data = {
      goods_id: this.data.goods_id,
      rent_num: this.data.weekval,
      unt: unt,
    };
    Util.post('Order/GetHirePrice', data)
      .then(res => {
        let resdata = res.data;
        console.log(resdata)
        if (res.code == 200) {
          this.setData({
            rent: resdata,
            rentbackup: resdata, //原始租金
          })
          this.calculatesum();
        } else {
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 2000,
          });

        }
      })
  },

  //全局计算
  calculatesum() {
    if (this.data.Dinsurance) {
      let a = utils.accAdd(this.data.rent, this.data.detail.gd_deposit); //租金+押金
      let b = utils.accAdd(a, this.data.freight); //+运费
      let c = utils.accAdd(b, this.data.detail.safe_price); //+保险
      this.setData({
        // sum: utils.accSub(c, this.data.couponmoney) //-优惠券
        sum: c
      })
    } else {
      let a = utils.accAdd(this.data.rent, this.data.detail.gd_deposit); //租金+押金
      let b = utils.accAdd(a, this.data.freight); //+运费
      this.setData({
        // sum: utils.accSub(b, this.data.couponmoney) //-优惠券
        sum: b
      })
    }
  },


  nextface(e) {

    function showToast(title) {
      wx.showToast({
        icon: 'none',
        title: title,
        duration: 2000,
      });

    }
    if (!this.data.checked) {
      showToast("请同意租赁协议");
      return
    }
    if (!this.data.weekarr[this.data.weeki]) {
      showToast("请选择租期方式");
      return
    }
    if (!this.data.weekval) {
      showToast("请填写租期");
      return
    }
    if (this.data.typenum == 0) {
      if (!this.data.selfShop) {
        showToast("请填取收货地址");
        return
      }
      if (!this.data.expectdate) {
        showToast("请选择期望收到的日期");
        return
      }
      if (!this.data.people) {
        showToast("请填写自取人");
        return
      }
      var data = {
        unt: this.data.weekarr[this.data.weeki] == "天" ? 1 : 2,
        rent_num: this.data.weekval,
        goods_id: this.data.goods_id,
        users_id: this.data.usersId,
        users_name: this.data.people.name,
        users_phone: this.data.people.phone,
        users_type: this.data.people.type == 0 ? 1 : 2, //1本人2朋友
        store_id: this.data.selfShop.store_id,
        order_delivery_time: this.data.expectdate,
        safe_status: this.data.Dinsurance ? 1 : 2, // 是否支付保险：1是2否
        delivery_way: this.data.typenum == 0 ? 3 : this.data.typenum == 1 ? 1 : 2,
        qwsh_time: "",
        sku: '',
        time: "",
        ads_id: "",
        way_price: "",
        remark: "",
        timelist: '',
        coupons_id: this.data.couponsid || '',
        order_type: this.data.ordertype == 'order_type' ? 2 : 1 //订单类型：1正式订单2预约订单
      }

    }
    if (this.data.typenum == 1) {
      if (!this.data.getaddress) {
        showToast("请选择地址");
        return
      }
      if (!this.data.expectdate) {
        showToast("请选择期望收到的日期");
        return
      }
      var data = {
        unt: this.data.weekarr[this.data.weeki] == "天" ? 1 : 2,
        rent_num: this.data.weekval,
        goods_id: this.data.goods_id,
        users_id: this.data.usersId,
        safe_status: this.data.Dinsurance ? 1 : 2, // 是否支付保险：1是2否
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
      }
    }
    if (this.data.typenum == 2) {

      if (!this.data.getaddress) {
        showToast("请选择地址");
        return
      }
      if (!this.data.expectdate) {
        showToast("请选择期望收到的日期");
        return
      }
      if (!this.data.timetext) {
        showToast("请选择配送时间段");
        return
      }
      var data = {
        unt: this.data.weekarr[this.data.weeki] == "天" ? 1 : 2,
        rent_num: this.data.weekval,
        goods_id: this.data.goods_id,
        users_id: this.data.usersId,
        safe_status: this.data.Dinsurance ? 1 : 2, // 是否支付保险：1是2否
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
    //调用接口
    Util.post('Order/AddOrder', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          wx.navigateTo({
            url: '/pages/order/pay/pay?id=' + resdata
          });
        } else {
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 2000,
          });
        }
      })
  },
  //人脸识别，请求进行基于生物识别的人脸核身
  startface() {
    let res = wx.getStorageSync('userinfos');
    wx.startFacialRecognitionVerify({
      name: res.realname, //身份证名称
      idCardNumber: res.idcard_number, //身份证号码
      success: function(res) {
        var verifyResult = res.verifyResult; //认证结果
        if (res.errCode == 0) {

        } else {
          wx.showToast({
            icon: 'none',
            title: '认证失败'
          });
        }
      },
      checkAliveType: 2, //屏幕闪烁(人脸核验的交互方式，默认0,读数字)
      fail: err => {
        console.log(err)
        wx.showToast({
          icon: 'none',
          title: '请保持光线充足，面部正对手机，且无遮挡'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    //收货地址
    // let adsSelect = wx.getStorageSync('adsSelect');
    console.log(this.data.getaddress, 'adsSelect')
    if (this.data.getaddress && this.data.typenum == 1 || this.data.getaddress && this.data.typenum == 2) {
      this.getfreight();
      this.setData({
        ads_state: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})