<template>
  <div style="overflow:hidden">
    <search :doFilter="doFilter" :loading="loading"></search>
    <a-spin :spinning="isFetchingProgress">
      <a-table :columns="fields" :data-source="myEntities" :pagination="false" :scroll="{ x: maxWidth ,y:maxHeight}" size="small"
        class="matrix_table" :style="{maxWidth: maxWidth+'px'}" :rowKey="generateRowKey">
        <div slot="method" slot-scope="avilable" :class="[avilable ? 'red' : 'green']" v-if="avilable">
          <a-icon type="check" />
        </div>
        <div slot="method" slot-scope="avilable" :class="[avilable ? 'red' : 'green']" v-else>
          <a-icon type="close" />
        </div>
      </a-table>
    </a-spin>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { avaliableApiNames } from "@/constants";
import { sorter, debounce } from "@/utils";
import Search from "./Search";
import Toolbar from "../layouts/Toolbar";
export default {
  components: {
    [Search.name]: Search,
    [Toolbar.name]: Toolbar
  },
  data: function () {
    return {
      loading: false,
      maxWidth: window.innerWidth - 18,
      maxHeight: window.innerHeight - 138,
      fields: [
        {
          key: "ID",
          dataIndex: "ID",
          title: "ID",
          fixed: "left",
          align: "center",
          width: 40
        },
        {
          key: "url",
          dataIndex: "url",
          title: "node",
          sorter: sorter("url"),
          fixed: "left",
          align: "center",
          width: 288
        },
        ...avaliableApiNames.map(name => ({
          key: name,
          dataIndex: name,
          title: name,
          align: "center",
          scopedSlots: { customRender: "method" },
          ellipsis: true,
          width: name.length * 9 + 12
        }))
      ],
      entities: [],
      myEntities: [],
      defaultEntites: [],
      filter: null,
      filterDebounce: debounce(val => {
        this.myEntities = this.entities.filter(({ url }) => {
          if (url) {
            url = url.toLowerCase();
            val = val.toLowerCase();
            return url.includes(val);
          }
        });
        this.loading = false;
      }),
      logDebounce: debounce(val => console.log("debounced", val, arguments))
    };
  },
  mounted() {
    this.$store.dispatch("getMatrixEntities");
  },
  computed: {
    ...mapGetters(["matrixEntities", "isFetchingProgress"])
  },
  watch: {
    matrixEntities(entities) {
      this.entities = this.transofrmMatrixEntities(entities);
      this.defaultEntites = this.entities.slice();
    },
    entities: {
      deep: true,
      handler: function (newVal) {
        for (let i = 0; i < newVal.length; i++) {
          newVal[i]["ID"] = i + 1;
        }
        this.myEntities = newVal;
      }
    }
  },
  methods: {
    generateRowKey(record) {
      return record["url"] || Math.random() * 10000 + 10000;
    },
    doFilter(val) {
      val = val.toLowerCase();
      this.loading = true;
      if (val) {
        this.filterDebounce(val);
      } else {
        this.myEntities = this.entities;
        this.loading = false;
      }
    },
    transofrmMatrixEntities(data) {
      // T[] -> string -> {[keyof T]: T[]}
      // map array into object, group by sepecified key
      function groupBy(arr, key) {
        return arr.reduce(
          (acc, cur) => ({
            ...acc,
            [cur[key]]: [...(acc[cur[key]] || []), cur]
          }),
          {}
        );
      }

      const groupedObject = groupBy(data, "url");

      return Object.values(groupedObject).map(entities =>
        entities.reduce(
          (acc, { url, method, available }) => ({
            ...acc,
            url,
            [method.toLowerCase()]: available
          }),
          {}
        )
      );
    },
    filterTable(row, filter) {
      return row.url.toLowerCase().includes(filter.toLowerCase());
    }
  }
};
</script>

<style lang="scss" scoped>
.matrix-table {
  min-height: 50rem;
}
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

.ant-table td {
  white-space: nowrap;
}

.red {
  color: #0b8235;
}

.green {
  color: #f81d22;
}
.matrix_table {
  overflow: auto;
}
.ant-table-body {
  overflow: auto;
}
</style>