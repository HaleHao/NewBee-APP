
const app = getApp()
Page({
  data: {
    navlist: [
      { title: '有硬件' },
      { title: '无硬件' },
    ],
    activeTab: 0,
    isshow: false,
    arrIndex: -1,
    BrandIndex: -1,
    ModelIndex: -1,

    listAtt: [
      {
        name: '全新品'
      },
      {
        name: '二手品'
      },
    ],
    attIndex: -1,
  },

  onLoad() {
    // 获取品类
    this.getqueryCate();
    this.hot();
  },


// 推荐

hot(){
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Trusteeship/queryRecommendProducts';
    let data = {

    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "getHeadPicture")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        this.setData({
          hotlist: resdata
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





  // 品类
  getqueryCate() {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Trusteeship/queryCate';
    let data = {

    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "getHeadPicture")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
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


  // 品牌
  getqueryBrand() {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Trusteeship/queryBrand';
    let cate_id = this.data.cate_id
    let data = {
      cate_id: cate_id
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "getHeadPicture")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        this.setData({
          listBrand: resdata
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

  // 机型
  getqueryModel() {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Trusteeship/queryModel';
    let cate_id = this.data.cate_id
    let brand_id = this.data.brand_id
    let data = {
      cate_id: cate_id,
      brand_id: brand_id,
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "queryModel")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        this.setData({
          listModel: resdata
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

  bindObjPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    let list = this.data.list
    this.setData({
      arrIndex: e.detail.value,
      cate_id: list[e.detail.value].cate_id,
      cate_name: list[e.detail.value].cate_name,
    });
    this.getqueryBrand()
  },

  bindBrandChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    let listBrand = this.data.listBrand
    let cate_id = this.data.cate_id

    this.setData({
      BrandIndex: e.detail.value,
      brand_id: listBrand[e.detail.value].brand_id
    });
    this.getqueryModel()
  },


  bindTip() {
    let cate_id = this.data.cate_id
    if (!cate_id) {
      my.showToast({
        type: 'fail',
        content: '请选择品类',
        duration: 3000,
      });
      return
    }
  },

  bindTipModel() {

    let cate_id = this.data.cate_id

    let brand_id = this.data.brand_id

    if (!cate_id) {
      my.showToast({
        type: 'fail',
        content: '请选择品类',
        duration: 3000,
      });
      return
    }
    if (!brand_id) {
      my.showToast({
        type: 'fail',
        content: '请选择品牌',
        duration: 3000,
      });
      return
    }
  },


  bindModelChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      ModelIndex: e.detail.value,
    });
  },

  bindChange(e) {
    let listAtt = this.data.listAtt;
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      attIndex: e.detail.value,
      Attname: listAtt[e.detail.value].name
    });
  },

  handleTabClick({ index }) {
    this.setData({
      activeTab: index,
    });
  },

  onshow() {
    this.setData({
      isshow: true,
    });
  },
  onclose() {
    this.setData({
      isshow: false,
    });
  },

  submit(e) {

    console.log(e)

    let list = this.data.list;
    let listBrand = this.data.listBrand;
    let listModel = this.data.listModel;

    let cate_name, brand_name, model_name, cate_id, brand_id, model_id;

    if (this.data.arrIndex < 0) {
      cate_name = ''
    } else {
      cate_name = list[e.detail.value.cate_name].cate_name

      cate_id = list[e.detail.value.cate_name].cate_id

    }

    console.log(this.data.BrandIndex)

    if (this.data.BrandIndex < 0) {
      brand_name = ''
    } else {
      brand_name = listBrand[e.detail.value.brand_name].brand_name
      brand_id = listBrand[e.detail.value.brand_name].brand_id
    }
    if (this.data.ModelIndex < 0) {
      model_name = ''
    } else {
      model_name = listModel[e.detail.value.model_name].model_name
      model_id = listModel[e.detail.value.model_name].model_id
    }

    let obj = {
      cate: cate_name,
      brand: brand_name,
      model: model_name,
      colortext: e.detail.value.colortext,
      num: 1,
      cate_id: cate_id,
      brand_id: brand_id,
      model_id: model_id,
    }
    let obg = JSON.stringify(obj)
    my.navigateTo({
      url: `../steps2/steps2?obj=${obg}`
    });
  },


  figureval(e) {
    this.setData({
      figureva: e.detail.value
    })
  },

  bindatt(e) {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });

    console.log(this.data.cate_name, this.data.img2)

    let res = my.getStorageSync({ key: 'userinfos' });

    let url = app.url + 'api/Trusteeship/saveNoHardware';


    let data = {
      users_id: res.data.userinfos.users_id,
      trust_price: this.data.figureva,
      cate: this.data.cate_name,
      style: this.data.attIndex,
      pay_way: 2,
    };

    app.appRequest('post', url, data, (res) => {
      console.log(res, "CheckIDCard")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        console.log(resdata)
        my.showToast({
          type: 'success',
          content: res.message,
          duration: 3000,
        });
      } else {
        my.showToast({
          type: 'fail',
          content:res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
      my.hideLoading();
    });

  },

  notsubmit(e) {
    let obj = {
      cate: e.detail.value.notypetext,
      brand: e.detail.value.nobrandtext,
      model: e.detail.value.nomodeltext,
      colortext: e.detail.value.colortext,
      num: 1,
    }
    let obg = JSON.stringify(obj)
    my.navigateTo({
      url: `../steps2/steps2?obj=${obg}`
    });
  },
});
