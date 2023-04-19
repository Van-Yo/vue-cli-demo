import Layout from '@/views/layout'
import { api } from '../../api'
import { setToken, removeToken } from '@/utils/user'

const loadView = (viewPath) => {
  // 用字符串模板实现动态 import 从而实现路由懒加载
  return (resolve) => require([`@/views/${viewPath}`], resolve)
}

const filterAsyncRouter = (routeList) => {
  return routeList.filter((route) => {
    if (route.component) {
      if (route.component === 'Layout') {
        // 如果 component = Layout 说明是布局组件
        // 将真正的布局组件赋值给它
        route.component = Layout
      } else {
        // 如果不是布局组件就只能是页面的引用了
        // 利用懒加载函数将实际页面赋值给它
        route.component = loadView(route.component)
      }
      // 判断是否存在子路由，并递归调用自己
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children)
      }
      return true
    } else {
      return true
    }
  })
}

const user = {
  state: {
    token: '',
    hasGetRoute: false,
    routeList: [],
    theme: 'blove'
  },
  mutations: {
    setToken(state, data) {
      state.token = data
    },
    setRouteList(state, data) {
      // console.log('object11111111111111111111111111', data)
      // 先将 JSON 格式的路由列表解析为 JavaScript List
      // 再用路由解析函数解析 List 为真正的路由列表
      state.routeList = filterAsyncRouter(JSON.parse(JSON.stringify(data)))
      console.log(state.routeList, '111111111111111111111111111111')
      // state.routeList = data.routes
      // 修改路由获取状态
      state.hasGetRoute = true
    },
    removeToken(state, data) {
      state.token = null
    },
    THEME_CHANGE(state, theme) {
      state.theme = theme
    }
  },
  actions: {
    login({ state, commit }) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async(resolve) => {
        const [e, r] = await api.getUserInfo()
        if (!e && r) {
          const token = '1122334'
          commit('setToken', token)
          setToken(token)
          resolve(token)
        }
      })
    },
    loginOut({ state, commit }) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async(resolve) => {
        const [e, r] = await api.loginOut()
        if (!e && r) {
          commit('removeToken')
          removeToken()
          resolve()
        }
      })
    },
    getRouteList({ state, commit }) {
      return new Promise((resolve) => {
        const token = state.token
        // getRoute({ token }).then((res) => {
        //   let data = res.data.data
        //   // 注意这里取出的是 JSON 格式的路由列表
        //   commit('setRouteList', data)
        //   resolve()
        // })
        setTimeout(() => {
          const data = {
            token,
            routes: [
              { path: '/echarts', name: 'echarts', component: 'echarts' },
              { path: '/three', name: 'three', component: '14龟池过滤' },
              { path: '/dataHandle', name: 'dataHandle', component: 'dataHandle' },
              { path: '/imgViewList', name: 'imgViewList', component: 'imgViewList' },
              { path: '/videoLive', name: 'videoLive', component: 'videoLive' },
              { path: '/cesium', name: 'cesium', component: 'cesium/test2' },
              {
                path: '*',
                redirect: '/404'
              }
            ]
          }
          commit('setRouteList', data.routes)
          resolve()
        }, 1000)
      })
    },
    themeChange({
      commit
    }, theme) {
      commit('THEME_CHANGE', theme)
    }
  }
}

export default user
