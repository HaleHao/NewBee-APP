const app = getApp()
Page({
  data: {
    searchVal: '',
    shoplist: []
  },
  onLoad() {
    this.getData();
  },
  getData() {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Lease/store_select';
    let data = {};
    app.appRequest('post', url, data, (res) => {
      console.log(res, "store_select")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        console.log(resdata)
        this.setData({
          shoplist: resdata
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
  handleInput(value) {
    this.setData({
      searchVal: value,
    });
    console.log(this.data.searchVal, "searchVal")
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Trusteeship/searchStore';
    let data = {
      keyword: this.data.searchVal
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "Trusteeship/searchStore")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        console.log(resdata)
        this.setData({
          shoplist: resdata
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
    });
    this.getData();
  },

  handleClear() {
    this.setData({
      searchVal: '',
    });
    this.getData();
  },


  onlookmap(e) {
    let map = e.currentTarget.dataset.map;
    let text = e.currentTarget.dataset.text;
    let address = e.currentTarget.dataset.address;
    let coordinate = map.split(',');
    my.openLocation
      ({
        scale: 16,
        longitude: coordinate[0],
        latitude: coordinate[1],
        name: text,
        address: address,
      });
  }
});
