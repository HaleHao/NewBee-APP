<template>
  <div>
    <div class="bgc pd-15">选择购买产品</div>
    <div class="nav bgc pd-lr-15">
      <div :class="{ 'fc-blue selected': selected==1 }" @click="selected=1">全新正品</div>
      <div :class="{ 'fc-blue selected': selected==2 }" @click="selected=2">本机</div>
    </div>
    <div class="pd-lr-15 bgc mar-b-10">
      <div class="goods flexbox">
        <img :src="info.main_img" alt>
        <div class="flex-1">
          <div class="mar-b-10">{{info.goods_name}}</div>
          <div>
            <span v-for="(item,index) in guiges" :key="index">{{item.attr_name}}</span>
          </div>
        </div>
      </div>
      <div class="price">目前销售价格
        <span class="fc-red">¥{{info.selling_price}}</span>
      </div>
    </div>

    <template v-if="selected==1">

      <div class="bgc">
        <div class="pd-15">取货方式</div>
        <div class="nav bgc pd-lr-15">
          <div :class="{ 'fc-blue selected': typenum==0 }" @click="typenum=0">自取</div>
          <div :class="{ 'fc-blue selected': typenum==1 }" @click="typenum=1">快递</div>
          <div :class="{ 'fc-blue selected': typenum==2 }" @click="typenum=2">配送</div>
        </div>
      </div>

      <div class="mar-b-10 main">
        <div
          class="flex-jc-between flex-align-items pd-15 bgc"
          v-show="typenum==1||typenum==2"
          @click="go(`/addresslist/shopping`)"
        >
          <div>
            <div>收货地址</div>
            <div class="fsz12">
              {{getaddress.ads_user||''}} {{getaddress.ads_phone||''}}
              <van-tag plain v-if="getaddress.ads_state==2">默认</van-tag>
            </div>
            <div class="fsz12">{{(getaddress.ads_province||'')+(getaddress.ads_city||'')+(getaddress.ads_district||'')+(getaddress.ads_address||'')}}</div>
          </div>
          <span class="fc-grey fsz12">
            <van-icon name="arrow"/>
          </span>
        </div>

        <template v-if="typenum==0">
          <div
            class="flex-jc-between flex-align-items pd-15 bgc border-b"
            @click="go(`/locationList/shopping/${leaseid}`)"
          >
            <div>
              <div>自取地点</div>
              <div class="fsz12">{{getlocation.store_name||''}}</div>
              <div class="fsz12">{{(getlocation.store_province||'')+(getlocation.store_city||'')+(getlocation.store_district||'')+(getlocation.store_Address||'')}}</div>
            </div>
            <span class="fc-grey fsz12">
              <van-icon name="arrow"/>
            </span>
          </div>
          <div class="flex-jc-between pd-15 bgc border-b flex-align-items" @click="go('/calendar/shopping')">
            <span>自取时间</span>
            <span class="flex-align-items fc-grey fsz12">
              {{datechoose}}
              <van-icon name="arrow"/>
            </span>
          </div>
          <div class="flex-jc-between flex-align-items pd-15 bgc" @click="go('/people/shopping')">
            <div>
              <div>自取人</div>
              <div class="fsz12">{{people.name}} {{people.phone}}</div>
            </div>
            <span class="fc-grey fsz12">
              <van-icon name="arrow"/>
            </span>
          </div>
        </template>
      </div>
    </template>

    <div class="bgc mar-b-10">
      <template v-if="selected==1">
        <div class="flex-jc-between border-b pd-15" v-show="typenum==2" @click="showtimequantum=true">
          <span>配送时间段</span>
          <span style="color:#666" class="flex-align-items">
            {{timequantumtext}}
            <van-icon name="arrow"/>
          </span>
        </div>
        <div class="flex-jc-between border-b pd-15" v-show="typenum!=0">
          <span>运费</span>
          <span style="color:#666">￥{{freight}}</span>
        </div>
        <div class="flex-jc-between border-b pd-15">
          <span>租金抵扣</span>
          <span style="color:#666">¥{{info.ded_rent}}</span>
        </div>
        <div class="flex-jc-between border-b pd-15" v-show="typenum!=0">
          <span>到货时间</span>
          <span style="color:#666">{{arrivaltime}}</span>
        </div>
        <div class="flex-jc-between border-b pd-15" @click="onshowcoupon">
          <span>优惠卷</span>
          <span style="color:#666" class="flex-align-items">{{couponstext}}<van-icon name="arrow"/></span>
        </div>
      </template>
      <div class="flex-jc-between border-b pd-15" v-show="selected==2">
        <span>租金抵扣</span>
        <span style="color:#666">¥{{info.ded_rent}}</span>
      </div>
      <div class="flex-jc-between pd-15">
        <span>应付总额</span>
        <span class="fc-red">¥{{calculatesum}}</span>
      </div>
    </div>

    <div class="bgc">
      <div class="border-b pd-15">请选择支付方式</div>
      <van-radio-group v-model="radio">

        <div v-if='numbuy'  class="flex-jc-between border-b pd-15"  @click="radio ='5'">
          <div><img src="../../assets/weixin.png" alt="微信" class="payimg">微信</div>
          <van-radio name="5" checked-color="#2DBBF1"></van-radio>
        </div>

        <div v-else class="flex-jc-between border-b pd-15" @click="radio ='1'">
          <div><img src="../../assets/weixin.png" alt="微信" class="payimg">微信</div>
          <van-radio name="1" checked-color="#2DBBF1"></van-radio>
        </div>

        <div class="flex-jc-between border-b pd-15" @click="radio = '2'">
          <div>
            <img src="../../assets/ali.png" alt="支付宝" class="payimg">支付宝
          </div>
          <van-radio name="2" checked-color="#2DBBF1"></van-radio>
        </div>
        <div class="flex-jc-between pd-15" @click="radio = '3'">
          <div>
            <img src="../../assets/balance.png" alt="余额" class="payimg">余额
            <span class="fc-red">¥{{info.users_balance}}</span>
          </div>
          <van-radio name="3" checked-color="#2DBBF1"></van-radio>
        </div>
      </van-radio-group>
    </div>

    <div class="pd-15">
      <div class="btn text-c" @click="submit">支付</div>
    </div>

    <van-popup v-model="showtimequantum" position="bottom" :close-on-click-overlay="false">
      <van-picker
        :columns="timequantumarr"
        show-toolbar
        @cancel="showtimequantum = false"
        @confirm="onConfirmTimequantum"
      />
    </van-popup>

    <van-actionsheet v-model="showcoupon" title="优惠券">
      <div class="coupon_box">
        <div  class="text-c fc-grey pd-15" v-if="couponlist.length==0">暂无优惠券</div>
        <div class="position mar-b-10" v-for="(item,index) in couponlist" :key="index" @click="choosecoupon(item,index)">
          <div class="couponcard" :class="index+1==couponindex?'boxshadow-blue':'boxshadow'">
            <!-- <img src="../../assets/1.png"> -->
          </div>

          <div class="coupon_con flex-jc-around flex-align-items" >
            <div>
              <span class="num">{{item.coupons_money|nozero}}</span>
              <span class="yuan">元</span>
            </div>
            <div v-if="item.activity_name==''">
              <div class="coupon_fl">{{item.coupon_name}}</div>
              <div class="limit">
                <div>有效期至{{item.end_time}}</div>
                <div>满{{item.coupons_condition}}可用</div>
              </div>
            </div>
            <div v-else>
              <div class="coupon_fl">{{item.coupon_name}}</div>
              <div class="limit">
                <div>活动{{item.activity_name}}</div>
                <div>有效期至{{item.end_activity}}</div>
                <div>满{{item.coupons_condition}}可用</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-actionsheet>

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
import { accAdd,accSub,isWeiXin } from "@/utils/util.js";
import wx from "weixin-js-sdk";
export default {
  beforeRouteEnter(to, from, next) {
    let urlarr = ['选择地点','时间','自取联系人','收货地址']
    if(urlarr.includes(from.meta.title)) {
        to.meta.isBack = true;
    }
    next();
  },
  data() {
    return {
      leaseid: this.$route.params.id,
      radio:'3',
      selected: 1,
      typenum: 0,
      people: "",
      datechoose: "",
      getlocation:'',
      getaddress: '',
      info:'',
      guiges:'',
      goodsimg:'',
      freight: 0, //运费
      arrivaltime: '',//到货时间
      timequantumtext: "", //时间段
      showtimequantum: false, //时间段
      timequantumarr: [], //时间段
      sum:0,
      couponstext: "", //优惠券
      showcoupon: false, //优惠券
      couponindex: '', //优惠券
      couponid:'', //优惠券
      couponlist: [], //优惠券
      showWXpay:false,
      numbuy:''
    };
  },
  watch:{
    selected(val){
      this.getinfo()
    },
    typenum(val){
      if(val==0){
        this.calculateRules()
      }
      if(val==1||val==2){
        if(this.getaddress != ""){
          this.getfreight()
        }else{
          this.calculateRules()
        }
      }
    },

    getaddress(val){
      if(this.typenum==1||this.typenum==2){
        if(val != ""){
          this.getfreight()
        }
      }
    },
  },
  computed:{
    calculatesum(){
      if(this.sum-0<0){
        return 0
      }
      return this.sum
    },
  },

  created() {
    let wxshoppingSession = JSON.parse(window.sessionStorage.getItem("wxshoppingSession"))
    if(wxshoppingSession){
        if(wxshoppingSession.orderid==this.$route.params.id){
            this.showWXpay = wxshoppingSession.state
        }
    }
    this.isFirstEnter = true;

      let isWeiXin = () => {
          return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
      }
      if (isWeiXin()) {
          console.log("微信");
          this.numbuy = true
      } else {
          console.log("不是微信");
          this.numbuy = false
      }

  },
  mounted() {    
    this.getinfo()
    this.getdefaultaddress();
  },
  methods: {
    goback(){
        this.$router.go(-1);
    },
    calculateRules(){
      if(this.selected==1){
        // console.log(1)
        if(this.typenum==0){
          if(this.couponstext!=''){
            this.sum = accSub(this.info.yf_price,this.couponstext) // -优惠券
          }else{
            this.sum = this.info.yf_price
          } 
          // console.log(2)
        }else{
          if(this.couponstext!=''){
            let a = accSub(this.info.yf_price,this.couponstext)// -优惠券
            this.sum = accAdd(a, this.freight)
          }else{
            this.sum = accAdd(this.info.yf_price||'', this.freight)
          }
          // console.log(3)
        }
      }
      if(this.selected==2){
        this.sum = this.info.yf_price
        // console.log(4)
      }
    },
    go(url){
      let shoppingSession = {
        getlocation: this.getlocation, //自取地点
        getdate: this.datechoose,
        getpeople: this.people,
        getaddress:this.getaddress
      }
      window.sessionStorage.setItem("shoppingSession", JSON.stringify(shoppingSession));
      this.$router.push({ path: url });
    },

    onConfirmTimequantum(value, index) {
      // console.log(`当前值：${value}, 当前索引：${index}`);
      this.timequantumtext = value;
      this.showtimequantum = false;
    },

    getdefaultaddress() {
      let postData = this.$qs.stringify({
        users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id
      });
      this.axios.post(this.API + "api/Lease/ads_select", postData).then(res => {
        console.log(res.data, "address");
        let resdata = res.data;
        if (resdata.code == 200) {
          for (let v of resdata.data) {
            if (v.ads_state == 2) {
              this.getaddress = v;
            }
          }
        } else {
          this.getaddress = ''
          // Toast(resdata.message);
        }
      });
    },

    getfreight(){
      let postData = this.$qs.stringify({
        type: this.typenum,
        ads_id: this.getaddress.ads_id,
        order_id: this.$route.params.id,
      })
      this.axios
        .post(this.API + "api/Buy_Order/BuyExpressPrice", postData)
        .then(res => {
          console.log(res.data, "freight");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.freight = resdata.data.price;
            this.timequantumarr = resdata.data.timelist;
            this.arrivaltime = resdata.data.arrival_time
            this.calculateRules()
          } else {
            this.freight = 0
            this.calculateRules()
            Toast(resdata.message);
          }
        });
    },

    getinfo(){
      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
        users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
        type: this.selected,
        order_id: this.$route.params.id,
      });
      this.axios.post(this.API + "api/Buy_Order/BuyGoodsDetail", postData).then(res => {
        console.log(res.data, "info");
        let resdata = res.data;
        if (resdata.code == 200) {
          Toast.clear();
          this.info = resdata.data
          this.goodsimg = resdata.data.gd_img[0]
          this.guiges = resdata.data.sku==''?'':JSON.parse(resdata.data.sku);
          this.calculateRules()
        } else {
          Toast.clear();
          Toast(resdata.message);
          Dialog.alert({
              message: resdata.message
          }).then((e) => {
              this.$router.go(-1);
          });
        }
      });
    },

    //优惠卷
    onshowcoupon(){
      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
        users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
        goods_id: this.info.goods_id,
        money:this.info.yf_price
      });
      this.axios
        .post(this.API + "api/Order/GetUserCoupons", postData)
        .then(res => {
          console.log(res.data, "couponslist");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.showcoupon = true
            Toast.clear()
            this.couponlist = resdata.data
          } else {
            Toast.clear()
            Toast(resdata.message);
          }
        });
    },
    choosecoupon(item,index){
      // console.log(item,index);
      if(index+1==this.couponindex){
        this.couponindex = ''
        this.couponstext = ''
        this.coupons_condition = ''
        this.couponid = ''
        this.calculateRules()
      }else{
        this.couponindex = index+1
        this.couponstext = item.coupons_money
        this.coupons_condition = item.coupons_condition
        this.couponid = item.coupons_id
        this.calculateRules()
        this.showcoupon = false
      }
    },

    submit(){
      if(this.selected==1){
        if(this.typenum == 0){
          if(this.getlocation == ""){
            Toast("请填写自取地点")
            return
          }
          if(this.datechoose == ""){
            Toast("请填写自取时间")
            return
          }
          if(this.people == ""){
            Toast("请填写自取人")
            return
          }

          var postData = this.$qs.stringify({
            users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
            type: this.selected,
            order_id: this.$route.params.id,
            qwsh_time: '',
            pay_way: this.radio,
            delivery_way: this.typenum == 0 ? 3 : this.typenum == 1 ? 1 : 2,
            store_id: this.getlocation.store_id,
            order_delivery_time: this.datechoose,
            users_name: this.people.name,
            users_phone: this.people.phone,
            users_type: this.people.type == 0 ? 1 : 2,
            ads_id: '',
            way_price: '',
            timelist:'',
            time:'',
            remark:'',
            coupons_id:''
          });
        }

        if(this.typenum == 1){
          if(this.getaddress == ""){
            Toast("请选择收货地址")
            return
          }

          var postData = this.$qs.stringify({
            users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
            type: this.selected,
            order_id: this.$route.params.id,
            qwsh_time: this.arrivaltime,
            pay_way: this.radio,
            delivery_way: this.typenum == 0 ? 3 : this.typenum == 1 ? 1 : 2,
            store_id: '',
            order_delivery_time: '',
            users_name: '',
            users_phone: '',
            users_type: '',
            ads_id: this.getaddress.ads_id,
            way_price: this.freight,
            timelist:'',
            time:'',
            remark:'',
            coupons_id:''
          });
        }

        if(this.typenum == 2){
          if(this.getaddress == ""){
            Toast("请选择收货地址")
            return
          }
          if(this.timequantumtext == ""){
            Toast("请选择配送时间段")
            return
          }

           var postData = this.$qs.stringify({
            users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
            type: this.selected,
            order_id: this.$route.params.id,
            qwsh_time: this.arrivaltime,
            pay_way: this.radio,
            delivery_way: this.typenum == 0 ? 3 : this.typenum == 1 ? 1 : 2,
            store_id: '',
            order_delivery_time: '',
            users_name: '',
            users_phone: '',
            users_type: '',
            ads_id: this.getaddress.ads_id,
            way_price: this.freight,
            timelist:this.timequantumtext,
            time:'',
            remark:'',
            coupons_id:''
          });
        }

        if(this.radio==1){
          this.axios.post(this.API + "api/Buy_Order/BuyAddOrder", postData)
          .then(res => {
              console.log(res.data, "wxpay");
              let resdata = res.data;
              if (resdata.code == 200) {
                  Toast.clear();
                  let wxbuypaySession = {
                      orderid:this.$route.params.id,
                      state: true
                  }
                  window.sessionStorage.setItem("wxshoppingSession", JSON.stringify(wxbuypaySession))
                  window.location.href = resdata.data
              } else {
                  Toast.clear();
                  Toast(resdata.message);
              }
          })
          .catch(error => {
              Toast.clear()
              Toast('网络出错')
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
          this.axios.post(this.API + "api/Buy_Order/BuyAddOrder", postData)
          .then(res => {
              console.log(res.data, "alipay");
              window.sessionStorage.removeItem("wxpaySession");
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
          this.axios.post(this.API + "api/Buy_Order/BuyAddOrder", postData).then(res => {
            console.log(res.data, "submit");
            let resdata = res.data;
            if (resdata.code == 200) {
              Toast.clear();
              Dialog.alert({
                  message: '支付成功'
              }).then((e) => {
                  this.$router.go(-1);
              });
            } else {
              Toast.clear();
              Toast(resdata.message);
            }
          })
          .catch(error => {
              Toast.clear()
              Toast('网络出错')
          });
        }

        if(this.radio==5){
              Toast.loading({ mask: true,message: '加载中...',duration:0})
              this.axios.post(this.API + "api/Buy_Order/BuyAddOrder", postData)
                  .then(res => {
                      console.log(res, "wxpay");
                      let data = res.data.data
                      if (res.data.code == 200) {
                          Toast.clear()
                          //函数为分装过得 (就是调用微信支付)
                          this.wexinPay(
                              {
                                  appId: data.appId,
                                  nonceStr: data.nonceStr,
                                  package: data.package,
                                  paySign: data.paySign,
                                  signType: data.signType,
                                  timeStamp: data.timeStamp
                              },
                          );
                      } else {
                          Toast.clear()
                          Toast(resdata.message);
                      }
                  }).catch(error => {
                  Toast.clear()
                  Toast('网络出错')
              });
          }
      }

      if(this.selected==2){
        Toast.loading({ mask: true, message: "加载中...",duration:0 });
        let postData = this.$qs.stringify({
          users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
          type: this.selected,
          order_id: this.$route.params.id,
          qwsh_time: this.arrivaltime,
          pay_way: this.radio,
          delivery_way: '',
          store_id: '',
          order_delivery_time: '',
          users_name: '',
          users_phone: '',
          users_type: '',
          ads_id: '',
          way_price: '',
          timelist:'',
          time:'',
          remark:'',
          coupons_id:''
        });

        if(this.radio==1){
          this.axios.post(this.API + "api/Buy_Order/BuyAddOrder", postData)
          .then(res => {
              console.log(res.data, "wxpay");
              let resdata = res.data;
              if (resdata.code == 200) {
                  Toast.clear();
                  let wxbuypaySession = {
                      orderid:this.$route.params.id,
                      state: true
                  }
                  window.sessionStorage.setItem("wxshoppingSession", JSON.stringify(wxbuypaySession))
                  window.location.href = resdata.data
              } else {
                  Toast.clear();
                  Toast(resdata.message);
              }
          })
          .catch(error => {
              Toast.clear()
              Toast('网络出错')
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
          this.axios.post(this.API + "api/Buy_Order/BuyAddOrder", postData)
          .then(res => {
              console.log(res.data, "alipay");
              window.sessionStorage.removeItem("wxshoppingSession");
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
          this.axios.post(this.API + "api/Buy_Order/BuyAddOrder", postData).then(res => {
            console.log(res.data, "submit");
            let resdata = res.data;
            if (resdata.code == 200) {
              Toast.clear();
              Dialog.alert({
                  message: '支付成功'
              }).then((e) => {
                  this.$router.go(-1);
              });
            } else {
              Toast.clear();
              Toast(resdata.message||'操作失败');
            }
          })
          .catch(error => {
              Toast.clear()
              Toast('网络出错')
          });
        }

        if(this.radio==5){
              Toast.loading({ mask: true,message: '加载中...',duration:0})
              this.axios.post(this.API + "api/Buy_Order/BuyAddOrder", postData)
                  .then(res => {
                      console.log(res, "wxpay");
                      let data = res.data.data
                      if (res.data.code == 200) {
                          Toast.clear()
                          //函数为分装过得 (就是调用微信支付)
                          this.wexinPay(
                              {
                                  appId: data.appId,
                                  nonceStr: data.nonceStr,
                                  package: data.package,
                                  paySign: data.paySign,
                                  signType: data.signType,
                                  timeStamp: data.timeStamp
                              },
                          );
                      } else {
                          Toast.clear()
                          Toast(resdata.message);
                      }
                  }).catch(error => {
                  Toast.clear()
                  Toast('网络出错')
              });
          }
      }
    },

    wexinPay(data) {
          //获取后台传入的数据
          let appId = data.appId;
          let timestamp = data.timeStamp;
          let nonceStr = data.nonceStr;
          let signature = data.signature;
          let packages = data.package;
          let paySign = data.paySign;
          let signType = data.signType;
          console.log('发起微信支付')
          wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: appId, // 必填，公众号的唯一标识
              timestamp: timestamp, // 必填，生成签名的时间戳
              nonceStr: nonceStr, // 必填，生成签名的随机串
              signature: signature, // 必填，签名，见附录1
              jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.ready(function () {
              wx.chooseWXPay({
                  timestamp: timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                  nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
                  package: packages, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                  signType: signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                  paySign: paySign, // 支付签名
                  success: function (res) {
                      // 支付成功后的回调函数
                      if (res.errMsg == "chooseWXPay:ok") {
                          Toast.clear()
                          Dialog.alert({
                              message: '支付成功'
                          }).then((e) => {

                              window.location.href='https://www.newbee-smart.com/#/order'

                              // this.$router.replace({ path: "/order" })
                          });
                      }
                  },
                  // 支付取消回调函数
                  cancel: function (res) {
                      Toast('取消支付~')
                  },
                  // 支付失败回调函数
                  fail: function (res) {
                      Toast('支付失败~')
                  }
              });
          });
          wx.error(function (res) {
              Toast('订单关闭',res)
          });
      },
  },

  activated() {
     if(!this.$route.meta.isBack || this.isFirstEnter){
      this.leaseid= this.$route.params.id
      this.radio ='3'
      this.selected = 1
      this.typenum = 0
      this.people = ""
      this.datechoose = ""
      this.getlocation =''
      this.getaddress = ''
      this.info = ''
      this.guiges=''
      this.goodsimg = ''
      this.freight = 0
      this.arrivaltime = ''
      this.timequantumtext= ""//时间段
      this.showtimequantum= false //时间段
      this.timequantumarr= [] //时间段
      this.couponstext= "" //优惠券
      this.showcoupon= false //优惠券
      this.couponindex= '' //优惠券
      this.couponid='' //优惠券
      this.couponlist= [] //优惠券
      this.sum = 0
      this.showWXpay = false
      this.getinfo()
      this.getdefaultaddress()
     }else{
      let wxshoppingSession = JSON.parse(window.sessionStorage.getItem("wxshoppingSession"))
      if(wxshoppingSession){
          if(wxshoppingSession.orderid==this.$route.params.id){
              this.showWXpay = wxshoppingSession.state
          }
      }
      let shoppingSession = JSON.parse(window.sessionStorage.getItem("shoppingSession"));
      if(shoppingSession){
        this.datechoose = shoppingSession.getdate
        this.people = shoppingSession.getpeople
        this.getlocation = shoppingSession.getlocation
        this.getaddress = shoppingSession.getaddress
      }
     }
     this.$route.meta.isBack=false
     this.isFirstEnter=false;
  }
};
</script>

<style scoped>
.payimg {
  width: 20px;
  height: 20px;
  padding-right: 10px;
  vertical-align: middle;
}
.fsz14 {
  font-size: 14px;
}
.fsz12 {
  font-size: 12px;
}
.fsz10 {
  font-size: 10px;
}
.nav {
  /* padding: 15px; */
  padding-bottom: 20px;
}
.nav > div {
  width: 80px;
  height: 30px;
  line-height: 30px;
  /* color: #666; */
  display: inline-block;
  box-shadow: 0 1px 7px 1px #e8e9ea;
  /* margin-left: 10px; */
  border-radius: 20px;
  text-align: center;
  box-sizing: border-box;
  font-size: 13px;
  margin-right: 10px;
}
.nav .selected {
  box-shadow: 0 1px 7px 1px #def4fd;
}
.goods {
  background-color: #f6f6f6;
  padding: 10px;
}
.goods img {
  width: 66px;
  height: 66px;
  background-color: #fff;
  margin-right: 10px;
}

.goods1 img {
  width: 80px;
  height: 80px;
  margin-right: 10px;
  background-color: #f6f6f6;
}
.goods1 .title {
  padding-right: 10px;
}
.price {
  padding: 10px 0;
}

.btn {
  height: 42px;
  line-height: 42px;
  border-radius: 20px;
  color: #fff;
  background-image: linear-gradient(90deg, #2dbbf1 0%, #4ea9f9 100%);
}


/* 优惠券 */
.coupon_box {
  padding: 10px;
}
.couponcard {
  height: 100px;
  border-radius: 5px;
  overflow: hidden;
  border-bottom: 3px solid #4ea9f9;
  box-sizing: border-box;
}
.boxshadow{
  box-shadow: 0px 1px 7px 1px #DAD7D7;
}
.boxshadow-blue{
  box-shadow: 0px 1px 7px 1px #4ea9f9;
}
.coupon_con {
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%;
}
.num {
  font-size: 60px;
  color: #4ea9f9;
}

.yuan {
  font-size: 20px;
  color: #4ea9f9;
}

.coupon_fl {
  font-size: 14px;
}
.limit {
  font-size: 10px;
  color: #aeaeae;
}

.wxbox {
    width: 200px;
}
.wxbox > p {
    padding: 10px 0;
}
</style>
