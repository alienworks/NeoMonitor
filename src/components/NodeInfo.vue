<template>
  <div class="contanier mt-3 col-12">
    <a-row type="flex" justify="end" class="search-wrapper">
      <a-button type="default" @click="gotoStatistics()" style="margin-right:12px;">
        <a-icon type="dot-chart" style="position:relative;top:-2.75px;" />View Charts
      </a-button>
      <a-input-search v-model="filter" placeholder="filter by nodes or height" style="width: 200px" />
    </a-row>

    <a-spin :spinning="isFetchingProgress">
      <a-table v-if="myNodeInfo" :columns="fields" :data-source="myNodeInfo" :pagination="false"
        :scroll="{ x: 'max-content', y: 'max-content' }" size="small">
        <a :href="`//neoscan.io/block/${h}`" target="_blank" slot="height" slot-scope="h">{{ h }}</a>
        {{
        t
        }}
      </a-table>
      <a-pagination style="margin-top:12px;" v-if="nodeInfo && nodeInfo.length>0" @change="changePage" v-model="current"
        :total="nodeInfo.length" pagesize.sync="10" />
    </a-spin>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { sorter, debounce } from "@/utils";

export default {
  name: "NodeInfo",
  data() {
    return {
      fields: [
        {
          key: "id",
          dataIndex: "id",
          title: "ID",
          sorter: sorter("id")
        },
        {
          key: "nodeName",
          dataIndex: "nodeName",
          title: "Nodes",
          sorter: sorter("nodeName")
        },
        {
          key: "exceptionHeight",
          dataIndex: "exceptionHeight",
          title: "Height",
          sorter: sorter("exceptionHeight"),
          scopedSlots: { customRender: "height" }
        },
        {
          key: "exceptionTime",
          dataIndex: "exceptionTime",
          title: "Generate Time(GMT +8)",
          sorter: sorter("exceptionTime"),
          scopedSlots: { customRender: "time" }
        },
        {
          key: "intervals",
          dataIndex: "intervals",
          title: "Interval(s)",
          sorter: sorter("intervals")
        }
      ],
      filter: null,
      filterBouncer: debounce(val => this.filterTable(val)),
      current: 1,
      myNodeInfo: []
    };
  },
  mounted() {
    this.$store.dispatch("getNodeInfo");
  },
  computed: {
    ...mapGetters(["nodeInfo", "isFetchingProgress"])
  },
  methods: {
    gotoStatistics() {
      this.$router.push({
        path: "/statistics"
      });
    },
    changePage(page, size) {
      this.myNodeInfo = this.nodeInfo.slice((page - 1) * size, page * size);
    }
  },
  watch: {
    nodeInfo(val) {
      if (val && val.length >= 10) {
        this.myNodeInfo = val.slice(0, 10);
      } else {
        this.myNodeInfo = val.slice(0, val.length);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
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
.ant-table-body {
  overflow: auto !important;
}
</style>
