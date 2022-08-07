<template>
  <div id="app">
    <nav>
      <ul>
        <li v-for="link in links" :key="link">
          <router-link exact :to="{ name: link }">{{ link }}</router-link>
        </li>
      </ul>
    </nav>

    <router-view></router-view>
  </div>
</template>

<script>
import * as app from "./app.js";

export default {
  name: "app",
  components: {},
  data: function() {
    return {
      links: ["today", "research", "portfolio"],
      symbolsList: null
    };
  },
  mounted() {
    app.axios.get(app.config.stockListUrl).then(response => {
      app.store.symbolsList = response.data.symbolsList;
      app.store.symbolsList.sort((a, b) =>
        a.symbol.length > b.symbol.length
          ? 1
          : a.symbol.length === b.symbol.length
          ? a.symbol > b.symbol
            ? 1
            : -1
          : -1
      );
    });
  }
};
</script>

<style lang='scss'>
@import "./assets/css/stocks.scss";
</style>
