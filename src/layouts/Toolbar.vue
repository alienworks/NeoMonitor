<template>
  <header class="toolbar">
    <a-row>
      <a-col :span="24" class="menu-row">
        <a-col class="summary-block" :span="3">
          <!-- <a-statistic title="Latest block" :value="maxBlock"></a-statistic> -->
          <p>Latest block</p>
          <h6>{{ maxBlock }}</h6>
        </a-col>
        <a-col class="summary-block" :span="2">
          <a-avatar style="background-color: #0096ea;">{{$store.state.timerCount}}s</a-avatar>
        </a-col>
      </a-col>
    </a-row>
  </header>
</template>

<script>
import { mapGetters } from "vuex";
import { pipe, max, prop, map, reduce, filter, equals } from "ramda";
export default {
  name: "Toolbar",
  data() {
    return {
      current: ["home"],
      timer: null
    };
  },
  computed: {
    ...mapGetters({
      flag: "flag",
      refreshNodes: "nodes"
    }),
    nodes() {
      const { refreshNodes } = this;

      if (refreshNodes.length === 0) return [];

      const result = refreshNodes.map(node => {
        if (!node.latency) {
          return {
            ...node,
            key: node.id,
            height: -1,
            version: "-",
            latency: -1,
            peers: -1,
            memoryPool: -1
          };
        }

        return node;
      });

      return result;
    },
    filteredNodes() {
      const { filter: hasFilter, flag, nodes } = this;

      const filteredNodes = filter(pipe(prop("net"), equals(flag)), nodes);

      if (!hasFilter) return filteredNodes || [];

      return filteredNodes.filter(node => this.filterNode(node, hasFilter));
    },
    maxBlock() {
      return pipe(map(prop("height")), reduce(max, 0))(this.filteredNodes) != 0
        ? pipe(map(prop("height")), reduce(max, 0))(this.filteredNodes)
        : "-";
    }
  },
  methods: {
    onSetFlagNet(flag) {
      this.$store.commit("setFlag", flag);
    },
    onLogoClick() {
      this.current = ["home"];
    }
  },
  activated() {
    let self = this;
    self.timer = setInterval(() => {
      self.$store.commit("setTimerCount", self.$store.state.timerCount + 1);
    }, 1000);
  },
  destroyed() {
    if (self.timer) {
      clearInterval(self.timer);
    }
  },
  deactivated() {
    if (self.timer) {
      clearInterval(self.timer);
    }
  }
};
</script>

<style lang="scss">
.summary-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  h6,
  p {
    margin: 0;
  }
}
.toolbar {
  position: relative;
  z-index: 10;
  max-width: 100%;
  box-shadow: 0 2px 8px rgba(240, 241, 242, 65);

  .logo {
    width: 120px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
  }

  .menu-row {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 0;

    > * {
      flex: none;
      margin: 0 16px 0 0;

      &:last-child {
        margin-right: 40px;
      }
    }
  }
}
</style>
