// pages/order/people/people.js
var Util = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typenum: 0,
  },

  changetag(e) {
    this.setData({
      typenum: e.currentTarget.dataset.typenum
    })
    if (e.currentTarget.dataset.typenum == 1) {
      this.setData({
        name: '',
        phone: '',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let res = wx.getStorageSync('userinfos');
    console.log(res)
    this.setData({
      usersId: res.users_id,
      name: res.users_name,
      phone: res.users_phone || ''
    })
    // wx.startFa
  },

  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let name = e.detail.value.name;
    let phone = e.detail.value.phone;
    let people = {};
    if (name == "" || phone == "") {
      wx.showToast({
        icon: 'none',
        title: '请填写完整',
        duration: 2000,
      });
      return;
    }
    if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
      wx.showToast({
        icon: 'none',
        title: '手机号格式不正确',
        duration: 2000,
      });
      return;
    }
    if (this.data.typenum == 0) {
      if (name != this.data.name) {
        let data = {
          users_id: this.data.usersId,
          users_name: name
        };
        Util.post('Order/EditUserName', data)
          .then(res => {
            let resdata = res.data;
            console.log(resdata)
            if (res.code == 200) {
              wx.setStorageSync('userinfos', resdata);
            } else {
              wx.showToast({
                icon: 'none',
                title: res.message,
                duration: 2000,
              });
            }
          })
      }
      people.type = String(this.data.typenum);
      people.name = name;
      people.phone = phone;
    } else {
      people.type = String(this.data.typenum);
      people.name = name;
      people.phone = phone;
    }
    console.log(people)
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      people: people
    })
    wx.navigateBack();
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