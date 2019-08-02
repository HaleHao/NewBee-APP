const app = getApp()
const citys = require('../../utils/util.js');
Page({
  data: {
    images: [],
    navlist: [],
    activeTab: 0,
    currentTab: 0,
    selectlist: [],
    goodslist: [],
    hostlist: [],
    nearShop: ''
  },
  onLoad() {
    let res = my.getStorageSync({ key: 'userinfos' });
    console.log(res.data)
    if (res.data == null) {
      my.navigateTo({
        url: '/pages/login/login/login'
      });
    } else {
    this.loadData();
    this.getnav();
    this.goodsSelect();
    this.getLocation();
    }
  },
  
  // 首页轮播图
  loadData() {
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Lease/Rotation_chart';
    let data = {};
    app.appRequest('post', url, data, (res) => {
      console.log(res)
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        console.log(resdata)
        this.setData({
          images: resdata
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

  // 品类列表
  getnav() {
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Lease/cate_select';
    let data = {};
    app.appRequest('post', url, data, (res) => {
      console.log(res, "cate_select")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        //创建一个数组
        let navlist = [];
        // 第一个元素自定义为 “热门” 其他元素通过循环获取 
        let item = {
          title: "热门"
        };
        navlist.push(item);
        //  创建一个循环  循环次数 
        for (let v of resdata) {
          //在循环里边创建一个对象 把cate_name赋值给这个对象  
          item = {
            title: v.cate_name,
            cate_id: v.cate_id
          };
          //把这个对象放入数组
          navlist.push(item);
        }
        console.log(navlist, "navlist---");
        this.setData({
          navlist: navlist
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

  // 首页货品图、附近门店
  goodsSelect() {
    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Lease/goods_select';
    let data = {};
    app.appRequest('post', url, data, (res) => {
      console.log(res, "Lease/goods_select")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        this.setData({
          selectlist: resdata
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


  handleTabClick({ index }) {
    this.setData({
      activeTab: index,
    });
    console.log(this.data.navlist[index].cate_id, "--------")
    let cate_id = this.data.navlist[index].cate_id;

    my.showLoading({ content: '加载中...' });
    let url = app.url + 'api/Lease/cate_goods';
    let data = {
      cate_id: cate_id
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "Lease/cate_goods")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {
        console.log(resdata, "Lease/cate_goods")
        this.setData({
          goodslist: resdata.goods,
          hostlist: resdata.remen,
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

  getLocation() {
    let that = this;
    my.getLocation({
      success(res) {
        my.hideLoading();
        console.log(res, "getLocation")
        console.log("-------------------")
        // that.setData({
        //   longitude: res.longitude,
        //   latitude: res.latitude
        // })
        that.getNearShop(res.longitude, res.latitude)
      },
      fail() {
        my.hideLoading();
        my.alert({ title: '定位失败' });
      },
    })
  },

  getNearShop(lng, lat) {
    let url = app.url + 'api/Lease/Nearby_store';
    let data = {
      // lat: lat,
      // lng: lng
      lat: lat,
      lng: lng
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "Lease/Nearby_store")
      my.hideLoading();

      if (res.code == 200) {
        let resdata = res.data;
        this.setData({
          nearShop: resdata.store_name
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
  onShow() {
    // 页面显示
  },
  onReady() {
    // 页面加载完成
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
  },
  navbarTap(event) {
    console.log(event.currentTarget.dataset.index)
  },

});
