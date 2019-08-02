<template>
<div>
    <div class="bgc card pd-15 mar-b-10">
        <router-link v-bind="url">
            <div class="flex-jc-between border-b mar-b-10 pb10" >
                <span>订单号:<span class="fsz12">{{data.order_no}}</span></span>
                <span class="fc-blue" v-if="data.order_status==6">租赁中</span>
                <span class="fc-blue" v-if="data.order_status==4">订单关闭</span>
                <span class="fc-blue" v-if="data.order_status==8">检测中</span>
                <span class="fc-blue" v-if="(data.order_status==9&&data.user_validation==0)||(data.order_status==9&&!data.user_validation)">售后中</span>
                <span class="fc-blue" v-if="data.order_status==9&&data.user_validation==1&&data.maintenance_pay==0&&data.service_money&&data.service_money>0">待确认</span>
                <span class="fc-blue" v-if="data.order_status==1">待付款</span>
                <span class="fc-blue" v-if="data.order_status==5">待收货</span>
                <span class="fc-blue" v-if="data.order_status==2">预租中</span>
                <span class="fc-blue" v-if="data.order_status==9&&data.maintenance_pay==1">退租中</span>
                <span class="fc-blue" v-if="data.order_status==12&&data.backstage!='未审批'">待发货</span>
                <span class="fc-blue" v-if="data.order_status==12&&data.backstage=='未审批'">取消中</span>
                <span class="fc-blue" v-if="data.order_status==11">已完成</span>
            </div>
            <div class="flexbox">
                <img v-lazy="data.gd_img" class="goodsimg bgc-grey" >
                <div class="flex-1 right">
                    <div class="mar-b-10"><van-tag plain type="primary" v-if="data.giver_id">送礼</van-tag>{{data.goods_name}}</div>
                    <div class="spec mar-b-10"><span v-for="(item,index) in data.spec" :key="index">{{item[0]}}</span></div>
                    <div class="mar-b-10 fsz12 rental" v-if="isgetfriend">
                        <span>租金:￥{{data.rental}}</span>
                        <span>押金:￥{{data.order_rent}}</span>
                    </div>
                    <div>实付总额:<span class="fc-red">￥{{data.total_price}}</span></div>
                </div>
            </div>
            <div class="fc-red text-c overdue" v-if="active==4">
                <span>您的订单已超期{{data.day}}天!</span>
            </div>
            <!-- <div class="fc-red text-c overdue" v-if="status=='已预定'">
                <span>要支付完剩余费用后才能发货哦!</span>
            </div> -->
        </router-link>
        <div class="tools ">
            <slot></slot>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: ['data','active'],
    data(){
        return{
            
        }
    },
    computed:{
        url(){
            if(this.data.user_validation==1||this.data.user_validation==0){
                return {to: `/orderDetail/${this.data.order_id}?validation=${this.data.user_validation}&&maintenance_pay=${this.data.maintenance_pay}` }
            }else{
                return {to:`/orderDetail/${this.data.order_id}?active=${this.active}`}
            }    
        },
        isgetfriend(){
            if(this.data.giver_id){
                if(this.data.giver_id==JSON.parse(window.localStorage.getItem("userinfo")).users_id){
                    return true
                }else{
                    return false
                }
            }else{  
                return true
            }
        }
    },
    methods:{
        
    }
}
</script>

<style scoped>
    .pb10{
        padding-bottom:10px
    }
    .fsz12{
        font-size: 12px
    }

    .rental > span:nth-of-type(1){
        margin-right: 5px;
    }

    .card {
        border-radius: 8px;
    }
    .card .goodsimg {
        width: 80px;
        height: 80px;
    }
    .card .right{
        padding-left: 10px;
    }
    .card .spec > span{
        display: inline-block;
        background-color: #F2F1F1;
        font-size: 12px;
        padding: 1px 5px;
        box-sizing: border-box;
        border-radius: 3px;
        margin-right: 8px;
    }
    .card .tools{
        padding-top: 15px;
        display: flex;
        justify-content: flex-end;
    }
    .card .tools > div{
        /* display: inline-block; */
        height: 25px;
        min-width: 70px;
        border-radius: 20px;
        box-sizing: border-box;
        margin-left: 10px;
        font-size: 13px;
    }
    .overdue{
        height: 30px;
        line-height: 30px;
        background-color: #FFE5E5;
        margin-top: 10px;
        border-radius: 2px;
        font-size: 12px;
    }
</style>
