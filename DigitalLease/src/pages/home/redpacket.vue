<template>
    <div class="bgc full pd-lr-15 page" :style="bgimg">
        <div class="notice" v-if="text!=''&&text&&info.prize_speech==1">
            <van-notice-bar color="#fff">
                <pre>{{text}}</pre>
            </van-notice-bar>
        </div>

        <div class="box">
            <div class="fc-blue text-c title marb10">{{info.activity_title}}</div>
            <div class="fc-grey text-c fsz-12 marb10">{{info.activity_start_time}}~{{info.activity_end_time}}</div>
            <div class="text-c marb10" v-if="info.number_participants==1">当前参加人数<span class="fc-red"> {{people||0}}</span></div>
            
            <div class="btn flex-column-center bgc-grey" v-if="numinfo.number==0&&numinfo.friends_help==1">
                抢红包
            </div>
            <template v-else>
                <div class="btn flex-column-center bgc-blue" v-if="numinfo.number==0&&numinfo.friends_help==0&&info.friend_help==1" @click="call">
                    <div>邀请好友助力</div>
                    <div class="fszs">(可获得一次抢红包机会)</div>
                </div>
                <div class="btn flex-column-center bgc-blue" v-else @click="getred">
                    抢红包
                </div>
            </template>
            
            <div class="text-c fsz-12 marb10" v-if="numinfo.number||numinfo.number==0">可抢红包次数{{numinfo.number||0}}</div>
            <div class="fc-grey fsz-12">活动说明：{{info.activity_description}}</div>
        </div>

        <van-popup v-model="show" :close-on-click-overlay="false">
            <div class="bgc model position">
                <img src="@/assets/redpacket/icon-close.png" alt="关闭" class="iconclose" @click="show=false">
                <div class="imgbox marb10 text-c"><img src="@/assets/redpacket/scu.png" class="img" style="object-fit:contain"></div>
                <div class="text-c marb10">恭喜获得{{winning.type==3?'':winning.number}}{{winning.type==1?'元':winning.type==2?'积分':winning.type==3?'优惠券':''}}</div>
                <div class="fc-grey text-c fsz-12 marb10">可在个人中心查看</div>
                <div class="flex-jc-center">
                    <router-link to="/me" replace><div class="confirm flex-center">确认</div></router-link>
                </div>
            </div>
        </van-popup>

        <div class="banner full bgc position" v-if="isad">
            <div class="ad" @click="isad=false">
                <img src="@/assets/redpacket/icon-close.png" alt="关闭" class="closeimg">
            </div>
            <img :src="ad.adimg" alt="广告" style="object-fit:contain" @click="go">
        </div>

        <Clipboard v-model="iscopy" :text="link"/>
    </div>
</template>

<script>
import Clipboard from "@/components/Clipboard";
import { Toast,Dialog } from "vant";
import { isWeiXin } from "@/utils/util.js";
const nativeshare = () => import ('nativeshare') 
var NativeShare

