document.addEventListener("DOMContentLoaded", () => {
  const amountInput = document.getElementById("exchange-amount");
  const fromCurrency = document.getElementById("from-currency");
  const toCurrency = document.getElementById("to-currency");

  const calculateButton = document.getElementById("calculate-exchange");
  const swapButton = document.getElementById("swap-currencies");

  const errorBox = document.getElementById("exchange-error");
  const resultBox = document.getElementById("exchange-result");
  const resultContent = document.getElementById("exchange-result-content");

  const summaryAmount = document.getElementById("summary-amount");
  const summaryFrom = document.getElementById("summary-from");
  const summaryTo = document.getElementById("summary-to");
  const summaryRate = document.getElementById("summary-rate");
  const summaryConverted = document.getElementById("summary-converted");

  const currencyNames = {
    USD: "US Dollar",
    EUR: "Euro",
    GBP: "British Pound",
    INR: "Indian Rupee",
    CAD: "Canadian Dollar",
    AUD: "Australian Dollar",
    JPY: "Japanese Yen",
    CNY: "Chinese Yuan",
    AED: "UAE Dirham",
    SGD: "Singapore Dollar",
    CHF: "Swiss Franc"
  };

  const currencySymbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    INR: "₹",
    CAD: "CA$",
    AUD: "A$",
    JPY: "¥",
    CNY: "¥",
    AED: "د.إ",
    SGD: "S$",
    CHF: "CHF"
  };


  /* ---------------------------------------
     Error handling
  --------------------------------------- */

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;

    resultBox.hidden = true;

    window.setTimeout(() => {
      errorBox.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 50);
  }


  function clearError() {
    errorBox.textContent = "";
    errorBox.hidden = true;
  }


  /* ---------------------------------------
     Number formatting
  --------------------------------------- */

  function formatNumber(value, decimals = 2) {
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }


  function formatRate(value) {
    if (value >= 100) {
      return formatNumber(value, 2);
    }

    if (value >= 1) {
      return formatNumber(value, 4);
    }

    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 6
    });
  }


  function formatCurrency(value, currency) {
    const symbol = currencySymbols[currency] || currency;

    let decimals = 2;

    if (currency === "JPY") {
      decimals = 0;
    }

    return `${symbol}${formatNumber(value, decimals)}`;
  }


  /* ---------------------------------------
     Get exchange rate
  --------------------------------------- */

  async function getExchangeRate(from, to) {

    /*
     * Same currency = 1:1
     */
    if (from === to) {
      return {
        rate: 1,
        date: null
      };
    }


    /*
     * Frankfurter API v2
     *
     * Example:
     * https://api.frankfurter.dev/v2/rate/usd/eur
     */
    const url =
      `https://api.frankfurter.dev/v2/rate/${from.toLowerCase()}/${to.toLowerCase()}`;


    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      },
      cache: "no-store"
    });


    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }


    const data = await response.json();


    if (
      !data ||
      typeof data.rate !== "number" ||
      !Number.isFinite(data.rate) ||
      data.rate <= 0
    ) {
      throw new Error("Invalid API response");
    }


    return {
      rate: data.rate,
      date: data.date || null
    };
  }


  /* ---------------------------------------
     Convert currency
  --------------------------------------- */

  async function convertCurrency() {

    clearError();


    const amount = Number(amountInput.value);

    const from = fromCurrency.value;

    const to = toCurrency.value;


    /*
     * Validate amount
     */
    if (!Number.isFinite(amount) || amount < 0) {

      showError(
        "Please enter a valid amount greater than or equal to 0."
      );

      return;
    }


    /*
     * Validate currencies
     */
    if (!from || !to) {

      showError(
        "Please select both currencies."
      );

      return;
    }


    /*
     * Disable button while loading
     */
    calculateButton.disabled = true;

    calculateButton.textContent = "Converting...";


    try {

      const exchangeData =
        await getExchangeRate(from, to);


      const rate = exchangeData.rate;

      const rateDate = exchangeData.date;


      const convertedAmount =
        amount * rate;


      const fromName =
        currencyNames[from] || from;


      const toName =
        currencyNames[to] || to;


      /* ---------------------------------------
         Main result
      --------------------------------------- */

      resultContent.innerHTML = `

        <div class="calculator-results-grid">

          <div class="result-card">

            <h3>Amount</h3>

            <p>
              ${formatCurrency(amount, from)}
            </p>

          </div>


          <div class="result-card">

            <h3>Exchange Rate</h3>

            <p>
              1 ${from} =
              ${formatRate(rate)}
              ${to}
            </p>

          </div>


          <div class="result-card">

            <h3>Converted Amount</h3>

            <p>
              ${formatCurrency(convertedAmount, to)}
            </p>

          </div>

        </div>


        <p>

          <strong>
            ${formatCurrency(amount, from)}
          </strong>

          equals approximately

          <strong>
            ${formatCurrency(convertedAmount, to)}
          </strong>.

        </p>


        <p>

          Exchange rate used:

          <strong>
            1 ${from} =
            ${formatRate(rate)}
            ${to}
          </strong>

        </p>


        ${
          rateDate
            ? `
              <p class="small-text">
                Exchange rate date:
                <strong>${rateDate}</strong>
              </p>
            `
            : ""
        }


        <p class="small-text">

          Exchange rates are provided for
          informational and calculation purposes.
          Banks, card providers, and exchange services
          may use different rates or add fees and
          conversion markups.

        </p>

      `;


      /*
       * Show result
       */
      resultBox.hidden = false;


      /* ---------------------------------------
         Summary
      --------------------------------------- */

      summaryAmount.textContent =
        formatCurrency(amount, from);


      summaryFrom.textContent =
        `${from} — ${fromName}`;


      summaryTo.textContent =
        `${to} — ${toName}`;


      summaryRate.textContent =
        `1 ${from} = ${formatRate(rate)} ${to}`;


      summaryConverted.textContent =
        formatCurrency(convertedAmount, to);


      /*
       * Scroll down to result automatically
       */
      window.setTimeout(() => {

        resultBox.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }, 100);


    } catch (error) {

      console.error(
        "Currency Exchange Error:",
        error
      );


      let message =
        "Unable to retrieve the exchange rate right now.";


      if (
        error.message.includes("HTTP 404")
      ) {

        message =
          "This currency pair is not available right now. Please try another currency pair.";

      } else if (
        error.message.includes("HTTP 429")
      ) {

        message =
          "The exchange-rate service is temporarily busy. Please try again shortly.";

      } else if (
        error instanceof TypeError ||
        error.message.toLowerCase().includes("failed to fetch")
      ) {

        message =
          "The exchange-rate service could not be reached. Please try again shortly.";

      }


      showError(message);

    } finally {

      calculateButton.disabled = false;

      calculateButton.textContent =
        "Convert Currency";

    }

  }


  /* ---------------------------------------
     Swap currencies
  --------------------------------------- */

  function swapCurrencies() {

    const oldFrom =
      fromCurrency.value;

    const oldTo =
      toCurrency.value;


    fromCurrency.value =
      oldTo;

    toCurrency.value =
      oldFrom;


    clearError();


    /*
     * Recalculate if result is already visible
     */
    if (!resultBox.hidden) {

      convertCurrency();

    }

  }


  /* ---------------------------------------
     Button events
  --------------------------------------- */

  calculateButton.addEventListener(
    "click",
    convertCurrency
  );


  swapButton.addEventListener(
    "click",
    swapCurrencies
  );


  /* ---------------------------------------
     Enter key
  --------------------------------------- */

  amountInput.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Enter") {

        event.preventDefault();

        convertCurrency();

      }

    }
  );


  /* ---------------------------------------
     Clear errors when selection changes
  --------------------------------------- */

  fromCurrency.addEventListener(
    "change",
    clearError
  );


  toCurrency.addEventListener(
    "change",
    clearError
  );

});