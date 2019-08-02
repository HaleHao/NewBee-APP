<template>
  <div class="">
    <van-cell @click="go('/calendar/hostCancel')">
      <template slot="title">
        <div class="flex-jc-between flex-align-items" >
          <div>
            <div class="custom-text mar-b-10 fc-grey">取消托管日期</div>
            <div class="custom-text f13" :class="datetext==''?'fc-grey':''">{{datetext==''?'请选择日期':datetext}}</div>
          </div>
          <van-icon name="arrow" color="#aeaeae" size="20px"/>
        </div>
      </template>
    </van-cell>

    <van-cell @click="go('/addresslist/hostCancel')">
      <template slot="title">
        <div class="flex-jc-between flex-align-items" style="padding: 10px 0;">
          <div>
            <div class="fc-grey">退回地址</div>
            <div>{{getaddress.ads_user||''}}  {{getaddress.ads_phone||''}} <van-tag plain v-if="getaddress.ads_state==2">默认</van-tag></div>
            <div>{{(getaddress.ads_province||'')+(getaddress.ads_city||'')+(getaddress.ads_district||'')+(getaddress.ads_address||'')}}</div>
          </div>
          <van-icon name="arrow" color="#aeaeae" size="20px"/>
        </div>
      </template>
    </van-cell>

    <div class="post flex-jc-between mar-b-10 bgc pd-15" >
      <span>退回运费</span>
      <span>￥{{freight||'0.00'}}</span>
    </div>

    <div class="bgc mar-b-10">
        <div class="border-b pd-15">请选择支付方式</div>
        <van-radio-group v-model="radio">
            <div class="flex-jc-between border-b pd-15" @click="radio = '1'">
                <div><img src="../../../assets/weixin.png" alt="微信" class="payimg">微信</div>
                <van-radio name="1" checked-color="#2DBBF1"></van-radio>
            </div>
            <div class="flex-jc-between border-b pd-15" @click="radio = '2'">
                <div><img src="../../../assets/ali.png" alt="支付宝" class="payimg">支付宝</div>
                <van-radio name="2" checked-color="#2DBBF1"></van-radio>
            </div>
            <div class="flex-jc-between pd-15" @click="radio = '3'">
                <div><img src="../../../assets/balance.png" alt="余额" class="payimg">余额<span class="fc-red"> ¥{{info.users_balance}}</span></div>
                <van-radio name="3" checked-color="#2DBBF1"></van-radio>
            </div>
        </van-radio-group>
    </div>

    <div class="flex-jc-center btn_box">
      <div class="btn text-c" @click="submit">立即支付</div>
    </div>

    <van-popup v-model="showWXpay" :close-on-click-overlay='false'>
        <div class="wxbox">
            <p class="text-c border-b">请确认微信支付是否完成</p>
            <p class="text-c fc-red border-b" @click="goback">已完成支付</p>
            <p class="text-c fc-grey" @click="showWXpay = false">支付遇到问题，重新支付</p>
        </div>
    </van-popup>

  </div>
</template>

