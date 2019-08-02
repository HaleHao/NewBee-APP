<template>
  <div>

    <div class="box">
      <div class="flex-jc-center position">
        <div class="banner bgc">
          <van-swipe :autoplay="3000">
            <van-swipe-item v-for="(item, index) in images" :key="index">
              <div class="img_box">
                <img :src="item">
              </div>
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>

      <div class="title">{{detail.model}}</div>
      <div class="detail">
        <div class="hang">
          <span>品类：</span>
          <span>{{detail.cate}}</span>
        </div>
        <div class="hang">
          <span>品牌：</span>
          <span>{{detail.brand}}</span>
        </div>
        <div class="hang">
          <span>序列号：</span>
          <span>{{detail.serial_number}}</span>
        </div>
        <div class="hang">
          <span>颜色：</span>
          <span>{{detail.standards}}</span>
        </div>
        <div class="hang">
          <span>成色：</span>
          <span>{{detail.exterior}}</span>
        </div>
        <div class="hang">
          <span>功能：</span>
          <span>{{detail.functional_status}}</span>
        </div>
        <div class="hang">
          <span>配件：</span>
          <span>{{detail.parts_list==''?'无':detail.parts_list}}</span>
        </div>
      </div>
    </div>

    <!-- 审核中 -->
    <div class="state text-c" v-if="detail.trust_status=='待审核'">
      <div>您的物品正在审核中</div>
      <div>请耐心等候！</div>
    </div>
    <!-- 未通过 -->
    <div class="state text-c" v-if="detail.trust_status=='审核未通过'">
      <div>很抱歉！</div>
      <div>您的资料未通过审核</div>
      <div>原因：{{detail.reasons_refusal}}</div>
    </div>

    <template v-if="detail.trust_status=='审核通过'">

    <div class="bgc">
      <div class="pd-15">交付方式</div>
      <div class="nav bgc pd-lr-15">
        <div :class="{ 'fc-blue selected': typenum==0 }" @click="typenum=0">
          <div>现场交付</div>
        </div>

        <div :class="{ 'fc-blue selected': typenum==1 }" @click="typenum=1">
          <div>快递交付</div>
        </div>
        <div :class="{ 'fc-blue selected': typenum==2 }" @click="typenum=2">
          <div>平台配送</div>
        </div>
      </div>
    </div>
    
    <div class="flex-jc-center btn_box">
      <div class="btn text-c" @click="next">下一步</div>
    </div>

    </template>

    <!-- 托管成功弹窗 -->
    <van-popup v-model="showmodel" :close-on-click-overlay="false">
      <div class="text-c position mask_box">
        <div class="flex-jc-center">
          <img src="../../../assets/tg_success.png" class="tg_success">
          <span class="icon" @click="showmodel = false">
            <van-icon name="cross" color="#aeaeae" size="25px"/>
          </span>
        </div>

        <div class="gongxi">恭喜，审核成功！</div>
        <div class="gongxi">请将设备交给我们保管吧！</div>
        <!-- <div class="zhiyin">
          说明
        </div> -->
      </div>
    </van-popup>

    <div class="model full flex-column-center position" v-show="showcode">
      <div class="closeimg" @click="showcode = false"><van-icon name="close" color="#fff"/></div>
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
import { Toast } from "vant";
export default {
  data() {
    return {
      images: [],
      typenum: 0,
      showmodel: false,
      detail:'',

      codeimg:'',
      showcode:false,
    };
  },
  mounted(){
    this.getdetail()
  },
  methods: {
    onChange(index) {
      this.current = index;
    },

    getdetail(){
      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
          // users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
          trust_id: this.$route.params.id
      });
      this.axios.post(this.API + "api/Trusteeship/trustDetails", postData)
      .then(res => {
          console.log(res.data, "detail");
          let resdata = res.data;
          if (resdata.code == 200) {
              Toast.clear();
              this.detail = resdata.data
              this.images= [resdata.data.phone_picture]

              if(resdata.data.trust_status=='审核通过'){
                this.showmodel = true
              }
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

    next(){
      let id = this.$route.params.id
      if(this.typenum==0){
        // window.sessionStorage.removeItem('sceneDeliSession');
        // this.$router.push({ path: "/sceneDeli/"+id })
        Toast.loading({ mask: true, message: "加载中..." });
        let postData = this.$qs.stringify({
            // users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
            trust_id: id,
        });
        this.axios.post(this.API + "api/Trusteeship/fieldDelivery", postData)
        .then(res => {
            console.log(res.data, "code");
            let resdata = res.data;
            if (resdata.code == 200) {
                Toast.clear();
                this.codeimg = resdata.data
                this.showcode = true
            } else {
                Toast.clear();
                Toast(resdata.message);
            }
        })
        .catch(error => {
            Toast.clear();
            Toast('网络出错')
        });
      }
      if(this.typenum==1){
        window.sessionStorage.removeItem('postDeliSession');
        this.$router.push({ path: "/postDeli/"+id })
      }
      if(this.typenum==2){
        window.sessionStorage.removeItem('platformDeliSession');
        this.$router.push({ path: "/platformDeli/"+id })
      }
    }
  }
};
</script>

<style scoped>
.box {
  margin: 15px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 18px 0px rgba(188, 188, 188, 0.32);
  overflow: hidden;
}

.banner {
  width: 290px;
  height: 230px;
}
.img_box {
  width: 290px;
  height: 230px;
}
.img_box img {
  width: 100%;
  height: 100%;
}
.title {
  margin: 10px;
  font-size: 16px;
}
.detail {
  padding: 10px;
  color: #383838;
}
.hang {
  line-height: 30px;
}
.state {
  margin: 15px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 18px 0px rgba(188, 188, 188, 0.32);
  color: #4ea9f9;
  padding: 30px 0;
}

.nav {
  padding-bottom: 15px;
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
.hostcode {
  padding: 25px 15px;
}
.img_r {
  width: 5px;
  height: 10px;
}
.btn_box {
  width: 100%;
  padding-top: 30px;
}
.btn {
  width: 280px;
  height: 40px;
  margin-bottom: 20px;
  line-height: 40px;
  background: linear-gradient(90deg, #60c0fd, #4ea9f9);
  border-radius: 20px;
  color: #fff;
}

/* 托管成功弹窗样式 */
.mask_box {
  width: 240px;
  margin: 25px;
}
.gongxi {
  font-size: 15px;
  height: 25px;
  line-height: 25px;
}
.icon {
  position: absolute;
  top: -10px;
  right: -10px;
}
.tg_success {
  width: 80px;
  height: 85px;
  margin: 10px;
}
.zhiyin {
  color: #aeaeae;
  margin-top: 10px;
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

