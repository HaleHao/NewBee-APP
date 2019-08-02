const app = getApp()
Page({
  data: {
    list: [
      // { right: [{ type: 'delete', text: '删除' }], content: 'AAA' },
      // { right: [{ type: 'delete', text: '删除' }], content: 'BBB' },
      // { right: [{ type: 'delete', text: '删除' }], content: 'CCC' },
    ],
    addlist:[],
    usersId: '',
  },
  onLoad() {
   let res = my.getStorageSync({ key: 'userinfos' });
    console.log(res.data)
    this.setData({
      usersId: res.data.userinfos.users_id
    })
    this.getlist();
  },
  onShow() {
    // 页面显示
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
      console.log('请求错误信息：' + err.errMsg);
      my.hideLoading();
    });
  },
  onRightItemClick(e) {
    const { type } = e.detail;
    my.confirm({
      title: '温馨提示',
      content: `${e.index}-${e.extra}-${JSON.stringify(e.detail)}`,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        const { list } = this.data;
        if (result.confirm) {
          if (type === 'delete') {
            list.splice(this.data.swipeIndex, 1);
            this.setData({
              list: [...list],
            });
          }

          my.showToast({
            content: '确定 => 执行滑动删除还原',
          });
          e.done();
        } else {
          my.showToast({
            content: '取消 => 滑动删除状态保持不变',
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
