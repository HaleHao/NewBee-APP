const app = getApp()
var Util = require('../../../utils/http.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
  topic_one:'',
    topic_two:'',
    topic_three:'',
    topic_four:'',
    topic_five:'',
    topic_six:'',
    topic_seven:'',
    topic_eight:'',
    topic_nine:'',
    topic_ten:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      this.loadData();
  },
  loadData(id) {
    let userId = wx.getStorageSync('userId');
    let data = {
      users_id:userId
    };
    Util.post('Generalize/getQuestionnaire', data)
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
            duration: 1000,
          });
       setTimeout(function() {
        wx.navigateBack({
            delta: 1
        })
      }, 2000)
        }
      })
  },


onChangeOne(e){
  this.setData({
    topic_one:JSON.stringify(e.detail.value),
  })
},
onChangeTwo(e){
  this.setData({
    topic_two:e.detail.value,
  })
},
onChangeThree(e){
  this.setData({
    topic_three:JSON.stringify(e.detail.value),
  })
},
onChangeFour(e){
  this.setData({
    topic_four:JSON.stringify(e.detail.value),
  })
},
onChangeFive(e){
  this.setData({
    topic_five:e.detail.value,
  })
},
onChangeSix(e){
  this.setData({
    topic_six:JSON.stringify(e.detail.value),
  })
},
onChangeSeven(e){
  this.setData({
    topic_seven:e.detail.value,
  })
},
onChangeEight(e){
  this.setData({
    topic_eight:e.detail.value,
  })
},
onChangeNine(e){
  this.setData({
    topic_nine:e.detail.value,
  })
},
onChangeTen(e){
  this.setData({
    topic_ten:e.detail.value,
  })
},

submitSure(){
  let that = this;
  let userId = wx.getStorageSync('userId');
  if(that.data.topic_one=='' || that.data.topic_two=='' || that.data.topic_three=='' || that.data.topic_four=='' || that.data.topic_five=='' || that.data.topic_six=='' || that.data.topic_seven=='' || that.data.topic_eight=='' || that.data.topic_nine=='' || that.data.topic_ten==''){
    wx.showToast({
	 title: '请选择选项或填写',
      icon: 'fail',
      duration: 3000,
    });
    return false;
  }
  let ctArr={
    topic_one:that.data.topic_one,
    topic_two:that.data.topic_two,
    topic_three:that.data.topic_three,
    topic_four:that.data.topic_four,
    topic_five:that.data.topic_five,
    topic_six:that.data.topic_six,
    topic_seven:that.data.topic_seven,
    topic_eight:that.data.topic_eight,
    topic_nine:that.data.topic_nine,
    topic_ten:that.data.topic_ten,
  };

  let answer = JSON.stringify(ctArr);
  let data = {
    users_id:userId,
    title:that.data.info.title,
    answer:answer,
  };
      Util.post('Generalize/saveQuestionnaire', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 1000,
          });
       setTimeout(function() {
        wx.navigateBack({
            delta: 1
        })
      }, 2000)
        } else {
          
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 1000,
          });
       setTimeout(function() {
        wx.navigateBack({
            delta: 1
        })
      }, 2000)
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