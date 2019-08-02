<template>
  <div>
    <div class="pd-15 bgc border-b">
      <span>收货人</span>
      <input type="text" v-model.trim="nameval">
    </div>
    <div class="pd-15 bgc border-b">
      <span>手机号</span>
      <input type="number" maxlength="11" v-model.trim="phoneval">
    </div>
    <div class="pd-15 flex-jc-between bgc border-b" @click="showarea=true">
      <span>所在地区</span>
      <div class="fc-grey flex-align-items">
        <span>{{areaval==''?'':areaval[0].name+areaval[1].name+areaval[2].name}}</span>
        <van-icon name="arrow"/>
      </div>
    </div>
    <div class="pd-15 bgc mar-b-10">
      <div>
        <input style="width:100%" type="text" v-model.trim="detailval" placeholder="街道、小区门牌等详情地址">
      </div>
    </div>
    <div class="pd-15 bgc flex-jc-between flex-align-items">
      <span>设为默认地址</span>
      <van-switch v-model="checked" size="20px"/>
    </div>

    <div class="pd-t-50">
      <button class="btn text-c" @click="submit">保存</button>
    </div>

    <van-popup v-model="showarea" position="bottom" :close-on-click-overlay="false">
      <van-area :area-list="areaList" @cancel="showarea=false" @confirm="onconfirm"/>
    </van-popup>
  </div>
</template>

<script>
import area from "@/utils/area.js";
import { Toast } from "vant";
export default {
  data() {
    return {
      checked: false,
      showarea: false,
      areaval: "",
      areaList: area,
      nameval: "",
      phoneval: "",
      detailval: ""
    };
  },
  created() {
    if (this.$route.params.id) {
      this.getdata();
    }
  },
  methods: {
    onconfirm(val) {
      console.log(val);
      this.areaval = val;
      this.showarea = false;
    },
    getdata() {
      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
        ads_id: this.$route.params.id
      });
      this.axios
        .post(this.API + "api/Lease/Ads_Details", postData)
        .then(res => {
          console.log(res.data, "add");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear();
            this.nameval = resdata.data.ads_user;
            this.phoneval = resdata.data.ads_phone;
            this.detailval = resdata.data.ads_address;
            this.checked = resdata.data.ads_state == 2 ? true : false;
            this.areaval = [
              { name: resdata.data.ads_province },
              { name: resdata.data.ads_city },
              { name: resdata.data.ads_district }
            ];
          } else {
            Toast.clear();
            Toast(resdata.message);
          }
        });
    },
    submit() {
      if (this.nameval == "" || this.phoneval == "" || this.detailval == "") {
        Toast("请先填写完整");
        return;
      }
      if (!(/^1\d{10}$/.test(this.phoneval))) {
        Toast("手机号格式不正确");
        return;
      }

      let postData = this.$qs.stringify({
        ads_id: this.$route.params.id || "",
        users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
        ads_user: this.nameval,
        ads_phone: this.phoneval,
        ads_state: this.checked ? "2" : "1",
        ads_province: this.areaval[0].name,
        ads_city: this.areaval[1].name,
        ads_district: this.areaval[2].name,
        ads_address: this.detailval
      });

      if (this.$route.params.id) {
        Toast.loading({ mask: true, message: "加载中...",duration:0 });
        this.axios
          .post(this.API + "api/Lease/Ads_Update", postData)
          .then(res => {
            console.log(res.data, "editor");
            let resdata = res.data;
            if (resdata.code == 200) {
              Toast.clear();
              this.$router.go(-1);
            } else {
              Toast.clear();
              Toast(resdata.message||'操作失败');
            }
          });
      } else {
        Toast.loading({ mask: true, message: "加载中...",duration:0 });
        this.axios.post(this.API + "api/Lease/Add_ads", postData).then(res => {
          console.log(res.data, "add");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear();
            this.$router.go(-1);
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
.pd-t-50 {
  padding: 0 15px;
  padding-top: 50px;
}
.btn {
  width: 100%;
  display:block;
  height: 42px;
  line-height: 42px;
  border-radius: 20px;
  color: #fff;
  background-image: linear-gradient(90deg, #2dbbf1 0%, #4ea9f9 100%);
}
</style>
