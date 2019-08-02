<template>
    <div class="bgc full pd-lr-15" :style="bgimg">
        <div class="box">
            <div class="fc-blue text-c title marb10">{{info.activity_title}}</div>
            <div class="fc-grey text-c fsz-12 marb10">{{info.activity_start_time}}~{{info.activity_end_time}}</div>
            <div class="text-c marb10">当前参加人数<span class="fc-red"> {{people||0}}</span></div>
            <div class="btn flex-column-center bgc-blue" @click="friend">
                <span>好友助力</span>
            </div>
            <div class="text-c fsz-12 marb10 fc-grey">好友可获得一次抢红包机会</div>
            <div class="fc-grey fsz-12">活动说明：{{info.activity_description}}</div>
        </div>
    </div>
</template>

<script>
import { Toast,Dialog } from "vant";
export default {
    data(){
        return {
            bgimg: {
                background:
                "url(" + require("@/assets/redpacket/bg.png") + ") no-repeat top",
                backgroundSize: "100% 100%"
            },
            info:'',
            people:''
        }
    },
    beforeCreate(){
        if (!window.localStorage.getItem("userinfo")) {
            window.sessionStorage.setItem("rpfriend",1);
            Dialog.alert({
                message: '请先登录'
            }).then((e) => {
                // this.$router.replace({ path: "/login?rpfriend=1" })
                window.location.href = window.location.origin + "#/login?rpfriend=1"
            });
        }
    },
    created(){
        this.getad()
    },
    methods:{
        getad(){
            Toast.loading({ mask: true,message: '加载中...'})
            this.axios.post(this.API + "api/Redpacket/getRedpacket").then(res => {
                console.log(res.data, "ad");
                let resdata = res.data;
                if (resdata.code == 200) {
                    Toast.clear()
                   this.info = resdata.data
                   this.getpeople(resdata.data.activity_title)
                } else {
                    Toast.clear()
                    this.isad = false
                    // Toast(resdata.msg);
                    Dialog.alert({
                        message: resdata.msg,
                        showConfirmButton: false
                    })
                }
            });
        },
        getpeople(title){
            let postData = this.$qs.stringify({
                activity_title: title
            });
            this.axios.post(this.API + "api/Redpacket/countUsers",postData)
            .then(res => {
                console.log(res.data, "people");
                let resdata = res.data;
                if (resdata.code == 200) {
                    this.people = resdata.data
                } else {
                    Toast(resdata.message);
                }
            });
        },

        friend(){
            Toast.loading({ mask: true,message: '加载中...'})
            let postData = this.$qs.stringify({
                users_id: this.$route.query.friendid||'',
                friend_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id
            });
            this.axios.post(this.API + "api/Redpacket/friendHelp",postData)
            .then(res => {
                console.log(res.data, "friend");
                let resdata = res.data;
                if (resdata.code == 200) {
                    Toast.clear()
                    // Toast(resdata.message);
                    Dialog.alert({
                        message: resdata.message,
                    })
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
}
</script>

<style scoped>
.marb10 {
    margin-bottom: 10px;
}
.box {
    background-color: rgba(255,255,255,.9);
    box-shadow:0px 0px 87px 0px rgba(173,198,238,0.68);
    border-radius: 10px;
    position: relative;
    top: 160px;
    box-sizing: border-box;
    padding: 10px;
}
.title {
    color: #1979F4;
    font-size: 16px;
    font-weight: bold;
    letter-spacing:8px;
}
.btn {
    height: 40px;
    color: #fff;
    border-radius: 30px;
    margin: 15px;
    margin-bottom: 5px;
    box-shadow: 0px 1px 10px 0px rgba(173,198,238,0.68);
    /* letter-spacing:8px; */
}
</style>
