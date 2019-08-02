<template>
  <div>
    <div class="header text-c">
      <div class="mar-b-10 fsz18">
        <span v-if="data.order_status==6">租赁中</span>
        <span v-if="data.order_status==4">订单关闭</span>
        <span v-if="data.order_status==8">检测中</span>
        <span v-if="(data.order_status==9&&data.user_validation==0)||(data.order_status==9&&!data.user_validation)">售后中</span>
        <span v-if="data.order_status==1">待付款</span>
        <span v-if="data.order_status==5">待收货</span>
        <span v-if="data.order_status==12&&data.backstage!='未审批'">待发货</span>
        <span v-if="data.order_status==12&&data.backstage=='未审批'">取消中</span>
        <span v-if="data.order_status==9&&maintenance_pay==1">退租中</span>
        <span v-if="data.order_status==9&&user_validation==1&&maintenance_pay==0&&data.service_money&&data.service_money>0">售后待确认</span>
        <span v-if="data.order_status==11">已完成</span>
        <span v-if="data.order_status==2">预租中</span>
      </div>
      <div class="fc-blue fsz13" v-if="data.order_status==1">剩余{{minutes}}分钟{{seconds}}秒的支付时间</div>
      <div class="fsz13 fc-grey" v-if="active==7">{{data.withouTreason}}</div>
    </div>

    <div class="pd-lr-15">
      <div class="bgc main">
        <div class="goods flexbox box-sizing">
          <div class="flex-1">
            <div class="mar-b-10">{{data.goods_name}}</div>
            <div class="spec mar-b-10">
              <span v-for="(item,index) in data.spec" :key="index">{{item[0]}}</span>
            </div>
          </div>
          <img :src="data.gd_img" :alt="data.goods_name">
        </div>

        <div v-if="!data.express_no==''">
          <div class="title position">
            快递信息
            <div class="l dot"></div>
            <div class="r dot"></div>
          </div>
          <div class="mar-b-10 fsz13">{{data.express_company}} 运单号：{{data.express_no}}</div>
          <div v-if="logistics.length==0" class="flex-align-items mar-b-10 fc-blue">
            暂无物流信息
          </div>
          <div class="flex-align-items mar-b-10" @click="onshowlogistics" v-else>
            <div class="flex-1">
              <div class="fc-blue mar-b-10">{{logistics[logistics.length-1].AcceptStation}}</div>
              <div class="fsz12">{{logistics[logistics.length-1].AcceptTime}}</div>
            </div>
            <van-icon name="arrow" />
          </div>
        </div>

        <div>
          <div class="title position">
            租赁信息
            <div class="l dot"></div>
            <div class="r dot"></div>
          </div>
          <div class="info">
            <div class="flexbox">
              <span>订单号</span>
              <span class="flex-1">{{data.order_no}}</span>
            </div>
            <div class="flexbox">
              <span>下单时间</span>
              <span class="flex-1">{{data.create_time}}</span>
            </div>
            <div class="flexbox">
              <span>租期</span>
              <span class="flex-1">{{data.rent_time}}天</span>
            </div>
            <div class="flexbox">
              <span>归还日期</span>
              <span class="flex-1">{{data.returnDate}}</span>
            </div>
            <div class="flexbox" v-if="data.delivery_way=='快递'||data.delivery_way=='平台配送'">
              <span>期望收到的日期</span>
              <span class="flex-1">{{data.qwsh_time}}</span>
            </div>
            <div class="flexbox">
              <span>取货方式</span>
              <span class="flex-1">
                {{data.delivery_way}}
              </span>
            </div>

            <template v-if="data.delivery_way=='快递'||data.delivery_way=='平台配送'">
            <div class="flexbox" >
              <span>收货地址</span>
              <span class="flex-1">
                {{data.province+data.city+data.district+data.order_address}}
              </span>
            </div>
            <div class="flexbox">
              <span>收货人</span>
              <span class="flex-1">
                {{data.order_name}}
              </span>
            </div>
            <div class="flexbox">
              <span>收货人手机号码</span>
              <span class="flex-1">
                {{data.order_phone}}
              </span>
            </div>
            <div class="flexbox" v-if="data.order_status==6">
              <span>收货时间</span>
              <span class="flex-1">
                {{data.sh_time}}
              </span>
            </div>
            </template>
            
            <div class="flexbox" v-if="data.delivery_way=='平台配送'">
              <span>配送时间段</span>
              <span class="flex-1">
                {{data.timelist}}
              </span>
            </div>
            <div class="flexbox" v-if="data.remark">
              <span>备注</span>
              <span class="flex-1">
                {{data.remark}}
              </span>
            </div>

            <template v-if="data.delivery_way=='自取'">
            <div class="flexbox">
              <span>自取地点</span>
              <span class="flex-1">
                {{data.store_province+data.store_city+data.store_district+(data.store_Address||'')}}
              </span>
            </div>
            <div class="flexbox">
              <span>自取时间</span>
              <span class="flex-1">{{data.qwsh_time}}</span>
            </div>
            <div class="flexbox">
              <span>联系人</span>
              <span class="flex-1">{{data.order_name}}</span>
            </div>
            <div class="flexbox">
              <span>手机号码</span>
              <span class="flex-1">{{data.order_phone}}</span>
            </div>
            <div class="flexbox" v-if="data.order_status==6">
              <span>取货时间</span>
              <span class="flex-1">
                {{data.order_delivery_time}}
              </span>
            </div> 
            </template>
          </div>
        </div>

        <div>
          <div class="title flex-jc-between position">
            <span>应付总额</span>
            <span class="fc-red">¥{{data.total_price||'0.00'}}</span>
            <div class="l dot"></div>
            <div class="r dot"></div>
          </div>
          <div class="info">
            <template v-if="isgetfriend">
            <div class="flexbox">
              <span>押金</span>
              <span class="flex-1">¥{{data.order_rent||'0.00'}}</span>
            </div>
            <div class="flexbox">
              <span>租金</span>
              <span class="flex-1">¥{{data.rental||'0.00'}}</span>
            </div>
            </template>
            <div class="flexbox">
              <span>保险费</span>
              <span class="flex-1">¥{{data.order_safe||'0.00'}}</span>
            </div>
            <div class="flexbox">
              <span>优惠券</span>
              <span class="flex-1">¥{{data.coupons_money||'0.00'}}</span>
            </div>
            <div class="flexbox" v-if="data.delivery_way=='平台配送'">
              <span>配送运费</span>
              <span class="flex-1">¥{{data.way_price||'0.00'}}</span>
            </div>
            <div class="flexbox" v-if="data.delivery_way=='快递'">
              <span>快递费</span>
              <span class="flex-1">¥{{data.way_price||'0.00'}}</span>
            </div>
            <!-- <div class="flexbox">
              <span>已收定金</span>
              <span class="flex-1">-¥50.00</span>
            </div> -->
            <div class="flexbox">
              <span>免押额度</span>
              <span class="flex-1">¥{{data.order_credit_rent||'0.00'}}</span>
            </div>
          </div>
        </div>

        <div>
          <div class="title position">
            其它信息
            <div class="l dot"></div>
            <div class="r dot"></div>
          </div>
          <div class="info">
            <div class="flexbox" v-if="data.renewalFees!=0">
              <span>续租费</span>
              <span class="flex-1">¥{{data.renewalFees}}</span>
            </div>
            <div class="flexbox" v-if="data.renewalDay!=0">
              <span>续租时间</span>
              <span class="flex-1">{{data.renewalDay}}天</span>
            </div>

            <template v-if="data.order_back_way!='无'">
              <div class="flexbox" >
                <span>退款方式</span>
                <span class="flex-1">{{data.order_back_way}}</span>
              </div>
              <div class="flexbox" v-if="data.order_back_way=='自还'">
                <span>自还时间</span>
                <span class="flex-1">{{data.sendTime}}</span>
              </div>
              <div class="flexbox" v-if="data.order_back_way=='平台配送'">
                <span>配送时间</span>
                <span class="flex-1">{{data.sendTime}}</span>
              </div>
              <div class="flexbox" v-if="data.order_back_way=='快递'">
                <span>快递日期</span>
                <span class="flex-1">{{data.sendTime}}</span>
              </div>
              <div class="flexbox" v-if="data.order_back_way=='快递'&&data.sendExpressNumber">
                <span>物流单号</span>
                <span class="flex-1 flex-jc-between flex-align-items" @click="queryLogisticsBack">
                  <span>{{data.sendExpressNumber}}</span>
                  <span class="fc-blue">查看</span>
                </span>
              </div>
            </template>

            <div class="flexbox" v-if="data.HireFreight">
              <span>到付运费</span>
              <span class="flex-1">￥{{data.HireFreight||'0.00'}}</span>
            </div>
            <div class="flexbox" v-if="data.service_money">
              <span>维修费</span>
              <span class="flex-1">¥{{data.service_money||'0.00'}}</span>
            </div>
            <div class="flexbox" v-if="active==5||active==6">
              <span>退款费</span>
              <span class="flex-1">¥{{data.refundAmount||'0.00'}}</span>
            </div>
          </div>
        </div>

        <!-- 售后中 -->
        <div v-if="salesData==''&&data.order_status==9">
          <div class="title position">
            协商信息
            <div class="l dot"></div>
            <div class="r dot"></div>
          </div>
          <div class="mar-b-10 fc-blue">
            信息上传中
          </div>
        </div>
        <div v-if="!salesData==''">
          <div class="title position">
            协商信息
            <div class="l dot"></div>
            <div class="r dot"></div>
          </div>
          <div class="mar-b-10" v-for="(item,index) in salesData" :key="index">
            <div v-if="item.babelte==0">平台:{{item.content}}</div>
            <div v-if="item.babelte==1">我:{{item.content}}</div>
            <div class="imglist" v-if="item.image">
              <img @click="onImagePreview(item.image)" :src="item.image" alt='图片'>
            </div>
          </div>
        </div>

      </div>
    </div>

    <van-popup v-model="showlogistics" >
      <div class="text-c pd-15">
        快递信息
        <div class="fr"><van-icon name="close" @click="showlogistics=false"/></div>
      </div>
      <div class="express">
          <div class="item" v-for="(item,index) in logistics" :key="index">
              <p style="color:#666">{{item.AcceptTime}}</p>
              <p>{{item.AcceptStation}}</p>
          </div>
      </div>
    </van-popup>
    <van-popup v-model="showlogisticsBack" >
      <div class="text-c pd-15">
        快递信息
        <div class="fr"><van-icon name="close" @click="showlogisticsBack=false"/></div>
      </div>
      <div v-if="logisticsBack.length==0" class="text-c">暂无物流信息</div>
      <div class="express" >
          <div class="item" v-for="(item,index) in logisticsBack" :key="index">
              <p style="color:#666">{{item.AcceptTime}}</p>
              <p>{{item.AcceptStation}}</p>
          </div>
      </div>
    </van-popup>

    <div class="height"></div>

    <div class="tools bgc border-t" v-if="data.order_status!=12&&data.order_status!=8&&data.order_status!=7&&data.order_status!=10&&data.order_status!=2" :style="maintenance_pay==1||active==6?'opacity: 0;':''">
      <template v-if="data.giver_id">
        <template v-if="isgetfriend">
        <div class="flex-center border-blue fc-blue" v-if="data.order_status==1" @click="gopay(data.order_id)" >
          支付
        </div>
        </template>
        <template v-else>
        <div class="flex-center border-blue fc-blue" v-if="data.order_status==5" @click="onConfirmGoods(data.order_id)">确认收货</div>
        <div class="flex-center border" v-if="data.order_status==6" @click="gorelet(data.order_id)">续租</div>
        <div class="flex-center border" @click="gorefund(data.order_id)" v-if="data.order_status==6">退租</div>
        <!-- <div class="flex-center border-blue fc-blue" @click="goshopping(data.order_id)" v-if="data.order_status==6">购买</div> -->
        <div class="flex-center border" v-if="(data.order_status==9&&data.user_validation==0)">
          <router-link v-bind="{to: '/deny/'+data.order_id}">否认</router-link>
        </div>
        <div class="flex-center border-blue fc-blue" v-if="(data.order_status==9&&data.user_validation==0)" @click="onConfirmsales(data.order_id)" >确认</div>
        <div class="flex-center border-blue fc-blue" v-if="data.order_status==9&&user_validation==1&&maintenance_pay==0&&data.service_money&&data.service_money>0" @click="gocompensation(data.order_id)">
          维修费
        </div>
        <div class="flex-center border-blue fc-blue" v-if="active==5">
            <router-link v-bind="{to: `/comments/${data.order_id}/${data.goods_id}?type=leaseorder`}">评价</router-link>
        </div>
        <div class="flex-center border" @click="getcode(data.order_id,1)" v-if="data.order_status==5">取货码</div>
        </template>
        <div class="flex-center border" v-if="data.order_status==4" @click="del(data.order_id)">删除订单</div>
      </template>

      <template v-else>
        <div class="flex-center border-blue fc-blue" v-if="data.order_status==1" @click="gopay(data.order_id)" >
          支付
        </div>
        <div class="flex-center border-blue fc-blue" v-if="data.order_status==5" @click="onConfirmGoods(data.order_id)">确认收货</div>
        <div class="flex-center border" v-if="data.order_status==6" @click="gorelet(data.order_id)">续租</div>
        <div class="flex-center border" @click="gorefund(data.order_id)" v-if="data.order_status==6">退租</div>
        <div class="flex-center border-blue fc-blue" @click="goshopping(data.order_id)" v-if="data.order_status==6">购买</div>
        <div class="flex-center border" v-if="(data.order_status==9&&data.user_validation==0)">
          <router-link v-bind="{to: '/deny/'+data.order_id}">否认</router-link>
        </div>
        <div class="flex-center border-blue fc-blue" v-if="(data.order_status==9&&data.user_validation==0)" @click="onConfirmsales(data.order_id)" >确认</div>
        <div class="flex-center border-blue fc-blue" v-if="data.order_status==9&&user_validation==1&&maintenance_pay==0&&data.service_money&&data.service_money>0" @click="gocompensation(data.order_id)">
          维修费
        </div>
        <div class="flex-center border-blue fc-blue" v-if="active==5">
            <router-link v-bind="{to: `/comments/${data.order_id}/${data.goods_id}?type=leaseorder`}">评价</router-link>
        </div>
        <div class="flex-center border" @click="getcode(data.order_id,1)" v-if="data.order_status==5">取货码</div>
        <div class="flex-center border" v-if="data.order_status==4" @click="del(data.order_id)">删除订单</div>
      </template>
    </div>

    <div class="model full flex-column-center position" v-show="showcode">
      <div class="closeimg" @click="getcode"><van-icon name="close" color="#fff"/></div>
      <img
        :src="codeimg"
        alt="QRcode"
        class="codeimg"
      >
      <div style="color:#fff">请出示此二维码供门店扫码</div>
    </div>
  </div>
