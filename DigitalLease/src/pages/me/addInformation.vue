<template>
  <div>
    <div class="add_address">
      <div class="add_addresscon bgc">
        <div class="me" style="margin-top: 15px;">
          <van-cell-group>
            <van-field v-model.trim="nameval" placeholder="姓名"/>
          </van-cell-group>

          <van-cell-group>
            <van-field v-model.trim="phoneval" placeholder="手机号"/>
          </van-cell-group>
          <van-cell
            :title="areaval==''?'请选择所在地区':areaval[0].name+areaval[1].name+areaval[2].name"
            is-link
            @click="showarea=true"
          />
          <van-cell-group>
            <van-field v-model.trim="detailval" placeholder="请输入详细地址"/>
          </van-cell-group>
          <div class="flexbox moren">
            <van-checkbox v-model="checked" checked-color="#4EA9F9"></van-checkbox>
            <span>设为默认地址</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-jc-center">
      <div class="btn text-c" @click="submit">保存</div>
    </div>

    <van-popup v-model="showarea" position="bottom" :close-on-click-overlay="false">
      <van-area :area-list="areaList" @cancel="showarea=false" @confirm="onconfirm"/>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
import area from "@/utils/area.js";
export default {
  data() {
    return {
      nameval: "",
      phoneval: "",
      detailval: "",
      checked: false,
      showarea: false,
      areaval: "",
      areaList: area
    };
  },
  created() {
    this.getdata();
  },
  methods: {
    onconfirm(val) {
      console.log(val);
      this.areaval = val;
      this.showarea = false;
    },
    getdata() {
      if (this.$route.params.id) {
        Toast.loading({ mask: true, message: "加载中..." });
        let postData = this.$qs.stringify({
          ads_id: this.$route.params.id
        });
        this.axios
          .post(this.API + "api/Lease/Ads_Details", postData)
          .then(res => {
            console.log(res.data, "add");
            let resdata = res.data;
            if (resdata.code == 200) {
              Toast.clear();
              this.nameval = resdata.data.ads_user;
              this.phoneval = resdata.data.ads_phone;
              this.detailval = resdata.data.ads_address;
              this.checked = resdata.data.ads_state == 2 ? true : false;
              this.areaval = [
                { name: resdata.data.ads_province },
                { name: resdata.data.ads_city },
                { name: resdata.data.ads_district }
              ];
            } else {
              Toast.clear();
              Toast(resdata.message);
            }
          });
      }
    },
    submit() {
      if (this.nameval == "" || this.phoneval == "" || this.detailval == "") {
        Toast("请先填写完整");
        return;
      }
      if (!(/^1\d{10}$/.test(this.phoneval))) {
        Toast("手机号格式不正确");
        return;
      }

      let postData = this.$qs.stringify({
        ads_id: this.$route.params.id || "",
        users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
        ads_user: this.nameval,
        ads_phone: this.phoneval,
        ads_state: this.checked ? "2" : "1",
        ads_province: this.areaval[0].name,
        ads_city: this.areaval[1].name,
        ads_district: this.areaval[2].name,
        ads_address: this.detailval
      });

      if (this.$route.params.id) {
        this.axios
          .post(this.API + "api/Lease/Ads_Update", postData)
          .then(res => {
            console.log(res.data, "editor");
            let resdata = res.data;
            if (resdata.code == 200) {
              Toast("修改成功");
              this.$router.go(-1);
            } else {
              Toast(resdata.message||'操作失败');
            }
          });
      } else {
        this.axios.post(this.API + "api/Lease/Add_ads", postData).then(res => {
          console.log(res.data, "add");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast("添加成功");
            this.$router.go(-1);
          } else {
            Toast(resdata.message||'操作失败');
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.add_address {
  width: 100%;
}
.add_addresscon {
  width: 300px;
  height: 100%;
  margin: 0 auto;
  border-radius: 5px;
}
.me {
  width: 270px;
  height: 100%;
  margin: 0 auto;
}

.moren {
  margin-left: 15px;
  height: 60px;
  line-height: 60px;
  color: #aeaeae;
}
.moren span {
  padding-left: 15px;
  font-size: 12px;
}

.btn {
  margin-top: 70px;
  width: 298px;
  height: 40px;
  line-height: 40px;
  background: linear-gradient(90deg, #60c0fd, #4ea9f9);
  border-radius: 20px;
  color: #fff;
}
</style>