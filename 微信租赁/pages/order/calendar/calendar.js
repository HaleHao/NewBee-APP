const app = getApp()
var Util = require('../../../utils/http.js');

Page({
  data: {
    goods_id: '',
    typenum: '',
    ads_id: '',
    year: '',
    month: '',
    strDate: '',
    displayarr: [],
    displaydate: [],
    sendBack: '',
    orderid: '',
    appointmentExpress: '',
    shopping: '',
    refund: '',
    currentDa: '',
    currentDate: "",
    dayList: "",
    currentDayList: "",
    currentObj: "",
    currentDay: "",
    selectCSS: "bk-color-day",
    weeks: [{
      day: "日"
    }, {
      day: "一"
    }, {
      day: "二"
    }, {
      day: "三"
    }, {
      day: "四"
    }, {
      day: "五"
    }, {
      day: "六"
    }],

    hasEmptyGrid: false,
    cur_year: '',
    cur_month: '',
  },

  onLoad(query) {
    var e = this.getCurrentDayString();
    console.log(e)
    this.setData({
        currentDate: e.getFullYear() + "年" + (e.getMonth() + 1) + "月",
        today: e.getFullYear() + "/" + (e.getMonth() + 1) + "/" + e.getDate(),
        yearmonth: e.getFullYear() + "/" + (e.getMonth() + 1) + "/",
        today_time: e.getFullYear() + "" + (e.getMonth() + 1) + e.getDate(),
        currentDay: e.getDate(),
        currentObj: e,
        currentYear: e.getFullYear(),
        currentMonth: e.getMonth() + 1
      }),
      this.setSchedule(e);
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
    let today = e.getFullYear() + "/" + (e.getMonth() + 1) + "/" + e.getDate()
    if (query.id) {
      this.getdata(today)
    }
  },
  // 获取日期
  getCurrentDayString: function() {
    console.log('000')
    var t = this.data.currentObj;
    if ("" != t) return t;
    var e = new Date(),
      a = e.getFullYear() + "/" + (e.getMonth() + 1) + "/" + e.getDate();
    return new Date(a);
  },

  setSchedule: function(t) {
    var e = new Date(),
      getFullYear = e.getFullYear(),
      getMonth = (e.getMonth() + 1),
      getDate = (e.getDate());

    for (var e = t.getMonth() + 1, a = t.getFullYear(), r = t.getDate(), n = (t.getDate(),
        new Date(a, e, 0).getDate()), i = t.getUTCDay() + 1 - (r % 7 - 1), s = i <= 0 ? 7 + i : i, o = [], u = 0, g = 0; g < 42; g++) {
      g < s ? o[g] = "" : u < n ? (o[g] = u + 1, u = o[g]) : n <= u && (o[g] = "");
    }
    wx.setStorageSync("currentDayList", o);
    console.log(o)
    let arr = o;
    // arr.length = o.length;
    console.log(getFullYear, getDate, this.data.currentYear, this.data.currentMonth, getMonth)
    for (let i in o) {
      if (o[i]) {
        o[i] = {
          date: o[i],
          is_re: 1
        }
        if (this.data.currentYear <= getFullYear && this.data.currentMonth == getMonth && getDate < o[i].date) {
          o[i].is_re = 0
        }
        if (this.data.currentYear <= getFullYear && this.data.currentMonth > getMonth) {
          o[i].is_re = 0
        }
      }
    }
    console.log(o)
    this.setData({
      currentDayList: o
    })
  },

  getdata(today) {
    var e = new Date(),
      getFullYear = e.getFullYear(),
      getMonth = (e.getMonth() + 1);
    let o = this
    let data = {
      type: this.data.typenum == 0 ? 3 : this.data.typenum == 1 ? 1 : 2,
      ads_id: this.data.ads_id,
      goods_id: this.data.goods_id,
      sku: "",
      month: today
    };
    Util.post('Order/displayDate', data)
      .then(t => {
        let resdata = t.data;
        if (200 == t.code) {
          console.log(o.data.currentMonth, o.data.currentYear, getFullYear, getMonth)
          var a = wx.getStorageSync("currentDayList"),
            r = [];

            
          for (var n in a){
            r.push(o.data.yearmonth + a[n]);
          }
          var i = function (t, e) {
            console.log(t);
            console.log(e);
            for (var a = 0, r = 0, n = new Array(); a < t.length && r < e.length;) {
              var i = new Date(t[a]).getTime(),
                s = new Date(e[r]).getTime();
              i < s ? a++ : (s < i || (n.push(e[r]), a++), r++);
            }
            return n;
          }(r, resdata),

            s = [];
           console.log(i);
           console.log(n);
          for (var n in a){
            if (o.data.currentYear <= getFullYear && o.data.currentMonth < getMonth) {
              console.log('88')
              a[n] && (a[n] = {
                date: a[n],
                is_re: 1
              })
            } else {
              // console.log('99',a)
              a[n] && (a[n] = {
                date: a[n],
                is_re: 0
              });
            }
          }
          for (var n in i)
            for (var n in s = i[n].split("/"), a) a[n].date == s[2] && (a[n].is_re = 1);
          console.log(a)
          o.setData({
            currentDayList: a,
            registerTime: resdata
          });
        } else {
          wx.showToast({
            icon: 'none',
            title: t.message,
            duration: 2000,
          });
        }
      })
  },

  // 切换月
  doDay: function(t) {
    var e = this,
      a = e.data.currentObj,
      r = a.getFullYear(),
      n = a.getMonth() + 1,
      i = a.getDate(),
      s = "";
    s = "left" == t.currentTarget.dataset.key ? (n -= 1) <= 0 ? r - 1 + "/12/" + i : r + "/" + n + "/" + i : (n += 1) <= 12 ? r + "/" + n + "/" + i : r + 1 + "/1/" + i,
      a = new Date(s),
      this.setData({
        currentDate: a.getFullYear() + "年" + (a.getMonth() + 1) + "月",
        currentObj: a,
        currentYear: a.getFullYear(),
        currentMonth: a.getMonth() + 1,
        currentDa: "",
        yearmonth: a.getFullYear() + "/" + (a.getMonth() + 1) + "/",
      });
    var today = a.getFullYear() + "/" + (a.getMonth() + 1) + "/" + a.getDate();
    this.setSchedule(a);
    if (this.data.goods_id) {
      this.getdata(today)
    }
  },
  // 点击 日期
  selectDay: function(t) {
    let e = this;
    let datetime = e.data.currentYear + "/" + e.data.currentMonth + "/" + t.target.dataset.day
    console.log(datetime)
    e.setData({
      currentDay: t.target.dataset.day,
      currentDa: t.target.dataset.day,
      currentDate: e.data.currentYear + "年" + e.data.currentMonth + "月",
      checkDay: datetime,
    });
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];  //当前页面
    let prevPage = pages[pages.length - 2]; //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    //
    // if (this.data.time) {
    //   prevPage.setData({
    //     datetime: datetime
    //   })
    //   wx.navigateBack();
    //   return
    // }
    prevPage.setData({
      expectdate: datetime,
      id: this.data.orderid,
      type: this.data.typenum,
      Datatime: datetime,
    })
    wx.navigateBack();
  },

  selecDayTwo(d) {
    let e = this;
    let goods_id = this.data.goods_id;
    let t = this.getCurrentDayString();
    let day = t.getFullYear() + "/" + (t.getMonth() + 1) + "/" + t.getDate();
    let datetime = e.data.currentYear + "/" + e.data.currentMonth + "/" + d.target.dataset.day;
    let registerTime = this.data.registerTime;
    let currentDayList = this.data.currentDayList
    let arr = []
    for (let i in currentDayList) {
      if (currentDayList[i].is_re == 1) {
        arr.push(currentDayList[i].is_re)
      }
    }
    console.log(arr, registerTime)
    // if (arr.length == registerTime.length) {
    //   showModal()
    // }
    console.log(datetime, day)
    if (datetime == day) {
      showModal()
    }

    function showModal() {
      wx.showModal({
        title: '提示',
        content: '请选择其他时间起租，或选择预租下单',
        confirmText: '预租下单',
        cancelText: '取消',
        success(res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/prebuy/index?goods_id=' + goods_id +'&date='+day,
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },


});