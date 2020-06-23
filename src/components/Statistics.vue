<template>
  <div class="chart-wrapper container col-12 mt-5">
    <chart v-if="chartOptions" :options="chartOptions" :autoresize="true"></chart>
    <chart v-if="chartHeatMapOptions" :options="chartHeatMapOptions" :autoresize="true"></chart>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";

export default {
  name: "Statistics",

  mounted() {
    this.setStatisticsXY();
  },
  methods: {
    objectArraySort() {
      return function(objectN, objectM) {
        var valueN = objectN[1];
        var valueM = objectM[1];
        if (valueN < valueM) return 1;
        else if (valueN > valueM) return -1;
        else return 0;
      };
    },
    setStatisticsXY() {
      let series = [];
      let heatSeries = [];
      for (let i = 0; i < this.statisticsX.length; i++) {
        series.push([new Date(this.statisticsX[i]), this.statisticsY[i]]);
        heatSeries.push([
          moment(new Date(this.statisticsX[i])).format("Y/M/D"),
          this.statisticsY[i]
        ]);
      }
      //sort series
      let sorted = heatSeries.sort(this.objectArraySort());
      console.log(sorted);

      this.chartOptions = {
        title: {
          top: 30,
          left: "center",
          text: "Intervals Scatter Map"
        },
        xAxis: {
          axisLabel: {
            formatter: function(value) {
              return moment(value).format("M/D/Y");
            },
            rotate: 60
          },
          scale: true
        },
        yAxis: {
          scale: true
        },
        series: [
          {
            type: "scatter",
            data: series
          }
        ],
        color: "#007df7"
      };
      this.chartHeatMapOptions = {
        title: {
          top: 30,
          left: "center",
          text: "ExceptionHeight Heat Map"
        },
        visualMap: {
          min: sorted[sorted.length - 1][1],
          max: sorted[0][1],
          type: "piecewise",
          orient: "horizontal",
          left: "center",
          top: 65,
          textStyle: {
            color: "#000"
          },
          formatter: function(minValue, maxValue) {
            return parseInt(minValue) + " - " + parseInt(maxValue);
          }
        },
        calendar: [
          {
            top: 120,
            left: 30,
            right: 30,
            cellSize: ["auto", 13],
            range: new Date().getFullYear().toString(),
            itemStyle: {
              borderWidth: 0.5
            }
          }
        ],

        series: [
          {
            type: "heatmap",
            coordinateSystem: "calendar",
            data: heatSeries
          }
        ]
      };
    }
  },
  computed: {
    ...mapGetters(["statisticsX", "statisticsY"])
  },
  data() {
    return {
      chartHeatMapOptions: null,
      chartOptions: null,
      chartOptionsBar: {
        // color: "#17a2b8",
        color: "#007bff",
        xAxis: {
          axisLabel: {
            formatter: function(value) {
              return moment(value).format("M/D/Y");
            },
            rotate: 60
          },
          name: "Time(s)",
          nameTextStyle: {
            color: "#ff0000",
            fontWeight: "bold"
          },
          data: []
        },
        yAxis: {
          type: "value",
          name: "Interval(s)",
          nameTextStyle: {
            color: "#ff0000",
            fontWeight: "bold"
          }
        },
        grid: {
          bottom: 75
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
                distance: 5
              }
            }
          }
        ],
        isMock: true
      }
    };
  }
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
