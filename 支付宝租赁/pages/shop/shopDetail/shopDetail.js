const app = getApp()
const WxParse = require('../../../wxParse/wxParse.js');
Page({
  data: {
    detail: '',
  },
  onLoad(query) {
    this.loadData(query.id);
  },

  loadData(id) {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Lease/store_detail';
    let data = {
      store_id: id,
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "Scene_goods")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        WxParse.wxParse('article', 'html', resdata.content || '', this, 5);
        this.setData({
          detail: resdata,
        })
        console.log(this.data.detail, "store_detail")
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
