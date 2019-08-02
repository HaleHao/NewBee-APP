const app = getApp();
Page({
  data: {
    topic_one:'',
    topic_two:'',
    topic_three:'',
    topic_four:'',
    topic_five:'',
    topic_six:'',
    topic_seven:'',
    topic_eight:'',
    topic_nine:'',
    topic_ten:'',
  },
  onLoad() {},

  onShow(){
    let userinfos = my.getStorageSync({ key: 'userinfos' });
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Generalize/getQuestionnaire';
    let data = {
      users_id:userinfos.data.userinfos.users_id,
    };
    app.appRequest('post', url, data, (res) => {
      my.hideLoading();
      console.log(res,'question')
      if (res.code == 200) {
        this.setData({
          info: res.data
        })
      } else {
        my.showToast({
          type: 'fail',
          content: res.message,
          duration: 3000,
        });
        setTimeout(function() {
        my.navigateBack({
            delta: 1
        })
      }, 1000)
      }
    }, (err) => {
      my.hideLoading();
    });
  },
onChangeOne(e){
  this.setData({
    topic_one:JSON.stringify(e.detail.value),
  })
},
onChangeTwo(e){
  this.setData({
    topic_two:e.detail.value,
  })
},
onChangeThree(e){
  this.setData({
    topic_three:JSON.stringify(e.detail.value),
  })
},
onChangeFour(e){
  this.setData({
    topic_four:JSON.stringify(e.detail.value),
  })
},
onChangeFive(e){
  this.setData({
    topic_five:e.detail.value,
  })
},
onChangeSix(e){
  this.setData({
    topic_six:JSON.stringify(e.detail.value),
  })
},
onChangeSeven(e){
  this.setData({
    topic_seven:e.detail.value,
  })
},
onChangeEight(e){
  this.setData({
    topic_eight:e.detail.value,
  })
},
onChangeNine(e){
  this.setData({
    topic_nine:e.detail.value,
  })
},
onChangeTen(e){
  this.setData({
    topic_ten:e.detail.value,
  })
},
submitSure(){
  let that = this;
  let userinfos = my.getStorageSync({ key: 'userinfos' });
  let users_id = userinfos.data.userinfos.users_id;
  if(that.data.topic_one=='' || that.data.topic_two=='' || that.data.topic_three=='' || that.data.topic_four=='' || that.data.topic_five=='' || that.data.topic_six=='' || that.data.topic_seven=='' || that.data.topic_eight=='' || that.data.topic_nine=='' || that.data.topic_ten==''){
    my.showToast({
      type: 'fail',
      content: '请选择选项或填写',
      duration: 3000,
    });
    return false;
  }
  let ctArr={
    topic_one:that.data.topic_one,
    topic_two:that.data.topic_two,
    topic_three:that.data.topic_three,
    topic_four:that.data.topic_four,
    topic_five:that.data.topic_five,
    topic_six:that.data.topic_six,
    topic_seven:that.data.topic_seven,
    topic_eight:that.data.topic_eight,
    topic_nine:that.data.topic_nine,
    topic_ten:that.data.topic_ten,
  };
  let answer = JSON.stringify(ctArr);
  my.showLoading({ content: '加载中...' });
  let url = app.url + 'api/Generalize/saveQuestionnaire';
  let data = {
    users_id:userinfos.data.userinfos.users_id,
    title:that.data.info.title,
    answer:answer,
  };
  app.appRequest('post', url, data, (res) => {
    my.hideLoading();
    console.log(res,'question')
    if (res.code == 200) {
      my.showToast({
        type: 'success',
        content: '请求成功',
        duration: 3000,
      });
      setTimeout(function() {
        my.navigateBack({
            delta: 1
        })
      }, 1000)
    } else {
      my.showToast({
        type: 'fail',
        content: '请求失败',
        duration: 3000,
      });
    }
  }, (err) => {
    my.hideLoading();
  });
},



});