export default {
    components: {
        Clipboard
    },
    data(){
        return {
            bgimg: {
                background:
                "url(" + require("@/assets/redpacket/bg.png") + ") no-repeat top",
                backgroundSize: "100% 100%"
            },
            text: '',
            isad: false,
            ad: {adimg:'',adpath:''},
            show: false,
            info:'',
            people: 0,
            winning:'',
            numinfo:'',

            iscopy:false,
            link:''
        }
    },
    created(){
        this.getad()
    },
    mounted(){
        nativeshare().then(res =>  {NativeShare = res.default} )

        this.getnum()
    },
    methods:{
        go(){
            if(this.ad.adpath!=''){
                window.location.href = this.ad.adpath
            }
        },
        getred(){
            Toast.loading({ mask: true,message: '加载中...',duration:0})
            let postData = this.$qs.stringify({
                users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
                activity_title: this.info.activity_title
            });
            this.axios.post(this.API + "api/Redpacket/redwars",postData)
            .then(res => {
                console.log(res.data, "getred");
                let resdata = res.data;
                if (resdata.code == 200) {
                    Toast.clear()
                    this.winning = resdata.data
                    if(resdata.data.type == 3){
                        this.receive(resdata.data.number)
                        this.getnum()
                    }else {
                        this.getnum()
                        this.show = true
                    }
                } else {
                    Toast.clear()
                    this.getnum()
                    Toast(resdata.message);
                }
            })
            .catch(error => {
                Toast.clear()
                Toast('网络出错')
            });
        },
        //if优惠卷,领取
        receive(id){
            Toast.loading({ mask: true, message: "加载中..." });
            let postData = this.$qs.stringify({
                user_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
                coupons_id: id,
                activity_id: 0
            });
            this.axios
            .post(this.API + "api/Lease/Receive_coupon", postData)
            .then(res => {
                console.log(res.data, "getcoupons");
                let resdata = res.data;
                if (resdata.code == 200) {
                    Toast.clear()
                    this.show = true
                } else {
                    Toast.clear();
                    Toast(resdata.message);
                }
            })
            .catch(error => {
                Toast('网络出错')
            });
        },
        getad(){
            Toast.loading({ mask: true,message: '加载中...'})
            this.axios.post(this.API + "api/Redpacket/getRedpacket").then(res => {
                console.log(res.data, "ad");
                let resdata = res.data;
                if (resdata.code == 200) {
                    Toast.clear()
                   this.isad = resdata.data.screen_advertis==1?true:false
                   this.ad.adimg = resdata.data.ad_image
                   this.ad.adpath = resdata.data.ad_path
                   this.info = resdata.data
                   this.getpeople(resdata.data.activity_title)
                   this.getnotice(resdata.data.activity_title)
                } else {
                    Toast.clear()
                    this.isad = false
                    // Toast(resdata.msg);
                    Dialog.alert({
                        message: resdata.msg
                    }).then((e) => {
                       this.$router.go(-1);
                    });
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
                    // Toast(resdata.message);
                }
            });
        },
        //剩余次数
        getnum(){
            let postData = this.$qs.stringify({
                users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
            });
            this.axios.post(this.API + "api/Redpacket/getUserNumber",postData)
            .then(res => {
                console.log(res.data, "num");
                let resdata = res.data;
                if (resdata.code == 200) {
                    if(resdata.data){
                        this.numinfo  = resdata.data
                    }else{
                        this.numinfo = {
                            friends_help:null,
                            number:null,
                            winning_number:null
                        }
                    }
                } else {
                    // Toast(resdata.message);
                }
            });
        },
        getnotice(title){
            let postData = this.$qs.stringify({
                activity_title: title
            });
            this.axios.post(this.API + "api/Redpacket/winningInformation",postData)
            .then(res => {
                console.log(res.data, "notice");
                let resdata = res.data;
                if (resdata.code == 200) {
                    let arr = []
                    for(let v of resdata.data){
                        let type = v.prize==1?'元':v.prize==2?'积分':v.prize==3?'优惠券':''
                        arr.push(`恭喜${v.users_phone}用户获得${type=='优惠券'?'':v.prize_name}${type}。          `)
                    }
                    this.text = arr.join(' ')
                } else {
                    // Toast(resdata.message);
                }
            });
        },

        call(){
            let config = {
                title: '数码租赁',
                link: window.location.origin + '#/rpfriend?friendid='+(JSON.parse(window.localStorage.getItem("userinfo")).users_id||''),
                desc:'好友助力'
            }
            if(isWeiXin()){
                this.link = config.link,
                this.iscopy=true
                Toast('请重试或点击复制链接分享给好友')
                return
            }
            let shareData = { 
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
        }
    }
}
</script>

<style scoped>
.notice {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}
.notice >>> .van-notice-bar {
    background-color: rgba(0,0,0,.5);
}

.marb10 {
    margin-bottom: 10px;
}
.fszs {
    font-size: 10px
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
.banner {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
}
.banner .ad {
    position: absolute;
    top: 0px;
    right: 0px;
    padding: 5px;
}
.banner .closeimg {
    width: 25px;
    height: 25px;
}

.page >>> .van-popup {
    border-radius: 10px;
}
.model {
    box-sizing: border-box;
    width: 280px;
    height: 320px;
}
.model .confirm {
    height: 35px;
    width: 150px;
    color: #fff;
    border-radius: 30px;
    background-image: linear-gradient(180deg, #FB7C26 0%, #ED5533 100%);
}
.model .img {
    width: 250px;
    height: 200px;
}
.model .imgbox {
    font-size: 0;
}
.model .iconclose {
    width: 15px;
    height: 15px;
    position: absolute;
    top: 0;
    right: 0;
    padding: 5px;
}
</style>
