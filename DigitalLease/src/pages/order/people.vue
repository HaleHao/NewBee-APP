<template>
  <div>
    <div class="bgc pd-15">自取联系人</div>
    <div class="nav bgc">
      <div :class="{ 'fc-blue selected': selected==0 }" @click="selected=0">本人</div>
      <div :class="{ 'fc-blue selected': selected==1 }" @click="selected=1">朋友代取</div>
    </div>

    <div class="bgc" v-show="selected==0">
      <div class="border-b inputbox pd-15">
        <span>姓名</span>
        <input type="text" v-model.trim="nameval">
      </div>
      <div class="inputbox pd-15">
        <span>手机号码</span>
        <input type="number" v-model.trim="phoneval" maxlength="11" class="bgc">
      </div>
    </div>
    <div class="bgc" v-show="selected==1">
      <div class="border-b inputbox pd-15">
        <span>姓名</span>
        <input type="text" v-model.trim="nameval1">
      </div>
      <div class="inputbox pd-15">
        <span>手机号码</span>
        <input type="number" v-model.trim="phoneval1" maxlength="11">
      </div>
    </div>

    <div class="pd-t-100">
      <div class="btn text-c" @click="onbtn">确认</div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      selected: 0,
      nameval: "",
      phoneval: "",
      nameval1: "",
      phoneval1: ""
    };
  },
  created() {
    if (this.$route.params.type == "buy") {
        let buySession = JSON.parse(window.sessionStorage.getItem("buySession"));
        if (buySession) {
          if(buySession.getpeople.type){
            this.selected = buySession.getpeople.type||0
            if(buySession.getpeople.type==1){
              this.nameval = JSON.parse(
                window.localStorage.getItem("userinfo")
              ).users_name;
              this.phoneval = JSON.parse(window.localStorage.getItem("userinfo")).users_phone||''
            }
            if(buySession.getpeople.type == 0){
              this.nameval = buySession.getpeople.name||''
              this.phoneval = buySession.getpeople.phone||''
            }else{
              this.nameval1 = buySession.getpeople.name||''
              this.phoneval1 = buySession.getpeople.phone||''
            }
          }else{            
              this.nameval = JSON.parse(
                window.localStorage.getItem("userinfo")
              ).users_name;
              this.phoneval = JSON.parse(window.localStorage.getItem("userinfo")).users_phone||''
          }
        }
    }
    if (this.$route.params.type == "prebuy") {
        let prebuySession = JSON.parse(window.sessionStorage.getItem("prebuySession"));
        if (prebuySession) {
          if(prebuySession.getpeople.type){
            this.selected = prebuySession.getpeople.type||0
            if(prebuySession.getpeople.type==1){
              this.nameval = JSON.parse(
                window.localStorage.getItem("userinfo")
              ).users_name;
              this.phoneval = JSON.parse(window.localStorage.getItem("userinfo")).users_phone||''
            }
            if(prebuySession.getpeople.type == 0){
              this.nameval = prebuySession.getpeople.name||''
              this.phoneval = prebuySession.getpeople.phone||''
            }else{
              this.nameval1 = prebuySession.getpeople.name||''
              this.phoneval1 = prebuySession.getpeople.phone||''
            }
          }else{            
              this.nameval = JSON.parse(
                window.localStorage.getItem("userinfo")
              ).users_name;
              this.phoneval = JSON.parse(window.localStorage.getItem("userinfo")).users_phone||''
          }
        }
    }
    if (this.$route.params.type == "friendbuy") {
        let friendbuySession = JSON.parse(window.sessionStorage.getItem("friendbuySession"));
        if (friendbuySession) {
          if(friendbuySession.getpeople.type){
            this.selected = friendbuySession.getpeople.type||0
            if(friendbuySession.getpeople.type==1){
              this.nameval = JSON.parse(
                window.localStorage.getItem("userinfo")
              ).users_name;
              this.phoneval = JSON.parse(window.localStorage.getItem("userinfo")).users_phone||''
            }
            if(friendbuySession.getpeople.type == 0){
              this.nameval = friendbuySession.getpeople.name||''
              this.phoneval = friendbuySession.getpeople.phone||''
            }else{
              this.nameval1 = friendbuySession.getpeople.name||''
              this.phoneval1 = friendbuySession.getpeople.phone||''
            }
          }else{            
              this.nameval = JSON.parse(
                window.localStorage.getItem("userinfo")
              ).users_name;
              this.phoneval = JSON.parse(window.localStorage.getItem("userinfo")).users_phone||''
          }
        }
    }
    if (this.$route.params.type == "shopping") {
        let shoppingSession = JSON.parse(window.sessionStorage.getItem("shoppingSession"));
        if (shoppingSession) {
          if(shoppingSession.getpeople.type){
            this.selected = shoppingSession.getpeople.type||0
            if(shoppingSession.getpeople.type==1){
              this.nameval = JSON.parse(
                window.localStorage.getItem("userinfo")
              ).users_name;
              this.phoneval = JSON.parse(window.localStorage.getItem("userinfo")).users_phone||''
            }
            if(shoppingSession.getpeople.type == 0){
              this.nameval = shoppingSession.getpeople.name||''
              this.phoneval = shoppingSession.getpeople.phone||''
            }else{
              this.nameval1 = shoppingSession.getpeople.name||''
              this.phoneval1 = shoppingSession.getpeople.phone||''
            }
          }else{            
              this.nameval = JSON.parse(
                window.localStorage.getItem("userinfo")
              ).users_name;
              this.phoneval = JSON.parse(window.localStorage.getItem("userinfo")).users_phone||''
          }
        }
    }
      
  },
  methods: {
    onbtn() {
      let people = {};
      if (this.selected == 0) {
        if (this.nameval == "" || this.phoneval == "") {
          Toast("不能为空");
          return;
        }
        if(!(/^[\u4e00-\u9fa5]{2,4}$/.test(this.nameval))){ 
          Toast("请正确输入姓名");
          return;
        }
        if(!(/^1(3|4|5|7|8)\d{9}$/.test(this.phoneval))){ 
          Toast("手机号格式不正确");
          return;
        }

        let postData = this.$qs.stringify({
          users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
          users_name: this.nameval
        });
        this.axios.post(this.API + "api/Order/EditUserName", postData)
        .then(res => {
          console.log(res.data, "改名");
          let resdata = res.data;
          if (resdata.code == 200) {
              window.localStorage.setItem("userinfo", JSON.stringify(resdata.data));
          } else {
            // Toast(resdata.message);
          }
        });

        people.type = String(this.selected);
        people.name = this.nameval;
        people.phone = this.phoneval;
      } else {

        if (this.nameval1 == "" || this.phoneval1 == "") {
          Toast("不能为空");
          return;
        }
        if(!(/^[\u4e00-\u9fa5]{2,4}$/.test(this.nameval1))){ 
          Toast("请正确输入姓名");
          return;
        }
        if(!(/^1(3|4|5|7|8)\d{9}$/.test(this.phoneval1))){ 
          Toast("手机号格式不正确");
          return;
        }
        people.type = String(this.selected);
        people.name = this.nameval1;
        people.phone = this.phoneval1;
      }

      if (this.$route.params.type == "shopping") {
        let shoppingSession = JSON.parse(
          window.sessionStorage.getItem("shoppingSession")
        );
        shoppingSession.getpeople = people;
        window.sessionStorage.setItem(
          "shoppingSession",
          JSON.stringify(shoppingSession)
        );
      }
      if (this.$route.params.type == "buy") {
        let buySession = JSON.parse(
          window.sessionStorage.getItem("buySession")
        );
        buySession.getpeople = people;
        window.sessionStorage.setItem("buySession", JSON.stringify(buySession));
      }
      if (this.$route.params.type == "prebuy") {
        let prebuySession = JSON.parse(
          window.sessionStorage.getItem("prebuySession")
        );
        prebuySession.getpeople = people;
        window.sessionStorage.setItem(
          "prebuySession",
          JSON.stringify(prebuySession)
        );
      }
      if (this.$route.params.type == "friendbuy") {
        let friendbuySession = JSON.parse(
          window.sessionStorage.getItem("friendbuySession")
        );
        friendbuySession.getpeople = people;
        window.sessionStorage.setItem(
          "friendbuySession",
          JSON.stringify(friendbuySession)
        );
      }

      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.nav {
  padding: 15px;
}
.nav > div {
  width: 103px;
  height: 37px;
  line-height: 37px;
  display: inline-block;
  box-shadow: 0 1px 7px 1px #e8e9ea;
  margin-left: 10px;
  border-radius: 20px;
  text-align: center;
}
.nav .selected {
  box-shadow: 0 1px 7px 1px #def4fd;
}
.pd-t-100 {
  padding: 0 15px;
  padding-top: 100px;
}
.btn {
  height: 42px;
  line-height: 42px;
  border-radius: 20px;
  color: #fff;
  background-image: linear-gradient(90deg, #2dbbf1 0%, #4ea9f9 100%);
}

.inputbox > span {
  width: 60px;
  display: inline-block;
}
</style>
