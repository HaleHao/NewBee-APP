<template>
  <div>
    <div id="nav">
      <van-tabs @click="ontab" v-model="ind">
        <van-tab :title="item" v-for="(item,index) in navtitle" :key="index">
          <div v-show="couponlist.length==0&&ind!=3" class="fc-grey text-c pd-15 fsz-12">没有更多了</div>
          <div v-show="getcouponlist.length==0&&ind==3" class="fc-grey text-c pd-15 fsz-12">没有更多了</div>

          <div
            class="coupon_box position"
            v-for="(item,i) in couponlist"
            :key="i"
            v-show="ind ==0||ind==1||ind==2"
          >
            <div>
              <img src="../../assets/1.png">
            </div>

            <div class="coupon_con flex-jc-around flex-align-items">
              <div>
                <span class="num">{{item.coupons_money|noZero}}</span>
                <span class="yuan">元</span>
              </div>
              <div v-if="item.activity_name==''">
                <div class="coupon_fl">{{item.coupon_name}}</div>
                <div class="limit">
                  <div>有效期至{{item.end_time}}</div>
                  <div>满{{item.coupons_condition}}可用</div>
                </div>
              </div>
              <div v-else>
                <div class="coupon_fl">{{item.coupon_name}}</div>
                <div class="limit">
                  <div>活动{{item.activity_name}}</div>
                  <div>有效期至{{item.end_time}}</div>
                  <div>满{{item.coupons_condition}}可用</div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="coupon_box position"
            v-for="(item,i) in getcouponlist"
            :key="i+1"
            v-show="ind ==3"
            @click="receive(item)"
          >
            <div>
              <img src="../../assets/1.png">
            </div>

            <div class="coupon_con flex-jc-around flex-align-items">
              <div>
                <span class="num">{{item.coupons_money|noZero}}</span>
                <span class="yuan">元</span>
              </div>
              <div v-if="item.is_activity==0">
                <div class="coupon_fl">{{item.coupon_name}}</div>
                <div class="limit">
                  <div>满{{item.coupons_condition}}可用</div>
                  <div>点击领取</div>
                </div>
              </div>
              <div v-if="item.is_activity==1">
                <div class="coupon_fl">{{item.coupon_name}}</div>
                <div class="limit">
                  <div>活动{{item.activity_name}}</div>
                  <div>满{{item.coupons_condition}}可用</div>
                  <div>有效期至{{item.end_activity}}</div>
                  <div>点击领取</div>
                </div>
              </div>
            </div>
          </div>

        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { Dialog,Toast } from "vant";
export default {
  data() {
    return {
      navtitle: ["未使用", "已使用", "已失效", "领取"],
      couponlist: [],
      getcouponlist:[],
      ind: 0,
    };
  },
  beforeCreate(){
    if (!window.localStorage.getItem("userinfo")) {
      this.$router.replace({ path: "/login" });
    }
  },
  mounted(){
    this.getdata()
  },
  methods: {
    ontab(index, title) {
      console.log(index, title);
      if(this.ind==3){
        this.getcoupon()
      }else{
        this.getdata()
      }
      
    },

    getdata(){
      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
        user_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
        state: this.ind+1
      });
      this.axios
        .post(this.API + "api/Lease/user_coupons", postData)
        .then(res => {
          console.log(res.data, "couponslist");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear()
            for(let v of resdata.data){
              v.end_time = v.end_time.split(" ")[0]
            }
            
            this.couponlist = resdata.data
          } else {
            Toast.clear();
            this.couponlist = []
            Toast(resdata.message);
          }
        });
    },
    getcoupon(){
      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
        users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
      });
      this.axios
        .post(this.API + "api/Lease/get_coupons", postData)
        .then(res => {
          console.log(res.data, "getcouponslist");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear()
            
            this.getcouponlist = resdata.data
          } else {
            Toast.clear();
            this.getcouponlist = []
            // Toast(resdata.message);
          }
        });
    },
    //领取
    receive(item){
      if(item.is_activity==0){
        Toast.loading({ mask: true, message: "加载中..." });
        let postData = this.$qs.stringify({
          user_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
          coupons_id: item.coupons_id,
          activity_id: 0
        });
        this.axios
          .post(this.API + "api/Lease/Receive_coupon", postData)
          .then(res => {
            console.log(res.data, "getcoupons");
            let resdata = res.data;
            if (resdata.code == 200) {
              Toast.clear()
              Toast('领取成功');
              this.getcoupon()
            } else {
              Toast.clear();
              Toast(resdata.message||'操作失败');
            }
          })
          .catch(error => {
              Toast('网络出错')
          });
      }else{
        Toast.loading({ mask: true, message: "加载中..." });
        let postData = this.$qs.stringify({
          user_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
          activity_id: item.activity_id,
          coupons_id:item.coupons_id
        });
        this.axios
          .post(this.API + "api/Lease/Receive_coupon", postData)
          .then(res => {
            console.log(res.data, "getcoupons");
            let resdata = res.data;
            if (resdata.code == 200) {
              Toast.clear()
              Toast('领取成功');
              this.getcoupon()
            } else {
              Toast.clear();
              Toast(resdata.message||'操作失败');
            }
          })
          .catch(error => {
              Toast('网络出错')
          });
      }
      
    },
  }
};
</script>

<style scoped>
#nav >>> .van-tabs__line {
  background-color: #fff;
  background-image: linear-gradient(90deg, #6c76ed 0%, #74d2ff 100%);
}
.coupon_con {
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%;
}

.num {
  font-size: 60px;
  font-weight: lighter;
  color: #4ea9f9;
}

.yuan {
  font-size: 20px;
  color: #4ea9f9;
}

.coupon_fl {
  font-size: 14px;
}
.limit {
  font-size: 10px;
  color: #aeaeae;
}

.get_coupon {
  width: 100%;
  height: 100%;
  margin-top: 100px;
}

</style>


