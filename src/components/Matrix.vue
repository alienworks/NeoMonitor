<template>
  <div>
    <div class="contanier mt-3 col-12">
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
        :items="items"
        :fields="fields"
        :filter="filter"
        :filter-function="filterTable"
        class="matrix-table"
      >
        <template v-slot:head(url)="_">
          <div class="text-nowrap">node</div>
        </template>
        <template v-slot:head()="rest">
          <div class="text-nowrap">{{ rest.label }}</div>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import NodeService from "@/services/NodeService";

const avaliableApiNames = [
  "claimgas",
  "dumpprivkey",
  "getaccountstate",
  "getapplicationlog",
  "getassetstate",
  "listplugins",
  "getbestblockhash",
  "getbalance",
  "getblock",
  "getblockcount",
  "getblockhash",
  "getblockheader",
  "getblocksysfee",
  "getclaimable",
  "getconnectioncount",
  "getcontractstate",
  "getmetricblocktimestamp",
  "getnep5balances",
  "getnep5transfers",
  "getnewaddress",
  "getrawmempool",
  "getrawtransaction",
  "getstorage",
  "gettransactionheight",
  "gettxout",
  "getpeers",
  "getunspents",
  "getversion",
  "getvalidators",
  "getwalletheight",
  "importprivkey",
  "invokefunction",
  "invokescript",
  "listaddress",
  "sendrawtransaction",
  "sendfrom",
  "sendtoaddress",
  "sendmany",
  "submitblock",
  "validateaddress"
];

export default {
  data: function() {
    return {
      fields: [
        {
          key: "url",
          label: "node",
          sortable: true,
					stickyColumn: true,
					isRowHeader: true, 
					variant: 'light'
        },
        ...avaliableApiNames.map(name => ({
          key: name,
          label: name,
          sortable: true
        }))
      ],
      items: [],
      filter: null
    };
  },
  mounted: function() {
    this.getMatrixItems();
  },
  methods: {
    async getMatrixItems() {
      const response = await NodeService.getMatrixItems();
      this.items = this.transofrmMatrixItems(response.data);
    },
    transofrmMatrixItems(data) {
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

      return Object.values(groupedObject).map(items =>
        items.reduce(
          (acc, { url, method, available }) => ({
            ...acc,
            url,
            [method.toLowerCase()]: available ? "✔" : "✘"
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
</style>