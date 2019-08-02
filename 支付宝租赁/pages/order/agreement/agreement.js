const app = getApp()
Page({
  data: {},
  onLoad() {
    this.getAgreement()
  },

  getAgreement(){
    let url = app.url + 'api/Order/Agreement';
    let data = {
     
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res)
      if (res.code == 200) {
        my.hideLoading();
       
       
      } else {
        my.showToast({
          type: 'fail',
          content: '请求失败',
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
    });
  }
});
