const app = getApp()
var Util = require('../../../utils/http.js');
var WxParse = require('../../../wxParse/wxParse.js');

Page({
  data: {},
  onLoad() {
    this.getAgreement()
  },

  getAgreement(){
    let data={
      title: "lease"
    }
    Util.post('Order/Agreement',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          WxParse.wxParse("details", "html", resdata, this);
        } else {
          wx.showToast({
             title: res.message,
             icon: 'none',
            duration: 2000,
          });
        }
      })
    },
});
