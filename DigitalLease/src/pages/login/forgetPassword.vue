<template>
  <div class="bgc full">
    <div class="flex-jc-center">
      <div class="forget_box">
        <div class="tip_title text-c mar-b-10">请输入验证码重置密码</div>

        <div class="border-b tel">
          <input v-model.trim="phoneval" placeholder="请输入手机号" input-align="center" type="number" maxlength="11">
        </div>
        <div class="border-b password">
          <input v-model.trim="codeval" placeholder="请输入验证码" input-align="center">
        </div>

        <div class="text-c resent" @click="sendcode">{{content}}</div>

        <button
          class="btn text-c"
          :class="phoneval!=''&&codeval!=''?'bgc-blue':'btn-grey'"
          @click="toNext"
        >下一步</button>
        
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      phoneval: "",
      codeval: "",
      content: "获取验证码",
      totalTime: 59, //倒计时
      canClick: true
    };
  },
  methods: {
    sendcode() {
      if (!this.canClick) return;

      if (this.phoneval == "") {
        return;
      }
      if (!(/^1\d{10}$/.test(this.phoneval))) {
        Toast("手机号格式不正确");
        return;
      }
      let postData = this.$qs.stringify({
        users_phone: this.phoneval
      });
      this.axios
        .post(this.API + "api/Lease/Forget_PassWord", postData)
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

    //下一步
    toNext() {
      if (this.phoneval == "" || this.codeval == "") {
        return;
      }
      if (!(/^1\d{10}$/.test(this.phoneval))) {
        Toast("手机号格式不正确");
        return;
      }

      let postData = this.$qs.stringify({
        users_phone: this.phoneval,
        yzm: this.codeval
      });
      this.axios.post(this.API + "api/Lease/Reset_pwd", postData).then(res => {
        console.log(res.data, "next");
        let resdata = res.data;
        if (resdata.code == 200) {
          this.$router.replace({ path: "/resetPassword/" + this.phoneval });
        } else {
          Toast(resdata.message);
        }
      });
    }
  }
};
</script>

<style scoped>
input {
  width: 100%;
  text-align: center;
  line-height: 40px;
}
.forget_box {
  width: 250px;
}
.tip_title {
  padding-top: 70px;
  font-size: 20px;
}
.resent {
  color: #aeaeae;
  font-size: 12px;
  line-height: 40px;
}
.input_box {
  height: 40px;
  margin-top: 30px;
}

.input_box input {
  text-align: center;
  width: 38px;
  height: 37px;
}
.border_right {
  width: 40px;
  height: 40px;
  border-right: 1px solid #b7b7b7;
}
.btn {
  width: 100%;
  height: 40px;
  line-height: 40px;
  color: #fff;
  /* background: rgba(191, 191, 191, 1); */
  border-radius: 20px;
  margin-top: 80px;
}
.btn-grey {
  background: rgba(191, 191, 191, 1);
}
</style>
