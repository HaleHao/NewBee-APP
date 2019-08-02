Page({
  data: {
    colourarr: ["全新", "95新", "9成新", "85新", "8成新", "7成新"],
    colourindex: -1,
    statearr: ["正常", "不正常（说明原因）"],
    stateindex: -1,
  },
  onLoad(e) {
    let res = wx.getStorageSync('userinfos');
    console.log(res)
    this.setData({
      phone: res.users_phone,
      obg: JSON.parse(e.obj)
    })
  },

  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  onConfirmColour(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      colourindex: e.detail.value,
    });
  },

  onConfirmState(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      stateindex: e.detail.value,
    });
  },



  show: function (title) {
    wx.showToast({
      title: title,
      icon: 'none',
      mask: true,
    })
  },



  submit(e) {

    console.log(e)

    let colourarr = this.data.colourarr;

    let statearr = this.data.statearr;

    let colourtext = colourarr[e.detail.value.colourtext];


    let statetext = statearr[e.detail.value.statetext]

    let causetext

    if (statetext == 1) {
      causetext = e.detail.value.causetext
    } else {
      causetext = ''
    }


    let priceval = e.detail.value.priceval;

    let colourlet = e.detail.value.colourlet

    if (!e.detail.value.deta) {
      this.show("请选择购买时间")
      return
    }

    if (!priceval) {
      this.show("请输入购买价格")
      return
    }

    if (!colourtext) {
      this.show("请选择外观成色")
      return
    }

    if (!colourlet) {
      this.show("请输入外观描述")
      return
    }

    if (!statetext) {
      this.show("请选择托管功能状况")
      return
    }

    if (!e.detail.value.serialnumval) {
      this.show("请输入产品序列号")
      return
    }


    if (!e.detail.value.telval) {
      this.show("请输入手机号码")
      return
    }


    let obj = {

      deta: e.detail.value.deta,

      priceval: priceval,

      exterior: colourtext,

      exterior_describe: colourlet,

      serialnumval: e.detail.value.serialnumval,

      statetext: statetext,

      telval: e.detail.value.telval,

      functional_reason: causetext
    }

    console.log(obj, this.data.obg)
    let d = Object.assign(obj, this.data.obg);
    console.log(d)

    let obg = JSON.stringify(d)
    wx.navigateTo({
      url: `../steps3/steps3?obj=${obg}`
    });
  }
});