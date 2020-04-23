<template>
  <b-container class="rm-container text-left">
    <h1 class="mt-5">{{ title }}</h1>
    <p class="my-2" v-for="(item, index) in items" :key="index">{{ item }}</p>
    <div v-if="!items.length">None</div>
  </b-container>
</template>

<script>
import NodeService from "@/services/NodeService";
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      items: []
    };
  },
	mounted: function() {
		this.getRawMempool();
	},
	methods: {
		async getRawMempool() {
			const response = await NodeService.getRawMempool(this.nodeID);
			this.items = response.status === 200 ? response.data : [];
		}
	},
	computed: {
		...mapGetters({
			'nodeID': 'getNodeID'
		}),
    title() {
      const title = "Raw Transactions";
      return this.items.length ? `${this.items.length} ${title}` : title;
    }
	}
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