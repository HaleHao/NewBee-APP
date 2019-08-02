<template>
  <div>
    <van-popup v-model="showmodel1" :close-on-click-overlay="false">
      <div class="model1">
        <div class="text-c pd-15" v-if="mxcode&&mxcode==1">认证成功</div>
        <div class="text-c pd-15" v-else>认证失败</div>
        <div class="text-c pd-lr-15 mar-b-10"><router-link to="/" replace><van-button type="default" size="large">回到首页</van-button></router-link></div>
        <div v-if="mxcode&&mxcode!=1" class="text-c pd-lr-15 mar-b-10" @click="getgo"><van-button type="danger" size="large">重新认证</van-button></div>
      </div>
    </van-popup>
    <van-popup v-model="showmodel2" :close-on-click-overlay="false">
      <div class="model1">
        <div class="text-c pd-15">
          <div>认证失败</div>
          <div class="text-c">{{message}}</div>
        </div>
        <div class="text-c pd-lr-15 mar-b-10"><router-link to="/" replace><van-button type="default" size="large">回到首页</van-button></router-link></div>
        <div v-if="mxcode&&mxcode!=1" class="text-c pd-lr-15 mar-b-10" @click="getgo"><van-button type="danger" size="large">重新认证</van-button></div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      showmodel1: false,
      showmodel2:false,
      mxcode: null,
      message:null
    };
  },
  created(){
    //mxcode=1&taskType=chsi&message=认证成功&loginDone=1&userId=3&account=421002199604251410&taskId=97020380-3996-11e9-b239-00163e00413f
    let mxcode = this.$route.query.mxcode
    if(mxcode){
      this.mxcode = this.$route.query.mxcode
      if(this.$route.query.mxcode==1){
        this.getinfo()
      }else{
        this.showmodel1 = true
      } 
    }else{
      this.getgo()
    }
  },
  methods: {
    getinfo(){
      let taskType = this.$route.query.taskType
      let message = this.$route.query.message
      let loginDone = this.$route.query.loginDone
      let userId = this.$route.query.userId
      let account = this.$route.query.account
      let taskId = this.$route.query.taskId

      Toast.loading({ mask: true, message: "加载中..." });
        let postData = this.$qs.stringify({
            userId: userId,
            taskType:taskType,
            message:message,
            loginDone:loginDone,
            account:account,
            taskId:taskId,
            mxcode: this.$route.query.mxcode
        });
        this.axios.post(this.API + "api/Order/CheckCHSI", postData)
        .then(res => {
            console.log(res.data, "post");
            let resdata = res.data;
            if (resdata.code == 200) {
               this.showmodel1 = true
            } else {
              this.message = resdata.message
              this.showmodel2 = true
              // Toast(resdata.message);
            }
        })
        .catch(error => {
           this.message = '网络出错'
          this.showmodel2 = true
          // Toast('网络出错')
        });
    },
    getgo() {
      Toast.loading({ mask: true, message: "加载中..." });
        let postData = this.$qs.stringify({
            users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
        });
        this.axios.post(this.API + "api/Order/GetCHISUrl", postData)
        .then(res => {
            console.log(res.data, "goschool");
            let resdata = res.data;
            if (resdata.code == 200) {
                window.location.href = resdata.data
            } else {
                Toast(resdata.message);
            }
        })
        .catch(error => {
            Toast('网络出错')
        });
    },
  }
};
</script>

<style scoped>
.pd-t-100 {
  padding: 0 15px;
  padding-top: 100px;
}
.btn {
  height: 42px;
  line-height: 42px;
  border-radius: 20px;
  color: #fff;
  background-image: linear-gradient(90deg, #2dbbf1 0%, #4ea9f9 100%);
}

.box {
  border-radius: 10px;
  overflow: hidden;
  margin: 15px;
}
.box .w {
  width: 50px;
  display: inline-block;
}

.model1 {
  width: 200px;
}
</style>
