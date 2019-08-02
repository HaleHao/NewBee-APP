<template>
    <div>
        <div v-show="list.length==0" class="fc-grey text-c pd-15 fsz-12">没有更多了</div>

        <div class="bgc list">
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
        </div>

        <div class="btn text-c" @click="submit" >完成</div>
    </div>
</template>

<script>
import { Toast } from 'vant';
export default {
    data(){
        return{
            list:[],
            radio: 0,
        }
    },
    mounted(){
      if(!window.localStorage.getItem("center")){
        this.getLocation();
      }else{
          this.getshop()
      }
    },
    methods:{
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
                    this.getshop()
                },err=>{
                    Toast('获取定位失败');
                });
            } else {
                Toast("浏览器不支持地理定位,请升级");
            }
        },
        getshop(){
            Toast.loading({ mask: true, message: "加载中..." });
            let postData = this.$qs.stringify({
                lat: JSON.parse(window.localStorage.getItem("center")).lat,
                lng: JSON.parse(window.localStorage.getItem("center")).lng,
            });
            this.axios.post(this.API + "api/Trusteeship/getStore", postData)
            .then(res => {
                console.log(res.data, "list");
                let resdata = res.data;
                if (resdata.code == 200) {
                    Toast.clear();
                    this.list = resdata.data.slice(0,3)
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
        submit(){
            if (this.$route.query.type == "sceneDeli") {
                let sceneDeliSession = JSON.parse(
                window.sessionStorage.getItem("sceneDeliSession")
                );
                sceneDeliSession.getlocation = this.list[this.radio];
                window.sessionStorage.setItem(
                "sceneDeliSession",
                JSON.stringify(sceneDeliSession)
                );
            }
            if (this.$route.query.type == "postDeli") {
                let postDeliSession = JSON.parse(
                window.sessionStorage.getItem("postDeliSession")
                );
                postDeliSession.getlocation = this.list[this.radio];
                window.sessionStorage.setItem(
                "postDeliSession",
                JSON.stringify(postDeliSession)
                );
            }
            if (this.$route.query.type == "platformDeli") {
                let platformDeliSession = JSON.parse(
                window.sessionStorage.getItem("platformDeliSession")
                );
                platformDeliSession.getlocation = this.list[this.radio];
                window.sessionStorage.setItem(
                "platformDeliSession",
                JSON.stringify(platformDeliSession)
                );
            }
            
            this.$router.go(-1);
        }
    }
}
</script>

<style scoped>
.fsz12 {
  font-size: 12px;
}
.btn {
  height: 42px;
  line-height: 42px;
  color: #fff;
  background-image: linear-gradient(90deg, #2dbbf1 0%, #4ea9f9 100%);
  position: fixed;
  bottom: 49px;
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
