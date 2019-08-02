const app = getApp()
var Util = require('../../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typenum: 0,
    iscode: false,
  },


  submit() {
    if (this.data.typenum == 0) {
    let data = {
        trust_id: this.data.trust_id
    }
    Util.post('Trusteeship/fieldDelivery',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            codeimg: res.data,
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
    if (this.data.typenum == 1) {
      wx.navigateTo({
        url: `../postDeli/postDeli?trust_id=${this.data.trust_id}`
      });
    }
    if (this.data.typenum == 2) {
      wx.navigateTo({
        url: `../platformDeli/platformDeli?trust_id=${this.data.trust_id}`
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type,
      trust_id: options.trust_id
    })
    this.getdata()
  },
  close() {
    this.setData({
      ismodel: false
    })
  },
getdata(){
    let data = {
        trust_id: this.data.trust_id
    };
    Util.post('Trusteeship/trustDetails',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
        let ismodel = '';
          if (res.data.trust_status == "审核通过") {
            ismodel = true
          }
          this.setData({
            detail: res.data,
            ismodel: ismodel
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
  changetag(e) {
    this.setData({
      typenum: e.currentTarget.dataset.typenum
    })
  },
  onclose() {
    this.setData({
      iscode: false
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