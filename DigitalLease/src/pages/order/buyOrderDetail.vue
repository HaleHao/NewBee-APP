<template>
  <div>
    <div class="header text-c">
      <div class="mar-b-10 fsz18">
        <span v-if="data.buyorder_status==1">待付款</span>
        <span v-if="data.buyorder_status==2||data.buyorder_status==3">待发货</span>
        <span v-if="data.buyorder_status==4">待收货</span>
        <span v-if="data.buyorder_status==6">已完成</span>
        <span v-if="data.buyorder_status==5">待评价</span>
      </div>
      <div class="fc-blue fsz13" v-if="data.buyorder_status==1">剩余{{minutes}}分钟{{seconds}}秒的支付时间</div>
    </div>

    <div class="pd-lr-15">
      <div class="bgc main">
        <div class="goods flexbox box-sizing">
          <div class="flex-1">
            <div class="mar-b-10">{{data.goods_name}}</div>
            <div class="spec mar-b-10">
              <span v-for="(item,index) in data.spec" :key="index">{{item[0]}}</span>
            </div>
            <div style="color:#666">
              <span v-if="data.buyorder_type==1">全新正品</span>
              <span v-if="data.buyorder_type==2">本机</span>
            </div>
          </div>
          <img :src="data.gd_img" :alt="data.goods_name">
        </div>

        <template v-if="data.buyorder_type==1">
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
        </template>

        <div>
          <div class="title position">
            订单信息
            <div class="l dot"></div>
            <div class="r dot"></div>
          </div>
          <div class="info">
            <div class="flexbox">
              <span>订单号</span>
              <span class="flex-1">{{data.buyorder_no}}</span>
            </div>
            <div class="flexbox">
              <span>下单时间</span>
              <span class="flex-1">{{data.create_time}}</span>
            </div>
            <div class="flexbox" v-if="data.buyorder_type==1">
              <span>取货方式</span>
              <span class="flex-1">
                {{data.delivery_way==1?'快递':data.delivery_way==2?'平台配送':data.delivery_way==3?'自取':''}}
              </span>
            </div>

            <template v-if="(data.delivery_way==1&&data.buyorder_type==1)||(data.delivery_way==2&&data.buyorder_type==1)">
            <div class="flexbox" >
              <span>收货地址</span>
              <span class="flex-1">
                {{data.province+data.city+data.district+data.buyorder_address}}
              </span>
            </div>
            <div class="flexbox">
              <span>收货人</span>
              <span class="flex-1">
                {{data.buyorder_name}}
              </span>
            </div>
            <div class="flexbox">
              <span>收货人手机号码</span>
              <span class="flex-1">
                {{data.buyorder_phone}}
              </span>
            </div>
            <div class="flexbox" >
              <span>到货时间</span>
              <span class="flex-1">
                {{data.qwsh_time}}
              </span>
            </div>
            </template>
            
            <div class="flexbox" v-if="data.delivery_way==2&&data.buyorder_type==1">
              <span>配送时间段</span>
              <span class="flex-1">
                {{data.timelist}}
              </span>
            </div>

            <template v-if="data.delivery_way==3&&data.buyorder_type==1">
            <div class="flexbox">
              <span>自取地点</span>
              <span class="flex-1">
                {{data.province+data.city+data.district+(data.buyorder_address||'')}}
              </span>
            </div>
            <div class="flexbox">
              <span>自取时间</span>
              <span class="flex-1">{{data.qwsh_time}}</span>
            </div>
            <div class="flexbox">
              <span>联系人</span>
              <span class="flex-1">{{data.buyorder_name}}</span>
            </div>
            <div class="flexbox">
              <span>手机号码</span>
              <span class="flex-1">{{data.buyorder_phone}}</span>
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
            <!-- 租转售 -->
            <div class="flexbox">
              <span>商品价格</span>
              <span class="flex-1">¥{{data.selling_price||'0.00'}}</span>
            </div>
            <div class="flexbox">
              <span>租金抵扣</span>
              <span class="flex-1">¥{{data.rental||'0.00'}}</span>
            </div>
            <!-- 租转售  end-->
            <div class="flexbox">
              <span>优惠券</span>
              <span class="flex-1">¥{{data.coupons_money||'0.00'}}</span>
            </div>
            <div class="flexbox" v-if="data.delivery_way==2&&data.buyorder_type==1">
              <span>配送运费</span>
              <span class="flex-1">¥{{data.way_price||'0.00'}}</span>
            </div>
            <div class="flexbox" v-if="data.delivery_way==1&&data.buyorder_type==1">
              <span>快递费</span>
              <span class="flex-1">¥{{data.way_price||'0.00'}}</span>
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

    <div class="height"></div>

    <div class="tools bgc border-t" :style="active==1||active==4?'opacity: 0;':''">
      <div class="flex-center border-blue fc-blue" v-if="data.buyorder_status==1" @click="gopay(data.buyorder_id)">
        支付
      </div>
      <div class="flex-center border" @click="getcode(data.buyorder_id)" v-if="data.buyorder_status==4">取货码</div>
      <div class="flex-center border-blue fc-blue" v-if="data.buyorder_status==4" @click="onConfirmGoods(data.buyorder_id)">确认收货</div>
      <div class="flex-center border-blue fc-blue" v-if="data.buyorder_status==5">
          <router-link v-bind="{to: `/comments/${data.buyorder_id}/${data.goods_id}?type=buyorder`}">评价</router-link>
      </div>
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
import { Toast } from 'vant';
let payCountdown = ''

export default {
  data(){
    return {
      showlogistics:false,
      data:'',
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
      active: this.$route.query.active,
      codeimg:'',
      showcode: false,
      minutes: '-',
      seconds: '-',
    }
  },
  created(){
    this.getdata()
  },
  mounted(){

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
    gopay(id){
      window.sessionStorage.removeItem("wxbuypaySession");
        this.$router.push({ path: `/buypay/${id}` });
    },

    getdata(){
      Toast.loading({ mask: true,message: '加载中...'})
      let postData = this.$qs.stringify({
          users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
          buyorder_id:this.$route.params.id,
      })
      this.axios.post(this.API + "api/Buy_Order/orderDetails",postData)
      .then(res => {
          console.log(res.data, "data")
          let resdata = res.data
          if (resdata.code == 200) {
            Toast.clear()
            this.data = resdata.data[0]

            if(this.data.buyorder_status==1){
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
    onshowlogistics(){
      this.queryLogistics()
      this.showlogistics=true
    },
        //物流
    queryLogistics(){
      let postData = this.$qs.stringify({
          buyorder_id: this.$route.params.id,
        });
        this.axios.post(this.API + "api/Buy_Order/queryLogistics", postData)
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
    onshowmodel(id){
        this.orderid = id
        if(this.showmodel){
            this.showmodel = false
        }else{
            this.showmodel = true
        } 
        },
    //二维码
    getcode(id) {
      if(this.showcode){
          this.showcode = false
      }else{
        Toast.loading({ mask: true,message: '加载中...'})
        let postData = this.$qs.stringify({
            buyorder_id:id
        });
        this.axios.post(this.API + "api/Buy_Order/createCode", postData)
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
    //确认收货
        onConfirmGoods(id){
            Toast.loading({ mask: true,message: '加载中...'})
            let postData = this.$qs.stringify({
                users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
                buyorder_id:id,
            });
            this.axios.post(this.API + "api/Buy_Order/confirmReceipt", postData)
            .then(res => {
                console.log(res.data, "onConfirmGoods");
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
  },

  beforeDestroy(){
    clearInterval(payCountdown)
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
.express .item > span:nth-of-type(1){
    width: 50px;
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
