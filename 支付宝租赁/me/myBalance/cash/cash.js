const app = getApp()
Page({
  data: {
    allmoney: "",
    value: '',
    card: ''
  },

  onLoad() {

  },


  onShow(e) {


    let userid = my.getStorageSync({ key: 'userinfos' })

    let info = my.getStorageSync({ key: 'info' })

    console.log(userid)
    let type = this.data.type
    let url = app.url + 'api/Order/GetCash';
    let data = {
      users_id: userid.data
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "GetBalance")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        if (info.data) {
          this.setData({
            bank: info.data.info,
            allmoney: resdata.users_balance
          })
        } else {
          this.setData({
            bank: resdata.bank,
            allmoney: resdata.users_balance
          })
        }
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
  ,
  alls(e) {
    this.setData({
      value: this.data.allmoney
    })
  },

  all(e) {
    console.log('e',e)

    this.setData({
      value:e.detail.value
    })
  },



  next(e) {

    let userid = my.getStorageSync({ key: 'userinfos' })

    console.log(userid)

    let allmoney = this.data.value

    if (Number(allmoney) <= 0) {
      my.showToast({
        type: 'fail',
        content: '提现金额小于0',
        duration: 3000,
      });
      return
    }
    let type = this.data.type
    let url = app.url + 'api/Order/AddCash';
    let data = {
      users_id: userid.data,
      user_bank_id: this.data.bank.user_bank_id,
      money: Number(allmoney),
    };


    app.appRequest('post', url, data, (res) => {
      console.log(res, "GetBalance")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        my.showToast({
          type: 'success',
          content: res.message,
          duration: 3000,
        });
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

});
