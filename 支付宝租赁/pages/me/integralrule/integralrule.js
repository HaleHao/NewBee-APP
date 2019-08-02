
var WxParse = require('../../../wxParse/wxParse.js');
const app = getApp()
Page({
  data: {},

  onLoad() {

    let page= this.data.page
    let url = app.url + 'api/Order/Agreement';
    let data = {
     title:"integral"
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "Agreement")

      my.hideLoading();
      
      let resdata = res.data;
      WxParse.wxParse("detail", "html", resdata, this);
      if (res.code == 200) {

      } else {
        my.showToast({
          type: 'fail',
          content: '请求失败',
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
      my.hideLoading();
    });

  },
});
