<template>
  <div class="bgc full">
    <div class="flex-jc-center">
      <div class="login_box">
        <div class="login_title text-c">密码登陆</div>
        <div class="border-b tel">
          <input v-model.trim="phoneval" placeholder="请输入手机号" input-align="center" type="number" maxlength="11">
        </div>
        <div class="border-b password">
          <input v-model.trim="pwval" placeholder="请输入密码" input-align="center" type="password">
        </div>
        <div class="text-r forget">
          <router-link to="/forgetPassword">忘记密码</router-link>
        </div>
        <div
          class="btn text-c"
          :class="phoneval!=''&&pwval!=''?'bgc-blue':'btn-grey'"
          @click="login"
        >登录</div>
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
      pwval: ""
    };
  },
  methods: {
    //登陆
    login() {
      if (this.phoneval == "" || this.pwval == "") {
        return;
      }

      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
        users_phone: this.phoneval,
        users_pwd: this.pwval,
        wakeup: window.sessionStorage.getItem("wakeup")||''
      });
      this.axios.post(this.API + "api/Lease/Lease_Sign", postData).then(res => {
        console.log(res.data, "pwlogin");
        let resdata = res.data;
        if (resdata.code == 200) {
          Toast.clear();
          window.localStorage.setItem("userinfo", JSON.stringify(resdata.data));

          if(window.sessionStorage.getItem("rpfriend")){
            window.sessionStorage.removeItem("rpfriend");
            this.$router.replace({ path: "/rpfriend" });
          }
          else{
            window.sessionStorage.removeItem("wakeup");
            this.$router.replace({ path: "/" });
          }
        } else {
          Toast.clear();
          Toast(resdata.message);
        }
      });
    }
  }
};
</script>

<style scoped>
.login_box {
  width: 250px;
}
.login_title {
  padding-top: 30px;
  font-size: 20px;
  line-height: 80px;
}
input {
  width: 100%;
  text-align: center;
  line-height: 40px;
}
.forget {
  color: #aeaeae;
  line-height: 40px;
}
.btn {
  width: 100%;
  height: 40px;
  line-height: 40px;
  color: #fff;
  /* background: rgba(191, 191, 191, 1); */
  border-radius: 20px;
  margin-top: 50px;
}
.btn-grey {
  background: rgba(191, 191, 191, 1);
}
</style>
