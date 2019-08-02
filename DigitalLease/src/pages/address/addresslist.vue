<template>
  <div>
    <van-radio-group v-model="radio" @change="onchoose">
      <div v-show="list.length==0" class="fc-grey text-c pd-15 fsz-12">没有更多了</div>
      
      <div v-for="(item,index) in list" :key="index" class="card">
        <van-swipe-cell :right-width="65" :on-close="onClose">
          <div class="bgc flex-align-items item">
            <van-radio :name="index" checked-color="#2DBBF1"></van-radio>
            <div class="flex-1 left" @click="radio=index">
              <div class="mar-b-10">{{item.ads_user||''}} {{item.ads_phone||''}}</div>
              <div>
                <van-tag plain type="danger" v-if="item.ads_state==2">默认</van-tag>
                {{item.ads_province+item.ads_city+item.ads_district+item.ads_address}}
              </div>
            </div>
            <router-link :to="`/addaddress/${item.ads_id}`">
              <img src="../../assets/icon-editor.png" alt="编辑" class="editorimg">
            </router-link>
          </div>
          <div slot="right" class="del bgc-red" @click="getdel(item.ads_id)">删除</div>
        </van-swipe-cell>
      </div>
    </van-radio-group>

    <div class="height"></div>
    <div class="add">
      <router-link to="/addaddress">
        <div class="btn text-c">新增地址</div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from "vant";
export default {
  data() {
    return {
      list: [],
      radio: -1,
      delid: ""
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
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
    },
    getdel(id) {
      console.log(id);
      this.delid = id;
    },
    del() {
      let postData = this.$qs.stringify({
        ads_id: this.delid
      });
      this.axios.post(this.API + "api/Lease/ads_detele", postData).then(res => {
        console.log(res.data, "del");
        let resdata = res.data;
        if (resdata.code == 200) {
          this.getlist();
        } else {
          Toast(resdata.message||'操作失败');
        }
      });
    },
    // 删除 end

    getlist() {
      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
        users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id
      });
      this.axios.post(this.API + "api/Lease/ads_select", postData).then(res => {
        Toast.clear();
        console.log(res.data, "list");
        let resdata = res.data;
        if (resdata.code == 200) {
          this.list = resdata.data;
        } else {
          Toast.clear();
          Toast(resdata.message);
        }
      });
    },

    onchoose(val) {
      // console.log(val)
      if (this.$route.params.type == "shopping") {
        let shoppingSession = JSON.parse(
          window.sessionStorage.getItem("shoppingSession")
        );
        shoppingSession.getaddress = this.list[val];
        window.sessionStorage.setItem(
          "shoppingSession",
          JSON.stringify(shoppingSession)
        );
      }
      if (this.$route.params.type == "refund") {
        let refundSession = JSON.parse(
          window.sessionStorage.getItem("refundSession")
        );
        refundSession.getaddress = this.list[val];
        window.sessionStorage.setItem(
          "refundSession",
          JSON.stringify(refundSession)
        );
      }
      if (this.$route.params.type == "appointmentExpress") {
        let appointmentExpress = JSON.parse(
          window.sessionStorage.getItem("appointmentExpress")
        );
        appointmentExpress.getaddress = this.list[val];
        window.sessionStorage.setItem(
          "appointmentExpress",
          JSON.stringify(appointmentExpress)
        );
      }
      if (this.$route.params.type == "buy") {
        let buySession = JSON.parse(
          window.sessionStorage.getItem("buySession")
        );
        buySession.getaddress = this.list[val];
        window.sessionStorage.setItem("buySession", JSON.stringify(buySession));
      }
      if (this.$route.params.type == "hostCancel") {
        let hostCancelSession = JSON.parse(
          window.sessionStorage.getItem("hostCancelSession")
        );
        hostCancelSession.getaddress = this.list[val];
        window.sessionStorage.setItem(
          "hostCancelSession",
          JSON.stringify(hostCancelSession)
        );
      }
      if (this.$route.params.type == "postDeli") {
        let postDeliSession = JSON.parse(
          window.sessionStorage.getItem("postDeliSession")
        );
        postDeliSession.getaddress = this.list[val];
        window.sessionStorage.setItem(
          "postDeliSession",
          JSON.stringify(postDeliSession)
        );
      }
      if (this.$route.params.type == "platformDeli") {
        let platformDeliSession = JSON.parse(
          window.sessionStorage.getItem("platformDeliSession")
        );
        platformDeliSession.getaddress = this.list[val];
        window.sessionStorage.setItem(
          "platformDeliSession",
          JSON.stringify(platformDeliSession)
        );
      }
      if (this.$route.params.type == "prebuy") {
        let prebuySession = JSON.parse(
          window.sessionStorage.getItem("prebuySession")
        );
        prebuySession.getaddress = this.list[val];
        window.sessionStorage.setItem(
          "prebuySession",
          JSON.stringify(prebuySession)
        );
      }
      if (this.$route.params.type == "friendbuy") {
        let friendbuySession = JSON.parse(
          window.sessionStorage.getItem("friendbuySession")
        );
        friendbuySession.getaddress = this.list[val];
        window.sessionStorage.setItem(
          "friendbuySession",
          JSON.stringify(friendbuySession)
        );
      }
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.height {
  height: 85px;
}
.add {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 15px;
  box-sizing: border-box;
}
.btn {
  height: 42px;
  line-height: 42px;
  border-radius: 20px;
  color: #fff;
  background-image: linear-gradient(90deg, #2dbbf1 0%, #4ea9f9 100%);
}

.del {
  color: #fff;
  width: 60px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  margin: 15px;
  border-radius: 8px;
  overflow: hidden;
}
.card .item {
  padding: 10px;
}
.card .left {
  padding: 0 10px;
}
.editorimg {
  width: 20px;
  height: 20px;
}
</style>
