// pages/hosting/myhosting/postDeli/postDeli.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typenum: 0,
    Datatime: ''
  },
  changetag(e) {
    this.setData({
      typenum: e.currentTarget.dataset.typenum
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      trust_id: e.trust_id
    })
    this.getSFTime()
  },

  getSFTime() {
    Util.post('Lease_Order/getSFTime')
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            array: res.data
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
  bindTimeChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let array = this.data.array;
    let time = array[e.detail.value][0]
    console.log(time)
    this.setData({
      index: e.detail.value,
      time: time
    })
  },
  bindTimeChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let array = this.data.array;
    let time = array[e.detail.value][0]
    console.log(time)
    this.setData({
      index: e.detail.value,
      time: time
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
    console.log(this.data.Datatime)
    let adsSelect = wx.getStorageSync('adsSelect');
    if (adsSelect) {
      this.setData({
        getaddress: adsSelect
      })
    }
  },
  numbers(e) {
    this.setData({
      numbers: e.detail.value
    })
  },

  submit(e) {
    let trust_id = this.data.trust_id, Datatime = this.data.Datatime, time = this.data.time, getaddress = this.data.getaddress, selfShop = this.data.selfShop
    let data = {
      trust_id: trust_id,
      year: Datatime,
      time: time,
      ads_id: getaddress.ads_id,
      store_id: selfShop.store_id,
    }
   Util.post('Trusteeship/onlineAppointment',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
         wx.showToast({
             title: res.message,
             icon: 'success',
            duration: 1000,
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

  submitdddd(e) {
    let trust_id = this.data.trust_id,
      numbers = this.data.numbers
    let data = {
      trust_id: trust_id,
      express_no: numbers,
    }
    Util.post('Trusteeship/surrender',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
         wx.showToast({
             title: res.message,
             icon: 'success',
            duration: 1000,
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