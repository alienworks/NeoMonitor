<template>
  <b-container class="an-container text-left">
    <h1 class="mt-5">Analysis</h1>
    <p>所有访问次数：<span>{{ totalDailyVisitTimes }}</span></p>
    

    <p>所有 IP 访问数量：<span>{{ totalDailyIpCount }}</span></p>
    

    <p>今日访问次数：<span>{{ currentDailyVisitTimes }}</span></p>
    

    <p>今日最近一小时访问次数：<span>{{ currentHourlyVisitTimes }}</span></p>
    

    <p>当前时间最近一小时 IP 访问数量：<span>{{ currentHourlyVisitTimes }}</span></p>
    

    <p>当前时间最近一小时所有访问次数：<span>{{ totalHourlyVisitTimes }}</span></p>
  </b-container>
</template>

<script>
import NodeService from "@/services/NodeService";

export default {
  data() {
    return {
      currentDailyVisitTimes: 0,
      totalDailyVisitTimes: 0,
      totalDailyIpCount: 0,
      currentHourlyVisitTimes: 0,
      totalHourlyVisitTimes: 0,
      totalHourlyIpCount: 0
    }
  },
  mounted() {
    Object.keys(this.$data).forEach(async key => {
      const titleizedKey = key[0].toUpperCase() + key.substring(1);
      const requestGetString = `get${titleizedKey}`;
      const response = await NodeService[requestGetString]();
      this[key] = response.status === 200 ? response.data : 0;
    })
  }
};
</script>

<style lang="scss" scoped>
.an-container {

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