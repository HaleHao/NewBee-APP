<template>
    <div class="full bgc">
        <div class="box text-c">
            <img
                :src="codeimg"
                alt="QRcode"
                class="codeimg"
            >
            <p class="fsz-12">请出示此二维码供门店扫码</p>
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant';

export default {
    data(){
        return{
            codeimg:''
        }
    },
    mounted() {
        this.getcode()
    },
    methods:{
        getcode(){
            Toast.loading({ mask: true,message: '加载中...',duration:0})
            let postData = this.$qs.stringify({
                users_id: this.$route.query.userid,
                order_id: this.$route.query.orderid,
                way: 2
            });
            this.axios.post(this.API + "api/Lease_Order/pickupCode", postData)
            .then(res => {
            console.log(res.data, "code");
            let resdata = res.data;
            if (resdata.code == 200) {
                Toast.clear()
                this.codeimg = resdata.data
            } else {
                Toast.clear()
                Toast(resdata.message||'获取失败');
            }
            })
            .catch(error => {
                Toast.clear();
                Toast('网络出错')
            });
        }
    }
}
</script>

<style scoped>
.box {
    padding-top: 50px;
}
.codeimg {
  width: 200px;
  height: 200px;
  margin-bottom:20px;
  background-color: #F3F3F3
}
</style>
