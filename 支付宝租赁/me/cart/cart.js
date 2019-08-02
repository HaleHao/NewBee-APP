Page({
  data: {
    sum: 0,
    list:[
      { right: [{ type: 'delete', text: '删除' }], content: 'AAA' },
      { right: [{ type: 'delete', text: '删除' }], content: 'BBB' },
      { right: [{ type: 'delete', text: '删除' }], content: 'CCC' },
    ]
  },
  onLoad() {},

  radioChange: function(e) {
    console.log('你选择的框架是：', e.detail.value)
  },

   onRightItemClick(e) {
    const { type } = e.detail;
    my.confirm({
      title: '温馨提示',
      content: `${e.index}-${e.extra}-${JSON.stringify(e.detail)}`,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        const { list } = this.data;
        if (result.confirm) {
          if (type === 'delete') {
            list.splice(this.data.swipeIndex, 1);
            this.setData({
              list: [...list],
            });
          }

          my.showToast({
            content: '确定 => 执行滑动删除还原',
          });
          e.done();
        } else {
          my.showToast({
            content: '取消 => 滑动删除状态保持不变',
          });
        }
      },
    });
  },
  onSwipeStart(e) {
    this.setData({
      swipeIndex: e.index,
    });
  },
});
