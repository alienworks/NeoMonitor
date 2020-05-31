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

// TODO: Add mocks data
// const mockUrl = "/mocks";

const baseUrl = process.env.VUE_APP_RESTAPI;

//http://*.*.*.*/api/nodes
const nodesUrl = combine(baseUrl, "nodes");
//http://*.*.*.*/api/nodes/rawmempool
const memPoolUrl = combine(nodesUrl, "rawmempool");
//http://*.*.*.*/api/matrix
const matrixUrl = combine(baseUrl, 'matrix');
//http://*.*.*.*/api/analysis
const analysisUrl = combine(baseUrl, "analysis");

export default {
  // api/nodes
  getNodesInfo() {
    return axios.get(nodesUrl);
  },
  // api/nodes/{id}
  getNodeInfo(nodeID) {
    return axios.get(combine(nodesUrl, nodeID));
  },
  // api/nodes/rawmempool/{nodeId}
  getMemPool(nodeID) {
    return axios.get(combine(memPoolUrl, nodeID));
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
