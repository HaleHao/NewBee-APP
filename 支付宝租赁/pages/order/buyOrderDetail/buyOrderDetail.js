const app = getApp()
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
    let res = my.getStorageSync({ key: 'userinfos' });
    console.log(res.data)
    this.setData({
      usersId: res.data.userinfos.users_id
    })
    this.getdata()
  },
  getdata() {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Buy_Order/orderDetails';
    let data = {
      users_id: this.data.usersId,
      buyorder_id: this.data.buyid,
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
        if (this.data.data.buyorder_status == 1) {
          payCountdown = setInterval(() => {
            this.countdown(this.data.data.create_time)
          }, 1000)
        }
        if (!this.data.data.express_no == '') {
          this.queryLogistics()
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
      my.hideLoading();
    });
  },
  queryLogistics() {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Buy_Order/queryLogistics';
    let data = {
      buyorder_id: this.data.buyid,
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "queryLogistics")
      my.hideLoading();
      let resdata = res.data;
      console.log(resdata, "queryLogistics")
      if (res.code == 200) {
        this.setData({
          logistics: resdata.Traces
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

  //取货码
  getcode() {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Buy_Order/createCode';
    let data = {
      buyorder_id: this.data.buyid,
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "createCode")
      my.hideLoading();
      let resdata = res.data;
      console.log(resdata, "createCode")
      if (res.code == 200) {
        this.setData({
          codeimg: resdata,
          iscode: true
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
  //确认收货
  onGoods() {
    let url = app.url + 'api/Buy_Order/confirmReceipt';
    let data = {
      users_id: this.data.usersId,
      buyorder_id: this.data.buyid
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "confirmReceipt")
      my.hideLoading();
      if (res.code == 200) {
        my.navigateBack({
          delta: 1
        })
      } else {
        my.showToast({
          type: 'fail',
          content: '操作失败' || res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);

    });
  },

  //评价
  buypingjia(e) {
    console.log(e)
    let goodid = e.currentTarget.dataset.good;
    let buyid = e.currentTarget.dataset.buyid;
    my.navigateTo({
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
