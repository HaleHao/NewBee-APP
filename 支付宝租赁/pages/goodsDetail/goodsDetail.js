const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    tel: '',
    images: [
      { adpic_img: 'https://newbeeadmin.zx-xcx.com/uploads/images/20190307/5a312907be02497b5e5323a6df408097.jpg' },
      { adpic_img: 'https://newbeeadmin.zx-xcx.com/uploads/images/20190312/ed8f706f81a96eeef66493c3954388a5.jpeg' }
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    isshow: false,
    iscartshow: false,
    isactivity: false,
    goods_id: '',
    detail: '',
    discountlist: [],
    usersId: ''
  },

  onLoad(query) {

    console.log(query, "huoqun")
    console.log(query, "huoqun")
    this.setData({
      goods_id: query.id
    })
    let res = my.getStorageSync({ key: 'userinfos' });
    if (res.data == null) {
      my.reLaunch({
        url: '/pages/login/login/login'
      });
    } else {
      this.setData({
        usersId: res.data.userinfos.users_id
      })
      this.getdetail(query.id);
      this.GetServiceTel();
    }
  },

  GetServiceTel(id) {
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Order/GetServiceTel';
    let data = {
    };
    app.appRequest('post', url, data, (res) => {
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        this.setData({
          tel: resdata
        })
      } else {
        my.showToast({
          type: 'fail',
          content: '请求失败',
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
      my.hideLoading();
    });
  },

  onShow() {
    console.log("onshow")
    // 页面显示
    // this.getdetail(this.data.goods_id);
    let VideoContext = my.createVideoContext("video")
  },


  bindplay() {
    this.videoContext.play()
    console.log('播放')
    this.setData({
      autoplay: false,
    })
  },

  bindPause() {
    this.videoContext.stop()
    console.log('暂停')
    this.setData({
      autoplay: true,
    })
  },

  bindEnded() {
    this.VideoContext.stop()
    this.setData({
      autoplay: true,
    })
  },

  onReady(res) {
    this.videoContext = my.createVideoContext('video')
  },

  getdetail(id) {
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Lease/Goods_Detail';
    let data = {
      goods_id: id
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "Goods_Detail")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        this.getActivity(resdata.goods_id)
        WxParse.wxParse("details", "html", resdata.gd_desc, this);
        this.setData({
          detail: resdata
        })
      } else {
        my.showToast({
          type: 'fail',
          content: '请求失败',
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
      my.hideLoading();
    });
  },

  getActivity(id) {
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Order/GetGoodsActivity';
    let data = {
      goods_id: id
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "GetGoodsActivity")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        console.log(resdata)
        if (resdata.length == 0) {
        } else {
          this.setData({
            discountlist: resdata,
          })
        }
      } else {
        my.showToast({
          type: 'fail',
          content: '请求失败',
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
      my.hideLoading();
    });
  },

  cell() {
    my.makePhoneCall({ number: this.data.tel });
  },

  onbuy() {
    this.setData({
      isshow: true,
    });
  },
  // 加入购物车 拉起弹窗
  addcart() {
    this.setData({
      iscartshow: true,
    });
  },

  onfriend() {
    this.setData({
      showfriend: true,
    });
  },

  onclose() {
    this.setData({
      isshow: false,
      iscartshow: false,
      isactivity: false,
      showfriend: false,
    });
  },

  showactivity() {
    this.setData({
      isactivity: true
    })
    // this.getActivity(this.data.goods_id);
  },

  buy() {
    my.navigateTo({
      url: '/pages/buy/buy?id=' + this.data.goods_id
    });
  },

  // 加入购物车
  addCart() {
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Lease/Add_cart';
    let data = {
      users_id: this.data.usersId,
      gd_id: this.data.goods_id,
      cart_price: this.data.detail.hire_price.price,
      cart_num: 1,
      attr_ids: "",
      attr_names: ""
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res)
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        my.showToast({
          type: 'success',
          content: '加入成功',
          duration: 3000,
        });
        this.setData({
          iscartshow: false,
        });
      } else {
        my.showToast({
          type: 'fail',
          content: '请求失败',
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
      my.hideLoading();
    });
  },

  onShareAppMessage(e) {
    console.log(e)
    let res = my.getStorageSync({ key: 'userinfos' });
    let users_id = res.data.userinfos.users_id;
    var detail = this.data.detail;
    if (e.target.id == 1) {
      return {
        path: "/pages/goodsDetail/goodsDetail?id=" + detail.goods_id + "&users_id=" + users_id,
        success: function (e) {
        },
        title: detail.goods_name,
        imageUrl: detail.gd_img[0],
      };
    }
    if (e.target.id == 2) {
      return {
        path: "/pages/friendBuyShare/friendBuyShare?id=" + detail.goods_id + "&users_id=" + users_id,
        success: function (e) {
        },
        title: detail.goods_name,
        imageUrl: detail.gd_img[0],
      };
    }
  },


});
