<template>
  <div class="contanier mt-3 col-12">
    <!-- <div class="form-group has-search mb-2 col-3 float-right">
      <span class="fa fa-search form-control-feedback"></span>
      <input
        type="text"
        v-model="filter"
        placeholder="Filter by Nodes or Height"
        icon="search"
        class="form-control"
      />
    </div>
    <b-table
      responsive
      striped
      hover
      bordered
      :items="nodeInfo"
      :fields="fields"
      :filter="filter"
      :filter-function="filterTable"
    >
      <template v-slot:cell(exceptionHeight)="data">
        <a :href="`http://neoscan.io/block/${data.value}`" target="_blank">{{ data.value }}</a>
      </template>
      <template v-slot:cell(exceptionTime)="data">
        <router-link to="/statistics">
          <span>{{ data.value }}</span>
        </router-link>
      </template>
    </b-table> -->

    <a-row type="flex" justify="end" class="search-wrapper">
      <a-input-search
        v-model="filter"
        placeholder="filter by nodes or height"
        style="width: 200px"
      />
    </a-row>

    <a-spin :spinning="isFetchingProgress">
      <a-table
        :columns="fields"
        :data-source="nodeInfo"
        :pagination="false"
        :scroll="{ x: 'max-content', y: 'max-content' }"
        size="small"
      >
        <a
          :href="`//neoscan.io/block/${h}`"
          target="_blank"
          slot="height"
          slot-scope="h"
          >{{ h }}</a
        >

        <router-link slot="time" slot-scope="t" to="/statistics">{{
          t
        }}</router-link>
      </a-table>
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
          sorter: sorter("id"),
        },
        {
          key: "nodeName",
          dataIndex: "nodeName",
          title: "Nodes",
          sorter: sorter("nodeName"),
        },
        {
          key: "exceptionHeight",
          dataIndex: "exceptionHeight",
          title: "Height",
          sorter: sorter("exceptionHeight"),
          scopedSlots: { customRender: "height" },
        },
        {
          key: "exceptionTime",
          dataIndex: "exceptionTime",
          title: "Generate Time(GMT +8)",
          sorter: sorter("exceptionTime"),
          scopedSlots: { customRender: "time" },
        },
        {
          key: "intervals",
          dataIndex: "intervals",
          title: "Interval(s)",
          sorter: sorter("intervals"),
        },
      ],
      filter: null,
      filterBouncer: debounce((val) => this.filterTable(val)),
    };
  },
  mounted() {
    this.$store.dispatch("getNodeInfo");
  },
  computed: {
    ...mapGetters(["nodeInfo", "isFetchingProgress"]),
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
