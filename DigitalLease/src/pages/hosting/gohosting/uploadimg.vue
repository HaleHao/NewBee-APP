<template>
    <div>
        <div class="pd-15 fc-grey bgc">请上传产品相关照片</div>
        
        <div class="bgc">
        <div class="box flex-jc-between" >
            <div>
                <div class="uploadimg flex-center position" v-if="!fileimg1">
                    <van-uploader :after-read="onRead1" accept="image/png, image/jpeg" multiple>
                        <!-- <img src="../../../assets/tg_camera.png" alt=""> -->
                        <img src="@/assets/sample/sample1.png" alt="示例图">
                        <span class="fsz-12 sampletext">示例</span>
                    </van-uploader>
                </div>
                <div class="fileimg" v-else>
                    <van-uploader :after-read="onRead1" accept="image/png, image/jpeg" multiple>
                        <img :src="fileimg1.content" alt="">
                    </van-uploader>
                </div>

                <div class="text-c btext">上传包含产品配件的全家福</div>
            </div>
            <div>
                <div class="uploadimg flex-center position" v-if="!fileimg2">
                    <van-uploader :after-read="onRead2" accept="image/png, image/jpeg" multiple>
                        <!-- <img src="../../../assets/tg_camera.png" alt=""> -->
                        <img src="@/assets/sample/sample2.jpeg" alt="示例图">
                        <span class="fsz-12 sampletext">示例</span>
                    </van-uploader>
                </div>
                <div class="fileimg" v-else>
                    <van-uploader :after-read="onRead2" accept="image/png, image/jpeg" multiple>
                        <img :src="fileimg2.content" alt="">
                    </van-uploader>
                </div>

                <div class="text-c btext">上传可以看清型号的照片</div>
            </div>
        </div>
        <div class="fc-grey pd-lr-15 bgc fsz12 mar-b-10">(配件分开摆放整齐，清晰可见)</div>

        <div class="box flex-jc-between">
            <div>
                <div class="uploadimg flex-center position" v-if="!fileimg3">
                    <van-uploader :after-read="onRead3" accept="image/png, image/jpeg" multiple>
                        <!-- <img src="../../../assets/tg_camera.png" alt=""> -->
                        <img src="@/assets/sample/sample3.png" alt="示例图">
                        <span class="fsz-12 sampletext">示例</span>
                    </van-uploader>
                </div>
                <div class="fileimg" v-else>
                    <van-uploader :after-read="onRead3" accept="image/png, image/jpeg" multiple>
                        <img :src="fileimg3.content" alt="">
                    </van-uploader>
                </div>

                <div class="text-c btext">上传产品照片</div>
            </div>
            <div>
                <div class="uploadimg flex-center position" v-if="!fileimg4">
                    <van-uploader :after-read="onRead4" accept="image/png, image/jpeg" multiple>
                        <!-- <img src="../../../assets/tg_camera.png" alt=""> -->
                        <img src="@/assets/sample/sample4.jpeg" alt="示例图">
                        <span class="fsz-12 sampletext">示例</span>
                    </van-uploader>
                </div>
                <div class="fileimg" v-else>
                    <van-uploader :after-read="onRead4" accept="image/png, image/jpeg" multiple>
                        <img :src="fileimg4.content" alt="">
                    </van-uploader>
                </div>

                <div class="text-c btext">上传产品损坏处的照片</div>
            </div>
        </div>
        <div class="fc-grey pd-lr-15 bgc fsz12 pdb">(收到设备时会根据照片核实成色)</div>
        </div>

        <div class="pd-15"><div class="btn text-c" @click="onshowmodel">提交</div></div>

        <div class="model" v-if="showmodel">
            <div class="main bgc position">
                <div class="closeimg" @click="showmodel=false"><van-icon name="close" /></div>
                <div class="flex-jc-between pd"><span class="fc-grey">品类</span><span>{{gohostingSession.typetext.cate_name}}</span></div>
                <div class="flex-jc-between pd"><span class="fc-grey">品牌</span><span>{{gohostingSession.brandtext.brand_name}}</span></div>
                <div class="flex-jc-between pd"><span class="fc-grey">型号</span><span>{{gohostingSession.modeltext.model_name}}</span></div>
                <div class="flex-jc-between pd"><span class="fc-grey">颜色</span><span>{{gohostingSession.colortext}}</span></div>
                <div class="flex-jc-between pd"><span class="fc-grey">数量</span><span>1</span></div>
                <div class="flex-jc-between pd">
                    <span class="fc-grey">含配件</span>
                    <span class="flex-1 fittings">{{gohostingSession.fittingstring}}</span>
                </div>
                <div class="flex-jc-between pd"><span class="fc-grey">购买时间</span><span>{{`${gohostingSession.datetext[0]}-${gohostingSession.datetext[1]}-${gohostingSession.datetext[2]}`}}</span></div>
                <div class="flex-jc-between pd"><span class="fc-grey">购买价格</span><span>￥{{gohostingSession.priceval}}</span></div>
                <div class="flex-jc-between pd"><span class="fc-grey">外观成色</span><span>{{gohostingSession.colourtext}}</span></div>
                <div class="flex-jc-between pd"><span class="fc-grey">功能状况</span><span>{{gohostingSession.statetext}}</span></div>
                <div class="flex-jc-between pd"><span class="fc-grey">序列号</span><span>{{gohostingSession.serialnumval}}</span></div>
                <div class="flex-jc-between pd"><span class="fc-grey">联系方式</span><span>{{gohostingSession.telval}}</span></div>
                <div class="imglist flex-jc-between pd">
                    <img :src="fileimg1.content" alt="">
                    <img :src="fileimg2.content" alt="">
                </div>
                <div class="imglist flex-jc-between pd">
                    <img :src="fileimg3.content" alt="">
                    <img :src="fileimg4?fileimg4.content:''" alt="">
                </div>
                <div class="flex-jc-between pd"><span class="fc-grey">托管费率</span><span>30%</span></div>
                <div class="pd">审核结果将在48小时内通知您</div>
                <div class="pd flex-align-items ">
                    <van-checkbox checked-color="#2DBBF1" v-model="isconsent"></van-checkbox>
                    <div class="pdl10">我已阅读并同意<router-link to="/zagreement/deposit" class="fc-blue">《托管合约》</router-link></div>
                </div>
            </div>

            <div class="btn text-c" @click="submit">确认提交</div>
        </div>
    </div>
