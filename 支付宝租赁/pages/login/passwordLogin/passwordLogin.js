Page({
  data: {
    isinput: false,
    phoneval: '',
    pwval: ''
  },
  onLoad() {},

  changeinput1(e){
    console.log(e.detail.value)
    this.setData({
      phoneval: e.detail.value
    })
    if(e.detail.value != '' && this.data.pwval!=''){
      this.setData({
        isinput: true
      })
    }else{
      this.setData({
        isinput: false
      })
    }
  },
  changeinput2(e){
    console.log(e.detail.value)
    this.setData({
      pwval: e.detail.value
    })
    if(e.detail.value != '' && this.data.phoneval!=''){
      this.setData({
        isinput: true
      })
    }else{
      this.setData({
        isinput: false
      })
    }
  }
});
