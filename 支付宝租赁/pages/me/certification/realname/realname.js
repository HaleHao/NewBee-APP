const app = getApp()
Page({
  data: {},
  onLoad() {

  },

  card1(e) {
    let that=this;
    my.chooseImage({
      count: 1,
      success: (res) => {
        console.log(res)
        let src = res.apFilePaths[0];
        my.uploadFile({
          url: "https://admin.newbee-smart.com/api/Alipay/uploads",
          filePath: src,
          fileName: 'file',
          fileType: 'image',
          success: function (e) {
        console.log('111', e)
         let resdata = e.data.replace(/\ufeff/g, "");
            let img1 = JSON.parse(resdata).data
        console.log('111', img1)
            that.setData({
              img11: img1
            })
          }
        });
        that.setData({
          src1: src
        })
      },
    });
  },
  card2(e) {
        let that=this;
    my.chooseImage({
      count: 1,
      success: (res) => {
        let src = res.apFilePaths[0];
        my.uploadFile({
          url: "https://admin.newbee-smart.com/api/Alipay/uploads",
          filePath: src,
          fileName: 'file',
          fileType: 'image',
          success: (e) => {
            console.log('2222', e)
            let resdata = e.data.replace(/\ufeff/g, "");
            let img2 = JSON.parse(resdata).data
            console.log(img2)
            that.setData({
              img2: img2
            })
          }
        });
        that.setData({
          src2: src
        })
      },
    });
  },


  next(e) {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });

    console.log(this.data.img11,this.data.img2,)

 let res = my.getStorageSync({ key: 'userinfos' });
	
    let url = app.url + 'api/Alipay/CheckIDCard';
    let data = {
      users_id: res.data.userinfos.users_id,
      file:this.data.img11,
      file1: this.data.img2,
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "CheckIDCard")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        console.log(resdata)
        this.setData({
          shoplist: resdata
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
