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
    matrixEntities: [],
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
    },
    setMatrixEntities(state, entities) {
      state.matrixEntities = entities
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
    async setNeoNodesAction({ commit }) {
      const response = await NodeService.getNodesInfo();
      const nodes = response.status === 200 ? response.data : [];
      commit("setNeoNodes", nodes);
    },
    async getMatrixEntities({ commit }) {
      const response = await NodeService.getMatrixItems();
      const entities = response.status === 200 ? response.data : [];
      commit("setMatrixEntities", entities);
    },
    setNeoSelectedNetNodesAction({ commit }, payload) {
      commit("setNeoSelectedNetNodes", payload);
    }
  },

  getters: {
    getNodeID: state => state.nodeID,
    getStatisticsX: state => state.statisticsX,
    getStatisticsY: state => state.statisticsY,
    getNeoNodes: state => state.neoNodes,
    getNetFlag: state => state.netFlag,
    getMainNodesLength: state => state.neoNodes.filter(node => node.net === netFlags.MainNetFlag).length,
    matrixEntities: state => state.matrixEntities,
    
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
