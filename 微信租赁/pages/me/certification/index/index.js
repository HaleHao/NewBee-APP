const app = getApp()
var Util = require('../../../../utils/http.js');
Page({
  data: {
    realname: 0
  },

  onLoad() {
    this.getData()
  },

  getData() {
    let userId = wx.getStorageSync('userId');
    let data = {
      users_id: userId
    };
    Util.post('Lease/user_price', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            users_money: resdata.users_money,
            is_idcard: resdata.is_idcard,
            is_chsi: resdata.is_chsi
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'success',
            duration: 2000,
          });
        }
      })
  },

  onShareAppMessage() {
    return {
      title: '欢迎加入数码租赁',
      desc: '',
      path: 'pages/index/index'
    };
  },
});
