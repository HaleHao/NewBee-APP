<template>
  <div class="page">
    <div class="flex-jc-center mar-b-10" v-for="(item,index) in cardlist" :key='index' @click="choose(index)">
      <div class="card_box bgc">
        <div class="card flex-jc-around flex-align-items">
          <div class="flex-align-items">
            <span>{{item.open_bank}}</span>
          </div>
          <div class="f12_grey">{{item.bank_type==1?'储蓄卡':'信用卡'}}</div>
        </div>
        <div class="flex-jc-around card_num">
          <span>{{item.bank_code}}</span>
          <span></span>
        </div>
      </div>
    </div>

    <div class="flex-jc-center">
      <router-link to="/bindingCard">
        <div class="card_box bgc">
          <div class="flex-jc-center">
            <img class="add_img" src="../../assets/jiahao.png">
          </div>
          <div class="text-c f12_grey add_card">添加银行卡</div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      cardlist: []
    };
  },
  created(){
    this.getlist()
  },
  methods:{
    getlist(){
      Toast.loading({ mask: true,message: '加载中...'})
        let postData = this.$qs.stringify({
          users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
        });
        this.axios.post(this.API + "api/Order/GetUserBank", postData)
        .then(res => {
          console.log(res.data, "list");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear()
            this.cardlist = resdata.data
          } else {
            Toast.clear()
            Toast(resdata.message);
          }
        });
    },

    choose(index){
      let bankcardSession = this.cardlist[index]
      window.sessionStorage.setItem(
        "bankcardSession",
        JSON.stringify(bankcardSession)
      );

      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.page{
  padding-top: 10px;
}
.card_box {
  width: 295px;
  height: 112px;
  box-shadow: 0px 0px 16px 0px rgba(220, 221, 223, 0.19);
  border-radius: 5px;
  font-size: 16px;
}
.card {
  margin-top: 15px;
}
.card_img {
  width: 20px;
  height: 20px;
  margin-right: 25px;
}
.add_img {
  width: 22px;
  height: 22px;
  margin-top: 30px;
}
.f12_grey {
  color: #aeaeae;
  font-size: 12px;
}

.card_num {
  line-height: 70px;
}
.add_card {
  line-height: 50px;
}
</style>