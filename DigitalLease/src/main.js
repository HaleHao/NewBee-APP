// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import './style/reset.css'
import './style/common.css'
import router from './router'

import filter from './utils/filter'

Vue.use(require('vue-wechat-title'))

import axios from "axios"
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant);

import { Dialog } from 'vant';
Vue.use(Dialog);

import { Lazyload } from 'vant';
Vue.use(Lazyload,{lazyComponent:true});

import VueAMap from 'vue-amap';
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  // key: '7dd71e09ac3a903d60949151b6d53744',//公司的
  key: 'd2fb704760d2d6ff18b57df3147cb8cb',
  plugin: ['Autocomplete', 'Geolocation', 'PolyEditor', 'AMap.CircleEditor'],
  v: '1.4.4'
});

import qs from 'qs'
Vue.prototype.$qs = qs

// Vue.prototype.API = ' https://newbeeadmin.zx-xcx.com/'
Vue.prototype.API = ' https://admin.newbee-smart.com/'
// Vue.prototype.API = ' https://www.newbee-smart.com/'

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App />'
})

// Code is far away from bug with the animal protecting
// 神兽保佑,代码无bug
//   ┏┓　　　┏┓
// ┏┛┻━━━┛┻┓
// ┃　　　　　　　┃ 　
// ┃　　　━　　　┃
// ┃　┳┛　┗┳　┃
// ┃　　　　　　　┃
// ┃　　　┻　　　┃
// ┃　　　　　　　┃
// ┗━┓　　　┏━┛
// 　　┃　　　┃
// 　　┃　　　┃
// 　　┃　　　┗━━━┓
// 　　┃　　　　　　　┣┓
// 　　┃　　　　　　　┏┛
// 　　┗┓┓┏━┳┓┏┛
// 　　　┃┫┫　┃┫┫
// 　　　┗┻┛　┗┻┛ 