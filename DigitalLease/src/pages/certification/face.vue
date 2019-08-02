<template>
    <div>

    </div>
</template>

<script>
import { Toast } from 'vant';
export default {
    created(){
        this.getFaceToken()
    },
    methods:{
        getFaceToken(){
            Toast.loading({ mask: true, message: "加载中...",duration:0 });
            let postData = this.$qs.stringify({
                users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
                order_id : this.$route.params.orderid
            });
            this.axios.post(this.API + "api/Order/GetFaceToken", postData)
            .then(res => {
                console.log(res.data, "token");
                let resdata = res.data;
                if (resdata.code == 200) {
                    Toast.clear();
                   this.goFace(resdata.data.token)
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
        goFace(token){
            if(token){
                window.location.href = 'https://api.megvii.com/faceid/lite/do?token='+token
            }
        },
    }
}
</script>
