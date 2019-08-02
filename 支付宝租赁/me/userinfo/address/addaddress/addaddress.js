const app = getApp()
const citys = require('../../../../../utils/util.js');
Page({
  data: {
    name:'',
    phone:'',
    ischecked: false,
    ads_id: '',
    provinces: '',
    city: '',
    area: '',
    detail:''
  },
  onLoad(query) {
    console.log(query)
    if (query.id) {
      this.setData({
        ads_id: query.id
      })
    }
   let res = my.getStorageSync({ key: 'userinfos' });
    console.log(res.data)
    this.setData({
      usersId: res.data.userinfos.users_id
    })
    this.getdetail();
  },
  getdetail() {
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Lease/Ads_Details';
    let data = {
      ads_id: this.data.ads_id
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "users_detail")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        console.log(resdata)
        this.setData({
          name : resdata.ads_user,
          phone : resdata.ads_phone,
          detail :resdata.ads_address,
          ischecked : resdata.ads_state == 2 ? true : false,
          provinces: resdata.ads_province,
          city: resdata.ads_city,
          area: resdata.ads_district,

        });

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

  city() {
    my.multiLevelSelect({
      title: '选择省市区',//级联选择标题
      list: citys.citys,//引入的js
      success: (res) => {
        console.log(res)
        this.setData({
          provinces: res.result[0].name,
          city: res.result[1].name,
          area: res.result[2].name,
        })
      }
    });
  },

  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let ads_user = e.detail.value.name;
    let ads_phone = e.detail.value.phone;
    let ads_address = e.detail.value.detail;
    if (ads_user == "" || ads_phone == "" || ads_address == "") {
      my.showToast({
        type: 'fail',
        content: '请填写完整',
        duration: 3000,
      });
      return false;
    }
    if (!(/^1\d{10}$/.test(ads_phone))) {
      my.showToast({
        type: 'fail',
        content: '手机号格式不正确',
        duration: 3000,
      });
      return false;
    }
    my.showLoading({ content: '加载中...' });

    console.log(this.data.ads_id,"this.data.ads_id")
    if (this.data.ads_id) {
      var url = app.url + 'api/Lease/Ads_Update';
    } else {
      var url = app.url + 'api/Lease/Add_ads';
    }

    let data = {
      users_id: this.data.usersId,
      ads_id: this.data.ads_id || "",
      ads_user: ads_user,
      ads_phone: ads_phone,
      ads_state: this.data.ischecked ? "2" : "1",
      ads_province: this.data.provinces,
      ads_city: this.data.city,
      ads_district: this.data.area,
      ads_address: ads_address
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "users_detail")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {

        my.navigateBack(-1)
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
  onradio() {
    console.log(this.data.ischecked)
    this.setData({
      ischecked: !this.data.ischecked
    })
  }
});
