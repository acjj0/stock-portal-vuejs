// /src/Portfolio.js
export default class Portfolio
{

    /**
     * 
     */
    constructor()
    {
        // Extract JSON portfolio string from local storage
        let portfolio = localStorage.getItem('portfolio');

        // Parse JSON portfolio String to `holdings` object
        this.holdings = (portfolio) ? JSON.parse(portfolio) : [];
    }

    /**
     * Getter method for holdings
     */
    getHoldings()
    {
        return this.holdings;
    }

    /**
     * Returns how many total holdings are in the portfolio
     */
    /**
   * Get an holding from holdings via symbol
   * Returns null if symbol does not exist in holdings
   */
    getItem(symbol1)
    {
        // window.console.log("inside portfolio getItem symbol1 passed in is - " + symbol1);
        let m = this.holdings.find(({ symbol }) => symbol === symbol1) || null;
        // window.console.log("inside portfolio getitem after find() we get the result - " + m.symbol);
        return m;
    }

    count()
    {
        return this.holdings.length;

    }

    update(holdings)
    {
        this.holdings = holdings;
        this.updateToStorage();
    }

    /**
     * Updates portfolio in localstorage
     */
    updateToStorage()
    {
        localStorage.setItem('portfolio', JSON.stringify(this.holdings))
    }

    /**
     * Add a new holding of the given symbol
     */
    add(symbol, shares, cost)
    {

        // First see if symbol is already present
        // let holding = this.getItem(symbol)

        // if (holding)
        // {
        //     window.console.log("inside portfolio add holding returned in if part is - " + holding.symbol);
        //     // Symbol is in portfolio already; calculate new average cost per share and new total shares

        //     holding.cost = ((holding.shares * holding.cost) + (shares * cost)) / (holding.shares + shares);
        //     holding.shares += shares;

        // } else
        // {
        window.console.log("inside portfolio add holding in else part returned is - " + symbol + shares + cost);
        // Product not in portfolio, add as new holding 
        // this.holdings.push({
        //     symbol: symbol,
        //     shares: shares,
        //     cost: cost
        // });
        // }

        this.updateToStorage();
    }

    /**
     * Remove an holding from holdings via symbol
     */
    remove(symbol)
    {
        let holding = this.getItem(symbol);

        if (holding)
        {
            let holdingIndex = this.holdings.indexOf(holding);
            this.holdings.splice(holdingIndex, 1);
            this.updateToStorage();
        }
    }


}