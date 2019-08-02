const app = getApp()
var Util = require('../../../../utils/http.js');
Page({
  data: {
    array: ["父母", "朋友", "兄弟", "姐妹"],
    index: -1,
    info: {
      sign: '请选择'
    },
    from: "addpeople"
  },

  onLoad(e) {
    console.log(e)
    if (e.info) {
      let info = JSON.parse(e.info)
      console.log(info, "info")
      this.setData({
        info: info,
        urgent_sign: info.sign,
        from: "deitpeople"
      })
    }
  },

  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    let array = this.data.array;
    this.setData({
      urgent_sign: array[e.detail.value],
      index: e.detail.value,
    });
  },

  deitpeople(e) {
    console.log(e)
    if (!/^[1]{1}[0-9]{10}/.test(e.detail.value.phone)) {
      wx.showToast({
        title: '手机号码错误',
        icon: 'none',
      })
      return;
    }
    let data = {
      urgent_id: this.data.info.id,
      urgent_phone: e.detail.value.phone,
      urgent_name: e.detail.value.name,
      urgent_sign: this.data.urgent_sign
    };
    Util.post('Lease/urgent_update',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
        wx.showToast({
          title: res.message,
          icon: 'success',
          duration: 2000,
          success: () => {
            wx.navigateBack({
              delta: 1
            })
          },
        });
        } else {
          wx.showToast({
             title: res.message,
             icon: 'success',
            duration: 2000,
          });
        }
      })
  },


addpeople(e) {
    console.log(e)
    let users_id = wx.getStorageSync('userId');
    if (!/^[1]{1}[0-9]{10}/.test(e.detail.value.phone)) {
      wx.showToast({
        title: '手机号码错误',
        icon: 'none',
      })
      return;
    }
    let data = {
      users_id: users_id,
      urgent_phone: e.detail.value.phone,
      urgent_name: e.detail.value.name,
      urgent_sign: this.data.urgent_sign
    }
      Util.post('Lease/Add_urgent',data)
            .then(res => {
              let resdata = res.data;
              if (res.code == 200) {
              wx.showToast({
                title: res.message,
                icon: 'success',
                duration: 2000,
                success: () => {
                  wx.navigateBack({
                    delta: 1
                  })
                },
              });
              } else {
                wx.showToast({
                   title: res.message,
                   icon: 'success',
                  duration: 2000,
                });
              }
            })

  },

});
