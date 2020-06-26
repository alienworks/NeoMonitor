<template>
  <div class="chart-wrapper container col-12 mt-5">
    <div v-if="chartScatterOptions" class="title">Exception - Interval</div>
    <echarts v-if="chartScatterOptions" :options="chartScatterOptions" :autoresize="true"></echarts>
    <div v-if="chartHeatmapOptions" class="title" style="margin-top:18px;">Exception - Count</div>
    <echarts v-if="chartHeatmapOptions" :options="chartHeatmapOptions" :autoresize="true"></echarts>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";

export default {
  name: "Statistics",

  mounted() {
    Date.prototype.Format = function(fmt) {
      var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(), //Day
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3), //Season
        S: this.getMilliseconds()
      };
      if (/(y+)/.test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return fmt;
    };

    if (this.statExceptionTime.length > 0 && this.statInterval.length > 0) {
      this.setOptionScatter();
      this.setOptionHeatmap();
    }
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
    generateHeatmapSeries() {
      let initDate = new Date(this.statExceptionTime[0]);
      let initY = 1;
      let initDateStr = initDate.Format("yyyy-MM-dd");
      let resultXSeries = [];
      let resultYSeries = [];
      let resultSeries = [];
      for (let i = 1; i < this.statExceptionTime.length; i++) {
        let currDate = new Date(this.statExceptionTime[i]);
        let currDateStr = currDate.Format("yyyy-MM-dd");
        if (initDateStr === currDateStr) {
          //same day
          initY++;
        } else {
          resultXSeries.push(initDateStr);
          resultYSeries.push(initY);
          initDateStr = currDateStr;
          initY = 1;
        }
      }
      resultXSeries.push(initDateStr);
      resultYSeries.push(initY);
      for (let j = 0; j < resultXSeries.length; j++) {
        resultSeries.push([resultXSeries[j], resultYSeries[j]]);
      }
      return resultSeries;
    },
    setOptionScatter() {
      let seriesScatter = [];
      for (let i = 0; i < this.statExceptionTime.length; i++) {
        seriesScatter.push([
          new Date(this.statExceptionTime[i]),
          this.statInterval[i]
        ]);
      }

      this.chartScatterOptions = {
        title: {
          left: "center",
          text: "Intervals - Time",
          show: true
        },
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            let res = "<p> Time: " + params.data[0] + "</p>";
            res += "<p> Interval: " + params.data[1] + "s</p>";
            return res;
          }
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
            data: seriesScatter
          }
        ],
        color: "#007df7"
      };
    },
    setOptionHeatmap() {
      let seriesHeatmap = this.generateHeatmapSeries();
      //sort series
      let sorted = seriesHeatmap.sort(this.objectArraySort());

      this.chartHeatmapOptions = {
        title: {
          left: "center",
          text: "Intervals - Frequency",
          show: true
        },
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            let res = "<p> Time: " + params.data[0] + "</p>";
            res += "<p> Count: " + params.data[1] + "</p>";
            return res;
          }
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
            data: seriesHeatmap
          }
        ]
      };
    }
  },
  computed: {
    ...mapGetters(["statExceptionTime", "statInterval"])
  },
  data() {
    return {
      chartHeatmapOptions: null,
      chartScatterOptions: null
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
.title {
  font-size: 18px;
}
</style>
