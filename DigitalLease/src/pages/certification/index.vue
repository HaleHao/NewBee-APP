<template>
  <div class="page bgc">
    <header class="pd-15">
      <div class="header">
        <div class="text-c">我的额度</div>
        <div class="text-c">{{users_money}}</div>
      </div>
    </header>

    <div class="pd-15 rz-style">认证免押金方式</div>
    <router-link class="flex-jc-between pd-15 border-b" :to="realname==0?'/realname':'/realnameSuc'">
      <div>实名认证</div>
      <div class="flex-align-items">
        <span class="fc-blue mr" v-if="realname==0">去认证</span>
        <span class="fc-grey mr" v-else>已认证</span>
        <van-icon name="arrow"/>
      </div>
    </router-link>
    <div class="flex-jc-between pd-15 border-b" @click="getgo" v-if="school==1">
      <div>学籍认证</div>
      <div class="flex-align-items">
        <span class="fc-grey mr">已认证</span>
        <van-icon name="arrow"/>
      </div>
    </div>
    <div class="flex-jc-between pd-15 border-b" @click="getgo" v-else>
      <div>学籍认证</div>
      <div class="flex-align-items">
        <span class="fc-blue mr" >去认证</span>
        <van-icon name="arrow"/>
      </div>
    </div>
    <div class="flex-jc-between pd-15 border-b" @click="call">
      <div>邀请好友</div>
      <div class="flex-align-items">
        <van-icon name="arrow"/>
      </div>
    </div>
    <router-link class="flex-jc-between pd-15 border-b" to="/cpeople">
      <div>添加紧急联系人</div>
      <div class="flex-align-items">
        <van-icon name="arrow"/>
      </div>
    </router-link>
    <Clipboard v-model="iscopy" :text="link"/>
  </div>
</template>

<script>
import Clipboard from "@/components/Clipboard";
import { Toast } from 'vant';
import { isWeiXin } from "@/utils/util.js";
const nativeshare = () => import ('nativeshare') 
var NativeShare

export default {
  components: {
    Clipboard
  },
  data() {
    return {
      users_money: "",
      realname:'',
      school:'',
      iscopy:false,
      link:''
    };
  },
  mounted() {
    nativeshare().then(res =>  {NativeShare = res.default} )
    this.userprice();
  },
  methods: {
    userprice() {
      let userinfo = JSON.parse(window.localStorage.getItem("userinfo"));
      if (userinfo) {
        Toast.loading({ mask: true,message: '加载中...'})
        let postData = this.$qs.stringify({
          users_id: userinfo.users_id
        });
        this.axios
          .post(this.API + "api/Lease/user_price", postData)
          .then(res => {
            console.log(res.data, "user_price");
            let resdata = res.data;
            if (resdata.code == 200) {
              Toast.clear()
              this.users_money = resdata.data.users_money;
              this.realname = resdata.data.is_idcard //0未认证1已认证
              this.school = resdata.data.is_chsi //0未认证 1认证成功 2认证失败
            } else {
              Toast.clear()
              Toast(resdata.message);
            }
          });
      }
    },

    getgo() {
      Toast.loading({ mask: true, message: "加载中..." });
        let postData = this.$qs.stringify({
            users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
        });
        this.axios.post(this.API + "api/Order/GetCHISUrl", postData)
        .then(res => {
            console.log(res.data, "goschool");
            let resdata = res.data;
            if (resdata.code == 200) {
                window.location.href = resdata.data
            } else {
                Toast(resdata.message);
            }
        })
        .catch(error => {
            Toast('网络出错')
        });
    },

    call(){
      let config = {
        title: '数码租赁',
        link: window.location.origin + '#/login?token='+(JSON.parse(window.localStorage.getItem("userinfo")).users_id||''),
        desc:'邀请好友'
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
    }
  }
};
</script>

<style scoped>
.page{
  min-height: 100vh;
}
.mr {
  margin-right: 10px;
}
.header {
  height: 140px;
  background-image: linear-gradient(90deg, #5f99fd 0%, #2974f1 100%);
  border-radius: 5px;
  color: #fff;
}
.rz-style {
  background: #f6f6f6;
}
.header > div:nth-of-type(1) {
  padding-top: 30px;
}
.header > div:nth-of-type(2) {
  font-size: 30px;
  padding-top: 10px;
}
</style>
