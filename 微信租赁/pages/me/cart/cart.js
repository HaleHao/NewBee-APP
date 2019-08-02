const app = getApp()
var Util = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sum:0
  },


  radioChange: function (e) {
    console.log('你选择的框架是：', e.detail.value)
    let index = e.detail.value
    let list = this.data.list
    this.setData({
      sum: list[index].hire_price.price,
      goods_id: list[index].goods_id
    })
  }, 

   onClose(event) {
    const { position, instance } = event.detail;
    console.log(event)
    let index = event.currentTarget.dataset.index;
    switch (position) {
      case 'cell':
        instance.close();
        break;
      case 'right':
        wx.showModal({
          title: '',
          content: '确定删除吗？',
          success:res=> {
          const { list } = this.data;
            instance.close();
            if (res.confirm) {
                this.getcart(index)
                list.splice(index, 1);
                this.setData({
                  list: [...list],
                });
            } else if (res.cancel) {
              // console.log('用户点击取消')
            }
          }
        })
        break;
    }
  },

  getcart(index) {
    let list = this.data.list;
    let cart_id = list[index].cart_id
    let data = {
      cart_id: cart_id
    };
    Util.post('Lease/cart_delete',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          wx.showToast({
            title: res.message,  
            icon: 'none',
            duration: 2000,
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
  
  // onSwipeStart(e) {
  //   console.log(e)
  //   this.setData({
  //     swipeIndex: e.index,
  //   });
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.cart()
  },

  cart(e) {
    let userId = wx.getStorageSync('userId');
    let data = {
      users_id: userId
    };
    Util.post('Lease/cart_select',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
            this.setData({
              list: resdata
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

   buy(){
    wx.navigateTo({
      url: '/pages/buy/buy?goods_id=' + this.data.goods_id
    });
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