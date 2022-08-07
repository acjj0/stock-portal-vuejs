<template>
  <div id="today-page">
    <table v-if="majorIndexesList">
      Top US Indexes
      <tr>
        <th>Exchange</th>
        <th>Price</th>
        <th>Change</th>
      </tr>
      <tr v-for="index in majorIndexesList.slice(0,3)" v-bind:key="index.indexName">
        <td>{{index.indexName}}</td>
        <td>{{index.price}}</td>
        <td>{{index.changes}}</td>
      </tr>
    </table>
    <table v-if="mostActiveStockList">
      Most Active
      <tr>
        <th>Stock</th>
        <th>Price</th>
        <th>Change</th>
      </tr>
      <tr v-for="stock in mostActiveStockList.slice(0,5)" v-bind:key="stock.ticker">
        <td>
          <router-link
            :to="{name:'researchsym', params:{'symbolId': stock.ticker}}"
          >{{stock.ticker}}</router-link>
        </td>
        <td>{{stock.price}}</td>
        <td>{{stock.changes}}</td>
      </tr>
    </table>
    <table v-if="mostGainerStockList">
      Top Gainers
      <tr>
        <th>Stock</th>
        <th>Price</th>
        <th>Change</th>
      </tr>
      <tr v-for="stock in mostGainerStockList.slice(0,5)" v-bind:key="stock.ticker">
        <td>
          <router-link
            :to="{name:'researchsym', params:{'symbolId': stock.ticker}}"
          >{{stock.ticker}}</router-link>
        </td>
        <td>{{stock.price}}</td>
        <td>{{stock.changes}}</td>
      </tr>
    </table>
    <table v-if="mostLoserStockList">
      Top Losers
      <tr>
        <th>Stock</th>
        <th>Price</th>
        <th>Change</th>
      </tr>
      <tr v-for="stock in mostLoserStockList.slice(0,5)" v-bind:key="stock.ticker">
        <td>
          <router-link
            :to="{name:'researchsym', params:{'symbolId': stock.ticker}}"
          >{{stock.ticker}}</router-link>
        </td>
        <td>{{stock.price}}</td>
        <td>{{stock.changes}}</td>
      </tr>
    </table>

    <table v-if="sectorPerformanceList">
      Sector Wise Performance
      <tr>
        <th>Sector</th>
        <th>%Change</th>
      </tr>
      <tr v-for="sector in sectorPerformanceList" v-bind:key="sector.sector">
        <td>{{sector.sector}}</td>
        <td>{{sector.changesPercentage}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import * as app from "./../../app.js";

export default {
  name: "TodayPage",
  data: function() {
    return {
      majorIndexesList: null,
      mostActiveStockList: null,
      mostGainerStockList: null,
      mostLoserStockList: null,
      sectorPerformanceList: null
    };
  },
  mounted() {
    app.axios.get(app.config.majorIndexesUrl).then(response => {
      this.majorIndexesList = response.data.majorIndexesList;
    });
    app.axios.get(app.config.mostActiveStockUrl).then(response => {
      this.mostActiveStockList = response.data.mostActiveStock;
    });
    app.axios.get(app.config.mostGainerStockUrl).then(response => {
      this.mostGainerStockList = response.data.mostGainerStock;
    });
    app.axios.get(app.config.mostLoserStockUrl).then(response => {
      this.mostLoserStockList = response.data.mostLoserStock;
    });
    app.axios.get(app.config.sectorPerformanceUrl).then(response => {
      this.sectorPerformanceList = response.data.sectorPerformance;
    });
  }
};
</script>

<style scoped>
.increase {
  color: #0b893e;
}
.decrease {
  color: #bf1722;
}
</style>