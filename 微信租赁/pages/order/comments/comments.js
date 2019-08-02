const app = getApp()
var Util = require('../../../utils/http.js');
Page({
  data: {
    rateval: 5 * 60,
    contentval: '',
    imgarr: [],
    isshow: true,
    evapicture: '',
    evapicture: [],
    contentval: '',
    usersId: "",
    orderid: '',
    goodid: '',
    buyid: ''
  },
  onLoad(query) {
    console.log(query)
    this.setData({
      orderid: query.orderid,
      goodid: query.goodid,
      buyid: query.buyid
    })
    let userId = wx.getStorageSync('userId');
    this.setData({
      usersId: userId
    })
  },

  changerate(e) {
    console.log(e.currentTarget.dataset.val)
    this.setData({
      rateval: e.currentTarget.dataset.val * 60
    })
  },

  upload() {
    let _this = this;
    var imgarr = this.data.imgarr ? this.data.imgarr : [];
    var evapicture = [];
    wx.chooseImage({
      count: 3,
      success: (res) => {
        console.log(res)
        // 原有图片+新增图片
        let imgList = res.tempFilePaths;
        this.setData({
          imgarr: imgarr.concat(imgList)
        })
        if (imgarr.length > 2) {
          this.setData({
            isshow: false
          })
        }
        for (let v of this.data.imgarr) {
          wx.uploadFile({
            url: 'https://admin.newbee-smart.com/api/Lease/evaluate_upload',
            filePath: v,
            name: 'file',
            success: function (e) {
              console.log(e, 'eee')
              let resdata = e.data.replace(/\ufeff/g, "");
              let contentimg = JSON.parse(resdata).data;
              evapicture.push(contentimg)
              console.log(evapicture, "---------------")
              _this.setData({
                evapicture: evapicture
              })
            }
          });
        }
      },
    });
  },
  onTextarea: function (e) {
    console.log(e.detail.value)
    this.setData({
      contentval: e.detail.value
    })
  },

  submit() {
    if (!this.data.buyid) {
      console.log(this.data.orderid, "orderid")
      var data = {
        users_id: this.data.usersId,
        goods_id: this.data.goodid,
        order_id: this.data.orderid,
        buyorder_id: '',
        eva_content: this.data.contentval,
        eva_picture: this.data.evapicture,
        eva_service: this.data.rateval
      };

    } else {
      console.log(this.data.buyid, "buyid")
      var data = {
        users_id: this.data.usersId,
        goods_id: this.data.goodid,
        buyorder_id: this.data.buyid,
        order_id: '',
        eva_content: this.data.contentval,
        eva_picture: this.data.evapicture,
        eva_service: this.data.rateval
      };
    }
    Util.post('Lease/goods_evaluate', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000,
          });
        }
      })
  }
});
