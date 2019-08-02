const app = getApp()
var Util = require('../../../../utils/http.js');
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
    let data = {
      cate_id: this.data.obg.cate_id,
      brand_id: this.data.obg.brand_id,
      model_id: this.data.obg.model_id,
    };
    Util.post('Trusteeship/getPartlist', data)
      .then(res => {
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
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 2000,
          });
        }
      })
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

    wx.navigateTo({
      url: `../steps4/steps4?obj=${obg}`
    });
  }

});
