<template>
    <div>
        <div id="nav" >
            <van-tabs v-model="active">
                <van-tab title="有硬件"></van-tab>
                <van-tab title="无硬件"></van-tab>
            </van-tabs>
        </div>

        <div v-show="active==0">

            <div class="flex-jc-between flex-align-items bgc pd-15" @click="showtype=true">
                <div class="flex-1">
                    <!-- <div class="mar-b-10 fc-grey">品类</div> -->
                    <div class="fc-grey" v-if="typetext==''">请选择托管品类</div>
                    <div v-else>{{typetext.cate_name}}</div>
                </div>
                <van-icon name="arrow" />
            </div>
            <div class="flex-jc-between flex-align-items bgc pd-15" @click="onshowbrand">
                <div class="flex-1">
                    <!-- <div class="mar-b-10 fc-grey">品牌</div> -->
                    <div class="fc-grey" v-if="brandtext==''">请选择品牌</div>
                    <div v-else>{{brandtext.brand_name}}</div>
                </div>
                <van-icon name="arrow" />
            </div>
            <div class="flex-jc-between flex-align-items bgc pd-15"  @click="onshowmodel">
                <div class="flex-1">
                    <!-- <div class="mar-b-10 fc-grey">型号</div> -->
                    <div class="fc-grey" v-if="modeltext==''">请选择型号</div>
                    <div v-else>{{modeltext.model_name}}</div>
                </div>
                <van-icon name="arrow" />
            </div>
            <div class="flex-jc-between flex-align-items bgc pd-15" @click="shownomodel=true">
                <div class="flex-1">
                    <div class="fc-grey">如清单列表没有您的设备，请手动输入</div>
                </div>
                <van-icon name="arrow" />
            </div>
            <div class="flex-jc-between flex-align-items bgc pd-15" >
                <div class="flex-1">
                    <!-- <div class="mar-b-10 fc-grey">颜色</div> -->
                    <input style="width:100%" type="text" placeholder="请输入颜色，例:黑色" v-model.trim="colortext">
                </div>
            </div>
            <div class="flex-jc-between flex-align-items bgc pd-15 mar-b-10" >
                <div class="flex-1 fc-grey">
                    <!-- <div class="mar-b-10 fc-grey">数量</div>
                    <div class="fc-grey">1</div> -->
                    <span>数量</span><span class="pdl">1</span>
                </div>
            </div>

            <div class="pd-15">
                <div class="btn text-c" @click="next">下一步</div>
            </div>

            <van-popup v-model="showtype" position="bottom" :close-on-click-overlay="false">
                <van-picker :columns="typearr" show-toolbar @cancel="showtype = false" @confirm="onConfirmType" value-key='cate_name'/>
            </van-popup>
            <van-popup v-model="showbrand" position="bottom" :close-on-click-overlay="false">
                <van-picker :columns="brandarr" show-toolbar @cancel="showbrand = false" @confirm="onConfirmBrand" value-key='brand_name'/>
            </van-popup>
            <van-popup v-model="showmodel" position="bottom" :close-on-click-overlay="false">
                <van-picker :columns="modelarr" show-toolbar @cancel="showmodel = false" @confirm="onConfirmModel" value-key='model_name'/>
            </van-popup>
        </div>

        <div v-show="active==1">
            <div class="flex-jc-between flex-align-items bgc pd-15" @click="showtype1=true">
                <div class="flex-1">
                    <!-- <div class="mar-b-10 fc-grey">品类</div> -->
                    <div class="fc-grey" v-if="typetext1==''">请选择托管品类</div>
                    <div v-else>{{typetext1.cate_name}}</div>
                </div>
                <van-icon name="arrow" />
            </div>
            <div class="flex-jc-between flex-align-items bgc pd-15" >
                <div class="flex-1">
                    <!-- <div class="mar-b-10 fc-grey">托管设备金额</div> -->
                    <input style="width:100%" type="text" placeholder="请输入托管金额" v-model.trim="figureval">
                </div>
            </div>
            <div class="flex-jc-between flex-align-items bgc pd-15" @click="showequipment=true">
                <div class="flex-1">
                    <!-- <div class="mar-b-10 fc-grey">设备类型</div> -->
                    <div class="fc-grey" v-if="equipmenttext==''">请选择设备类型</div>
                    <div v-else>{{equipmenttext}}</div>
                </div>
                <van-icon name="arrow"/>
            </div>
            <div class="flex-jc-between flex-align-items bgc pd-15" @click="showpay=true">
                <div class="flex-1">
                    <!-- <div class="mar-b-10 fc-grey">支付方式</div> -->
                    <div class="fc-grey" v-if="paytext==''">请选择支付方式</div>
                    <div v-else>{{paytext}}</div>
                </div>
                <van-icon name="arrow"/>
            </div>

            <div class="pd-15">
                <div class="btn text-c" @click="nosubmit">提交</div>
            </div>

            <div class="describe bgc fsz-12">
                <div class="fc-grey">为了用户能达到更高的回报率，我们提供渠道底价销售的政策；</div> 
                <div class="fc-grey">支持信用卡、花呗、消费分期等支付方式，没钱照样可以享受托管收益。</div> 
            </div>
            
            <div class="box bgc" v-if="hosts.length!=0">
                <div class="mar-b-10">热租型号</div>
                <div class="list">
                    <div class="goods" v-for="(item,index) in hosts" :key="index">
                        <div style="font-size: 0;"><img :src="item.img" alt=""></div>
                        <div class="main">
                            <div>{{item.name}}</div>
                            <div class="fc-grey fsz12">{{item.content}}</div>
                        </div>
                    </div>
                </div>
            </div>

            <van-popup v-model="showtype1" position="bottom" :close-on-click-overlay="false">
                <van-picker :columns="typearr1" show-toolbar @cancel="showtype1 = false" @confirm="onConfirmType1" value-key='cate_name'/>
            </van-popup>
            <van-popup v-model="showequipment" position="bottom" :close-on-click-overlay="false">
                <van-picker
                    :columns="equipmentarr"
                    show-toolbar
                    @cancel="showequipment = false"
                    @confirm="onConfirmequipment"
                />
            </van-popup>
            <van-popup v-model="showpay" position="bottom" :close-on-click-overlay="false">
                <van-picker
                    :columns="payarr"
                    show-toolbar
                    @cancel="showpay = false"
                    @confirm="onConfirmpay"
                />
            </van-popup>
        </div>

        <van-popup v-model="shownomodel" :close-on-click-overlay="false">
            <div class="nomain bgc position">
                <div class="closeimg" ><van-icon name="close" @click="shownomodel=false"/></div>
                
                <div class="flex-jc-between flex-align-items bgc pd-15" >
                    <div class="flex-1">
                        <!-- <div class="mar-b-10 fc-grey">品类</div> -->
                        <input style="width:100%" type="text" placeholder="请输入托管品类" v-model.trim="notypetext">
                    </div>
                </div>
                <div class="flex-jc-between flex-align-items bgc pd-15" >
                    <div class="flex-1">
                        <!-- <div class="mar-b-10 fc-grey">品牌</div> -->
                        <input style="width:100%" type="text" placeholder="请输入品牌" v-model.trim="nobrandtext">
                    </div>
                </div>
                <div class="flex-jc-between flex-align-items bgc pd-15" >
                    <div class="flex-1">
                        <!-- <div class="mar-b-10 fc-grey">型号</div> -->
                        <input style="width:100%" type="text" placeholder="请输入型号"  v-model.trim="nomodeltext">
                    </div>
                </div>
                <div class="flex-jc-between flex-align-items bgc pd-15" >
                    <div class="flex-1">
                        <!-- <div class="mar-b-10 fc-grey">颜色</div> -->
                        <input style="width:100%" type="text" placeholder="请输入颜色，例:黑色" v-model.trim="colortext">
                    </div>
                </div>

                <div class="pd-15">
                    <div class="btn text-c" @click="notnext">下一步</div>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { Toast,Dialog } from "vant";
