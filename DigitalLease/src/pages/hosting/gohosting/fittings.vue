<template>
    <div>
        <div class="pd-15 fc-grey bgc">请选择现有的配件</div>
        <div class="pd-lr-15 bgc">
            <span class="fc-red">*</span>
            <span class="fc-grey fsz13">设备出租需包含完整配件，若配件不齐全，我们将补充完整，需由您承担相应成本</span>
        </div>

        <van-checkbox-group v-model="result">
            <div class="bgc pd-15 flex-wrap">
                <div class="fc-grey" v-if="list.length==0">暂无配件</div>

                <div v-for="(item, index) in list" :key="index" class="flex-align-items item" >
                    <div><van-checkbox :name="item.id" checked-color="#2DBBF1" ref="checkboxes"></van-checkbox></div>
                    <div class="pdl">
                        <div>{{item.name}}</div>
                        <div class="stepper" v-if="item.number!=1"><van-stepper disable-input :value="item.num" :max="item.number" @change="onchange(index,$event)" /></div>
                    </div>
                </div>
            </div>
        </van-checkbox-group>

         <div class="pd-15">
            <div class="btn text-c" @click="next">下一步</div>
        </div>
    </div>
</template>

<script>
import { Toast } from "vant";
export default {
    data(){
        return{
            list: [],
            result: []
        }
    },
    created(){
        let gohostingSession = JSON.parse(window.sessionStorage.getItem("gohostingSession"));
        console.log(gohostingSession)
        if(gohostingSession){      
            let arr = []
            for(let v of gohostingSession.fittings){
                arr.push(v.id)
            }
            this.result = arr
        }

        this.getqueryCate()
    },
    methods:{
        // toggle(index) {
        //     this.$refs.checkboxes[index].toggle();
        // },
        getqueryCate(){
            let gohostingSession = JSON.parse(window.sessionStorage.getItem("gohostingSession"));
            if(gohostingSession){
                var typetext = gohostingSession.typetext
                var brandtext = gohostingSession.brandtext
                var modeltext = gohostingSession.modeltext
            }else{
                Toast('未选择品类')
                return
            }

            Toast.loading({ mask: true, message: "加载中..." });
            let postData = this.$qs.stringify({
                cate_id: typetext.cate_id,
                brand_id: brandtext.brand_id,
                model_id: modeltext.model_id
            });
            this.axios.post(this.API + "api/Trusteeship/getPartlist",postData)
            .then(res => {
                console.log(res.data, "list")
                let resdata = res.data 
                if (resdata.code == 200) {
                    Toast.clear();
                    let arr = []
                    for(let [k, v] of Object.entries(resdata.data)){
                        v.num = v.number
                        arr.push(v)
                    }
                    
                    this.list = arr
                } else {
                    Toast.clear();
                    // Toast(resdata.message)
                }
            })
        },
        onchange(index,val){
            console.log('k:'+index,'val:'+val);
            this.list[index].num = val
        },
        next(){
            // console.log(this.result);
            let fittingstring = []
            let fittings = []
            for(let v1 of this.result){
                for(let v2 of this.list){
                    if(v1==v2.id){
                        // console.log(v2);
                        fittings.push(v2)
                        fittingstring.push(`${v2.name} x${v2.number}`)
                    }
                }
            }
            // console.log(fittingstring)
            let gohostingSession = JSON.parse(window.sessionStorage.getItem("gohostingSession"));
            gohostingSession.fittings = fittings //缓存
            gohostingSession.fittingstring = fittingstring.join(',') //字符串
            window.sessionStorage.setItem("gohostingSession", JSON.stringify(gohostingSession));
            this.$router.push({ path: '/uploadimg' })
        }
    }
}
</script>

<style scoped>
.fsz13{
    font-size: 13px
}
.btn {
  height: 42px;
  line-height: 42px;
  border-radius: 20px;
  color: #fff;
  background-image: linear-gradient(90deg, #2dbbf1 0%, #4ea9f9 100%);
}
.pdl{
    margin-left: 10px
}

.stepper >>> .van-stepper__input[disabled]{
    color: #000;
    -webkit-text-fill-color:#000;
    -webkit-opacity:1; opacity: 1;
}
.item {
    width: 50%;
    box-sizing: border-box;
    padding: 10px 0;
}
</style>
