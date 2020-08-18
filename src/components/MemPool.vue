<template>
  <a-page-header style="border: 1px solid rgb(235, 237, 240)" title="All Nodes" @back="() => $router.back()">
    <div class="rm-container text-left pt-5">

      <h1>Node Memory Pool</h1>
      <h5>
        {{ title }}
        <a-popover title="Success" trigger="click">
          <template slot="content">
            <p>All Transaction Hash has been copied.</p>
          </template>
          <a-button @click="copyAll(pools)" type="primary" style="position:relative;top:-10px;">Copy All</a-button>
        </a-popover>
      </h5>
      <a-list bordered size="small" :data-source="myPool" :loading="isFetchingProgress" :style="{minHeight:listMinH}">
        <a-list-item slot="renderItem" slot-scope="item" :key="item.id">
          <a-list-item-meta @dblclick="copySingleHash(item)">
            <span slot="title" class="hash_code">{{item.value}}</span>
            <a-avatar slot="avatar" class="avatar">{{item.id}}</a-avatar>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
      <div class="pagination_wrapper">
        <a-pagination style="margin-top:12px;" v-if="myPool && myPool.length > 0" @change="changePage" :default-current="1"
          v-model="current" :total="pools.length" :show-total="total => `Total ${total} items`" pagesize.sync="10" />
      </div>
    </div>
  </a-page-header>
</template>

<script>
import { mapGetters } from "vuex";
import { hubConnection } from "@/App";

import copy from "clipboard-copy";
export default {
  created() {
    if (sessionStorage.getItem("store") ) {
        this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
    }
    window.addEventListener('beforeunload', this.saveState)
    this.$store.dispatch("getPool");
  },
  mounted() {
  },
  computed: {
    ...mapGetters(["isFetchingProgress", "pools", 'nodeID', 'getNodeFromId']),
    title() {
      if (this.getNodeFromId(this.nodeID).length != 1) return 'duplicate nodes'
      const nodeUrl = this.getNodeFromId(this.nodeID)[0]['url']
      const title = `Transactions in mempool of ${nodeUrl}`;
      return this.pools.length ? `${this.pools.length} ${title}` : title;
    },
  },
  beforeDestroy() {
    console.log('UnsubscribeRawMemPoolItemsInfo', `${this.nodeID}`)
    hubConnection.send('UnsubscribeRawMemPoolItemsInfo', `${this.nodeID}`)
  },
  destroyed() {
    window.removeEventListener('beforeunload', this.saveState)
  },
  watch: {
    // current(newVal, oldVal){
    //   console.log(newVal)
    //   console.log(oldVal)
    // },
    pools(val) {
      if (val && val.length > 0) {
        this.myPool.length = 0
        this.current = 1
        if (val && val.length >= 10) {
          for (let i = 0; i < 10; i++) {
            this.myPool.push({
              id: i + 1,
              value: val[i]
            });
          }
        } else {
          for (let i = 0; i < val.length; i++) {
            this.myPool.push({
              id: i + 1,
              value: val[i]
            });
          }
        }
      } else {
        this.myPool = [];
      }
    }

  },
  methods: {
    saveState() {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state))
    },
    nodeUrl() {
      if (this.getNodeFromId(this.nodeID).length != 1) return
      this.getNodeFromId(this.nodeID)[0]['url']
    },
    changePage(page, pageSize) {
      this.myPool.length = 0
      let slicedPools = this.pools.slice((page - 1) * pageSize, page * pageSize)
      for (let i = 0; i < slicedPools.length; i++) {
        this.myPool.push({
          id: (page - 1) * pageSize + i + 1,
          value: slicedPools[i]
        })
      }
    },
    copySingleHash(item) {
      let self = this;
      copy(item.value).then(() => {
        self.$message.success("The Transaction Hash has been copied.");
      });
    },
    copyAll(pools) {
      let copyText = '';
      for (let i = 0; i < pools.length; i++) {
        copyText += `${pools[i]}\r\n`
      }
      copy(copyText)
    }
  },
  data() {
    return {
      myPool: [],
      current: 1,
      listMinH: window.innerHeight - 252 + "px",
    };
  }
};
</script>

<style lang="scss" scoped>
.ant-list-item-meta-avatar {
  display: inline-block !important;
  line-height: 48px;
}
.ant-list-item-meta-content {
  display: inline-block !important;
}
.ant-list-item-meta-description {
  width: 700px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.avatar {
  background-color: #0992f8;
}
.hash_code {
  font-size: 16px;
  top: 13px;
  position: relative;
}
.rm-container {
  background-color: rgba(255, 255, 255, 0);

  @media (min-width: 768px) {
    padding: 0 15px;
  }

  @media (min-width: 992px) {
    padding: 0 7rem;
  }

  @media (min-width: 1200px) {
    padding: 0 10rem;
  }
}
.pagination_wrapper {
  text-align: center;
  margin-top: 8px;
}
</style>
