<template>
  <div>
    <div class="bgc">
      <div class="flex-jc-center box" v-if="detail.thumb">
        <div class="shopimg_b bgc-grey">
          <img :src="detail.thumb" alt="封面">
        </div>
      </div>
      <div class="mar-b-10 pd-lr-15 pd-t">联系人：{{detail.store_boss}}</div>
      <div class="mar-b-10 pd-lr-15">联系方式：<a :href="`tel:${detail.store_phone}`">{{detail.store_phone}}</a></div>
      <div class="dt">
        地址：
        <span
          class="txt"
        >{{(store_province||'') + (store_city||'') + (store_district||'')+(store_Address||'')}}</span>
      </div>
    </div>

    <div class="bgc miaosu_b">
      <div class="pd-lr-15">
        <h1 class="shop_name">{{store_name}}</h1>
        <div class="shop_intro" v-html="detail.content"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      detail:'',
      store_province: "",
      store_city: "",
      store_Address: "",
      store_district: "",
      store_name: ""
    };
  },
  mounted() {
    this.getdetail();
  },
  methods: {
    getdetail() {
      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
        store_id: this.$route.query.store_id
      });
      this.axios
        .post(this.API + "api/Lease/store_detail", postData)
        .then(res => {
          Toast.clear();
          console.log(res.data, "getdetail");

          let resdata = res.data;
          if (resdata.code == 200) {
            this.detail = resdata.data
            this.store_province = resdata.data.store_province;
            this.store_city = resdata.data.store_city;
            this.store_district = resdata.data.store_district;
            this.store_Address = resdata.data.store_Address;
            this.store_name = resdata.data.store_name;
          } else {
            Toast.clear();
            Toast(resdata.message);
          }
        });
    }
  }
};
</script>

<style scoped>
.pd-t{
  padding-top: 15px;
}
.box{
  padding: 15px;
  padding-bottom: 0;
}
.shopimg_b {
  width: 100%;
  height: 170px;
  border-radius: 5px;
  overflow: hidden;
}

.dt{
  padding: 0px 15px;
  padding-bottom: 15px;
}
.dw_img {
  width: 10px;
  height: 12px;
}

.miaosu_b {
  margin-top: 12px;
}

.shop_name {
  font-size: 15px;
  font-weight: 700;
  height: 50px;
  line-height: 55px;
}

.shop_intro {
  font-size: 12px;
  padding-bottom: 20px;
}

.phone{
  border-bottom: 1px dashed #4EA9F9
}
</style>