import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'default-passive-events'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/font_11bu2z7jfowp/iconfont.css'

import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'http://localhost:8082/'
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
