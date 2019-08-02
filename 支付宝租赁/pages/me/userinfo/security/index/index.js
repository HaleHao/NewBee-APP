const app = getApp()
Page({
  data: {
    phone:''
  },
  onLoad() {
    let res = my.getStorageSync({ key: 'userinfos' });
    console.log(res.data)
    this.setData({
      phone: res.data.userinfos.users_phone
    })
  },
});
