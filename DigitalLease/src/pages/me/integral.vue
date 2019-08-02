<template>
  <div class="bgc">
    <div class="header" :style="bgimg">
      <div class="text-c">{{info.score}}</div>
      <div class="text-c">当前可用积分</div>
      <div class="flex-jc-around">
        <span>可抵扣：{{info.rmb}}元</span>
        <router-link to="/rules/integral">积分规则</router-link>
      </div>
    </div>
    
    <div class="mx">积分明细</div>
    <div class="box bgc">
      <van-list v-model="loading" :finished="finished" @load="onLoad">
        <div v-for="(item,index) in list" :key="index">
          <div class="flex-center bgc">
            <div class="flex-jc-between flex-align-items inte_deta border-b">
              <div>
                <div>{{item.content}}</div>
                <div class="time">{{item.create_time}}</div>
              </div>
              <div class="money_deta">+{{item.score}}</div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      bgimg: {
        background:
          "url(" + require("../../assets/in_bg.png") + ") no-repeat top",
          backgroundSize: "100% 100%"
      },
      info:'',
      loading: false,
      finished: false,
      page: 0,
      list:[]
    };
  },
  beforeCreate(){
    if (!window.localStorage.getItem("userinfo")) {
      this.$router.replace({ path: "/login" });
    }
  },
  mounted(){
    this.getinfo()
  },
  methods: {
    getinfo() {
        Toast.loading({ mask: true, message: "加载中..." });
        let postData = this.$qs.stringify({
            users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
        });
        this.axios.post(this.API + "api/Order/GetUserScore", postData)
        .then(res => {
            console.log(res.data, "info");
            let resdata = res.data;
            if (resdata.code == 200) {
                Toast.clear();
                this.info = resdata.data;
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

    onLoad() {
      let nowPageNum = ++this.page;
      let postData = this.$qs.stringify({
        users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
        page: nowPageNum
      });
      this.axios
        .post(this.API + "api/Order/GetUserScoreList", postData)
        .then(res => {
          console.log(res.data, "GetUserScoreList");

          let resdata = res.data;

          if (resdata.code == 200) {
            this.list = this.list.concat(resdata.data);
            // 加载状态结束
            this.loading = false;
            if (resdata.data.length < 10) {
              this.finished = true;
            }
          } else {
            Toast(resdata.message);
            this.loading = false;
            this.finished = true;
          }
        })
        .catch(error => {
            Toast('网络出错')
        });
    }
  },

}

</script>


<style scoped>
.header {
  align-items: center;
  width: 100%;
  height: 210px;
  /* background: url(../../assets/in_bg.png) no-repeat;
  background-size: 100% 100%; */
  color: #fff;
}
.header > div:nth-of-type(1) {
  font-size: 30px;
  padding-top: 70px;
}
.header > div:nth-of-type(2) {
  padding-top: 10px;
}
.header > div:nth-of-type(3) {
  padding-top: 30px;
}
.box {
  margin: 0 15px;
}
.mx {
  height: 40px;
  line-height: 40px;
  background: #fbfbfb;
  padding-left: 15px;
}

.inte_deta {
  width: 100%;
  padding: 10px 0;
}
.money_deta {
  font-size: 16px;
  color: #4ea9f9;
}
.time {
  font-size: 12px;
  color: #aeaeae;
  margin-top: 5px;
}
</style>