import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import x2js from 'x2js'

// 导入插件
import './plugins/element.js' // element
import './assets/styles/index.scss'
import './assets/icons' // icon
import './plugins/echarts' // echarts
import './plugins/flv' // flv
import print from './utils/print.js'
Vue.use(print)
import beautyLog from './utils/beautyLog'
// console.log(beautyLog)
Vue.config.productionTip = false
Vue.prototype.$x2js = new x2js()
Vue.prototype.$log = beautyLog

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
