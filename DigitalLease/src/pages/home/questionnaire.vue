<template>
    <div class="bgc" v-show="show">
        <div class="title text-c">{{data.title}}</div>

        <div class="problems" v-if="data.topic_one_type==1">
            <div class="name">1、	{{data.topic_one}}</div>
            <van-radio-group v-model="problems1">
            <div>
                <div class="radio" v-for="(item,index) in data.topic_one_answer" :key="index"><van-radio :name="item" checked-color="#2DBBF1">{{item}}</van-radio></div>
            </div>
            </van-radio-group>
        </div>
        <div class="problems" v-if="data.topic_one_type==2">
            <div class="name">1、	{{data.topic_one}}</div>
            <van-checkbox-group v-model="problems1">
            <div>
                <div class="checkbox" v-for="(item,index) in data.topic_one_answer" :key="index"><van-checkbox :name="item" checked-color="#2DBBF1" ref="checkboxes">{{item}}</van-checkbox></div>
            </div>
            </van-checkbox-group>
        </div>
        
        <div class="problems" v-if="data.topic_two_type==1">
            <div class="name">2、	{{data.topic_two}}</div>
            <van-radio-group v-model="problems2">
            <div>
                <div class="radio" v-for="(item,index) in data.topic_two_answer" :key="index"><van-radio :name="item" checked-color="#2DBBF1">{{item}}</van-radio></div>
            </div>
            </van-radio-group>
        </div>
        <div class="problems" v-if="data.topic_two_type==2">
            <div class="name">2、	{{data.topic_two}}</div>
            <van-checkbox-group v-model="problems2">
            <div>
                <div class="checkbox" v-for="(item,index) in data.topic_two_answer" :key="index"><van-checkbox :name="item" checked-color="#2DBBF1" ref="checkboxes">{{item}}</van-checkbox></div>
            </div>
            </van-checkbox-group>
        </div>

        <div class="problems" v-if="data.topic_three_type==1">
            <div class="name">3、	{{data.topic_three}}</div>
            <van-radio-group v-model="problems3">
            <div>
                <div class="radio" v-for="(item,index) in data.topic_three_answer" :key="index"><van-radio :name="item" checked-color="#2DBBF1">{{item}}</van-radio></div>
            </div>
            </van-radio-group>
        </div>
        <div class="problems" v-if="data.topic_three_type==2">
            <div class="name">3、	{{data.topic_three}}</div>
            <van-checkbox-group v-model="problems3">
            <div>
                <div class="checkbox" v-for="(item,index) in data.topic_three_answer" :key="index"><van-checkbox :name="item" checked-color="#2DBBF1" ref="checkboxes">{{item}}</van-checkbox></div>
            </div>
            </van-checkbox-group>
        </div>

        <div class="problems" v-if="data.topic_four_type==1">
            <div class="name">4、	{{data.topic_four}}</div>
            <van-radio-group v-model="problems4">
            <div>
                <div class="radio" v-for="(item,index) in data.topic_four_answer" :key="index"><van-radio :name="item" checked-color="#2DBBF1">{{item}}</van-radio></div>
            </div>
            </van-radio-group>
        </div>
        <div class="problems" v-if="data.topic_four_type==2">
            <div class="name">4、	{{data.topic_four}}</div>
            <van-checkbox-group v-model="problems4">
            <div>
                <div class="checkbox" v-for="(item,index) in data.topic_four_answer" :key="index"><van-checkbox :name="item" checked-color="#2DBBF1" ref="checkboxes">{{item}}</van-checkbox></div>
            </div>
            </van-checkbox-group>
        </div>

        <div class="problems" v-if="data.topic_five_type==1">
            <div class="name">5、	{{data.topic_five}}</div>
            <van-radio-group v-model="problems5">
            <div>
                <div class="radio" v-for="(item,index) in data.topic_five_answer" :key="index"><van-radio :name="item" checked-color="#2DBBF1">{{item}}</van-radio></div>
            </div>
            </van-radio-group>
        </div>
        <div class="problems" v-if="data.topic_five_type==2">
            <div class="name">5、	{{data.topic_five}}</div>
            <van-checkbox-group v-model="problems5">
            <div>
                <div class="checkbox" v-for="(item,index) in data.topic_five_answer" :key="index"><van-checkbox :name="item" checked-color="#2DBBF1" ref="checkboxes">{{item}}</van-checkbox></div>
            </div>
            </van-checkbox-group>
        </div>

        <div class="problems" v-if="data.topic_six_type==1">
            <div class="name">6、	{{data.topic_six}}</div>
            <van-radio-group v-model="problems6">
            <div>
                <div class="radio" v-for="(item,index) in data.topic_six_answer" :key="index"><van-radio :name="item" checked-color="#2DBBF1">{{item}}</van-radio></div>
            </div>
            </van-radio-group>
        </div>
        <div class="problems" v-if="data.topic_six_type==2">
            <div class="name">6、	{{data.topic_six}}</div>
            <van-checkbox-group v-model="problems6">
            <div>
                <div class="checkbox" v-for="(item,index) in data.topic_six_answer" :key="index"><van-checkbox :name="item" checked-color="#2DBBF1" ref="checkboxes">{{item}}</van-checkbox></div>
            </div>
            </van-checkbox-group>
        </div>

        <div class="problems" v-if="data.topic_seven_type==1">
            <div class="name">7、	{{data.topic_seven}}</div>
            <van-radio-group v-model="problems7">
            <div>
                <div class="radio" v-for="(item,index) in data.topic_seven_answer" :key="index"><van-radio :name="item" checked-color="#2DBBF1">{{item}}</van-radio></div>
            </div>
            </van-radio-group>
        </div>
        <div class="problems" v-if="data.topic_seven_type==2">
            <div class="name">7、	{{data.topic_seven}}</div>
            <van-checkbox-group v-model="problems7">
            <div>
                <div class="checkbox" v-for="(item,index) in data.topic_seven_answer" :key="index"><van-checkbox :name="item" checked-color="#2DBBF1" ref="checkboxes">{{item}}</van-checkbox></div>
            </div>
            </van-checkbox-group>
        </div>

        <div class="problems" v-if="data.topic_eight_type==1">
            <div class="name">8、	{{data.topic_eight}}</div>
            <van-radio-group v-model="problems8">
            <div>
                <div class="radio" v-for="(item,index) in data.topic_eight_answer" :key="index"><van-radio :name="item" checked-color="#2DBBF1">{{item}}</van-radio></div>
            </div>
            </van-radio-group>
        </div>
        <div class="problems" v-if="data.topic_eight_type==2">
            <div class="name">8、	{{data.topic_eight}}</div>
            <van-checkbox-group v-model="problems8">
            <div>
                <div class="checkbox" v-for="(item,index) in data.topic_eight_answer" :key="index"><van-checkbox :name="item" checked-color="#2DBBF1" ref="checkboxes">{{item}}</van-checkbox></div>
            </div>
            </van-checkbox-group>
        </div>

        <div class="problems" v-if="data.topic_nine_type==1">
            <div class="name">9、	{{data.topic_nine}}</div>
            <van-radio-group v-model="problems9">
            <div>
                <div class="radio" v-for="(item,index) in data.topic_nine_answer" :key="index"><van-radio :name="item" checked-color="#2DBBF1">{{item}}</van-radio></div>
            </div>
            </van-radio-group>
        </div>
        <div class="problems" v-if="data.topic_nine_type==2">
            <div class="name">9、	{{data.topic_nine}}</div>
            <van-checkbox-group v-model="problems9">
            <div>
                <div class="checkbox" v-for="(item,index) in data.topic_nine_answer" :key="index"><van-checkbox :name="item" checked-color="#2DBBF1" ref="checkboxes">{{item}}</van-checkbox></div>
            </div>
            </van-checkbox-group>
        </div>

        <div class="problems">
            <div class="name">10、	{{data.topic_ten}}</div>
            <div class="textarea"><textarea class="border" rows="4" v-model.trim="problems10"></textarea></div>
        </div>

        <div class="pd-15">
            <div class="btn text-c" @click="submit">提交答卷</div>
        </div>
    </div>
