
const app = getApp()
Page({
  data: {},

  onLoad(e) {

  },

  onShow(e) {
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

    console.log(info)
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
    let userid = my.getStorageSync({ key: 'userinfos' })
    console.log(userid)
    let type = this.data.type
    let url = app.url + 'api/Order/GetUserBank';
    let data = {
      users_id: userid.data
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
