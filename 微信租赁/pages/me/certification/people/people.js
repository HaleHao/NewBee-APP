
const app = getApp()
var Util = require('../../../../utils/http.js');
Page({
  data: {},

  onLoad() { },

  onShow() {
    this.people()
    // 页面显示
  },

  editor(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id,
      phone = e.currentTarget.dataset.phone, sign = e.currentTarget.dataset.sign,
      name = e.currentTarget.dataset.name;
    let info = {
      id: id,
      phone: phone,
      name: name,
      sign: sign,
    }
    info = JSON.stringify(info)
    // 此处是one页面
    wx.navigateTo({
      url: `../addPeople/addPeople?info=${info}`
    })
  },
  delel(e) {
    let urgent_id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '温馨提示',
      content: '确定要删除联系人吗?',
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          let data = {
            urgent_id: urgent_id,
          };
       Util.post('Lease/urgent_delete',data)
        .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
              wx.showToast({
                title: res.message,
                icon: 'success',
                duration: 2000,
                success: () => {
                  // 在three页面内 navigateBack，将返回one页面
                 this.people()
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
    }
    },
    });
  },
  people(e) {
    console.log(e)
    let userId = wx.getStorageSync('userId');
    let data = {
        users_id:userId, 
     }
     Util.post('Lease/urgent_select',data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            list: resdata
          })
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
