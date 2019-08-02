
const app = getApp()
Page({
  data: {
    goods: []
  },
  onLoad(query) {
    console.log(query, "query");
    this.loadData(query.id)
   
  },

  loadData(id) {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Lease/Scene_goods';
    let data = {
      scene_id: id,
      page: 1
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res,"Scene_goods")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        this.setData({
          goods: resdata
        })
      } else {
        my.showToast({
          type: 'fail',
          content: '请求失败',
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err.errMsg);
      my.hideLoading();
    });
  },
});
