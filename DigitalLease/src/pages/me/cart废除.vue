<template>
  <div>
    <van-checkbox-group v-model="result" @change="selectedProduct">
      <div v-for="(item,index) in list" :key="index" class="list_box">
        <van-swipe-cell :right-width="65" :on-close="onClose">
          <div class="card bgc flex-align-items" @click="toggle(index)">
            <van-checkbox :name="item.id" checked-color="#2DBBF1" ref="checkboxes"></van-checkbox>
            <img
              src="http://img0.imgtn.bdimg.com/it/u=2486649772,2680843008&fm=26&gp=0.jpg"
              alt
              class="bgc-grey goodsimg"
            >
            <div class="flex-1 right">
              <div class="mar-b-10">商品1</div>
              <div class="fc-grey fsz12 mar-b-10">黑色</div>
              <div class="flex-jc-between fsz12">
                <span class="fc-blue">￥{{item.price}}/日</span>
                <!-- <span class="fc-grey">x{{item.num}}</span> -->
              </div>
            </div>
          </div>
          <div slot="right" class="del">删除</div>
        </van-swipe-cell>
      </div>
    </van-checkbox-group>

    <div class="height"></div>
    <div class="bottom bgc flex-align-items border-t">
      <div class="flex-1 flex-jc-center" @click="onall">
        <van-checkbox checked-color="#2DBBF1" v-model="isall">合计：￥{{sum}}</van-checkbox>
      </div>
      <div class="right flex-center">
        去结算
        <span v-show="result.length!=0">({{result.length}})</span>
      </div>
    </div>
  </div>
</template>

<script>
import { accAdd, accMul } from "@/utils/util.js";
import { Dialog } from "vant";
export default {
  data() {
    return {
      list: [{ id: 1, price: 1 }, { id: 2, price: "3.03" }],
      result: [],
      isall: false,
      sum: 0,
    };
  },
  methods: {
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
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
          }).then(() => {
            instance.close();
          });
          break;
      }
    },
    //全选
    onall() {
      let list = this.list;

      if (this.isall) {
        let resarr = [];
        for (let v of list) {
          resarr.push(v.id);
        }
        this.result = resarr;
      } else {
        this.result = [];
      }
    },
    //多选
    selectedProduct(res) {
      console.log(res);
      let list = this.list;
      //判断全选状态
      if (res.length == list.length) {
        this.isall = true;
      } else {
        this.isall = false;
      }

      this.calcTotalPrice();
    },
    //计算
    calcTotalPrice() {
      let list = this.list;
      let result = this.result;
      let sum = 0;

      for (let v of list) {
        for (let v2 of result) {
          if (v.id == v2) {
            // let ps = accMul(v.price, v.num);
            sum = accAdd(v.price, sum);
          }
        }
      }
      this.sum = sum;
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
  background-color: #d2d2d2;
  color: #fff;
  width: 60px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
