import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Add from '../components/add'
import Details from '../components/details-account-info'
import Welcome from '../views/Welcome'
import ExpertInfo from '../views/expertManage/ExpertInfo'
import ProjectInfo from '../views/projectManage/ProjectInfo'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/expertInfo', component: ExpertInfo },
      { path: '/projectInfo', component: ProjectInfo }
    ]
  },
  {
    path: '/add',
    component: Add
  },
  {
    path: '/details',
    component: Details
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 要访问的路径
  // from 从哪个路径跳转来的
  // next 是个放行函数
  if (to.path === '/login') {
    window.sessionStorage.clear()
    return next()
  }
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})

export default router
