Page({
  data: {

  },
  onLoad() { },

  logout() {
    my.removeStorageSync({
      key: 'userinfos',
    });
    my.navigateTo({
      url: '/pages/login/login/login',
    });
  }
});
