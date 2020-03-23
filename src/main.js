import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'default-passive-events'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/font_11bu2z7jfowp/iconfont.css'
// 导入sweetalert2
import VueSweetAlert2 from './plugins/sweetalert2'
// 导入区域选择器
import VueAreaLinkage from 'vue-area-linkage'

import axios from 'axios'

import Router from 'vue-router'

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}
// 配置请求根路径
axios.defaults.baseURL = 'http://localhost:8082/'
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios
Vue.use(VueSweetAlert2)
Vue.use(VueAreaLinkage)
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
