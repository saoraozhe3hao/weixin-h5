import '../assets/mixin.less'
import '../assets/font/iconfont.css'
import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import router from './router'
import NutUI from '@nutui/nutui';
import '@nutui/nutui/dist/nutui.css'
import App from '../App'
// import FastClick from 'fastclick'
import qs from 'qs';
import axios from 'axios'
import './mock'

// FastClick.attach(document.body);
Vue.use(Router);
Vue.use(Vuex);
NutUI.install(Vue);
Vue.prototype.$qs = qs;
Vue.prototype.$axios = axios;
Vue.prototype.$wx = window.wx;
Vue.prototype.$basePath = '';
Vue.prototype.$alipayReady = function ready(callback) {
    if (window.AlipayJSBridge) {
        callback && callback();
    } else {
        document.addEventListener('AlipayJSBridgeReady', callback, false);
    }
};

(function () {
    let htmlElem = document.getElementsByTagName("html")[0];
    let htmlWidth = htmlElem.clientWidth;
    let fontSize = (htmlWidth / 10).toFixed(2);
    htmlElem.style.fontSize = fontSize + "px"
})();

new Vue({
    el: '#app',
    router,
    template: '<App/>',         // 用template填充el
    components: {App},        // 列举 component，用于 template
    store: new Vuex.Store({
        state: {
            environment: 'weixin', // 环境 微信-weixin 支付宝-alipay
            station: {},  // 油站
            gun: {},  // 油枪
            amount: '',  // 加油金额
            pay: '',    // 实付金额
            plate: {},  // 车牌
            receipt: null,  // 发票信息
            coupons: [],   // 可使用的优惠券
            coupon: {},    // 使用的优惠券
            awards: [],    // 抽奖盘中的奖品
            serialCode: '' // 订单序列号
        },
        mutations: {
            change(state) {
            }
        }
    })
});


