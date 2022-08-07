<template>
  <div id="showmetrics">
    <h1></h1>
    <table v-if="companyKeyMetrics">
      <tr>
        <td>
          Key Metrics for {{symbolId}}
          <tr>
            <th>Metric</th>
            <th>Latest</th>
          </tr>
          <tr v-for="(value, key) in companyKeyMetrics[0]" v-bind:key="key">
            <td v-if="(key!='date')">{{key}}</td>
            <td v-if="(key!='date')">
              {{format(value,2)}}
              <button v-on:click="trend(key)">Trend</button>
            </td>
          </tr>
        </td>
        <td v-if="chartData.length" style="vertical-align:top; horizontal-align:center;">
          <GChart
            :settings="{packages: ['line']}"
            :data="chartData"
            :options="chartOptions"
            :createChart="(el, google) => new google.charts.Line(el)"
          />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import * as app from "./../app.js";
import { GChart } from "vue-google-charts";

export default {
  name: "showmetrics",
  components: {
    GChart
  },
  props: ["symbolId"],
  data: function() {
    return {
      companyKeyMetrics: null,
      metricName: "",
      year: [],
      metric: [],
      chartData: [],
      chartOptions: {
        curveType: "function",
        chart: {
          title: "",
          subtitle: "Last 10 years"
        },
        width: 1200,
        height: 800,
        hAxis: {
          format: "yyyy",
          direction: -1
        },
        vAxis: {
          gridlines: { color: "none" },
          minValue: 0
        },
        legend: {
          position: "top"
        }
      }
    };
  },
  methods: {
    trend: function(metricName) {
      this.metricName = metricName;
      this.chartData = [];
      let arr = [];
      arr[0] = "Year";
      arr[1] = this.metricName;
      this.chartData[0] = arr;
      let i = 1;
      this.companyKeyMetrics.forEach(element => {
        arr = [];
        arr[0] = new Date(element["date"]);
        arr[1] = parseFloat(element[this.metricName]);
        this.chartData[i] = arr;
        i++;
      });
      this.chartOptions.chart.title = this.metricName;
    },
    format: function(num, digits) {
      var si = [
        { value: 1, char: "" },
        { value: 1e3, char: "K" },
        { value: 1e6, char: "M" },
        { value: 1e9, char: "B" },
        { value: 1e12, char: "T" },
        { value: 1e15, char: "P" },
        { value: 1e18, char: "E" }
      ];
      var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      var i;
      for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
          break;
        }
      }
      return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].char;
    }
  },
  mounted() {
    app.axios
      .get(app.config.companyKeyMetricsBaseUrl + this.symbolId)
      .then(response => {
        this.companyKeyMetrics = response.data.metrics;
      });
  }
};
</script>

<style scoped>
</style>