</template>

<script>
import { Toast } from "vant";
export default {
    beforeRouteEnter(to, from, next) {
        let gohostingSession = JSON.parse(window.sessionStorage.getItem("gohostingSession"));
        if(gohostingSession.isfirst){
            gohostingSession.isfirst = false
            window.sessionStorage.setItem("gohostingSession", JSON.stringify(gohostingSession));
        }else
        if(from.meta.title === '协议'||from.meta.title === '配件确认') {
            to.meta.isBack = true;
        }
        next();
    },
    data(){
        return{
            fileimg1:null,
            fileimg2:null,
            fileimg3:null,
            fileimg4:null,
            isconsent: true,
            showmodel: false,
            gohostingSession: {}
        }
    },
    created(){
        this.isFirstEnter = true;
    },
    methods:{
        onRead1(file) {
            console.log(file)
            if(Array.isArray(file)){
                Toast('只能单选') 
                return
            }
            this.fileimg1 = file
        },
        onRead2(file) {
            console.log(file)
            if(Array.isArray(file)){
                Toast('只能单选') 
                return
            }
            this.fileimg2 = file
        },
        onRead3(file) {
            console.log(file)
            if(Array.isArray(file)){
                Toast('只能单选') 
                return
            }
            this.fileimg3 = file
        },
        onRead4(file) {
            console.log(file)
            if(Array.isArray(file)){
                Toast('只能单选') 
                return
            }
            this.fileimg4 = file
        },

        onshowmodel(){
            if(!this.fileimg1||!this.fileimg2||!this.fileimg3){
                Toast("请上传产品相关照片");
                return;
            }
            
            let gohostingSession = JSON.parse(window.sessionStorage.getItem("gohostingSession"));
            console.log(gohostingSession,'gohostingSession') 

            this.gohostingSession = gohostingSession
            this.showmodel = true
        },

        submit(){
            if (!window.localStorage.getItem("userinfo")) {
                this.$router.replace({ path: "/login" });
                return
            }
            if(this.isconsent){
                let { 
                    typetext, //品类
                    brandtext, //品牌
                    modeltext, //型号
                    colortext, //颜色

                    datetext ,//购买时间
                    colourtext,//外观成色
                    colourdes,//外观成色描述
                    statetext,//功能状况
                    priceval ,//购买价格
                    causetext, //不正常（说明原因）
                    fittingstring, //配件

                    serialnumval, //序列号
                    telval //联系方式
                 } = this.gohostingSession

                let config = {
                    headers:{'Content-Type':'multipart/form-data'}
                }
                Toast.loading({ mask: true,message: '加载中...',duration:0})
                
                let formData = new FormData()
                formData.append('users_id',JSON.parse(window.localStorage.getItem("userinfo")).users_id)
                formData.append('cate',typetext.cate_name)  //品类
                formData.append('brand',brandtext.brand_name)  //品牌
                formData.append('model',modeltext.model_name)  //型号
                formData.append('standards',colortext)  //规格
                formData.append('num',1)  //数量
                formData.append('buy_time',`${datetext[0]}-${datetext[1]}-${datetext[2]}`)  //购买时间
                formData.append('exterior',colourtext)  //外观成色
                formData.append('exterior_describe',colourdes)  //外观描述
                formData.append('functional_status',statetext)  //功能状况
                formData.append('functional_reason',causetext)  //不正常（说明原因）
                formData.append('parts_list',fittingstring)  //拥有配件列表
                formData.append('parts_picture',this.fileimg1.file,this.fileimg1.file.name)  //产品配件的全家福
                formData.append('model_picture',this.fileimg2.file,this.fileimg2.file.name)  //看清型号的全家福 
                formData.append('phone_picture',this.fileimg3.file,this.fileimg3.file.name)  //产品照片
                formData.append('damage_picture',this.fileimg4?this.fileimg4.file:'')  //产品损坏处照片
                formData.append('serial_number',serialnumval)  //产品序列号
                formData.append('contact_way',telval)  //联系方式
                formData.append('rate','30')  //费率 不要%号
                
                this.axios.post(this.API + "api/Trusteeship/saveTrust",formData,config)
                .then(res => {
                    console.log(res.data, "res")
                    let resdata = res.data
                    if (resdata.code == 200) {
                        Toast.clear()
                        this.$router.replace({ path: '/gsuccessful' })
                    } else {
                        Toast.clear()
                        Toast(resdata.message||'操作失败')
                    }
                })
                .catch(error => {
                    Toast.clear()
                    Toast('网络出错')
                });
            }else{
                Toast("您还未同意合约");
            }
            
        }
    },
    activated() {
        if(!this.$route.meta.isBack || this.isFirstEnter){
            this.fileimg1 = null,
            this.fileimg2 = null,
            this.fileimg3 = null,
            this.fileimg4 = null,
            this.isconsent =  true,
            this.showmodel =  false,
            this.gohostingSession =  {}
        }
        this.$route.meta.isBack=false
        this.isFirstEnter=false;
    },
}
</script>

