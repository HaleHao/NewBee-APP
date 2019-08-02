<template>
    <div>
        <div class="border-b"><van-cell title="选择退租时间" is-link center :value="datetext" @click="go('/calendar/refund')" :border="false"></van-cell></div> 
        <div class="mar-b-10">
        <van-cell center :border="false">
            <div class="bgc flex-align-items" slot="title">
                <span>快递单号</span>
                <input type="text" placeholder="请输入(必须是顺丰)" class="pdl" v-model.trim="numval">
            </div>
        </van-cell>  
        </div> 

        <div class="address bgc flex-align-items pd-15">
            <div class="left bgc-blue flex-center">收</div>
            <div class="flex-1">
                <div v-show="shopaddress==''" class="fc-grey">暂无收货地址</div>
                <div class="mar-b-10">{{shopaddress.store_name}} {{shopaddress.store_phone}}</div>
                <div>{{(shopaddress.store_partners||'')+(shopaddress.store_city||'')+(shopaddress.store_district||'')+(shopaddress.store_Address||'')}}</div>
            </div>
        </div>

        <div class="pd-t-100"><div class="btn text-c" @click="express">确定</div></div>  
    </div>
</template>

<script>
import { Toast,Dialog } from 'vant';
export default {
    data(){
        return{
            datetext:'',
            numval:'',
            shopaddress:'',
        }
    },
    created() {
        let refundSession = JSON.parse(window.sessionStorage.getItem("refundSession"));
        if(refundSession){
            this.datetext = refundSession.backdate
            this.numval = refundSession.numval
        }
    },
    mounted(){
        this.getdefaultshop()
    },
    methods:{
        go(url){
            let refundSession = JSON.parse(window.sessionStorage.getItem("refundSession"));
            refundSession.numval=this.numval
            refundSession.backdate=this.datetext,
            window.sessionStorage.setItem("refundSession", JSON.stringify(refundSession));
            this.$router.push({ path: url });
        },
        //快递
        express(){
            if(this.datetext==''||this.numval==''){
                Toast('还有未填写')
                return
            }

            Toast.loading({ mask: true,message: '加载中...'})
            let postData = this.$qs.stringify({
                order_id: this.$route.params.id,
                time: this.datetext,
                express_no: this.numval
            });
            this.axios.post(this.API + "api/Lease_Order/surrender", postData)
            .then(res => {
            console.log(res.data, "express");
            let resdata = res.data;
            if (resdata.code == 200) {
                Toast.clear()
                Dialog.alert({
                    message: '操作成功'
                }).then((e) => {
                    this.$router.go(-2);
                });
            } else {
                Toast.clear()
                Toast(resdata.message||'操作失败');
            }
            });
        },

        getdefaultshop(){
            let postData = this.$qs.stringify({
                order_id: this.$route.params.id
            })
            this.axios.post(this.API + "api/Lease_Order/getStore",postData)
            .then(res => {
                console.log(res.data, "shop")
                let resdata = res.data
                if (resdata.code == 200) {
                    this.shopaddress = resdata.data
                } else {
                    Toast(resdata.message)
                }
            });
        },
    }
}
</script>

<style scoped>
.pd-t-100{
    padding: 0 15px;
    padding-top: 100px;
}
.btn{
    height: 42px;
    line-height: 42px;
    border-radius: 20px;
    color: #fff;
    background-image: linear-gradient(90deg, #2DBBF1 0%, #4EA9F9 100%);
}

.address .left{
    width: 32px;
    height: 32px;
    color: #fff;
    border-radius: 50%;
    margin-right: 15px;
}
</style>