</template>

<script>
import { Toast,ImagePreview } from 'vant';
let payCountdown = ''
var instance
export default {
  data(){
    return {
      showlogisticsBack:false,
      logisticsBack:[],
      data:'',
      salesData: '',
      showlogistics:false,
      logistics:[
        // {
        //   AcceptTime: "2014/06/25 08:05:37",
        //   AcceptStation: "正在派件..(派件人:邓裕富,电话:18718866310)[深圳 市]",
        //   Remark: null
        // },
        // {
        //   AcceptTime: "2014/06/25 08:05:37",
        //   AcceptStation: "快件在 深圳集散中心 ,准备送往下一站 深圳 [深圳市]",
        //   Remark: null
        // },
        // {
        //   AcceptTime: "2014/06/25 08:05:37",
        //   AcceptStation: "已收件[深圳市]",
        //   Remark: null
        // },
      ],
      user_validation: this.$route.query.validation,
      maintenance_pay: this.$route.query.maintenance_pay,
      active: this.$route.query.active,
      codeimg:'',
      showcode: false,
      minutes: '-',
      seconds: '-'
    }
  },
  computed:{
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
  created(){
    this.getdata()
  },
  mounted(){
    this.getSalesData()
  },
  methods:{
    // 倒计时
    countdown(val){
      var date = val;
      date = date.substring(0,19);    
      date = date.replace(/-/g,'/'); 
      var timestamp = new Date(date).getTime();
      let newdata = new Date().getTime()
      let timediff = newdata - timestamp

      //计算出相差天数
      var days=Math.floor(timediff/(24*3600*1000))
      //计算出小时数
      var leave1=timediff%(24*3600*1000)    //计算天数后剩余的毫秒数
      var hours=Math.floor(leave1/(3600*1000))
      //计算相差分钟数
      var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
      var minutes=Math.floor(leave2/(60*1000))
      //计算相差秒数
      var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
      var seconds=Math.round(leave3/1000)
      // console.log(" 相差 "+days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒")
      this.minutes = 30-minutes
      this.seconds = 60-seconds
    },
    onImagePreview(imgurl){
      instance = ImagePreview([
        imgurl,
      ]);
    },
    gopay(id){
      window.sessionStorage.removeItem("wxpaySession");
      this.$router.push({ path: `/pay/${id}` });
    },
    gorelet(id){
      window.sessionStorage.removeItem("wxpayReletSession");
      this.$router.push({ path: `/relet/${id}` });
    },
    gocompensation(id){
      window.sessionStorage.removeItem("wxpayCompensationSession");
      this.$router.push({ path: `/compensation/${id}` });
    },
    getdata(){
      Toast.loading({ mask: true,message: '加载中...'})
      let postData = this.$qs.stringify({
          users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
          order_id:this.$route.params.id,
      })
      this.axios.post(this.API + "api/Lease_Order/orderDetails",postData)
      .then(res => {
          console.log(res.data, "data")
          let resdata = res.data
          if (resdata.code == 200) {
            Toast.clear()
            this.data = resdata.data[0]

            if(resdata.data[0].sendTime){
              if(resdata.data[0].sendTime instanceof Object){
                let start_time = resdata.data[0].sendTime.start_time.split(' ')
                let end_time = resdata.data[0].sendTime.end_time.split(' ')

                resdata.data[0].sendTime = `${start_time[0]} ${start_time[1]}-${end_time[1]}`
              }
            }

            if(this.data.order_status==1){
              payCountdown = setInterval(()=>{
                this.countdown(this.data.create_time)
              },1000)
            }

            if(!this.data.express_no==''){
                this.queryLogistics()
            }
          } else {
            Toast.clear()
              Toast(resdata.message)
          }
      })
      .catch(error => {
        Toast.clear()
        Toast('网络出错')
      });
    },
    //售后详情
    getSalesData(){
      Toast.loading({ mask: true,message: '加载中...'})
      let postData = this.$qs.stringify({
          order_id:this.$route.params.id,
      })
      this.axios.post(this.API + "api/Lease_Order/AfterDetails",postData)
      .then(res => {
          console.log(res.data, "getSalesData")
          let resdata = res.data
          if (resdata.code == 200) {
            Toast.clear()
            this.salesData = resdata.data
          } else {
            Toast.clear()
              // Toast(resdata.message)
          }
      })
    },
    onshowlogistics(){
      this.queryLogistics()
      this.showlogistics=true
    },
        //物流
    queryLogistics(){
      let postData = this.$qs.stringify({
          order_id: this.data.order_id,
        });
        this.axios.post(this.API + "api/Lease_Order/queryLogistics", postData)
        .then(res => {
          console.log(res.data, "queryLogistics");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.logistics = resdata.data.Traces
          } else {
            Toast(resdata.message);
          }
        })
        .catch(error => {
          Toast('网络出错')
        });
    },
    //退租物流
    queryLogisticsBack(){
      let postData = this.$qs.stringify({
          order_id: this.data.order_id,
        });
        this.axios.post(this.API + "api/Lease_Order/querySurrenderExpress", postData)
        .then(res => {
          console.log(res.data, "queryLogisticsBack");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.logisticsBack = resdata.data.Traces
            this.showlogisticsBack = true
          } else {
            Toast(resdata.message);
          }
        })
        .catch(error => {
          Toast('网络出错')
        });
    },
    goshopping(id){
      window.sessionStorage.removeItem('shoppingSession');
      window.sessionStorage.removeItem('wxshoppingSession');
      this.$router.push({ path: "/shopping/"+id });
    },
    gorefund(id){
      window.sessionStorage.removeItem('refundSession');
      this.$router.push({ path: "/refund/"+id });
    },
    //确认收货
    onConfirmGoods(id){
      Toast.loading({ mask: true,message: '加载中...'})
      let postData = this.$qs.stringify({
          users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
          order_id:id,
        });
        this.axios.post(this.API + "api/Lease_Order/confirmReceipt", postData)
        .then(res => {
          console.log(res.data, "onConfirmGoods");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear()
            Toast('操作成功')
            this.$router.go(-1);
          } else {
            Toast.clear()
            Toast(resdata.message||'操作失败');
          }
        });
    },
    //确认售后
    onConfirmsales(id){
      Toast.loading({ mask: true,message: '加载中...'})
      let postData = this.$qs.stringify({
          // users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
          order_id:id,
        });
        this.axios.post(this.API + "api/Lease_Order/afterSalesConfirmation", postData)
        .then(res => {
          console.log(res.data, "onConfirmsales");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear()
            this.getlist()
          } else {
            Toast.clear()
            Toast(resdata.message||'操作失败');
          }
        });
    },

    //删除
    del(id){
      Toast.loading({ mask: true,message: '加载中...'})
      let postData = this.$qs.stringify({
          users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
          order_id:id,
        });
        this.axios.post(this.API + "api/Lease_Order/delOrder", postData)
        .then(res => {
          console.log(res.data, "del");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear()
            Toast('操作成功')
            this.$router.go(-1);
          } else {
            Toast.clear()
            Toast(resdata.message||'操作失败');
          }
        });
    },

    //二维码
    getcode(id,type) {
      if(this.showcode){
          this.showcode = false
      }else{
        Toast.loading({ mask: true,message: '加载中...'})
        let postData = this.$qs.stringify({
          users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
          order_id:id,
          way: type
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
            Toast(resdata.message);
          }
        });
      } 
    },
  },

  beforeDestroy(){
    clearInterval(payCountdown)
    if(instance){
      instance.close()
    }
  },
};
</script>

