
const app = getApp()
Page({
  data: {},

  onLoad(e) {

  },

  onShow(e) {
    console.log('1111')
    this.manmey()
  },

  onbank(e) {

    let id = e.currentTarget.dataset.id

    let text = e.currentTarget.dataset.text

    let code = e.currentTarget.dataset.code

    let info = {
      user_bank_id: e.currentTarget.dataset.id,
      open_bank: e.currentTarget.dataset.text,
      bank_code: e.currentTarget.dataset.code,
    }
     my.setStorageSync({
          key: 'info',
          data: {
            info: info
          }
        });
    my.navigateBack({
      delta: 1
    })
  },

  manmey(e) {
    let res = my.getStorageSync({ key: 'userinfos' });
    let type = this.data.type
    let url = app.url + 'api/Order/GetUserBank';
    let data = {
      users_id: res.data.userinfos.users_id
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "GetBalance")
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


});
