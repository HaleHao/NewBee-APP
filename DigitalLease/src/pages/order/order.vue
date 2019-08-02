<template>
    <div>
        <div class="nav bgc border-b flex-jc-center">
            <div :class="{ selected: selected==0 }" @click="nav(0)">租赁单</div>
            <div :class="{ selected: selected==1 }" @click="nav(1)">租转售</div>
        </div>

        <keep-alive>
            <router-view v-if="$route.meta.keepAlive" v-wechat-title="$route.meta.title" ></router-view>
        </keep-alive>

        <router-view v-if="!$route.meta.keepAlive" v-wechat-title="$route.meta.title" ></router-view>
    </div>
</template>

<script>
export default {
    data(){
        return{
            selected: 0
        }
    },
    watch: {
        $route(to,from){
            // console.log(to.path)
            if(to.path){
                if(to.path=='/order/buyOrder'){
                    this.selected=1
                }else{
                    this.selected=0
                }
            }
        }
    },
    methods:{
        nav(n) {
            this.selected = n;
            if(n == 0){
                this.$router.push({ path: `/order` });
            }
            if(n == 1){
                this.$router.push({ path: `/order/buyOrder` });
            }
        },
    }
}
</script>

<style scoped>
.nav {
  height: 42px;
  line-height: 42px;
}
.nav > div {
  color: #666;
  font-size: 16px;
}
.nav > div:nth-of-type(1) {
  margin-right: 50px;
}
.nav .selected {
  color: #000;
  font-weight: bold;
}
</style>
