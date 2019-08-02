<template>
  <div class="amap-page-container" >
    <el-amap
      ref="map"
      vid="amap"
      :center="center"
      :zoom="zoom"
      class="amap"
    >
      <el-amap-marker vid="component-marker" ></el-amap-marker>
    </el-amap>

    <div class="bottom">
      <div class="bgc pd-15">
        <p class="mar-b-10">{{shopinfo[0]}}</p>
        <p class="fsz12 fc-grey">{{shopinfo[1]}}</p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    let self = this;
    return {
      zoom: 16,
      center:[this.$route.params.center.split(",")[0],this.$route.params.center.split(",")[1]],
      shopinfo: this.$route.params.shop.split(","),
    };
  },
  created(){
    
  },
  methods: {

  },
  beforeDestroy(){
    //销毁地图
    // this.$refs.map.$$getInstance().destroy()    
  },
};
</script>

<style>
.amap-page-container{
    width: 100%;
    height:100vh;
}
</style>


<style scoped>
.fsz12{
  font-size: 12px
}

.bottom {
  z-index: 100;
  width: 100%;
  position: fixed;
  bottom:20px;
  left:0;
  box-sizing: border-box;
  padding: 0 10px;
}

</style>