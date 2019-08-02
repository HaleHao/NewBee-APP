<template>
    <div>
        <div class="pd-15 bgc border-b flex-jc-between">
            <span>姓名</span>
            <span>{{info.realname}}</span>
        </div>
        <div class="pd-15 bgc border-b flex-jc-between">
            <span>身份证号</span>
            <span>{{info.idcard_number}}</span>
        </div>
        <div class="pd-15 bgc border-b flex-jc-between">
            <span>签发机关</span>
            <span>{{info.issued_by}}</span>
        </div>
        <div class="pd-15 bgc flex-jc-between">
            <span>有效期限</span>
            <span>{{info.valid_date}}</span>
        </div>

        <div class="pd-15">
            <router-link to="/realnameUnbundling">
                <div class="btn bgc-red text-c">解绑</div>
            </router-link>
        </div>
    </div>
</template>

<script>
import { Toast } from "vant";
export default {
    data(){
        return{
            info:''
        }
    },
    mounted(){
        this.getinfo()
    },
    methods:{
        getinfo(){
            Toast.loading({ mask: true,message: '加载中...'})
            let postData = this.$qs.stringify({
                users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
            })

            this.axios.post(this.API + "api/Order/GetIDCard",postData)
            .then(res => {
                console.log(res.data, "info")
                let resdata = res.data
                if (resdata.code == 200) {
                    Toast.clear()
                    this.info = resdata.data
                } else {
                    Toast.clear()
                    Toast(resdata.message)
                }
            })
        },

    }
}
</script>

<style scoped>
.btn{
    height: 42px;
    line-height: 42px;
    border-radius: 20px;
    color: #fff;
}
</style>