<style scoped>
.fsz18 {
  font-size: 18px;
}
.fsz13 {
  font-size: 13px;
}
.fsz12 {
  font-size: 12px;
}
.fsz16 {
  font-size: 16px;
}
.height {
  height: 55px;
}
.header {
  padding: 15px 0;
}
.main {
  border-radius: 10px;
  padding: 15px;
  overflow: hidden;
}
.main .title {
  font-weight: bold;
  padding: 15px 0;
  border-top: 1px dashed #b7b7b7;
}
.dot {
  width: 14px;
  height: 14px;
  background-color: #f6f6f6;
  border-radius: 50%;
}
.title .l {
  position: absolute;
  top: -7px;
  left: -20px;
}
.title .r {
  position: absolute;
  top: -7px;
  right: -20px;
}
.goods {
  padding-bottom: 15px;
}
.goods img {
  width: 72px;
  height: 72px;
}
.spec > span {
  display: inline-block;
  background-color: #f2f1f1;
  font-size: 12px;
  padding: 1px 5px;
  box-sizing: border-box;
  border-radius: 3px;
  margin-right: 8px;
}
.imglist {
  padding-top: 15px;
  font-size: 0;
}
.imglist > img {
  width: 84px;
  height: 84px;
  /* margin-left: 4px; */
}

.info div {
  padding-bottom: 10px;
}
.info div > span:nth-of-type(1) {
  width: 110px;
}

.tools {
  display: flex;
  justify-content: flex-end;
  padding: 10px 15px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
}
.tools > div {
  height: 25px;
  min-width: 70px;
  border-radius: 20px;
  box-sizing: border-box;
  margin-left: 10px;
  font-size: 13px;
}

.express {
  width: 285px;
  box-sizing: border-box;
  padding-bottom: 10px;
  font-size: 12px;
}
.express .item {
  padding: 10px;
}

.model {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
.model .main {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
.codeimg {
  width: 180px;
  height: 180px;
  margin-bottom:20px;
}
.closeimg {
  width: 34px;
  height: 34px;
  position: absolute;
  right: 20px;
  top: 100px;
  font-size:34px;
}

</style>
