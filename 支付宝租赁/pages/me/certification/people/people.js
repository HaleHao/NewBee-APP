
const app = getApp()
Page({
  data: {},

  onLoad() { },

  onShow() {
    this.people()
    // 页面显示
  },


  editor(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id,
      phone = e.currentTarget.dataset.phone, sign = e.currentTarget.dataset.sign,
      name = e.currentTarget.dataset.name;
    let info = {
      id: id,
      phone: phone,
      name: name,
      sign: sign,
    }
    info = JSON.stringify(info)
    // 此处是one页面
    my.navigateTo({
      url: `../addPeople/addPeople?info=${info}`
    })
  },

  delel(e) {
    let urgent_id = e.currentTarget.dataset.id;
    my.confirm({
      title: '温馨提示',
      content: '确定要删除联系人吗?',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          let url = app.url + 'api/Lease/urgent_delete';
          let data = {
            urgent_id: urgent_id,
          };
          app.appRequest('post', url, data, (res) => {
            console.log(res, "urgent_delete")
            my.hideLoading();
            let resdata = res.data;
            if (res.code == 200) {
              my.showToast({
                type: 'success',
                content: res.message,
                duration: 2000,
                success: () => {
                  // 在three页面内 navigateBack，将返回one页面
                 this.people()
                },
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
        }
      },
    });
  }
  ,

  people(e) {
    console.log(e)
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let array = this.data.array;
    let index = this.data.index;
	
 let res = my.getStorageSync({ key: 'userinfos' });
	
    let url = app.url + 'api/Lease/urgent_select';
    let data = {
      users_id: res.data.userinfos.users_id, 
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "urgent_select")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {

        this.setData({
          list: resdata
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

});
