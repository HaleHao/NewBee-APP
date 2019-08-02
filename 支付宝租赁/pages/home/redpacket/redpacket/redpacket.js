const app = getApp();
Page({
  data: {
    enableMarquee:false,
    countUsers: 0,
    winninginfor: '',
    isad: false,
    AD_SHOW:true,
    marqueeProps: {
      loop: true
    },
    info:'',
  },
  onLoad() { },
  onShow() {
    this.getRedpacket();//获取抢红包设置
    this.getUserNumber();//获取用户抽奖次数
  },
  adClose()
  {
    this.setData({
      AD_SHOW:false,
    })
  },

  toUrl(e)
  {
    console.log(e);
    let url = e.currentTarget.dataset.url;
  
    let id = url.split('/')[5]
    console.log(id)
      my.navigateTo({
        url:'/pages/goodsDetail/goodsDetail?id='+id
      });
  },

  getRedpacket() {
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Redpacket/getRedpacket';
    let data = {};
    app.appRequest('post', url, data, (res) => {
      my.hideLoading();
      if (res.code == 200) {
        this.setData({
          info: res.data
        })
        if (res.data.activity_title) {
          this.countUsers(res.data.activity_title);
          this.winningInformation(res.data.activity_title);
        }
      } else {
        my.showToast({
          type: 'fail',
          content: res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      my.hideLoading();
    });
  },
  getUserNumber() {
    let userinfos = my.getStorageSync({ key: 'userinfos' });
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Redpacket/getUserNumber';
    let data = {
      users_id: userinfos.data.userinfos.users_id,
    };
    app.appRequest('post', url, data, (res) => {
      my.hideLoading();
      if (res.code == 200) {
        this.setData({
          usernumber: res.data
        })
      } else {
        my.showToast({
          type: 'fail',
          content: res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      my.hideLoading();
    });
  },
  //参加的人数
  countUsers(activity_title) {
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Redpacket/countUsers';
    let data = {
      activity_title: activity_title,
    };
    app.appRequest('post', url, data, (res) => {
      my.hideLoading();
      if (res.code == 200) {
        this.setData({
          countUsers: res.data
        })
      } else {
        my.showToast({
          type: 'fail',
          content: res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      my.hideLoading();
    });
  },

  //获奖信息
  winningInformation(activity_title) {
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Redpacket/winningInformation';
    let data = {
      activity_title: activity_title,
    };
    app.appRequest('post', url, data, (res) => {
      my.hideLoading();
      if (res.code == 200) {
        let imgList = res.data;
        let winninginfor = '';
        let numbertype = '';
        for (let i in imgList) {
          if (imgList[i].prize == 3) {
            winninginfor = winninginfor + ' ' + '恭喜' + imgList[i].users_phone + '获得优惠券';
          }
          if (imgList[i].prize == 2) {
            winninginfor = winninginfor + ' ' + '恭喜' + imgList[i].users_phone + '获得' + imgList[i].prize_name + '积分';
          }
          if (imgList[i].prize == 1) {
            winninginfor = winninginfor + ' ' + '恭喜' + imgList[i].users_phone + '获得' + imgList[i].prize_name + '元';
          }
        }
        console.log(winninginfor);
        this.setData({
          winninginfor: winninginfor,
        })
        // setTimeout(function (e) {
        //   this.setData({
        //     enableMarquee: true
        //   })
        // }, 1000)
      } else {
        my.showToast({
          type: 'fail',
          content: res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      my.hideLoading();
    });
  },

  //抢红包
  redwars() {
    let userinfos = my.getStorageSync({ key: 'userinfos' });
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Redpacket/countUsers';
    let data = {
      activity_title: this.data.info.activity_title,
      users_id: userinfos.data.userinfos.users_id,
    };
    app.appRequest('post', url, data, (res) => {
      my.hideLoading();
      this.onshow();
      if (res.code == 200) {
        if (res.type == 3) {
          numbertype = '优惠券';
        }
        if (res.type == 2) {
          numbertype = res.number + '积分';
        }
        if (res.type == 1) {
          numbertype = res.number + '元';
        }
        this.setData({
          isad: true,
          numbertype: numbertype,
        })
      } else {
        my.showToast({
          type: 'fail',
          content: res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      my.hideLoading();
    });
  },

  onShareAppMessage() {
    console.log(111);
    return {
      title: '数码租赁小程序',
      desc: '好友助力',
      path: '../rpfriend/rpfriend?id=',
    };
  },

  onclose() {
    this.setData({
      isad: false
    })
  }
});
