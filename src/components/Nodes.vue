<template>
  <div>
    <a-row type="flex" justify="end" class="search-wrapper">
      <a-col class="summary-block" :span="3">
        <!-- <a-statistic title="Latest block" :value="maxBlock"></a-statistic> -->
        <p>Latest block</p>
        <h6>{{ maxBlock }}</h6>
      </a-col>

      <a-col class="summary-block" :span="3">
        <p>Average latency</p>
        <h6>{{ averageLatency }}</h6>
      </a-col>

      <a-col class="search-wrapper" :span="3" :offset="10">
        <a-input-search v-model="filterValue" placeholder="filter by name" style="width: 200px" />
      </a-col>
    </a-row>

    <a-table
      :columns="columns"
      :data-source="filteredNodes"
      :pagination="false"
      :loading="isFetchingProgress"
      :rowClassName="nodeColor"
      size="small"
    >
      <div
        slot="height"
        slot-scope="h"
      >{{ `${h} ${h === maxBlock || h === 0 ? '' : `(-${maxBlock - h})`}` }}</div>

      <router-link to="/rawmempool" slot="pool" slot-scope="p, record" class="table-link">
        <span @click="setNodeID(record.id)">
          <a-button type="default" size="small">
            <a-icon type="unordered-list" style="position:relative;top:-2.75px;" />
            {{"View"}}
          </a-button>
          {{ p }}
        </span>
      </router-link>

      <router-link to="/nodeinfo" slot="exception" slot-scope="e, record" class="table-link">
        <span @click="setNodeID(record.id)">
          <a-button type="default" size="small">
            <a-icon type="dot-chart" style="position:relative;top:-2.75px;" />
            {{"View"}}
          </a-button>
          {{ e }}
        </span>
      </router-link>
    </a-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { sorter, debounce } from "@/utils";
import {
  pipe,
  max,
  prop,
  map,
  reduce,
  filter,
  identity,
  converge,
  sum,
  divide,
  length,
  equals
} from "ramda";

export default {
  name: "Nodes",
  data() {
    return {
      columns: [
        {
          key: "id",
          dataIndex: "id",
          title: "ID"
        },
        {
          key: "url",
          dataIndex: "url",
          title: "Name"
        },
        {
          key: "height",
          dataIndex: "height",
          title: "Current Height",
          scopedSlots: { customRender: "height" }
        },
        {
          key: "version",
          dataIndex: "version",
          title: "Version"
        },
        {
          key: "latency",
          dataIndex: "latency",
          title: "Latency"
        },
        {
          key: "peers",
          dataIndex: "peers",
          title: "Peers"
        },
        {
          key: "memoryPool",
          dataIndex: "memoryPool",
          title: "MemPool",
          scopedSlots: { customRender: "pool" }
        },
        {
          key: "exceptionCount",
          dataIndex: "exceptionCount",
          title: "Exceptions",
          scopedSlots: { customRender: "exception" }
        }
      ].map(column => ({
        ...column,
        sorter: sorter(column.dataIndex),
        sortDirections: ["descend", "ascend"]
      })),
      filterValue: null,
      filter: "",
      filterBouncer: debounce(val => (this.filter = val), 300)
    };
  },
  mounted() {
    this.$store.dispatch("getNodes");
  },
  computed: {
    ...mapGetters({
      nodeID: "nodeID",
      refreshNodes: "nodes",
      isFetchingProgress: "isFetchingProgress",
      flag: "flag"
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
      return pipe(map(prop("height")), reduce(max, 0))(this.filteredNodes);
    },
    averageLatency() {
      return pipe(
        map(prop("latency")),
        filter(identity),
        converge(divide, [sum, length]),
        Math.floor
      )(this.filteredNodes);
    }
  },
  methods: {
    filterNode(node, filter) {
      return node.url.toLowerCase().includes(filter.toLowerCase());
    },
    setNodeID(id) {
      this.$store.commit("setNodeID", id);
    },
    nodeColor(record) {
      return record.latency === -1
        ? "unresponsive"
        : this.maxBlock - record.height < 20
        ? "responsive"
        : "delayed";
    }
  },
  watch: {
    filterValue(val) {
      if (!val) return (this.filter = "");
      return this.filterBouncer(val);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.has-search .form-control {
  padding-left: 2.375rem;
}

.has-search .form-control-feedback {
  position: absolute;
  z-index: 2;
  display: block;
  width: 2.375rem;
  height: 2.375rem;
  line-height: 2.375rem;
  text-align: center;
  pointer-events: none;
  color: #777;
}

.search-wrapper {
  margin: 8px 20px 8px 0;
}

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

.table-link {
  color: darkblue;
}
</style>
