<template>
  <div class="bgc full">
    <div class="flex-jc-center">
      <div class="login_box">
        <div class="tip_title text-c">请设置新密码</div>
        <div class="text-c tel">{{phone}}</div>
        <div class="border-b">
          <input v-model.trim="value" type="password" placeholder="请输入新密码" input-align="center" border="false">
        </div>
        <button class="btn text-c" :class="value==''?'btn-grey':'bgc-blue'" @click="login">确认并登陆</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      value: "",
      phone: this.$route.params.phone,
    };
  },
  methods: {

    login() {
      if (this.value == "") {
        return
      }

      Toast.loading({ mask: true, message: "加载中..." })
      let postData = this.$qs.stringify({
            users_phone:this.$route.params.phone,
            users_pwd: this.value,
            wakeup: window.sessionStorage.getItem("wakeup")||''
        })
      this.axios.post(this.API + "api/Lease/New_pwd",postData)
      .then(res => {
        console.log(res.data, "npwlogin");
        let resdata = res.data;
        if (resdata.code == 200) {
          Toast.clear();
          window.localStorage.setItem("userinfo",JSON.stringify(resdata.data))
          
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
.tip_title {
  padding-top: 70px;
  font-size: 20px;
}
.tel {
  color: #aeaeae;
  font-size: 12px;
  line-height: 40px;
}
input {
  width: 100%;
  text-align: center;
  line-height: 40px;
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
