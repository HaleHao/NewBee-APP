const app = getApp()
var Util = require('../../../utils/http.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    typenum: 0,
    navlist: [{
      title: '待付款'
    },
    {
      title: '预租中'
    },
    {
      title: '已预定'
    },
    {
      title: '租赁中'
    },
    {
      title: '已超期'
    },
    {
      title: '待评价'
    },
    {
      title: '已评价'
    },
    {
      title: '已取消'
    },
    ],
    activeTab: 0,
    navlist2: [{
      title: '待付款'
    },
    {
      title: '待发货'
    },
    {
      title: '待收货'
    },
    {
      title: '待评价'
    },
    {
      title: '已完成'
    },
    ],
    activeTab2: 0,
    iscancel: false,
    canceltext: ['我不想租了', '商品规格填错了', '收货地址写错了', '支付有问题', '重新下单', '其他'],
    list: [{
      order_status: 1
    }]
  },

  changetag(e) {
    this.setData({
      typenum: e.currentTarget.dataset.typenum
    })
  },

  onChange(event) {
    this.setData({
      activeTab: event.detail.index
    })
    this.getlist();
  },

  onChange2(event) {
    this.setData({
      activeTab2: event.detail.index
    })
    this.getBuyorder()
  },

  // oncancel() {
  //   this.setData({
  //     iscancel: true,
  //   });
  // },

  getcode() {
    this.setData({
      iscode: true,
    });
  },

  onclose() {
    this.setData({
      iscode: false,
      iscancel: false
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.typenum) {
      this.setData({
        typenum: 1
      })
    } else {
      this.setData({
        typenum: 0
      })
    }
    let userId = wx.getStorageSync('userId');
    this.setData({
      usersId: userId,
      // activeTab:options.activeTab
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function () {
    this.getlist();
    this.getBuyorder()
  },

  getlist() {
    let data = {
      users_id: this.data.usersId,
      order_status: this.data.activeTab
    };
    Util.post('Lease_Order/LeaseQuery', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
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
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000,
          });
        }
      })
  },
  getBuyorder() {

    let data = {
      users_id: this.data.usersId,
      status: this.data.activeTab2
    };
    Util.post('Buy_Order/LeaseQuery', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
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
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000,
          });
        }
      })
  },

  //取消订单
  cancelOrder() {
    if (this.data.orderid) {
      var url = 'Lease_Order/usersSurrender';
      var data = {
      
        order_id: this.data.orderid,
        reason: this.data.withouTreason
      };
    }
    if (this.data.buyid) {
      var url = 'Buy_Order/cancelOrder';
      var data = {
        users_id: this.data.usersId,
        buyorder_id: this.data.buyid,
        reason: this.data.withouTreason
      };
    }
    Util.post(url, data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            iscancel: false
          });
          this.getlist();
          this.getBuyorder()
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000,
          });
        }
      })
  },






  //删除订单
  del(e) {
    let orderid = e.currentTarget.dataset.orderid
    wx.showModal({
      title: '提示',
      content: '确定删除订单吗？',
      confirmText: '确认',
      cancelText: '取消',
      success: res => {
        if (res.confirm) {

          console.log('用户点击确定')
          this.delorder(orderid)

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


  //删除订单 
  delorder(orderid) {
    let data = {
      users_id: this.data.usersId,
      order_id: orderid
    };

    Util.post('Lease_Order/delOrder', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.getlist();
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
  onConfirmGoods(e) {
    let data = {
      users_id: this.data.usersId,
      order_id: e.currentTarget.dataset.orderid,
    };
    Util.post('Lease_Order/confirmReceipt', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.getlist();
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
  sureorder(e) {
    let data = {
      users_id: this.data.usersId,
      order_id: e.currentTarget.dataset.orderid,
    }
    Util.post('Lease_Order/afterSalesConfirmation', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.getlist();
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000,
          });
        }
      })
  },

  // 取货码
  getcode(e) {
    let url = app.url + 'api/Lease_Order/pickupCode';
    let data = {
      users_id: this.data.usersId,
      order_id: e.currentTarget.dataset.orderid,
      way: 1
    }
    Util.post('Lease_Order/pickupCode', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            iscode: true,
            codeimg: res.data,
          });
          this.getlist();
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
  pingjia(e) {
    console.log(e)
    let goodid = e.currentTarget.dataset.good;
    let orderid = e.currentTarget.dataset.order;
    wx.navigateTo({
      url: '/pages/order/comments/comments?orderid=' + orderid + '&goodid=' + goodid
    });
  },


  //确认售后
  onConfirmsales(e) {
    let data = {
      order_id: e.currentTarget.dataset.orderid,
    };
    Util.post('Lease_Order/afterSalesConfirmation', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.getlist();
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000,
          });
        }
      })
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
    let data = {
      users_id: this.data.usersId,
      buyorder_id: e.currentTarget.dataset.buyid
    };
    Util.post('Buy_Order/confirmReceipt', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.getBuyorder();
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000,
          });
        }
      })
  },

  // 租转售取货码
  getbuycode(e) {
    let url = app.url + 'api/Buy_Order/createCode';
    let data = {
      buyorder_id: e.currentTarget.dataset.buyid,
    }

    Util.post('Buy_Order/createCode', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            iscode: true,
            codeimg: res.data
          });
          this.getlist();
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000,
          });
        }
      })
  },


  todetil(e) {
    let orderid = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '../orderDetail/orderDetail?id=' + orderid + '&activeTab=' + this.data.activeTab
    });
  },
  buypingjia(e) {
    console.log(e)
    let goodid = e.currentTarget.dataset.good;
    let buyid = e.currentTarget.dataset.buyid;
    wx.navigateTo({
      url: '/pages/order/comments/comments?buyid=' + buyid + '&goodid=' + goodid
    });
  },
  cancelradioChange(e) {
    console.log(e.detail.value)
    this.setData({
      withouTreason: e.detail.value
    })
  },

  handleTabClick({
    index
  }) {
    this.setData({
      activeTab: index,
    });
    console.log(index)
    this.getlist();
  },

  handleTabClick2({
    index
  }) {
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  // onPullDownRefresh: function () {

  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})