<script>
import { Toast,Dialog } from "vant";
import { isWeiXin } from "@/utils/util.js";
export default {
  data(){
    return{
      radio:'3',
      datetext:'',
      getaddress:'',
      info:'',
      freight: 0,
      showWXpay:false
    }
  },
  watch:{
    getaddress(val){
      if(val != ""){
        this.getfreight()
      }
    },
  },

  created() {
    let wxpayhcSession = JSON.parse(window.sessionStorage.getItem("wxpayhcSession"))
    if(wxpayhcSession){
        if(wxpayhcSession.orderid==this.$route.params.orderid){
            this.showWXpay = wxpayhcSession.state
        }
    }
    let hostCancelSession = JSON.parse(window.sessionStorage.getItem("hostCancelSession"));
    if(hostCancelSession){
        this.datetext = hostCancelSession.date
        this.getaddress = hostCancelSession.getaddress
    }else{
      this.getdefaultaddress()
    }
    //取缓存 end
    this.getinfo()
  },

  methods:{
    goback(){
      this.$router.go(-1);
    },
    go(url){
        let hostCancelSession = {
            date: this.datetext,
            getaddress:this.getaddress,
        }
        window.sessionStorage.setItem("hostCancelSession", JSON.stringify(hostCancelSession));
        this.$router.push({ path: url });
    },
    getinfo() {
        let postData = this.$qs.stringify({
            users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
        });
        this.axios.post(this.API + "api/Buy_Order/GetPayData", postData)
        .then(res => {
            console.log(res.data, "info");
            let resdata = res.data;
            if (resdata.code == 200) {
                this.info = resdata.data;
            } else {
            Toast(resdata.message);
            }
        })
        .catch(error => {
            Toast('网络出错')
        });
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
                        this.getfreight()
                    }
                }
            } else {
                // Toast(resdata.message)
            }
        });
    },
    getfreight(){
      let postData = this.$qs.stringify({
          ads_id: this.getaddress.ads_id,
          host_number: this.$route.params.number
      })
      this.axios.post(this.API + "api/Trusteeship/getCarriage",postData)
      .then(res => {
          console.log(res.data, "getfreight")
          let resdata = res.data
          if (resdata.code == 200) {
            this.freight = resdata.data.freight
            this.store_id = resdata.data.store_id
          } else {
              Toast(resdata.message)
          }
      });
    },

    submit(){
      if(this.datetext==''||this.getaddress==''){
        Toast("请先填写完整");
        return
      }
      Toast.loading({ mask: true, message: "加载中..." });
        let postData = this.$qs.stringify({
            carriage: this.freight,
            pay_way: this.radio,
            users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
            trust_id: this.$route.params.id,
            ads_id: this.getaddress.ads_id,
            time: this.datetext,
            money: this.freight,
            store_id: this.store_id
        })

      if(this.radio==1){
        this.axios.post(this.API + "api/Trusteeship/cancelTrust", postData)
        .then(res => {
          console.log(res.data, "wxpay");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear();
            let wxpayhcSession = {
                orderid:this.$route.params.orderid,
                state: true
            }
            window.sessionStorage.setItem("wxpayhcSession", JSON.stringify(wxpayhcSession))
            window.location.href = resdata.data
          } else {
            Toast.clear();
            Toast(resdata.message);
          }
        });
      }
      if(this.radio==2){
        if(isWeiXin()){
            Dialog.alert({
                message: '请在浏览器中打开网页完成支付'
            }).then((e) => {

            });
            return
        }
        this.axios.post(this.API + "api/Trusteeship/cancelTrust", postData)
        .then(res => {
            console.log(res.data, "alipay");
            window.sessionStorage.removeItem("wxpayhcSession");
            Toast.clear()
            
            const form = res.data;
            const div = document.createElement('div');
            div.id = 'alipay';
            div.style.opacity='0'
            div.innerHTML = form;
            document.body.appendChild(div);
            document.querySelector('#alipay').children[0].submit(); 
        })
        .catch(error => {
            Toast.clear()
            Toast('网络出错')
        });
      }
      if(this.radio==3){
        this.axios.post(this.API + "api/Trusteeship/cancelTrust", postData)
        .then(res => {
          console.log(res.data, "submit");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear();
            Dialog.alert({
                message: '操作成功'
            }).then((e) => {
                this.$router.go(-1);
            });
          } else {
            Toast.clear();
            Toast(resdata.message||'操作失败');
          }
        });
      }
    }

  }
};
</script>

<style scoped>

.custom-text {
  /* color: #aeaeae; */
  font-size: 14px;
}
.f12 {
  font-size: 13px;
}

/* .address {
  color: #aeaeae;
} */
/* .post {
  margin: 15px;
} */

.btn {
  width: 280px;
  height: 40px;
  line-height: 40px;
  background: linear-gradient(90deg, #60c0fd, #4ea9f9);
  border-radius: 20px;
  color: #fff;
}

.payimg{
    width: 20px;
    height: 20px;
    padding-right: 10px;
    vertical-align: middle;
}


.wxbox {
    width: 200px;
}
.wxbox > p {
    padding: 10px 0;
}
</style>


