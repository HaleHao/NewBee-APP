<template>
  <div>
    <div class="box" id="pse">
      <van-collapse v-model="activeNames">
        <van-collapse-item :name="index" v-for="(item,index) in list" :key="index">
          <div slot="title">{{item.tetail_name}}</div>
          <pre class="content-inner">{{item.tetail_content}}</pre>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      activeNames: [],
      list:[]
    };
  },
  mounted(){
    this.getdata()
  },
  methods:{
    getdata() {
      Toast.loading({ mask: true,message: '加载中...'})
      let postData = this.$qs.stringify({
          help_id: this.$route.query.id
      })
      this.axios.post(this.API + "api/Lease/help_detail",postData).then(res => {
        console.log(res.data, "help_detail");
        let resdata = res.data;
        if (resdata.code == 200) {
          Toast.clear()
          this.list = resdata.data
        } else {
          Toast.clear()
          Toast(resdata.message);
        }
      });
    },
  }
};
</script>

<style scoped>
#pse >>> .van-collapse-item__content {
  background-color: #f6f6f6;
}
.box {
  border-radius: 5px;
  margin: 10px 15px;
  overflow: hidden;
}
.content-inner{
    white-space:pre-wrap;
    white-space:-moz-pre-wrap;
    white-space:-o-pre-wrap;
    word-wrap:break-word;
}
</style>
