<template>
    <van-dialog
        v-model="showlogin"
        title="登陆"
        :before-close="beforeClose"
    >
        <div class="form">
            <van-field v-model="phoneval" type="number" placeholder="请输入手机号" />
            <van-field v-model="yzcode" center placeholder="请输入验证码">
                <van-button slot="button" size="small" type="default" :disabled="disabled" @click="send">{{content}}</van-button>
            </van-field>
        </div>
    </van-dialog>
</template>

<script>
import { Toast,Dialog } from "vant";
export default {
    props: ['value'],
    data(){
        return{
            showlogin: this.value,
            phoneval:'',
            yzcode:'',
            disabled:false,
            content: "获取验证码",
            totalTime: 59, //倒计时
        }
    },
    watch:{
        value(){
            this.showlogin = this.value
        }
    },
    methods:{
        beforeClose(action,done){
            if (action === 'confirm') {
                if(!(/^1(3|4|5|7|8)\d{9}$/.test(this.phoneval))){ 
                    Toast("手机号格式不正确");
                    done(false)
                    return;
                }
                if (this.yzcode == "") {
                    Toast("请输入验证码");
                    done(false)
                    return;
                }

                let postData = this.$qs.stringify({
                    users_phone:this.phoneval,
                    yzm: this.yzcode,
                })
                this.axios.post(this.API + "api/Lease/Yzm_Login",postData)
                .then(res => {
                    console.log(res.data, "login");
                    let resdata = res.data;
                    if (resdata.code == 200) {
                        window.localStorage.setItem("userinfo",JSON.stringify(resdata.data))
                        Toast('登陆成功');
                        this.$emit('input', false);
                        done()
                    } else {
                        done(false)
                        Toast(resdata.message);
                    }
                });
            }
        },
        //倒计时
        send() {
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
                    this.disabled = true;
                    this.content = this.totalTime + "s";
                    let clock = window.setInterval(() => {
                        this.totalTime--;
                        this.content = this.totalTime + "s";
                        if (this.totalTime < 0) {
                        window.clearInterval(clock);
                        this.content = "重新发送";
                        this.totalTime = 59;
                        this.disabled = false;
                        }
                    }, 1000);
                } else {
                Toast(resdata.message);
                }
            });
        },
    }
}
</script>

<style scoped>
.form >>> .van-button--default {
    color: #4EA9F9
}
</style>
