
const app = getApp()
const citys = require('../../../../utils/util.js');
Page({
  data: {
    sexList: [{ id: 0, val: "男" }, { id: 1, val: "女" }],
    sexIndex: 0,
    sextext: '',
    date: '',
    usersId: '',
    users_name: '',
    detailval: '',
    provinces: '',
    city: '',
    area: '',
  },
  onLoad() {
    let res = my.getStorageSync({ key: 'userinfos' });
    console.log(res.data)

    this.setData({
      usersId: res.data.userinfos.users_id
    })
    this.getdata()
  },
  getdata() {
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Lease/users_detail';
    let data = {
      users_id: this.data.usersId
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "users_detail")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        console.log(resdata)
        this.setData({
          users_name: resdata.users_name || '',
          users_id: resdata.users_id,
          date: resdata.users_birthday || '',
          detailval: resdata.users_address || "",
          provinces: resdata.users_province ,
          city:resdata.users_city,
          area: resdata.users_district,
        });
        let sex_id = resdata.users_sex;
        if (sex_id == 1) {
          this.setData({
            sextext: this.data.sexList[0].val
          })
        } else if (sex_id == 2) {
          this.setData({
            sextext: this.data.sexList[1].val
          })
        } else {
          this.setData({
            sextext: '未知'
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
      console.log('请求错误信息：' + err.errMsg);
      my.hideLoading();
    });
  },

  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let sex_id = "";
    if (this.data.sextext == "男") {
      sex_id = 1;
    } else {
      sex_id = 2;
    }

    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Lease/users_update';
    let data = {
      users_id: this.data.usersId,
      users_name: e.detail.value.nickname,
      users_sex: sex_id,
      users_birthday: this.data.date,
      users_province: this.data.provinces,
      users_city: this.data.city,
      users_district: this.data.area,
      users_address: e.detail.value.adddetail
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "Ads_Details")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        console.log(resdata)
        my.showToast({
          type: 'success',
          content: res.message,
          duration: 3000,
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
  sexchange(e) {
    this.setData({
      sexIndex: e.detail.value,
      sextext: this.data.sexList[e.detail.value].val
    });
    console.log(this.data.sextext)
    console.log(e.detail.value)
  },
  city() {
    my.multiLevelSelect({
      title: '选择省市区',//级联选择标题
      list: citys.citys,//引入的js
      success: (res) => {
        console.log(111111)
        console.log(res)
        this.setData({
          provinces: res.result[0].name,
          city: res.result[1].name,
          area: res.result[2].name,
        })
      }
    });
  },
  choosedate() {
    var time = new Date();
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();

    my.datePicker({
      format: 'yyyy-MM-dd',
      startDate: '1899/01/01',
      endDate: `${y}-${m}-${d}`,
      success: (res) => {
        this.setData({
          date: res.date
        })
        console.log(this.data.date, "----")
      },
    });

  }
});
