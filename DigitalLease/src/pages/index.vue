<template lang="html">
  <div>
    <div class="flex-jc-between top_sear bgc">
      <div class="dw flex-align-items f12">
        <p>
          附近门店：
          <span class="fc-blue">{{nearShop}}</span>
        </p>
      </div>
      <div class="sear flex-align-items f12" id="sear">
        <van-search placeholder="搜索你想要的商品" v-model.trim="searchval"  @search="gosearch"></van-search>
      </div>
    </div>
    <div class="flex-jc-center bgc" v-show="active==0">
      <div class="banner bgc" id="banner">
        <van-swipe :autoplay="3000">
          <van-swipe-item v-for="(item, index) in images" :key="index">
            <div class="img_box">
              <img :src="item.adpic_img" v-if="item.adpic_goodsid==0">
              <router-link :to="`/productDetail/${item.adpic_goodsid}`" v-else>
                <img :src="item.adpic_img">
              </router-link>
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>

	
    <div class="flex-jc-around bgc" v-show="active==0" >
      <div class="tg" @click="gohosting">
        <img src="../assets/tuoguan.png"> 托管理财
      </div>
      <div class="tg">
        <router-link to="/extension">
          <img src="../assets/wytg.png"> 推广收佣
        </router-link>
      </div>
      <div class="tg">
        <router-link to="/welfareAgency">
          <img src="../assets/fls.png"> 领取福利
        </router-link>
      </div>
    </div>

    <div id="nav" class="bgc">
      <van-tabs v-model="active" @click="onClicknav">
        <van-tab title="热门">
          <section v-for="(item,key) in indexlist" :key="key">
            <div class="flex-jc-between flex-align-items ">
              <div class="indextitle">{{item.scene_name}}</div>
              <div class="m_txt flex-align-items" @click="more(item.scene_id)">更多
                <van-icon name="arrow"/>
              </div>
            </div>
        
              <div style="overflow:hidden">
                <div class=" bgc indexbox">
                  <div
                    class="indexitem position"
                    @click="toDetail(goods.goods_id)"
                    v-for="(goods,index) in item.goods"
                    :key="index"
                  >
                    <div class="img_box2 flex-center">
                      <img class="img" v-lazy="goods.main_img" style="object-fit:contain">
                    </div>
                    <div class="fs wrap box-sizing pdlr5">
                        <div class="text" style="fontWeight: bold;">{{goods.goods_name}}</div>
                    </div>
                    <div class="pdlr5 fss footer" >     
                      低至
                      <span style="color: #F21E1E;">¥</span><span class="price">{{goods.hire_price.price}}</span>/{{goods.hire_price.unt}}
                    </div>
                  </div>
                </div>
              </div>
          </section>
        </van-tab>

        <van-tab :title="item.cate_name" v-for="(item,index) in navlist" :key="index">
          <div class="title" v-show="!hostlist.length==0">热门推荐</div>
          <div style="overflow:hidden" >
            <div class=" bgc indexbox" v-show="!hostlist.length==0">
              <div
                class="indexitem"
                @click="toDetail(goods.goods_id)"
                v-for="(goods,index) in hostlist"
                :key="index"
              >
                <div class="img_box2 flex-center">
                  <!-- <img class="img" :src="goods.main_img" style="object-fit:contain"> -->
                  <img class="img" v-lazy="goods.main_img" style="object-fit:contain">
                </div>
                <!-- <div class="fs newline goods_name pdlr5" style="fontWeight: bold;">{{goods.goods_name}}</div>               -->
                <div class="fs wrap box-sizing pdlr5">
                    <div class="text" style="fontWeight: bold;">{{goods.goods_name}}</div>
                </div>
                <div class="f12 pdlr5 fss">     
                  低至
                  <span style="color: #F21E1E;">¥</span><span class="price">{{goods.hire_price.price}}</span>/{{goods.hire_price.unt}}
                </div>
              </div>
            </div>
          </div>

          <div class="bgc">
            <div class="title">所有产品</div>
            <lazy-component>
              <section
                class="fl_pro_list mar-b-10"
                v-for="(item, index) in goodslist"
                :key="index"
                @click="toDetail(item.goods_id)"
              >
                <div class="img_box">
                  <!-- <img class="sy_img" :src="item.main_img" style="object-fit:contain"> -->
                  <img class="sy_img" v-lazy="item.main_img" style="object-fit:contain">
                </div>
                <div class="f15 pro_name" style="fontWeight: bold">{{item.goods_name}}</div>
                <div class="com_like flex-align-items">
                  <van-rate v-model="item.eva_score" disabled disabled-color="#FFB10E" :size="size"/>
                  <span class="fs pl5">{{item.eva_score}}</span>

                  <img class="chat" src="../assets/chat.png">
                  <span class="fs pl5">{{item.eva_num}}</span>
                </div>
                <div class="zj fs">
                  <span>租金:</span>
                  低至
                  <span style="color: #f21e1e;">¥<span class="price">{{item.hire_price.price}}</span></span><span>/{{item.hire_price.unt}}</span>
                </div>
              </section>
            </lazy-component>
          </div>

          <div
            v-show="goodslist.length==0"
            class="fc-grey text-c pd-15 fsz-12"
            style="background-color: #f6f6f6;"
          >没有更多了</div>
        </van-tab>
      </van-tabs>
    </div>

    <el-amap vid="amaplocation" :plugin="plugin" :center="center" class="myamap"></el-amap>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    let self = this;
    return {
      lat: "",
      lng: "",
      images: [],
      indexlist: [],
      navlist: [],
      goodslist: [],
      hostlist: [],
      active: 0,
      nearShop: "",

      center: [121.59996, 31.197646],
      plugin: [{
        pName: 'Geolocation',
        // noGeoLocation:3,
        events: {
          init(o) {
            // o 是高德地图定位插件实例
            o.getCurrentPosition((status, result) => {          
              console.log(result);
              if (result && result.position) {
                self.getNearShop(result.position.lat,result.position.lng)
                let center = {
                  lat:result.position.lat,
                  lng:result.position.lng
                };
                window.localStorage.setItem("center", JSON.stringify(center));
                self.$nextTick();
              }else{
                // Toast('获取定位失败')
              }
            });
          }
        }
      }],
      searchval:'',
      size: 14
    };
  },
 
  beforeCreate(){
	 console.log("测试微信环境",window.localStorage.getItem("isWeiXin"))
		let isWeiXin = () => {
		   return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
		}
		if (isWeiXin()) {
		  console.log("微信");
		} else {
		  console.log("不是微信");
			if (!window.localStorage.getItem("userinfo")) {
			  this.$router.replace({ path: "/login" });
			  return
			}	
		}
  },
  
  created() {
    // this.getLocation();
    this.getnav();
    // this.getNearShop('22.54605355', '114.02597366') //测试 
  },
  mounted(){
   //if (!window.localStorage.getItem("userinfo")) {
    //  return
   // }
    this.getindexlist();
    this.getbanner();
  },
  methods: {
    // getLocation() {
    //   if (window.navigator.geolocation) {
    //     window.navigator.geolocation.getCurrentPosition(position => {
    //       var lat = position.coords.latitude; //纬度
    //       var lng = position.coords.longitude; //经度
    //       this.lat = lat;
    //       this.lng = lng;
    //       this.getNearShop(lat, lng);
    //       let center = {
    //         lat,
    //         lng
    //       };
    //       window.localStorage.setItem("center", JSON.stringify(center));
    //     },err=>{
    //       Toast('获取定位失败');
    //     });
    //   } else {
    //     Toast("浏览器不支持地理定位,请升级");
    //   }
    // },
    gohosting() {
	if (!window.localStorage.getItem("userinfo")) {
	  this.$router.replace({ path: "/login" });
	  return
	}	
      window.sessionStorage.removeItem("gohostingSession");
      this.$router.push({ path: "/gohosting" });
    },
    //更多
    more(id) {
	if (!window.localStorage.getItem("userinfo")) {
	  this.$router.replace({ path: "/login" });
	  return
	}	
      this.$router.push({ path: "/goods/" + id });
    },
    //产品详情
    toDetail(id) {
      this.$router.push({ path: "/productDetail/" + id });
    },
    gosearch() {
	 if (!window.localStorage.getItem("userinfo")) {
	  this.$router.replace({ path: "/login" });
	  return
	}
      this.$router.push({ path: "/search?val="+this.searchval });
    },

    onClicknav(i) {
      if (i == 0) {
      } else {
        Toast.loading({ mask: true, message: "加载中..." });
        let postData = this.$qs.stringify({
          cate_id: this.navlist[i - 1].cate_id
        });
        this.axios
          .post(this.API + "api/Lease/cate_goods", postData)
          .then(res => {
            console.log(res.data, "goodslist");
            let resdata = res.data;
            if (resdata.code == 200) {
              Toast.clear();
              this.goodslist = resdata.data.goods;
              this.hostlist = resdata.data.remen;
            } else {
              Toast.clear();
              Toast(resdata.message);
            }
          });
      }
    },

    getbanner() {
      this.axios.post(this.API + "api/Lease/Rotation_chart").then(res => {
        console.log(res.data, "getbanner");
        let resdata = res.data;
        if (resdata.code == 200) {
          this.images = resdata.data;
        } else {
          Toast(resdata.message);
        }
      });
    },
    getnav() {
      this.axios.post(this.API + "api/Lease/cate_select").then(res => {
        console.log(res.data, "getnav");
        let resdata = res.data;
        if (resdata.code == 200) {
          this.navlist = resdata.data;
        } else {
          Toast(resdata.message);
        }
      });
    },
    getindexlist() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios.post(this.API + "api/Lease/goods_select").then(res => {
        console.log(res.data, "getindexlist");
        let resdata = res.data;
        if (resdata.code == 200) {
          Toast.clear();
          this.indexlist = resdata.data;
        } else {
          Toast.clear();
          Toast(resdata.message);
        }
      });
    },
    getNearShop(lat, lng) {
      let postData = this.$qs.stringify({
        lat: lat,
        lng: lng
      });
      this.axios
        .post(this.API + "api/Lease/Nearby_store", postData)
        .then(res => {
          console.log(res.data, "Nearby_store");
          let resdata = res.data;
          if (resdata.code == 200) {
            this.nearShop = resdata.data.store_name
          } else {
            Toast(resdata.message);
          }
        });
    }
  }
};
</script>

