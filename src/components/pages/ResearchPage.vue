<template>
  <div id="research-page">
    <h1></h1>
    <!-- <input v-model="symbol" v-on:keyup.enter="symbolEntered" v-on:keyup="symbolLetterTyped" /> -->
    <div v-if="sharedState.symbolsList">
      <auto-complete :showButton="true" :symbolId="symbol" v-on:symbolentered="symbolEntered" />
    </div>

    <div v-if="symbolId!=''">
      <show-profile :symbolId="symbolId" v-bind:key="refreshProfile"></show-profile>

      <show-metrics :symbolId="symbolId" v-bind:key="refreshMetrics"></show-metrics>
    </div>
  </div>
</template>

<script>
import * as app from "./../../app.js";
import AutoComplete from "./../AutoComplete.vue";
import ShowProfile from "./../ShowProfile.vue";
import ShowMetrics from "./../ShowMetrics.vue";

export default {
  name: "ResearchPage",
  props: ["symbolId"],
  components: {
    "auto-complete": AutoComplete,
    "show-profile": ShowProfile,
    "show-metrics": ShowMetrics
  },
  data: function() {
    return {
      symbol: "",
      sharedState: app.store,
      refreshProfile: 0,
      refreshMetrics: 10
    };
  },
  methods: {
    symbolLetterTyped: function() {
      this.symbol = this.symbol.toUpperCase();
    },
    symbolEntered: function(symbol) {
      if (this.symbolId != symbol) {
        this.$router.push({
          name: "researchsym",
          params: { symbolId: symbol }
        });
      }
      if (symbol != "") {
        this.refreshProfile += 1;
        this.refreshMetrics += 1;
      }
    }
  },
  mounted() {
    this.symbol = this.symbolId;
  }
};
</script>

<style scoped>
</style>