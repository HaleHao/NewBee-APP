const app = getApp()
Page({
  data: {
    typenum: 0,
    navlist: [
      { title: '待付款' },
      { title: '预租中' },
      { title: '已预定' },
      { title: '租赁中' },
      { title: '已超期' },
      { title: '待评价' },
      { title: '已评价' },
      { title: '已取消' },
    ],
    activeTab: 0,
    navlist2: [
      { title: '待付款' },
      { title: '待发货' },
      { title: '待收货' },
      { title: '待评价' },
      { title: '已完成' },
    ],
    activeTab2: 0,
    iscancel: false,
    canceltext: ['我不想租了', '商品规格填错了', '收货地址写错了', '支付有问题', '重新下单', '其他'],
    list: [],
    buylist: [],
    usersId: '',
    orderid: '',
    buyid: '',
    withouTreason: '我不想租了',
    codeimg: ''
  },


  onLoad(query) {
    if (query.typenum) {
      this.setData({
        typenum: 1
      })
    } else {
      this.setData({
        typenum: 0
      })
    }
    let res = my.getStorageSync({ key: 'userinfos' });
    console.log(res.data)
    this.setData({
      usersId: res.data.userinfos.users_id,
      activeTab:query.activeTab
    })
    this.getlist();
    this.getBuyorder()
  },

  onShow() {
    let res = my.getStorageSync({ key: 'userinfos' });
    console.log(res.data)
    if (res.data == null) {
      my.reLaunch({
        url: '/pages/login/login/login'
      });
    } else {
      this.getlist();
      this.getBuyorder()
    }
  },
  getlist() {
    let url = app.url + 'api/Lease_Order/LeaseQuery';
    let data = {
      //  users_id: 383,
      users_id: this.data.usersId,
      order_status: this.data.activeTab

    };

    app.appRequest('post', url, data, (res) => {
      console.log(res, "Lease_Order/LeaseQuery")
      if (res.code == 200) {
        let resdata = res.data;
        my.hideLoading();
        let countarr = []
        let arr = []
        for (let [k, v] of Object.entries(resdata)) {
          if (k == 'count') {
            countarr = v
          } else {
            arr.push(v)
          }
        }
        this.setData({
          list: arr
        })
        let newnavlist = [];
        for (let [k, v] of this.data.navlist.entries()) {
          if (countarr[k] == 0) {
            v.badgeText = '',
              v.badgeType = ''
          } else {
            v.badgeText = countarr[k],
              v.badgeType = "text"
          }

          newnavlist.push(v)
        }
        console.log(newnavlist, "newnavlist")
        this.setData({
          navlist: newnavlist
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
      my.showToast({
        type: 'exception',
        content: '网络出错',
        duration: 3000,
      });
    });
  },
  getBuyorder() {
    let url = app.url + 'api/Buy_Order/LeaseQuery';
    let data = {
      // users_id: 383,
      users_id: this.data.usersId,
      status: this.data.activeTab2
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "api/Buy_Order/LeaseQuery")
      if (res.code == 200) {
        let resdata = res.data;
        my.hideLoading();
        let countarr = []
        let arr = []
        for (let [k, v] of Object.entries(resdata)) {
          if (k == 'count') {
            countarr = v
          } else {
            arr.push(v)
          }
        }
        this.setData({
          buylist: arr
        })
        let newnavlist = [];
        for (let [k, v] of this.data.navlist2.entries()) {
          if (countarr[k] == 0) {
            v.badgeText = '',
              v.badgeType = ''
          } else {
            v.badgeText = countarr[k],
              v.badgeType = "text"
          }

          newnavlist.push(v)
        }
        console.log(newnavlist, "navlist2")
        this.setData({
          navlist2: newnavlist
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
      my.showToast({
        type: 'exception',
        content: '网络出错',
        duration: 3000,
      });
    });
  },

  //取消订单
  cancelOrder() {
    if (this.data.orderid) {
      var url = app.url + 'api/Lease_Order/usersSurrender';
      var data = {
       // users_id: this.data.usersId,
        order_id: this.data.orderid,
        reason: this.data.withouTreason
      };
    }
    if (this.data.buyid) {
      var url = app.url + 'api/Buy_Order/cancelOrder';
      var data = {
        users_id: this.data.usersId,
        buyorder_id: this.data.buyid,
        withouTreason: this.data.withouTreason
      };
    }
    app.appRequest('post', url, data, (res) => {
      console.log(res, "cancelOrder")
      my.hideLoading();
      if (res.code == 200) {
        let resdata = res.data;
        this.setData({
          iscancel: false
        });
        this.getlist();
        this.getBuyorder()
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

  //删除订单
  del(e) {
    my.confirm({
      title: '提示',
      content: '确定删除订单吗？',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm == true) {
          let url = app.url + 'api/Lease_Order/delOrder';
          let data = {
            users_id: this.data.usersId,
            order_id: e.currentTarget.dataset.orderid
          };
          app.appRequest('post', url, data, (res) => {
            console.log(res, "cancelOrder")
            my.hideLoading();
            if (res.code == 200) {
              let resdata = res.data;
              this.getlist();
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
        } else {
          my.showToast({
            type: 'success',
            content: '已取消',
            duration: 3000,
          });
        }
      },
    });
  },

  //确认收货
  onConfirmGoods(e) {
    let url = app.url + 'api/Lease_Order/confirmReceipt';
    let data = {
      users_id: this.data.usersId,
      order_id: e.currentTarget.dataset.orderid,
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "confirmReceipt")
      my.hideLoading();
      if (res.code == 200) {
        this.getlist();
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
  //确认售后
  sureorder(e) {
    let url = app.url + 'api/Lease_Order/afterSalesConfirmation';
    let data = {
      users_id: this.data.usersId,
      order_id: e.currentTarget.dataset.orderid,
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "afterSalesConfirmations")
      my.hideLoading();
      if (res.code == 200) {
        this.getlist();
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
  // 取货码
  getcode(e) {
    let url = app.url + 'api/Lease_Order/pickupCode';
    let data = {
      users_id: this.data.usersId,
      order_id: e.currentTarget.dataset.orderid,
      way: 1
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "pickupCode")
      my.hideLoading();
      if (res.code == 200) {
        this.setData({
          iscode: true,
          codeimg:res.data,
        });
        this.getlist();
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
  pingjia(e) {
    console.log(e)
    let goodid = e.currentTarget.dataset.good;
    let orderid = e.currentTarget.dataset.order;
    my.navigateTo({
      url: '/pages/order/comments/comments?orderid=' + orderid + '&goodid=' + goodid
    });
  },

  //确认售后
  onConfirmsales(e) {
    let url = app.url + 'api/Lease_Order/afterSalesConfirmation';
    let data = {
      order_id: e.currentTarget.dataset.orderid,
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "afterSalesConfirmation")
      my.hideLoading();
      if (res.code == 200) {
        this.getlist();
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



  changetag(e) {
    this.setData({
      typenum: e.currentTarget.dataset.typenum
    })
    if (this.data.typenum == 0) {
      this.getlist();

    } else {
      this.getBuyorder()
    }
  },

  // 租转售 确认收货
  onGoods(e) {
    let url = app.url + 'api/Buy_Order/confirmReceipt';
    let data = {
      users_id: this.data.usersId,
      buyorder_id: e.currentTarget.dataset.buyid
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "confirmReceipt")
      my.hideLoading();
      if (res.code == 200) {
        this.getBuyorder();
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

  // 租转售取货码
  getbuycode(e) {
    let url = app.url + 'api/Buy_Order/createCode';
    let data = {
      buyorder_id: e.currentTarget.dataset.buyid,
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "createCode")
      my.hideLoading();
      if (res.code == 200) {
        this.setData({
          iscode: true,
          codeimg: res.data
        });
        this.getlist();
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

  todetil(e) {
    let orderid = e.currentTarget.dataset.orderid;
    my.navigateTo({
      url: '../orderDetail/orderDetail?id=' + orderid + '&activeTab=' + this.data.activeTab
    });
  },
  buypingjia(e) {
    console.log(e)
    let goodid = e.currentTarget.dataset.good;
    let buyid = e.currentTarget.dataset.buyid;
    my.navigateTo({
      url: '/pages/order/comments/comments?buyid=' + buyid + '&goodid=' + goodid
    });
  },
  cancelradioChange(e) {
    console.log(e.detail.value)
    this.setData({
      withouTreason: e.detail.value
    })
  },
  handleTabClick({ index }) {
    this.setData({
      activeTab: index,
    });
    console.log(index)
    this.getlist();
  },
  handleTabClick2({ index }) {
    this.setData({
      activeTab2: index,
    });
    console.log(index);
    this.getBuyorder()
  },

  oncancel(e) {
    console.log(e.currentTarget.dataset.orderid)
    console.log(e.currentTarget.dataset.buyid)
    if (e.currentTarget.dataset.orderid) {
      var orderid = e.currentTarget.dataset.orderid;
    }
    if (e.currentTarget.dataset.buyid) {
      var buyid = e.currentTarget.dataset.buyid;
    }
    this.setData({
      iscancel: true,
      orderid: orderid,
      buyid: buyid
    });
  },
  
  onclose() {
    this.setData({
      iscode: false,
      iscancel: false
    });
  },
});
