<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="Raw Memeory Pools"
    @back="() => $router.back()"
  >
    <div class="rm-container text-left pt-5">
      <h1>
        {{ title }}
        <a-popover title="Success" trigger="click">
          <template slot="content">
            <p>All Transaction Hash has been copied.</p>
          </template>
          <a-button
            @click="copyAll(myPool)"
            type="primary"
            style="position:relative;top:-10px;"
          >Copy All</a-button>
        </a-popover>
      </h1>
      <a-list
        v-if="myPool&&myPool.length>0"
        bordered
        size="small"
        :data-source="myPool"
        :loading="isFetchingProgress"
      >
        <a-list-item slot="renderItem" slot-scope="item" :key="item.id">
          <a-list-item-meta :description="item.value" @dblclick="copySingleHash(item.value)">
            <span slot="title">Transaction Hash</span>
            <a-avatar slot="avatar" class="avatar">{{item.id}}</a-avatar>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </div>
  </a-page-header>
</template>

<script>
import { mapGetters } from "vuex";
import { connection } from "@/App";
import copy from "clipboard-copy";
export default {
  mounted() {
    this.$store.dispatch("getPool");

    connection.on("UpdateRawMemPoolItems", data => {
      this.$store.commit("setPool", data);
    });
  },
  computed: {
    ...mapGetters(["isFetchingProgress", "pools"]),
    title() {
      const title = "Raw Transactions";
      return this.pools.length ? `${this.pools.length} ${title}` : title;
    }
  },
  beforeDestroy() {
    connection.send("UnsubscribeRawMemPoolItemsInfo");
  },
  watch: {
    pools(val) {
      if (val && val.length > 0) {
        this.myPool = [];
        for (let i = 0; i < val.length; i++) {
          this.myPool.push({
            id: i + 1,
            value: val[i]
          });
        }
      } else {
        this.myPool = null;
      }
    }
  },
  methods: {
    copySingleHash(hash) {
      console.log(hash);
      copy(hash).then(() => {
        alert("Transaction Hash has been copied.");
      });
    },
    copyAll(pool) {
      let copyText = "";
      for (let i = 0; i < pool.length; i++) {
        copyText += pool[i].value + "\r\n";
        console.log(pool);
      }
      copy(copyText);
    }
  },
  data() {
    return {
      myPool: null
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
</style>
