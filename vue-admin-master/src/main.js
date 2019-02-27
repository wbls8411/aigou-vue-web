import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
//import Mock from './mock'
import axios from 'axios'  // 引入axios依赖,和引入vue一样
//Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI); // 在vue环境中引入ElementUI
Vue.use(VueRouter)
Vue.use(Vuex);

//axios的全局定义:
axios.defaults.baseURL="http://localhost:9527/aigou";// 网关的前缀:
//easy-mock:做模拟服务端:不要再拼接了,这是一个全局配置,会在axios的所有请求都加这个前缀
//axios.defaults.baseURL="https://www.easy-mock.com/mock/5c74b648e4782d132ff56ed7/employee/aigou/employee";

// /aigou/employee/employee/login
Vue.prototype.$http = axios //原型
Vue.config.productionTip = false

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    // html5: 会话机制  想成session:  删除一个user的session
      // localStorage: 本地存储
      // sessionStorage:
    sessionStorage.removeItem('user');
  }


  let user = JSON.parse(sessionStorage.getItem('user'));

  // user==null:没有user,就是没有登录
  if (!user && to.path != '/login') {
    // 如果没有登录,就想访问我们的资源,就先调整到登录页面进行登录
    next({ path: '/login' })
  } else {
    next()
  }


})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

