<template>
  <div class="bgc full">
    <div
      class="flex-jc-between flex-align-items border-b pd-15 box"
      @click="go('/calendar/platformDeli')"
    >
      <diV>
        <div class="mar-b-10">交付日期</div>
        <div class :class="datetext==''?'':'time'">{{datetext==''?'请选择日期':datetext}}</div>
      </diV>
      <div class="flex-align-items fc-grey">
        <van-icon name="arrow"/>
      </div>
    </div>

    <div class="flex-jc-between flex-align-items border-b pd-15 box" @click="isshow = true">
      <diV>
        <div class="mar-b-10">时间段</div>
        <div :class="timequantum==''?'':'time'">{{timequantum==''?'请选择交付时间段':timequantum}}</div>
      </diV>
      <div class="flex-align-items fc-grey">
        <van-icon name="arrow"/>
      </div>
    </div>

    <div
        class="flex-jc-between pd-15 bgc flex-align-items"
        @click="go('/addresslist/platformDeli')"
      >
        <div>
          <div class="fc-grey">选择发货地址</div>
          <div class="fsz12 time">{{getaddress.ads_user||''}}  {{getaddress.ads_phone||''}} <van-tag plain v-if="getaddress.ads_state==2">默认</van-tag></div>
          <div class="fsz12 time">{{(getaddress.ads_province||'')+(getaddress.ads_city||'')+(getaddress.ads_district||'')+(getaddress.ads_address||'')}}</div>
        </div>
        <van-icon name="arrow" color="#aeaeae"/>
    </div>

    <div
        class="flex-jc-between pd-15 bgc flex-align-items"
        @click="go('/nearshop?type=platformDeli')"
      >
        <div>
          <div class="fc-grey">选择交付门店</div>
          <div class="fsz12 time">{{getlocation.store_name||''}}</div>
          <div class="fsz12 time">{{(getlocation.store_province||'')+(getlocation.store_city||'')+(getlocation.store_district||'')+(getlocation.store_Address||'')}}</div>
        </div>
        <van-icon name="arrow" color="#aeaeae"/>
      </div>

    <van-popup v-model="isshow" position="bottom" :close-on-click-overlay="false">
      <van-picker show-toolbar :columns="timequantumarr" @cancel="isshow = false" @confirm="onConfirm"/>
    </van-popup>

    <div class="flex-jc-center bgc btn_box">
      <div class="btn text-c" @click="submit">提交</div>
    </div>
  </div>
</template>

<script>
import { Toast,Dialog } from 'vant';
export default {
  data() {
    return {
      isshow: false,
      datetext: "",
      timequantumarr: [],
      timequantum: "",
      getaddress:'',
      getlocation:''
    };
  },
  created() {
    let platformDeliSession = JSON.parse(
      window.sessionStorage.getItem("platformDeliSession")
    );
    if (platformDeliSession) {
      this.datetext = platformDeliSession.date;
      this.timequantum = platformDeliSession.timequantum;
      this.getaddress = platformDeliSession.getaddress;
      this.getlocation = platformDeliSession.getlocation;
    }else{
      this.getdefaultaddress()
    }

  },
  mounted(){
    this.gettimequantumarr()
  },
  methods: {
    go(url) {
      let platformDeliSession = {
        date: this.datetext,
        timequantum: this.timequantum,
        getaddress: this.getaddress,
        getlocation: this.getlocation
      };
      window.sessionStorage.setItem(
        "platformDeliSession",
        JSON.stringify(platformDeliSession)
      );
      this.$router.push({ path: url });
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

    onConfirm(value, index) {
      console.log(`当前值：${value}, 当前索引：${index}`);
      this.timequantum = value;
      this.isshow = false;
    },

    submit(){
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
      this.axios.post(this.API + "api/Trusteeship/delivery", postData)
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
    }
  }
};
</script>

<style scoped>
.img_r {
  width: 5px;
  height: 10px;
}
.time {
  color: black;
}
div {
  color: #aeaeae;
}
.btn_box {
  width: 100%;
  margin-top: 30px;
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

