<template>
  <div class="bgc ">
    <!-- <div class="flex-jc-between flex-align-items box ">
      <div>通知设置</div>
      <van-switch v-model="checked" active-color="#4EA9F9" inactive-color="#fff"/>
    </div> -->

    <div class="btn text-c bgc-red" @click="logout">退出登陆</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: false
    }
  },

  methods: {
    logout(){
      window.localStorage.removeItem("userinfo")
      this.$router.replace({ path: '/login' })
    }
  }
};
</script>

<style scoped>

.box {
  margin: 0 15px;
  height: 40px;
}
.btn {
  position: fixed;
  bottom: 50px;
  width: 100%;
  height: 40px;
  line-height: 40px;
  color: #fff;
  /* background: #4ea9f9; */
}
</style>
