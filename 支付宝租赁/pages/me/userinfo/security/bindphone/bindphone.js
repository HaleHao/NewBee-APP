const app = getApp()
Page({
  data: {
    phone:''
  },
  onLoad(option) {
    console.log(option)
    this.setData({
      phone: option.phone
    })
  },
});
