<template>
  <div>
    <div class="bgc">
      <!-- <div class="border-b word_num">
        <div class="flex-align-items xx_comment">
          <span>评分</span>
          <span class="wuxing">
            <van-rate v-model="value" disabled disabled-color="#FFB10E"/>
          </span>
          <span>97.6%</span>
        </div>
        <div>
          <span class="border-blue all_comment">全部(1230)</span>
          <span class="border comment">好评(869)</span>
          <span class="border comment">一般(69)</span>
          <span class="border comment">不好(0)</span>
        </div>
      </div>-->

      <div class="word_mouth">
        <div v-for="(item,index ) in list" :key="index">
          <div class="flex-align-items head_name">
            <img class="head_img" :src="item.head_picture" alt v-if="item.head_picture">
            <img class="head_img" src="../../assets/headimg.png" alt v-else>
            <div class="c-name">{{item.user_name}}</div>
            <van-rate disabled disabled-color="#FFB10E" :size="size" v-model="item.eva_score"/>
          </div>
          <div>
            <span class="grey_12">{{item.create_time}}</span>
          </div>
          <div class="com_det">
            {{item.eva_content}}
          </div>
          <div class="imglist" v-for="(url,index) in item.eva_picture" :key="index">
            <img class="itemimg" :src="url" @click="onImagePreview(index,item.eva_picture)">
          </div>
        </div>
      </div>
    </div>
    <div class="text-c fc-grey pd-15 fsz-12" v-show="list.length==0">没有更多了</div>
  </div>
</template>

<script>
import { Toast,ImagePreview } from "vant";
var instance
export default {
  data() {
    return {
      list:[],
      size:12,
    };
  },
  mounted(){
    this.getdetail()
  },
  methods:{
    //预览
    onImagePreview(index,arr){
        instance = ImagePreview({
            images: arr,
            startPosition: index, 
        });
    },
    getdetail(){
      Toast.loading({ mask: true,message: '加载中...'})
      let postData = this.$qs.stringify({
            goods_id:this.$route.params.id
        })
      this.axios.post(this.API + "api/Lease/GetComment",postData)
      .then(res => {
        console.log(res.data, "commit")
        let resdata = res.data
        if (resdata.code == 200) {
          Toast.clear()
          this.list = resdata.data
        } else {
          Toast.clear()
          Toast(resdata.message)
        }
        
      })
      .catch(error => {
        Toast('网络出错')
      });
    },
  },
  beforeDestroy(){
    if(instance){
      instance.close()
    }
  },
};
</script>

<style scoped>
.fsize13 {
  font-size: 13px;
}
.grey_12 {
  font-size: 12px;
  color: #979797;
}
.all_comment {
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 20px;
  color: #4ea9f9;
}
.comment {
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 20px;
}
.wuxing {
  padding: 0 10px 0 5px;
}
.product {
  width: 92%;
  height: 100%;
  padding-top: 10px;
}
.product_title {
  font-size: 17px;
  font-weight: 500;
}
.img_sc {
  width: 19px;
  height: 20px;
}
.price_box {
  padding: 15px 0;
}
.price {
  color: #f21e1e;
  font-size: 18px;
}

.lab {
  background: #fc3434;
  color: #fff;
  padding: 2px 5px;
}
.rule {
  padding: 15px 0 12px 10px;
  font-size: 15px;
  font-weight: 600;
}

.img_xdlc {
  width: 35px;
  height: 35px;
}
.duo_mian {
  height: 36px;
  line-height: 36px;
}
.word_num {
  padding: 0 0 20px 15px;
}
.xx_comment {
  line-height: 40px;
}
.img_zq {
  width: 13px;
  height: 16px;
  margin-right: 10px;
}
.img_myj {
  width: 17px;
  height: 17px;
  margin-right: 10px;
}
.process {
  margin-top: 10px;
}
.process_det {
  padding-bottom: 15px;
}
.grey_line1 {
  position: absolute;
  width: 50px;
  border-bottom: 2px #aeaeae dashed;
  height: 2px;
  top: 15px;
  left: 80px;
}
.grey_line2 {
  position: absolute;
  width: 50px;
  border-bottom: 2px #aeaeae dashed;
  height: 2px;
  top: 15px;
  left: 190px;
}

.word_mouth {
  margin: 0 10px;
  height: 100%;
}

.word_mouth > div {
  border-bottom: 1px solid #f0f0f0;
}

.word_mouth :last-child {
  border-bottom: 1px solid #fff;
}
.head_name,
.com_det {
  padding: 5px 0;
}
.head_img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.c-name {
  padding:0 10px;
}
.img_r {
  width: 7px;
  height: 11px;
}
.imglist {
  display: inline-block;
  padding: 10px 0;
}
.itemimg {
  width: 88px;
  height: 89px;
  border-radius: 5px;
  margin-right: 10px;
}
.product_det {
  width: 92%;
  height: 100%;
}
.dettail {
  font-size: 15px;
  font-weight: 600;
  padding: 13px 0;
}
.weight {
  padding: 10px 0;
}
.pro_img {
  width: 100%;
  height: 450px;
  border-radius: 5px;
  padding: 10px 0;
}
.footer {
  width: 100%;
  height: 50px;
  position: fixed;
  bottom: 0;
}
.btn {
  height: 32px;
  line-height: 32px;
  color: #fff;
  font-size: 14px;
  text-align: center;
  border-radius: 20px;
}
.bcolor {
  background: #b49a7a;
}
.bcol {
  background: linear-gradient(90deg, #60c0fd, #4ea9f9);
}

.img_kf {
  width: 18px;
  height: 18px;
}
.f10_col {
  font-size: 10px;
  color: #030303;
}
.padding_lr {
  padding: 0 15px;
}
.margin_left {
  margin-left: 10px;
}
</style>

