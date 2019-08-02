var Util = require('../../../../utils/http.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banklist: [],
    index: '',
    isShow: false,
    second: 60,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getdata()
  },

  getdata(){
    let userId = wx.getStorageSync('userId');
    Util.post('Order/GetBank')
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            banklist: resdata
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
  phones(e) {
    this.setData({
      phone: e.detail.value
    })
  },
    // 发送验证码
  getCode() {
    if (!this.data.phone) {
      wx.showToast({
        title: '手机号为空',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    if (!/^[1]{1}[0-9]{10}/.test(this.data.phone)) {
      wx.showToast({
        title: '手机号错误',
        icon: 'none',
        duration: 2000,
        success: () => {
        },
      });
      return;
    }
    let that = this;
    let data = {
      users_phone:that.data.phone
    }
    Util.post('Lease/Forget_PassWord',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
            this.code()
        } else {
          wx.showToast({
             title: res.message,
             icon: 'none',
            duration: 2000,
          });
        }
      })
  },
    // 倒计时
  code() {
    let that = this, second = 60;
    that.setData({
      isShow: true //按钮1隐藏，按钮2显示
    })
   let time = setInterval(function () {
      if (second <= 1) {
        clearInterval(time);
        that.setData({
          isShow: false,
          second: 60
        })
        return false
      }
      second--;
      that.setData({
        second: second
      })
    }, 1000)
  },

  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      index: e.detail.value,
    });
  },


  onsubmit(e) {
  
    function showToast(title){
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 2000,
      });
   
    }

    if (!e.detail.value.phone) {
        showToast('手机号为空')
          return;
    }
    if (!/^[1]{1}[0-9]{10}/.test(e.detail.value.phone)) {
       showToast('手机号错误')
         return;
    }
    if (!e.detail.value.name) {
        showToast('名字为空')
          return;
    }
    if (!e.detail.value.cardnum) {
      showToast('卡号为空')
        return;
    }

    if (!e.detail.value.idcard) {
        showToast('身份证为空')
          return;
    }

    if (!e.detail.value.code) {
        showToast('验证码为空')
          return;
    }

    let banklist = this.data.banklist;
    let index = this.data.index;
    let userId = wx.getStorageSync('userId');
    let data = {
      users_id:userId,
      open_bank: banklist[index].bank_name,
      bank_code: e.detail.value.cardnum,
      realname: e.detail.value.name,
      IDcrad: e.detail.value.idcard,
      phone: e.detail.value.phone,
      yzm: e.detail.value.code,
    };
    Util.post('Order/AddUserBank',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          wx.showToast({
           title: res.message,
          icon: 'success',
          duration: 3000,
          success: () => {
            wx.navigateBack({
              delta: 1
            })
          }
        });
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