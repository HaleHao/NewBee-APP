const app = getApp()
var Util = require('../../../utils/http.js');
let payCountdown = ''

Page({
  data: {
    data: {
      buyorder_status: 1,
      buyorder_type: 1,
      delivery_way: 1,
      buyid: '',
      usersId: ''
    },
    showlogistics: false,
    logistics: [],
    codeimg: '',
    iscode: false,
    minutes: '',
    seconds: ''
  },

  countdown(val) {
    var date = val;
    date = date.substring(0, 19);
    date = date.replace(/-/g, '/');
    var timestamp = new Date(date).getTime();
    let newdata = new Date().getTime()
    let timediff = newdata - timestamp
    //计算出相差天数
    var days = Math.floor(timediff / (24 * 3600 * 1000))
    //计算出小时数
    var leave1 = timediff % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000))
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000))
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000)
    // console.log(" 相差 "+days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒")
    this.setData({
      minutes: 30 - minutes,
      seconds: 60 - seconds
    })
  },

  onLoad(query) {
    console.log(query)
    this.setData({
      buyid: query.buyid
    })
    let userId = wx.getStorageSync('userId');
    this.setData({
      usersId:userId
    })
    this.getdata()
  },

  getdata() {
    let data = {
      users_id: this.data.usersId,
      buyorder_id: this.data.buyid,
    };
    Util.post('Buy_Order/orderDetails',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
       this.setData({
          data: resdata[0]
        })
        if (this.data.data.buyorder_status == 1) {
          payCountdown = setInterval(() => {
            this.countdown(this.data.data.create_time)
          }, 1000)
        }
        if (!this.data.data.express_no == '') {
          this.queryLogistics()
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

  queryLogistics() {
    let url = app.url + 'api/Buy_Order/queryLogistics';
    let data = {
      buyorder_id: this.data.buyid,
    }
    Util.post('Buy_Order/queryLogistics',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            logistics: resdata.Traces
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

  //取货码
  getcode() {
    let data = {
      buyorder_id: this.data.buyid,
    }
    Util.post('Buy_Order/createCode',data)
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
  },

  //确认收货
  onGoods() {

    let data = {
      users_id: this.data.usersId,
      buyorder_id: this.data.buyid
    };
    Util.post('Buy_Order/confirmReceipt',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
        wx.navigateBack({
          delta: 1
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

  //评价
  buypingjia(e) {
    console.log(e)
    let goodid = e.currentTarget.dataset.good;
    let buyid = e.currentTarget.dataset.buyid;
    wx.navigateTo({
      url: '/pages/order/comments/comments?buyid=' + buyid + '&goodid=' + goodid
    });
  },
  onlogistics() {
    this.queryLogistics();
    this.setData({
      showlogistics: true
    })

  },
  onclose() {
    this.setData({
      showlogistics: false,
      iscode: false
    })
  },
  onUnload() {
    // 页面被关闭
    clearInterval(payCountdown)
  },
});
