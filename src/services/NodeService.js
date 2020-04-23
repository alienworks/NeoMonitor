import axios from "axios";
import { combine } from "@/utils";

const baseNodesUrl = process.env.VUE_APP_RESTAPI;
const rawMempoolUrl = combine(baseNodesUrl, 'rawmempool');

export default {
  getNodeInfo(nodeID) {
    return axios.get(combine(baseNodesUrl, nodeID));
  },
  getNodesInfo() {
    return axios.get(baseNodesUrl);
  },
  getRawMempool(nodeID) {
    return axios.get(combine(rawMempoolUrl, nodeID));
  }
};
