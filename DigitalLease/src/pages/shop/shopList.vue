<template>
  <div>
    <van-search placeholder="请输入搜索关键词" v-model.trim="value" @search="onSearch" show-action>
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>

    <div class="shoplist">
      <div v-for="(item,index) in list" :key="index" :title="item">
        <div class="item">
          <router-link :to="{path:'/shopDetail',query:{ store_id:item.store_id }}">
            <div class="flex-jc-between flex-align-items">
              <div class="shop_title">{{item.store_name}}</div>
              <van-icon name="arrow"/>
            </div>
            <div
              class="txt f12"
            >{{(item.store_province||'')+(item.store_city||'')+(item.store_district||'')+(item.store_Address||'')}}</div>
          </router-link>

          <router-link
            class="dt text-c"
            :to="`/map/${item.coordinate}/${item.store_name},${item.store_province+item.store_city+item.store_district}`"
          >
            <img class="ck_img" src="../../assets/mddw.png">
            <span class="txt f12">查看地图</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  beforeRouteEnter(to, from, next) {
    if(from.meta.title === '门店详情'||from.meta.title === '地图') { //判断是从哪个路由过来的，若是detail页面不需要刷新获取新数据，直接用之前缓存的数据即可
        to.meta.isBack = true;
    }
    next();
  },
  data() {
    return {
      list: [],
      value: "",
    };
  },
  beforeCreate(){
    if (!window.localStorage.getItem("userinfo")) {
      this.$router.replace({ path: "/login" });
    }
  },
  created() {
    this.isFirstEnter = true;
    this.getlist();
  },
  methods: {
    onSearch() {
      // console.log(this.value);
      if(this.value==''){
        return
      }
      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
        keyword: this.value
      });
      this.axios
        .post(this.API + "api/Trusteeship/searchStore", postData)
        .then(res => {
          console.log(res.data, "onSearch");
          let resdata = res.data;
          if (resdata.code == 200) {
            if (resdata.data.length == 0) {
              Toast.clear();
              Toast({
                message: " 没有匹配的产品",
              });
              this.list = []
            } else {
              Toast.clear();
              this.list = resdata.data;
            }
          } else {
            Toast.clear();
            Toast(resdata.message);
            this.list = []
          }
        });
    },
    getlist() {
      Toast.loading({ mask: true, message: "加载中..." });
      this.axios.post(this.API + "api/Lease/store_select").then(res => {
        console.log(res.data, "list");
        let resdata = res.data;
        if (resdata.code == 200) {
          Toast.clear();
          this.list = resdata.data;
        } else {
          Toast.clear();
          Toast(resdata.message);
        }
      });
    }
  },
  activated(){
    if(!this.$route.meta.isBack || this.isFirstEnter){
        this.list = []
        this.value = ""
        this.getlist()
     }
     this.$route.meta.isBack=false
     this.isFirstEnter=false;
  }
};
</script>

<style scoped>
.f12 {
  font-size: 12px;
}

.shoplist {
  padding-top: 2px;
  background: #fbfbfb;
}
.item {
  background: #fff;
  padding: 10px 20px;
  margin: 12px 14px 0 14px;
}
.shop_title {
  font-size: 15px;
  color: #7a7a7a;
}
.txt {
  color: #dcdddf;
  margin-top: 5px;
}
.ck_img {
  width: 10px;
  height: 12px;
}
.dt {
  margin-top: 15px;
  display: block;
}
</style>