<style scoped>
#nav >>> .van-tabs__line {
  background-color: #fff;
  background-image: linear-gradient(90deg, #6c76ed 0%, #74d2ff 100%);
}
#nav >>> .van-tab {
  flex-basis: 20% !important;
}
#banner >>> .van-swipe {
  border-radius: 5px;
}
#sear >>> .van-search{
  padding: 0;
}
#sear >>> .van-cell {
  background: #f6f5f5;
}
.myamap{
  opacity: 0;
}
.f12 {
  font-size: 12px;
}
.f15 {
  font-size: 15px;
}
.f10 {
  font-size: 10px;
}
.fs {
  font-size: 8px;
}
.fss{
  font-size: 6px;
}
.pl10{
  padding-left:10px
}
.pl5{
  padding-left:5px
}
.pdlr5{
  padding-left:5px;
  padding-right:5px
}

.top_sear {
  width: 100%;
  height: 44px;
}

.sear {
  width: 50%;
  height: 32px;
  margin: 5px 12px 0 0;
  border-radius: 15px;
  background: #f6f5f5;
  overflow: hidden;
}
.sear input {
  background: #f6f5f5;
}

.sear .van-icon {
  padding-left: 10px;
}

.dw {
  width: 50%;
  height: 44px;
  margin-left: 13px;
}
/* .dw span {
  display: inline-block;
  width: 50px;
  height: 100%;
} */

