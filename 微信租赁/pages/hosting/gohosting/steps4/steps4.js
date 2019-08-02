
const app = getApp()
var Util = require('../../../../utils/http.js');
Page({
  data: {
    ischecked: true,
    isshow: false
  },
  onLoad(e) {
    console.log(e)
    this.setData({
      obg: JSON.parse(e.obj)
    })
  },

  show: function (title) {
    wx.showToast({
      title: title,
      icon: 'none',
      mask: true,
    })
  },

  onshow() {
    let obg = this.data.obg

    let src1 = this.data.src1
    let src2 = this.data.src2
    let src3 = this.data.src3
    let src4 = this.data.src4

    if (!src1 && !src2 && !src3 && !src4) {
      this.show("请上传产品相关图片")
      return
    }

    let res = wx.getStorageSync('userinfos');

    let data = {
      users_id: res.users_id,
      cate: obg.cate,
      brand: obg.brand,
      model: obg.model,
      standards: obg.colortext,
      num: 1,
      buy_time: obg.deta,
      exterior: obg.exterior,
      exterior_describe: obg.exterior_describe,
      functional_status: obg.statetext,
      functional_reason: obg.causetext,
      parts_list: obg.parts_list,
      parts_picture: src1,
      model_picture: src2,
      phone_picture: src3,
      damage_picture: src4,
      serial_number: obg.serialnumval,
      contact_way: obg.telval,
      rate: "30%",
    }
    console.log(obg)
    this.setData({
      obj: data,
      isshow: true,
    })
  },

  chooseImg1() {
    let that = this;
    wx.chooseImage({
      count: 1,
      success: (res) => {
        console.log(res)
        let src = res.tempFilePaths[0];
        app.imgRequest(src, (res) => {
          console.log(res, "getHeadPicture")
          that.setData({
            src1: res
          })
        }, (err) => {
          console.log('请求错误信息：' + err);
          wx.hideLoading();
        });
        that.setData({
          img1: src
        })
      },
    });
  },

  chooseImg2() {
    let that = this;
    wx.chooseImage({
      count: 1,
      success: (res) => {
        console.log(res)
        let src = res.tempFilePaths[0];
        app.imgRequest(src, (res) => {
          console.log(res, "getHeadPicture")
          that.setData({
            src2: res
          })
        }, (err) => {
          console.log('请求错误信息：' + err);
          wx.hideLoading();
        });
        that.setData({
          img2: src
        })
      },
    });
  },


  chooseImg3() {
    let that = this;
    wx.chooseImage({
      count: 1,
      success: (res) => {
        console.log(res)
        let src = res.tempFilePaths[0];
        app.imgRequest(src, (res) => {
          console.log(res, "getHeadPicture")
          that.setData({
            src3: res
          })
        }, (err) => {
          console.log('请求错误信息：' + err);
          wx.hideLoading();
        });
        that.setData({
          img3: src
        })
      },
    });
  },

  chooseImg4() {
    let that = this;
    wx.chooseImage({
      count: 1,
      success: (res) => {
        console.log(res)
        let src = res.tempFilePaths[0];
        app.imgRequest(src, (res) => {
          console.log(res, "getHeadPicture")
          that.setData({
            src4: res
          })
        }, (err) => {
          console.log('请求错误信息：' + err);
          wx.hideLoading();
        });
        that.setData({
          img4: src
        })
      },
    });
  },

  onclose() {
    this.setData({
      isshow: false
    })
  },

  onradio() {
    console.log(this.data.ischecked)
    this.setData({
      ischecked: !this.data.ischecked
    })
  },

  submit() {
    if (!this.data.ischecked) {
      wx.showToast({
        icon: 'fail',
        title: '请勾选同意托管合约',
        duration: 3000,
      });
      return
    }
    let data = this.data.obj
    Util.post('Trusteeship/saveTrust2', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          wx.navigateTo({
            url: '../successful/successful'
          });
        } else {
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 2000,
          });
        }
      })
  },

});
