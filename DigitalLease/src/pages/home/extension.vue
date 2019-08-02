<template>
  <div class="divbox">
    <div class="bgc">
      <header class="pd10 box-sizing mar-b-10">
        <div class="trust_box text-c">
          <div class="flex-jc-around">
            <div class="text-c">
              <div class="grey_f">推广佣金</div>
              <div>
                <img class="yuan_img" src="../../assets/qian.png">
                <span class="money">{{info.PTC||0}}</span>
              </div>
            </div>
            <div class="text-c">
              <div class="grey_f">订单佣金</div>
              <div>
                <img class="yuan_img" src="../../assets/qian.png">
                <span class="money">{{info.POC||0}}</span>
              </div>
            </div>
            <div class="text-c">
              <div class="grey_f">未结算佣金</div>
              <div>
                <img class="yuan_img" src="../../assets/qian.png">
                <span class="money">{{info.OC||0}}</span>
              </div>
            </div>
          </div>
          <div class="grey_f padding_tb">总佣金</div>
          <div class="">
            <img class="all_img" src="../../assets/qicon.png">
            <span class="all_money">{{info.total||0}}</span>
          </div>
        </div>
      </header>

      <section class="pdlr10 mar-b-10" @click="call">
        <div class="tg_yq_box text-c">
          <div class="flex-jc-between tg_yq">
            <div class="flex-align-items">
              <div class="wode flex-center">
                <img src="../../assets/wode.png">
              </div>
              <div>
                <div class="yq">邀请好友</div>
                <div class="grey_f">去邀请</div>
              </div>
            </div>
            <div>
              <img class="img_r" src="../../assets/right.png">
            </div>
          </div>
        </div>
      </section>

      <section class="pdlr10" @click="getcode">
        <div class="tg_yq_box text-c">
          <div class="flex-jc-between tg_yq">
            <div class="flex-align-items">
              <div class="saoma flex-center">
                <img src="../../assets/saoma.png">
              </div>
              <div>
                <div class="yq">推广二维码</div>
                <div class="grey_f ck">查看</div>
              </div>
            </div>
            <div>
              <img class="img_r" src="../../assets/right.png">
            </div>
          </div>
        </div>
      </section>
    </div>
      
    <aside class="pd10 fs12 fc-grey">
        <p>佣金计算说明：</p>
        <p>总佣金=推广佣金+订单佣金+未结算佣金</p>
    </aside>

    <van-popup v-model="showcode">
      <div style="font-size:0"><img :src="imgcode" alt="" class="codeimg"></div>
    </van-popup>

    <Clipboard v-model="iscopy" :text="link"/>
  </div>
</template>

<script>
import Clipboard from "@/components/Clipboard";
import { Toast } from 'vant';
import { isWeiXin } from "@/utils/util.js";
const nativeshare = () => import ('nativeshare') 
const m_share = () => import ('m-share')
var NativeShare, mShare

export default {
  components: {
    Clipboard
  },
  data() {
    return {
      showcode:false,
      imgcode:'',
      info:'',
      iscopy:false,
      link:''
    };
  },
  mounted() {
  
    if (!window.localStorage.getItem("userinfo")) {
	  this.$router.replace({ path: "/login" });
	  return
	}	
  
    nativeshare().then(res =>  {NativeShare = res.default} )
    m_share().then(res => {mShare = res})

    this.getinfo()
  },
  methods: {
    getinfo(){
      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
          users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
      });
      this.axios.post(this.API + "api/Generalize/getCommission", postData)
      .then(res => {
          console.log(res.data, "info");
          let resdata = res.data;
          if (resdata.code == 200) {
              Toast.clear();
            this.info = resdata.data
          } else {
              Toast.clear();
              Toast(resdata.message);
          }
      })
    },
    getcode(){
      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
          users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
      });
      this.axios.post(this.API + "api/Generalize/getQrCode", postData)
      .then(res => {
          console.log(res.data, "code");
          let resdata = res.data;
          if (resdata.code == 200) {
              Toast.clear();
              this.imgcode = resdata.message;
              this.showcode = true
          } else {
              Toast.clear();
              Toast(resdata.message||'获取失败');
          }
      })
      .catch(error => {
          Toast.clear();
          Toast('网络出错')
      });
    },

    call(){
      let config = {
        title: '数码租赁',
        link: window.location.origin + '#/login?token='+(JSON.parse(window.localStorage.getItem("userinfo")).users_id||''),
        // link: window.location.origin + '#/login?&',
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
      let mShareData = {  //m-share的参数模型
            title: config.title, // 标题，默认读取document.title
            desc: config.desc, // 描述, 默认读取head标签：<meta name="description" content="desc" />
            link: config.link, // 网址，默认使用window.location.href
            imgUrl: '', // 图片, 默认取网页中第一个img标签
      }
      let nativeShare = new NativeShare()
      nativeShare.setShareData(shareData)
      try {
        nativeShare.call('wechatFriend')
      } catch(e) {
        //qq浏览器中比较奇葩，第一次调用nativeShare.call()会报错，第二次之后不报，这里是让每次调用nativeShare.call()之后都报错，然后统一去调m-share.to()方法
        // mShare.to('wx', mShareData)
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
};
</script>

<style scoped>

.fs12{
  font-size: 12px
}
.pd10{
  padding: 10px;
}
.pdlr10{
  padding-left: 10px;
  padding-right: 10px;
}
.divbox {
  min-height: 100vh;
  background-color: #fff;
}
.trust_box {
  height: 170px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.07);
  border-radius: 10px;
  padding-top: 30px;
}
.grey_f {
  color: #bfbfbf;
  font-size: 12px;
  line-height: 25px;
}
.yuan_img {
  width: 8px;
  height: 12px;
}
.all_img {
  width: 20px;
  height: 30px;
}
.padding_tb {
  padding: 20px 0 5px 0;
}

.money {
  color: #4ea9f9;
  font-size: 19px;
}
.all_money {
  color: #4ea9f9;
  font-size: 50px;
  font-weight: 200;
}

.tg_yq_box {
  height: 80px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.07);
  border-radius: 10px;
}

.tg_yq {
  display: flex;
  align-items: center;
  height: 80px;
}
.img_r {
  width: 5px;
  height: 10px;
  margin-right: 13px;
}

.wode,
.saoma {
  width: 85px;
  height: 81px;
  background: linear-gradient(0deg, #a1c4fd, #bbe5f9);
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.saoma > img {
  width: 24px;
  height: 24px;
}
.yq {
  padding-left: 20px;
}

.ck {
  padding-right: 25px;
}
.wode > img {
  width: 21px;
  height: 24px;
}

.codeimg {
  width: 200px;
  height: 200px;
}

</style>