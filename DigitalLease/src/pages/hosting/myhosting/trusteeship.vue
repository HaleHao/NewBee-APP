<template>
  <div>
    <div class="nav bgc border-b flex-jc-center">
        <div :class="{ selected: selected==0 }" @click="selected=0">有硬件</div>
        <div :class="{ selected: selected==1 }" @click="selected=1">无硬件</div>
    </div>

    <div id="nav" v-if="selected==0">
      <van-tabs @click="ontab" v-model="ind">
        <van-tab :title="item" v-for="(item,index) in navtitle" :key="index">
          <div v-show="list.length==0" class="fc-grey text-c pd-15 fsz-12">没有更多了</div>
          
          <div class="position" v-for="(item,index) in list" :key="index">
            <div class="box flex-jc-around bgc" @click="toDetail(item.trust_id,item.trust_status)">
              <div>
                <img
                  v-lazy="item.phone_picture"
                  class="goods_img"
                >
              </div>
              <div class="pd-15 flex-column-space-between">
                <div class="goods_title newline">{{item.model}}</div>
                <div class="flex-jc-between flex-align-items">
                  <div class="state">
                    <!-- <span v-if="item.trust_status=='待审核'||item.trust_status=='审核通过'||item.trust_status=='审核未通过'">审核中</span> -->
                    <span v-if="item.trust_status=='待审核'">审核中</span>
                    <span v-if="item.trust_status=='审核通过'">已通过</span>
                    <span v-if="item.trust_status=='审核未通过'">未通过</span>
                    <span v-if="item.trust_status=='快递中'||item.trust_status=='主机入库中'">待入库</span>
                    <span v-if="item.trust_status=='托管中'&&item.host_state=='在库'">在库</span>
                    <span v-if="item.trust_status=='托管中'&&item.host_state=='租赁中'">出租中</span>
                    <span v-if="item.trust_status=='已退回'">已退回</span>
                  </div>
                  <div>
                    <div class="btn border fc-grey" v-if="item.trust_status=='托管中'" @click.stop="cancelTg(item.trust_id,item.serial_number)">取消托管</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>

    <div id="nav" v-if="selected==1">
      <van-tabs @click="onnottab" v-model="notid">
        <van-tab :title="item" v-for="(item,index) in notnavtitle" :key="index">
          <div v-show="nolist.length==0" class="fc-grey text-c pd-15 fsz-12">没有更多了</div>
          
          <div class="position" v-for="(item,index) in nolist" :key="index">
            <div class="box bgc" @click="tonotDetail(item)">
              <div class="pd-15 flex-column-space-between">
                <div class="goods_title newline mar-b-10">{{item.cate}}</div>
                <div class="fsz12 mar-b-10" v-if="item.trust_price&&item.trust_price!=''">总价:{{item.trust_price||'0.00'}}</div>
                <div class="flex-jc-between flex-align-items">
                  <div class="state">
                    <!-- <span v-if="item.state=='未审核'||item.state=='审批通过'||item.state=='审批未通过'||item.state=='后台报价中'">审核中</span> -->
                    <span v-if="item.state=='未审核'||item.state=='后台报价中'">审核中</span>
                    <span v-if="item.state=='审批通过'">已通过</span>
                    <span v-if="item.state=='审批未通过'">未通过</span>
                    <span v-if="item.state=='用户待确认'">待确认</span>
                    <span v-if="item.state=='待支付'">待支付</span>
                    <span v-if="item.state=='托管采购中'||item.state=='托管入库中'">待入库</span>
                    <span v-if="item.state=='托管中'&&item.equipment.host_state=='在库'">在库</span>
                    <span v-if="item.state=='托管中'&&item.equipment.host_state=='租赁中'">出租中</span>
                  </div>
                  <div>
                    <div class="btn border fc-grey" v-if="item.state=='用户待确认'"  @click.stop="oncCancel(item.no_hardware_id)">取消</div>
                    <div class="btn border-blue fc-blue" v-if="item.state=='用户待确认'"  @click.stop="onConfirm(item.no_hardware_id)">确认</div>
                    <div class="btn border-blue fc-blue" v-if="item.state=='待支付'" @click.stop="gopay(item.no_hardware_id,item.trust_price)">支付</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>

  </div>
</template>

