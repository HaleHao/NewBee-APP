<template>
    <div>
        <div class="bgc pd-15">选择退租方式</div>
        <div class="nav bgc">
            <div :class="{ 'fc-blue selected': selected==0 }" @click="selected=0">自还</div>
            <div :class="{ 'fc-blue selected': selected==1 }" @click="selected=1">快递</div>
            <div :class="{ 'fc-blue selected': selected==2 }" @click="selected=2">配送</div>
        </div>

        <div v-show="selected==0">
            <div class="choose bgc flex-jc-around pd-15">
                <div class="border" :class="{ 'fc-blue border-blue': typenum==0 }" @click="typenum=0">本人</div>
                <div class="border" :class="{ 'fc-blue border-blue': typenum==1 }" @click="typenum=1">朋友代还</div>
            </div>
            <div class="text-c tip">温馨提示:选择朋友代还您需要发送给朋友打开才能还</div>

            <div class="pd-t-100"><div class="btn text-c" @click="oneself">确定</div></div>
        </div>

        <div v-show="selected==1">
            <div class="btn-pd"><div class="btn1 text-c" @click="go('/appointmentExpress/'+orderid)">快捷预约顺丰上门取件入口</div></div>
            <div class="btn-pd"><div class="btn2 text-c" @click="go('/sendBack/'+orderid)">自行寄回</div></div>
        </div>

        <div v-show="selected==2">
            <van-cell title="选择退租时间" is-link center :value="datetext" @click="go('/calendar/refund')"></van-cell>  
            <van-cell title="时间段" is-link center @click="showtimequantum=true" :value="timequantumtext"></van-cell>  
            <van-cell is-link center :border="false" @click="go('/addresslist/refund')">
                <template slot="title">
                    <div>收货地址</div>
                    <div>{{getaddress.ads_user||''}}  {{getaddress.ads_phone||''}} <van-tag plain v-if="getaddress.ads_state==2">默认</van-tag></div>
                    <div>{{(getaddress.ads_province||'')+(getaddress.ads_city||'')+(getaddress.ads_district||'')+(getaddress.ads_address||'')}}</div>
                </template>
            </van-cell>
            <div class="pd-t-100"><div class="btn text-c" @click="platform">提交</div></div>
        </div>

        <van-popup v-model="showcode">
            <div style="font-size:0"><img :src="codeimg" alt="" class="codeimg"></div>
        </van-popup>
        <van-popup v-model="showtimequantum" position="bottom" :close-on-click-overlay="false">
            <van-picker :columns="timequantumarr" show-toolbar @cancel="showtimequantum = false" @confirm="onConfirmTimequantum"/>
        </van-popup>
        <Clipboard v-model="iscopy" :text="link"/>
    </div>
</template>

<script>
import { Toast,Dialog } from 'vant';
import Clipboard from "@/components/Clipboard";
import { isWeiXin } from "@/utils/util.js";
const nativeshare = () => import ('nativeshare') 
var NativeShare

