<template>
    <div>
        <div class="box">
            <div class="flex-jc-center position">
                <div class="banner bgc">
                <van-swipe :autoplay="3000">
                    <van-swipe-item v-for="(item, index) in images" :key="index">
                    <div class="img_box">
                        <img :src="item">
                    </div>
                    </van-swipe-item>
                </van-swipe>
                </div>
            </div>

            <div class="title">{{detail.model}}</div>
            <div class="detail">
                <div class="hang">
                <span>品类：</span>
                <span>{{detail.cate}}</span>
                </div>
                <div class="hang">
                <span>品牌：</span>
                <span>{{detail.brand}}</span>
                </div>
                <div class="hang">
                <span>序列号：</span>
                <span>{{detail.serial_number}}</span>
                </div>
                <div class="hang">
                <span>颜色：</span>
                <span>{{detail.standards}}</span>
                </div>
                <div class="hang">
                <span>成色：</span>
                <span>{{detail.exterior}}</span>
                </div>
                <div class="hang">
                <span>功能：</span>
                <span>{{detail.functional_status}}</span>
                </div>
                <div class="hang">
                <span>配件：</span>
                <span>{{detail.parts_list==''?'无':detail.parts_list}}</span>
                </div>
            </div>
        </div>

        <div class="pd-lr-15">
            <div class="mar-b-10">快递：顺丰</div>
            <div>运单号：{{detail.express_no==''?'无':detail.express_no}}</div>
        </div>

        <div class="pd-15 box" v-if="logistics.length==0">
            暂无物流信息
        </div>
        <div class="box express" v-else>
            <div class="item flex-align-items" v-for="(item,index) in logistics" :key="index">
                <span>{{item.AcceptTime}}</span>
                <span class="flex-1">{{item.AcceptStation}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { Toast } from "vant";
export default {
    data(){
        return {
            images: [],
            detail:'',
            logistics: []
        }
    },
    mounted(){
        this.getdetail()
    },
    methods:{
        getdetail(){
            Toast.loading({ mask: true, message: "加载中..." });
            let postData = this.$qs.stringify({
                // users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
                trust_id: this.$route.params.id
            });
            this.axios.post(this.API + "api/Trusteeship/trustDetails", postData)
            .then(res => {
                console.log(res.data, "detail");
                let resdata = res.data;
                if (resdata.code == 200) {
                    Toast.clear();
                    this.detail = resdata.data
                    this.images= [resdata.data.phone_picture]
                    if(resdata.data.express_no!=''){
                        this.queryLogistics()
                    }  
                } else {
                    Toast.clear();
                    Toast(resdata.message);
                }
            })
            .catch(error => {
                Toast.clear();
                Toast('网络出错')
            });
        },

        queryLogistics(){
            Toast.loading({ mask: true, message: "加载中..." });
            let postData = this.$qs.stringify({
                express_number: this.detail.express_number,
                express_no:this.detail.express_no
            });
            this.axios.post(this.API + "api/Trusteeship/queryTrustLogistics", postData)
            .then(res => {
                console.log(res.data, "queryLogistics");
                let resdata = res.data;
                if (resdata.code == 200) {
                    Toast.clear();
                    this.logistics = resdata.data.Traces
                } else {
                    Toast.clear();
                    Toast(resdata.message);
                }
            })
            .catch(error => {
                Toast.clear();
                Toast('网络出错')
            });
        }
    }
}
</script>

<style scoped>
.box {
  margin: 15px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 18px 0px rgba(188, 188, 188, 0.32);
  overflow: hidden;
}

.banner {
  width: 290px;
  height: 230px;
}
.img_box {
  width: 290px;
  height: 230px;
}
.img_box img {
  width: 100%;
  height: 100%;
}
.title {
  margin: 10px;
  font-size: 16px;
}
.detail {
  padding: 10px;
  color: #383838;
}
.hang {
  line-height: 30px;
}

.express .item {
    padding: 10px;
}
.express .item > span:nth-of-type(1){
    width: 60px;
    font-size: 12px;
    word-wrap:break-word;
}
</style>
