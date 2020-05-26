import Vue from "vue";
import Vuex from "vuex";
import NodeService from "@/services/NodeService";
import { mainNetFlag } from "@/constants";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    nodeID: 0,
    statisticsX: [],
    statisticsY: [],
    nodes: [],
    nodeInfo: [],
    matrixEntities: [],
    pools: [],
    flag: mainNetFlag,
    isFetchingProgress: false,
  },

  mutations: {
    setNodeID(state, payload) {
      state.nodeID = payload;
    },
    setStatisticsX(state, payload) {
      state.statisticsX = payload;
    },
    setStatisticsY(state, payload) {
      state.statisticsY = payload;
    },
    setNodes(state, payload) {
      state.nodes = payload;
    },
    setNodeInfo(state, payload) {
      state.nodeInfo = payload;
    },
    setFlag(state, payload) {
      state.flag = payload;
    },
    setMatrixEntities(state, entities) {
      state.matrixEntities = entities;
    },
    setPools(state, pools) {
      state.pools = pools;
    },
    setIsFetchingProgress(state, progress) {
      state.isFetchingProgress = progress;
    },
  },

  actions: {
    async getNodes({ commit }) {
      const response = await NodeService.getNodesInfo();
      const nodes = response.status === 200 ? response.data : [];
      commit("setNodes", nodes);
    },
    async getMatrixEntities({ commit }) {
      const response = await NodeService.getMatrixItems();
      const entities = response.status === 200 ? response.data : [];
      commit("setMatrixEntities", entities);
    },
    async getPools({ commit, getters }) {
      const response = await NodeService.getRawMempool(getters.nodeID);
      const pools = response.status === 200 ? response.data : [];
      commit("setPools", pools);
    },
    async getNodeInfo({ commit, getters }) {
      const response = await NodeService.getNodeInfo(getters.nodeID);
      const nodeInfo = response.status === 200 ? response.data : [];
      commit("setNodeInfo", nodeInfo);

      const exceptionTimes = [];
      const intervals = [];

      nodeInfo.forEach((item) => {
        exceptionTimes.push(item.exceptionTime);
        intervals.push(item.intervals);
      });

      commit("setStatisticsX", exceptionTimes);
      commit("setStatisticsY", intervals);
    },
  },

  getters: {
    statisticsX: (state) => state.statisticsX,
    statisticsY: (state) => state.statisticsY,
    nodes: (state) => state.nodes,
    nodeInfo: (state) => state.nodeInfo,
    flag: (state) => state.flag,
    mainNodesLength: (state) =>
      state.nodes.filter((node) => node.net === mainNetFlag).length,
    matrixEntities: (state) => state.matrixEntities,
    isFetchingProgress: (state) => state.isFetchingProgress,
    pools: (state) => state.pools,

    nodeID(state, getter) {
      if (state.flag === mainNetFlag)
        return state.nodeID + getter.mainNodesLength;
      return state.nodeID;
    },

    getSelectedNodes(state, getter) {
      const currentNetFlag = state.flag;
      const lengthOfMainNodes = getter.getMainNodesLength;
      const nodes = state.nodes.filter(
        (node) => node.net === currentNetFlag
      );

      if (state.flag === mainNetFlag) return nodes;
      return nodes.map((node) => ({
        ...node,
        id: node.id - lengthOfMainNodes,
      }));
    },
  },

  strict: process.env.NODE_ENV !== "production",
});
