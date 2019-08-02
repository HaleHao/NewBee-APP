<template>
  <div>
    <div class="bgc">
      <div class="pd-15">取货方式</div>
      <div class="nav bgc pd-lr-15">
        <div :class="{ 'fc-blue selected': typenum==0 }" @click="typenum=0">自取</div>
        <div :class="{ 'fc-blue selected': typenum==1 }" @click="typenum=1">快递</div>
        <div :class="{ 'fc-blue selected': typenum==2 }" @click="typenum=2">配送</div>
      </div>
    </div>

    <div class="mar-b-10 main">
      <van-cell is-link center @click="go('/addresslist/buy')" v-show="typenum==1||typenum==2">
        <div slot="title">
          <div>收货地址</div>
          <div>
            {{getaddress.ads_user||''}} {{getaddress.ads_phone||''}}
            <van-tag plain v-if="getaddress.ads_state==2">默认</van-tag>
          </div>
          <div>{{(getaddress.ads_province||'')+(getaddress.ads_city||'')+(getaddress.ads_district||'')+(getaddress.ads_address||'')}}</div>
        </div>
      </van-cell>

      <template v-if="typenum==0">
        <van-cell is-link center @click="go(`/locationList/buy/${goodid}`)">
          <template slot="title">
            <div>自取地点</div>
            <div>{{getlocation.store_name||''}}</div>
            <div>{{(getlocation.store_province||'')+(getlocation.store_city||'')+(getlocation.store_district||'')+(getlocation.store_Address||'')}}</div>
          </template>
        </van-cell>
        <van-cell is-link center @click="chooseCalendar('/calendar/buy/pre')">
          <template slot="title">
            <div>自取时间</div>
            <div>{{getdate}}</div>
          </template>
        </van-cell>
        <van-cell is-link center @click="go('/people/buy')">
          <template slot="title">
            <div>自取人</div>
            <div>{{people.name}} {{people.phone}}</div>
          </template>
        </van-cell>
      </template>
    </div>

    <!-- <div class="pd-15 bgc">
      <div class="goods flexbox">
        <img :src="detail.main_img" :alt="detail.goods_name" style="object-fit:contain">
        <div class="flex-1">
          <div class="mar-b-10">{{detail.goods_name}}</div>
          <div>
            <span v-for="(item,index) in guiges" :key="index">{{item.attr_name}}</span>
          </div>
        </div>
      </div>
    </div> -->

    <div class="mar-b-10">
      <van-cell title="租期" center>
        <div class="time">
          <div class="border text-line flex-center" @click="showweek = true">
            {{changeweektext}}
            <img src="../../assets/icon-triangle.png" class="triangleimg">
          </div>
          <div class="border flex-center">
            <input type="number" v-model.trim="weekval" :disabled="isdisabled" class="bgc">
          </div>
        </div>
      </van-cell>

      <van-cell
        is-link
        center
        v-show="typenum==1||typenum==2"
        @click="chooseCalendar('/calendar/expectdateTobuy/pre')"
        :value="expectdate"
      >
        <template slot="title">
          <div>期望收到的日期</div>
          <div class="fc-grey fs12">收到货的次日起算租金</div>
        </template>
      </van-cell>
      <van-cell
        title="配送时间段"
        center
        :value="timequantumtext"
        is-link
        v-show="typenum==2"
        @click="showtimequantum=true"
      ></van-cell>
    </div>

    <div class="mar-b-10">
      <van-cell title="运费" center :value="'￥'+freight" v-show="typenum==1"></van-cell>
      <van-cell title="配送运费" center :value="'￥'+freight" v-show="typenum==2"></van-cell>
      <van-cell title="优惠券" is-link center :value="couponstext" @click="onshowcoupon"></van-cell>
      <van-cell :title="'放心用 ￥'+detail.safe_price" center>
        <div class="flex-align-items" style="justify-content: flex-end">
          <van-switch @change="onswitch" v-model="isinsurance" size="20px" :disabled="Dinsurance"/>
        </div>
      </van-cell>
      <van-cell center v-show="typenum==2">
        <div slot="title" class="flex-align-items">
          <span>特殊需求备注</span>
          <input type="text" placeholder="请输入" v-model="remarkval" class="pdl10">
        </div>
      </van-cell>
    </div>

    <div class="mar-b-10">
      <van-cell title="押金" center :value="'￥'+detail.gd_deposit"></van-cell>
      <van-cell title="租金" center :value="'￥'+calculaterent"></van-cell>
      <van-cell title="应付总额" center>
        <span class="fc-red">￥{{calculatesum}}</span>
      </van-cell>
    </div>

    <div class="bgc pd-15">
      <div class="mar-b-10 flexbox">
        <van-checkbox checked-color="#2DBBF1" v-model="isconsent"></van-checkbox>
        <div class="pdl10">同意
          <span @click="go('/zagreement/lease')" class="fc-blue">租赁协议</span>
        </div>
      </div>
      <div>
        <button class="btn text-c" @click="nextface">信用免押认证</button>
      </div>
    </div>

    <!-- 弹框 -->
    <van-popup v-model="showtimequantum" position="bottom" :close-on-click-overlay="false">
      <van-picker
        :columns="timequantumarr"
        show-toolbar
        @cancel="showtimequantum = false"
        @confirm="onConfirmTimequantum"
      />
    </van-popup>
    <!-- 租期  -->
    <van-popup v-model="showweek" position="bottom" :close-on-click-overlay="false">
      <van-picker
        :columns="weekcolumns"
        show-toolbar
        @cancel="showweek = false"
        @confirm="onConfirmWeek"
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
              <span class="num">{{item.coupons_money|noZero}}</span>
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
  </div>
