<template>
  <div>
    <div class="bgc box">
      <van-cell :title="item.help_name" is-link :to="`/commonProblem?id=${item.help_id}`" v-for="(item,index) in list" :key="index"/>
      <van-cell title="在线客服" is-link url="https://www.sobot.com/chat/h5/index.html?sysNum=0a99f38b20714891ace3e99607538829"/>
      <a :href="`tel:${tel}`">
        <van-cell title="电话客服" is-link/>
      </a>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      list:[],
      tel:''
    };
  },
  mounted(){
    this.getdata()
    this.gettel()
  },
  methods:{
    getdata() {
      this.axios.post(this.API + "api/Lease/help").then(res => {
        console.log(res.data, "help");
        let resdata = res.data;
        if (resdata.code == 200) {
          this.list = resdata.data
        } else {
          Toast(resdata.message);
        }
      });
    },
    gettel() {
      this.axios.post(this.API + "api/Order/GetServiceTel").then(res => {
        console.log(res.data, "tel");
        let resdata = res.data;
        if (resdata.code == 200) {
          this.tel = resdata.data
        } else {
          Toast(resdata.message);
        }
      });
    },
  }
};
</script>

<style scoped>
.box {
  border-radius: 10px;
  overflow: hidden;
  margin: 15px;
}

.tel {
  font-size: 16px;
  padding: 50px 0;
}
.btn,
.btn1 {
  padding: 20px 0;
}
.btn1 {
  color: #4ea9f9;
}
</style>
