// pages/order/locationList/locationList.js
const app = getApp()
var Util = require('../../../utils/http.js');
Page({
  data: {
  pagenum:1,
  list:[],
  },
  goback(){
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    console.log(query)
    let id,orderid,shopping,chose;
       id= query.id?query.id:'';
       orderid= query.orderid?query.orderid:'';
      shopping=query.shopping?query.shopping:'';
      chose=query.chose?query.chose:'';
    this.setData({
      goods_id: id,
      orderid: orderid,
      shopping:shopping
    })
    this.getLocation(chose);
  },

  getLocation(chose) {
    let that = this;
    wx.getLocation({
      success(res) {
        console.log(res, "getLocation")
        that.setData({
          lat: res.latitude,
          lng: res.longitude
        })
        if (chose) {
          that.getGetSelfShoptwo()
        } else {
          that.getGetSelfShop()
        }
      },
    })
  },

  getGetSelfShoptwo() {
    var data = {
      lat: this.data.lat,
      lng: this.data.lng,
    };
    Util.post('Trusteeship/getStore', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            resdata: resdata,
            list: resdata.concat(this.data.list)
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

  getGetSelfShop() {
    if (this.data.shopping == "shopping") {
      var url ='Buy_Order/BuySelfShop';
      var data = {
        lat: this.data.lat,
        lng: this.data.lng,
        order_id: this.data.orderid,
        page: this.data.pagenum
      };
    } else {
      var url = 'Order/GetSelfShop';
      var data = {
        lat: this.data.lat,
        lng: this.data.lng,
        goods_id: this.data.goods_id,
        page: this.data.pagenum
      };
    }
      Util.post(url, data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            resdata: resdata,
            list: resdata.concat(this.data.list)
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
 radioChange: function (e) {
    console.log('你选择的框架是：', e.detail.value)
    this.setData({
      checkedNum: e.detail.value
    })
  },

  goback() {
    let checkedNum = this.data.checkedNum,
      list = this.data.list
    if (checkedNum < -1) {
      wx.showToast({
        icon: 'none',
        title: '请选择地址',
        duration: 2000,
      });
    } else {
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];  //当前页面
      var prevPage = pages[pages.length - 2]; //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        selfShop: list[checkedNum]
      })
      wx.navigateBack();
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 页面被拉到底部
    let page = ++this.data.pagenum;
    this.setData({
      pagenum: page
    })
    console.log(this.data.pagenum)
    this.getGetSelfShop()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})