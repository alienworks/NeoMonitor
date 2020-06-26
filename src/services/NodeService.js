import axios from "axios";
import { combine } from "@/utils";
import { store } from "@/store";

axios.interceptors.request.use((config) => {
  store.commit("setIsFetchingProgress", true);
  return config;
});

axios.interceptors.response.use((data) => {
  store.commit("setIsFetchingProgress", false);
  return data;
});

const mockMode = false;

let nodesUrl, nodeUrl, memPoolUrl, memPoolDetailUrl, matrixUrl, analysisUrl;

if (mockMode) {
  nodesUrl = '/mocks/api_nodes';
  nodeUrl = '/mocks/api_nodes_nodeId';
  memPoolUrl = '/mocks/api_nodes_rawmempool';
  memPoolDetailUrl = '/mocks/api_nodes_rawmempool_nodeId';
  matrixUrl = '/mocks/api_matrix';
  analysisUrl = '/mocks/api_analysis';
} else {
  const baseUrl = process.env.VUE_APP_RESTAPI;
  //http://*.*.*.*/api/nodes
  nodesUrl = combine(baseUrl, "nodes");
  //http://*.*.*.*/api/nodes/rawmempool
  memPoolUrl = combine(nodesUrl, "rawmempool");
  //http://*.*.*.*/api/matrix
  matrixUrl = combine(baseUrl, 'matrix');
  //http://*.*.*.*/api/analysis
  analysisUrl = combine(baseUrl, "analysis");
}

export default {
  // api/nodes
  getNodesInfo() {
    return axios.get(nodesUrl);
  },
  // api/nodes/{id}
  getNodeInfo(nodeID) {
    if (mockMode) {
      return axios.get(nodeUrl);
    } else {
      return axios.get(combine(nodesUrl, nodeID));
    }
  },
  // api/nodes/rawmempool/
  getMemPoolList() {
    return axios.get(memPoolUrl);
  },
  // api/nodes/rawmempool/{nodeId}
  getMemPoolDetail(nodeID) {
    if (mockMode) {
      return axios.get(memPoolDetailUrl);
    } else {
      return axios.get(combine(memPoolUrl, nodeID));
    }
  },
  // api/matrix
  getMatrixItems() {
    return axios.get(matrixUrl);
    // return process.env.NODE_ENV === 'production' 
    //   ? axios.get(matrixUrl)
    //   : axios.get(combine(mockUrl, "matrix.json"))
  },
  registerAnalysis() {
    return axios.get(analysisUrl, "register");
  },
  getCurrentDailyVisitTimes() {
    return axios.get(combine(analysisUrl, "currentDailyVisitTimes"));
  },
  getTotalDailyVisitTimes() {
    return axios.get(combine(analysisUrl, "totalDailyVisitTimes"));
  },
  getTotalDailyIpCount() {
    return axios.get(combine(analysisUrl, "totalDailyIpCount"));
  },
  getCurrentHourlyVisitTimes() {
    return axios.get(combine(analysisUrl, "currentHourlyVisitTimes"));
  },
  getTotalHourlyVisitTimes() {
    return axios.get(combine(analysisUrl, "totalHourlyVisitTimes"));
  },
  getTotalHourlyIpCount() {
    return axios.get(combine(analysisUrl, "totalHourlyIpCount"));
  },
};
