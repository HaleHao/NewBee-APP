// components/Nav/nav.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    active: {
      type: Number,
      value: -1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    icon: {
      index: '/assets/tab/index.png',
      indexs: '/assets/tab/indexs.png',
      shop: '/assets/tab/shop.png',
      shops: '/assets/tab/shops.png',
      order: '/assets/tab/order.png',
      orders: '/assets/tab/orders.png',
      my: '/assets/tab/my.png',
      mys: '/assets/tab/mys.png',
    },

    tabItems: [{
      text: '首页',
      url: '/pages/index/index'
    },
    {
      text: '通讯录',
      url: '/pages/mail/mail'
    },
    {
      text: '消息',
      url: '/pages/news/news'
    },
    {
      text: '我',
      url: '/pages/me/me/me'
    }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickTabBar(e) {
      // let index = e.currentTarget.dataset.index;
      let url = e.currentTarget.dataset.url;
      // this.setData({
      //   activessss: index
      // })
      wx.reLaunch({
        url: url,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    },
    onChange(event) {
      // console.log(event.detail);
      if (event.detail === 0) {
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
      if (event.detail === 1) {
        wx.reLaunch({
          url: '/pages/shop/shoplist/shoplist',
        })
      }
      if (event.detail === 2) {
        wx.reLaunch({
          url: '/pages/order/orderlist/orderlist',
        })
      }
      if (event.detail === 3) {
        wx.reLaunch({
          url: '/pages/me/me/me',
        })
      }
    }
  },

})