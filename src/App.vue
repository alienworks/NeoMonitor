<template>
  <div id="app" v-if="showPage">
    <n-header></n-header>

    <router-view />
  </div>
</template>


<script>
import * as am4core from "@amcharts/amcharts4/core";
import NHeader from '@/layouts/Header';
import { mapGetters } from 'vuex';
import { HubConnectionBuilder, LogLevel } from "@aspnet/signalr";
import NodeService from "@/services/NodeService";

// Connection instance for signalr. Exposed for other to use.
export let connection = null;

export default {
  name: "App",
  components: { NHeader },
  watch: {
    $route(current, old) {
      if (old.name === "Main") {
        // Clear
        am4core.disposeAllCharts();
      }
    },
    
    async nodeID(current) {
      current && await connection.send("SubscribeRawMemPoolItemsInfo", current);
    }
  },
  created() {
    this.$store.dispatch("getNodes");

    this.setUpSignalR();
    this.registerAnalysis();
  },
  methods: {
    async setUpSignalR() {
      // Connect to the hub
      connection = new HubConnectionBuilder()
        .withUrl(process.env.VUE_APP_SOCKETAPI)
        .configureLogging(LogLevel.Information)
        .build();

      // On Receiving Nodes.
      connection.on("UpdateNodes", async data => {
        this.$store.commit("setNodes", data);           
        await connection.send("SubscribeRawMemPoolItemsInfo", this.nodeID);
      });

      // On Receiving RawMemPools
      connection.on("UpdateRawMemPoolSizeInfo", rawMemPools => {
        this.$store.commit("setNodes", this.mapMemPoolsToNodes(rawMemPools));
      });

      await connection.start().catch(function() {
        setTimeout(function() {
          connection.start();
        }, 5000);
      });

      // Activate subscribe method.
      await connection.send("SubscribeNodesInfo");
      await connection.send("SubscribeRawMemPoolSizeInfo");
    },
    async registerAnalysis() {
      await NodeService.registerAnalysis();
    },
    mapMemPoolsToNodes(rawMemPools) {
      const nodes = this.nodes;
      const updatedNodes = [];

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const rawMemPool = rawMemPools.find(pool => pool.id === node.id);
        
        if (rawMemPool) {
          updatedNodes.push({
            ...node, 
            memoryPool: rawMemPool.memoryPool || 0
          });
        }
        else {
          updatedNodes.push(node);
        }
      }

      return updatedNodes;
    }
  },
  computed: {
    ...mapGetters(['nodeID', 'nodes']),
    showPage() {
      return this.nodes.length !== 0
    }
  }
};
</script>

<style lang="scss">
body {
  overflow: auto;
  a {
    color: royalblue;
  }
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
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
</style>
