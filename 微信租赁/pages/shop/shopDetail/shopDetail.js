const app = getApp()
const WxParse = require('../../../wxParse/wxParse.js');
var Util = require('../../../utils/http.js');

Page({
  data: {
    detail: '',
  },
  onLoad(query) {
    this.loadData(query.id);
  },

  loadData(id) {
    let data = {
   store_id: id,
    };
    Util.post('Lease/store_detail',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200&&resdata) {
           WxParse.wxParse('article', 'html', resdata.content || '', this, 5);
          this.setData({
            detail: resdata,
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
});
