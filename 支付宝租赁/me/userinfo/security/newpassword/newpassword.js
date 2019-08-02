
const app = getApp()
Page({
  data: {},
  onLoad() { },

  formSubmit: function(e) {
    let res = my.getStorageSync({ key: 'userinfos' });
    console.log(res.data)

    this.setData({
      usersId: res.data.userinfos.users_id
    })
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let users_pwd = e.detail.value.oldpw;
    let new_pwd = e.detail.value.newpw;
    let userinfo = my.getStorageSync({ key: 'userinfos' });
    if (new_pwd == "" || users_pwd == '') {
      my.showToast({
        type: 'exception',
        content: '请填写验证码',
        duration: 3000,
      });
    }
    let url = app.url + 'api/Lease/update_pwd';
    let data = {
      users_pwd: users_pwd,
      new_pwd: new_pwd,
      users_id: JSON.stringify(userinfo.data.userinfos.users_id),
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res)
      if (res.code == 200) {
        my.hideLoading();
        my.showToast({
          type: 'success',
          content: '修改成功',
          duration: 3000,
        });
        my.navigateTo({
          url: '../../../me/me'
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
    });
  },
});
