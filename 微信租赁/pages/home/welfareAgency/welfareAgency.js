// pages/home/welfareAgency/welfareAgency.js
const app = getApp()
var Util = require('../../../utils/http.js');


Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: true,
  },



  onconfirmdialog(e){
    console.log('onconfirmdialog',e)
    this.setData({
      modalOpened: false
    })
  },


  gotis() {
    wx.showModal({
      title: '',
      showCancel:false,
      content: '进入产品详情点击分享按钮，分享给好友即可领取奖励喔。',
    });
  },
  goredpacket() {
    wx.navigateTo({
      url: '../redpacket/redpacket/redpacket'
    });
  },
  go() {
    wx.navigateTo({
      url: '../questionnaire/questionnaire'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userId = wx.getStorageSync('userId');
    let data = {
      users_id:userId,
    };
    Util.post('Generalize/getCommission', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
          info: res.data
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let userId = wx.getStorageSync('userId');
    let data = {
      users_id:userId,
    };
    Util.post('Order/GetSigninData', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
        this.setData({
          infos: res.data
        })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 2000,
          });
        }
      })

    this.getdata();
    this.getTaskNoRead();
  },


  getdata() {
    let userId = wx.getStorageSync('userId');
    let data = {
      users_id:userId,
    };
    Util.post('Generalize/UserTaskNumber', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
        this.setData({
          info: res.data
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
  getTaskNoRead() {
    let userId = wx.getStorageSync('userId');
    let data = {
      users_id:userId,
    };
    Util.post('Generalize/getTaskNoRead', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
        if (res.data.length > 0) {
          let modalOpened;
          if (res.data[0].is_read == 0) {
            modalOpened = true
          } else {
            modalOpened = false
          }
          this.setData({
            modalOpened: modalOpened,
            model: res.data[0],
            read: res.data,
          })
        }
        } else {
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 2000,
          });
        }
      })
  },
  setTaskRead() {
    let userId = wx.getStorageSync('userId');
    let data = {
      users_id:userId,
    };
    Util.post('Generalize/setTaskRead', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
        this.setData({
          info: res.data
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

  signNow() {
    let timestamp = Date.parse(new Date());
    let timestr = timestamp / 1000;
    let userId = wx.getStorageSync('userId');
    let data = {
      users_id: userId,
      date_time: timestr,
    };
    Util.post('Order/UserSignin', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 3000,
            success: () => {
              this.onShow()
            },
          });

        } else {
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 2000,
          });
        }
      })
  }
,
gotis() {
     wx.showModal({
      title: '提示',
      content: '进入产品详情点击分享按钮，分享给好友即可领取奖励喔。',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  go() {
    wx.navigateTo({
      url: '../questionnaire/questionnaire'
    });
  },

  goredpacket() {
    wx.navigateTo({
      url: '../redpacket/redpacket/redpacket'
    });
  },

  onModalClick() {
    this.setData({
      modalOpened: false
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
    return {
      title: '数码租赁小程序',
      desc: '唤醒好友',
      path: 'pages/login/login/login?wakeup=',
    };
  }
})