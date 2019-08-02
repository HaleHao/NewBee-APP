
const app = getApp()
Page({
  data: {
    typenum: 0,
    name: '',
    phone: '',
    usersId: ''
  },
  onLoad() {
    let res = my.getStorageSync({ key: 'userinfos' });
    console.log(res.data)
    this.setData({
      usersId: res.data.userinfos.users_id,
      name: res.data.userinfos.users_name,
      phone: res.data.userinfos.users_phone || ''
    })
  },

  changetag(e) {
    this.setData({
      typenum: e.currentTarget.dataset.typenum
    })
  },
  onSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let name = e.detail.value.name;
    let phone = e.detail.value.phone;
    let people = {};
    if (name == "" || phone == "") {
      my.showToast({
        type: 'exception',
        content: '请填写完整',
        duration: 3000,
      });
      return;
    }
    if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
      my.showToast({
        type: 'exception',
        content: '手机号格式不正确',
        duration: 3000,
      });
      return;
    }
    if (this.data.typenum == 0) {
      if (name != this.data.name) {
        let url = app.url + 'api/Order/EditUserName';
        let data = {
          users_id: this.data.usersId,
          users_name: name
        };
        app.appRequest('post', url, data, (res) => {
          console.log(res, "EditUserName")
          if (res.code == 200) {
            let resdata = res.data;
            my.hideLoading();
            console.log(resdata, "EditUserName");
            my.setStorageSync({
              key: 'userinfos',
              data: {
                userinfos: resdata
              }
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
      }
      people.type = String(this.data.typenum);
      people.name = name;
      people.phone = phone;
    } else {
      people.type = String(this.data.typenum);
      people.name = name;
      people.phone = phone;
    }
    console.log(people)
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      people: people
    })
    my.navigateBack();
  }
});
