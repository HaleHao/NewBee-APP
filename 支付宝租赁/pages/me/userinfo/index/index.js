
const app = getApp()
Page({
  data: {
    img: ''
  },
  onLoad() {
    this.getdata()
  },

  getdata() {
    let res = my.getStorageSync({ key: 'userinfos' });
    console.log(res.data)
    let url = app.url + 'api/Lease_Order/getHeadPicture';
    let data = {
      users_id: res.data.userinfos.users_id,
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "createCode")
      my.hideLoading();
      if (res.code == 200) {
        if (res.data == [] || res.data) {
          this.setData({
            headerimg: res.data
          })
        } else {
          headerimg: false
        }
      } else {
        my.showToast({
          type: 'fail',
          content: res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
    });
  },

  upload() {
    let that = this;
    let res = my.getStorageSync({ key: 'userinfos' });
    let users_id = res.data.userinfos.users_id
    my.chooseImage({
      count: 1,
      success: (res) => {
        console.log(res)
        let src = res.apFilePaths[0];
        my.uploadFile({
          url: "https://admin.newbee-smart.com/api/Lease_Order/modifyHeadPicture",
          filePath: src,
          fileName: 'file',
          fileType: 'image',
          formData: {
            users_id: users_id,
            file: src,
          },
          success: function (e) {
            console.log(e,'e')

            console.log('2222', e)
            let resdata = e.data.replace(/\ufeff/g, "");
            let data = JSON.parse(resdata)
console.log('2222', data)
            if (data.code == 200) {
              my.showToast({
                type: 'success',
                content: data.message,
                duration: 3000,
              });
            } else {
              my.showToast({
                type: 'fail',
                content: data.message,
                duration: 3000,
              });
            }
          }
        });
        that.setData({
          headerimg: src
        })
      },
    });
  }



});
