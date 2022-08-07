<template>
  <div id="portfoliopage">
    <h1></h1>
    <button v-if="modeEditConfirm" v-on:click="editConfirmPressed">{{modeEditConfirm}}</button>
    <table>
      <tr>
        <th v-for="(heading, column) in tableHeadings" v-bind:key="column">{{heading}}</th>
      </tr>
      <tr v-for="(holding, index) in holdings" v-bind:key="index">
        <td>
          <label
            v-if="(modeEditConfirm || (modeAddConfirm=='Confirm' && index!=(holdings.length-1)))"
          >
            <router-link
              :to="{name:'researchsym', params:{'symbolId': holding.symbol}}"
            >{{holding.symbol}}</router-link>
          </label>
          <label v-else-if="modeAddConfirm=='Confirm'">
            <auto-complete
              :showButton="false"
              :symbolId="holding.symbol"
              v-on:symbolentered="symbolEntered"
            />
          </label>
        </td>
        <td>
          <label
            v-if="modeEditConfirm=='Edit' || (modeAddConfirm=='Confirm' && index!=holdings.length-1)"
          >{{holding.shares}}</label>
          <label
            v-else-if="modeEditConfirm=='Confirm' || (modeAddConfirm=='Confirm' && index==holdings.length-1)"
          >
            <input v-model.number="holding.shares" />
          </label>
        </td>
        <td>
          <label
            v-if="modeEditConfirm=='Edit' || (modeAddConfirm=='Confirm' && index!=holdings.length-1)"
          >{{Math.round(holding.cost)}}</label>
          <label
            v-else-if="modeEditConfirm=='Confirm' || (modeAddConfirm=='Confirm' && index==holdings.length-1)"
          >
            <input v-model.number="holding.cost" />
          </label>
        </td>
        <td>
          <div>{{Math.round(holding.shares * holding.cost)}}</div>
        </td>
        <td>
          <div v-if="companiesPriceList">
            <label v-for="(marketPrice, index2) in companiesPriceList" v-bind:key="index2">
              <label v-if="marketPrice.symbol == holding.symbol">{{marketPrice.price}}</label>
            </label>
          </div>
        </td>
        <td>
          <div v-if="companiesPriceList">
            <label v-for="(marketPrice, index3) in companiesPriceList" v-bind:key="index3">
              <label
                v-if="marketPrice.symbol == holding.symbol"
              >{{Math.round(holding.shares * marketPrice.price)}}</label>
            </label>
          </div>
        </td>
        <td>
          <div v-if="companiesPriceList">
            <label v-for="(marketPrice, index4) in companiesPriceList" v-bind:key="index4">
              <label
                v-if="marketPrice.symbol == holding.symbol"
              >{{Math.round((holding.shares * marketPrice.price) - (holding.shares * holding.cost))}}</label>
            </label>
          </div>
        </td>
        <td>
          <button
            v-if="modeAddConfirm=='Confirm' && index == holdings.length-1"
            v-on:click="deleteCancelPressed(holding.symbol)"
          >Cancel</button>
          <button
            v-else-if="modeAddConfirm=='Add'"
            v-on:click="deleteCancelPressed(holding.symbol)"
          >Delete</button>
        </td>
      </tr>
    </table>
    <button v-if="modeAddConfirm" v-on:click="addConfirmPressed">{{modeAddConfirm}}</button>
    <transition name="fade">
      <div :class="alertType" v-if="alert">{{alertMessage}}</div>
    </transition>
  </div>
</template>

<script>
import * as app from "./../../app.js";
import AutoComplete from "./../AutoComplete.vue";

