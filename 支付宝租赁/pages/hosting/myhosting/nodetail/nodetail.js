Page({
  data: {},
  onLoad(q) {
    console.log(q)
    this.setData({
      type: q.type
    })
  },
});
