<template>
  <div class="bgc full">
    <div
        class="flex-jc-between pd-15 bgc flex-align-items"
        @click="go('/nearshop?type=sceneDeli')"
      >
        <div>
          <div class="fc-grey">选择交付门店</div>
          <div class="fsz12">{{getlocation.store_name||''}}</div>
          <div class="fsz12">{{(getlocation.store_province||'')+(getlocation.store_city||'')+(getlocation.store_district||'')+(getlocation.store_Address||'')}}</div>
        </div>
        <van-icon name="arrow" color="#aeaeae"/>
    </div>

    <van-cell @click="go('/calendar/sceneDeli')" :border="false">
      <template slot="title">
        <div class="flex-jc-between flex-align-items" >
          <div>
            <div class="custom-text fc-grey">交付日期</div>
            <div
              class="f13"
              :class="datetext==''?'fc-grey':''"
            >{{datetext==''?'请选择日期':datetext}}</div>
          </div>
          <van-icon name="arrow" color="#aeaeae" size="20px"/>
        </div>
      </template>
    </van-cell>

    <div class="flex-jc-center bgc btn_box">
      <div class="btn text-c" @click="submit">提交</div>
    </div>

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
import { Toast,Dialog } from 'vant';
export default {
  data() {
    return {
      datetext: "",
      getlocation: "",
      codeimg:'',
      showcode:false,
    };
  },
  created() {
    let sceneDeliSession = JSON.parse(
      window.sessionStorage.getItem("sceneDeliSession")
    );
    if (sceneDeliSession) {
      this.datetext = sceneDeliSession.date;
      this.getlocation = sceneDeliSession.getlocation;
    }
    //取缓存 end
  },
  methods: {
    go(url) {
      let sceneDeliSession = {
        date: this.datetext,
        getlocation: this.getlocation
      };
      window.sessionStorage.setItem(
        "sceneDeliSession",
        JSON.stringify(sceneDeliSession)
      );
      this.$router.push({ path: url });
    },

    submit() {
      if(this.datetext==''||this.getlocation==''){
          Toast('还有未填写')
          return
      }

      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
          // users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
          trust_id: this.$route.params.id,
          time: this.datetext,
          store_id: this.getlocation.store_id
      });
      this.axios.post(this.API + "api/Trusteeship/fieldDelivery", postData)
      .then(res => {
          console.log(res.data, "detail");
          let resdata = res.data;
          if (resdata.code == 200) {
              Toast.clear();
              this.codeimg = resdata.data
              this.showcode = true
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
  display: block;
}

.custom-text {
  color: #aeaeae;
  font-size: 14px;
}
.f13 {
  font-size: 13px;
}

input {
  width: 280px;
  height: 40px;
  margin: 0 15px;
  color: #aeaeae;
  font-size: 14px;
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

