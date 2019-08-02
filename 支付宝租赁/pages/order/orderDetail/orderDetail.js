const app = getApp()
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
      orderid: query.id,
      activeTab: query.activeTab
    })
    let res = my.getStorageSync({ key: 'userinfos' });
    console.log(res.data)
    this.setData({
      usersId: res.data.userinfos.users_id
    })
    this.getData();

  },
  getData() {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Lease_Order/orderDetails';
    let data = {
      users_id: this.data.usersId,
      order_id: this.data.orderid,
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "orderDetails")
      my.hideLoading();
      let resdata = res.data;
      console.log(resdata, "orderDetails")
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
        my.showToast({
          type: 'fail',
          content:res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
      my.hideLoading();
    });
  },

  //售后详情
  getSalesData() {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Lease_Order/AfterDetails';
    let data = {
      order_id: this.data.orderid
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "AfterDetails")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        this.setData({
          salesData: resdata,
        })
      } else {
        // my.showToast({
        //   type: 'fail',
        //   content:res.message,
        //   duration: 3000,
        // });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
      my.hideLoading();
    });
  },
  //物流
  queryLogistics() {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Lease_Order/queryLogistics';
    let data = {
      order_id: this.data.orderid
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "queryLogistics")
      my.hideLoading();
      let resdata = res.data;
      console.log(resdata)
      if (res.code == 200) {
        this.setData({
          logistics: resdata.Traces,
        })
      } else {
        my.showToast({
          type: 'fail',
         content:res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
      my.hideLoading();
    });
  },

  //退租物流
  onlogisticsBack() {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Lease_Order/querySurrenderExpress';
    let data = {
      order_id: this.data.orderid
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "querySurrenderExpress")
      my.hideLoading();
      if (res.code == 200) {
        this.setData({
          logistics: resdata.Traces,
        })
      } else {
        my.showToast({
          type: 'fail',
         content:res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
      my.hideLoading();
    });
  },
  //取货码
  getcode(type) {
    if (this.data.iscode) {
      this.setData({
        iscode: true
      })
    } else {
      my.showLoading({
        title: "加载中..",
        mask: true,
      });
      let url = app.url + 'api/Lease_Order/pickupCode';
      let data = {
        order_id: this.data.orderid,
        users_id: this.data.usersId,
        way: type
      };
      app.appRequest('post', url, data, (res) => {
        console.log(res, "pickupCode")
        my.hideLoading();
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            codeimg: resdata.data,
            iscode: true
          })
        } else {
          my.showToast({
            type: 'fail',
             content:res.message,
            duration: 3000,
          });
        }
      }, (err) => {
        console.log('请求错误信息：' + err);
        my.hideLoading();
      });
    }
  },
  //评价
  pingjia(e) {
    console.log(e)
    let goodid = e.currentTarget.dataset.good;
    let orderid = e.currentTarget.dataset.order;
    my.navigateTo({
      url: '/pages/order/comments/comments?orderid=' + orderid + '&goodid=' + goodid
    });
  },
  //确认收货
  onConfirmGoods() {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Lease_Order/confirmReceipt';
    let data = {
      users_id: this.data.usersId,
      order_id: this.data.orderid
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "confirmReceipt")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        my.navigateBack({
          delta: 1
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
      my.hideLoading();
    });
  },
  //确认售后
  afterSalesConfirmation() {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Lease_Order/afterSalesConfirmation';
    let data = {
      order_id: this.data.orderid
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "afterSalesConfirmation")
      my.hideLoading();
      if (res.code == 200) {
        this.getData();
      } else {
        my.showToast({
          type: 'fail',
           content:res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
      my.hideLoading();
    });
  },

  //删除
  del() {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Lease_Order/delOrder';
    let data = {
      users_id: this.data.usersId,
      order_id: this.data.orderid
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "api/Lease_Order/delOrder")
      my.hideLoading();
      if (res.code == 200) {
        my.navigateBack({
          delta: 1
        })
      } else {
        my.showToast({
          type: 'fail',
          content:res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
      my.hideLoading();
    });
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
});
