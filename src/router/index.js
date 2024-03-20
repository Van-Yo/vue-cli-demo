import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import { getToken } from '@/utils/user'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'

Vue.use(VueRouter)

NProgress.configure({
  easing: 'ease', // 动画方式，和css动画属性一样（默认：ease）
  speed: 500, // 递增进度条的速度，单位ms（默认： 200）
  showSpinner: false, // 是否显示加载ico
  trickle: true, // 是否自动递增
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3, // 初始化时的最小百分比，0-1（默认：0.08）
  parent: '#app'
})

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
    redirect: '/home',
    component: () => import('@/views/layout'),
    children: [
      { path: 'home', name: 'home', component: () => import('@/views/frontendPark') },
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
  NProgress.start()
  // console.log(to, from)
  // // 通过自定义方法获取用户 token 用来判断用户登录状态
  const token = getToken()
  // console.log(token, 1111111)
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    Message.error('会话失效,请重新登录！')
    // 如果没有登录而且前往的页面不是登录页面，跳转到登录页
    next({ name: LOGIN_PAGE_NAME })
    NProgress.done()
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 如果没有登录而且前往的页面是登录页面，跳转到登录页面
    // 这里有一个坑，一定要注意这一步和上一步得分开写
    // 如果把前两步判断合并为 if (!token) next({ name:login })
    // 则会形成登录页面无限刷新的错误，具体成因后面解释
    next()
  } else {
    if (to.name === LOGIN_PAGE_NAME) {
      Message.error('没有权限')
      next({ ...from, replace: true })
      NProgress.done()
    }
    // 如果登录了
    if (!store.state.user.hasGetRoute) {
      // 如果没有获取路由信息，先获取路由信息而后跳转
      store.dispatch('getRouteList').then(() => {
        for (let i = 0; i < store.state.user.routeList.length; i++) {
          const element = store.state.user.routeList[i]
          router.addRoute('/', element)
        }
        router.addRoute({
          path: '*',
          redirect: '/404'
        })
        // console.log(router)
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

// 只有路由发生变化才会执行
// 假如login=>index，但没有登录，路由被中断，重定向到login，也就是login=>index=>login，路由守卫认为没有发生路由变化，router.afterEach也就不执行
// 所以页面加载进度条NProgress.done()在router.beforeEach里面👆也在两个地方写了
router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = 'vue-cli-demo'
  }
  NProgress.done()
})

export default router
