const app = getApp()
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
    let res = my.getStorageSync({ key: 'userinfos' });
    console.log(res.data)
    this.setData({
      usersId: res.data.userinfos.users_id
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
    my.chooseImage({
      count: 3,
      success: (res) => {
        console.log(res)
        // 原有图片+新增图片
        let imgList = res.apFilePaths;
        this.setData({
          imgarr: imgarr.concat(imgList)
        })
        if (imgarr.length > 2) {
          this.setData({
            isshow: false
          })
        }
        for (let v of this.data.imgarr) {
          my.uploadFile({
            url: app.url + 'api/Lease/evaluate_upload',
            filePath: v,
            fileName: 'file',
            fileType: 'image',
            success: function(e) {
          console.log(e,'eee')
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
  onTextarea: function(e) {
    console.log(e.detail.value)
    this.setData({
      contentval: e.detail.value
    })
  },
  submit() {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
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
   
    let url = app.url + 'api/Lease/goods_evaluate';
    app.appRequest('post', url, data, (res) => {
      console.log(res, "goods_evaluate")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        my.navigateBack({
          delta: 1
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
  }
});
