// pages/home/redpacket/redpacket/redpacket.js
const app = getApp()
var Util = require('../../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    enableMarquee:false,
    countUsers: 0,
    winninginfor: '',
    isad: false,
    AD_SHOW:true,
    marqueeProps: {
      loop: true
    },
    info:'',
  },

  onclose() {
    this.setData({
      isad: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRedpacket();//获取抢红包设置
    this.getUserNumber();//获取用户抽奖次数
  },

  adClose()
  {
    this.setData({
      AD_SHOW:false,
    })
  },

  toUrl(e)
  {
    console.log(e);
    let url = e.currentTarget.dataset.url;
    let id = url.split('/')[5]
    console.log(id)
      wx.navigateTo({
        url:'/pages/goodsDetail/goodsDetail?id='+id
      });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  getRedpacket: function () {
    let userId = wx.getStorageSync('userId');
    let data = {
      users_id:userId,
    };
    Util.post('Redpacket/getRedpacket', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
        this.setData({
          info: res.data
        })
        if (res.data.activity_title) {
          this.countUsers(res.data.activity_title);
          this.winningInformation(res.data.activity_title);
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

  getUserNumber: function () {
    let userId = wx.getStorageSync('userId');
    let data = {
      users_id:userId,
    };
    Util.post('Redpacket/getUserNumber', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
        this.setData({
          usernumber: res.data
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

 //参加的人数
  countUsers(activity_title) {
   let data = {
      activity_title: activity_title,
    };
    Util.post('Redpacket/countUsers', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
           this.setData({
            countUsers: res.data
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

 //获奖信息
  winningInformation(activity_title) {
   let data = {
      activity_title: activity_title,
    };
    Util.post('Redpacket/winningInformation', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
        let imgList = res.data;
        let winninginfor = '';
        let numbertype = '';
        for (let i in imgList) {
          if (imgList[i].prize == 3) {
            winninginfor = winninginfor + ' ' + '恭喜' + imgList[i].users_phone + '获得优惠券';
          }
          if (imgList[i].prize == 2) {
            winninginfor = winninginfor + ' ' + '恭喜' + imgList[i].users_phone + '获得' + imgList[i].prize_name + '积分';
          }
          if (imgList[i].prize == 1) {
            winninginfor = winninginfor + ' ' + '恭喜' + imgList[i].users_phone + '获得' + imgList[i].prize_name + '元';
          }
        }
        console.log(winninginfor);
        this.setData({
          winninginfor: winninginfor,
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

  //抢红包
  redwars() {
        let userId = wx.getStorageSync('userId');
    let data = {
      activity_title: this.data.info.activity_title,
      users_id: userId,
    };
    Util.post('Redpacket/countUsers', data)
      .then(res => {
         this.onshow();
        let resdata = res.data;
        if (res.code == 200) {
        if (res.type == 3) {
          numbertype = '优惠券';
        }
        if (res.type == 2) {
          numbertype = res.number + '积分';
        }
        if (res.type == 1) {
          numbertype = res.number + '元';
        }
        this.setData({
          isad: true,
          numbertype: numbertype,
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
   * 生命周期函数--监听页面显示
   */


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
      desc: '好友助力',
      path: '../rpfriend/rpfriend?id=',
    };
  }
})