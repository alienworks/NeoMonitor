import axios from "axios";
import { combine } from "@/utils";

const baseUrl = process.env.VUE_APP_RESTAPI;

const nodesUrl = combine(baseUrl, 'nodes');
const rawMempoolUrl = combine(nodesUrl, 'rawmempool');

const matrixUrl = combine(baseUrl, 'matrix');

const analysisUrl = combine(baseUrl, 'analysis');


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
    return axios.get(matrixUrl)
  },
  registerAnalysis() {
    return axios.get(analysisUrl, 'register');
  },
  getCurrentDailyVisitTimes() {
    return axios.get(combine(analysisUrl, 'currentDailyVisitTimes'));
  },
  getTotalDailyVisitTimes() {
    return axios.get(combine(analysisUrl, 'totalDailyVisitTimes'));
  },
  getTotalDailyIpCount() {
    return axios.get(combine(analysisUrl, 'totalDailyIpCount'));
  },
  getCurrentHourlyVisitTimes() {
    return axios.get(combine(analysisUrl, 'currentHourlyVisitTimes'));
  },
  getTotalHourlyVisitTimes() {
    return axios.get(combine(analysisUrl, 'totalHourlyVisitTimes'));
  },
  getTotalHourlyIpCount() {
    return axios.get(combine(analysisUrl, 'totalHourlyIpCount'));
  }
};
