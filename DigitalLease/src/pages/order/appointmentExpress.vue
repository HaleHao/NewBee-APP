<template>
    <div>
        <div class="mar-b-10">
            <van-cell title="选择退租时间" is-link center :value="datetext" @click="go('/calendar/appointmentExpress')"></van-cell>  
            <van-cell title="时间段" is-link center :value="timequantumtext" @click="showtimequantum=true"></van-cell>  
        </div>

        <div class="address bgc flex-align-items pd-15" @click="go('/addresslist/appointmentExpress')">
            <div class="left bgc-brown flex-center">寄</div>
            <div class="flex-1 right">
                <div v-show="getaddress==''" class="fc-grey">请选择</div>
                <div class="mar-b-10">{{getaddress.ads_user||''}}  {{getaddress.ads_phone||''}}</div>
                <div>{{(getaddress.ads_province||'')+(getaddress.ads_city||'')+(getaddress.ads_district||'')+(getaddress.ads_address||'')}}</div>
            </div>
            <div><van-icon name="arrow" /></div>
        </div>

        <div class="address bgc flex-align-items pd-15">
            <div class="left bgc-blue flex-center">收</div>
            <div class="flex-1">
                <div v-show="shopaddress==''" class="fc-grey">暂无收货地址</div>
                <div class="mar-b-10">{{shopaddress.store_name}} {{shopaddress.store_phone}}</div>
                <div>{{(shopaddress.store_partners||'')+(shopaddress.store_city||'')+(shopaddress.store_district||'')+(shopaddress.store_Address||'')}}</div>
            </div>
        </div>

        <div class="pd-t-100"><div class="btn text-c" @click="submit">提交</div></div>

        <van-popup v-model="showtimequantum" position="bottom" :close-on-click-overlay="false">
            <van-picker :columns="timequantumarr" show-toolbar @cancel="showtimequantum = false" @confirm="onConfirmTimequantum"/>
        </van-popup>
    </div>
</template>

<script>
import { Toast,Dialog } from 'vant';
export default {
    data(){
        return{
            datetext:'',
            getaddress:'',
            shopaddress:'',
            timequantumtext:'', //时间段
            showtimequantum: false, //时间段
            timequantumarr:[] //时间段
        }
    },
    created() {
        let appointmentExpress = JSON.parse(window.sessionStorage.getItem("appointmentExpress"));
        if(appointmentExpress){
            this.datetext = appointmentExpress.date
            this.timequantumtext = appointmentExpress.timequantumtext
            this.getaddress = appointmentExpress.getaddress
        }else {
            this.getdefaultaddress();
        }
        //取缓存 end 
    },
    mounted(){
        this.getdefaultshop()
        this.gettimequantumarr()
    },
    methods:{
        go(url){
            let appointmentExpress = {
                date: this.datetext,
                timequantumtext: this.timequantumtext,
                getaddress:this.getaddress,
            }
            window.sessionStorage.setItem("appointmentExpress", JSON.stringify(appointmentExpress));
            this.$router.push({ path: url });
        },
        onConfirmTimequantum(value,index){
            console.log(`当前值：${value}, 当前索引：${index}`);
            let newdate = new Date()
            if(this.datetext == `${newdate.getFullYear()}/${newdate.getMonth() + 1}/${newdate.getDate()}`){
                let end = value.split('-')[1].split(':')[0]
                //+1小时
                newdate = new Date().getTime() + 1000*60*60
                newdate = new Date(newdate)
                let newhours = newdate.getHours()
                if(newhours >= end){
                Toast("不在配送时间段")
                this.timequantumtext = ''
                return
                }
            }
            this.timequantumtext = value
            this.showtimequantum = false
        },
        getdefaultaddress(){
            let postData = this.$qs.stringify({
                users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
            })
            this.axios.post(this.API + "api/Lease/ads_select",postData)
            .then(res => {
                console.log(res.data, "address")
                let resdata = res.data
                if (resdata.code == 200) {
                    for(let v of resdata.data){
                        if(v.ads_state==2){
                            this.getaddress = v
                        }
                    }
                } else {
                    // Toast(resdata.message)
                }
            });
        },
        getdefaultshop(){
            let postData = this.$qs.stringify({
                order_id: this.$route.params.id
            })
            this.axios.post(this.API + "api/Lease_Order/getStore",postData)
            .then(res => {
                console.log(res.data, "shop")
                let resdata = res.data
                if (resdata.code == 200) {
                    this.shopaddress = resdata.data
                } else {
                    Toast(resdata.message)
                }
            });
        },
        gettimequantumarr(){
            this.axios.post(this.API + "api/Lease_Order/getSFTime")
            .then(res => {
                console.log(res.data, "timequantum")
                let resdata = res.data
                if (resdata.code == 200) {
                    let arr = []
                    for(let v of resdata.data){
                        arr.push(v[0])  
                    }
                    this.timequantumarr = arr
                } else {
                    Toast(resdata.message)
                }
            });
        },

        submit(){
            if(this.datetext==''||this.timequantumtext==''||!this.getaddress.ads_id||!this.shopaddress.store_id){
                Toast('还有未填写')
                return
            }
            let newdate = new Date()
            if(this.datetext == `${newdate.getFullYear()}/${newdate.getMonth() + 1}/${newdate.getDate()}`){
                let end = this.timequantumtext.split('-')[1].split(':')[0]
                //+1小时
                newdate = new Date().getTime() + 1000*60*60
                newdate = new Date(newdate)
                let newhours = newdate.getHours()
                if(newhours >= end){
                Toast("不在配送时间段")
                this.timequantumtext = ''
                return
                }
            }
            
            Toast.loading({ mask: true,message: '加载中...'})
            let postData = this.$qs.stringify({
                order_id:this.$route.params.id,
                ads_id: this.getaddress.ads_id,
                store_id: this.shopaddress.store_id,
                year : this.datetext,
                time: this.timequantumtext
            });
            this.axios.post(this.API + "api/Lease_Order/onlineAppointment", postData)
            .then(res => {
            console.log(res.data, "code");
            let resdata = res.data;
            if (resdata.code == 200) {
                Toast.clear()
                Dialog.alert({
                    message: '操作成功'
                }).then((e) => {
                    this.$router.go(-2);
                });
            } else {
                Toast.clear()
                Toast(resdata.message||'操作失败');
            }
            });
        }

    }
}
</script>

<style scoped>
.btn{
    height: 42px;
    line-height: 42px;
    border-radius: 20px;
    color: #fff;
    background-image: linear-gradient(90deg, #2DBBF1 0%, #4EA9F9 100%);
}

.pd-t-100{
    padding: 0 15px;
    padding-top: 100px;
}

.address .left{
    width: 32px;
    height: 32px;
    color: #fff;
    border-radius: 50%;
    margin-right: 15px;
}

</style>
