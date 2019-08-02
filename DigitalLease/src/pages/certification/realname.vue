<template>
    <div>
        <div class="bgc mar-b-10">
            <div class="pd-15" style="padding-bottom:0">身份证拍照示例</div>
            <div class="sample flex-jc-between pd-15" >
                <div>
                    <div class="mar-b-10 position"><img src="../../assets/idcard1.png" alt=""><img src="../../assets/icon-true.png" alt="" class="icons"></div>
                    <div class="fsz12 text-c">居中清晰</div>
                </div>
                <div>
                    <div class="mar-b-10 position"><img src="../../assets/idcard2.png" alt=""><img src="../../assets/icon-false.png" alt="" class="icons"></div>
                    <div class="fsz12 text-c">边框缺失</div>
                </div>
                <div>
                    <div class="mar-b-10 position"><img src="../../assets/idcard3.png" alt=""><img src="../../assets/icon-false.png" alt="" class="icons"></div>
                    <div class="fsz12 text-c">照片模糊</div>
                </div>
                <div>
                    <div class="mar-b-10 position"><img src="../../assets/idcard4.png" alt=""><img src="../../assets/icon-false.png" alt="" class="icons"></div>
                    <div class="fsz12 text-c">闪光强烈</div>
                </div>
            </div>
        </div>

        <section class="bgc box-sizing">
            <div class="pt"></div>
            <div class="pd-lr-15">上传身份证 人像面</div>
            <div class="flex-center box">
                <van-uploader :after-read="onRead1" multiple >
                    <div class="upload flex-center">
                        <img src="../../assets/icon-camera.png" alt="" class="icon" v-show="!img1" >
                        <img :src="img1" alt="" v-show="img1" style="object-fit:contain">
                    </div>
                </van-uploader>
            </div>
        </section>
        <section class="bgc box-sizing">
            <div class="pd-lr-15">上传身份证 国徽面</div>
            <div class="flex-center box">
                <van-uploader :after-read="onRead2" multiple  >
                    <div class="upload flex-center">
                        <img src="../../assets/icon-camera.png" alt="" class="icon" v-show="!img2" >
                        <img :src="img2" alt="" v-show="img2" style="object-fit:contain">
                    </div>
                </van-uploader>
            </div>
        </section>

        <div class="pd-15"><div class="btn text-c" @click="submit">提交</div></div>
    </div>
</template>

<script>
import { Toast,Dialog } from "vant";
import { Compress } from "@/utils/util.js";
export default {
    data(){
        return{
            img1:null,
            img2:null,
            file1:null,
            file2:null,
            maxsize: 2097152,
        }
    },

    methods:{
        onRead1(file) {
            console.log(file)
            if(Array.isArray(file)){
                Toast('只能单选') 
                return
            }
            this.img1 = file.content
            Compress(file.content,file.file.type).then(res=>{
                // console.log(res,'compress')
                this.file1 = res
            })
        },
        onRead2(file) {
            console.log(file)
            if(Array.isArray(file)){
                Toast('只能单选') 
                return
            }
            this.img2 = file.content
            Compress(file.content,file.file.type).then(res=>{
                // console.log(res,'compress')
                this.file2 = res
            })  
        },

        submit(){
            Toast.loading({ mask: true,message: '加载中...'})
            let formData = new FormData()
            formData.append('file',this.file1)
            formData.append('file1',this.file2)
            formData.append('users_id',JSON.parse(window.localStorage.getItem("userinfo")).users_id)

            let config = {
                headers:{'Content-Type':'multipart/form-data'}
            }

            this.axios.post(this.API + "api/Order/CheckIDCard",formData,config)
            .then(res => {
                console.log(res.data, "res")
                let resdata = res.data
                if (resdata.code == 200) {
                    Toast.clear()
                    Dialog.alert({
                        message: '操作成功'
                    }).then((e) => {
                        this.$router.push({ path: "/realnameSuc" });
                    });
                } else {
                    Toast.clear()
                    Toast(resdata.message||'操作失败')
                }
            })
            .catch(error => {
                Toast.clear()
                Toast('网络出错')
            });
        },
    }
}
</script>

<style scoped>
.fsz12{
    font-size: 12px
}
.c6{
    color:#666
}
.pt{
    padding-top: 15px
}
.btn{
    height: 42px;
    line-height: 42px;
    border-radius: 20px;
    color: #fff;
    background-image: linear-gradient(90deg, #2DBBF1 0%, #4EA9F9 100%);
}

.sample img {
    width: 68px;
    height: 52px;
}
.sample .icons {
    width: 15px;
    height: 15px;
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%)
}

.box {
    height: 150px;
}
.upload {
    width: 226px;
    height: 113px;
    border: 1px dashed #666;
    border-radius: 6px;
}
.upload .icon {
    width: 28px;
    height: 24px;
}

.idimg{
    width: 140px;
    height: 100px;
}

</style>
