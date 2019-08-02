Page({
  data: {
    realname: 0
  },
  onLoad() {},

  onShareAppMessage() {
    return {
      title: '欢迎加入数码租赁',
      desc: '',
      path: 'pages/index/index'
    };
  },
});
