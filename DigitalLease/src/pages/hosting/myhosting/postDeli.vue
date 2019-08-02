<template>
  <div class="bgc full">

    <div class="nav bgc flex-jc-between">
      <div :class="{ 'fc-blue selected': typenum==0 }" @click="typenum=0">预约快递</div>
      <div :class="{ 'fc-blue selected': typenum==1 }" @click="typenum=1">已寄出</div>
    </div>
    <div v-show="typenum==0">
      <div
        class="flex-jc-between pd-15 bgc border-b flex-align-items"
        @click="go('/calendar/postDeli')"
      >
        <span class="custom-text">期望揽收日期</span>
        <span class="flex-align-items fsz12" :class="datetext==''?'fc-grey':''">
          {{datetext==''?'':datetext}}
          <van-icon name="arrow" color="#aeaeae"/>
        </span>
      </div>
      <div class="flex-jc-between pd-15 bgc border-b flex-align-items" @click="showtime=true">
        <span class="custom-text">时间段</span>
        <span class="flex-align-items fsz12">
          {{timequantum}}
          <van-icon name="arrow" color="#aeaeae"/>
        </span>
      </div>

      <div
        class="flex-jc-between pd-15 bgc border-b flex-align-items"
        @click="go('/addresslist/postDeli')"
      >
        <div>
          <div class="fc-grey">选择发货地址</div>
          <div class="fsz12">{{getaddress.ads_user||''}}  {{getaddress.ads_phone||''}} <van-tag plain v-if="getaddress.ads_state==2">默认</van-tag></div>
          <div class="fsz12">{{(getaddress.ads_province||'')+(getaddress.ads_city||'')+(getaddress.ads_district||'')+(getaddress.ads_address||'')}}</div>
        </div>
        <van-icon name="arrow" color="#aeaeae"/>
      </div>

      <div
        class="flex-jc-between pd-15 bgc flex-align-items"
        @click="go('/nearshop?type=postDeli')"
      >
        <div>
          <div class="fc-grey">选择交付门店</div>
          <div class="fsz12">{{getlocation.store_name||''}}</div>
          <div class="fsz12">{{(getlocation.store_province||'')+(getlocation.store_city||'')+(getlocation.store_district||'')+(getlocation.store_Address||'')}}</div>
        </div>
        <van-icon name="arrow" color="#aeaeae"/>
      </div>

      <div class="flex-jc-center bgc btn_box">
        <div class="btn text-c" @click="submit1">提交</div>
      </div>
    </div>

    <div v-show="typenum==1">
      <input v-model.trim="postnum" placeholder="请输入顺丰单号" type="text">

      <div class="flex-jc-center bgc btn_box">
        <div class="btn text-c" @click="submit2">提交</div>
      </div>
    </div>

    <van-popup v-model="showtime" position="bottom" :close-on-click-overlay="false">
      <van-picker show-toolbar :columns="timequantumarr" @cancel="showtime = false" @confirm="onConfirm"/>
    </van-popup>

  </div>
</template>

<script>
import { Toast,Dialog } from 'vant';
export default {
  data() {
    return {
      typenum: 0,
      postnum: "",
      datetext: "",
      showtime: false,
      getaddress: "",
      getlocation: "",
      timequantum:'',
      timequantumarr:[]
    };
  },
  created() {
    let postDeliSession = JSON.parse(
      window.sessionStorage.getItem("postDeliSession")
    );
    if (postDeliSession) {
      this.getlocation = postDeliSession.getlocation;
      this.datetext = postDeliSession.date;
      this.timequantum = postDeliSession.timequantum;
      this.getaddress = postDeliSession.getaddress;
      this.postnum = postDeliSession.postnum;
    }else{
      this.getdefaultaddress()
    }
  },
   mounted(){
    this.gettimequantumarr()
  },
  methods: {
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
                    }
                }
            } else {
                // Toast(resdata.message)
            }
        });
    },
    gettimequantumarr(){
        this.axios.post(this.API + "api/Lease_Order/getSFTime")
        .then(res => {
            console.log(res.data, "timequantum")
            let resdata = res.data
            if (resdata.code == 200) {
                let arr = []
                for(let v of resdata.data){
                    arr.push(v[0])  
                }
                this.timequantumarr = arr
            } else {
                Toast(resdata.message)
            }
        });
    },
    onConfirm(value) {
      console.log(`当前值：${value}`);
      this.timequantum = value;
      this.showtime = false;
    },

    submit1() {
     if(this.datetext==''||this.timequantum==''||this.getaddress==''||this.getlocation==''){
          Toast('还有未填写')
          return
      }

      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
          // users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
          trust_id: this.$route.params.id,
          year: this.datetext,
          time: this.timequantum,
          ads_id:this.getaddress.ads_id,
          store_id: this.getlocation.store_id
      });
      this.axios.post(this.API + "api/Trusteeship/onlineAppointment", postData)
      .then(res => {
          console.log(res.data, "detail");
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
      })
      .catch(error => {
          Toast.clear();
          Toast('网络出错')
      });
    },
    submit2() {
     if(this.postnum==''){
          Toast('还有未填写')
          return
      }

      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
          // users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
          trust_id: this.$route.params.id,
          express_no: this.postnum
      });
      this.axios.post(this.API + "api/Trusteeship/surrender", postData)
      .then(res => {
          console.log(res.data, "detail");
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
      })
      .catch(error => {
          Toast.clear();
          Toast('网络出错')
      });
    },

    go(url) {
      let postDeliSession = {
        getlocation: this.getlocation,
        date: this.datetext,
        timequantum: this.timequantum,
        getaddress: this.getaddress,
        postnum: this.postnum
      };
      window.sessionStorage.setItem(
        "postDeliSession",
        JSON.stringify(postDeliSession)
      );
      this.$router.push({ path: url });
    }
  }
};
</script>
<style scoped>
.box {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 18px 0px rgba(188, 188, 188, 0.32);
  border-radius: 10px;
  margin: 15px;
}
.shop_title {
  font-size: 15px;
  color: #7a7a7a;
}
.txt {
  font-size: 12px;
  width: 220px;
  color: #dcdddf;
}
.ck_img {
  width: 10px;
  height: 12px;
}
.dt {
  padding: 15px;
}
.img_r {
  width: 6px;
  height: 12px;
}

.nav {
  margin: 0 40px;
  padding: 15px 0;
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
  padding: 30px 15px;
}

.custom-text {
  color: #aeaeae;
  font-size: 14px;
}

input {
  width: 280px;
  padding: 15px 0;
  margin: 0 15px;
  font-size: 14px;
}
input::placeholder {
  color: #aeaeae;
}
.logist {
  margin: 15px;
}

.btn_box {
  width: 100%;
  margin-top: 30px;
  margin-bottom: 15px;
}
.btn {
  width: 280px;
  height: 40px;
  line-height: 40px;
  background: linear-gradient(90deg, #60c0fd, #4ea9f9);
  border-radius: 20px;
  color: #fff;
}
</style>

