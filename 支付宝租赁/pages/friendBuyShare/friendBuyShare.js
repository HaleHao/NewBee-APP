Page({
  data: {
    typenum: 0,
    datetime: ""
  },

  onLoad(e) {
    this.setData({
      id: e.id,
      users_id: e.users_id
    })
  },

  changetag(e) {
    this.setData({
      typenum: e.currentTarget.dataset.typenum
    })
  },

  choosetime() {
    my.navigateTo({
      url: '/pages/order/calendar/calendar?time=true'
    });
  },
  bindremarkInput(e) {

    this.setData({
      value: e.detail.value
    })

  },
  onShareAppMessage(e) {
    console.log(e)
    let res = my.getStorageSync({ key: 'userinfos' });
    let friendid = res.data.userinfos.users_id;
    let friendBuy = this.data.id;
    let datetime = this.data.datetime;
    let value = this.data.value
    let typenum = this.data.typenum;
    return {
      path: "/pages/buy/buy?id=" + friendBuy + "&friendid=" + friendid + '&expectdate=' + datetime + '&value=' + value + '&type=' + typenum,
      success: function (e) {
      },
    };
  },

});
