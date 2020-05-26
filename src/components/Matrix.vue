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
        sticky-header
        no-border-collapse
        :items="entities"
        :fields="fields"
        :filter="filter"
        :filter-function="filterTable"
        class="matrix-table"
      >
        <template v-slot:head(url)>
          <div class="text-nowrap">node</div>
        </template>
        <template v-slot:head()="rest">
          <div class="text-nowrap">{{ rest.label }}</div>
        </template>
      </b-table>
    </div> -->
    <a-row type="flex" justify="end" class="search-wrapper">
      <a-input-search 
        v-model="filter"
        placeholder="filter by name" 
        style="width: 200px" />
    </a-row>

    <a-spin :spinning="isFetchingProgress">
      <a-table 
        :columns="fields"
        :data-source="entities" 
        :pagination="false"
        :scroll="{ x: 'max-content', y: 'max-content' }"
        size="small"
      >
        <span 
          slot="method" 
          slot-scope="avilable"
          :class="[avilable ? 'red' : 'green']"
        >{{ avilable ? "✔" : "✘" }}</span>
      </a-table>
    </a-spin>
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { avaliableApiNames } from "@/constants";
import { sorter, debounce } from "@/utils";

export default {
  data: function() {
    return {
      fields: [
        {
          key: "url",
          dataIndex: "url",
          title: "node",
          sorter: sorter('url'),
          fixed: 'left',
          align: 'center',
          width: 300
        },
        ...avaliableApiNames.map(name => ({
          key: name,
          dataIndex: name,
          title: name,
          width: 150,
          align: 'center',
          scopedSlots: { customRender: 'method' }
        }))
      ],
      entities: [],
      defaultEntites: [],
      filter: null,
      filterDebounce: debounce(
        (val) => this.entities = this.entities.filter(
          ({url}) => url.toLowerCase().includes(val.toLowerCase())
        ),
        500
      ),
      logDebounce: debounce((val) => console.log('debounced', val, arguments), 500)
    };
  },
  mounted() {
    this.$store.dispatch('getMatrixEntities');
  },
  computed: {
    ...mapGetters(['matrixEntities', 'isFetchingProgress'])
  },
  watch: {
    filter(val) {
      if (val) {
        this.filterDebounce(val)
        this.logDebounce(val)
      }
      else {
        this.entities = this.defaultEntites.slice()
      }
    },
    matrixEntities(entities) {
      this.entities = this.transofrmMatrixEntities(entities)
      this.defaultEntites = this.entities.slice()
    }
  },
  methods: {
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
    },
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

.ant-table td { white-space: nowrap; }

.red {
  color: #0b8235;
}

.green {
  color: #f81d22;
}
</style>