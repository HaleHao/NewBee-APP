Page({
  data: {
    isinput: false,
    phoneval: '',
    codeval: ''
  },
  onLoad() {},

  changeinput1(e){
    console.log(e.detail.value)
    this.setData({
      phoneval: e.detail.value
    })
    if(e.detail.value != '' && this.data.codeval!=''){
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
      codeval: e.detail.value
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
  },

  next(){
    my.redirectTo({
      url: '../resetPassword/resetPassword', 
    });
  }
});
