<template>
    <div class="bgc full">
        <div class="pd-15">
            <input type="number" placeholder="请输入手机号" v-model.trim="phoneval">
        </div>
        <div class="pd-15 mar-b-10 flex-jc-between">
            <input type="text" placeholder="请输入验证码" v-model.trim="codeval">
            <button class="send bgc-blue" @click="sendcode">{{content}}</button>
        </div>
        <div class="flex-jc-center">
            <div class="btn text-c" @click="login">登录</div>
        </div>
    </div>
</template>

<script>

import { Toast,Dialog } from "vant";

export default {
    data(){
        return{
            phoneval: '',
            codeval: '',
            id:'',
            content: "获取验证码",
            totalTime: 59, //倒计时
            canClick: true
        }
    },

  mounted(){
       let code = window.location.search.split("&")[0].slice(6);
       let state = window.location.search.split("&")[1].slice(6);
       Toast.loading({ mask: true, message: "加载中..." });
        let postData={
          code:code,
          state:state,
        }
         this.axios.post(this.API + "api/order/wxLogin",postData).then(res => {
            console.log(res.data, "gowx");
            Toast.clear();
            let resdata = res.data;
            if (resdata.code == 200) {
              console.log('110000')
              this.id = resdata.data
            } else {
              Toast(resdata.message);
            }
          })
         .catch(error => {
             Toast.clear();
             Toast('网络出错')
         });
    },
    methods:{
      sendcode(){
                if (!this.canClick) return;
                if (!(/^1\d{10}$/.test(this.phoneval))) {
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
            login() {
                if (this.phoneval == "" || this.codeval == "") {
                    return;
                }
                if (!(/^1\d{10}$/.test(this.phoneval))) {
                    Toast("手机号格式不正确");
                    return;
                }

                Toast.loading({ mask: true, message: "加载中..." });
                let postData = this.$qs.stringify({
                    type: 2,
                    phone: this.phoneval,
                    yzm: this.codeval,
                    user_auth_id: this.id ,
                });
                this.axios.post(this.API + "api/Order/ThreeLogin", postData).then(res => {
                    console.log(res.data, "sinalogin");
                    let resdata = res.data;
                    if (resdata.code == 200) {
                        Toast.clear();
                        window.localStorage.setItem("userinfo", JSON.stringify(resdata.data));
                        this.$router.replace({ path: "/" });
                    } else {
                        Toast.clear();
                        Toast(resdata.message);
                    }
                })
                .catch(error => {
                    Toast.clear();
                    Toast('网络出错')
                });
            },
      },
}
</script>

<style scoped>
.btn {
  width: 298px;
  height: 40px;
  line-height: 40px;
  background: linear-gradient(90deg, #60c0fd, #4ea9f9);
  border-radius: 20px;
  color: #fff;
}
.send {
    color: #fff;
    border-radius: 15px;
    line-height: 22px;
    font-size: 12px;
}
</style>
