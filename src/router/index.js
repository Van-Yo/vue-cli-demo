import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import { getToken } from '@/utils/user'

Vue.use(VueRouter)

// 避免重复触发了同一个路由引起报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const staticRoutes = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录页面',
      hideInMenu: true
    },
    component: () => import('@/views/login')
  },
  {
    path: '/',
    name: '/',
    redirect: '/index',
    component: () => import('@/views/layout'),
    children: [
      { path: 'index', name: 'index', component: () => import('@/views/index') },
      { path: 'downloadPDF', name: 'downloadPDF', component: () => import('@/views/downloadPDF') },
      { path: 'print', name: 'print', component: () => import('@/views/print') },
      { path: 'svgIconUse', name: 'svgIconUse', component: () => import('@/views/svgIconUse') },
      { path: 'rate', name: 'rate', component: () => import('@/views/Rate') },
      {
        path: '404',
        name: '404',
        component: () => import('@/views/404')
      }
    ]
  }

]

// 定义登录页面名称（为了方便理解才定义的）
const LOGIN_PAGE_NAME = 'login'

const router = new VueRouter({
  routes: staticRoutes
})

// 定义全局前置守卫（里面有两个坑要注意）
router.beforeEach((to, from, next) => {
  // console.log(to, from)
  // // 通过自定义方法获取用户 token 用来判断用户登录状态
  const token = getToken()
  // console.log(token, 1111111)
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 如果没有登录而且前往的页面不是登录页面，跳转到登录页
    next({ name: LOGIN_PAGE_NAME })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 如果没有登录而且前往的页面是登录页面，跳转到登录页面
    // 这里有一个坑，一定要注意这一步和上一步得分开写
    // 如果把前两步判断合并为 if (!token) next({ name:login })
    // 则会形成登录页面无限刷新的错误，具体成因后面解释
    next()
  } else {
    if (to.name === LOGIN_PAGE_NAME) {
      next({ ...from, replace: true })
    }
    // 如果登录了
    if (!store.state.user.hasGetRoute) {
      // 如果没有获取路由信息，先获取路由信息而后跳转
      store.dispatch('getRouteList').then(() => {
        for (let i = 0; i < store.state.user.routeList.length; i++) {
          const element = store.state.user.routeList[i]
          router.addRoute('/', element)
        }
        // 这里也是一个坑，不能使用简单的 next()
        // 如果直接使用 next() 刷新后会一直白屏
        next({ ...to, replace: true })
      })
    } else {
      // 如果已经获取路由信息，直接跳转
      next()
    }
  }
  next()
})

export default router
