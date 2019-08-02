<template>
  <div id="app" class="fsz">
    <keep-alive :max="10">
        <router-view v-if="$route.meta.keepAlive" v-wechat-title="$route.meta.title" >
            <!-- 这里是会被缓存的视图组件，比如列表A页面 -->
        </router-view>
    </keep-alive>

    <router-view v-if="!$route.meta.keepAlive" v-wechat-title="$route.meta.title" >
        <!-- 这里是不被缓存的视图组件，比如详情B页面-->
    </router-view>

    <div class="nav-pd-b" v-if="navshow"></div>

    <nav class="nav bgc flexbox" v-if="navshow">
      <div>
        <router-link to="/">
          <div class="img" v-if="selected=='index'">
            <img src="./assets/tab/indexs.png">
          </div>
          <div class="img" v-else>
            <img src="./assets/tab/index.png">
          </div>
          <p :class="{ 'fc-blue': selected=='index' }">首页</p>
        </router-link>
      </div>
      <div>
        <router-link to="/shop">
          <div class="shops" v-if="selected=='shop'"><img src="./assets/tab/shops.png" ></div>
          <div class="img" v-else><img src="./assets/tab/shop.png" ></div>
          <p :class="{ 'fc-blue': selected=='shop' }">门店</p>
        </router-link>
      </div>
      <div>
        <router-link to="/order">
          <div class="img" v-if="selected=='order'"><img src="./assets/tab/orders.png" ></div>
          <div class="img" v-else><img src="./assets/tab/order.png" ></div>
          <p :class="{ 'fc-blue': selected=='order' }">订单</p>
        </router-link>
      </div>
      <div>
        <router-link to="/me">
          <div class="img" v-if="selected=='me'">
            <img src="./assets/tab/mys.png">
          </div>
          <div class="img" v-else>
            <img src="./assets/tab/my.png">
          </div>
          <p :class="{ 'fc-blue': selected=='me' }">我的</p>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script>
// import VConsole from 'vconsole/dist/vconsole.min.js'

export default {
  data() {
    return {};
  },

  computed: {
    selected() {
      if (this.$route.path === "/") {
        return "index";
      }
      if (this.$route.path === "/shop") { 
        return "shop";
      }
      if (this.$route.path === "/order"||this.$route.path === "/order/buyOrder") {
        return "order";
      }
      if (this.$route.path === "/me") {
        return "me";
      }
    },
    navshow() {
      let url = this.$route.path;
      // let urlarr = ['/','/shop','/order','/me']
      // if (urlarr.includes(url)) {
      //   return true
      // }
      
      if (url.includes('/login')) {
        return false
      }
      if (url.includes('/sinalogin')) {
        return false
      }
      if (url.includes('/alilogin')) {
        return false
      }
      if (url.includes('/passwordLogin')) {
        return false
      }
      if (url.includes('/forgetPassword')) {
        return false
      }
      if (url.includes('/resetPassword')) {
        return false
      }
      if (url.includes('/inputCode')) {
        return false
      }
      if (url.includes('/newpassword')) {
        return false
      }
      if (url.includes('/sendcode')) {
        return false
      }
      if (url.includes('/newphone')) {
        return false
      }
      if (url.includes('/Modify')) {
        return false
      }
      if (url.includes('/map')) {
        return false
      }
      if (url.includes('/pay')) {
        return false
      }
      if (url.includes('/orderDetail')) {
        return false
      }
      if (url.includes('/buyOrderDetail')) {
        return false
      }
      if (url.includes('/cart')) {
        return false
      }
      if (url.includes('/locationList')) {
        return false
      }
      if (url.includes('/calendar')) {
        return false
      }
      if (url.includes('/people')) {
        return false
      }
      if (url.includes('/addresslist')) {
        return false
      }
      if (url.includes('/zagreement')) {
        return false
      }
      if (url.includes('/redpacket')) {
        return false
      }
      if (url.includes('/rpfriend')) {
        return false
      }
      if (url.includes('/questionnaire')) {
        return false
      }
      if (url.includes('/friendRepay')) {
        return false
      }
      if (url.includes('/friendBuy')) {
        return false
      }
      
      return true

    }
  },
  mounted(){
    // let vConsole = new VConsole()
  },
  methods: {}
};
</script>

<style scoped>
.nav-pd-b{
  padding-bottom: 50px;
}
.nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 5;
  border-top: 1px solid #f2f2f2;
}
.nav > div {
  flex: 1;
  text-align: center;
  font-size: 10px;
  box-sizing: border-box;
  padding: 5px;
}
.nav .img {
  display: inline-block;
  width: 22px;
  height: 22px;
}
.shops {
  display: inline-block;
  width: 18px;
  height: 22px;
}
</style>


<style>
.fsz {
  font-size: 14px;
}
.fsz-12 {
  font-size: 12px;
}
.mar-bottom {
  margin-bottom: 50px;
}
.mar-b-10 {
  margin-bottom: 10px;
}
.pd-15 {
  padding: 15px;
}
.pd-lr-15 {
  padding: 0 15px;
}
</style>
