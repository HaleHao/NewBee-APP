const app = getApp()
Page({
  data: {
    searchVal: '',
    goodslist: []
  },
  onLoad() { },
  handleInput(value) {
    this.setData({
      searchVal: value,
    });

    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Lease/search_goods';
    let data = {
      goods_name: this.data.searchVal
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "search_goods")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        console.log(resdata)
        this.setData({
          goodslist: resdata
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
  handleCancel() {
    this.setData({
      searchVal: '',
      goodslist: ''
    });
  },
  handleClear() {
    this.setData({
      searchVal: '',
      goodslist: ''
    });
  }
});
