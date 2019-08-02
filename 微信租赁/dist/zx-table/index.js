Component({
  /**
   * 组件的属性列表
   */
  properties: {
    page_title: Object,
    lineStyle: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    currentTab: 0,
  },

  attached: function attached() { },
  ready: function () {
    this.loge()
  },
  /**
   * 组件的方法列表
   */
  methods: {

    loge() {
      let _this = this
      console.log('11')
      const query = wx.createSelectorQuery().in(this);
      query.select('#htt').boundingClientRect()
      let wd;
      query.exec(function (res) {
        console.log(res)
        wd = res[0].width
        console.log(wd)
        let WIDTH = wd * 0 + (wd / 2 - ((wd / 2) / 2));
        console.log(WIDTH)
        _this.setData({
          currentTab: 0,
          lineStyle: "width:" + wd / 2 + 'px' + ";background-color: #fff;background-image: linear-gradient(90deg,#6c76ed,#74d2ff); -webkit-transition-duration: 0.2s;transition-duration: 0.2s" + "-webki-transform: translateX(" + WIDTH + 'px' + ");" + "transform: translateX(" + WIDTH + 'px' + ");",
        })
      })
    },

    bindhome(e) {
      console.log(e)
      let _this = this;
      var currentIndex = e.currentTarget.dataset.index;
      let list = _this.properties.page_title;
      let id = list[currentIndex].id;
      const query = wx.createSelectorQuery().in(this);
      query.select('#htt').boundingClientRect()
      let wd;
      query.exec(function (res) {
        console.log(res[0].width)
        wd = res[0].width
        console.log(wd)
        let WIDTH = wd * currentIndex + (wd / 2 - ((wd / 2) / 2));
        console.log(WIDTH)
        _this.setData({
          currentTab: currentIndex,
          lineStyle: "width:" + wd / 2 + 'px' + ";background-color: #fff;background-image: linear-gradient(90deg,#6c76ed,#74d2ff); -webkit-transition-duration: 0.2s;transition-duration: 0.2s" + "-webki-transform: translateX(" + WIDTH + 'px' + ");" + "transform: translateX(" + WIDTH + 'px' + ");",
        })
      })
      this.triggerEvent('table', {
        currentIndex: currentIndex
      })
    }
  }

})