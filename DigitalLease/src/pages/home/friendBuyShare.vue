<template>
    <div>
        <div class="bgc">
            <div class="pd-15">选择取货方式</div>
            <div class="nav bgc pd-lr-15">
                <div :class="{ 'fc-blue selected': typenum==0 }" @click="typenum=0">自取</div>
                <div :class="{ 'fc-blue selected': typenum==1 }" @click="typenum=1">快递</div>
                <div :class="{ 'fc-blue selected': typenum==2 }" @click="typenum=2">配送</div>
            </div>
        </div>

        <div class="main">
            <van-cell is-link center @click="go('/calendar/friendBuyShare')">
                <template slot="title">
                    <div>起租时间</div>
                    <div>{{date}}</div>
                </template>
            </van-cell>

            <van-cell center>
                <div slot="title" class="flex-align-items">
                <span>特殊需求备注</span>
                <input type="text" placeholder="请输入" v-model="remarkval" class="pdl10">
                </div>
            </van-cell>
        </div>

        <div class="pd-15">
            <div class="btn text-c" @click="submit">确认</div>
        </div>
        <p class="fsz-12 text-c fc-grey">说明:确认完并发送回送礼人，由送礼人完成支付</p>

        <Clipboard v-model="iscopy" :text="link"/>

        <DialogLogin v-model="showlogin"></DialogLogin>
    </div>
</template>

<script>
import { Toast,Dialog } from "vant";
import Clipboard from "@/components/Clipboard";
import DialogLogin from "@/components/DialogLogin";
import { isWeiXin } from "@/utils/util.js";
const nativeshare = () => import ('nativeshare') 
var NativeShare

export default {
    components: {
        Clipboard,
        DialogLogin
    },
    data(){
        return {
            typenum: 0,
            date:'',
            remarkval:'',
            iscopy:false,
            link:'',
            showlogin: false,
        }
    },
    created() {
        if (!window.localStorage.getItem("userinfo")) {
            this.showlogin = true
            return
        }
        let friendBuyShare = JSON.parse(window.sessionStorage.getItem("friendBuyShare"));
        if(friendBuyShare){
            this.typenum = friendBuyShare.typenum
            this.date = friendBuyShare.date
            this.remarkval = friendBuyShare.remarkval
        }
    },
    mounted() {
        nativeshare().then(res =>  {NativeShare = res.default} )
    },
    methods:{
        go(url){
            let friendBuyShare = {
                date: this.date,
                typenum: this.typenum,
                remarkval:this.remarkval,
            }
            window.sessionStorage.setItem("friendBuyShare", JSON.stringify(friendBuyShare));
            this.$router.push({ path: url });
        },
        submit(){
            if(this.date == ""){
                Toast("请选择起租时间")
                return
            }
            this.call()
        },
        call(){
            let obj = {
                typenum: this.typenum,
                date: this.date,
                remarkval:this.remarkval,
            }
            let url
            if(this.$route.query.guige){
                url = window.location.origin + `#/friendBuy?id=${this.$route.query.goodsid}&friendid=${JSON.parse(window.localStorage.getItem("userinfo")).users_id}&guige=${this.$route.query.guige}&data=${encodeURI(JSON.stringify(obj))}`
            }else{
                url = window.location.origin + `#/friendBuy?id=${this.$route.query.goodsid}&friendid=${JSON.parse(window.localStorage.getItem("userinfo")).users_id}&data=${encodeURI(JSON.stringify(obj))}`
            }
            let config = {
                title: '数码租赁',
                link: url,
                desc:'朋友填写完啦，快去完成订单吧'
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
.pdl10 {
  padding-left: 10px;
}
.nav {
  padding-bottom: 20px;
}
.nav > div {
  width: 80px;
  height: 30px;
  line-height: 30px;
  display: inline-block;
  box-shadow: 0 1px 7px 1px #e8e9ea;
  border-radius: 20px;
  text-align: center;
  box-sizing: border-box;
  font-size: 13px;
  margin-right: 10px;
}
.nav .selected {
  box-shadow: 0 1px 7px 1px #def4fd;
}

.btn {
  height: 42px;
  line-height: 42px;
  border-radius: 20px;
  color: #fff;
  background-image: linear-gradient(90deg, #2dbbf1 0%, #4ea9f9 100%);
}
</style>
