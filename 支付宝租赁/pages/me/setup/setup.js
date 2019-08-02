Page({
  data: {

  },
  onLoad() { },

  logout() {
    my.removeStorageSync({
      key: 'userinfos',
    });
    my.redirectTo({
      url: '/pages/login/login/login',
    });
  }
});
