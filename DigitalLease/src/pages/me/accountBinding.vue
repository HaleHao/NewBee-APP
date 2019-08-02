<template>
    <div>
       <div class="flex-jc-between pd-15 border-b bgc" >
            <div>微信</div>
            <div class="flex-align-items fc-grey" v-show="userinfo!=''">
                <span class="fc-blue mr" v-if="userinfo.user_wx==0" @click="gowx">去绑定</span>
                <span class="fc-grey mr" v-else>已绑定</span>
                <van-icon name="arrow" />
            </div>
        </div> 
        <div class="flex-jc-between pd-15 border-b bgc">
            <div>支付宝</div>
            <div class="flex-align-items fc-grey" v-show="userinfo!=''">
                <span class="fc-blue mr" v-if="userinfo.user_ali==0" @click="goali">去绑定</span>
                <span class="fc-grey mr" v-else>已绑定</span>
                <van-icon name="arrow" />
            </div>
        </div>
        <div class="flex-jc-between pd-15 border-b bgc" >
            <div>微博</div>
            <div class="flex-align-items fc-grey" v-show="userinfo!=''">
                <span class="fc-blue mr" v-if="userinfo.user_weibo==0" @click="gosina" >去绑定</span>
                <span class="fc-grey mr" v-else>已绑定</span>
                <van-icon name="arrow" />
            </div>
        </div>
    </div>
</template>

<script>
import { Toast,Dialog } from "vant";
export default {
    data(){
        return{
            userinfo:''
        }
    },
    created(){
        this.getinfo()
    },
    methods:{
        getinfo(){
            Toast.loading({ mask: true, message: "加载中..." });
            let postData = this.$qs.stringify({
                users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id
            });
            this.axios
                .post(this.API + "api/Order/GetThreeInfo", postData)
                .then(res => {
                console.log(res.data, "users_detail");
                let resdata = res.data;
                if (resdata.code == 200) {
                    Toast.clear();
                    window.localStorage.setItem("userinfo", JSON.stringify(resdata.data));
                    this.userinfo = resdata.data
                } else {
                    Toast.clear();
                    Toast(resdata.message||'操作失败');
                }
                });
        },
        goali(){
            Toast.loading({ mask: true, message: "加载中..." });
            let postData = this.$qs.stringify({
                users_id:'',
                auth_code: '',
                state: ''
            });
            this.axios.post(this.API + "api/Order/aliLogin",postData).then(res => {
                console.log(res.data, "getaliToken");
                let resdata = res.data;
                if (resdata.code == 200) {
                Toast.clear();

                let url = resdata.data.url 
                    Dialog.confirm({
                    message: '是否进行支付宝授权'
                    }).then(() => {
                    window.location.href = `alipays://platformapi/startapp?appId=20000067&url=${url}`
                    }).catch(() => {
                    // on cancel
                    });
                } else {
                Toast.clear();
                Toast(resdata.message||'操作失败');
                }
            })
            .catch(error => {
                Toast.clear();
                Toast('网络出错')
            });
        },
        gosina(){
            Toast.loading({ mask: true, message: "加载中..." });
            this.axios.post(this.API + "api/Order/Getweibo").then(res => {
                console.log(res.data, "gosina");
                let resdata = res.data;
                if (resdata.code == 200) {
                Toast.clear();

                Dialog.confirm({
                    message: '是否进行新浪授权'
                    }).then(() => {
                    window.location.href = resdata.data
                    }).catch(() => {
                    // on cancel
                    });
                } else {
                Toast.clear();
                Toast(resdata.message||'操作失败');
                }
            })
            .catch(error => {
                Toast.clear();
                Toast('网络出错')
            });
        },
        gowx(){
            Toast.loading({ mask: true, message: "加载中..." });
            this.axios.post(this.API + "api/Order/GetCodeUrl").then(res => {
                console.log(res.data, "gowx");
                let resdata = res.data;
                if (resdata.code == 200) {
                Toast.clear();

                Dialog.confirm({
                    message: '是否进行微信授权'
                    }).then(() => {
                    window.location.href = `${resdata.data}`
                    }).catch(() => {
                    // on cancel
                    });
                } else {
                Toast.clear();
                Toast(resdata.message||'操作失败');
                }
            })
            .catch(error => {
                Toast.clear();
                Toast('网络出错')
            });
        }
    }
};
</script>

<style scoped>
.box {
  margin: 15px;
  border-radius: 10px;
  overflow: hidden;
}
</style>
