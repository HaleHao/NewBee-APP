const app = getApp()
var Util = require('../../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typenum: 0,
    navlist: [
      { title: '全部' },
      { title: '审核中' },
      { title: '托管中' },
      { title: '已退回' }
    ],
    activeTab: 0,
    navlist2: [
      { title: '全部' },
      { title: '审核中' },
      { title: '托管中' },
    ],
    activeTab2: 0,
  },

  // changetag(e) {
  //   this.setData({
  //     typenum: e.currentTarget.dataset.typenum
  //   })
  // },

  // gohostCancel() {
  //   wx.navigateTo({
  //     url: '../hostCancel/hostCancel'
  //   });
  // },
  // gopay() {
  //   wx.navigateTo({
  //     url: '../pay/pay'
  //   });
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getlist()
  },

  getlist(e) {

    let userId = wx.getStorageSync('userId');
    let activeTab = this.data.activeTab

    let data = {
      users_id: userId,
      state: activeTab
    };
    Util.post('Trusteeship/queryTrusteeship', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            listLeft: resdata,
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

  getlist2(e) {
    let userId = wx.getStorageSync('userId');
    let activeTab2 = this.data.activeTab2
    let data = {
      users_id: userId,
      state: activeTab2
    };
    Util.post('Trusteeship/queryNohardware', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            listRight: resdata,
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


  changetag1(e) {
    this.setData({
      typenum: e.currentTarget.dataset.typenum
    })
    this.getlist()
  },

  changetag2(e) {
    this.setData({
      typenum: e.currentTarget.dataset.typenum
    })
    this.getlist2()
  },

  handleTabClick(e) {
    console.log(e)
    this.setData({
      activeTab: e.detail.index,
    });
    this.getlist()
  },
  handleTabClick2(e) {
    console.log(e)
    this.setData({
      activeTab2: e.detail.index,
    });
    this.getlist2()
  },

  gohostCancel() {
    wx.navigateTo({
      url: '../hostCancel/hostCancel'
    });
  },
  gopay() {
    wx.navigateTo({
      url: '../pay/pay'
    });
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