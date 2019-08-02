<template>
  <div>
    <div v-show="list.length==0&&!loading" class="fc-grey text-c pd-15 fsz-12">没有更多了</div>
    <div class="bgc tag" v-show="list.length!=0">
      <van-tag type="success">推荐</van-tag>
    </div>
    <div class="bgc list">
      <van-list v-model="loading" :finished="finished" @load="onLoad">
        <van-radio-group v-model="radio">
          <div
            class="flex-align-items card"
            :class="index===list.length-1?'':'border-b'"
            @click="radio = index"
            v-for="(item,index) in list"
            :key="index"
          >
            <van-radio :name="index" checked-color="#2DBBF1"></van-radio>
            <div class="item flex-align-items flex-jc-between flex-1">
              <div class="left flex-1">
                <div>{{item.store_name}}</div>
                <div
                  class="fsz12"
                >{{(item.store_province||'')+(item.store_city||'')+(item.store_district||'')+(item.store_Address||'')}}</div>
              </div>
              <div class="right fsz12">距您{{item.juli | distance}}</div>
            </div>
          </div>
        </van-radio-group>
      </van-list>
    </div>

    <div class="height"></div>
    <div class="btn text-c" @click="submit" v-show="list.length!=0">完成</div>

    <!-- <el-amap vid="amaplocation" :plugin="plugin" :center="center" class="myamap"></el-amap> -->
  </div>
</template>

<script>
import { Toast,Dialog,Notify } from "vant";
export default {
  data() {
    let self = this;
    return {
      loading: false,
      finished: false,
      list: [],
      radio: 0,
      page: 0,

      // center: [121.59996, 31.197646],
      // lng: 0,
      // lat: 0,
      // loaded: false,
      // plugin: [{
      //   pName: 'Geolocation',
      //   events: {
      //     init(o) {
      //       // o 是高德地图定位插件实例
      //       o.getCurrentPosition((status, result) => {
      //         console.log(result);
      //         if (result && result.position) {
      //           self.lng = result.position.lng;
      //           self.lat = result.position.lat;
      //           self.center = [self.lng, self.lat];
      //           self.loaded = true;
      //           self.onLoad()
      //           self.$nextTick();
      //         }else{
      //           Notify('获取定位失败');
      //           self.loading = false;
      //           self.finished = true;
      //         }
      //       });
      //     }
      //   }
      // }]
    };
  },

  created() {
    if(!window.localStorage.getItem("center")){
        this.getLocation();
      }
  },
  methods: {
    getLocation() {
      if (window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(position => {
          var lat = position.coords.latitude; //纬度
          var lng = position.coords.longitude; //经度

          let center = {
            lat,
            lng
          };
          window.localStorage.setItem("center", JSON.stringify(center));
          this.page = 0,
          this.onLoad()
        },err=>{
          Toast('获取定位失败');
        });
      } else {
        Toast("浏览器不支持地理定位,请升级");
      }
    },
    onLoad() {
      if(!window.localStorage.getItem("center")){
        this.loading = false;
        this.finished = true;
        return
      }
      // if(!this.loaded){
      //   return
      // }

      let nowPageNum = ++this.page;
      if(this.$route.params.type == "buy"||this.$route.params.type == "prebuy"||this.$route.params.type == "friendbuy"){
        let postData = this.$qs.stringify({
          lat: JSON.parse(window.localStorage.getItem("center")).lat,
          lng: JSON.parse(window.localStorage.getItem("center")).lng,
          goods_id: this.$route.params.id,
          page: nowPageNum
        });
        this.axios
          .post(this.API + "api/Order/GetSelfShop", postData)
          .then(res => {
            console.log(res.data, "list");
            let resdata = res.data;
            if (resdata.code == 200) {
              this.list = this.list.concat(resdata.data);
              // 加载状态结束
              this.loading = false;
              if (resdata.data.length < 10) {
                this.finished = true;
              }
            } else {
              if(this.list.length==0){
                Dialog.alert({
                    message: resdata.message
                }).then((e) => {
                  //
                });
              }
              
              this.loading = false;
              this.finished = true;
            }
          })
          .catch(error => {
              Toast('网络出错')
          });
      }

      if(this.$route.params.type == "shopping"){
        let postData = this.$qs.stringify({
          lat: JSON.parse(window.localStorage.getItem("center")).lat,
          lng: JSON.parse(window.localStorage.getItem("center")).lng,
          order_id: this.$route.params.id,
          page: nowPageNum
        });
        this.axios
          .post(this.API + "api/Buy_Order/BuySelfShop", postData)
          .then(res => {
            console.log(res.data, "list");
            let resdata = res.data;
            if (resdata.code == 200) {
              this.list = this.list.concat(resdata.data);
              // 加载状态结束
              this.loading = false;
              if (resdata.data.length < 10) {
                this.finished = true;
              }
            } else {
              if(this.list.length==0){
                Dialog.alert({
                    message: resdata.message
                }).then((e) => {
                  //
                });
              }
              
              this.loading = false;
              this.finished = true;
            }
          })
          .catch(error => {
              Toast('网络出错')
          });
      }
    },
    submit() {
      if (this.$route.params.type == "shopping") {
        let shoppingSession = JSON.parse(
          window.sessionStorage.getItem("shoppingSession")
        );
        shoppingSession.getlocation = this.list[this.radio];
        window.sessionStorage.setItem(
          "shoppingSession",
          JSON.stringify(shoppingSession)
        );
      }
      if (this.$route.params.type == "buy") {
        let buySession = JSON.parse(
          window.sessionStorage.getItem("buySession")
        );
        buySession.getlocation = this.list[this.radio];
        window.sessionStorage.setItem("buySession", JSON.stringify(buySession));
      }
      if (this.$route.params.type == "prebuy") {
        let prebuySession = JSON.parse(
          window.sessionStorage.getItem("prebuySession")
        );
        prebuySession.getlocation = this.list[this.radio];
        window.sessionStorage.setItem("prebuySession", JSON.stringify(prebuySession));
      }
      if (this.$route.params.type == "friendbuy") {
        let friendbuySession = JSON.parse(
          window.sessionStorage.getItem("friendbuySession")
        );
        friendbuySession.getlocation = this.list[this.radio];
        window.sessionStorage.setItem("friendbuySession", JSON.stringify(friendbuySession));
      }

      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.myamap{
  opacity: 0;
}
.tag {
  padding-top: 15px;
  padding-left: 30px;
}
.height {
  height: 42px;
}
.fsz12 {
  font-size: 12px;
}
.btn {
  height: 42px;
  line-height: 42px;
  color: #fff;
  background-image: linear-gradient(90deg, #2dbbf1 0%, #4ea9f9 100%);
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
.card {
  padding: 10px;
}
.card .left {
  padding: 0 10px;
}
.card .right {
  max-width: 68px;
}
</style>
