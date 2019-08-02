<template>
  <div>
    <div class="flex-jc-between flex-align-items pd-15 bgc border-b" @click="isshow = true">
      <div>关系</div>
      <div class="flex-align-items fc-grey">
        <span v-if="text==''">请选择</span>
        <span v-else>{{text}}</span>
        <van-icon name="arrow"/>
      </div>
    </div>
    <div class="bgc">
      <div class="pd-15 border-b">
        <span>联系人姓名</span>
        <input type="text" placeholder="请输入" v-model.trim="nameval">
      </div>
      <div class="pd-15">
        <span>联系人电话</span>
        <input type="text" placeholder="请输入" v-model.trim="phoneval">
      </div>
    </div>

    <div class="pd-t-100">
      <button class="btn text-c" @click="submit">提交</button>
    </div>

    <van-popup v-model="isshow" position="bottom" :close-on-click-overlay="false">
      <van-picker
        :columns="columns"
        show-toolbar
        @cancel="isshow = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      nameval: "",
      phoneval: "",
      isshow: false,
      columns: ["父母", "朋友", "兄弟", "姐妹"],
      text: ""
    };
  },
  created() {
    this.getupdate();
  },

  methods: {
    onConfirm(value, index) {
      this.text = value;
      this.isshow = false;
    },
    getupdate() {
      if (this.$route.params.id) {
        Toast.loading({ mask: true, message: "加载中..." });
        let postData = this.$qs.stringify({
          urgent_id: this.$route.params.id
        });
        this.axios
          .post(this.API + "api/Lease/urgent_detail", postData)
          .then(res => {
            console.log(res.data, "user_price");
            let resdata = res.data;
            if (resdata.code == 200) {
              Toast.clear();
              this.text = resdata.data.urgent_sign;
              this.nameval = resdata.data.urgent_name;
              this.phoneval = resdata.data.urgent_phone;
            } else {
              Toast.clear();
              Toast(resdata.message);
            }
          });
      }
    },
    submit() {
      console.log(this.nameval);
      
      if(!(/^[\u4e00-\u9fa5]{2,4}$/.test(this.nameval))){ 
        Toast("请正确输入姓名");
        return;
      }

      // if (!(/^1\d{10}$/.test(this.phoneval))) {
      if(!(/^1(3|4|5|7|8)\d{9}$/.test(this.phoneval))){ 
        Toast("手机号格式不正确");
        return;
      }

      if (this.text == "" || this.nameval == "" || this.phoneval == "") {
        Toast("请先填写完整");
        return;
      }

      let urgent_id = this.$route.params.id;
      if (!urgent_id) {
        let userinfo = JSON.parse(window.localStorage.getItem("userinfo"));
        if (userinfo) {
          Toast.loading({ mask: true, message: "加载中..." });
          let postData = this.$qs.stringify({
            users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
            urgent_phone: this.phoneval,
            urgent_name: this.nameval,
            urgent_sign: this.text
          });
          this.axios
            .post(this.API + "api/Lease/Add_urgent", postData)
            .then(res => {
              console.log(res.data, "add");
              let resdata = res.data;
              if (resdata.code == 200) {
                Toast.clear();
                Toast("添加成功");
                this.$router.go(-1);
              } else {
                Toast.clear();
                Toast(resdata.message||'操作失败');
              }
            });
        }
      } else {
        Toast.loading({ mask: true, message: "加载中..." });
        let postData = this.$qs.stringify({
          urgent_id: urgent_id,
          urgent_phone: this.phoneval,
          urgent_name: this.nameval,
          urgent_sign: this.text
        });
        this.axios
          .post(this.API + "api/Lease/urgent_update", postData)
          .then(res => {
            console.log(res.data, "editor");
            let resdata = res.data;
            if (resdata.code == 200) {
              Toast.clear();
              Toast("编辑成功");
              this.$router.go(-1);
            } else {
              Toast.clear();
              Toast(resdata.message||'操作失败');
            }
          });
      }
    }
  }
};
</script>

<style scoped>
.pd-t-100 {
  padding: 0 15px;
  padding-top: 100px;
}
.btn {
  width: 100%;
  display:block;
  height: 42px;
  line-height: 42px;
  border-radius: 20px;
  color: #fff;
  background-image: linear-gradient(90deg, #2dbbf1 0%, #4ea9f9 100%);
}
</style>
