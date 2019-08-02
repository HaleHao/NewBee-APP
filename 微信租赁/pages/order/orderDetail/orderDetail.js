const app = getApp()
var Util = require('../../../utils/http.js');
let payCountdown = ''
Page({
  data: {
    data: {
      order_status: 1,
      delivery_way: '快递',
      order_back_way: '自还',
      usersId: '',
      orderid: '',
      logistics: [],
      salesData: [],
      codeimg: '',
      iscode: false,
      activeTab: ''
    },
    showlogistics: false,
    minutes: '-',
    seconds: '-'
  },
  // 倒计时
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
    var leave1 = timediff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000))
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000))
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
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
      orderid: query.id,
      activeTab: query.activeTab
    })
    let userId = wx.getStorageSync('userId');
    this.setData({
      usersId: userId,
    })
    this.getData();
  },


  getData() {
    let data = {
      users_id: this.data.usersId,
      order_id: this.data.orderid,
    };

    Util.post('Lease_Order/orderDetails', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            data: resdata[0]
          })
          console.log(this.data.data.order_status)
          if (this.data.data.order_status == 1) {
            payCountdown = setInterval(() => {
              this.countdown(this.data.data.create_time)
            }, 1000)
          }

          if (this.data.data.order_status == 9) {
            this.getSalesData();
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



  //售后详情
  getSalesData() {


    let url = app.url + 'api/Lease_Order/AfterDetails';
    let data = {
      order_id: this.data.orderid
    };
    Util.post('Lease_Order/AfterDetails', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            salesData: resdata,
          })
        } else {
          // wx.showToast({
          //    title: res.message,
          //    icon: 'none',
          //   duration: 2000,
          // });
        }
      })
  },
  //物流
  queryLogistics() {
    let data = {
      order_id: this.data.orderid
    };
    Util.post('Lease_Order/queryLogistics', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            logistics: resdata.Traces,
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

  //退租物流
  onlogisticsBack() {
    let data = {
      order_id: this.data.orderid
    };
    Util.post('Lease_Order/querySurrenderExpress', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            logistics: resdata.Traces,
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

    if (this.data.iscode) {
      this.setData({
        iscode: true
      })
    } else {
      let data = {
        order_id: this.data.orderid,
        users_id: this.data.usersId,
        way: 1
      };
      Util.post('Lease_Order/pickupCode', data)
        .then(res => {
          let resdata = res.data;
          if (res.code == 200) {
            this.setData({
              codeimg: resdata.data,
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


  //评价
  pingjia(e) {
    console.log(e)
    let goodid = e.currentTarget.dataset.good;
    let orderid = e.currentTarget.dataset.order;
    wx.navigateTo({
      url: '/pages/order/comments/comments?orderid=' + orderid + '&goodid=' + goodid
    });
  },
  //确认收货
  onConfirmGoods() {

    let data = {
      users_id: this.data.usersId,
      order_id: this.data.orderid
    };


    Util.post('Lease_Order/confirmReceipt', data)
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
  //确认售后
  afterSalesConfirmation() {
    let data = {
      order_id: this.data.orderid
    };
    Util.post('Lease_Order/afterSalesConfirmation', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.getData();
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000,
          });
        }
      })
  },

  //删除
  del() {
    let data = {
      users_id: this.data.usersId,
      order_id: this.data.orderid
    };
    Util.post('Lease_Order/delOrder', data)
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
  //预览
  onImagePreview(image) {
    console.log(image)
  },
  onlogistics() {
    this.setData({
      showlogistics: true
    })
    this.queryLogistics()
  },

  //关闭
  onclose() {
    this.setData({
      showlogistics: false
    })
  },
  onUnload() {
    // 页面被关闭
    clearInterval(payCountdown)
  },

})