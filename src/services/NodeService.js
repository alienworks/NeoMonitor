import axios from "axios";

export default {
  getNodeInfo(nodeID) {
    return axios.get(process.env.VUE_APP_RESTAPI + nodeID);
  }
};
