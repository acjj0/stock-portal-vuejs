// Followed steps here to build this component https://alligator.io/vuejs/vue-autocomplete-component/ then edited to customize for my needs

<template>
  <div class="autocomplete">
    <label>Enter Symbol:</label>
    <input
      type="text"
      id="autoCompleteText"
      v-on:input="onChange"
      v-model="search"
      v-on:keydown.down="onArrowDown"
      v-on:keydown.up="onArrowUp"
      v-on:keydown.enter="onKeyDownEnter"
      v-on:enter="onEnter"
      v-on:click="onEnter"
      v-on:onblur="onEnter"
      vbind:key="symbol"
    />

    <span v-if="showButton">
      <button v-on:click="onEnter">Research</button>
    </span>

    <span v-if="dropdownOpen">
      <ul id="autocomplete-results" class="autocomplete-results">
        <li class="loading" v-if="isLoading">Loading results...</li>
        <li
          v-else
          v-for="(result, i) in results"
          v-bind:key="i"
          @click="setResult(result)"
          class="autocomplete-result"
          :class="{ 'is-active': i === arrowCounter }"
        >{{ result.symbol}}: {{result.name}}</li>
      </ul>
    </span>
  </div>
</template>

<script>
import * as app from "./../app.js";

export default {
  name: "autocomplete",

  props: {
    showButton: {
      type: Boolean,
      required: false,
      default: false
    },
    symbol: {
      type: String,
      required: false,
      default: ""
    },
    isAsync: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data() {
    return {
      dropdownOpen: false,
      results: [],

      search: "",
      isLoading: false,
      arrowCounter: 0
    };
  },

  methods: {
    onChange() {
      this.search = this.search.toUpperCase();

      this.filterResults(this.search, ["symbol", "name"]);
      this.dropdownOpen = true;
    },

    filterResults(search, keys) {
      var upperSearch = search.toUpperCase();

      // inspiration for this filter comes from this posting https://stackoverflow.com/questions/45991273/how-to-use-filter-to-search-in-multiple-key-values-of-objects-in-an-array
      this.results = app.store.symbolsList.filter(function(element) {
        return keys.some(key =>
          String(element[key])
            .toUpperCase()
            .includes(upperSearch)
        );
      });
    },

    setResult(result) {
      this.search = result.symbol;
      this.dropdownOpen = false;
    },
    onArrowDown() {
      if (this.arrowCounter < this.results.length) {
        this.arrowCounter = this.arrowCounter + 1;
      }
    },
    onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter - 1;
      }
    },
    onKeyDownEnter() {
      if (this.arrowCounter != -1) {
        this.search = this.results[this.arrowCounter].symbol;
      }
      this.dropdownOpen = false;
      this.arrowCounter = -1;

      this.onEnter();
    },
    onEnter() {
      // window.console.log("inside onEnter");
      let valueInTextBox = document.getElementById("autoCompleteText").value;
      if (this.search == "") {
        this.search = valueInTextBox;
      }
      // Pass the search result to the parent page, if there is a result that matches the stock symbols list, and emit a unique event to capture in parent.
      if (
        this.search != "" &&
        app.store.symbolsList.filter(
          element => element.symbol.toUpperCase().indexOf(this.search) == 0
        ).length > 0
      ) {
        this.$emit("symbolentered", this.search);
      }
    },
    handleClickOutside(evt) {
      if (!this.$el.contains(evt.target)) {
        this.dropdownOpen = false;
        this.arrowCounter = -1;
      }
      this.onEnter();
    }
  },
  watch: {
    symbols: function(val, oldValue) {
      // actually compare them
      if (val.length !== oldValue.length) {
        this.results = val;
        this.isLoading = false;
      }
    }
  },
  mounted() {
    this.search = this.symbol;
    document.addEventListener("click", this.handleClickOutside);
  },
  destroyed() {
    document.removeEventListener("click", this.handleClickOutside);
  }
};
</script>

<style>
.autocomplete {
  position: relative;
}

.autocomplete-results {
  padding: 0;
  margin: 0;
  border: 1px solid #eeeeee;
  height: 120px;
  overflow: auto;
  width: 100%;
}

.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  cursor: pointer;
}

.autocomplete-result.is-active,
.autocomplete-result:hover {
  background-color: #4aae9b;
  color: white;
}
</style>