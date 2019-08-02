const app = getApp()
Page({
  data: {
    commentlist: []
  },
  onLoad(query) {
    console.log(query, "query")
    this.getComment(query.id)
  },

  getComment(id) {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Lease/GetComment';
    let data = {
      goods_id: id,
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "Scene_goods")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        this.setData({
          commentlist: resdata
        })
      } else {
        my.showToast({
          type: 'fail',
          content: res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
      my.hideLoading();
    });
  },
});