export default {
  name: "PortfolioPage",
  components: { "auto-complete": AutoComplete },
  data: function() {
    return {
      Portfolio: null,
      holdings: [],
      symbolsList: "",
      companiesPriceList: null,
      modeEditConfirm: "Edit",
      modeAddConfirm: "Add",
      tableHeadings: [
        "Symbol",
        "#shares",
        "Cost/Share",
        "Total Cost",
        "Market Price",
        "Total Market Value",
        "Profit/Loss"
      ],
      sharedState: app.store,
      alertType: "",
      alert: false,
      alertMessage: ""
    };
  },
  methods: {
    symbolEntered: function(symbol) {
      this.holdings[this.holdings.length - 1].symbol = symbol;
    },
    editConfirmPressed: function() {
      if (this.modeEditConfirm == "Confirm") {
        this.updateToPortfolio(this.holdings);
        this.modeEditConfirm = "Edit";
        this.modeAddConfirm = "Add";
        this.getMarketPrice();
      } else {
        this.modeEditConfirm = "Confirm";
        this.modeAddConfirm = null;
      }
    },
    addConfirmPressed: function() {
      let hl = this.holdings.length;
      if (this.modeAddConfirm == "Confirm") {
        // Table should not accept holdings with no symbols. Alert the user about this and allow them to cancel or add the symbol.
        if (this.holdings[hl - 1].symbol == "") {
          this.alert = true;
          this.alertType = "alertbad";
          this.alertMessage =
            "You must choose a symbol from the drop down with either the Enter key or a mouse click";
          setTimeout(() => (this.alert = false), 2500);
        } else if (this.holdings[hl - 1].shares == 0) {
          this.alert = true;
          this.alertType = "alertbad";
          this.alertMessage = "You must choose a number of shares";
          setTimeout(() => (this.alert = false), 2500);
        }
        // If info is successfully entered, find that last entered holding and add to portfolio.
        // Note that in the Portfolio, this addition may be aggregated with existing holdings of the same symbol
        else {
          this.addToPortfolio(
            this.holdings[hl - 1].symbol,
            this.holdings[hl - 1].shares,
            this.holdings[hl - 1].cost
          );
          this.modeAddConfirm = "Add";
          this.modeEditConfirm = "Edit";
        }
      } else {
        this.holdings[hl] = {
          symbol: "",
          shares: 0,
          cost: 0
        };
        this.modeAddConfirm = "Confirm";
        this.modeEditConfirm = null;

        this.alert = true;
        this.alertType = "alertinfo";
        this.alertMessage =
          "Choose symbol, enter shares & cost/share. To skip, press Cancel. To add to Portfolio, press Confirm";
        setTimeout(() => (this.alert = false), 10000);
      }
    },
    deleteCancelPressed: function(symbol) {
      if (symbol == "") {
        this.holdings.splice(this.holdings.length - 1, 1);
      } else {
        this.removeFromPortfolio(symbol);
      }
      this.modeAddConfirm = "Add";
      // Show edit button only if there are some holdings to edit.
      if (this.holdings.length > 0) {
        this.modeEditConfirm = "Edit";
      }
    },
    updateToPortfolio: function(holdings) {
      this.Portfolio.update(holdings);
      this.holdings = this.Portfolio.getHoldings();
      this.getMarketPrice();

      this.alert = true;
      this.alertType = "alertgood";
      this.alertMessage = "Your portfolio is up to date as reflected above";
      setTimeout(() => (this.alert = false), 1500);
    },
    addToPortfolio: function(symbol, shares, price) {
      this.Portfolio.add(symbol, shares, price);
      this.holdings = null;
      this.holdings = this.Portfolio.getHoldings();
      this.getMarketPrice();

      this.alert = true;
      this.alertType = "alertgood";
      this.alertMessage = symbol + " has been added to your Portfolio";
      setTimeout(() => (this.alert = false), 1500);
    },
    removeFromPortfolio: function(symbol) {
      this.Portfolio.remove(symbol);
      this.holdings = this.Portfolio.getHoldings();
      this.getMarketPrice();

      this.alert = true;
      this.alertType = "alertgood";
      this.alertMessage = symbol + " has been removed from your Portfolio";
      setTimeout(() => (this.alert = false), 1500);
    },
    updateSymbolsList: function() {
      this.symbolsList = "";
      this.holdings = this.Portfolio.getHoldings();
      this.holdings.forEach(element => {
        if (this.symbolsList == "") {
          this.symbolsList = element.symbol;
        } else {
          this.symbolsList = this.symbolsList + "," + element.symbol;
        }
      });
    },
    getMarketPrice: function() {
      this.companiesPriceList = null;
      this.updateSymbolsList();

      app.axios
        .get(app.config.companiesPriceListUrl + this.symbolsList)
        .then(response => {
          if (this.holdings.length > 1) {
            this.companiesPriceList = response.data.companiesPriceList;
          }
          // If only 1 symbol is passed, the format of the data is different, so don't need data.companiesPriceList for the else
          else {
            this.companiesPriceList = response;
          }
        });
    }
  },
  mounted() {
    this.Portfolio = new app.Portfolio();

    this.holdings = this.Portfolio.getHoldings();

    if (this.holdings.length > 0) {
      this.getMarketPrice();
    }

    if (this.holdings.length == 0) {
      this.alert = true;
      this.alertType = "alertinfo";
      this.alertMessage = "Click Add to portfolio to begin";
      this.modeEditConfirm = null;
      setTimeout(() => (this.alert = false), 5000);
    }
  }
};
</script>

<style scoped>
</style>