<template>
  <div>
    <div class="bgc box">
      <div class="pd-15 border-b">
        <span style=" margin-right: 10px">原密码</span>
        <input type="password"  placeholder="请输入原密码" v-model.trim="oldval">
      </div>
      <div class="pd-15">
        <span style=" margin-right: 10px">新密码</span>
        <input type="password" placeholder="请输入新密码" v-model.trim="newval">
      </div>
    </div>
    <div class="flex-jc-center">
      <div class="btn text-c" @click="submit">确定修改</div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
    data(){
        return{
            oldval: '',
            newval: ''
        }
    },
    methods:{
        submit(){
          Toast.loading({ mask: true,message: '加载中...'})
            let postData = this.$qs.stringify({
                users_pwd: this.oldval,
                new_pwd: this.newval,
                user_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id
            })
            this.axios.post(this.API + "api/Lease/update_pwd",postData)
            .then(res => {
                console.log(res.data, "submit");
                let resdata = res.data;
                if (resdata.code == 200) {
                  Toast.clear()
                  Toast('修改成功')
                  this.$router.go(-1);
                } else {
                  Toast.clear()
                  Toast(resdata.message);
                }
            });
        }
    }
};
</script>

<style scoped>
.box {
  margin: 15px;
  border-radius: 10px;
}
.btn {
  width: 298px;
  height: 40px;
  line-height: 40px;
  background: linear-gradient(90deg, #60c0fd, #4ea9f9);
  border-radius: 20px;
  color: #fff;
}
</style>