<script>
import { Toast,Dialog } from "vant";
export default {
  beforeRouteEnter(to, from, next) {
    let urlarr = ['审核详情','托管详情','取消托管','详情','支付']
    if(urlarr.includes(from.meta.title)) {
        to.meta.isBack = true;
    }
    next();
  },
  data() {
    return {
      navtitle: ["全部", "审核中", "托管中", "已退回"],
      notnavtitle: ["全部", "审核中", "托管中"],
      list: [],
      ind: 0,
      selected: 0,
      notid: 0,
      nolist:[]
    };
  },
  watch:{
    selected(val){
      console.log(val)
      if(val==0){
        this.ind=0
        this.getlist()
      }
      if(val==1){
        this.notid=0
        this.getnotlist()
      }
    }
  },
  beforeCreate(){
    if (!window.localStorage.getItem("userinfo")) {
      this.$router.replace({ path: "/login" });
    }
  },
  created() {
    this.isFirstEnter = true;
  },
  mounted(){
    if(this.selected==0){
        this.getlist()
      }
    if(this.selected==1){
      this.getnotlist()
    }
  },
  methods: {
    ontab(index, title) {
      console.log(index, title);
      this.getlist()
    },
    getlist(){
      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
          users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
          state: this.ind
      });
      this.axios.post(this.API + "api/Trusteeship/queryTrusteeship", postData)
      .then(res => {
          console.log(res.data, "list");
          let resdata = res.data;
          if (resdata.code == 200) {
              Toast.clear();
              this.list = resdata.data
          } else {
              Toast.clear();
              this.list = []
              Toast(resdata.message);
          }
      })
      .catch(error => {
          Toast.clear();
          this.list = []
          Toast('网络出错')
      });
    },
    onnottab(index, title){
      console.log(index, title);
      this.getnotlist()
    },
    getnotlist(){
      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
          users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
          state: this.notid
      });
      this.axios.post(this.API + "api/Trusteeship/queryNohardware", postData)
      .then(res => {
          console.log(res.data, "nolist");
          let resdata = res.data;
          if (resdata.code == 200) {
              Toast.clear();
              //if有序列号设备,拆分
              let list = [...resdata.data]
              for (let [index, val] of resdata.data.entries()) {
                if(!val.seriale.length==0){
                  let arr = []
                  for(let [index1, val1] of val.seriale.entries()){
                    let obj = {
                      ...val,
                      equipment: val1
                    }
                    arr.push(obj)

                    if(index1 == val.seriale.length-1){
                      list.splice(index,1,...arr)
                      arr = []
                    }
                  }
                }
              }

              this.nolist = list
              console.log(list)
          } else {
              Toast.clear();
              this.nolist = []
              Toast(resdata.message);
          }
      })
      .catch(error => {
          Toast.clear();
          this.nolist = []
          Toast('网络出错')
      });
    },
    tonotDetail(item){
      let hostnumber = item.equipment?item.equipment.host_number:''
      this.$router.push({ path: `/notDetail/${item.no_hardware_id}?hostnumber=${hostnumber}` });
    },
    //托管详情
    toDetail(id,status) {
      if (status=='待审核'||status=='审核通过'||status=='审核未通过'||status=='快递中'||status=='主机入库中') {
        this.$router.push({ path: "/hostDetail/"+id });
      }
      if (status=='托管中') {
        this.$router.push({ path: "/hostingDetail/"+id });
      }
      if (status=='已退回') {
        this.$router.push({ path: "/hostingExpress/"+id });
      }
    },
    //取消托管
    cancelTg(id,serial_number) {
      window.sessionStorage.removeItem("hostCancelSession");
      window.sessionStorage.removeItem("wxpayhcSession");
      this.$router.push({ path: "/hostCancel/"+id + '/' + serial_number });
    },
    //确认
    onConfirm(id){
      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
          users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
          no_hardware_id: id,
          userValidation:1
      });
      this.axios.post(this.API + "api/Trusteeship/userValidation", postData)
      .then(res => {
          console.log(res.data, "nolist");
          let resdata = res.data;
          if (resdata.code == 200) {
              Toast.clear();
              this.getnotlist()
          } else {
              Toast.clear();
              Toast(resdata.message);
          }
      })
      .catch(error => {
          Toast.clear();
          Toast('网络出错')
      });
    },
    //取消
    oncCancel(id){
      Dialog.confirm({
        title: "",
        message: "是否取消?"
      })
      .then(() => {
        // on confirm
        Toast.loading({ mask: true, message: "加载中..." });
        let postData = this.$qs.stringify({
            users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
            no_hardware_id: id,
            userValidation:2
        });
        this.axios.post(this.API + "api/Trusteeship/userValidation", postData)
        .then(res => {
            console.log(res.data, "nolist");
            let resdata = res.data;
            if (resdata.code == 200) {
                Toast.clear();
                this.getnotlist()
            } else {
                Toast.clear();
                Toast(resdata.message);
            }
        })
        .catch(error => {
            Toast.clear();
            Toast('网络出错')
        });
      })
      .catch(() => {
        
      });
    },
    gopay(id,money){
      window.sessionStorage.removeItem("wxbuypaySession");
      this.$router.push({ path: "/notpay/"+id+'?money='+money });
    }
  },

  activated() {
     if(!this.$route.meta.isBack || this.isFirstEnter){
       this.ind=0
       this.list=[]
       this.selected= 0
       this.notid = 0
       this.nolist = []
      if(this.selected==0){
        this.getlist()
        }
      if(this.selected==1){
        this.getnotlist()
      }
     }else{
      if(this.selected==0){
        this.getlist()
      }
      if(this.selected==1){
        this.getnotlist()
      }       
     }
     this.$route.meta.isBack=false
     this.isFirstEnter=false;
  },
};
</script>

<style scoped>
.fsz12{
  font-size: 12px;
}

.nav {
  height: 42px;
  line-height: 42px;
}
.nav > div {
  color: #666;
  font-size: 16px;
}
.nav > div:nth-of-type(1) {
  margin-right: 50px;
}
.nav .selected {
  color: #000;
  font-weight: bold;
}

#nav >>> .van-tabs__line {
  background-color: #fff;
  background-image: linear-gradient(90deg, #6c76ed 0%, #74d2ff 100%);
} 
.box {
  margin: 10px 15px 0 15px;
  border-radius: 10px;
}

.goods_img {
  width: 100px;
  height: 100px;
  padding: 10px;
  border-radius: 13px;
}

.goods_title {
  font-size: 15px;
  width: 135px;
}
.state {
  color: #aeaeae;
}

.btn {
  border-radius: 15px;
  padding: 5px 10px;
  display: inline-block;
}
</style>