.banner {
  width: 290px;
  height: 160px;
}
.img_box {
  width: 290px;
  height: 160px;
}

.tg {
  text-align: center;
  font-size: 10px;
  line-height: 30px;
}

.tg img {
  display: block;
  width: 40px;
  height: 40px;
}

.title {
  padding: 10px 14px;
}
.indextitle {
  padding: 0 14px;
  padding-top: 9px;
  letter-spacing:2px;
  font-size: 13px;
}

.m_txt {
  font-size: 8px;
  color: #d0d0d0;
  padding: 0 14px;
  padding-top: 9px;
}

.cp_box {
  width: 100%;
  height: 200px;
  overflow: hidden;
  margin: 0px auto;
}
.content {
  width: 100%;
  overflow-x: scroll;
  /*子元素的宽度大于父元素的即可滚动*/
  overflow-y: hidden;
  border-radius: 4px;
  margin-left: 12px;
}
.redPacket {
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  /*float: left;*/
  /*使其脱离文档流 宽度为所有字元素的和*/
  min-width: 100%;
}
.item {
  min-width: 105px;
  height: 200px;
  -webkit-align-items: center;
  -ms-flex-align: center;
}
.img_box1 {
  width: 105px;
  height: 125px;
  background: #f7f7f7;
}
.amount {
  text-align: center;
  padding-right: 10px;
  font-size: 12px;
  color: #ffd41d;
  border-right: 1px solid #ffa068;
}
.pro_title {
  width: 120px;
  padding-left: 5px;
  line-height: 30px;
}
.price_box {
  padding-left: 5px;
}
.price {
  font-size: 14px;
  color: #f21e1e;
}
.indexbox .price {
  font-size: 12px;
  color: #f21e1e;
}
.camer_hm_box {
  width: 100%;
  height: 175px;
}
.camer_hm_box > div {
  margin-left: 9px;
}
.camer_hm {
  width: 95px;
  height: 175px;
}
.img_box2 {
  width: 100%;
  height: 95px;
  padding: 10px;
  box-sizing: border-box
}

