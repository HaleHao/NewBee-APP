// pages/me/userinfo/info/info.js
const app = getApp()
var Util = require('../../../../utils/http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexList: [{
      id: 0,
      val: "男"
    }, {
      id: 1,
      val: "女"
    }],
    sexIndex: 0,
    sextext: '',
    region: [],
    provinces: ''
  },
  sexchange(e) {
    this.setData({
      sexIndex: e.detail.value,
      sextext: this.data.sexList[e.detail.value].val
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let users_id = wx.getStorageSync('userId');
    this.setData({
      usersId: users_id
    })
    this.getdata()
  },

  getdata() {
    let data = {
      users_id: this.data.usersId
    };
    Util.post('Lease/users_detail', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200 && resdata) {
          console.log(resdata)
          this.setData({
            resdata: resdata,
            users_name: resdata.users_name || '',
            users_id: resdata.users_id,
            date: resdata.users_birthday || '',
            detailval: resdata.users_address || "",
            provinces: resdata.users_province,
            city: resdata.users_city,
            area: resdata.users_district,
          });
          let sex_id = resdata.users_sex;
          if (sex_id == 1) {
            this.setData({
              sextext: this.data.sexList[0].val
            })
          } else if (sex_id == 2) {
            this.setData({
              sextext: this.data.sexList[1].val
            })
          } else {
            this.setData({
              sextext: '未知'
            })
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'success',
            duration: 2000,
          });
        }
      })
  },



  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let sex_id = "";
    if (this.data.sextext == "男") {
      sex_id = 1;
    } else {
      sex_id = 2;
    }
    let data = {
      users_id: this.data.usersId,
      users_name: e.detail.value.nickname,
      users_sex: sex_id,
      users_birthday: this.data.date,
      users_province: this.data.provinces,
      users_city: this.data.city,
      users_district: this.data.area,
      users_address: e.detail.value.adddetail
    };

    Util.post('Lease/users_update', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          wx.showToast({
            title: res.message,
            icon: 'success',
            duration: 1000,
          });
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 3000)
        } else {
          wx.showToast({
            title: res.message,
            icon: 'success',
            duration: 2000,
          });
        }
      })
  },

  sexchange(e) {
    this.setData({
      sexIndex: e.detail.value,
      sextext: this.data.sexList[e.detail.value].val
    });
  },

  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let region = e.detail.value
    this.setData({
      region: region,
      provinces: region[0],
      city: region[1],
      area: region[2],
    })
  },

  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})