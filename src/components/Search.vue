<template>
  <div class="search">
    <a-row type="flex" justify="end" class="search-wrapper">
      <a-input-search v-model="filter" placeholder="filter by name" style="width: 200px" :loading="loading" />
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      filter: '',
    }
  },
  props: {
    doFilter: {
      type: Function,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    filter(val) {
      this.doFilter(val)
    },
  },
  created() {},
  methods: {},
  computed: {},
}
</script>

<style lang="scss" scoped>
.search {
  margin-top: 5px;
  margin-bottom: 5px;
  margin-right: 18px;
}
</style>