<style scoped>
.fsz12{
    font-size: 12px;
}
.pdl10{
    padding-left: 10px
}
.pd{
    padding: 10px;
}
.pdb{
    padding-bottom: 10px
}
.btn {
  height: 42px;
  line-height: 42px;
  border-radius: 20px;
  color: #fff;
  background-image: linear-gradient(90deg, #2dbbf1 0%, #4ea9f9 100%);
}
.uploadimg{
    width: 140px;
    height: 100px;
    border-radius: 8px;
    border-bottom: 4px solid #4ea9f9;
    box-shadow: 0px 0px 2px 0px #4ea9f9;
}
.uploadimg img {
    /* width: 43px;
    height: 34px; */
    width: 120px;
    height: 80px;
}
.uploadimg .sampletext {
    position: absolute;
    bottom: 0;
    right: 0;
}
.fileimg img {
    width: 140px;
    height: 100px;
}
.btext{
    font-size: 11px;
    padding: 10px 0;
}
.box{
    padding: 0 15px;
}

.model {
    width: 100%;
    min-height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 6;
    padding: 10px;
    box-sizing: border-box;
}
.model .main {
    border-radius: 5px;
    margin-bottom: 20px;
}
.main .closeimg {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 7;
}
.main > div {
    box-sizing: border-box;
}
.main .imglist > img {
    width: 130px;
    height: 100px;
    border-radius: 5px;
}
.fittings{
    padding-left: 10px;
    display: flex;
    justify-content: flex-end;
}
</style>
