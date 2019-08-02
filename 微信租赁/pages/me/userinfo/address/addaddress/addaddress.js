// pages/me/userinfo/address/addaddress/addaddress.js
const app = getApp()
var Util = require('../../../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: false,
    customItem:'',
    region:[]
  },
  onChange(event) {
    this.setData({
      checked: event.detail
    });
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    console.log(query)
    if (query.id) {
      this.setData({
        ads_id: query.id
      })
      this.getdetail();
    }
   let users_id = wx.getStorageSync('userId');  
    this.setData({
      usersId:users_id
    })
  },

  getdetail() {
    let data = {
      ads_id: this.data.ads_id
    }
    Util.post('Lease/Ads_Details',data)
      .then(res => {
        let resdata = res.data;
        console.log(resdata)
        if (res.code == 200) {
        this.setData({
          name : resdata.ads_user,
          phone : resdata.ads_phone,
          detail :resdata.ads_address,
          ischecked : resdata.ads_state == 2 ? true : false,
          provinces: resdata.ads_province,
          city: resdata.ads_city,
          area: resdata.ads_district,
        });
        } else {
          wx.showToast({
             title: res.message,
             icon: 'success',
            duration: 2000,
          });
        }
      })
  },

 bindRegionChange:function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let region= e.detail.value
    this.setData({
          region:region,
          provinces: region[0],
          city: region[1],
          area:region[2],
    })
  },

  onradio() {
    console.log(this.data.ischecked)
    this.setData({
      ischecked: !this.data.ischecked
    })
  },

  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let ads_user = e.detail.value.name;
    let ads_phone = e.detail.value.phone;
    let ads_address = e.detail.value.detail;
    if (ads_user == "" || ads_phone == "" || ads_address == "") {
      wx.showToast({
           title: '请填写完整',
             icon: 'none',
            duration: 2000,
      });
      return false;
    }
    if (!(/^1\d{10}$/.test(ads_phone))) {
      wx.showToast({
          title: '手机号格式不正确',
          icon: 'none',
          duration: 2000,
      });
      return false;
    }
    if (this.data.ads_id) {
      var url = 'Lease/Ads_Update';
    } else {
      var url = 'Lease/Add_ads';
    }
    let data = {
      users_id: this.data.usersId,
      ads_id: this.data.ads_id || "",
      ads_user: ads_user,
      ads_phone: ads_phone,
      ads_state: this.data.ischecked ? "2" : "1",
      ads_province: this.data.provinces,
      ads_city: this.data.city,
      ads_district: this.data.area,
      ads_address: ads_address
    };
    Util.post(url,data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          wx.navigateBack();
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