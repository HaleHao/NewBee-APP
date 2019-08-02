var Util = require('../../../../utils/http.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
 allmoney: "",
    value: '',
    card: ''

  },
  all() {
    this.setData({
      value: this.data.allmoney
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  manmey(e) {
    let userId = wx.getStorageSync('userId');
     let info = wx.getStorageSync('info')
    let data={
      users_id:userId
    }
    Util.post('Order/GetCash',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
        if (info.data) {
          this.setData({
            bank: info.data.info,
            allmoney: resdata.users_balance
          })
        } else {
          this.setData({
            bank: resdata.bank,
            allmoney: resdata.users_balance
          })
        }
        } else {
          wx.showToast({
             title: res.message,
             icon: 'none',
            duration: 2000,
          });
        }
      })
  },
    alls(e) {
    this.setData({
      value: this.data.allmoney
    })
  },
  all(e) {
    console.log('e',e)
    this.setData({
      value:e.detail.value
    })
  },

  next(e) {
    let userId = wx.getStorageSync('userId');
    let allmoney = this.data.value
    if (Number(allmoney) <= 0) {
        wx.showToast({
             title: '提现金额小于0',
             icon: 'none',
            duration: 2000,
          });
      return
    }
    let data = {
      users_id: userId,
      user_bank_id: this.data.bank.user_bank_id,
      money: Number(allmoney),
    };
    Util.post('Order/AddCash',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
        wx.showToast({
          title: res.message,
          icon: 'success',
          duration: 1000,
           success: () => {
           },
        });
         setTimeout(()=>{
                wx.navigateBack({
                      delta: 1
                 })
           },2000)
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
  this.manmey()
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