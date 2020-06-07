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
    objectArraySort: function(keyName) {
      return function(objectN, objectM) {
        var valueN = objectN[keyName];
        var valueM = objectM[keyName];
        if (valueN < valueM) return 1;
        else if (valueN > valueM) return -1;
        else return 0;
      };
    },
    setStatisticsXY() {
      //this.chartOptionsBar.xAxis.data = this.statisticsX;
      //this.chartOptionsBar.series[0].data = this.statisticsY;
      //读取本地mockData
      fetch("/mocks/staticitics.json").then(resp => {
        resp.json().then(json => {
          let series = [];
          let heatSeries = [];
          json.forEach(element => {
            series.push([new Date(element.exceptionTime), element.intervals]);
            heatSeries.push([
              moment(new Date(element.exceptionTime)).format("Y-MM-DD"),
              element.exceptionHeight
            ]);
          });
          //sort series
          let sorted = heatSeries.sort(this.objectArraySort("exceptionHeight"));

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
              min: sorted[0][1],
              max: sorted[sorted.length - 1][1],
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
        });
      });
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
