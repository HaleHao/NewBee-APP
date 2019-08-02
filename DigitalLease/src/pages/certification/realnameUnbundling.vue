<template>
    <div>
        <div class="pd-15 bgc border-b"><input style="width:100%" type="text" placeholder="请输入身份证号码" v-model.trim="idcardval"></div>
        <div class="pd-15 bgc border-b"><input style="width:100%" type="number" placeholder="请输入手机号码" v-model.trim="phoneval"></div>
        <div class="pd-15 bgc border-b flex-jc-between">
            <input type="text" placeholder="请输入验证码" v-model.trim="codeval">
            <div class="send" @click="countDown">{{content}}</div>
        </div>

        <div class="pd-15">
            <button class="btn text-c" @click="submit">确定</button>
        </div>
    </div>
</template>

<script>
import { Toast,Dialog } from "vant";
export default {
    data(){
        return {
            idcardval: '',
            phoneval: '',
            codeval:'',
            content: "获取验证码",
            totalTime: 59, //倒计时
            canClick: true
        }
    },
    methods:{
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
        submit(){
            if(this.idcardval == ''){
                Toast("请输入身份证号码");
                return;
            }
            if(!(/^1(3|4|5|7|8)\d{9}$/.test(this.phoneval))){ 
                Toast("手机号格式不正确");
                return;
            }
            if(this.codeval == ''){
                Toast("请输入验证码");
                return;
            }
            
            Toast.loading({ mask: true, message: "加载中..." });
            let postData = this.$qs.stringify({
                users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
                users_phone: this.phoneval,
                idcard_number: this.idcardval,
                yzm: this.codeval
            });
            this.axios
            .post(this.API + "api/Order/UntyingOCR", postData)
            .then(res => {
                console.log(res.data, "submit");
                let resdata = res.data;
                if (resdata.code == 200) {
                    Toast.clear();
                    Dialog.alert({
                        message: '解绑成功'
                    }).then((e) => {
                        this.$router.go(-2);
                    });
                } else {
                    Toast.clear();
                    Toast(resdata.message||'操作失败');
                }
            });
        }
    }
}
</script>

<style scoped>
.btn{
    width: 100%;
    display:block;
    height: 42px;
    line-height: 42px;
    border-radius: 20px;
    color: #fff;
    background-image: linear-gradient(90deg, #2DBBF1 0%, #4EA9F9 100%);
}
.send {
    height: 25px;
    line-height: 25px;
    color: #fff;
    background-color: #4ea9f9;
    border-radius: 15px;
    padding: 0px 10px;
    font-size: 12px;
}
</style>
