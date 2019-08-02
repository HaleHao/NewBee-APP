
var WxParse = require('../../../wxParse/wxParse.js');
var Util = require('../../../utils/http.js');
const app = getApp()
Page({
  data: {},
  onLoad() {
   let data = {
     title:"integral"
    };
    Util.post('Order/Agreement',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200&&resdata) {
             WxParse.wxParse("detail", "html", resdata, this);
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
