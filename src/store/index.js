import Vue from "vue";
import Vuex from "vuex";
import NodeService from "@/services/NodeService";
import { netFlags } from "@/constants";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    nodeID: 0,
    statisticsX: [],
    statisticsY: [],
    neoNodes: [],
    nodeInfo: [],
    matrixEntities: [],
    pools: [],
    flag: netFlags.MainNetFlag,
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
      state.neoNodes = payload;
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
    async getPools({ commit, state }) {
      const response = await NodeService.getRawMempool(state.nodeID);
      const pools = response.status === 200 ? response.data : [];
      commit("setPools", pools);
    },
    async getNodeInfo({ commit, state }) {
      const response = await NodeService.getNodeInfo(state.nodeID);
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
    nodes: (state) => state.neoNodes,
    nodeInfo: (state) => state.nodeInfo,
    flag: (state) => state.netFlag,
    mainNodesLength: (state) =>
      state.neoNodes.filter((node) => node.net === netFlags.MainNetFlag).length,
    matrixEntities: (state) => state.matrixEntities,
    isFetchingProgress: (state) => state.isFetchingProgress,
    pools: (state) => state.pools,

    nodeID(state) {
      if (state.netFlag === netFlags.MainNetFlag)
        return state.nodeID + state.mainNodesLength;
      return state.nodeID;
    },

    getNeoSelectedNetNodes(state, getter) {
      const currentNetFlag = state.netFlag;
      const lengthOfMainNodes = getter.getMainNodesLength;
      const neoNodes = state.neoNodes.filter(
        (node) => node.net === currentNetFlag
      );

      if (state.netFlag === netFlags.MainNetFlag) return neoNodes;
      return neoNodes.map((node) => ({
        ...node,
        id: node.id - lengthOfMainNodes,
      }));
    },
  },

  strict: process.env.NODE_ENV !== "production",
});
