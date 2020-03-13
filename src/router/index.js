import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Add from '../components/add'
import Details from '../components/details-account-info'

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
    component: Home
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

export default router
