const app = getApp()
Page({
  data: {
    typenum: 0,
    iscode: false,
    ismodel: false
  },
  onLoad(q) {
    console.log(q)
    this.setData({
      type: q.type,
      trust_id: q.trust_id
    })
    this.getdata()
  },

  close() {
    this.setData({
      ismodel: false
    })
  },

  getdata(e) {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let data = {
      trust_id: this.data.trust_id
    }
    let url = app.url + 'api/Trusteeship/trustDetails';
    app.appRequest('post', url, data, (res) => {
      console.log(res, "trustDetails")
      my.hideLoading();
      if (res.code == 200) {
        let ismodel = '';
        if (res.data.trust_status == "审核通过") {
          ismodel = true
        }
        this.setData({
          detail: res.data,
          ismodel: ismodel
        })
      } else {
        my.showToast({
          type: 'fail',
          content: res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
      my.hideLoading();
    });
  },


  changetag(e) {
    this.setData({
      typenum: e.currentTarget.dataset.typenum
    })
  },
  onclose() {
    this.setData({
      iscode: false
    })
  },


  submit() {
    if (this.data.typenum == 0) {
      my.showLoading({
        title: "加载中..",
        mask: true,
      });
      let data = {
        trust_id: this.data.trust_id
      }
      let url = app.url + 'api/Trusteeship/fieldDelivery';
      app.appRequest('post', url, data, (res) => {
        console.log(res, "fieldDelivery")
        my.hideLoading();
        if (res.code == 200) {
          this.setData({
            codeimg: res.data,
            iscode: true
          })
        } else {
          my.showToast({
            type: 'fail',
            content: res.message,
            duration: 3000,
          });
        }
      }, (err) => {
        console.log('请求错误信息：' + err);
        my.hideLoading();
      });
    }
    if (this.data.typenum == 1) {
      my.navigateTo({
        url: `../postDeli/postDeli?trust_id=${this.data.trust_id}`
      });
    }
    if (this.data.typenum == 2) {
      my.navigateTo({
        url: `../platformDeli/platformDeli?trust_id=${this.data.trust_id}`
      });
    }
  }



});
