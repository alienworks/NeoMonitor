<template>
  <a-spin :spinning="isFetchingProgress">
    <b-container class="rm-container text-left pt-5">
      <h1>{{ title }}</h1>
      <p class="my-2" v-for="(item, index) in pools" :key="index">{{ item }}</p>
      <div v-if="!pools.length">None</div>
    </b-container>
  </a-spin>
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
    padding-left: 15px;
  }

  @media (min-width: 992px) {
    padding-left: 7rem;
  }

  @media (min-width: 1200px) {
    padding-left: 10rem;
  }
}
</style>
