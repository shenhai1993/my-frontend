import Vue from 'vue'
import App from './App'
import store from './store'
import req from '@/request.js'

Vue.prototype.$req = req
//把vuex定义成全局组件
Vue.prototype.$store = store
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
