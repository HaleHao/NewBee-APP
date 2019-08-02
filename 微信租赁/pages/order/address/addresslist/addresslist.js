const app = getApp()
var Util = require('../../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userId = wx.getStorageSync('userId');
    this.setData({
      userId: userId
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  addaddress(e) {
    let ads_id = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: `/pages/order/address/addaddress/addaddress?id=${ads_id}`,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  radioChange: function (e) {
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];  //当前页面
    let prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      getaddress: this.data.list[e.detail.value]
    })
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onClose(event) {
    const { position, instance } = event.detail;
    console.log(event)
    let index = event.currentTarget.dataset.index;
    switch (position) {
      case 'cell':
        instance.close();
        break;
      case 'right':
        wx.showModal({
          title: '',
          content: '确定删除吗？',
          success: res => {
            const { list } = this.data;
            instance.close();
            if (res.confirm) {
              this.delel(list[index].ads_id)
              list.splice(index, 1);
              this.setData({
                list: [...list],
              });
            } else if (res.cancel) {
              // console.log('用户点击取消')
            }
          }
        })
        break;
    }
  },

  delel(ads_id) {
    let data = {
      ads_id: ads_id
    }
    Util.post('Lease/ads_detele', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000,
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


  onShow: function () {
    this.getlist()
  },

  getlist() {
    let data = {
      users_id: this.data.userId,
    };
    Util.post('Lease/ads_select', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            list: resdata
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