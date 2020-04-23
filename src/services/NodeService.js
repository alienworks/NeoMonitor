import axios from "axios";
import { combine } from "@/utils";

const baseUrl = process.env.VUE_APP_RESTAPI;

const nodesUrl = combine(baseUrl, 'nodes');
const rawMempoolUrl = combine(nodesUrl, 'rawmempool');

const matrixUrl = combine(baseUrl, 'matrix');


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
  }
};
