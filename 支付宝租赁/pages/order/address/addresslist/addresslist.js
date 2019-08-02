const app = getApp()
Page({
  data: {
    list: [],
    usersId: ''

  },
  onLoad(query) {
    let res = my.getStorageSync({ key: 'userinfos' });
    console.log(res.data)
    this.setData({
      usersId: res.data.userinfos.users_id
    })
    this.getlist();
  },
  onShow() {
    this.getlist();
  },
  getlist() {
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Lease/ads_select';
    let data = {
      users_id: this.data.usersId
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "ads_select")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        console.log(resdata)
        var list = [];
        let item = {};
        for (let v of resdata) {
          console.log(v.ads_user)
          item = {
            users_id: v.users_id,
            ads_id: v.ads_id,
            ads_user: v.ads_user,
            ads_phone: v.ads_phone,
            ads_state: v.ads_state,
            ads_province: v.ads_province,
            ads_city: v.ads_city,
            ads_district: v.ads_district,
            ads_address: v.ads_address,
            right: [{ type: 'delete', text: '删除' }]
          };
          list.push(item);
          console.log(item)
        }
        console.log(list, "listlistlist")
        this.setData({
          list: list
        })


      } else {
        my.showToast({
          type: 'fail',
          content: '请求失败',
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err.errMsg);
      my.hideLoading();
    });
  },


  //选择
  radioChange: function(e) {
    console.log('你选择的框架是：', e.detail.value)
    my.setStorageSync({
      key: 'adsSelect',
      data: {
        adsSelect: this.data.list[e.detail.value]
      }
    });

    my.navigateBack({
      delta: 1
    });

  },

  //删除
  onRightItemClick(e) {
    const { type } = e.detail;
    my.confirm({
      title: '温馨提示',
      content: "确定删除吗？",
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        const { list } = this.data;
        if (result.confirm) {
          if (type === 'delete') { }
          let url = app.url + 'api/Lease/ads_detele';
          let data = {
            ads_id: e.extra
          };
          app.appRequest('post', url, data, (res) => {
            console.log(res, "ads_select")
            my.hideLoading();
            let resdata = res.data;
            if (res.code == 200) {
              console.log(resdata)
              my.showToast({
                type: 'success',
                content: '删除成功',
                duration: 3000,
              });
              this.getlist();
            } else {
              my.showToast({
                type: 'fail',
                content: '请求失败',
                duration: 3000,
              });
            }
          }, (err) => {
            console.log('请求错误信息：' + err.errMsg);
            my.hideLoading();
          });
          e.done();
        } else {
          my.showToast({
            type: 'success',
            content: '取消删除',
            duration: 3000,
          });
        }
      },
    });
  },
  onSwipeStart(e) {
    this.setData({
      swipeIndex: e.index,
    });
  },
});