</template>

<script>
import { Toast,Dialog } from "vant";
export default {
    data(){
        return {
            show: false,
            problems1:'',
            problems2:'',
            problems3:'',
            problems4:'',
            problems5:'',
            problems6:'',
            problems7:'',
            problems8:'',
            problems9:'',
            problems10:'',
            data:''
        }
    },
    created(){
        this.getdata()
    },
    methods: {
        getdata(){
            Toast.loading({ mask: true, message: "加载中...",duration:0 });
            let postData = this.$qs.stringify({ 
                users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
            });
            this.axios.post(this.API + "api/Generalize/getQuestionnaire", postData)
            .then(res => {
                console.log(res.data, "getdata");
                let resdata = res.data;
                if (resdata.code == 200) {
                    Toast.clear();
                    let {
                        topic_one_type,
                        topic_two_type,
                        topic_three_type,
                        topic_four_type,
                        topic_five_type,
                        topic_six_type,
                        topic_seven_type,
                        topic_eight_type,
                        topic_nine_type,
                    } = resdata.data

                    if(topic_one_type==2){
                        this.problems1=[]
                    }
                    if(topic_two_type==2){
                        this.problems2=[]
                    }
                    if(topic_three_type==2){
                        this.problems3=[]
                    }
                    if(topic_four_type==2){
                        this.problems4=[]
                    }
                    if(topic_five_type==2){
                        this.problems5=[]
                    }
                    if(topic_six_type==2){
                        this.problems6=[]
                    }
                    if(topic_seven_type==2){
                        this.problems7=[]
                    }
                    if(topic_eight_type==2){
                        this.problems8=[]
                    }
                    if(topic_nine_type==2){
                        this.problems9=[]
                    }

                    this.data = resdata.data
                    this.show = true
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

        submit(){
            if(this.problems1.length==0||this.problems2.length==0||this.problems3.length==0||this.problems4.length==0||this.problems5.length==0||this.problems6.length==0||this.problems7.length==0||this.problems8.length==0||this.problems9.length==0||this.problems10.length==0){
                Toast('请选择选项或填写')
                return
            }

            let obj = {
                topic_one: this.problems1,
                topic_two: this.problems2,
                topic_three: this.problems3,
                topic_four: this.problems4,
                topic_five: this.problems5,
                topic_six: this.problems6,
                topic_seven: this.problems7,
                topic_eight: this.problems8,
                topic_nine: this.problems9,
                topic_ten: this.problems10,
            }
            console.log(obj);
            
            Toast.loading({ mask: true, message: "加载中...",duration:0 });
            let postData = this.$qs.stringify({ 
                users_id: JSON.parse(window.localStorage.getItem("userinfo")).users_id,
                title: this.data.title,
                answer: JSON.stringify(obj)
            });
            this.axios.post(this.API + "api/Generalize/saveQuestionnaire", postData)
            .then(res => {
                console.log(res.data, "submit");
                let resdata = res.data;
                if (resdata.code == 200) {
                    Toast.clear();

                } else {
                    Toast.clear();
                    Toast(resdata.message||'操作失败');
                }
            })
            .catch(error => {
                Toast.clear();
                Toast('网络出错')
            });
        }
    }
}
</script>

<style scoped>
.btn {
  height: 40px;
  line-height: 40px;
  border-radius: 5px;
  color: #fff;
  background-image: linear-gradient(90deg, #2dbbf1 0%, #4ea9f9 100%);
}
.title {
    font-weight: bold;
    padding: 15px 0;
}

.checkbox >>> .van-checkbox__icon--round,
.radio >>> .van-icon-circle {
    color: #e0e0e0
}
.problems {
    padding: 10px;
}
.problems .name {
    margin-bottom: 8px;
}
.radio {
    padding: 5px 10px;
}
.checkbox {
    padding: 5px 10px;
}
.textarea {
    box-sizing: border-box;
    padding: 5px;
}
.textarea textarea{
    width: 100%;
    box-sizing: border-box;
    padding: 5px;
}
</style>
