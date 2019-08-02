<template>
  <div>
    <div class="flex-jc-between flex-align-items bgc pd-15" @click="showdate=true">
      <div class="flex-1">
        <!-- <div class="mar-b-10 fc-grey">购买时间</div> -->
        <div class="fc-grey" v-if="datetext==''">请选择购买时间</div>
        <div v-else>{{`${datetext[0]}-${datetext[1]}-${datetext[2]}`}}</div>
      </div>
      <van-icon name="arrow"/>
    </div>
    <div class="bgc pd-15">
      <!-- <div class="mar-b-10 fc-grey">购买价格</div> -->
      <input style="width:100%" type="number" placeholder="请输入购买价格" v-model.trim.number="priceval">
    </div>
    <div class="flex-jc-between flex-align-items bgc pd-15" @click="showcolour=true">
      <div class="flex-1">
        <!-- <div class="mar-b-10 fc-grey">外观成色</div> -->
        <div class="fc-grey" v-if="colourtext==''">请选择外观成色</div>
        <div v-else>{{colourtext}}</div>
      </div>
      <van-icon name="arrow"/>
    </div>
    <van-field
      v-model.trim="colourdes"
      type="textarea"
      placeholder="请输入外观成色描述"
      autosize
      :border="false"
    />
    <div class="flex-jc-between flex-align-items bgc pd-15" @click="showstate=true">
      <div class="flex-1">
        <!-- <div class="mar-b-10 fc-grey">功能状况</div> -->
        <div class="fc-grey" v-if="statetext==''">请选择功能状况</div>
        <div v-else>{{statetext}}</div>
      </div>
      <van-icon name="arrow"/>
    </div>
    <div class="bgc pd-15" v-show="statetext=='不正常（说明原因）'">
      <input style="width:100%" type="text" placeholder="请输入说明原因" v-model.trim="causetext">
    </div>
    <div class="bgc pd-15">
        <!-- <div class="mar-b-10 fc-grey">序列号</div> -->
        <input style="width:100%" type="text" placeholder="请填写产品序列号" v-model.trim="serialnumval">
    </div>
    <div class="bgc pd-15">
        <!-- <div class="mar-b-10 fc-grey">联系方式</div> -->
        <input style="width:100%" type="number" placeholder="请填写联系方式" v-model.trim="telval">
    </div>

    <div class="pd-15">
      <div class="btn text-c" @click="next">下一步</div>
    </div>

    <van-popup v-model="showdate" position="bottom" :close-on-click-overlay="false">
      <van-datetime-picker
        v-model="dateval"
        type="date"
        :min-date="startDate"
        :max-date="endDate"
        @cancel="showdate = false"
        @confirm="onConfirmDate"
      />
    </van-popup>
    <van-popup v-model="showcolour" position="bottom" :close-on-click-overlay="false">
      <van-picker
        :columns="colourarr"
        show-toolbar
        @cancel="showcolour = false"
        @confirm="onConfirmColour"
      />
    </van-popup>
    <van-popup v-model="showstate" position="bottom" :close-on-click-overlay="false">
      <van-picker
        :columns="statearr"
        show-toolbar
        @cancel="showstate = false"
        @confirm="onConfirmState"
      />
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      //购买时间
      dateval: new Date(),
      datetext: "",
      showdate: false,
      startDate: new Date("1899/01/01 00:00"),
      endDate: new Date(),
      //外观成色
      showcolour: false,
      colourtext: "",
      colourarr: ["全新", "95新","9成新","85新","8成新","7成新"], //全新、95新、9成新、85新、8成新、7成新
      colourdes: "",
      //功能状况
      showstate: false,
      statetext: "",
      statearr: ["正常", "不正常（说明原因）"],
      //不正常（说明原因
      causetext:'',

      priceval: "",
      serialnumval:'',
      telval:''
    };
  },
  created() {
    let gohostingSession = JSON.parse(
      window.sessionStorage.getItem("gohostingSession")
    );
    if (gohostingSession) {
      this.datetext = gohostingSession.datetext;
      this.colourtext = gohostingSession.colourtext;
      this.colourdes = gohostingSession.colourdes;
      this.statetext = gohostingSession.statetext;
      this.priceval = gohostingSession.priceval;
      this.causetext = gohostingSession.causetext;
      this.serialnumval = gohostingSession.serialnumval;
      this.telval = gohostingSession.telval;
    }
  },
  mounted () {
    this.telval = JSON.parse(window.localStorage.getItem("userinfo")).users_phone||''
  },
  methods: {
    onConfirmDate(val) {
      console.log(val.getFullYear(), val.getMonth() + 1, val.getDate());
      this.dateval = val;
      this.datetext = [val.getFullYear(), val.getMonth() + 1, val.getDate()];
      this.showdate = false;
    },
    onConfirmColour(value, index) {
      this.colourtext = value;
      this.showcolour = false;
    },
    onConfirmState(value, index) {
      this.statetext = value;
      this.showstate = false;
    },

    next() {
      if(this.datetext == ""){
        Toast("请选择购买时间");
        return;
      }
      if(this.priceval == ""){
        Toast("请输入购买价格");
        return;
      }
      if(this.colourtext == ""){
        Toast("请选择外观成色");
        return;
      }
      if(this.colourdes == ""){
        Toast("请输入外观成色描述");
        return;
      }
      if(this.statetext == ""){
        Toast("请选择功能状况");
        return;
      }
      if(this.causetext == ""&&this.statetext == "不正常（说明原因）"){
        Toast("请输入说明原因");
        return;
      }
      if(this.serialnumval == ""){
          Toast("请填写产品序列号");
          return;
      }
      if(this.telval == ""){
          Toast("请填写联系方式");
          return;
      }
      if (!(/^1\d{10}$/.test(this.telval))) {
          Toast("手机号格式不正确");
          return;
      }

      let gohostingSession = JSON.parse(
        window.sessionStorage.getItem("gohostingSession")
      );
      gohostingSession.datetext = this.datetext;
      gohostingSession.colourtext = this.colourtext;
      gohostingSession.colourdes = this.colourdes;
      gohostingSession.statetext = this.statetext;
      gohostingSession.priceval = this.priceval;
      gohostingSession.causetext = this.causetext;
      gohostingSession.serialnumval = this.serialnumval;
      gohostingSession.telval = this.telval;
      window.sessionStorage.setItem(
        "gohostingSession",
        JSON.stringify(gohostingSession)
      );

      this.$router.push({ path: "/fittingsConfirm" });
    }
  }
};
</script>

<style scoped>
.btn {
  height: 42px;
  line-height: 42px;
  border-radius: 20px;
  color: #fff;
  background-image: linear-gradient(90deg, #2dbbf1 0%, #4ea9f9 100%);
}
</style>
