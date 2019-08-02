const app = getApp()
var Util = require('../../../utils/http.js');
Page({
  data: {
    typenum: 0,
    selected: 0,
    iscode: false,
    usersId: '',
    orderid: '',
    codeimg: '',
    getaddress: '',
    expectdate: '',
    timeIndex: "", //时间段
    timeList: [], //时间段

  },
  onLoad(query) {
    console.log(query)
    this.setData({
      orderid: query.id,
      expectdate: query.expectdate
    })
    if (query.type) {
      this.setData({
        typenum: query.type
      })
    }
    let userId = wx.getStorageSync('userId');
    this.setData({
      usersId: userId
    })
    this.getdefaultaddress();
    this.gettimequantumarr()
  },

  onShow() {
    let getaddress = this.data.getaddress
    if (getaddress) {
      this.setData({
        getaddress: getaddress
      })
    }
  },

  onShareAppMessage() {

    let users_id = this.data.usersId,
      order_id = this.data.orderid;
    return {
      title: '数码租赁小程序',
      desc: '朋友代还',
      path: '/pages/order/friendRepay/index?users_id=' + users_id + '&&order_id=' + order_id,
    };
  },

  changetag(e) {
    this.setData({
      typenum: e.currentTarget.dataset.typenum
    })
  },
  choose(e) {
    this.setData({
      selected: e.currentTarget.dataset.selected
    })
  },
  onclose() {
    this.setData({
      iscode: false
    })
  },
  //获取时间段
  gettimequantumarr() {
    Util.post('Lease_Order/getSFTime')
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          let arr = []
          for (let v of resdata) {
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

  //选择配送时间段
  timechange(e) {
    console.log(e.detail.value)
    this.setData({
      timeIndex: e.detail.value,
      timetext: this.data.timeList[e.detail.value]
    });
  },

  choosetime() {
    wx.navigateTo({
      url: '/pages/order/calendar/calendar?orderid=' + this.data.orderid + '&refund=refund' + '&typenum=' + this.data.typenum
    });
  },

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


  showcode() {
    if (this.data.typenum == 0) {
      let data = {
        order_id: this.data.orderid,
        users_id: this.data.usersId,
        way: 2
      };
      Util.post('Lease_Order/pickupCode', data)
        .then(res => {
          let resdata = res.data;
          if (res.code == 200) {
            this.setData({
              codeimg: resdata,
              iscode: true
            })
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


  //平台配送
  submit() {
    if (this.data.expectdate == '' || this.data.timetext == '' || this.data.getaddress.ads_id == '') {
      wx.showToast({
        title: '还有未填写',
        icon: 'none',
        duration: 3000,
      });
    }
    let data = {
      order_id: this.data.orderid,
      year: this.data.expectdate,
      time: this.data.timetext,
      ads_id: this.data.getaddress.ads_id
    };
    Util.post('Lease_Order/delivery', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          wx.navigateBack({
            delta: 3
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