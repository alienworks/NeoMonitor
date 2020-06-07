<template>
  <div class="chart-wrapper container col-12 mt-5">
    <chart :options="chartOptions" :autoresize="true"></chart>
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
    setStatisticsXY() {
      //this.chartOptionsBar.xAxis.data = this.statisticsX;
      //this.chartOptionsBar.series[0].data = this.statisticsY;
      //读取本地mockData
      fetch("/mocks/staticitics.json").then(resp => {
        resp.json().then(json => {
          let series = [];
          json.forEach(element => {
            series.push([new Date(element.exceptionTime), element.intervals]);
          });
          this.chartOptions = {
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
        });
      });
    }
  },
  computed: {
    ...mapGetters(["statisticsX", "statisticsY"])
  },
  data() {
    return {
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
