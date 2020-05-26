<template>
  <div>
    <!-- <div class="contanier mt-3 col-12">
      <div class="form-group has-search mb-2 col-3 float-right">
        <span class="fa fa-search form-control-feedback"></span>
        <input
          type="text"
          v-model="filter"
          placeholder="Filter by Name"
          icon="search"
          class="form-control"
        />
      </div>
      <b-table
        responsive
        striped
        hover
        bordered
        :items="nodes"
        :fields="fields"
        :filter="filter"
        :filter-function="filterTable"
        class="node-table"
      >
        <template v-slot:cell(memoryPool)="data">
          <router-link to="/rawmempool">
            <span v-on:click="setNodeID(data.item.id)">{{ data.value }}</span>
          </router-link>
        </template>
        <template v-slot:cell(exceptionCount)="data">
          <router-link to="/nodeinfo">
            <span v-on:click="setNodeID(data.item.id)">{{ data.value }}</span>
          </router-link>
        </template>
      </b-table>
    </div> -->
    <a-row type="flex" justify="end" class="search-wrapper">
      <a-input-search
        v-model="filterValue"
        placeholder="filter by name"
        style="width: 200px"
      />
    </a-row>

    <a-table
      :columns="columns"
      :data-source="filter ? filteredNodes : nodes"
      :pagination="false"
      size="small"
    >
      <router-link to="/rawmempool" slot="pool" slot-scope="text, record">
        <span @click="setNodeID(record.id)">{{ text }}</span>
      </router-link>

      <router-link to="/nodeinfo" slot="exception" slot-scope="text, record">
        <span @click="setNodeID(record.id)">{{ text }}</span>
      </router-link>
    </a-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { sorter, debounce } from "@/utils";

export default {
  name: "Nodes",
  data() {
    return {
      columns: [
        {
          key: "id",
          dataIndex: "id",
          title: "ID",
        },
        {
          key: "url",
          dataIndex: "url",
          title: "Name",
        },
        {
          key: "height",
          dataIndex: "height",
          title: "Current Height",
        },
        {
          key: "version",
          dataIndex: "version",
          title: "Version",
        },
        {
          key: "latency",
          dataIndex: "latency",
          title: "Latency",
        },
        {
          key: "peers",
          dataIndex: "peers",
          title: "Peers",
        },
        {
          key: "memoryPool",
          dataIndex: "memoryPool",
          title: "MemPool",
          scopedSlots: { customRender: "pool" },
        },
        {
          key: "exceptionCount",
          dataIndex: "exceptionCount",
          title: "Exceptions",
          scopedSlots: { customRender: "exception" },
        },
      ].map((column) => ({
        ...column,
        sorter: sorter(column.dataIndex),
        sortDirections: ["descend", "ascend"],
      })),
      filterValue: null,
      filter: '',
      filterBouncer: debounce((val) => this.filter = val, 300),
    };
  },
  mounted() {
    this.$store.dispatch("getNodes");
  },
  computed: {
    ...mapGetters({
      nodeID: "nodeID",
      refreshNodes: "nodes",
    }),
    nodes() {
      const { refreshNodes } = this;

      if (refreshNodes.length === 0) return [];

      return refreshNodes.map((node) => {
        const newNode = { ...node, rowKey: node.id };
        if (node.latency === -1) {
          newNode.height = -1;
          newNode.version = "-";
          newNode.latency = -1;
          newNode.peers = -1;
          newNode.memoryPool = -1;
        }
        return newNode;
      });
    },
    filteredNodes() {
      const { filter } = this;
      return this.nodes.slice().filter((node) => this.filterNode(node, filter));
    },
  },
  methods: {
    filterNode(node, filter) {
      return node.url.toLowerCase().includes(filter.toLowerCase());
    },
    setNodeID(id) {
      this.$store.commit("setNodeID", id);
    },
  },
  watch: {
    filterValue(val) {
      if (!val) return this.filter = '';
      return this.filterBouncer(val);
    },
  },
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
  margin: 8px;
}
</style>
