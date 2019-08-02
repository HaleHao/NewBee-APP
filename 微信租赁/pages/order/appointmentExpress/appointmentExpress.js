const app = getApp()
var Util = require('../../../utils/http.js');
Page({
  data: {
    orderid: '',
    expectdate: '',
    timeIndex: "", //时间段
    timeList: [], //时间段
    usersId: '',
    getaddress: '',
    shopaddress: ''
  },
  onLoad(query) {

    let userId = wx.getStorageSync('userId');

    this.setData({
      usersId: userId,
    })
    console.log(query)
    this.setData({
      orderid: query.id,
      expectdate: query.expectdate
    })

    this.gettimequantumarr();
    this.getdefaultaddress();
    this.getdefaultshop();
  },



  onShow() {

    // 页面显示
    //收货地址
    let adsSelect = wx.getStorageSync('adsSelect');

    console.log(adsSelect, 'adsSelect')

    if (adsSelect.data == null) {} else {
      this.setData({
        getaddress: adsSelect.data.adsSelect
      })
    }
  },

  choose() {
    wx.navigateTo({
      url: '/pages/order/address/addresslist/addresslist'
    });
  },

  //选择退租时间
  choosetime() {
    wx.navigateTo({
      url: '/pages/order/calendar/calendar?orderid=' + this.data.orderid + '&appointmentExpress=appointmentExpress'
    });
  },
  //选择配送时间段
  timechange(e) {
    console.log(e.detail.value)
    this.setData({
      timeIndex: e.detail.value,
      timetext: this.data.timeList[e.detail.value]
    });

    //判断可选择时间段
    let newdate = new Date()
    if (this.data.expectdate == `${newdate.getFullYear()}/${newdate.getMonth() + 1}/${newdate.getDate()}`) {
      let end = this.data.split('-')[1].split(':')[0]
      //+1小时
      newdate = new Date().getTime() + 1000 * 60 * 60
      newdate = new Date(newdate)
      let newhours = newdate.getHours()
      if (newhours >= end) {
        Toast("不在配送时间段")
        this.data.timetext = ''
        return
      }
    }
  },
  //寄件地址
  getdefaultaddress() {
    let data = {
      users_id: this.data.usersId
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



  //收件地址
  getdefaultshop() {
    let data = {
      order_id: this.data.orderid
    };
    Util.post('Lease_Order/getStore', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            shopaddress: resdata
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
  //获取时间段
  gettimequantumarr() {
    let data = {
      order_id: this.data.orderid
    };
    Util.post('Lease_Order/getSFTime', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          let arr = []
          for (let v of resdata) {
            console.log(v[0])
            arr.push(v[0])
          }
          console.log(arr)
          this.setData({
            timeList: arr
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

  submit() {
    if (this.data.expectdate == '' || this.data.timetext == '' || !this.data.getaddress.ads_id || !this.data.shopaddress.store_id) {
      wx.showToast({
        title: res.message,
        icon: '请填写完整',
        duration: 3000,
      });
      return
    }
    let data = {
      order_id: this.data.orderid,
      ads_id: this.data.getaddress.ads_id,
      store_id: this.data.shopaddress.store_id,
      year: this.data.expectdate,
      time: this.data.timetext
    };
    Util.post('Lease_Order/onlineAppointment', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          wx.removeStorageSync({ //收货地址
            key: 'adsSelect',
          });
          wx.showModal({
            title: '提示',
            content: '操作成功',
            cancelText: '取消',
            confirmText: '确定',
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 4
                })
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
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



});