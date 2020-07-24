<template>
  <div class="main">

    <div id="chartdiv" ref="chart" :style="{height:maxHeight,width:mapWidth,backgroundColor:'#222'}"></div>
    <!-- <div class="chart-wrapper">
      <chart :options="chartOptions" auto-resize></chart>
    </div>-->
    <div class="table_wrapper" :style="{width:listWidth,paddingTop:'1.5rem'}">
      <a-table :rowKey="getRowKey" :rowClassName="generateRowClass" :columns="fields" :data-source="rankTableData"
        :pagination="false" size="small"></a-table>
    </div>

    <!--
      <div class="mb-3">
       <b-table responsive hover :fields="fields" :items="rankTableData">
        <template v-slot:cell(country)="row">
          <div class="d-flex">
            <img :src="row.item.flagUrl" class="flag mr-3" />
            <div>{{ row.item.country }}</div>
          </div>
        </template>
      </b-table>
    </div>
    -->
  </div>
</template>


<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import Toolbar from "../layouts/Toolbar";
// svg path for target icon
var targetSVG =
  "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";

export default {
  name: "Main",
  components: {
    [Toolbar.name]: Toolbar
  },
  data() {
    return {
      maxHeight: window.innerHeight - 118 + "px",
      mapWidth: "100%",
      listWidth: "calc(100% - 6rem)",
      neoMapLocations: [],
      fields: [
        {
          key: "no",
          dataIndex: "no",
          title: "No",
          sorter: (a, b) => a.no - b.no,
          sortDirections: ["descend", "ascend"],
          customRender: function (text) {
            return (
              <div class="rank-no">{{ text }}</div>
            );
          }
        },
        {
          key: "country",
          dataIndex: "country",
          title: "Country",
          sorter: (a, b) => a.country.length - b.country.length,
          sortDirections: ["descend", "ascend"],
          scopedSlots: { customRender: "country" },
          customRender: function (text, record) {
            return (
              <div>
                <img src={record.flagUrl} class="flag"></img>
                <span style="font-size:18px;margin-left:8px;">{{ text }}</span>
              </div>
            );
          }
        },
        {
          key: "number_of_nodes",
          dataIndex: "number_of_nodes",
          title: "Number of Nodes",
          sorter: (a, b) => a.number_of_nodes - b.number_of_nodes,
          sortDirections: ["descend", "ascend"],
          customRender: function (text) {
            return <span style="font-size:18px;">{{ text }}</span>;
          }
        }
      ],
      chartOptions: {},
      rankTableData: []
    };
  },
  mounted() {
    this.neoMapLocations = this.$store.getters.nodes;
    console.log(this.$refs.chart);
    console.log(this.paddingTop);
  },
  methods: {
    generateRowClass() {
      return "customCountryRow";
    },
    getRowKey(record) {
      return record.text + new Date().getTime();
    },
    showMap(data) {
      // Clear
      am4core.disposeAllCharts();

      // Themes begin
      am4core.useTheme(am4themes_animated);
      am4core.useTheme(am4themes_dark);
      // Themes end

      // Define marker path
      //var targetSVG =
      "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";

      // Create map instance
      var chart = am4core.create("chartdiv", am4maps.MapChart);
      var interfaceColors = new am4core.InterfaceColorSet();

      // Set map definition
      chart.geodata = am4geodata_worldLow;

      // Set projection
      chart.projection = new am4maps.projections.Miller();

      // Add zoom control
      chart.zoomControl = new am4maps.ZoomControl();

      // Set initial zoom
      chart.homeZoomLevel = 1;
      chart.homeGeoPoint = {
        latitude: 30,
        longitude: 0
      };

      // Create map polygon series
      var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
      polygonSeries.exclude = ["AQ"];
      polygonSeries.useGeodata = true;
      polygonSeries.mapPolygons.template.nonScalingStroke = true;

      // Configure series
      var polygonTemplate = polygonSeries.mapPolygons.template;
      polygonTemplate.tooltipText = "{name}";
      polygonTemplate.polygon.fillOpacity = 0.6;

      // Create hover state and set alternative fill color
      var hs = polygonTemplate.states.create("hover");
      hs.properties.fill = chart.colors.getIndex(0);

      // Add images
      var imageSeries = chart.series.push(new am4maps.MapImageSeries());


      var imageTemplate = imageSeries.mapImages.template;
      imageTemplate.tooltipText = "{title}";
      imageTemplate.nonScaling = true;

      var circle = imageSeries.mapImages.template.createChild(am4core.Circle);
      circle.radius = 3;
      circle.propertyFields.fill = "color";

      var circle2 = imageSeries.mapImages.template.createChild(am4core.Circle);
      circle2.radius = 3;
      circle2.propertyFields.fill = "color";


      circle2.events.on("inited", function (event) {
        animateBullet(event.target);
      })


      function animateBullet(circle) {
        var animation = circle.animate([{ property: "scale", from: 1, to: 5 }, { property: "opacity", from: 1, to: 0 }], 1000, am4core.ease.circleOut);
        animation.events.on("animationended", function (event) {
          animateBullet(event.target.object);
        })
      }

      /*
      var marker = imageTemplate.createChild(am4core.Sprite);
      marker.path = targetSVG;
      marker.horizontalCenter = "middle";
      marker.verticalCenter = "middle";
      marker.scale = 0.7;
      marker.fill = interfaceColors.getFor("alternativeBackground");
      */
      imageTemplate.propertyFields.latitude = "latitude";
      imageTemplate.propertyFields.longitude = "longitude";
      var colorSet = new am4core.ColorSet();
      for (let j = 0; j < data.length; j++) {
        data[j]["color"] = colorSet.next();
      }
      imageSeries.data = data;

      // Add lines
      var lineSeries = chart.series.push(new am4maps.MapLineSeries());
      lineSeries.dataFields.multiGeoLine = "multiGeoLine";

      var lineTemplate = lineSeries.mapLines.template;
      lineTemplate.nonScalingStroke = true;
      lineTemplate.arrow.nonScaling = true;
      lineTemplate.arrow.width = 4;
      lineTemplate.arrow.height = 6;
      lineTemplate.stroke = interfaceColors.getFor("alternativeBackground");
      lineTemplate.fill = interfaceColors.getFor("alternativeBackground");
      lineTemplate.line.strokeOpacity = 0.4;
    },
    suckData() {
      let data = this.$store.getters.nodes;
      if (data.length === 0) return;

      this.neoMapLocations = [];
      let element = {};

      data.forEach(item => {
        element = {
          svgPath: targetSVG,
          title: item.location,
          latitude: item.latitude,
          longitude: item.longitude,
          scale: 0.5
        };

        this.neoMapLocations.push(element);
      });
    },
    getNodesByGroup(array, groupKey) {
      let result = {},
        data = [];

      array.forEach(item => {
        if (!result[item[groupKey]]) {
          result[item[groupKey]] = [];
          data.push({
            no: 0,
            flagUrl: item["flagUrl"],
            country: item[groupKey],
            number_of_nodes: 0
          });
        }

        // Set number of nodes
        data.forEach(row => {
          if (row["country"] === item[groupKey]) row["number_of_nodes"]++;
        });
      });

      return data;
    },
    getNodesBySort(array) {
      let result = array.slice(),
        tempFlagUrl,
        tempCountry = "",
        tempNumber = 0;

      // Sort
      for (let i = 0; i <= result.length - 2; i++) {
        for (let j = i + 1; j <= result.length - 1; j++) {
          if (result[i]["number_of_nodes"] < result[j]["number_of_nodes"]) {
            tempFlagUrl = result[i]["flagUrl"];
            tempCountry = result[i]["country"];
            tempNumber = result[i]["number_of_nodes"];
            result[i]["flagUrl"] = result[j]["flagUrl"];
            result[i]["country"] = result[j]["country"];
            result[i]["number_of_nodes"] = result[j]["number_of_nodes"];
            result[j]["flagUrl"] = tempFlagUrl;
            result[j]["country"] = tempCountry;
            result[j]["number_of_nodes"] = tempNumber;
          }
        }
      }

      // Set "no" field
      for (let i = 0; i <= result.length - 1; i++) {
        result[i]["no"] = i + 1;
      }

      return result;
    }
  },
  computed: {
    refreshNodes() {
      return this.$store.getters.nodes;
    }
  },
  watch: {
    refreshNodes() {
      this.suckData();
    },
    neoMapLocations(val, oldval) {
      // Rank table
      let data = this.refreshNodes;
      data = this.getNodesByGroup(data, "location");
      this.rankTableData = this.getNodesBySort(data, "location");

      // Map
      if (!val) {
        this.showMap(this.neoMapLocations);
      } else {
        // Show the map only if the data is changed.
        let isDataEqual = false,
          currentData = val,
          oldData = oldval;

        currentData = this.getNodesByGroup(currentData, "title");
        currentData = this.getNodesBySort(currentData, "title");

        oldData = this.getNodesByGroup(oldData, "title");
        oldData = this.getNodesBySort(oldData, "title");

        isDataEqual =
          currentData.length == oldData.length &&
          currentData.every(function (element, index) {
            return JSON.stringify(element) === JSON.stringify(oldData[index]);
          });

        if (!isDataEqual) this.showMap(this.neoMapLocations);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.rank-no {
  background-image: linear-gradient(to top left, #b0e0e6, #008be7);
  width: 32px;
  height: 32px;
  border-top-left-radius: 3px;
  border-top-right-radius: 16px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #fff;
  font-size: 17px;
}
.container {
  overflow: hidden;
}

#chartdiv {
  min-height: 75vh;
  display: inline-block;
}
.table_wrapper {
  display: inline-block;
  position: relative;
}
.btn-net {
  float: right;
}

.flag {
  width: 30px;
  height: 20px;
}

.country-text {
  display: inline;
  margin-left: 6px;
}

.ant-table-small {
  border-radius: 0;
}
// @media (max-width: 400px) {
//   #chartdiv {
//     width: 100%;
//     height: 60vh;
//     margin-top: -10vh;
//     z-index: -1;
//   }
// }
</style>
