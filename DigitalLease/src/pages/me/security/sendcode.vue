<template>
    <div class="full bgc">
        <div class="pd-15">验证码已发送至{{phone}}</div>
        <div class="pd-15 mar-b-10 flex-jc-between">
            <input type="text" placeholder="请输入验证码" v-model.trim="codeval">
            <button class="send bgc-blue" @click="sendcode">{{content}}</button>
        </div>

        <div class="flex-jc-center">
        <div class="btn text-c" @click="next">下一步</div>
      </div>
    </div>
</template>

<script>
import { Toast } from "vant";
export default {
    data(){
        return{
            phone: this.$route.params.phone,
            codeval: '',
            content: "重新发送",
            totalTime: 59, //倒计时
            canClick: true
        }
    },
    created(){
        this.sendcode()
    },
    methods:{
        sendcode(){
            if (!this.canClick) return;
            
            let postData = this.$qs.stringify({
                    users_phone:this.$route.params.phone
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
        next(){
            let postData = this.$qs.stringify({
                users_phone:this.$route.params.phone,
                yzm: this.codeval
            })
            this.axios.post(this.API + "api/Lease/Reset_pwd",postData)
            .then(res => {
                console.log(res.data, "next");
                let resdata = res.data;
                if (resdata.code == 200) {
                    if(this.$route.params.type=='phone'){
                        this.$router.replace({ path: "/newphone" });
                    }
                } else {
                Toast(resdata.message);
                }
            });
            
        }
    }
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
}
</style>