export default {
    components: {
        Clipboard
    },
    data(){
        return{
            orderid: this.$route.params.id,
            selected:0,
            typenum:0,
            datetext:'',
            getaddress:'',
            // numval:'',
            showcode:false,
            codeimg:'',
            timequantumtext:'', //时间段
            showtimequantum: false, //时间段
            timequantumarr:[], //时间段

            iscopy:false,
            link:''
        }
    },
    created() {
        let refundSession = JSON.parse(window.sessionStorage.getItem("refundSession"));
        if(refundSession){
            this.selected = refundSession.backtype
            this.datetext = refundSession.backdate
            this.timequantumtext = refundSession.timequantumtext
            this.getaddress = refundSession.getaddress
        }else{
            this.getdefaultaddress()
        }
    },
    mounted(){
        nativeshare().then(res =>  {NativeShare = res.default} )

        this.gettimequantumarr()
    },
    methods:{
        go(url){
            let refundSession = {
                backtype: String(this.selected),
                backdate: this.datetext,
                timequantumtext: this.timequantumtext,
                getaddress:this.getaddress,
            }
            window.sessionStorage.setItem("refundSession", JSON.stringify(refundSession));
            this.$router.push({ path: url });
        },

        getdefaultaddress(){
            let postData = this.$qs.stringify({
                users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
            })
            this.axios.post(this.API + "api/Lease/ads_select",postData)
            .then(res => {
                console.log(res.data, "address")
                let resdata = res.data
                if (resdata.code == 200) {
                    for(let v of resdata.data){
                        if(v.ads_state==2){
                            this.getaddress = v
                        }
                    }
                } else {
                    // Toast(resdata.message)
                }
            });
        },
        onConfirmTimequantum(value,index){
            console.log(`当前值：${value}, 当前索引：${index}`);
            let newdate = new Date()
            if(this.datetext == `${newdate.getFullYear()}/${newdate.getMonth() + 1}/${newdate.getDate()}`){
                let end = value.split('-')[1].split(':')[0]
                //+1小时
                newdate = new Date().getTime() + 1000*60*60
                newdate = new Date(newdate)
                let newhours = newdate.getHours()
                if(newhours >= end){
                Toast("不在配送时间段")
                this.timequantumtext = ''
                return
                }
            }
            this.timequantumtext = value
            this.showtimequantum = false
        },
        gettimequantumarr(){
            this.axios.post(this.API + "api/Lease_Order/getSFTime")
            .then(res => {
                console.log(res.data, "timequantum")
                let resdata = res.data
                if (resdata.code == 200) {
                    let arr = []
                    for(let v of resdata.data){
                        arr.push(v[0])  
                    }
                    this.timequantumarr = arr
                } else {
                    Toast(resdata.message)
                }
            });
        },
        //自还
        oneself(){
            if(this.typenum==0){
                Toast.loading({ mask: true,message: '加载中...'})
                let postData = this.$qs.stringify({
                    users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
                    order_id:this.$route.params.id,
                    way: 2
                });
                this.axios.post(this.API + "api/Lease_Order/pickupCode", postData)
                .then(res => {
                console.log(res.data, "code");
                let resdata = res.data;
                if (resdata.code == 200) {
                    Toast.clear()
                    this.codeimg = resdata.data
                    this.showcode = true
                } else {
                    Toast.clear()
                    Toast(resdata.message||'操作失败');
                }
                });
            }

            if(this.typenum==1){
                this.call()
            }
        },
        //平台
        platform(){
            if(this.datetext==''||this.timequantumtext==''||!this.getaddress.ads_id){
                Toast('还有未填写')
                return
            }

            let newdate = new Date()
            if(this.datetext == `${newdate.getFullYear()}/${newdate.getMonth() + 1}/${newdate.getDate()}`){
                let end = this.timequantumtext.split('-')[1].split(':')[0]
                //+1小时
                newdate = new Date().getTime() + 1000*60*60
                newdate = new Date(newdate)
                let newhours = newdate.getHours()
                if(newhours >= end){
                Toast("不在配送时间段")
                this.timequantumtext = ''
                return
                }
            }

            Toast.loading({ mask: true,message: '加载中...'})
            let postData = this.$qs.stringify({
                order_id:this.$route.params.id,
                year: this.datetext,
                time:this.timequantumtext,
                ads_id:this.getaddress.ads_id
            });
            this.axios.post(this.API + "api/Lease_Order/delivery", postData)
            .then(res => {
            console.log(res.data, "platform");
            let resdata = res.data;
            if (resdata.code == 200) {
                Toast.clear()
                Dialog.alert({
                    message: '操作成功'
                }).then((e) => {
                    this.$router.go(-1);
                });
            } else {
                Toast.clear()
                Toast(resdata.message||'操作失败');
            }
            });
        },

        call(){
            let config = {
                title: '数码租赁',
                link: window.location.origin + `#/friendRepay?orderid=${this.$route.params.id}&userid=${JSON.parse(window.localStorage.getItem("userinfo")).users_id||''}`,
                desc:'朋友代还'
            }
            if(isWeiXin()){
                this.link = config.link,
                this.iscopy=true
                Toast('请重试或点击复制链接分享给好友')
                return
            }
            let shareData = {  //nativeShare的参数模型
                title: config.title,
                desc: config.desc,
                // 如果是微信该link的域名必须要在微信后台配置的安全域名之内的。
                link: config.link,
                icon: '',
            }

            let nativeShare = new NativeShare()
            nativeShare.setShareData(shareData)
            try {
                nativeShare.call('wechatFriend')
            } catch(e) {
                let Browser = navigator.userAgent;
                if(Browser.indexOf('QQBrowser') > -1){
                
                }else{
                    this.link = config.link,
                    this.iscopy=true
                    Toast('请重试或点击复制链接分享给好友')
                }
            }
        },
    }
}
</script>

<style scoped>
.btn-pd{
    padding: 0 15px;
    padding-top: 60px;
}
.pdl{
    padding-left: 10px
}
.tip{
    font-size: 10px;
    color: #666;
    padding-top: 15px;
}
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
.nav {
    padding: 15px;
}
.nav > div {
  width: 80px;
  height: 30px;
  line-height: 30px;
  /* color: #666; */
  display: inline-block;
  box-shadow: 0 1px 7px 1px #E8E9EA;
  /* margin-left: 10px; */
  border-radius: 20px;
  text-align: center;
  box-sizing: border-box;
  font-size: 13px;
  margin-right: 10px;
}
.nav .selected {
    box-shadow: 0 1px 7px 1px #DEF4FD;
}

.choose > div{
    width: 112px;
  height: 32px;
  line-height: 32px;
  /* color: #666; */
  display: inline-block;
  border-radius: 5px;
  text-align: center;
}

.btn1{
    background-color: #B49A7A;
    height: 42px;
    line-height: 42px;
    border-radius: 20px;
    color: #fff;
}
.btn2{
    background-color: #BBBBBB;
    height: 42px;
    line-height: 42px;
    border-radius: 20px;
    color: #fff;
}

</style>
