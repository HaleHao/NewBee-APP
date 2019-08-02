<template>
  <div class="pd-15">
      <div class="card bgc mar-b-10 flex-align-items" v-for="(item,index) in list" :key="index">
        <div class="flex-1 left">
          <div>关系:{{item.urgent_sign}}</div>
          <div>联系人电话:{{item.urgent_phone}}</div>
          <div>联系人姓名:{{item.urgent_name}}</div>
        </div>
        <div class="tools">
          <img src="../../assets/icon-editor.png" alt="编辑" @click="edit(item.urgent_id)">
          <img src="../../assets/icon-del.png" alt="删除" @click="del(item.urgent_id)">
        </div>
      </div>

    <router-link class="add bgc flex-center" to="/addPeople">
      <van-icon name="add-o"/>
      <span>新增紧急联系人</span>
    </router-link>
  </div>
</template>

<script>
import { Dialog,Toast } from "vant";
export default {
  data() {
    return {
      list: [{}],
      urgent_id: ""
    };
  },
  created() {
    this.geturgent();
  },
  methods: {
    edit(id) {
      //编辑
      this.$router.push({ path: "/addPeople/" + id });
    },
    geturgent() {
      Toast.loading({ mask: true, message: "加载中..." });
      let userinfo = JSON.parse(window.localStorage.getItem("userinfo"));
      if (userinfo) {
        let postData = this.$qs.stringify({
          users_id: userinfo.users_id
        });
        this.axios
          .post(this.API + "api/Lease/urgent_select", postData)
          .then(res => {
            console.log(res.data, "user_price");
            let resdata = res.data;
            if (resdata.code == 200) {
              Toast.clear();
              this.list = resdata.data;
              // this.list.forEach((item, i) => {
              //   let urgent_id = this.list[i].urgent_id;
              // });
            } else {
              Toast.clear();
              Toast(resdata.message);
            }
          });
      }
    },
    del(urgent_id) {

      Dialog.confirm({
        title: "",
        message: "是否删除?"
      })
      .then(() => {
        // on confirm
        console.log(this.urgent_id, "111");
        Toast.loading({ mask: true, message: "加载中..." });
        let postData = this.$qs.stringify({
          urgent_id: urgent_id
        });
        this.axios
          .post(this.API + "api/Lease/urgent_delete", postData)
          .then(res => {
            console.log(res.data, "delete");
            let resdata = res.data;
            if (resdata.code == 200) {
              Toast.clear();
              this.geturgent();
              // this.list.splice(this.urgent_id, 1);
            } else {
              Toast.clear();
              Toast(resdata.message);
            }
          });
      })
      .catch(() => {
        
      });
    }
  }
};
</script>

<style scoped>
.card {
  padding: 10px;
  height: 135px;
  box-sizing: border-box;
}
.card .tools > img {
  width: 22px;
  height: 22px;
}
.card .left {
  padding-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
}
.tools {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
}

.add {
  height: 64px;
  color: #2dbbf1;
  border-radius: 5px;
}
.add > span {
  margin-left: 10px;
}
</style>
