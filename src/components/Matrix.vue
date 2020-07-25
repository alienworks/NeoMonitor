<template>
  <div style="overflow:hidden">
    <div class="search">
      <a-row type="flex" justify="end" class="search-wrapper">

        <a-input-search :readonly="isFetchingProgress" v-model="searchText" placeholder="filter by name" style="width: 200px"
          :loading="loading" />

      </a-row>
    </div>

    <a-spin :spinning="isFetchingProgress">
      <a-pagination style="margin-top:12px;margin-bottom:12px;" v-if="apisList && apisList.length>0" @change="changePage"
        v-model="current" :total="apisList.length" :page-size.sync="pageSize" />
      <a-table id="m-table" :columns="myFields" :data-source="myEntities" :pagination="false"
        :scroll="{ x: maxWidth ,y:maxHeight}" size="small" class="m-table"
        :style="{maxWidth: maxWidth+'px',minHeight:tableMaxH,height:tableMaxH}" :rowKey="generateRowKey">
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
      apisList: [],
      currentAPIs: [],
      current: 1,
      pageSize: 7,
      searchText: null,
      tableDefaultH: window.innerHeight - 144 + "px",
      tableMaxH: window.innerHeight - 192 + "px",
      loading: false,
      maxWidth: window.innerWidth - 18,
      maxHeight: window.innerHeight - 234,
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
      myFields: [],
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
      logDebounce: debounce(val => console.log("debounced", val, arguments)),

    };
  },
  mounted() {
    this.$store.dispatch("getMatrixEntities");
    this.$nextTick(() => {
      document.getElementById("footer").style.display = "none";
      document.getElementById("cnzz_stat_icon_1279108481").style.display = "none";
    });
  },
  computed: {
    ...mapGetters(["matrixEntities", "isFetchingProgress", "flag"])
  },
  watch: {
    flag() {
      this.$store.dispatch("getMatrixEntities");
    },
    matrixEntities(entities) {
      let result = entities.filter(item => {
        if (item.net.toLowerCase() === this.flag.toLowerCase()) return true;
        else return false;
      });

      this.entities = this.transofrmMatrixEntities(result);
      this.defaultEntites = this.entities.slice();
    },
    entities: {
      handler: function (newVal) {
        for (let i = 0; i < newVal.length; i++) {
          newVal[i]["ID"] = i + 1;
        }

        this.apisList = [];
        for (let i = 0; i < this.fields.length; i++) {
          this.apisList.push(this.fields[i].key);
        }
        this.changePage(1, this.pageSize);
      }
    },
    currentAPIs(val) {
      if (val && val.length > 0) {
        this.myEntities = [];
        this.myFields = [];
        //fields
        for (let i = 0; i < this.fields.length; i++) {
          let currKey = this.fields[i].key;
          for (let j = 0; j < val.length; j++) {
            if (currKey === val[j]) {
              this.myFields.push(this.fields[i]);

            }
          }

        }
        //entities
        for (let i = 0; i < this.entities.length; i++) {
          let currEntity = this.entities[i];
          let resultEntity = {};
          for (let j = 0; j < val.length; j++) {
            if (val[j] !== "ID" && val[j] !== "url") {
              resultEntity[val[j]] = currEntity[val[j]];
            }
          }
          resultEntity["ID"] = currEntity.ID;
          resultEntity["url"] = currEntity.url;
          this.myEntities.push(resultEntity);
        }
      }
    },
    searchText(val) {
      this.doFilter(val);
    },
    myEntities(val) {
      if (val && val.length > 0) {
        this.$nextTick(() => {
          document.getElementById("footer").style.display = "block";
          document.getElementById("cnzz_stat_icon_1279108481").style.display = "block";
        });

      }
    }
  },
  methods: {
    changePage(page, size) {
      this.currentAPIs = Array.from(new Set(["ID", "url", ...this.apisList.slice((page - 1) * size, page * size)]));

    },
    generateRowKey(record) {
      return record.ID;
    },
    doFilter(val) {
      val = val.toLowerCase();

      if (val) {
        let result = this.entities.filter(item => {
          if (item.url.toLowerCase().includes(val)) return true;
          else return false;
        });
        this.myEntities = result;
      }
      else {
        this.$store.dispatch("getMatrixEntities");
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
}
</script>

<style lang="scss" scoped>
.m-table {
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
.search {
  margin-top: 5px;
  margin-bottom: 5px;
  margin-right: 18px;
}
</style>