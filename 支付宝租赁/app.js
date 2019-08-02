App({
  url: 'https://admin.newbee-smart.com/',
  todos: [
    { text: 'Learning Javascript', completed: true },
    { text: 'Learning ES2016', completed: true },
    { text: 'Learning 支付宝小程序', completed: false },
  ],
  userInfo: null,

  appRequest(methods, url, data, callback, errFun) {
    my.request({
      url: url,
      method: methods,
      headers: {
      'content-type':'application/json'
      },
      dataType: 'json',
      data: data,
      success: function (res) {
        callback(res.data);
      },
      fail: function (res) {
        errFun(res);
      }
    })
  },

  imgRequest(url, callback, errFun) {
    my.uploadFile({
      url: "https://admin.newbee-smart.com/api/Trusteeship/uploads",
      filePath: url,
      fileName: 'file',
      fileType: 'image',
      success: (e) => {
        let resdata = e.data.replace(/\ufeff/g, "");
        let img = JSON.parse(resdata).data
        callback(img);
      },
      fail: function (res) {
        errFun(res);
      }
    });
  },
  // getUserInfo() {
  //   return new Promise((resolve, reject) => {
  //     if (this.userInfo) resolve(this.userInfo);
  //     my.getAuthCode({
  //       scopes: ['auth_user'],
  //       success: authcode => {
  //         console.log(authcode,"-----------");

  //         my.getAuthUserInfo({
  //           success: res => {
  //             this.userInfo = res;
  //             resolve(this.userInfo);
  //           },
  //           fail: () => {
  //             reject({});
  //           },
  //         });
  //       },
  //       fail: () => {
  //         reject({});
  //       },
  //     });
  //   });
  // },



});
