//index.js
//获取应用实例
const app = getApp()
var Util = require('../../utils/http.js');
Page({
  data: {
    imgUrls: [],
    navlist: [],
    activeTab: 0,
  },

  bindfirm(e) {
    wx.navigateTo({
      url: '/pages/home/search/search?name=' + e.detail.value,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },



  onLoad(e) {
    let that = this;
    if (!wx.getStorageSync('userId')) {
      this.setData({
        is_getuserinfo: false,
      })
      wx.reLaunch({
        url: '/pages/login/wxlogin/wxlogin',
      })
      return
    }
    this.loadData();
    this.getnav();
    this.goodsSelect();
    this.getLocation();
  },

  // 首页轮播图
  loadData() {
    Util.post('Lease/Rotation_chart')
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            imgUrls: resdata
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000,
          });
        }
      })
  },
  // 品类列表
  getnav() {
    Util.post('Lease/cate_select')
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          let navlist = [];
          let item;
          //  = {
          //   title: "热门"
          // };
          // navlist.push(item);
          for (let v of resdata) {
            item = {
              title: v.cate_name,
              cate_id: v.cate_id
            };
            navlist.push(item);
          }
          navlist.push(
            {

            }
          )


          this.setData({
            navlist: navlist
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',

            duration: 2000,
          });
        }
      })
  },

  // 首页货品图、附近门店
  goodsSelect() {
    Util.post('Lease/goods_select')
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            selectlist: resdata
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000,
          });
        }
      })
  },

  handleTabClick(
    e
  ) {
    console.log(e)
    let index = e.detail.currentIndex;
    this.setData({
      activeTab: index,
    });
    console.log(index, this.data.navlist)

    if (index <= 0) {
      return
    }
    let cate_id = this.data.navlist[index - 1].cate_id;
    let data = {
      cate_id: cate_id
    };
    Util.post('Lease/cate_goods', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            goodslist: resdata.goods,
            hostlist: resdata.remen,
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000,
          });
        }
      })
  },


  getLocation() {
    wx.getLocation({
      success: (res) => {
        this.getNearShop(res.longitude, res.latitude)
      },
      fail() {
        wx.showToast({
          title: "定位失败",
          icon: 'none',
          duration: 2000,
        });

      },
    })
  },

  getNearShop(lng, lat) {
    let data = {
      lat: lat,
      lng: lng
    };
    Util.post('Lease/Nearby_store', data)
      .then(res => {
        let resdata = res.data;
        if (res.code == 200) {
          this.setData({
            nearShop: resdata.store_name
          })

        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000,
          });
        }
      })
  },

})