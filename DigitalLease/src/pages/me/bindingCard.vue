<template>
  <div>
    <div class="box bgc">
      <div class="flex-jc-between border-b pd-15" @click="isshow = true">
        <div class="flexbox">
          <div class="left">开卡银行</div>
          <span class="select" v-if="text==''">请选择开卡银行</span>
          <span v-else>{{text.bank_name}}</span>
        </div>
        <van-icon name="arrow" color="#aeaeae" size="18px"/>
      </div>
      <div class="flex-jc-between border-b pd-15">
        <div class="flexbox">
          <div class="left">卡号</div>
          <input placeholder="请输入银行卡号" v-model.trim="cardnum">
        </div>
      </div>
      <div class="flex-jc-between border-b pd-15">
        <div class="flexbox">
          <div class="left">姓名</div>
          <input placeholder="请输入姓名" v-model.trim="nickname">
        </div>
      </div>
      <div class="flex-jc-between border-b pd-15">
        <div class="flexbox">
          <div class="left">身份证号</div>
          <input placeholder="请输入身份证号" v-model.trim="idcard">
        </div>
      </div>
      <div class="flex-jc-between border-b pd-15">
        <div class="flexbox">
          <div class="left">手机号</div>
          <input placeholder="请输入手机号" v-model.trim="phoneval" type="number" maxlength="11">
        </div>
      </div>
      <div class="flex-jc-between border-b pd-15 flex-align-items">
        <div class="flexbox">
          <div class="left">验证码</div>
          <input placeholder="请输入验证码" class="input_b" v-model.trim="yzcode">
        </div>
        <span class="yz" @click="countDown" >{{content}}</span>
      </div>
    </div>
    <div class="flex-jc-center">
      <div class="btn text-c" @click="save">保存</div>
    </div>

    <van-popup v-model="isshow" position="bottom" :close-on-click-overlay="false">
      <van-picker :columns="columns"  show-toolbar @confirm="onConfirm" @cancel="isshow = false" value-key='bank_name'/>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      isshow: false,
      columns: [],
      text: "",
      cardnum: "",
      nickname: "",
      idcard: "",
      phoneval: "",
      yzcode: "",
      content: "获取验证码",
      totalTime: 59, //倒计时
      canClick: true
    };
  },
  created() {
    this.getdata()
  },

  methods: {
    getdata(){
      Toast.loading({ mask: true,message: '加载中...'})
        this.axios.post(this.API + "api/Order/GetBank")
        .then(res => {
          console.log(res.data, "data");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear()
            this.columns = resdata.data
          } else {
            Toast.clear()
            Toast(resdata.message);
          }
        });
    },
    onConfirm(value, index) {
      console.log(value);
      this.text = value;
      this.isshow = false;
    },
    //倒计时
    countDown() {
      if (!this.canClick) return;

      if(!(/^1(3|4|5|7|8)\d{9}$/.test(this.phoneval))){ 
        Toast("手机号格式不正确");
        return;
      }

      let postData = this.$qs.stringify({
              users_phone:this.phoneval
          })
      this.axios.post(this.API + "api/Lease/Forget_PassWord",postData)
      .then(res => {
          console.log(res.data, "sendcode");
          let resdata = res.data;
          if (resdata.code == 200) {
              Toast('发送成功')
              this.canClick = false;
              this.content = this.totalTime + "s";
              let clock = window.setInterval(() => {
                this.totalTime--;
                this.content = this.totalTime + "s";
                if (this.totalTime < 0) {
                  window.clearInterval(clock);
                  this.content = "重新发送";
                  this.totalTime = 59;
                  this.canClick = true;
                }
              }, 1000);
          } else {
          Toast(resdata.message);
          }
      });
    },

    save() {
      if (
        this.text == "" ||
        this.cardnum == "" ||
        this.nickname == "" ||
        this.idcard == "" ||
        this.yzcode == ""
      ) {
        Toast("请先填写完整");
        return;
      }

      if(!(/^1(3|4|5|7|8)\d{9}$/.test(this.phoneval))){ 
        Toast("手机号格式不正确");
        return;
      }
      
      Toast.loading({ mask: true,message: '加载中...'})
        let postData = this.$qs.stringify({
          users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
          open_bank:this.text.bank_name,
          bank_code: this.cardnum,
          realname: this.nickname,
          IDcrad: this.idcard,
          phone: this.phoneval,
          yzm: this.yzcode
        });
        this.axios.post(this.API + "api/Order/AddUserBank", postData)
        .then(res => {
          console.log(res.data, "submit");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear()
            this.$router.go(-1);
          } else {
            Toast.clear()
            Toast(resdata.message||'操作失败');
          }
        })
        .catch(error => {
          Toast.clear()
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
.left {
  width: 65px;
}
.select {
  color: #cecece;
}
input::placeholder {
  color: #cecece;
}
.input_b {
  width: 100px;
}
.yz {
  height: 25px;
  line-height: 25px;
  color: #fff;
  background-color: #4ea9f9;
  border-radius: 15px;
  padding: 0px 10px;
  font-size: 12px;
}
.btn {
  width: 280px;
  height: 40px;
  line-height: 40px;
  background: linear-gradient(90deg, #60c0fd, #4ea9f9);
  border-radius: 20px;
  color: #fff;
  margin-top: 70px;
}
.model {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}
.main {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
}
</style>


