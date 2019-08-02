const app = getApp()
Page({
  data: {
    goods_id: '',
    typenum: '',
    ads_id: '',
    year: '',
    month: '',
    strDate: '',
    tagData: [],
    displayarr: [],
    displaydate: [],
    sendBack: '',
    orderid: '',
    appointmentExpress: '',
    shopping: '',
    refund: ''
  },
  onLoad(query) {
    console.log(query)
    this.setData({
      goods_id: query.id,
      typenum: query.typenum,
      ads_id: query.ads_id,
      sendBack: query.sendBack,
      orderid: query.orderid,
      appointmentExpress: query.appointmentExpress,
      refund: query.refund,
      shopping: query.shopping,
      time: query.time,
      postdeli: query.postdeli
    })
    this.today();
    if (query.id) {
      this.getdata()
    }
  },
  getdata() {
    let url = app.url + 'api/Order/displayDate';
    let newdate = new Date()
    let data = {
      type: this.data.typenum == 0 ? 3 : this.data.typenum == 1 ? 1 : 2,
      ads_id: this.data.ads_id,
      goods_id: this.data.goods_id,
      sku: "",
      month: `${newdate.getFullYear()}/${newdate.getMonth() + 1}/${newdate.getDate()}`
    };
    app.appRequest('post', url, data, (res) => {
      console.log(res, "GetUserCoupons")
      if (res.code == 200) {
        let resdata = res.data;
        my.hideLoading();
        console.log(resdata)
        this.setData({
          displayarr: resdata
        })
      } else {
        my.showToast({
          type: 'exception',
          content: res.message,
          duration: 3000,
        });
      }
    }, (err) => {
      console.log('请求错误信息：' + err);
    });
  },
  //今天的年月日
  today() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    console.log(strDate)
    this.setData({
      year: year,
      month: month,
      strDate: strDate
    })
  },
  handleSelect(e) {
    console.log(e[0])
    var d = new Date(e[0]);
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var td = d.getDate();
    var datetime = y + '/' + m + '/' + td + ' ';
    console.log(datetime)

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    if (this.data.time) {
      prevPage.setData({
        datetime: datetime
      })
      my.navigateBack();
      return
    }

    let year = this.data.year;
    let month = this.data.month;
    let strDate = this.data.strDate;

    let displaydate = [];

    console.log('测试库存1111', this.data.appointmentExpress)


    console.log(this.data.postdeli, datetime)

    if (this.data.postdeli == "true" || this.data.displayarr.length == strDate || this.data.shopping == "shopping" || this.data.sendBack == "sendBack" || this.data.refund == "refund" || this.data.appointmentExpress == "appointmentExpress") {
      //有库存 退租
      if (y === year || y > year) {
        if (m === month || m > month) {
          if (td >= strDate) {
            console.log('测试库存')
            if (this.data.sendBack == "sendBack") {
              // my.navigateTo({
              //   url: '/pages/order/sendBack/sendBack?expectdate=' + datetime + '&id=' + this.data.orderid
              // });
              prevPage.setData({
                expectdate: datetime,
                id: this.data.orderid,
              })
              my.navigateBack();
            } else if (this.data.shopping == "shopping") {
              // my.navigateTo({
              //   url: '/pages/order/shopping/shopping?expectdate=' + datetime + '&id=' + this.data.orderid
              // });
              prevPage.setData({
                expectdate: datetime,
                id: this.data.orderid,
              })
              my.navigateBack();
            }else if (this.data.appointmentExpress == "appointmentExpress") {
              prevPage.setData({
                expectdate: datetime,
                id: this.data.orderid,
              })
              my.navigateBack();
            }
            else if (this.data.refund == "refund") {
              prevPage.setData({
                expectdate: datetime,
                id: this.data.orderid,
                type: this.data.typenum,
              })
              my.navigateBack();
            }
            else if (this.data.postdeli == "true") {
              console.log(this.data.postdeli, datetime)
              prevPage.setData({
                Datatime: datetime,
              })
              my.navigateBack();

            } else {
              prevPage.setData({
                expectdate: datetime,
                id: this.data.goods_id,
                type: this.data.typenum,
              })
              my.navigateBack();
            }
          }  else {
            console.log("选择的日期不符合")
            my.showToast({
              type: 'exception',
              content: `请选择${strDate}号之后的日期`,
              duration: 3000,
            });
          }
        }
      }
    } else {
      //库存不足
      for (let v of this.data.displayarr) {
        console.log(item)
        let item = v.split('/')
        for (let i = 0; i < item.length; i++) {
          if (item[2] > this.data.strDate) {
            var display = item[0] + '/' + item[1] + '/' + item[2];
          }
        }
        console.log(display)
        if (display != undefined) {
          displaydate.push(display)
          console.log(displaydate, "displaydate")
          this.setData({
            displaydate: displaydate
          })
        }
      }
      if (this.data.displaydate != undefined) {
        if (td < strDate) {
          my.showToast({
            type: 'exception',
            content: `请选择${strDate}号之后的日期`,
            duration: 3000,
          });
          return
        }
        my.confirm({
          title: '提示',
          content: '请选择其他时间起租，或选择预租下单',
          confirmButtonText: '预租下单',
          cancelButtonText: '取消',
          success: (result) => {
            if (result.confirm == true) {
              my.removeStorageSync({ //租期  
                key: 'weeki',
              });
              my.removeStorageSync({ //天数
                key: 'weekval',
              });
              prevPage.setData({
                expectdate: datetime,
                id: this.data.goods_id,
                type: this.data.typenum,
                ordertype: 'order_type',
              })
              my.navigateBack();
              // my.navigateTo({
              //   url: '/pages/buy/buy?expectdate=' + datetime + '&id=' + this.data.goods_id + '&type=' + this.data.typenum + '&ordertype=order_type'
              // });
            }
          },
        });
      }

    }


  },
});
