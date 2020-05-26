<template>
  <div class="chart-wrapper container col-12 mt-5">
    <chart :options="chartOptionsBar" :autoresize="true"></chart>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";

export default {
  name: "Statistics",
  data() {
    return {
      chartOptionsBar: {
        // color: "#17a2b8",
        color: "#007bff",
        xAxis: {
          axisLabel: {
            formatter: function(value) {
              return moment(value).format("M/D/Y");
            },
            rotate: 60,
          },
          name: "Time(s)",
          nameTextStyle: {
            color: "#ff0000",
            fontWeight: "bold",
          },
          data: [],
        },
        yAxis: {
          type: "value",
          name: "Interval(s)",
          nameTextStyle: {
            color: "#ff0000",
            fontWeight: "bold",
          },
        },
        grid: {
          bottom: 75,
        },
        series: [
          {
            type: "bar",
            data: [],
            label: {
              normal: {
                show: true,
                position: "top",
                color: "#000000",
                fontSize: "14",
                distance: 5,
              },
            },
          },
        ],
      },
    };
  },
  mounted() {
    this.setStatisticsXY();
  },
  methods: {
    setStatisticsXY() {
      this.chartOptionsBar.xAxis.data = this.statisticsX;
      this.chartOptionsBar.series[0].data = this.statisticsY;
    },
  },
  computed: {
    ...mapGetters(["statisticsX", "statisticsY"]),
  },
};
</script>

<style lang="scss" scoped>
.chart-wrapper {
  width: 100%;
  height: 700px;
}
.echarts {
  width: 100%;
  height: 100%;
}
</style>
