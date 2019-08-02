<template>
    <div>
        <van-actionsheet v-model="iscopy" title="分享至" :close-on-click-overlay="false" @cancel="onCancel">
            <div class="flexbox">
                <div class="item" @click="copyurl" :data-clipboard-text="text" id="copy">
                    <div class="text-c icon"><van-icon name="description" /></div>
                    <p class="text-c fsz-12">复制链接</p>
                </div>
            </div>
        </van-actionsheet>
    </div>
</template>

<script>
import { Toast } from 'vant';
import Clipboard from 'clipboard';
export default {
    props: ['value','text'],
    data(){
        return{
            iscopy: this.value
        }
    },
    watch:{
        value(){
            this.iscopy = this.value
        }
    },
    methods:{
        onCancel(){
            this.$emit('input', false);
        },
        copyurl(){
            let Browser = navigator.userAgent;
            let clipboard = new Clipboard('#copy');
            clipboard.on('success', e=> {
              Toast('已复制')
              this.$emit('input', false);
              e.clearSelection();
            });

            clipboard.on('error', e=> {
                //uc浏览器复制成功依然会走这里
              if(Browser.indexOf('UCBrowser') > -1){

              }else{
                // Toast('复制失败')
              }
            });
        }
    }
}
</script>

<style scoped>
.item {
  flex: 0 0 25%;
  box-sizing: border-box;
  padding: 10px 0;
}
.item .icon {
  font-size: 20px;
}
</style>
