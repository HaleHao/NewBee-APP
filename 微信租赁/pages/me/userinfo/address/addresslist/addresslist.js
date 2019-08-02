const app = getApp()
var Util = require('../../../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onClose(event) {
console.log(event)

  var index = e.currentTarget.dataset.index;

    const { position, instance } = event.detail;
    switch (position) {
      case 'cell':
        instance.close();
        break;
      case 'right':
        wx.showModal({
          title: '',
          content: '确定删除吗？',
          success(res) {
            instance.close();
            if (res.confirm) {
                let data = {
                    ads_id: index
                };
                Util.post('Lease/ads_detele',data)
                  .then(res => {
                    let resdata = res.data;
                    console.log(resdata)
                    if (res.code == 200) {
                      wx.showToast({
                        title: '删除成功',
                        icon: 'success',
                        duration: 3000,
                      });
                    } else {
                      wx.showToast({
                         title: res.message,
                         icon: 'success',
                        duration: 2000,
                      });
                    }
                  })
              // console.log('用户点击确定')
            } else if (res.cancel) {
              // console.log('用户点击取消')
            }
          }
        })
        break;
    }
  },

   onSwipeStart(e) {
    this.setData({
      swipeIndex: e.index,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let userId = wx.getStorageSync('userId');
    this.setData({
      usersId: userId
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
    this.getlist();
  },

  getlist() {
    let data = {
      users_id: this.data.usersId
    };
    Util.post('Lease/ads_select',data)
      .then(res => {
        let resdata = res.data;
        console.log(resdata)
        if (res.code == 200) {
            this.setData({
              list: resdata
            })
        } else {
          wx.showToast({
             title: res.message,
             icon: 'success',
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