<template>
    <div>
        <div class="textarea bgc"><textarea v-model.trim="contentval" name="" id="" rows="6" placeholder="输入否认的理由"></textarea></div>
        <div class="bgc imglist">
            <img @click="onImagePreview()" :src="img.content" v-show="!img==''">
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
    data(){
        return{
            imgarr:[],
            img:'',
            contentval:'',
            showupload: true
        }
    },
    watch:{
        imgarr(){
            if(this.imgarr.length==3){
                this.showupload = false
            }
        }
    },
    methods:{
        //图片
        onRead(file) {
            console.log(file)
            this.img = file
        },
        //预览
        onImagePreview(index){
            instance = ImagePreview([this.img]);
        },
        submit(){
            if(this.contentval==''||this.img==''){
                Toast('还有未填写')
                return
            }

            Toast.loading({ mask: true,message: '加载中...',duration:0})
            let config = {
                headers:{'Content-Type':'multipart/form-data'}
            }

            let formData = new FormData()
            formData.append('image',this.img.file,this.img.file.name)
            formData.append('order_id',this.$route.params.id)
            formData.append('content',this.contentval)

            this.axios.post(this.API + "api/Lease_Order/afterConfirmation",formData,config)
            .then(res => {
                console.log(res.data, "data")
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
}
</script>

<style scoped>
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
