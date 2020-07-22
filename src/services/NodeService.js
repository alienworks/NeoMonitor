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

let mockMode = process.env.VUE_APP_MOCK_MODE;

let nodesUrl, memPoolUrl, matrixUrl, analysisUrl;
// const baseUrl = process.env.VUE_MOCK_RESTAPI

const baseUrl = !mockMode
  ? process.env.VUE_APP_RESTAPI
  : process.env.VUE_APP_MOCK_RESTAPI;

if (mockMode) {
  nodesUrl = baseUrl + "-nodes";
  memPoolUrl = nodesUrl + "-rawmempool";
  matrixUrl = baseUrl + "-matrix";
} else {
  //http://*.*.*.*/api/nodes
  nodesUrl = combine(baseUrl, "nodes");
  //http://*.*.*.*/api/nodes/rawmempool
  memPoolUrl = combine(nodesUrl, "rawmempool");
  //http://*.*.*.*/api/matrix
  matrixUrl = combine(baseUrl, "matrix");
  //http://*.*.*.*/api/analysis
  analysisUrl = combine(baseUrl, "analysis");
}

export default {
  //rpc nodes
  async fetchRPCNodes() {
    let filtered = [];
    let nodes = store.state.nodes;
    let flag = store.state.flag;
    nodes = nodes.filter((item) => {
      if (item.net === flag) {
        return true;
      } else {
        return false;
      }
    });
    for (let i = 0; i < nodes.length; i++) {
      let currNodeUrl = nodes[i].url;
      if (currNodeUrl.indexOf("ngd") != -1) {
        const request = {
          jsonrpc: "2.0",
          method: "getblockcount",
          id: 3,
          params: [],
        };
        filtered.push(axios.post(currNodeUrl, JSON.stringify(request)));
      }
    }
    Promise.all(filtered).then((resps) => {
      if (resps.length > 0) {
        let maxResult = resps[0].data.result;
        for (let i = 0; i < resps.length; i++) {
          let currResult = resps[i].data.result;
          if (currResult > maxResult) {
            maxResult = currResult;
          }
        }
        store.commit("setMaxHeight", maxResult);
      }
    });
  },
  // api/nodes
  async getNodesInfo() {
    return await axios.get(nodesUrl);
  },
  // api/nodes/{id}
  getNodeInfo(nodeID) {
    if (mockMode) {
      return axios.get(`${nodesUrl}-${nodeID}`);
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
      return axios.get(`${memPoolUrl}-${nodeID}`);
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
