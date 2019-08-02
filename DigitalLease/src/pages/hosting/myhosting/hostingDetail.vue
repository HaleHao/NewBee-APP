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

        <div class="pd-lr-15">出租记录</div>
        <div class="tab_box">
            <div class="fc-grey pd-15" v-if="earnings.length==0">暂无记录</div>
            <div class="flex-jc-between flex-align-items pd-15" v-for="(item,index) in earnings" :key="index">
            <div>
                <div>共计{{item.rent_time}}天</div>
                <div class="time">{{item.rent_start}}～{{item.tenancy_term}}</div>
            </div>
            <div>
                <div class="money text-c">+{{item.users_rental}}</div>
                <div class="fc-grey fsz12">租金{{item.rental}}</div>
            </div>
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
            active:0,
            earnings:[]
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
                    this.getEarnings()
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
        getEarnings(){
            Toast.loading({ mask: true, message: "加载中..." });
            let postData = this.$qs.stringify({
                host_number: this.detail.serial_number
            });
            // this.axios.post(this.API + "api/Trusteeship/queryEarnings", postData)
            this.axios.post(this.API + "api/Trusteeship/rentalRecord", postData)
            .then(res => {
                console.log(res.data, "earnings");
                let resdata = res.data;
                if (resdata.code == 200) {
                    Toast.clear();
                    this.earnings = resdata.data
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
    }
}
</script>

<style scoped>
.fsz12{
    font-size:12px
}
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

.tab_box {
  margin: 15px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 18px 0px rgba(188, 188, 188, 0.32);
  border-radius: 10px;
}
.jia {
  color: #4ea9f9;
}
.money {
  color: #4ea9f9;
  font-size: 16px;
}
.fc_money {
  color: #4ea9f9;
  font-size: 50px;
}
.time {
  color: #aeaeae;
  font-size: 12px;
}
</style>
