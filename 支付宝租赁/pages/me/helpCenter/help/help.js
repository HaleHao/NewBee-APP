const app = getApp()
Page({
  data: {
    list: []
  },
  onLoad(query) {
    console.log(query.id)
    this.getData(query.id)
  },

  getData(id) {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Lease/help_detail';
    let data = {
      help_id: id
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "store_select")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        console.log(resdata)
        this.setData({
          list: resdata
        })
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
  onclick(e) {
    console.log(e.currentTarget.dataset.i)
    let i = e.currentTarget.dataset.i
    this.data.list[i].isshow = !this.data.list[i].isshow
    this.setData({
      list: this.data.list
    })
  }
});
