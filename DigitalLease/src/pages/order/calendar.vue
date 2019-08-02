<template>
  <div>
    <div class="pd-15 bgc">请选择日期</div>
    <div>
      <Calendar ref="Calendar" :sundayStart="true" @choseDay="clickDay" @changeMonth="changeDate" :agoDayHide="nowdate" :markDate=arr></Calendar>
    </div>
    <div class="fc-red tip pd-15" v-if="type1=='pre'">
      如当前没有您所需要的档期，请选择预租下单，我们将在24小时内
      回复是否可以满足您的需求.
    </div>
    <!-- <div class="pd-lr-15" v-if="type1=='pre'">
      <div class="btn text-c" @click="goprebuy">预租下单</div>
    </div> -->
  </div>
</template>

<script>
import Calendar from "vue-calendar-component";
import { Toast,Dialog } from "vant";
export default {
  components: {
    Calendar
  },
  data() {
    return {
      nowdate: String(Date.now() - 86400000).slice(0, 10),
      type1: this.$route.params.type1,
      arr:[]
    };
  },
  created() {
    console.log(this.$route.query)
    if(this.$route.params.type=='buy'||this.$route.params.type=='expectdateTobuy'||this.$route.params.type=='friendbuy'||this.$route.params.type=='expectdateTofriendbuy'){
      this.getdata()
    }
  },
  methods: {
    getdata(){
      Toast.loading({ mask: true, message: "加载中..." });
      let newdate = new Date()
      let postData = this.$qs.stringify({
          type: this.$route.query.type == 0 ? 3 : this.$route.query.type == 1 ? 1 : 2,
          ads_id: this.$route.query.ads_id,
          goods_id: this.$route.query.goods_id,
          sku: this.$route.query.sku,
          month: `${newdate.getFullYear()}/${newdate.getMonth() + 1}/${newdate.getDate()}`
      });
      this.axios.post(this.API + "api/Order/displayDate", postData)
      .then(res => {
          console.log(res.data, "data");
          let resdata = res.data;
          if (resdata.code == 200) {
              Toast.clear();
              this.arr = resdata.data
          } else {
              Toast.clear();
              Toast(resdata.message);
          }
      })
    },
    changeDate(date) {
      if(this.$route.params.type=='buy'||this.$route.params.type=='expectdateTobuy'||this.$route.params.type=='friendbuy'||this.$route.params.type=='expectdateTofriendbuy'){
        Toast.loading({ mask: true, message: "加载中..." });
        let newdate = new Date()
        let postData = this.$qs.stringify({
            type: this.$route.query.type == 0 ? 3 : this.$route.query.type == 1 ? 1 : 2,
            ads_id: this.$route.query.ads_id,
            goods_id: this.$route.query.goods_id,
            sku: this.$route.query.sku,
            month: date
        });
        this.axios.post(this.API + "api/Order/displayDate", postData)
        .then(res => {
            console.log(res.data, "data");
            let resdata = res.data;
            if (resdata.code == 200) {
                Toast.clear();
                this.arr = resdata.data
            } else {
                Toast.clear();
                Toast(resdata.message);
            }
        })
      }
    },
    
    add0(m){return m<10?'0'+m:m },
    clickDay(date) {
      if(this.arr.length!=0){
        if(this.$route.params.type=='buy'||this.$route.params.type=='expectdateTobuy'||this.$route.params.type=='friendbuy'||this.$route.params.type=='expectdateTofriendbuy'){
          let datetext = date.split('/')
          if(this.add0(datetext[1])!=this.arr[0].split('/')[1]){
            return
          }
          if(this.arr.includes(`${datetext[0]}/${this.add0(datetext[1])}/${datetext[2]}`)) {
            if(this.$route.params.type=='friendbuy'||this.$route.params.type=='expectdateTofriendbuy'){
              Toast('请选择其他起租时间！')
            }

            if(this.$route.params.type=='buy'||this.$route.params.type=='expectdateTobuy'){
              Dialog.confirm({
                title: "",
                message: "请选择其他起租时间，或选择预租下单",
                confirmButtonText: '预租下单',
              })
              .then(() => {
                // on confirm
                this.goprebuy(date)
              })
            }

            return
          }
        }
      }
      
      console.log(date);
      if (this.$route.params.type == "shopping") {
        let shoppingSession = JSON.parse(
          window.sessionStorage.getItem("shoppingSession")
        );
        shoppingSession.getdate = date;
        window.sessionStorage.setItem(
          "shoppingSession",
          JSON.stringify(shoppingSession)
        );
      }
      if (this.$route.params.type == "refund") {
        let refundSession = JSON.parse(
          window.sessionStorage.getItem("refundSession")
        );
        refundSession.backdate = date;
        window.sessionStorage.setItem(
          "refundSession",
          JSON.stringify(refundSession)
        );
      }
      if (this.$route.params.type == "appointmentExpress") {
        let appointmentExpress = JSON.parse(
          window.sessionStorage.getItem("appointmentExpress")
        );
        appointmentExpress.date = date;
        window.sessionStorage.setItem(
          "appointmentExpress",
          JSON.stringify(appointmentExpress)
        );
      }
      if (this.$route.params.type == "hostCancel") {
        let hostCancelSession = JSON.parse(
          window.sessionStorage.getItem("hostCancelSession")
        );
        hostCancelSession.date = date;
        window.sessionStorage.setItem(
          "hostCancelSession",
          JSON.stringify(hostCancelSession)
        );
      }
      if (this.$route.params.type == "platformDeli") {
        let platformDeliSession = JSON.parse(
          window.sessionStorage.getItem("platformDeliSession")
        );
        platformDeliSession.date = date;
        window.sessionStorage.setItem(
          "platformDeliSession",
          JSON.stringify(platformDeliSession)
        );
      }
      if (this.$route.params.type == "sceneDeli") {
        let sceneDeliSession = JSON.parse(
          window.sessionStorage.getItem("sceneDeliSession")
        );
        sceneDeliSession.date = date;
        window.sessionStorage.setItem(
          "sceneDeliSession",
          JSON.stringify(sceneDeliSession)
        );
      }
      if (this.$route.params.type == "postDeli") {
        let postDeliSession = JSON.parse(
          window.sessionStorage.getItem("postDeliSession")
        );
        postDeliSession.date = date;
        window.sessionStorage.setItem(
          "postDeliSession",
          JSON.stringify(postDeliSession)
        );
      }
      if (this.$route.params.type == "buy") {
        let buySession = JSON.parse(
          window.sessionStorage.getItem("buySession")
        );
        buySession.getdate = date;
        window.sessionStorage.setItem(
          "buySession",
          JSON.stringify(buySession)
        );
      }
      if (this.$route.params.type == "expectdateTobuy") {
        let buySession = JSON.parse(
          window.sessionStorage.getItem("buySession")
        );
        buySession.expectdate = date;
        window.sessionStorage.setItem(
          "buySession",
          JSON.stringify(buySession)
        );
      }
      if (this.$route.params.type == "preBuy") {
        let prebuySession = JSON.parse(
          window.sessionStorage.getItem("prebuySession")
        );
        prebuySession.getdate = date;
        window.sessionStorage.setItem(
          "prebuySession",
          JSON.stringify(prebuySession)
        );
      }
      if (this.$route.params.type == "expectdateTopreBuy") {
        let prebuySession = JSON.parse(
          window.sessionStorage.getItem("prebuySession")
        );
        prebuySession.expectdate = date;
        window.sessionStorage.setItem(
          "prebuySession",
          JSON.stringify(prebuySession)
        );
      }
      if (this.$route.params.type == "friendbuy") {
        let friendbuySession = JSON.parse(
          window.sessionStorage.getItem("friendbuySession")
        );
        friendbuySession.getdate = date;
        window.sessionStorage.setItem(
          "friendbuySession",
          JSON.stringify(friendbuySession)
        );
      }
      if (this.$route.params.type == "expectdateTofriendbuy") {
        let friendbuySession = JSON.parse(
          window.sessionStorage.getItem("friendbuySession")
        );
        friendbuySession.expectdate = date;
        window.sessionStorage.setItem(
          "friendbuySession",
          JSON.stringify(friendbuySession)
        );
      }
      if (this.$route.params.type == "friendBuyShare") {
        let friendBuyShare = JSON.parse(
          window.sessionStorage.getItem("friendBuyShare")
        );
        friendBuyShare.date = date;
        window.sessionStorage.setItem(
          "friendBuyShare",
          JSON.stringify(friendBuyShare)
        );
      }
      this.$router.go(-1);
    },

    goprebuy(date){
      window.sessionStorage.removeItem("prebuySession");
      this.$router.push({ 
        path: "/preBuy", 
        query: {
          id: this.$route.query.goods_id,
          guige: this.$route.query.sku,
          date: date
        }
      });
    }
  }
};
</script>

<style scoped>
.wh_container >>> .wh_content_all {
  background-color: #fff;
}
.wh_container >>> .wh_jiantou1 {
  border-color: #000;
}
.wh_container >>> .wh_jiantou2 {
  border-color: #000;
}
.wh_container >>> .wh_top_changge li {
  color: #000;
}
.wh_container >>> .wh_content_item {
  color: #000;
}
.wh_container >>> .wh_content_item .wh_isToday{
  background-color: transparent;
  color: #50abf9;
}
.wh_container >>> .wh_content_item .wh_chose_day {
  background-color: #50abf9;
  color: #fff;
} 
.wh_container >>> .wh_content_item > .wh_isMark {
  background: #fff;
  color: #bfbfbf;
}

.tip {
  font-size: 12px;
}

.btn {
  height: 42px;
  line-height: 42px;
  border-radius: 20px;
  color: #fff;
  background-image: linear-gradient(90deg, #2dbbf1 0%, #4ea9f9 100%);
}
</style>
