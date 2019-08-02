const app = getApp()
Page({
  data: {
    navlist: [
      { title: '未使用' },
      { title: '已使用' },
      { title: '已失效' },
      { title: '领取' },
    ],
    activeTab: 0,
  },
  onLoad() {
    this.couponlist();
  },



  couponlist() {
    let type = this.data.activeTab
    let userid = my.getStorageSync({ key: 'userinfos' })
    console.log(userid)
    let page = this.data.page
    let url = app.url + 'api/Lease/user_coupons';
    let data = {
      user_id: userid.data,
      state: type + 1
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "Agreement")
      my.hideLoading();
      let resdata = res.data;
      let list = [];
      for (let i in resdata) {
        let info = {
          coupon_name: resdata[i].coupon_name,
          coupons_money: Number(resdata[i].coupons_money),
          end_time: resdata[i].coupons_money.split(" "),
          coupons_condition: resdata[i].coupons_condition,
        };
        list.push(info)
      }
      if (res.code == 200) {
        this.setData({
          list,
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

  handleTabClick({ index }) {
    this.setData({
      activeTab: index,
    });
    if (index == 3) {
      this.getcouponlist()
    }
    else {
      this.couponlist()
    }
  },


  getcouponlist() {
    let type = this.data.activeTab
    let userid = my.getStorageSync({ key: 'userinfos' })
    console.log(userid)
    let page = this.data.page
    let url = app.url + 'api/Lease/get_coupons';
    let data = {
      users_id: userid.data,
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "Agreement")
      my.hideLoading();
      let resdata = res.data;
      let getlist = [];
      for (let i in resdata) {
        let info = {
          coupon_name: resdata[i].coupon_name,
          coupons_money: Number(resdata[i].coupons_money),
          end_time: resdata[i].coupons_money.split(" "),
          coupons_condition: resdata[i].coupons_condition,
        };
        getlist.push(info)
      }
      if (res.code == 200) {
        this.setData({
          getlist,
        })
      } else {
        my.showToast({
          type: 'fail',
          content: res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
      my.hideLoading();
    });
  },

  getup(e) {
    let userid = my.getStorageSync({ key: 'userinfos' })
    let activity_id = e.currentTarget.dataset.activity_id;
    let coupons_id = e.currentTarget.dataset.coupons_id;

    console.log(userid)
    let page = this.data.page
    let url = app.url + 'api/Lease/Receive_coupon';
    let data = {
      user_id: userid.data,
      activity_id: activity_id,
      coupons_id: coupons_id,
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "Agreement")
      my.hideLoading();
      if (res.code == 200) {
        my.showToast({
          type: 'success',
          content: res.message,
          duration: 3000,
        });
      } else {
        my.showToast({
          type: 'fail',
          content: res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
      my.hideLoading();
    });

  },



});
