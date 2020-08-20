import Vue from "vue"
import Vuex from "vuex"
import NodeService from "@/services/NodeService"
import { netFlag } from "@/constants"
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production'

function defaultState() {

  const maxHeight = {}
  maxHeight[netFlag.MAIN] = 0
  maxHeight[netFlag.TEST] = 0

  return {
    flag: netFlag.MAIN,
    maxHeight,
    nodeID: 0,
    nodes: [],
    nodeInfo: [],
    pools: [],
    statExceptionTime: [],
    statInterval: [],
    matrixEntities: [],
    isFetchingProgress: false,
  }
}

const getters = {
  flag: (state) => state.flag,
  maxHeight: (state) => state.maxHeight,
  nodes: (state) => state.nodes,
  nodeInfo: (state) => state.nodeInfo,
  mainNodesLength: (state) =>
    state.nodes.filter((node) => node.net === netFlag.MAIN).length,
  nodeID(state, getter) {
    if (state.flag === netFlag.TEST)
      return state.nodeID + getter.mainNodesLength;
    return state.nodeID;
  },
  getNodeFromId: (state) => id => state.nodes.filter(node => node.id === id),
  getSelectedNodes(state, getter) {
    const currentNetFlag = state.flag;
    const lengthOfMainNodes = getter.getMainNodesLength;
    const nodes = state.nodes.filter((node) => node.net === currentNetFlag);

    if (state.flag === netFlag.MAIN) return nodes;
    return nodes.map((node) => ({
      ...node,
      id: node.id - lengthOfMainNodes,
    }));
  },
  isFetchingProgress: (state) => state.isFetchingProgress,
  statExceptionTime: (state) => state.statExceptionTime,
  statInterval: (state) => state.statInterval,
  pools: (state) => state.pools,
  matrixEntities: (state) => state.matrixEntities,
}

const mutations = {
  setFlag(state, payload) {
    state.flag = payload;
  },
  setMaxHeight(state, payload) {
    if (payload.height != undefined) state.maxHeight[payload.net] = payload.height
  },
  setNodeID(state, payload) {
    state.nodeID = payload;
  },
  setNodes(state, payload) {
    state.nodes = payload instanceof Array ? payload : payload.data;
  },
  setNodeInfo(state, payload) {
    state.nodeInfo = payload instanceof Array ? payload : payload.data;
  },
  setStatExceptionTime(state, payload) {
    state.statExceptionTime = payload;
  },
  setStatInterval(state, payload) {
    state.statInterval = payload;
  },
  setIsFetchingProgress(state, progress) {
    state.isFetchingProgress = progress;
  },
  setPool(state, pools) {
    state.pools = pools instanceof Array ? pools : pools.data;
  },
  setMatrixEntities(state, entities) {
    state.matrixEntities =
      entities instanceof Array ? entities : entities.data;
  },
}

const actions = {
  async updateMaxHeight({ state, commit }, init = false) {
    if (init) {
      const mainHeight = await NodeService.fetchLatestHeight(netFlag.MAIN);
      const testHeight = await NodeService.fetchLatestHeight(netFlag.TEST);
      commit('setMaxHeight', { net: netFlag.MAIN, height: mainHeight })
      commit('setMaxHeight', { net: netFlag.TEST, height: testHeight })
    } else {
      const flag = state.flag
      const maxHeight = state.maxHeight
      const latestHeight = await NodeService.fetchLatestHeight(flag);
      if (latestHeight > maxHeight[flag]) commit('setMaxHeight', { net: flag, height: latestHeight })
    }
  },
  async getNodes({ commit }) {
    const response = await NodeService.getNodesInfo();
    const nodes = response.status === 200 ? response.data : [];
    commit("setNodes", nodes);
  },
  async getNodeInfo({ commit, getters }) {
    const response = await NodeService.getNodeInfo(getters.nodeID);
    let nodeInfo = response.status === 200 ? response.data : [];
    nodeInfo = nodeInfo instanceof Array ? nodeInfo : nodeInfo.data;
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
  async getPool({ commit, getters }) {
    const response = await NodeService.getMemPoolDetail(getters.nodeID);
    const pools = response.status === 200 ? response.data : [];
    commit("setPool", pools);
  },
  async getMatrixEntities({ commit }) {
    const response = await NodeService.getMatrixItems();
    const entities = response.status === 200 ? response.data : [];
    commit("setMatrixEntities", entities);
  },

}


const store = new Vuex.Store({
  state: defaultState(),
  getters,
  mutations,
  actions,
  modules: {

  },
  strict: debug,
  // plugins: debug ? [createLogger({})] : []
  plugins: [
    createPersistedState({
      storage: window.sessionStorage
  })
  ]
})

export default store
