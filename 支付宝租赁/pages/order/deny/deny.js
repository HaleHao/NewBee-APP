const app = getApp()
Page({
  data: {
    contentval: '',
    orderid: '',
    evapicture: '',
    denyimg: '',
  },
  onLoad(query) {
    console.log(query)
    this.setData({
      orderid: query.id
    })
  },
  onTextarea: function(e) {
    console.log(e.detail.value)
    this.setData({
      contentval: e.detail.value
    })
  },
  upload() {
    let that = this;
    my.chooseImage({
      count: 1,
      success: (res) => {
        console.log(res)
        let src = res.apFilePaths[0];
        my.uploadFile({
          url: app.url + 'api/Lease_Order/uploads',
          filePath: src,
          fileName: 'image',
          fileType: 'image',
          success: function(e) {
            let resdata = e.data.replace(/\ufeff/g, "");
            let img1 = JSON.parse(resdata).data
            console.log(img1, 'evapicture')
            that.setData({
              evapicture: img1
            })
          }
        });
        that.setData({
          denyimg: src
        })
      },
    });

  },
  submit() {
    if (this.data.contentval == "" || !this.data.evapicture) {
      my.showToast({
        type: 'exception',
        content: '还有未填写',
        duration: 3000,
      });
      return
    }
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Lease_Order/afterConfirmation2';
    var data = {
      order_id: this.data.orderid,
      content: this.data.contentval,
      image: this.data.evapicture
    };

    app.appRequest('post', url, data, (res) => {
      console.log(res, "goods_evaluate")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        my.alert({
          title: '操作成功',
          buttonText: '确定',
          success: () => {
            my.navigateBack({
              delta: 1
            })
          },
        });

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
