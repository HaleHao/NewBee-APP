<template>
  <div>
    <div class="pd-15 fc-grey text-c" v-if="list.length==0">快去添加订单吧~</div>

    <van-radio-group v-model="radio" @change="selectedProduct">
      <div v-for="(item,index) in list" :key="index" class="list_box" @click="radio=index">
        <van-swipe-cell :right-width="65" :on-close="onClose" >
          <div class="card bgc flex-align-items">
            <van-radio :name="index" checked-color="#2DBBF1"></van-radio>
            <img
              :src="item.gd_img[0]"
              alt
              class="bgc-grey goodsimg"
            >
            <div class="flex-1 right">
              <div class="mar-b-10">{{item.goods_name}}</div>
              <div class="fc-grey fsz12 mar-b-10">{{item.attr_names}}</div>
              <div class="flex-jc-between fsz12">
                <span class="fc-blue">￥{{item.hire_price.price}}/{{item.hire_price.unt}}</span>
              </div>
            </div>
          </div>
          <div slot="right" class="del bgc-red" @click="getdel(item.cart_id)">删除</div>
        </van-swipe-cell>
      </div>
    </van-radio-group>

    <div class="height"></div>
    <div class="bottom bgc flex-align-items border-t">
      <div class="flex-1 flex-jc-center">
          合计:￥{{sum}}
      </div>
      <div class="right flex-center" @click="gobuy">
        去结算
      </div>
    </div>
  </div>
</template>

<script>
import { accAdd } from "@/utils/util.js";
import { Dialog,Toast } from "vant";

export default {
  data() {
    return {
      list: [],
      sum: 0,
      radio: -1,
      delid:''
    };
  },
  beforeCreate(){
    if (!window.localStorage.getItem("userinfo")) {
      this.$router.replace({ path: "/login" });
    }
  },
  created(){
    this.getlist()
  },
  methods: {
    // 删除
    onClose(clickPosition, instance) {
      switch (clickPosition) {
        case "left":
        case "cell":
        case "outside":
          instance.close();
          break;
        case "right":
          Dialog.confirm({
            message: "确定删除吗？"
          }).then((e) => {
            if(e == 'confirm'){
              this.del()
            }
          });
          break;
      }
    },
    getdel(id){
      console.log(id)
      this.delid = id
    },
    del(){
      Toast.loading({ mask: true,message: '加载中...'})
      let postData = this.$qs.stringify({
            cart_id: this.delid,
        })
      this.axios.post(this.API + "api/Lease/cart_delete",postData)
      .then(res => {
        console.log(res.data, "del")
        let resdata = res.data
        if (resdata.code == 200) {
          Toast.clear()
          this.getlist()
        } else {
          Toast.clear()
          Toast(resdata.message||'操作失败')
        }
      });
    },

    selectedProduct(res) {
      console.log(res);
      this.sum = this.list[res].hire_price.price
    },

    getlist(){
      Toast.loading({ mask: true,message: '加载中...'})
      let postData = this.$qs.stringify({
            users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
        })
      this.axios.post(this.API + "api/Lease/cart_select",postData)
      .then(res => {
        console.log(res.data, "list")
        let resdata = res.data
        if (resdata.code == 200) {
          Toast.clear()
          this.list = resdata.data;
        } else {
          Toast.clear()
          Toast(resdata.message)
        }
      });
    },

    gobuy() {
        if(this.radio < 0 ){
            Toast('请先选择')
            return
        }

      window.sessionStorage.removeItem("buySession");
      this.$router.replace({
          path: '/buy',
          query: {
            cartid: this.list[this.radio].cart_id,
            id:this.list[this.radio].goods_id
          }
      })
    }
  }
};
</script>

<style scoped>
.list_box {
  margin: 10px 15px;
  overflow: hidden;
  border-radius: 5px;
}
.fsz12 {
  font-size: 12px;
}
.height {
  height: 50px;
}
.bottom {
  height: 50px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
.bottom .right {
  background-image: linear-gradient(90deg, #2dbbf1 0%, #4ea9f9 100%);
  width: 140px;
  color: #fff;
  height: 100%;
}

.card {
  padding: 10px;
}
.card .goodsimg {
  width: 86px;
  height: 86px;
  margin-right: 10px;
  margin-left: 10px;
}
.del {
  /* background-color: #d2d2d2; */
  color: #fff;
  width: 60px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
