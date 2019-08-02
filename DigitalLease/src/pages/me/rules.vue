<template>
    <div v-html="content" class="box"></div>
</template>

<script>
import { Toast } from "vant";
export default {
    data(){
        return{
            content: ''
        }
    },
    created(){
        this.getcontent()
    },
    methods:{
        getcontent(){
            Toast.loading({ mask: true, message: "加载中..." });
            let postData = this.$qs.stringify({
                title: this.$route.params.title
            });
            this.axios.post(this.API + "api/Order/Agreement", postData).then(res => {
                Toast.clear();
                // console.log(res.data, "content");
                let resdata = res.data;
                if (resdata.code == 200) {
                    this.content = resdata.data
                } else {
                Toast.clear();
                Toast(resdata.message);
                }
            });
        }
    }
}
</script>

<style scoped>
.box{
    padding: 5px;
}
</style>