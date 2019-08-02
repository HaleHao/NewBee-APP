<template>
  <div>
    <div class="border-b text-c bgc ratebox">
      <van-rate v-model="rateval" @change="onRating" :size="size"/>
    </div>

    <div class="textarea bgc"><textarea rows="6" v-model.trim="contentval" placeholder="分享使用体验，有机会上我们的头版哦！分享视频内容，更有机会上New Bee官方抖音并拿大奖！"></textarea></div>
    <div class="bgc imglist">
        <img @click="onImagePreview(index)" :src="item.content" alt="" v-for="(item,index) in imgarr" :key="index">
      <van-uploader :after-read="onRead" accept="image/png, image/jpeg" multiple v-show="showupload">
        <img src="../../assets/uploadimg.png" alt="">
      </van-uploader>
    </div>

    <div class="pd-15"><div class="btn text-c" @click="submit">提交</div></div>
  </div>
</template>

<script>
import { Toast,Dialog,ImagePreview } from 'vant';
var instance

export default {
  data() {
    return {
      rateval: 5,
      size:27,
      contentval:'',
      imgarr:[],
      showupload:true,
    };
  },
  watch:{
        imgarr(){
            if(this.imgarr.length==3){
                this.showupload = false
            }
        }
    },
  methods: {
      //评星
    onRating(e) {
      console.log(e);
    },
    //图片
    onRead(file) {
      console.log(file)
      this.imgarr.push(file)
    },
    //预览
    onImagePreview(index){
        let arr = []
        for(let v of this.imgarr){
            arr.push(v.content)
        }
        instance = ImagePreview({
            images: arr,
            startPosition: index, 
        });
    },
    submit(){
      if(this.contentval==''){
        Toast('请先填写内容')
        return
      }

      Toast.loading({ mask: true,message: '加载中...',duration:0})
      let config = {
          headers:{'Content-Type':'multipart/form-data'}
      }

      let formData = new FormData()
      for(let v of this.imgarr){
          formData.append('eva_picture[]',v.file,v.file.name)  //多图上传
      }
      if(this.$route.query.type=='buyorder'){
        formData.append('buyorder_id',this.$route.params.id)
      }
      if(this.$route.query.type=='leaseorder'){
        formData.append('order_id',this.$route.params.id)
      }
      formData.append('goods_id',this.$route.params.goodid)
      formData.append('eva_content',this.contentval)
      formData.append('eva_service',this.rateval)
      formData.append('users_id',JSON.parse(window.localStorage.getItem("userinfo")).users_id)

      this.axios.post(this.API + "api/Lease/goods_evaluate",formData,config)
      .then(res => {
          console.log(res.data, "submit")
          let resdata = res.data
          if (resdata.code == 200) {
              Toast.clear()
                  Dialog.alert({
                      message: '操作成功'
                  }).then((e) => {
                      this.$router.go(-1);
                  });
          } else {
              Toast.clear()
              Toast(resdata.message||'操作失败')
          }
      });
    }
  },
  beforeDestroy(){
    if(instance){
      instance.close()
    }
  },
};
</script>

<style scoped>
.ratebox {
  padding: 10px 0;
}
.textarea {
  padding: 10px;
}
.textarea textarea{
    width: 100%;
}
.imglist{
  padding: 10px 0;
}
.imglist img {
    width: 77px;
    height: 77px;
    padding-left: 10px;
    padding-bottom: 10px;
}
.btn{
    margin-top: 76px;
    height: 42px;
    line-height: 42px;
    border-radius: 20px;
    color: #fff;
    background-image: linear-gradient(90deg, #2DBBF1 0%, #4EA9F9 100%);
}
</style>
