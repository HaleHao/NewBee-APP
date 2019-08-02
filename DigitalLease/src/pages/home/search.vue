<template>
  <div>
    <van-search placeholder="请输入搜索关键词" v-model.trim="value" show-action  @search="onSearch" @focus="showhistory=true" @blur="showhistory=false" >
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>

    <div class="history bgc" v-show="showhistory">
      <p @click="historySearch(item)" v-for="(item,index) in historylist" :key="index" class="border-b">{{item}}</p>
    </div>

    <div class="bgc">
      <div
        class="fl_pro_list"
        v-for="(item, index) in flprolist"
        :key="index"
        @click="toDetail(item.goods_id)"
      >
        <div class="img_box">
          <img class="sy_img" v-lazy="item.main_img" style="object-fit:contain">
        </div>
        <div class="f15 pro_name" style="fontWeight: bold">{{item.goods_name}}</div>
        <div class="com_like flex-align-items">
          <van-rate v-model="item.eva_score" disabled disabled-color="#FFB10E" :size="size"/>
          <span class="fs pl5">{{item.eva_score}}</span>

          <img class="chat" src="../../assets/chat.png">
          <span class="fs pl5">{{item.eva_num}}</span>
        </div>
        <div class="zj fs">
          <span>租金：</span>
          低至
          <span style="color: #f21e1e;">¥<span class="price">{{item.hire_price.price}}</span></span><span>/{{item.hire_price.unt}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  beforeRouteEnter(to, from, next) {
    if(from.meta.title === 'SKU信息') { //判断是从哪个路由过来的，若是detail页面不需要刷新获取新数据，直接用之前缓存的数据即可
        to.meta.isBack = true;
    }
    next();
  },
  data() {
    return {
      value: "",
      flprolist: [],
      historylist:[],
      showhistory:false,
      size: 14
    };
  },
  created() {
    this.isFirstEnter = true;
    let goodshistory = window.localStorage.getItem("goodshistory")
    if(goodshistory){
      this.historylist = JSON.parse(goodshistory)
    }
  },
  mounted(){
    if(this.$route.query.val){
      this.value = this.$route.query.val
    }
    this.onSearch()
  },
  methods: {
    onSearch() {
      console.log(this.value);
      this.getsearch();
    },

    historySearch(val){
      this.showhistory = false
      this.value = val
      this.getsearch();
    },
    //产品详情
    toDetail(id) {
      this.$router.push({ path: "/productDetail/" + id });
    },
    getsearch() {
      if(this.value==''){
        return
      }
      // 历史记录处理
      this.historylist.unshift(this.value)
      this.historylist.slice(0,10)
      this.historylist = [...new Set(this.historylist)]        
      window.localStorage.setItem("goodshistory", JSON.stringify(this.historylist));

      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
        goods_name: this.value
      });
      this.axios
        .post(this.API + "api/Lease/search_goods", postData)
        .then(res => {
          console.log(res.data, "getdetail");
          let resdata = res.data;
          if (resdata.code == 200) {
            if (resdata.data.length == 0) {
              Toast.clear();
              Toast({
                message: " 没有匹配的产品",
              });
              this.flprolist = []
            } else {
              Toast.clear();
              this.flprolist = resdata.data;
            }
          } else {
            Toast.clear();
            Toast(resdata.message);
            this.flprolist = []
          }
        });
    }
  },
  activated() {
     if(!this.$route.meta.isBack || this.isFirstEnter){
         // 如果isBack是false，表明需要获取新数据，否则就不再请求，直接使用缓存的数据
         // 如果isFirstEnter是true，表明是第一次进入此页面或用户刷新了页面，需获取新数据
        this.flprolist = []
        this.value = ""
        let goodshistory = window.localStorage.getItem("goodshistory")
        if(goodshistory){
          this.historylist = JSON.parse(goodshistory)
        }
        if(this.$route.query.val){
          this.value = this.$route.query.val
        }
        this.onSearch()
     }
     // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
     this.$route.meta.isBack=false
     // 恢复成默认的false，避免isBack一直是true，导致每次都获取新数据
     this.isFirstEnter=false;
  },
};
</script>

<style scoped>
.history > p{
  padding: 10px;
  box-sizing: border-box;
}
.history {
  z-index: 1;
  width: 100%;
  position: absolute;
  left: 0;
}
.f15 {
  font-size: 15px;
}
.fs {
  font-size: 8px;
}
.pl5{
  padding-left:5px
}
/*分类 所有产品*/
.fl_pro_list {
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  padding-top: 10px;
}
.price {
  font-size: 14px;
  color: #f21e1e;
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
  line-height: 22px;
}

.chat {
  width: 15px;
  height: 13px;
  padding-left: 15px;
  vertical-align: middle;
}
</style>
