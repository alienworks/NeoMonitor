<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="Raw Memeory Pools"
    @back="() => $router.back()"
  >
    <div class="rm-container text-left pt-5">
      <h1>{{ title }}</h1>
      <a-list 
        bordered 
        size="small" 
        :data-source="pools" 
        :loading="isFetchingProgress"
      >
        <a-list-item slot="renderItem" slot-scope="item">
          {{ item }}
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

    connection.on("UpdateRawMemPoolItems", (data) => {
      this.$store.commit("setPools", data);
    });
  },
  computed: {
    ...mapGetters(["isFetchingProgress", "pools"]),
    title() {
      const title = "Raw Transactions";
      return this.pools.length ? `${this.pools.length} ${title}` : title;
    },
  },
  beforeDestroy() {
    connection.send("UnsubscribeRawMemPoolItemsInfo");
  },
};
</script>

<style lang="scss" scoped>
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
