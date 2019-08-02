<template>
  <div>
    <div class="box">
      <div v-if="bankcard">
        <van-cell is-link to="/bankCard" >
          <template slot="title">
            <div class="cart">{{bankcard.open_bank}}（{{bankcard.bank_code}}）</div>
          </template>
        </van-cell>
      </div>
      <router-link to="/bankCard" v-else>
        <div class="add_card pd-15">
          <span class="jia">+</span>
          选择银行卡
        </div>
      </router-link>

      <div class="pd-15">提现金额</div>
      <div class="flex-jc-between flex-align-items pd-15">
        <div class="flex-align-items">
          <img class="qian_img" src="../../assets/qian_icon.png">
          <input type="text" :placeholder="`可提现${balance}元`" v-model.trim.number="money">
        </div>
        <div class="all" @click="allmoney">全部</div>
      </div>
    </div>
    <div class="tip text-c pd-15">3个工作日内到账，节假日顺延</div>
    <div class="flex-jc-center">
      <div class="btn text-c" @click="submit">确认提现</div>
    </div>
  </div>
</template>

<script>
import { Toast,Dialog } from "vant";
export default {
  data() {
    return {
      money: "",
      balance:0,
      bankcard: null
    };
  },
  created(){
    this.getinfo()
    let bankcardSession = window.sessionStorage.getItem("bankcardSession")
    if(bankcardSession){
      let bankcards = JSON.parse(bankcardSession)
      bankcards.bank_code.slice(-4)
      bankcards.bank_code = bankcards.bank_code.slice(-4)
      this.bankcard = bankcards
    }
  },
  methods: {
    getinfo(){
      Toast.loading({ mask: true,message: '加载中...'})
        let postData = this.$qs.stringify({
          users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
        });
        this.axios.post(this.API + "api/Order/GetCash", postData)
        .then(res => {
          console.log(res.data, "info");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear()
            this.balance = resdata.data.users_balance
          } else {
            Toast.clear()
            Toast(resdata.message);
          }
        });
    },
    allmoney() {
      this.money = this.balance
    },
    submit(){
      if(!this.bankcard){
        Toast('请选择银行卡');
        return
      }
      if(this.money==''){
        Toast('请输入提现金额');
        return
      }
      if(this.money <= 0){
        Toast('提现金额需大于零');
        return
      }

      Toast.loading({ mask: true,message: '加载中...'})
        let postData = this.$qs.stringify({
          users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
          user_bank_id: this.bankcard.user_bank_id,
          money: this.money
        });
        this.axios.post(this.API + "api/Order/AddCash", postData)
        .then(res => {
          console.log(res.data, "submit");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear()
            this.money = ''
            Dialog.alert({
                message: '提现成功'
            }).then((e) => {
                this.getinfo()
            });
          } else {
            Toast.clear()
            Toast(resdata.message||'操作失败');
          }
        })
        .catch(error => {
                Toast('网络出错')
            });
    }
  }
};
</script>

<style scoped>
.box {
  margin: 15px;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 16px 0px rgba(220, 221, 223, 0.19);
  border-radius: 10px;
}
.add_card,
.all {
  color: #4ea9f9;
}

.qian_img {
  width: 15px;
  height: 25px;
  margin-right: 15px;
}
.cart {
  font-size: 17px;
}
.fuhao {
  font-size: 30px;
  font-weight: 200;
  padding-right: 15px;
}
.btn {
  width: 299px;
  height: 40px;
  line-height: 40px;
  background: linear-gradient(90deg, #60c0fd, #4ea9f9);
  border-radius: 20px;
  color: #fff;
  margin-top: 50px;
}
.tip {
  color: #aeaeae;
}

.money {
  font-size: 30px;
}
</style>
