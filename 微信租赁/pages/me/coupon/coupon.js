const app = getApp()
var Util = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navlist: [
      { title: '未使用' },
      { title: '已使用' },
      { title: '已失效' },
      { title: '领取' },
    ],
    activeTab: 0,
  },

  onChange(event) {
    let index = event.detail.index
    this.setData({
      activeTab: index
    })
    if (index == 3) {
      this.getcouponlist()
    }
    else {
      this.couponlist()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.couponlist();
  },

  couponlist() {
    let type = this.data.activeTab
    let userId = wx.getStorageSync('userId');
    let data = {
      user_id: userId,
      state: type + 1
    };
    Util.post('Lease/user_coupons', data)
      .then(res => {
        let resdata = res.data;
        let list = [];
        if (res.code == 200 && resdata.length > 0) {
          for (let i in resdata) {
            let info = {
              coupon_name: resdata[i].coupon_name,
              coupons_money: Number(resdata[i].coupons_money),
              end_time: resdata[i].coupons_money.split(" "),
              coupons_condition: resdata[i].coupons_condition,
            };
            list.push(info)
          }
          this.setData({
            list,
          })
        } else {
          this.setData({
            list: []
          })
          // wx.showToast({
          //    title: res.message,
          //    icon: 'none',
          //   duration: 2000,
          // });

        }
      })
  },

  getcouponlist() {
    let userId = wx.getStorageSync('userId');
    let data = {
      users_id: userId,
    };
    Util.post('Lease/get_coupons', data)
      .then(res => {
        console.log(res)
        let resdata = res.data;
        let getlist = [];
        if (res.code == 200 && resdata) {
          for (let i in resdata) {
            let info = {
              coupon_name: resdata[i].coupon_name,
              coupons_money: Number(resdata[i].coupons_money),
              end_time: resdata[i].coupons_money.split(" "),
              coupons_condition: resdata[i].coupons_condition,
              activity_id: resdata[i].activity_id,
              coupons_id: resdata[i].coupons_id,
            };
            getlist.push(info)
          }
          this.setData({
            getlist,
          })
        } else {
          this.setData({
            getlist: []
          })
          // wx.showToast({
          //    title: res.message,
          //    icon: 'none',
          //   duration: 2000,
          // });
        }
      })
  },

  getup(e) {
    let userId = wx.getStorageSync('userId');
    let activity_id = e.currentTarget.dataset.activity_id;
    let coupons_id = e.currentTarget.dataset.coupons_id;
    let url = app.url + 'api/Lease/Receive_coupon';
    let data = {
      user_id: userId,
      activity_id: activity_id,
      coupons_id: coupons_id,
    };
    Util.post('Lease/Receive_coupon', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1000,
            success: () => {
            },
          });
          setTimeout(() => {
            this.getcouponlist()
          }, 1500)
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000,
          });
        }
      })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})