import Vue from 'vue'

// 距离单位换算
Vue.filter('distance', function (value) {
    if(value < 1000){
        return value+"m"
    }else if(value > 1000){
        return (Math.round(value/100)/10).toFixed(1) + "km"
    } 
})
// 优惠卷价格去.00
Vue.filter('noZero', function (value) {
    if(value.endsWith('.00') ){
        return value.split('.')[0]
    }else {
        return value
    }
})
// 超过99+省略
Vue.filter('tagOmit', function (value) {
    if(value>=100){
        return '99+'
    }else {
        return value
    }
})