import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'//引入element ui
import 'element-ui/lib/theme-chalk/index.css'

import VueWechatTitle from 'vue-wechat-title'//动态路径名
import axios from './axios/index'


/*
 *挂载到vue原型链上
 */
Vue.config.productionTip = false //调试工具

Vue.prototype.$http = axios //axios


Vue.use(ElementUI)
Vue.use(VueWechatTitle)
Vue.config.devtools = true


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
