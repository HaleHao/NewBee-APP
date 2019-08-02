<template>
  <div>
    <div v-show="addresslist.length==0" class="fc-grey text-c pd-15 fsz-12">没有更多了</div>
    
    <div
      class="hang bgc"
      v-for="(item,index) in addresslist"
      :key="index"
      @click="edit(item.ads_id)"
    >
      <van-swipe-cell :right-width="65" :on-close="onClose">
        <van-cell is-link center>
          <template slot="title">
            <div>
              <span>{{item.ads_user}}</span>
              <span>{{item.ads_phone}}</span>
              <span class="moren" v-if="item.ads_state==2">默认</span>
            </div>
            <div>{{item.ads_province+item.ads_city+item.ads_district+item.ads_address}}</div>
          </template>
          <!-- 编辑 -->
          <template slot="right-icon">
            <img src="../../assets/bj.png" @click="edit(item.ads_id)" alt="编辑" class="left_img">
          </template>
        </van-cell>
        <div slot="right" class="del bgc-red" @click="getdel(item.ads_id)">删除</div>
      </van-swipe-cell>
    </div>
    <router-link to="/AddInformation">
      <div class="btn text-c">添加</div>
    </router-link>
  </div>
</template>

<script>
import { Dialog, Toast } from "vant";
export default {
  data() {
    return {
      addresslist: [],
      delid: ""
    };
  },
  created() {
    this.getselect();
  },
  methods: {
    getselect() {
      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
        users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id
      });

      this.axios.post(this.API + "api/Lease/ads_select", postData).then(res => {
        console.log(res.data, "getselect");
        let resdata = res.data;
        if (resdata.code == 200) {
          Toast.clear();
          var list = resdata.data;

          this.addresslist = list;
          console.log(this.addresslist);
        } else {
          Toast.clear();
          Toast(resdata.message);
        }
      });
    },
    edit(id) {
      this.$router.push({ path: "/AddInformation/" + id });
    },

    getdel(id) {
      console.log(id);
      this.delid = id;
    },
    del() {
      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
        ads_id: this.delid
      });
      this.axios.post(this.API + "api/Lease/ads_detele", postData).then(res => {
        console.log(res.data, "del");
        let resdata = res.data;
        if (resdata.code == 200) {
          Toast.clear();
          this.getselect();
        } else {
          Toast.clear();
          Toast(resdata.message||'操作失败');
        }
      });
    },
    // 删除
    onClose(clickPosition, instance) {
      switch (clickPosition) {
        case "left":
        case "cell":
        case "outside":
          instance.close();
          break;
        case "right":
          Dialog.confirm({
            message: "确定删除吗？"
          }).then(e => {
            if (e == "confirm") {
              this.del();
            }
          });
          break;
      }
    }
  }
};
</script>


<style scoped>
.hang {
  margin: 10px;
  line-height: 35px;
  overflow: hidden;
  border-radius: 5px;
}

.moren {
  padding: 2px 5px;
  color: #fff;
  font-size: 10px;
  background: linear-gradient(90deg, #60c0fd, #4ea9f9);
  box-shadow: 0px 0px 6px 0px rgba(79, 171, 249, 0.36);
  border-radius: 4px;
}
.left_img {
  width: 12px;
  height: 12px;
  padding-right: 5px;
}
.btn {
  position: fixed;
  bottom: 49px;
  width: 100%;
  height: 40px;
  line-height: 40px;
  background: linear-gradient(90deg, #60c0fd, #4ea9f9);
  color: #fff;
}
.del {
  /* background-color: #d2d2d2; */
  color: #fff;
  width: 60px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
