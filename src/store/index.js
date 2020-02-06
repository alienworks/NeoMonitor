import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// TODO: Move it to constants
const netFlags = {
  MainNetFlag: 'MainNet',
  TestNetFlag: "TestNet"
};

export const store = new Vuex.Store({
  state: {
    nodeID: 0,
    statisticsX: [],
    statisticsY: [],
    neoNodes: [],
    netFlag: netFlags.MainNetFlag
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
    setNeoNodes(state, payload) {
      state.neoNodes = payload;
    },
    setNetFlag(state, payload) {
      state.netFlag = payload
    }
  },

  actions: {
    setNodeIDAction({ commit }, payload) {
      commit("setNodeID", payload);
    },
    setStatisticsX({ commit }, payload) {
      commit("setStatisticsX", payload);
    },
    setStatisticsY({ commit }, payload) {
      commit("setStatisticsY", payload);
    },
    setNeoNodesAction({ commit }, payload) {
      commit("setNeoNodes", payload);
    },
    setNeoSelectedNetNodesAction({ commit }, payload) {
      commit("setNeoSelectedNetNodes", payload);
    }
  },

  getters: {
    getNodeID(state) {
      return state.nodeID;
    },
    getStatisticsX(state) {
      return state.statisticsX;
    },
    getStatisticsY(state) {
      return state.statisticsY;
    },
    getNeoNodes(state) {
      return state.neoNodes;
    },
    getNetFlag(state) {
      return state.netFlag;
    },
    getMainNodesLength(state) {
      return state.neoNodes.filter(node => node.net === netFlags.MainNetFlag).length;
    },
    getNeoSelectedNetNodes(state, getter) {
      const currentNetFlag =  state.netFlag;
      const lengthOfMainNodes = getter.getMainNodesLength;
      const neoNodes = state.neoNodes.filter(node => node.net === currentNetFlag);

      if (state.netFlag === netFlags.MainNetFlag) return neoNodes;
      return neoNodes.map(node => ({
        ...node,
        id: node.id - lengthOfMainNodes
      }));
    }
  },

  strict: process.env.NODE_ENV !== 'production'
});