export default {
    data(){
        return{
            active:0,
            //品类
            showtype: false,
            typetext: '',
            typearr: [],
            //品类1
            showtype1: false,
            typetext1: '',
            typearr1: [],
            //品牌
            showbrand: false,
            brandtext: '',
            brandarr: [],
            //型号
            showmodel: false,
            modeltext: '',
            modelarr: [],
            //颜色
            colortext: '',
            gohostingSession: '',
            shownomodel: false,

            notypetext:'',
            nobrandtext:'',
            nomodeltext:'',

            figureval:'',
            showequipment:false,
            equipmenttext:'',
            equipmentarr:['全新品','二手品'],
            showpay:false,
            paytext:'',
            payarr:['微信','支付宝','余额'],

            hosts:[]
        }
    },
    watch:{
        active(val){
            if(val==1){
                this.host()
            }
        }
    },
    created(){
        let gohostingSession = JSON.parse(window.sessionStorage.getItem("gohostingSession"));
        if(gohostingSession){
            if(gohostingSession.notequipment){
                this.notypetext = gohostingSession.typetext.cate_name
                this.nobrandtext = gohostingSession.brandtext.brand_name
                this.nomodeltext = gohostingSession.modeltext.model_name
            }else{
                this.typetext = gohostingSession.typetext
                this.brandtext = gohostingSession.brandtext
                this.modeltext = gohostingSession.modeltext
            }
            this.colortext = gohostingSession.colortext
            this.shownomodel = gohostingSession.notequipment
            this.gohostingSession = gohostingSession
        }

        this.gettype()
    },
    mounted(){
        if(this.brandtext!=''){
            this.getbrand()
        }
        if(this.modeltext!=''){
            this.getmodel()
        }
    },
    methods:{
        host(){
            Toast.loading({ mask: true, message: "加载中..." });
            this.axios.post(this.API + "api/Trusteeship/queryRecommendProducts")
            .then(res => {
                console.log(res.data, "host")
                let resdata = res.data
                if (resdata.code == 200) {
                    Toast.clear();
                    this.hosts = resdata.data
                } else {
                    Toast.clear();
                    Toast(resdata.message)
                }
            })
        },
        onshowbrand(){
            if(this.typetext==''){
                Toast('请先选择品类')
                return
            }
            this.showbrand = true
        },
        onshowmodel(){
            if(this.typetext==''){
                Toast('请先选择品类')
                return
            }
            if(this.brandtext==''){
                Toast('请先选择品牌')
                return
            }
            this.showmodel = true
        },

        onConfirmType(value, index){
            this.typetext = value
            this.showtype = false
            this.getbrand()
            this.brandtext = ''
        },
        onConfirmType1(value, index){
            this.typetext1 = value
            this.showtype1 = false
        },
        onConfirmBrand(value, index){
            this.brandtext = value
            this.showbrand = false
            this.getmodel()
            this.modeltext = ''
        },
        onConfirmModel(value, index){
            this.modeltext = value
            this.showmodel = false
        },

        onConfirmequipment(value, index) {
            this.equipmenttext = value;
            this.showequipment = false;
        },
        onConfirmpay(value, index) {
            this.paytext = value;
            this.showpay = false;
        },

        gettype(){
            Toast.loading({ mask: true, message: "加载中..." });
            this.axios.post(this.API + "api/Trusteeship/queryCate")
            .then(res => {
                console.log(res.data, "gettype")
                let resdata = res.data
                if (resdata.code == 200) {
                    Toast.clear();
                    this.typearr = resdata.data
                    this.typearr1 = resdata.data
                } else {
                    Toast.clear();
                    Toast(resdata.message)
                }
            })
        },
        getbrand(){
            Toast.loading({ mask: true, message: "加载中..." });
            let postData = this.$qs.stringify({
                cate_id: this.typetext.cate_id
            });
            this.axios.post(this.API + "api/Trusteeship/queryBrand",postData)
            .then(res => {
                console.log(res.data, "getbrand")
                let resdata = res.data 
                if (resdata.code == 200) {
                    Toast.clear();
                    this.brandarr = resdata.data
                } else {
                    Toast.clear();
                    Toast(resdata.message)
                }
            })
        },
        getmodel(){
            Toast.loading({ mask: true, message: "加载中..." });
            let postData = this.$qs.stringify({
                cate_id: this.typetext.cate_id,
                brand_id: this.brandtext.brand_id,
            });
            this.axios.post(this.API + "api/Trusteeship/queryModel",postData)
            .then(res => {
                console.log(res.data, "getmodel")
                let resdata = res.data 
                if (resdata.code == 200) {
                    Toast.clear();
                    this.modelarr = resdata.data
                } else {
                    Toast.clear();
                    Toast(resdata.message)
                }
            })
        },

        next(){
            if(this.typetext==''){
                Toast("请选择品类");
                return
            }
            if(this.brandtext==''){
                Toast("请选择品牌");
                return
            }
            if(this.modeltext==''){
                Toast("请选择型号");
                return
            }
            if(this.colortext==''){
                Toast("请输入颜色");
                return
            }

            let gohostingSession = {
                isfirst:true, //是否首次进入
                notequipment: false, //是否有设备
                typetext: this.typetext,
                brandtext:this.brandtext,
                modeltext:this.modeltext,
                colortext:this.colortext,

                datetext: this.gohostingSession.datetext||'',
                colourtext:this.gohostingSession.colourtext||'',
                colourdes: this.gohostingSession.colourdes||'',
                statetext: this.gohostingSession.statetext||'',
                priceval: this.gohostingSession.priceval||'',
                causetext: this.gohostingSession.causetext||'',

                fittings: this.gohostingSession.fittings||[],

                fileimg1: this.gohostingSession.fileimg1||'',
                fileimg2: this.gohostingSession.fileimg2||'',
                fileimg3: this.gohostingSession.fileimg3||'',
                fileimg4: this.gohostingSession.fileimg4||'',
                serialnumval:this.gohostingSession.serialnumval||'',
                telval:this.gohostingSession.telval||'',
            }
            
            window.sessionStorage.setItem("gohostingSession", JSON.stringify(gohostingSession));
            this.$router.push({ path: '/steps2' })
        },
        //没设备
        notnext(){
            if(this.notypetext==''){
                Toast("请选择品类");
                return
            }
            if(this.nobrandtext==''){
                Toast("请选择品牌");
                return
            }
            if(this.nomodeltext==''){
                Toast("请选择型号");
                return
            }
            if(this.colortext==''){
                Toast("请输入颜色");
                return
            }

            let gohostingSession = {
                isfirst:true,
                notequipment: true, 
                typetext: {cate_name:this.notypetext},
                brandtext:{brand_name:this.nobrandtext},
                modeltext:{model_name:this.nomodeltext},
                colortext:this.colortext,

                datetext: this.gohostingSession.datetext||'',
                colourtext:this.gohostingSession.colourtext||'',
                colourdes: this.gohostingSession.colourdes||'',
                statetext: this.gohostingSession.statetext||'',
                priceval: this.gohostingSession.priceval||'',
                causetext: this.gohostingSession.causetext||'',

                fittings: this.gohostingSession.fittings||[],

                fileimg1: this.gohostingSession.fileimg1||'',
                fileimg2: this.gohostingSession.fileimg2||'',
                fileimg3: this.gohostingSession.fileimg3||'',
                fileimg4: this.gohostingSession.fileimg4||'',
                serialnumval:this.gohostingSession.serialnumval||'',
                telval:this.gohostingSession.telval||'',
            }

            window.sessionStorage.setItem("gohostingSession", JSON.stringify(gohostingSession));
            this.$router.push({ path: '/steps2' })
        },
        //无硬件
        nosubmit(){
            if(this.figureval==''){
                Toast("请输入托管金额");
                return
            }
            if(this.typetext1==''){
                Toast("请选择托管品类");
                return
            }
            if(this.equipmenttext==''){
                Toast("请选择设备类型");
                return
            }
            if(this.paytext==''){
                Toast("请选择支付方式");
                return
            }

            Toast.loading({ mask: true,message: '加载中...'})
            let postData = this.$qs.stringify({
                users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
                trust_price: this.figureval,
                cate: this.typetext1.cate_name,
                style: this.equipmenttext=='全新品'?0:this.equipmenttext=='二手品'?1:'',
                pay_way: this.paytext=='微信'?1:this.paytext=='支付宝'?2:this.paytext=='余额'?3:''
            });
            this.axios.post(this.API + "api/Trusteeship/saveNoHardware", postData)
            .then(res => {
                console.log(res.data, "nosubmit");
                let resdata = res.data;
                if (resdata.code == 200) {
                    Toast.clear()
                    Dialog.alert({
                        message: '操作成功'
                    }).then((e) => {
                        //
                    });
                } else {
                    Toast.clear()
                    Toast(resdata.message);
                }
            })
            .catch(error => {
                Toast.clear()
                Toast('网络出错')
            });
        }
    }
}
</script>

<style scoped>
#nav >>> .van-tabs__line {
  background-color: #fff;
  background-image: linear-gradient(90deg, #6c76ed 0%, #74d2ff 100%);
}
.fsz12 {
    font-size: 12px
}
.pdl{
    padding-left: 30px
}
.btn {
  height: 42px;
  line-height: 42px;
  border-radius: 20px;
  color: #fff;
  background-image: linear-gradient(90deg, #2dbbf1 0%, #4ea9f9 100%);
}

.describe{
    padding: 15px;
}

.box {
    padding: 0 15px 0px 15px;
}
.list > div:nth-of-type(odd){
    margin-right: 15px;
}

.goods{
    display: inline-block;
    box-shadow: 0px 1px 7px 1px #DAD7D7;
    box-sizing: border-box;
    margin-bottom: 15px;
}
.goods img {
    width: 135px;
    height: 135px;
}
.goods .main{
    padding: 10px;
    box-sizing: border-box;
}

.nomain {
    width: 280px;
}
.nomain .closeimg {
    position: absolute;
    right: 5px;
    top: 5px;
    z-index: 101;
}
</style>
