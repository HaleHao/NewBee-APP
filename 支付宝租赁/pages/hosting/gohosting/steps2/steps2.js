Page({
  data: {
    colourarr: ["全新", "95新", "9成新", "85新", "8成新", "7成新"],
    colourindex: -1,
    statearr: ["正常", "不正常（说明原因）"],
    stateindex: -1,
  },
  onLoad(e) {
    let res = my.getStorageSync({ key: 'userinfos' });
    console.log(res)
    this.setData({
      phone: res.data.userinfos.users_phone,
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

    if (!priceval) {
      my.showToast({
        type: 'fail',
        content: '请输入价格',
        duration: 3000,
      });
      return
    }

    if (!colourlet) {
      my.showToast({
        type: 'fail',
        content: '请输入外观描述',
        duration: 3000,
      });
      return
    }

    if (!e.detail.value.telval) {
      my.showToast({
        type: 'fail',
        content: '请输入手机号码',
        duration: 3000,
      });
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
    my.navigateTo({
      url: `../steps3/steps3?obj=${obg}`
    });
  }
});
