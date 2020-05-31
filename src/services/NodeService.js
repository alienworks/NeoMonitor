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

const baseUrl = process.env.VUE_APP_RESTAPI;
// const mockUrl = "/mocks";

// api through api/nodes
const nodesUrl = combine(baseUrl, "nodes");
// api through api/nodes/rawmempool
const rawMempoolUrl = combine(nodesUrl, "rawmempool");
// api/matrix
const matrixUrl = combine(baseUrl, 'matrix');
// api/analysis
const analysisUrl = combine(baseUrl, "analysis");

export default {
  getNodeInfo(nodeID) {
    return axios.get(combine(nodesUrl, nodeID));
  },
  getNodesInfo() {
    return axios.get(nodesUrl);
  },
  getRawMempool(nodeID) {
    return axios.get(combine(rawMempoolUrl, nodeID));
  },
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
