import Vue from "vue";
import Router from "vue-router";
import Main from "@/components/Main";
import Nodes from "@/components/Nodes";
import NodeInfo from "@/components/NodeInfo";
import Statistics from "@/components/Statistics";
import RawMempool from "@/components/RawMemPool";
import Matrix from "@/components/Matrix";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.min.css";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Main",
      component: Main
    },
    {
      path: "/nodes",
      name: "Nodes",
      component: Nodes
    },
    {
      path: "/nodeinfo",
      name: "NodeInfo",
      component: NodeInfo
    },
    {
      path: "/statistics",
      name: "Statistics",
      component: Statistics
    },
    {
      path: "/rawmempool",
      name: "RawMemPool",
      component: RawMempool
    },
    {
      path: "/matrix",
      name: "Matrix",
      component: Matrix
    }
  ]
});
