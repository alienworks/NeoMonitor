import "@babel/polyfill";
import "mutationobserver-shim";
import Vue from "vue";
import App from "./App";
import Vuex from "vuex";
import { store } from "./store";
import router from "./router";
import BootstrapVue from "bootstrap-vue";
import "@/plugins/echarts";

Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(BootstrapVue);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
