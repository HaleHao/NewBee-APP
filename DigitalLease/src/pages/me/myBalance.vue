<template>
  <div class="bgc">
    <div class="bgc text-c all_bal">
      <div class="all_money">￥{{money||0}}</div>
      <div class="kt">可提现金额</div>

      <div class="text-c btnbox">
        <div class="btn" @click="toCash">提现</div>
      </div>
      <div class="balance kt">余额￥{{balance||0}}</div>
    </div>

    <div id="navBalance">
      <van-tabs @click="ontag" v-model="active">
        <van-tab :title="item" v-for="(item,index) in navtitle" :key="index">
        <div v-show="list.length==0" class="fc-grey text-c pd-15 fsz-12" style="background-color: #f6f6f6;">没有更多了</div>
          <div v-for="(item,index) in list" :key="index">
            <div class="flex-center bgc">
              <div class="flex-jc-between flex-align-items pd-15 bala_deta border-b">
                <div>
                  <div>{{item.content}}</div>
                  <div class="time">{{item.create_time}}</div>
                </div>
                <div class="money_deta">{{item.state==1?'+':'-'}}{{item.money}}</div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant';
export default {
  data() {
    return {
      active: 0,
      navtitle: ["押金", "托管收益", "推广金", "红包", "邀请码"],
      list:[],
      money: 0,
      balance:0
    };
  },
  beforeCreate(){
    if (!window.localStorage.getItem("userinfo")) {
      this.$router.replace({ path: "/login" });
    }
  },
  mounted(){
    this.getlist()
    this.getinfo()
  },
  methods: {
    getinfo() {
        let postData = this.$qs.stringify({
            users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
        });
        this.axios.post(this.API + "api/Buy_Order/GetPayData", postData)
        .then(res => {
            console.log(res.data, "info");
            let resdata = res.data;
            if (resdata.code == 200) {
                this.balance = resdata.data.users_balance;
            } else {
            Toast(resdata.message);
            }
        })
        .catch(error => {
            Toast('网络出错')
        });
    },
    ontag(index, title) {
      console.log(index, title);
      this.active = index;
      this.getlist()
    },
    getlist(){
      Toast.loading({ mask: true,message: '加载中...'})
        let postData = this.$qs.stringify({
          users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
          type: this.active-0+1
        });
        this.axios.post(this.API + "api/Order/GetBalance", postData)
        .then(res => {
          console.log(res.data, "list");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear()
            this.list = resdata.data.money
            this.money = resdata.data.users_balance
          } else {
            Toast.clear()
            this.list = []
            Toast(resdata.message);
          }
        });
    },

    //提现
    toCash() {
      this.$router.push({ path: "/cash" });
    }
  }
};
</script>

<style scoped>
#navBalance >>> .van-tabs__line {
  background-color: #fff;
  background-image: linear-gradient(90deg, #6c76ed 0%, #74d2ff 100%);
}
#navBalance >>> .van-tab {
  background-color: #f6f6f6;
}
.balance{
  padding-bottom: 15px;
}
.all_bal {
  width: 100%;
}
.all_money {
  font-size: 35px;
  padding-top: 25px;
}
.kt {
  font-size: 13px;
}
.btnbox {
  padding:15px
}
.btn {
  width: 99px;
  height: 25px;
  line-height: 25px;
  background: linear-gradient(90deg, #60c0fd, #4ea9f9);
  box-shadow: 0px 0px 13px 0px rgba(79, 171, 249, 0.36);
  border-radius: 29px;
  color: #fff;
  display: inline-block;
}
.bala_deta {
  width: 100%;
}
.money_deta {
  font-size: 16px;
  color: #4ea9f9;
}
.time {
  font-size: 12px;
  color: #aeaeae;
  margin-top: 5px;
}
</style>


