<template>
  <div>
    <header class="flex-jc-between manber_b" @click="myInformat" :style="bgimg">
      <div class="flex-align-items flex_box">
        <div class="head_img">
          <img src="../../assets/headimg.png" alt="头像" v-if="head_img==''">
          <img :src="head_img" alt="头像" v-else>
        </div>
        <div class>
          <div class="name">{{users_name}}</div>
        </div>
      </div>
    </header>
    <div class="mebox bgc">
      <van-cell is-link center to="/certification">
        <template slot="icon">
          <img src="../../assets/myrz.png" alt="图标" class="left_img">
        </template>
        <template slot="title">
          <div>免押认证</div>
        </template>
      </van-cell>

      <van-cell is-link center to="/integral">
        <template slot="icon">
          <img src="../../assets/jf.png" alt="图标" class="left_img">
        </template>
        <template slot="title">
          <div>我的积分</div>
        </template>
      </van-cell>

      <van-cell is-link center to="/trusteeship">
        <template slot="icon">
          <img src="../../assets/tg.png" alt="图标" class="left_img">
        </template>
        <template slot="title">
          <div>我的托管</div>
        </template>
      </van-cell>

      <van-cell is-link center to="/cart">
        <template slot="icon">
          <img src="../../assets/gwc.png" alt="图标" class="left_img">
        </template>
        <template slot="title">
          <div>购物车</div>
        </template>
      </van-cell>

      <van-cell is-link center to="/myBalance">
        <template slot="icon">
          <img src="../../assets/ye.png" alt="图标" class="left_img">
        </template>
        <template slot="title">
          <div>账户余额</div>
        </template>
      </van-cell>
      <div class="coupon">
        <van-cell is-link center to="/coupon">
          <template slot="icon">
            <img src="../../assets/yhq.png" alt="图标" class="left_img">
          </template>
          <template slot="title">
            <div>优惠券</div>
          </template>
        </van-cell>
      </div>
      <div class="hcenter border-b">
        <van-cell is-link center to="/helpCenter">
          <template slot="icon">
            <img src="../../assets/bz.png" alt="图标" class="left_img">
          </template>
          <template slot="title">
            <div>帮助中心</div>
          </template>
        </van-cell>
      </div>
      <van-cell is-link center to="/setup">
        <template slot="icon">
          <img src="../../assets/sz.png" alt="图标" class="left_img">
        </template>
        <template slot="title">
          <div>设置</div>
        </template>
      </van-cell>
    </div>
    <!-- <div class="height"></div> -->
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      bgimg: {
        background:
          "url(" + require("../../assets/me_bg.png") + ") no-repeat top",
        backgroundSize: "100% 100%"
      },
      users_name: "",
      head_img: ''
    };
  },
  beforeCreate(){
    if (!window.localStorage.getItem("userinfo")) {
      this.$router.replace({ path: "/login" });
    }
  },
  created() {
    this.getheadimg()
  },
  mounted(){
    this.getuser()
  },
  methods: {
    //15816893020 客户
    getuser() {
      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
        users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id
      });
      this.axios
        .post(this.API + "api/Lease/users_detail", postData)
        .then(res => {
          console.log(res.data, "users_detail");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear();
            if(!resdata.data){
              Toast('请先登录');
              window.localStorage.removeItem("userinfo")
              this.$router.replace({ path: "/login" });
              return
            }
            this.users_name = resdata.data.users_name;
          } else {
            Toast.clear();
            Toast(resdata.message);
          }
        });
    },
    getheadimg() {
      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
        users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id
      });
      this.axios
        .post(this.API + "api/Lease_Order/getHeadPicture", postData)
        .then(res => {
          console.log(res.data, "headimg");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear();
            if(resdata.data.length==0){
              this.head_img = ''
            }else{
              this.head_img = resdata.data;
            }
          } else {
            Toast.clear();
            // Toast(resdata.message);
          }
        });
    },
    //我的资料
    myInformat(url) {
      this.$router.push({ path: "/myInformation" });
    }
  }
};
</script>


<style scoped>
.height {
  height: 50px;
}
.manber_b {
  align-items: center;
  width: 100%;
  height: 180px;
}
.head_img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  /* border: 1px solid #fff; */
  margin-left: 14px;
  overflow: hidden;
  font-size: 0;
}
/* .head_img > img {
  width: 60px;
  height: 60px;
} */
.name {
  font-size: 20px;
  color: #fff;
  font-weight: 500;
  margin-left: 14px;
}
.manber {
  font-size: 12px;
  color: #fff;
  margin-left: 14px;
}
.flex_box {
  margin-bottom: 10px;
}
.hg {
  margin: 0 15px 15px 0;
  width: 20px;
  height: 17px;
}
.mebox {
  margin: -50px 15px 15px 15px;
  overflow: hidden;
  border-radius: 10px;
}
.coupon {
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}
.hcenter {
  padding-top: 15px;
}
.left_img {
  width: 17px;
  height: 17px;
  padding-right: 10px;
}

.right_img {
  padding-right: 10px;
  width: 5px;
  height: 10px;
}

.l_txt {
  margin-left: 10px;
  font-size: 14px;
}
</style>