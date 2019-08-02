const app = getApp()
Page({
  data: {
    list: [
      // { id: 1, name: '说明书', number: 1, numberber: 1, checked: false },
      // { id: 2, name: '耳机', number: 2, numberber: 2, checked: false },
    ],
    i: null
  },

  onLoad(e) {
    console.log(e)
    let obg = JSON.parse(e.obj)
    this.setData({
      obg: obg
    })
    if (obg.cate_id) {
      this.getqueryCate()
    }
  },

  // 品类
  getqueryCate() {
    my.showLoading({
      title: "加载中..",
      mask: true,
    });
    let url = app.url + 'api/Trusteeship/getPartlist';
    console.log(this.data.obg)

    let data = {
      cate_id: this.data.obg.cate_id,
      brand_id: this.data.obg.brand_id,
      model_id: this.data.obg.model_id,
    };

    app.appRequest('post', url, data, (res) => {
      console.log(res, "getHeadPicture")
      my.hideLoading();
      let resdata = res.data;
      if (res.code == 200) {

        let list = [];
        for (let i in resdata) {
          resdata[i].checked = false
          list.push(resdata[i])
        }
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
      console.log('请求错误信息：' + err);
      my.hideLoading();
    });
  },



  onchange(e) {
    let index = e.currentTarget.dataset.index
    let list = this.data.list
    // for (let i in list) {
    list[index].checked = !list[index].checked
    // }
    console.log(list)
    this.setData({
      list: list
    })
  },

  reduce(e) {
    let index = e.currentTarget.dataset.index;
    let resdata = this.data.list
    resdata[index].number--
    resdata[index].number <= 0 ? resdata[index].number = 1 : ''
    this.setData({
      list: resdata,
    })
  },

  plus(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index;
    let resdata = this.data.list
    resdata[index].number++
    this.setData({
      list: resdata,
    })
  },

  modifyValue() {
    this.setData({
      value: this.data.value + 1,
    });
  },

  next() {
    let list = this.data.list
    let arr = [];
    for (let i in list) {
      if (list[i].checked) {
        arr.push(list[i].name + 'x' + list[i].number)
      }
    }
    console.log(arr)
    let arrs = arr.join(',')
    let obj = {
      parts_list: arrs
    }
    let d = Object.assign(obj, this.data.obg);
    let obg = JSON.stringify(d)
    my.navigateTo({
      url: `../steps4/steps4?obj=${obg}`
    });
  }

});