.indexbox {
  width:100%;
  height: 150px;
  /* white-space: nowrap;
  overflow-x:scroll;
  overflow-y:hidden; */
  /* display: inline; */
  /* float:left; */
  padding-top:5px;
}
.indexbox > div {
  margin-left: 9px;
}
.indexbox::-webkit-scrollbar {
  display: none;
}
.indexitem {
  width: 95px;
  height: 145px;
  display: inline-block;
  box-shadow: 0px 0px 4px 1px #DAD7D7;
  box-sizing: border-box;
  vertical-align:top;
}
.indexitem .goods_name {
  white-space: normal;
  margin-bottom: 5px;
}
.indexitem .footer {
  width:100%;
  position: absolute;
  bottom:5px;
  left:0
}


.wrap {
    height: 30px;
    line-height: 15px;
    text-align: justify;
    overflow: hidden;
}
.wrap:before {
    float: left;
    width: 1em;
    height: 100%;
    content: '';
}
.wrap:after {
    float: right;

    width: 2.5em;
    height: 15px;
    margin-left: -2.5em;
    padding-right: 1em;
    content: '...';
    text-align: right;
    position: relative;
    top: -15px;
    left: 100%;
    /*设置渐变效果是为了省略号和内容衔接得自然点，没那么突兀，要注意要跟文字所在的背景的颜色搭配（把white替换成背景色）*/
    background: #fff;
    background: -webkit-gradient(linear, left top, right top, from(rgba(255, 255, 255, 0)), to(white), color-stop(50%, white));
    background: -moz-linear-gradient(to right, rgba(255, 255, 255, 0), white 50%, white);
    background: -o-linear-gradient(to right, rgba(255, 255, 255, 0), white 50%, white);
    background: -ms-linear-gradient(to right, rgba(255, 255, 255, 0), white 50%, white);
    background: linear-gradient(to right, rgba(255, 255, 255, 0), white 50%, white);
}
.wrap .text {
    float: right;
    margin-left: -1em;
    width: 100%;
}

/*分类 所有产品*/
.fl_pro_list {
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}
.fl_pro_list:last-child {
  /* margin-bottom: 48px; */
}
.img_box {
  width: 100%;
  height: 150px;
}

.sy_img {
  width: 300px;
  height: 150px;
  border-radius: 10px;
}

.pro_name {
  line-height: 30px;
}
.com_like {
  display: flex;
  height: 22px;
}
.zj {
  /* line-height: 20px; */
}
.chat {
  width: 15px;
  height: 13px;
  padding-left: 15px;
  vertical-align: middle;
}

</style>