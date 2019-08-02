<template>
    <div>
        <div class="box">
            <div class="title">{{detail.model}}</div>
            <div class="detail">
                <div class="hang">
                <span>品类：</span>
                <span>{{detail.cate}}</span>
                </div>
                <div class="hang">
                <span>托管设备金额：</span>
                <span>{{detail.total_price}}</span>
                </div>
                <div class="hang">
                <span>设备类型：</span>
                <span>{{detail.style}}</span>
                </div>
                <div class="hang">
                <span>总价：</span>
                <span>{{detail.trust_price}}</span>
                </div>
                <div class="hang" v-if="detail.host_number&&detail.host_number!=''">
                <span>序列号：</span>
                <span>{{detail.host_number}}</span>
                </div>
            </div>
        </div>
        
        <!-- 审核中 -->
        <div class="state text-c" v-if="detail.state=='未审核'">
          <div>您的物品正在审核中</div>
          <div>请耐心等候！</div>
        </div>
        <div class="state text-c" v-if="detail.state=='审批未通过'">
            <div>很抱歉！</div>
            <div>您的资料未通过审核</div>
            <div>原因：{{detail.reasons_refusal}}</div>
        </div>

        <div class="pd-lr-15" v-if="detail.state=='托管中'">出租记录</div>
        <div class="tab_box" v-if="detail.state=='托管中'">
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

        <!-- 托管成功弹窗 -->
        <van-popup v-model="showmodel" :close-on-click-overlay="false">
        <div class="text-c position mask_box">
            <div class="flex-jc-center">
            <img src="../../../assets/tg_success.png" class="tg_success">
            <span class="icon" @click="showmodel = false">
                <van-icon name="cross" color="#aeaeae" size="25px"/>
            </span>
            </div>

            <div class="gongxi">恭喜，审核成功！</div>
            <div class="gongxi">New bee将为您采购最高性价比的设备用于托管！</div>
            <!-- <div class="zhiyin">
            说明
            </div> -->
        </div>
        </van-popup>
    </div>
</template>

<script>
import { Toast } from "vant";
export default {
    data() {
        return {
            images: [],
            typenum: 0,
            detail:'',
            showmodel: false,
            active:0,
            earnings:[]
        };
    },
    mounted(){
        this.getdetail()
    },
    methods:{
        getdetail(){
            Toast.loading({ mask: true, message: "加载中..." });
            let postData = this.$qs.stringify({
                no_hardware_id: this.$route.params.id,
                host_number: this.$route.query.hostnumber
            });
            this.axios.post(this.API + "api/Trusteeship/noHardwareDetails", postData)
            .then(res => {
                console.log(res.data, "detail");
                let resdata = res.data;
                if (resdata.code == 200) {
                    Toast.clear();
                    this.detail = resdata.data

                    if(resdata.data.state=='审批通过'){
                      this.showmodel = true
                    }
                    if(resdata.data.state=='托管中'){
                      this.getEarnings()
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
        getEarnings(){
            Toast.loading({ mask: true, message: "加载中..." });
            let postData = this.$qs.stringify({
                host_number: this.detail.host_number
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
                    // Toast(resdata.message);
                }
            })
        },
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
.state {
  margin: 15px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 18px 0px rgba(188, 188, 188, 0.32);
  color: #4ea9f9;
  padding: 30px 0;
}

/* 托管成功弹窗样式 */
.mask_box {
  width: 240px;
  margin: 25px;
}
.gongxi {
  font-size: 15px;
  height: 25px;
  line-height: 25px;
}
.icon {
  position: absolute;
  top: -10px;
  right: -10px;
}
.tg_success {
  width: 80px;
  height: 85px;
  margin: 10px;
}
.zhiyin {
  color: #aeaeae;
  margin-top: 10px;
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
.fsz12{
    font-size:12px
}
</style>
