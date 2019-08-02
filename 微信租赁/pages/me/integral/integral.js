
const app = getApp()
var Util = require('../../../utils/http.js');
Page({
  data: {
    page:1,
    list:[],

  },
  onLoad() {
    this.integralscroe();
    this.integral();
  },
  integralscroe() {
    let userId = wx.getStorageSync('userId');
    let data = {
      users_id: userId
    };
    Util.post('Order/GetUserScore',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            info:resdata
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
  integral() {
    let userId = wx.getStorageSync('userId');
    let l=this.data.list;  let c= this.data.page
    let data = {
      users_id:userId,
      page:c,
    };
    Util.post('Order/GetUserScoreList',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
            l = l.concat(resdata);
             this.setData({
               list:l,
              page: c + 1,
            })
        } else {
          wx.showToast({
             title: '没有更多了',
             icon: 'none',
            duration: 2000,
          });
        }
      })
  },

 onReachBottom() {
    // 页面被拉到底部
    this.integral()
  },
});
