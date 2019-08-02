// pages/hosting/gohosting/index/index.js
const app = getApp()
var Util = require('../../../../utils/http.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navlist: [{
      title: '有硬件'
    },
    {
      title: '无硬件'
    },
    ],
    activeTab: 0,
    isshow: false,
    arrIndex: -1,
    BrandIndex: -1,
    ModelIndex: -1,
    listAtt: [{
      name: '全新品'
    },
    {
      name: '二手品'
    },
    ],
    activeTab: 0,
    attIndex: -1,
  },

  onChange(event) {
    this.setData({
      activeTab: event.detail.index
    })
  },

  // onshow() {
  //   this.setData({
  //     isshow: true,
  //   });
  // },
  // onclose() {
  //   this.setData({
  //     isshow: false,
  //   });
  // },
  // submit(e) {
  //   wx.navigateTo({
  //     url: '../steps2/steps2'
  //   });
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取品类
    this.getqueryCate();
    this.hot();
  },
  // 推荐
  hot() {
    Util.post('Trusteeship/queryRecommendProducts')
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            hotlist: resdata
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 2000,
          });
        }
      })
  },
  // 品类
  getqueryCate() {
    Util.post('Trusteeship/queryCate')
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            list: resdata
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 2000,
          });
        }
      })
  },
  // 品牌
  getqueryBrand() {
    let cate_id = this.data.cate_id
    let data = {
      cate_id: cate_id
    }
    Util.post('Trusteeship/queryBrand', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            listBrand: resdata
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 2000,
          });
        }
      })
  },

  // 机型
  getqueryModel() {
    let cate_id = this.data.cate_id
    let brand_id = this.data.brand_id
    let data = {
      cate_id: cate_id,
      brand_id: brand_id,
    };
    Util.post('Trusteeship/queryModel', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            listModel: resdata
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 2000,
          });
        }
      })

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
      wx.showToast({
        icon: 'none',
        title: '请选择品类',
        duration: 3000,
      });
      return
    }
  },

  bindTipModel() {
    let cate_id = this.data.cate_id
    let brand_id = this.data.brand_id
    if (!cate_id) {
      wx.showToast({
        icon: 'none',
        title: '请选择品类',
        duration: 3000,
      });
      return
    }
    if (!brand_id) {
      wx.showToast({
        icon: 'none',
        title: '请选择品牌',
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

  bindChanges(e) {
    console.log('picker发送选择改变，携带值为', e);
    this.setData({
      activeTab: e.detail.index,
    });
  },


  bindChange(e) {
    let listAtt = this.data.listAtt;
    console.log('picker发送选择改变，携带值为', e);
    this.setData({
      attIndex: e.detail.value,
      Attname: listAtt[e.detail.value].name
    });
  },

  handleTabClick({
    index
  }) {
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
  show: function (title) {
    wx.showToast({
      title: title,
      icon: 'none',
      mask: true,
    })
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

    if (!cate_name) {
      this.show("请选择品类")
      return
    }

    if (!brand_name) {
      this.show("请选择品牌")
      return
    }

    if (!model_name) {
      this.show("请选择型号")
      return
    }

    if (!e.detail.value.colortext) {
      this.show("请选择颜色")
      return
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
    wx.navigateTo({
      url: `../steps2/steps2?obj=${obg}`
    });
  },

  figureval(e) {
    this.setData({
      figureva: e.detail.value
    })
  },

  // 机型
  bindatt() {


    if (!this.data.figureva) {
      this.show("请输入托管费用")
      return
    }

    if (!this.data.cate_name) {
      this.show("请选择托管品类")
      return
    }

    if (!this.data.attIndex) {
      this.show("请选择设备类型")
      return
    }


    let users_id = wx.getStorageSync('userId')
    let data = {
      users_id: users_id,
      trust_price: this.data.figureva,
      cate: this.data.cate_name,
      style: this.data.attIndex,
      pay_way: 1,
    };


    Util.post('Trusteeship/saveNoHardware', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 2000,
          });
        } else {
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 2000,
          });
        }
      })
  },





  notsubmit(e) {

    if (!e.detail.value.notypetext) {
      this.show("请输入托管品类")
      return
    }

    if (!e.detail.value.nobrandtext) {
      this.show("请输入托管品牌")
      return
    }

    if (!e.detail.value.nomodeltext) {
      this.show("请输入产品型号")
      return
    }

    if (!e.detail.value.colortext) {
      this.show("请输入产品颜色")
      return
    }

    let obj = {
      cate: e.detail.value.notypetext,
      brand: e.detail.value.nobrandtext,
      model: e.detail.value.nomodeltext,
      colortext: e.detail.value.colortext,
      num: 1,
    }

    let obg = JSON.stringify(obj)
    wx.navigateTo({
      url: `../steps2/steps2?obj=${obg}`
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})