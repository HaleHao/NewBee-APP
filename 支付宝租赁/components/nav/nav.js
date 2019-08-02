Component({
  mixins: [],
  data: {

  },
  props: {
    i:0,
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    choose(e){
      // console.log(e.currentTarget.dataset)
      let url = e.currentTarget.dataset.url

      if(this.props.i==1&&url=='/pages/index/index'){
        return
      }
      if(this.props.i==2&&url=='/pages/shop/shoplist/shoplist'){
        return
      }
      if(this.props.i==3&&url=='/pages/order/orderlist/orderlist'){
        return
      }
      if(this.props.i==4&&url=='/pages/me/me/me'){
        return
      }
      my.redirectTo({
        url: url
      })
    }
  },
});
