import Vue from "vue";
import Vuex from "vuex";
import NodeService from "@/services/NodeService";
import { mainNetFlag } from "@/constants";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    nodeID: 0,
    statExceptionTime: [],
    statInterval: [],
    nodes: [],
    nodeInfo: [],
    matrixEntities: [],
    pools: [],
    flag: mainNetFlag,
    isFetchingProgress: false,
    timerCount: 0,
  },

  mutations: {
    setTimerCount(state, count) {
      state.timerCount = count;
    },
    setNodeID(state, payload) {
      state.nodeID = payload;
    },
    setStatExceptionTime(state, payload) {
      state.statExceptionTime = payload;
    },
    setStatInterval(state, payload) {
      state.statInterval = payload;
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
    setPool(state, pools) {
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
    async getPool({ commit, getters }) {
      const response = await NodeService.getMemPoolDetail(getters.nodeID);
      const pools = response.status === 200 ? response.data : [];
      commit("setPool", pools);
    },
    async getNodeInfo({ commit, getters }) {
      const response = await NodeService.getNodeInfo(getters.nodeID);
      const nodeInfo = response.status === 200 ? response.data : [];
      commit("setNodeInfo", nodeInfo);

      const arrExceptionTime = [];
      const arrIntervals = [];

      nodeInfo.forEach((item) => {
        arrExceptionTime.push(item.exceptionTime);
        arrIntervals.push(item.intervals);
      });

      commit("setStatExceptionTime", arrExceptionTime);
      commit("setStatInterval", arrIntervals);
    },
  },

  getters: {
    statExceptionTime: (state) => state.statExceptionTime,
    statInterval: (state) => state.statInterval,
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
      const nodes = state.nodes.filter((node) => node.net === currentNetFlag);

      if (state.flag === mainNetFlag) return nodes;
      return nodes.map((node) => ({
        ...node,
        id: node.id - lengthOfMainNodes,
      }));
    },
  },

  strict: process.env.NODE_ENV !== "production",
});