</template>

<script>
import { Toast,Dialog } from "vant";
import { accAdd, accSub } from "@/utils/util.js";

export default {
  beforeRouteEnter(to, from, next) {
    let urlarr = ['选择地点','时间','自取联系人','协议','收货地址']
    if(urlarr.includes(from.meta.title)) {
        to.meta.isBack = true;
    }
    next();
  },
  data() {
    return {
      goodid: this.$route.query.id,
      goodsimg:'',
      typenum: 0,
      timetext: "",
      getdate: "",//自取时间
      expectdate: "", //期望收到日期
      people: "",
      getlocation: "",
      getaddress: "",
      couponstext: "", //优惠券
      showcoupon: false, //优惠券
      couponindex: '', //优惠券
      couponid:'', //优惠券
      showweek: false, //租期
      weekcolumns: [],
      weektext: "请选择", //租期
      isdisabled: true, //租期
      weekval: "", //租期
      isinsurance: true, //保险
      isconsent: true, //协议
      couponlist: [], //优惠券
      remarkval: "",
      timequantumtext: "", //时间段
      showtimequantum: false, //时间段
      timequantumarr: [], //时间段
      detail: "",
      Dinsurance: false, //保险
      hire_cate: 1,
      guiges: [],
      rent: 0, //租金
      rented:0, //用作计算
      freight: 0, //运费
      sum: 0
    };
  },
  watch: {
    typenum(){
      if(this.typenum==0){
        if (this.hire_cate == 1 || this.hire_cate == 3) {
          this.weekcolumns = ["天"]
        }
        if (this.hire_cate == 2) {
          this.weekcolumns =  ["天", "小时"]
        }

        this.calculateRules()
      }
      if(this.typenum==1||this.typenum==2){
        if(this.getaddress != ""){
          this.getfreight()
        }else{
          this.calculateRules()
        }

        this.weekcolumns = ["天"]
      }
    },
    weekval() {
      if (this.weekval == "") {
        this.rent = 0;
        this.rented=0
        this.calculateRules()
        return;
      }
      if (this.weekval <= 0) {
        this.weekval = 1
        Toast('不能为小于0');
        return;
      }
      let postData = this.$qs.stringify({
        goods_id: this.$route.query.id,
        rent_num: this.weekval,
        unt: this.weektext == "天" ? "1" : "2"
      });
      this.axios
        .post(this.API + "api/Order/GetHirePrice", postData)
        .then(res => {
          console.log(res.data, "weekval");
          let resdata = res.data;
          if (resdata.code == 200) {
            let rent = this.rent 
            let rented = this.rented 
            this.rent = resdata.data;
            this.rented = resdata.data;
            
            // if(this.couponstext!=''){
            //   let o = accSub(rented,this.couponstext) 
            //   let r = accSub(resdata.data,this.couponstext) // -优惠券
            //   console.log(r,o);
              
            //   if(r-0<0){
            //     this.calculateRules()
            //     return 
            //   }

            //   if(o-0<0){
            //     this.sum = accAdd(this.sum,r)
            //   }else{
            //     let rentSum = accSub(this.sum,o) //减原来的
            //     this.sum = accAdd(rentSum,r)
            //   }
              
            // }else{
            //   let rentSum = accSub(this.sum,rented) //减原来的
            //   this.sum = accAdd(rentSum,resdata.data) //加现在的
            // }

            if(this.couponstext!=''){
              this.couponindex = ''
              this.couponstext = ''
              this.coupons_condition = ''
              this.couponid = ''

              this.calculateRules()
            }else{
              let rentSum = accSub(this.sum,rented) //减原来的
              this.sum = accAdd(rentSum,resdata.data) //加现在的
            }  
            
          } else {
            Toast(resdata.message);
          }
        });
    },

    getaddress(){
      if(this.typenum==1||this.typenum==2){
        if(this.getaddress != ""){
          this.getfreight()
        }
      }
    },
  },
  computed: {
    //总价
    calculatesum: function(){
      if(this.sum-0<0){
        return 0
      }
      return this.sum
    },
    //租金
    calculaterent: function(){
      console.log('rent');
      if(this.rent-0<0){
        return 0
      }
      if(this.couponstext!=''){
        let rentSum = accSub(this.rented,this.couponstext) // -优惠券
        if(rentSum-0<0){
          return 0
        }else{
          return rentSum
        }
      }
      // this.calculateRules()
      return this.rent
    },
    //租期选择
    changeweektext(){
      if(this.typenum == 0){
        if (this.weektext == "天") {
          this.weekval = ''
          this.isdisabled = false;
          return this.weektext
        } else if (this.weektext == "小时") {
          this.weekval = 6;
          this.isdisabled = true;
          return this.weektext
        } else {
          this.weektext = "请选择";
          this.weekval = "";
          this.rent = 0;
          this.rented=0
          return this.weektext
        }
      }else{
        if (this.weektext == "天") {
          this.isdisabled = false;
          return this.weektext
        } else {
          this.weektext = "天";
          this.weekval = "";
          this.rent = 0;
          this.rented=0
          this.isdisabled = false;
          return this.weektext
        }
      }
    },
  },

  created(){
    this.isFirstEnter = true;
  },
  mounted() {    
    this.getotherprice();
    this.getdefaultaddress();
  },
  methods: {
    calculateRules(){
      console.log('calculateRules');
      
      if (this.typenum == 0) {
        if (this.Dinsurance || this.isinsurance) {
          let a = accAdd(this.detail.pay_safe||'', this.detail.safe_price||''); //+保险
          if(this.couponstext!=''){
            let rentSum = accSub(this.rented,this.couponstext) // -优惠券
            if(rentSum-0<0){
              this.sum = accAdd(a,0) 
              return 
            }

            this.sum = accAdd(a,rentSum) 
          }else{
            this.sum = accAdd(a, this.rented); //+租金
          }
        } else {  
          if(this.couponstext!=''){
            let rentSum = accSub(this.rented,this.couponstext) // -优惠券
            if(rentSum-0<0){
              this.sum = accAdd(this.detail.pay_safe||'', 0)
              return 
            }
            this.sum = accAdd(this.detail.pay_safe||'', rentSum)
          }else{
            this.sum = accAdd(this.detail.pay_safe||'', this.rented)
          }
        }
      } else {
        if (this.Dinsurance || this.isinsurance) {
          let a = accAdd(this.detail.pay_safe||'', this.detail.safe_price||'');
          let b = 0
          if(this.couponstext!=''){
            let rentSum = accSub(this.rented,this.couponstext) // -优惠券
            if(rentSum-0<0){
              b = accAdd(a, 0);
            }else{
              b = accAdd(a, rentSum);
            }
          }else{
            b = accAdd(a, this.rented);
          }

          this.sum = accAdd(b, this.freight) //+运费  
        } else {
          let a = 0
          if(this.couponstext!=''){
            let rentSum = accSub(this.rented,this.couponstext) // -优惠券
            if(rentSum-0<0){
              a = accAdd(this.detail.pay_safe||'', 0); 
            }else{
              a = accAdd(this.detail.pay_safe||'', rentSum);
            }
          }else{
            a = accAdd(this.detail.pay_safe||'', this.rented);
          }

          this.sum = accAdd(a, this.freight);
        }
      }
    },
    go(url) {
      let buySession = {
        getlocation: this.getlocation, 
        getdate: this.getdate,
        expectdate: this.expectdate,
        gettime: this.timetext,
        getpeople: this.people,
        getaddress: this.getaddress,
      };
      window.sessionStorage.setItem("buySession", JSON.stringify(buySession));
      this.$router.push({ path: url });
    },
    onConfirmWeek(value, index) {
      // console.log(`当前值：${value}, 当前索引：${index}`);
      this.weektext = value;
      this.showweek = false;
    },
    chooseCalendar(url){
      if(this.typenum == 0){
        if(this.getlocation == ""){
          Toast("请填写自取地点")
          return
        }
      }else {
        if(this.getaddress == ""){
          Toast("请选择收货地址")
          return
        }
      }

      if(this.typenum == 0){
        let urls = url + `?type=${this.typenum}&&ads_id=${this.getlocation.store_id}&&goods_id=${this.$route.query.id}&&sku=${this.detail.sku||''}`
        this.go(urls)
      }else{
        let urls = url + `?type=${this.typenum}&&ads_id=${this.getaddress.ads_id}&&goods_id=${this.$route.query.id}&&sku=${this.detail.sku||''}`
        this.go(urls)
      }
      
    },
    onConfirmTimequantum(value, index) {
      // console.log(`当前值：${value}, 当前索引：${index}`);
      let newdate = new Date()
      if(this.expectdate == `${newdate.getFullYear()}/${newdate.getMonth() + 1}/${newdate.getDate()}`){
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
      this.timequantumtext = value;
      this.showtimequantum = false;
    },
    onswitch(val) {
      //保险费计算
      if (val) {
        this.sum = accAdd(this.sum, this.detail.safe_price);
      } else {
        this.sum = accSub(this.sum, this.detail.safe_price);
      }
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
          Toast(resdata.message);
        }
      });
    },
    //页面数据
    getotherprice() {
      let postData = this.$qs.stringify({
        users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
        goods_id: this.$route.query.id || "",
        sku: this.$route.query.guige
          ? decodeURI(this.$route.query.guige)
          : "",
        cart_id: this.$route.query.cartid || ""
      })
      this.axios
        .post(this.API + "api/Order/GetGoodsDetail", postData)
        .then(res => {
          console.log(res.data, "getotherprice");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.Dinsurance = resdata.data.safe_status == 1 ? true : false;
            this.hire_cate = resdata.data.hire_cate;
            this.guiges = resdata.data.sku==''?'':JSON.parse(resdata.data.sku);
            this.detail = resdata.data;
            // this.goodsimg = resdata.data.gd_img[0]

            if (this.Dinsurance || this.isinsurance) {
              // if买保险
              this.sum = accAdd(resdata.data.pay_safe, resdata.data.safe_price)
            } else {
              this.sum = resdata.data.pay_safe
            }

            if (resdata.data.hire_cate == 1 || resdata.data.hire_cate == 3) {
              this.weekcolumns = ["天"]
            }
            if (resdata.data.hire_cate == 2) {
              this.weekcolumns =  ["天", "小时"]
            }
          } else {
            Toast(resdata.message);
          }
        });
    },
    //运费
    getfreight() {
      let postData = this.$qs.stringify({
        type: this.typenum,
        ads_id: this.getaddress.ads_id,
        goods_id: this.$route.query.id,
        sku: this.guiges||'',
        time: this.expectdate||'',
        order_type:1
      })
      this.axios
        .post(this.API + "api/Order/ExpressPrice", postData)
        .then(res => {
          console.log(res.data, "freight");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.freight = resdata.data.price;
            this.timequantumarr = resdata.data.timelist;
            this.calculateRules()
          } else {
            this.freight = 0
            this.calculateRules()
            if(resdata.message=='请选择其他起租时间！'&&this.expectdate==''){
              
            }else{
              Toast(resdata.message);
            }
          }
        });
    },
    //优惠卷
    onshowcoupon(){
      if (this.weekval == "") {
        Toast("请填写租期")
        return;
      }
      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
        users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
        goods_id: this.$route.query.id,
        money:this.rented
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
      //扣租金
      if (this.weekval == "") {
        Toast("请填写租期")
        return;
      }
      
      if(index+1==this.couponindex){
        this.couponindex = ''
        this.couponstext = ''
        this.coupons_condition = ''
        this.couponid = ''
        this.rent = accAdd(this.rent,item.coupons_money)
        this.calculateRules()
      }else{
        this.rent = accAdd(this.rent,this.couponstext)
        this.couponindex = index+1
        this.couponstext = item.coupons_money
        this.coupons_condition = item.coupons_condition
        this.couponid = item.coupons_id
        this.rent = accSub(this.rent,item.coupons_money)
        this.calculateRules()
        this.showcoupon = false
      }
    },

    nextface() {
      if (this.isconsent) {

        if (this.typenum == 0) {
          if(this.getlocation == ""){
            Toast("请填写自取地点")
            return
          }
          if(this.getdate == ""){
            Toast("请填写自取时间")
            return
          }
          if(this.people == ""){
            Toast("请填写自取人")
            return
          }
          if(this.weektext == "请选择"){
            Toast("请选择租期方式")
            return
          }
          if(this.weekval == ""){
            Toast("请填写租期")
            return
          }
          
          var postData = this.$qs.stringify({
            unt: this.weektext == "天" ? 1 : 2,
            rent_num: this.weekval,
            goods_id: this.$route.query.id,
            users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
            users_name: this.people.name,
            users_phone: this.people.phone,
            users_type: this.people.type == 0 ? 1 : 2,
            store_id: this.getlocation.store_id,
            order_delivery_time: this.getdate,
            safe_status: this.isinsurance ? 1 : 2,
            delivery_way: this.typenum == 0 ? 3 : this.typenum == 1 ? 1 : 2,
            qwsh_time: "",
            sku: this.detail.sku||'',
            time: "",
            ads_id: "",
            way_price: "",
            remark: "",
            timelist: "",
            coupons_id: this.couponid,
            order_type:1
          });
        }
        if (this.typenum == 1) {
          if(this.getaddress == ""){
            Toast("请选择收货地址")
            return
          }
          if(this.weektext == "请选择"){
            Toast("请选择租期方式")
            return
          }
          if(this.weekval == ""){
            Toast("请填写租期")
            return
          }
          if(this.expectdate == ""){
            Toast("请选择期望收到的日期")
            return
          }
 
          var postData = this.$qs.stringify({
            unt: this.weektext == "天" ? 1 : 2,
            rent_num: this.weekval,
            goods_id: this.$route.query.id,
            users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
            safe_status: this.isinsurance ? 1 : 2,
            delivery_way: this.typenum == 0 ? 3 : this.typenum == 1 ? 1 : 2,
            qwsh_time: this.expectdate,
            sku: this.detail.sku||'',
            ads_id: this.getaddress.ads_id,
            way_price: this.freight,
            users_name: "",
            users_phone: "",
            users_type: "",
            store_id: "",
            order_delivery_time: "",
            time: "",
            remark: "",
            timelist: "",
            coupons_id: this.couponid,
            order_type:1
          });
        }
        if (this.typenum == 2) {
          if(this.getaddress == ""){
            Toast("请选择收货地址")
            return
          }
          if(this.weektext == "请选择"){
            Toast("请选择租期方式")
            return
          }
          if(this.weekval == ""){
            Toast("请填写租期")
            return
          }
          if(this.expectdate == ""){
            Toast("请选择期望收到的日期")
            return
          }
          if(this.timequantumtext == ""){
            Toast("请选择配送时间段")
            return
          }
          
          let newdate = new Date()
          if(this.expectdate == `${newdate.getFullYear()}/${newdate.getMonth() + 1}/${newdate.getDate()}`){
            // console.log(newdate.getHours());
            let end = this.timequantumtext.split('-')[1].split(':')[0]
            //+1小时
            newdate = new Date().getTime() + 1000*60*60
            newdate = new Date(newdate)
            let newhours = newdate.getHours()
            // console.log(start,end)
            if(newhours >= end){
              Toast("不在配送时间段")
              return
            }
          }

          var postData = this.$qs.stringify({
            unt: this.weektext == "天" ? 1 : 2,
            rent_num: this.weekval,
            goods_id: this.$route.query.id,
            users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
            safe_status: this.isinsurance ? 1 : 2,
            delivery_way: this.typenum == 0 ? 3 : this.typenum == 1 ? 1 : 2,
            qwsh_time: this.expectdate,
            sku: this.detail.sku||'',
            ads_id: this.getaddress.ads_id,
            way_price: this.freight,
            remark: this.remarkval,
            timelist: this.timequantumtext,
            users_name: "",
            users_phone: "",
            users_type: "",
            store_id: "",
            order_delivery_time: "",
            time: "",
            coupons_id: this.couponid,
            order_type:1
          });
        }
        //是否实名认证
        this.isrealname(postData)
      } else {
        Toast("请先同意租赁协议");
      }
    },

    face(postData){
      Toast.loading({ mask: true, message: "加载中...",duration:0 });
      this.axios.post(this.API + "api/Order/AddOrder", postData).then(res => {
        console.log(res.data, "order");
        let resdata = res.data;
        if (resdata.code == 200) {
          Toast.clear();
          this.$router.push({ path: "/face/" + resdata.data });
        } else {
          Toast.clear();
          Toast(resdata.message||'操作失败');
        }
      })
      .catch(error => {
          Toast.clear()
          Toast('网络出错')
      });
    },

    isrealname(postDataOrder) {
      Toast.loading({ mask: true,message: '加载中...'})
      let postData = this.$qs.stringify({
        users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
      });
      this.axios
        .post(this.API + "api/Lease/user_price", postData)
        .then(res => {
          console.log(res.data, "user_price");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear()
            // resdata.data.is_idcard
            if(resdata.data.is_idcard==0){
                Dialog.confirm({
                  title: "",
                  message: "您还未实名认证，是否前往?",
                  confirmButtonText: '前往',
                  cancelButtonText:'继续'
                })
                .then(() => {
                  // on confirm
                  this.$router.push({ path: "/realname" });
                })
                .catch(() => {
                  this.face(postDataOrder)
                });
            }
            if(resdata.data.is_idcard==1){
              this.face(postDataOrder)
            }
          } else {
            Toast.clear()
            Toast(resdata.message);
          }
        });
    },
  },

  activated() {
     if(!this.$route.meta.isBack || this.isFirstEnter){
        this.goodid = this.$route.query.id
        this.goodsimg =''
        this.typenum = 0
        this.timetext = ""
        this.getdate = ""//自取时间
        this.expectdate = "" //期望收到日期
        this.people = ""
        this.getlocation = ""
        this.getaddress = ""
        this.couponstext = "" //优惠券
        this.showcoupon = false //优惠券
        this.couponindex = '' //优惠券
        this.couponid ='' //优惠券
        this.showweek = false //租期
        this.weekcolumns = []
        this.weektext = "请选择" //租期
        this.isdisabled = true
        this.weekval = "" //租期
        this.isinsurance = true //保险
        this.isconsent = true //协议
        this.couponlist = [] //优惠券
        this.remarkval = ""
        this.timequantumtext = "" //时间段
        this.showtimequantum = false //时间段
        this.timequantumarr = [] //时间段
        this.detail = ""
        this.Dinsurance = false //保险
        this.hire_cate = 1
        this.guiges = []
        this.rent = 0 //租金
        this.rented=0 //用作计算
        this.freight = 0 //运费
        this.sum = 0
        this.getotherprice()
        this.getdefaultaddress()
     }else{
       let buySession = JSON.parse(window.sessionStorage.getItem("buySession"));
        if (buySession) {
          this.getlocation = buySession.getlocation;
          this.getdate = buySession.getdate;
          this.expectdate = buySession.expectdate;
          this.timetext = buySession.gettime;
          this.people = buySession.getpeople;
          this.getaddress = buySession.getaddress;
        }
     }
     this.$route.meta.isBack=false
     this.isFirstEnter=false;
  }
};
</script>

<style scoped>
.pdl10 {
  padding-left: 10px;
}
.nav {
  padding-bottom: 20px;
}
.fs12{
  font-size: 12px;
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

.triangleimg {
  width: 10px;
  height: 6px;
  vertical-align: middle;
  margin-left: 2px;
}
.time {
  display: flex;
}
.time > div {
  width: 70px;
  height: 25px;
  border-radius: 5px;
  overflow: hidden;
}
.time > div:nth-of-type(1) {
  margin-right: 5px;
}
.time input {
  width: 100%;
  text-align: center;
}

.btn {
  display:block;
  width: 100%;
  height: 42px;
  line-height: 42px;
  border-radius: 20px;
  color: #fff;
  background-image: linear-gradient(90deg, #2dbbf1 0%, #4ea9f9 100%);
}

.s_title {
  width: 92%;
  height: 40px;
  line-height: 40px;
}
.close,
.lineheight {
  height: 50px;
  line-height: 50px;
  width: 100%;
}
.dis_clasify {
  font-size: 12px;
  color: #fc3434;
}
.grey_12 {
  font-size: 12px;
  color: #979797;
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
</style>
