<template>
  <div id="app" v-if="showPage">
    <div>
      <b-navbar toggleable="lg" type="dark" variant="primary">
        <router-link to="/">
          <b-navbar-brand href="/" class="mx-5 px-5">NEO Nodes</b-navbar-brand>
        </router-link>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="mx-5">
            <router-link to="/">
              <b-nav-item href="/" class="px-2">Main</b-nav-item>
            </router-link>
            <router-link to="/nodes">
              <b-nav-item href="/nodes" class="px-2">Nodes</b-nav-item>
            </router-link>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto" v-if="showMenu">
            <b-nav-item-dropdown :text="netFlag" right>
              <b-dropdown-item @click="onSetFlagNet('MainNet')">MainNet</b-dropdown-item>
              <b-dropdown-item @click="onSetFlagNet('TestNet')">TestNet</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>

    <router-view />
  </div>
</template>


<script>
import * as signalR from "@aspnet/signalr";
import NodeService from "@/services/NodeService";
import * as am4core from "@amcharts/amcharts4/core";

// Connection instance for signalr.
let connection = null;

export default {
  name: "App",
  data() {
    return {
      netFlag: "MainNet",
      showMenu: true,
      showPage: false,
      lengthOfMainNode: 0
    };
  },
  watch: {
    $route(current, old) {
      this.showMenu =
        current.name === "Main" || current.name === "Nodes";

      if (old.name === "Main") {
        // Clear
        am4core.disposeAllCharts();
      }
    }
  },
  created: function() {
    this.getNodesInfo();

    // Connect to the hub
    connection = new signalR.HubConnectionBuilder()
            .withUrl(process.env.VUE_APP_SOCKETAPI)
            .build();

    connection.start().catch(function() {
      setTimeout(function() {
        connection.start();
      }, 5000);
    });

    // On Receiving Node data
    connection.on("Receive", data => {
      this.$store.dispatch("setNeoNodesAction", data);
      this.showPage = data.length !== 0;
    });

    // On Receiving RawMemPools
    connection.on("UpdateRawMemPoolInfos", data => {
      const rawMemPools = JSON.parse(data);
      const nodes = this.$store.getters.getNeoNodes;

      let updatedNodes = [];
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const rawMemPool = rawMemPools.find(p => p.Id === node.id);
        if (rawMemPool) updatedNodes.push({...node, memoryPool: rawMemPool.MemoryPool || 0});
        else updatedNodes.push(node);
      }

      this.$store.dispatch("setNeoNodesAction", updatedNodes)
    })
  },
  methods: {
    async getNodesInfo() {
      const response = await NodeService.getNodesInfo();
      const nodes = response.status === 200 ? response.data : null;
      this.$store.dispatch("setNeoNodesAction", nodes);
      this.showPage = nodes.length !== 0;
    },
    onSetFlagNet(flag) {
      this.netFlag = flag;
      this.$store.commit("setNetFlag", flag)
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
}
</style>
