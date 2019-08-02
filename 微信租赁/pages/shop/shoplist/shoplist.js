// pages/shop/shoplist/shoplist.js
const app = getApp()
var Util = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: ''
  },

  getData() {
    Util.post('Lease/store_select')
      .then(res => {
        console.log(res)
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            shoplist: resdata
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

  onblur(e) {
    this.setData({
      keyword: e.detail
    })
    if (!e.detail) {
      this.getData()
    }
  },

  Search() {
    let keyword = this.data.keyword
    this.commonSearch(keyword)
  },

  onSearch(e) {
    this.commonSearch(e.detail)
  },

  commonSearch(e) {
    let data = {
      keyword: e
    }
    Util.post('Trusteeship/searchStore', data)
      .then(res => {
        console.log(res)
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            shoplist: resdata
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

  onlookmap(e) {
    console.log(e)
    let map = e.currentTarget.dataset.map;
    let text = e.currentTarget.dataset.text;
    let address = e.currentTarget.dataset.address;
    let coordinate = map.split(',');
    console.log(coordinate)

    const latitude = Number(coordinate[1])
    const longitude = Number(coordinate[0])



    wx.openLocation({
      latitude,
      longitude,
      scale: 18,
      name: text,
      address: address,
    })

    // wx.openLocation({
    //   scale: 16,
    //   longitude: coordinate[1],
    //   latitude: coordinate[0],
    //   name: text,
    //   address: address,
    // });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
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