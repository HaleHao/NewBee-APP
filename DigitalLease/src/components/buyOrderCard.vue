<template>
<div>
    <div class="bgc card pd-15 mar-b-10">
        <router-link v-bind="{to:`/buyOrderDetail/${this.data.buyorder_id}?active=${this.active}`} ">
            <div class="flex-jc-between border-b mar-b-10 pb10" >
                <span>订单号:<span class="fsz12">{{data.buyorder_no}}</span></span>
                <span class="fc-blue" v-if="data.buyorder_status==1">待付款</span>
                <span class="fc-blue" v-if="data.buyorder_status==2||data.buyorder_status==3">待发货</span>
                <span class="fc-blue" v-if="data.buyorder_status==4">待收货</span>
                <span class="fc-blue" v-if="data.buyorder_status==6">已完成</span>
                <span class="fc-blue" v-if="data.buyorder_status==5">待评价</span>
            </div>
            <div class="flexbox">
                <!-- <img :src="data.gd_img" alt="" class="goodsimg bgc-grey" > -->
                <img v-lazy="data.gd_img" class="goodsimg bgc-grey" >
                <div class="flex-1 right">
                    <div class="mar-b-10">{{data.goods_name}}</div>
                    <div class="spec mar-b-10"><span v-for="(item,index) in data.spec" :key="index">{{item[0]}}</span></div>
                    <div>实付总额:<span class="fc-red">￥{{data.total_price}}</span></div>
                </div>
            </div>
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
