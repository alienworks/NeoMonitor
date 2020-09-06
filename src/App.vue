<template>
  <div id="app" v-if="showPage">
    <n-header></n-header>

    <router-view />
    <n-footer id="footer"></n-footer>
  </div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core'
import NHeader from '@/layouts/Header'
import NFooter from '@/layouts/Footer'
import { mapGetters } from 'vuex'
import { HubConnectionBuilder, LogLevel, HubConnectionState } from '@microsoft/signalr'
import NodeService from '@/services/NodeService'
// import signalR from "@microsoft/signalr";
// import Vue from "vue";

// Connection instance for signalr. Exposed for other to use.
export let hubConnection = null

export default {
  name: 'App',
  components: {
    [NHeader.name]: NHeader,
    [NFooter.name]: NFooter,
  },
  watch: {
    $route(to, from) {
      if (from.name === 'Main') {
        // Clear
        am4core.disposeAllCharts()
      }
    },

    // eslint-disable-next-line no-unused-vars
    async nodeID(currentID, oldID) {
      // console.log('oldID', oldID)
      if (currentID && hubConnection.state === HubConnectionState.Connected) {
        // console.log('currentID', currentID)
        await hubConnection.send('SubscribeRawMemPoolItemsInfo', `${currentID}`)
      }
    },
  },
  created() {
    this.initData()
    this.setUpSignalR()
    // this.registerAnalysis();
  },
  methods: {
    async initData() {
      await this.$store.dispatch('getNodes')
      await this.updateHeight(true)
    },
    async updateHeight(init = false) {
      await this.$store.dispatch('updateMaxHeight', init)
      setTimeout(this.updateHeight, 15000)
    },
    async setUpSignalR() {
      console.log('NodeService.baseSocketUrl', NodeService.baseSocketUrl)

      // Connect to the hub
      hubConnection = new HubConnectionBuilder()
        .withUrl(NodeService.baseSocketUrl)
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build()

      // On receiving nodes
      hubConnection.on('UpdateNodes', async (data) => {
        // console.log('websocket UpdateNodes', data)
        this.$store.commit('setNodes', data)
      })

      // // On Receiving RawMemPools
      // hubConnection.on("UpdateRawMemPoolSizeInfo", rawMemPools => {
      //   this.$store.commit("setNodes", this.mapMemPoolsToNodes(rawMemPools));
      // });

      hubConnection.on('UpdateRawMemPoolItems', async (data) => {
        console.log('Websocket UpdateRawMemPoolItems', data)
        let testArray = []
        // for (let i = 0; i < 7; i++) {
        //   testArray.push(`hash ${i + 1}`)
        // }
        const pool = data.concat(testArray)
        this.$store.commit('setPool', pool)
      })

      hubConnection.onclose((error) => {
        console.assert(hubConnection.state === HubConnectionState.Disconnected, error)
        console.log('websocket onclose')
      })

      try {
        const isConnected = await this.websocketConnect()
        if (typeof isConnected === 'boolean' && isConnected) {
          console.log('hubConnection.state', hubConnection.state)
          // Activate subscribe method.
          await hubConnection.send('SubscribeNodesInfo')
        } else {
          console.log('isConnected', isConnected)
        }
      } catch (error) {
        console.log(error)
      }
    },
    async websocketConnect() {
      try {
        await hubConnection.start()
        return new Promise((resolve, reject) => {
          if (hubConnection.state === HubConnectionState.Connected) {
            console.log('websocket connected')
            resolve(true)
          } else {
            console.log('websocket fail to connect')
            reject(hubConnection.state)
          }
        })
      } catch (err) {
        console.log('websocketConnect error', err)
        setTimeout(() => this.start(), 5000)
      }
    },
    async registerAnalysis() {
      await NodeService.registerAnalysis()
    },
    mapMemPoolsToNodes(rawMemPools) {
      const nodes = this.nodes
      const updatedNodes = []

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        const rawMemPool = rawMemPools.find((pool) => pool.id === node.id)

        if (rawMemPool) {
          updatedNodes.push({
            ...node,
            memoryPool: rawMemPool.memoryPool || 0,
          })
        } else {
          updatedNodes.push(node)
        }
      }

      return updatedNodes
    },
  },
  computed: {
    ...mapGetters(['nodeID', 'nodes']),

    showPage() {
      return this.nodes.length !== 0
    },
  },
}
</script>

<style lang="scss">
#cnzz_stat_icon_1279108481 {
  position: relative;
  top: -35px;
  float: right;
  right: 20px;
}
body {
  overflow: auto;
  a {
    color: royalblue;
  }
}
#header {
  box-shadow: none !important;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  .nav-link {
    color: white !important;
  }

  .nav-link:hover {
    color: rgb(41, 245, 119) !important;
  }

  tr.ant-table-row {
    &.responsive {
      color: #1890ff;
    }

    &.delayed {
      color: #cf1322;
    }

    &.unresponsive {
      color: darkgray;
    }
  }
}
.ant-message .anticon {
  top: -2.5px !important;
}
.anticon {
  position: relative;
  top: -3.5px;
}
.ant-input-search-icon {
  top: 0px;
}
.customCountryRow {
}
</style>
