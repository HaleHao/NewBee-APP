<template>
    <div class="bgc full">
        <div class="pd-15">
            <input type="number" maxlength="11" placeholder="请输入新手机号" v-model.trim="phoneval">
        </div>
        <div class="pd-15 mar-b-10 flex-jc-between">
            <input type="text" placeholder="请输入验证码" v-model.trim="codeval">
            <button class="send bgc-blue" @click="sendcode">{{content}}</button>
        </div>

        <div class="flex-jc-center">
        <div class="btn text-c" @click="submit">确定修改</div>
      </div>
    </div>
</template>

<script>
import { Toast } from "vant";
export default {
    data(){
        return{
            phoneval: '',
            codeval: '',
            content: "发送",
            totalTime: 59, //倒计时
            canClick: true
        }
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
        submit(){
            if (!(/^1\d{10}$/.test(this.phoneval))) {
                Toast("手机号格式不正确");
                return;
            }
            Toast.loading({ mask: true,message: '加载中...'})
            let postData = this.$qs.stringify({
                users_phone: this.phoneval,
                yzm: this.codeval,
                users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id
            })
            this.axios.post(this.API + "api/Lease/update_phone",postData)
            .then(res => {
                console.log(res.data, "submit");
                let resdata = res.data;
                if (resdata.code == 200) {
                    Toast.clear()
                    Toast('修改成功')
                    this.$router.replace({ path: "/accountSecurity" })
                } else {
                    Toast.clear()
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
