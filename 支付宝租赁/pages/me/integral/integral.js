
const app = getApp()

Page({
  data: {
    page:1,
    list:[]
  },
  onLoad() {

  this.integralscroe();
    this.integral();
  },


  integralscroe() {
 let res = my.getStorageSync({ key: 'userinfos' });
    let page= this.data.page
    let url = app.url + 'api/Order/GetUserScore';
    let data = {
      users_id: res.data.userinfos.users_id, 
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "GetUserScore")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
          this.setData({
            info:resdata
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

  integral() {
    let res = my.getStorageSync({ key: 'userinfos' });
    let c= this.data.page
    let url = app.url + 'api/Order/GetUserScoreList';
    let l=this.data.list;
    let data = {
      users_id: res.data.userinfos.users_id, 
      page:c
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "GetUserScoreList")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        l = l.concat(resdata);
         this.setData({
           list:l,
          page: c + 1,
        })
      } else {
        my.showToast({
          type: 'fail',
          content:'没有更多了',
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
      my.hideLoading();
    });
  },

 onReachBottom() {
    // 页面被拉到底部
    this.integral()
  },


});
