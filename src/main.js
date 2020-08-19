import "@babel/polyfill"
import "mutationobserver-shim"
import Vue from "vue"
import App from "./App"
import Vuex from "vuex"
import store from "./store"
import router from "./router"
import BootstrapVue from "bootstrap-vue"
import "@/plugins/echarts"

import Antd from "ant-design-vue"
import "ant-design-vue/dist/antd.css"

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(BootstrapVue)
Vue.use(Antd)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app")
