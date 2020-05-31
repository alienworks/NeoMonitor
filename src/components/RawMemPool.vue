<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="Raw Memeory Pools"
    @back="() => $router.back()"
  >
    <div class="rm-container text-left pt-5">
      <h1>{{ title }}</h1>
      <a-list
        v-if="myPool&&myPool.length>0"
        bordered
        size="small"
        :data-source="myPool"
        :loading="isFetchingProgress"
      >
        <a-list-item slot="renderItem" slot-scope="item" :key="item.id">
          <a-list-item-meta :description="item.value">
            <span slot="title">Transaction No.</span>
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

export default {
  mounted() {
    this.$store.dispatch("getPools");

    connection.on("UpdateRawMemPoolItems", data => {
      this.$store.commit("setPools", data);
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
            value: val
          });
        }
      } else {
        this.myPool = null;
      }
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
  width: calc(100% - 180px);
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
