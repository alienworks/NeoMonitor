import axios from 'axios'
import { combine } from '@/utils'
import store from '@/store'
axios.interceptors.request.use((config) => {
  store.commit('setIsFetchingProgress', true)
  return config
})

axios.interceptors.response.use((data) => {
  store.commit('setIsFetchingProgress', false)
  return data
})

let mockMode = JSON.parse(process.env.VUE_APP_MOCK_MODE)
let nodesUrl, memPoolUrl, matrixUrl, analysisUrl

const baseRestUrl = mockMode ? process.env.VUE_APP_MOCK_RESTAPI : process.env.VUE_APP_RESTAPI
const baseSocketUrl = mockMode ? process.env.VUE_APP_MOCK_SOCKETAPI : process.env.VUE_APP_SOCKETAPI

if (mockMode) {
  nodesUrl = baseRestUrl + '-nodes'
  memPoolUrl = nodesUrl + '-rawmempool'
  matrixUrl = baseRestUrl + '-matrix'
} else {
  //http://*.*.*.*/api/nodes
  nodesUrl = combine(baseRestUrl, 'nodes')
  //http://*.*.*.*/api/nodes/rawmempool
  memPoolUrl = combine(nodesUrl, 'rawmempool')
  //http://*.*.*.*/api/matrix
  matrixUrl = combine(baseRestUrl, 'matrix')
  //http://*.*.*.*/api/analysis
  analysisUrl = combine(baseRestUrl, 'analysis')
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
}

export default {
  mockMode,
  baseRestUrl,
  baseSocketUrl,

  //rpc nodes
  async fetchLatestHeight(flag) {
    let filtered = []
    let nodes = store.state.nodes
    if (nodes.length === 0) return
    nodes = nodes.filter((item) => {
      if (item.net === flag) {
        return true
      } else {
        return false
      }
    })
    shuffle(nodes)
    for (let i = 0; i < 5; i++) {
      let currNodeUrl = nodes[i].url
      if (currNodeUrl.indexOf('ngd') != -1) {
        const request = {
          jsonrpc: '2.0',
          method: 'getblockcount',
          id: 3,
          params: [],
        }
        filtered.push(
          fetch(currNodeUrl, {
            method: 'post',
            body: JSON.stringify(request),
          })
            .then((resp) => {
              return resp.json()
            })
            .catch((error) => {
              console.log(error)
            })
        )
      }
    }

    const resps = await Promise.all(filtered)
    let latestResult = -1
    let heights = []
    resps.forEach((resp) => {
      if (resp != undefined) heights.push(resp.result)
    })
    latestResult = Math.max(...heights)
    return new Promise((resolve, reject) => {
      latestResult === -1 ? reject('no response') : resolve(latestResult)
    })
  },
  // api/nodes
  async getNodesInfo() {
    return await axios.get(nodesUrl)
  },
  // api/nodes/{id}
  getNodeInfo(nodeID) {
    if (mockMode) {
      return axios.get(`${nodesUrl}-${nodeID}`)
    } else {
      return axios.get(combine(nodesUrl, nodeID))
    }
  },
  // api/nodes/rawmempool/
  getMemPoolList() {
    return axios.get(memPoolUrl)
  },
  // api/nodes/rawmempool/{nodeId}
  getMemPoolDetail(nodeID) {
    if (mockMode) {
      return axios.get(`${memPoolUrl}-${nodeID}`)
    } else {
      return axios.get(combine(memPoolUrl, nodeID))
    }
  },
  // api/matrix
  getMatrixItems() {
    return axios.get(matrixUrl)
    // return process.env.NODE_ENV === 'production'
    //   ? axios.get(matrixUrl)
    //   : axios.get(combine(mockUrl, "matrix.json"))
  },
  registerAnalysis() {
    return axios.get(analysisUrl, 'register')
  },
  getCurrentDailyVisitTimes() {
    return axios.get(combine(analysisUrl, 'currentDailyVisitTimes'))
  },
  getTotalDailyVisitTimes() {
    return axios.get(combine(analysisUrl, 'totalDailyVisitTimes'))
  },
  getTotalDailyIpCount() {
    return axios.get(combine(analysisUrl, 'totalDailyIpCount'))
  },
  getCurrentHourlyVisitTimes() {
    return axios.get(combine(analysisUrl, 'currentHourlyVisitTimes'))
  },
  getTotalHourlyVisitTimes() {
    return axios.get(combine(analysisUrl, 'totalHourlyVisitTimes'))
  },
  getTotalHourlyIpCount() {
    return axios.get(combine(analysisUrl, 'totalHourlyIpCount'))
  },
}
