const app = getApp()
Page({
  data: {
    tel: '10086',
    helplist:[]
  },
  onLoad() {
    this.getData();
    this.gettel()
  },
  getData() {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Lease/help';
    let data = {};
    app.appRequest('post', url, data, (res) => {
      console.log(res, "store_select")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        this.setData({
          helplist: resdata
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

  gettel(){
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Order/GetServiceTel';
    let data = {};
    app.appRequest('post', url, data, (res) => {
      console.log(res, "store_select")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        this.setData({
          tel: resdata
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
  cell() {
    my.makePhoneCall({ number: this.data.tel });
  }
});
