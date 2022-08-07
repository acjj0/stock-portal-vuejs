// export { default as AutoComplete } from './components/AutoComplete.vue';

export { default as Portfolio } from './Portfolio.js';

export const axios = require("axios");

export const config =
{
    stockListUrl: "https://financialmodellingprep.com/api/v3/company/stock/list",
    majorIndexesUrl: "https://financialmodelingprep.com/api/v3/majors-indexes",
    mostActiveStockUrl: "https://financialmodelingprep.com/api/v3/stock/actives",
    mostGainerStockUrl: "https://financialmodelingprep.com/api/v3/stock/gainers",
    mostLoserStockUrl: "https://financialmodelingprep.com/api/v3/stock/losers",
    sectorPerformanceUrl: "https://financialmodelingprep.com/api/v3/stock/sectors-performance",
    baseProfileUrl: "https://financialmodellingprep.com/api/v3/company/profile/",
    companyKeyMetricsBaseUrl: "https://financialmodelingprep.com/api/v3/company-key-metrics/",
    companiesPriceListUrl: "https://financialmodelingprep.com/api/v3/stock/real-time-price/"
}

export let store =
{
    symbolsList: null,
}

