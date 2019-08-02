// pages/goodsDetail/goodsDetail.js
const app = getApp()
var Util = require('../../utils/http.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    discountlist:[],
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    isactivity: false,
    isshow: false,
    iscartshow: false,
    showfriend: false,

    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    isshow: false,
  },

  onclose() {
    this.setData({
      isactivity: false,
      isshow: false,
      iscartshow: false,
      showfriend: false,
    })
  },

  showactivity() {
    this.setData({
      isactivity: true
    })
  },

  onbuy() {
    this.setData({
      isshow: true,
    });
  },


  onfriend() {
    this.setData({
      showfriend: true,
    });
  },

  buy() {
    wx.navigateTo({
      url: '/pages/buy/buy?goods_id=' + this.data.goods_id
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userId = wx.getStorageSync('userId');
    if (!userId) {
      wx.reLaunch({
        url: '/pages/login/wxlogin/wxlogin'
      })
    } else {
      this.setData({
        goods_id: options.id,
        usersId: userId
      })
      this.getdetail(options.id);
      this.GetServiceTel();
    }
  },



  
  GetServiceTel() {
    Util.post('Order/GetServiceTel')
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            tel: resdata
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

  getdetail(id) {
    let data = {
      goods_id: id
    };
    Util.post('Lease/Goods_Detail', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.getActivity(resdata.goods_id)
          WxParse.wxParse("details", "html", resdata.gd_desc, this);
          this.setData({
            detail: resdata,
            swrper: resdata.gd_img,
            swrperVideo: resdata.goods_video
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
  getActivity(goods_id) {
    let data = {
      goods_id: goods_id
    };
    Util.post('Order/GetGoodsActivity', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200 && resdata.length > 0) {
          this.setData({
            discountlist: resdata,
          })
        } else {
          // wx.showToast({
          //   icon: 'none',
          //   title: res.message,
          //   duration: 2000,
          // });
        }
      })
  },

  cell() {
    wx.makePhoneCall({
      number: this.data.tel
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady(res) {
    this.videoContext = wx.createVideoContext('video')
  },

  bindplay() {
    this.videoContext.play()
    console.log('播放')
    this.setData({
      autoplay: false,
    })
  },

  bindPause() {
    this.videoContext.pause()
    console.log('暂停')
    this.setData({
      autoplay: true,
    })
  },

  bindEnded() {
    this.setData({
      autoplay: true,
    })
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

  },

  addcart() {
    this.setData({
      iscartshow: true,
    });
  },

  // 加入购物车
  addCart() {
    let data = {
      users_id: this.data.usersId,
      gd_id: this.data.goods_id,
      cart_price: this.data.detail.hire_price.price,
      cart_num: 1,
      attr_ids: "",
      attr_names: ""
    };
    Util.post('Lease/Add_cart', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          wx.showToast({
            title: '加入成功',
            icon: 'success',
            duration: 2000
          })
          this.setData({
            iscartshow: false,
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

  onShareAppMessage(e) {
    console.log(e)
    let usersId = wx.getStorageSync('usersId');
    var detail = this.data.detail;
    if (e.target.id == 1) {
      return {
        path: "/pages/goodsDetail/goodsDetail?id=" + detail.goods_id + "&users_id=" + usersId,
        success: function (e) {
        },
        title: detail.goods_name,
        imageUrl: detail.gd_img[0],
      };
    }
    if (e.target.id == 2) {
      return {
        path: "/pages/friendBuyShare/friendBuyShare?id=" + detail.goods_id + "&users_id=" + usersId,
        success: function (e) {
        },
        title: detail.goods_name,
        imageUrl: detail.gd_img[0],
      };
    }
  },
})