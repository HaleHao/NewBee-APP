<template>
  <div>
    <div class="myinfor">
      <div class="me bgc">
        <div class="flex-jc-between flex-align-items tx border-b">
          <div>我的头像</div>
          <div class="head_img">
            <van-uploader :after-read="onRead" multiple v-if="head_img==''">
                <img src="../../assets/headimg.png" alt="头像" class="img">
            </van-uploader>
            <van-uploader :after-read="onRead" multiple v-else>
                <img :src="head_img" alt="头像" class="img">
            </van-uploader>
          </div>
        </div>

        <van-cell is-link center to="/detaInformation" :border="false">
          <template slot="title">
            <div>详细信息</div>
          </template>
        </van-cell>
        <div class="shxx border-t">
          <van-cell is-link center to="/receInformation">
            <template slot="title">
              <div>收货信息</div>
            </template>
          </van-cell>
        </div>
      </div>

      <div class="me bgc">
        <div class="zhaq border-b">
          <van-cell is-link center to="/accountSecurity">
            <template slot="title">
              <div>账号安全</div>
            </template>
          </van-cell>
        </div>
        <div class="bdzh">
          <van-cell is-link center to="/accountBinding">
            <template slot="title">
              <div>绑定账号</div>
            </template>
          </van-cell>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { Compress } from "@/utils/util.js";
export default {
  data() {
    return {
      head_img:''
    };
  },
  created() {
    this.getheadimg()
  },
  methods: {
    onRead(file) {
      console.log(file)
      if(Array.isArray(file)){
          Toast('只能单选') 
          return
      }
      // this.upload(file.file)
      Compress(file.content,file.file.type).then(res=>{
        console.log(res,'compress')
        this.upload(res)
      })

    },
    upload(file){
      Toast.loading({ mask: true, message: "加载中...",duration:0 });
      let config = {
          headers:{'Content-Type':'multipart/form-data'}
      }
      let formData = new FormData()
      formData.append('file',file)
      formData.append('users_id',JSON.parse(window.localStorage.getItem("userinfo")).users_id)

      this.axios
        .post(this.API + "api/Lease_Order/modifyHeadPicture",formData,config)
        .then(res => {
          console.log(res.data, "headimg");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear();
            Toast('上传成功');
            this.getheadimg()
          } else {
            Toast.clear();
            Toast(resdata.message||'操作失败');
          }
        })
        .catch(error => {
          Toast.clear()
          Toast('网络出错')
        });
    },

    getheadimg() {
      Toast.loading({ mask: true, message: "加载中..." });
      let postData = this.$qs.stringify({
        users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id||3
      });
      this.axios
        .post(this.API + "api/Lease_Order/getHeadPicture", postData)
        .then(res => {
          console.log(res.data, "headimg");
          let resdata = res.data;
          if (resdata.code == 200) {
            Toast.clear();
            if(resdata.data.length==0){
              this.head_img = ''
            }else{
              this.head_img = resdata.data;
            }
          } else {
            Toast.clear();
            // Toast(resdata.message);
          }
        });
    },
  }
};
</script>

<style>
.zhaq .van-cell {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.bdzh .van-cell,
.shxx .van-cell {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
</style>

<style scoped>
.tx {
  padding: 10px 0;
  font-size: 12px;
}
.tx > div:nth-of-type(1) {
  padding-left: 12px;
}
.head_img {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin-right: 10px;
  overflow: hidden;
  font-size:0
}
.head_img .img {
  width: 45px;
  height: 45px;
}
.myinfor {
  width: 100%;
  padding-top: 12px;
}

.me {
  width: 300px;
  height: 100%;
  margin: 0 auto;
  border-radius: 5px;
  margin-bottom: 15px;
}
</style>