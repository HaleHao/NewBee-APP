
const app = getApp()
Page({
  data: {
    sum: 0,
    list: [
      // {
      //   right: [
      //     { type: 'delete', text: '删除' }
      //   ],
      //   content: 'AAA'
      // },

      // { right: [{ type: 'delete', text: '删除' }], content: 'BBB' },
      // { right: [{ type: 'delete', text: '删除' }], content: 'CCC' },
    ]
  },
  onLoad() {
    this.cart()
  },

  cart(e) {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });

    let res = my.getStorageSync({ key: 'userinfos' });

    let url = app.url + 'api/Lease/cart_select';
    let data = {
      users_id: res.data.userinfos.users_id
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "getHeadPicture")
      my.hideLoading();

      let resdata = res.data;

      if (res.code == 200) {

        let right = [
          { type: 'delete', text: '删除' },
        ]
        let arr = [];
        for (let i in resdata) {
          resdata[i].right = right
        }
        console.log(resdata);

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
  radioChange: function (e) {
    console.log('你选择的框架是：', e.detail.value)
    let index = e.detail.value
    let list = this.data.list

    this.setData({
      sum: list[index].hire_price.price,

      goods_id: list[index].goods_id

    })



  },

  onRightItemClick(e) {
    console.log('001', e)
    const { type } = e.detail;
    my.confirm({
      title: '温馨提示',
      content: `你确定要删除商品吗？`,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        const { list } = this.data;
        if (result.confirm) {

          if (type === 'delete') {
            this.getcart()
            list.splice(this.data.swipeIndex, 1);
            this.setData({
              list: [...list],
            });
          }
          
          e.done();

        } else {
          // my.showToast({
          //   content: '取消 => 滑动删除状态保持不变',
          // });
        }
      },
    });
  },

  getcart(e) {
    let list = this.data.list;
    let url = app.url + 'api/Lease/cart_delete';
    let cart_id = list[this.data.swipeIndex].cart_id
    let data = {
      cart_id: cart_id
    };
    app.appRequest('post', url, data, (res) => {
      my.hideLoading();
      if (res.code == 200) {
        my.showToast({
          content: res.message,
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


  buy() {
    my.navigateTo({
      url: '/pages/buy/buy?id=' + this.data.goods_id
    });
  },

  onSwipeStart(e) {
    console.log(e)
    this.setData({
      swipeIndex: e.index,
    });
  },
});
