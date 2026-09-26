(function () {
  "use strict";

  const purchasePriceInput = document.getElementById(
    "depreciation-purchase-price"
  );

  const currentValueInput = document.getElementById(
    "depreciation-current-value"
  );

  const yearsInput = document.getElementById(
    "depreciation-years"
  );

  const currencySelect = document.getElementById(
    "depreciation-currency"
  );

  const customCurrencyGroup = document.getElementById(
    "depreciation-custom-currency-group"
  );

  const customCurrencyInput = document.getElementById(
    "depreciation-custom-currency"
  );

  const calculateButton = document.getElementById(
    "calculate-depreciation"
  );

  const resetButton = document.getElementById(
    "reset-depreciation"
  );

  const errorBox = document.getElementById(
    "depreciation-error"
  );

  const resultBox = document.getElementById(
    "depreciation-result"
  );

  const resultContent = document.getElementById(
    "depreciation-result-content"
  );

  const summaryOriginal = document.getElementById(
    "depreciation-summary-original"
  );

  const summaryCurrent = document.getElementById(
    "depreciation-summary-current"
  );

  const summaryLoss = document.getElementById(
    "depreciation-summary-loss"
  );

  const summaryRate = document.getElementById(
    "depreciation-summary-rate"
  );


  function formatNumber(value, decimals = 2) {
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }


  function getCurrencySymbol() {
    if (currencySelect.value === "custom") {
      const customSymbol =
        customCurrencyInput.value.trim();

      return customSymbol || "$";
    }

    return currencySelect.value;
  }


  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
    resultBox.hidden = true;
  }


  function clearError() {
    errorBox.textContent = "";
    errorBox.hidden = true;
  }


  function calculateDepreciation() {
    clearError();

    const purchasePrice =
      parseFloat(purchasePriceInput.value);

    const currentValue =
      parseFloat(currentValueInput.value);

    const ownershipYears =
      parseFloat(yearsInput.value);


    if (
      !Number.isFinite(purchasePrice) ||
      purchasePrice <= 0
    ) {
      showError(
        "Please enter an original purchase price greater than 0."
      );

      purchasePriceInput.focus();
      return;
    }


    if (
      !Number.isFinite(currentValue) ||
      currentValue < 0
    ) {
      showError(
        "Please enter a valid current vehicle value."
      );

      currentValueInput.focus();
      return;
    }


    if (currentValue > purchasePrice) {
      showError(
        "Current vehicle value cannot be greater than the original purchase price for a depreciation calculation."
      );

      currentValueInput.focus();
      return;
    }


    if (
      !Number.isFinite(ownershipYears) ||
      ownershipYears <= 0
    ) {
      showError(
        "Please enter an ownership period greater than 0 years."
      );

      yearsInput.focus();
      return;
    }


    if (
      currencySelect.value === "custom" &&
      customCurrencyInput.value.trim() === ""
    ) {
      showError(
        "Please enter a custom currency symbol."
      );

      customCurrencyInput.focus();
      return;
    }


    const totalDepreciation =
      purchasePrice - currentValue;


    const depreciationPercentage =
      (totalDepreciation / purchasePrice) * 100;


    const remainingValuePercentage =
      (currentValue / purchasePrice) * 100;


    const averageAnnualDepreciation =
      totalDepreciation / ownershipYears;


    const averageAnnualPercentage =
      depreciationPercentage / ownershipYears;


    const currency =
      getCurrencySymbol();


    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Total Depreciation</h3>
          <p>
            <strong>
              ${currency}${formatNumber(totalDepreciation)}
            </strong>
          </p>
          <p>Total value lost</p>
        </div>

        <div class="result-card">
          <h3>Depreciation Percentage</h3>
          <p>
            <strong>
              ${formatNumber(depreciationPercentage)}%
            </strong>
          </p>
          <p>Percentage of original value lost</p>
        </div>

        <div class="result-card">
          <h3>Current Value</h3>
          <p>
            <strong>
              ${currency}${formatNumber(currentValue)}
            </strong>
          </p>
          <p>${formatNumber(remainingValuePercentage)}% of original value</p>
        </div>

        <div class="result-card">
          <h3>Average Annual Depreciation</h3>
          <p>
            <strong>
              ${currency}${formatNumber(averageAnnualDepreciation)}
            </strong>
          </p>
          <p>Average value lost per year</p>
        </div>

        <div class="result-card">
          <h3>Ownership Period</h3>
          <p>
            <strong>
              ${formatNumber(ownershipYears)}
            </strong>
          </p>
          <p>Years</p>
        </div>

        <div class="result-card">
          <h3>Average Annual Rate</h3>
          <p>
            <strong>
              ${formatNumber(averageAnnualPercentage)}%
            </strong>
          </p>
          <p>Simple average per year</p>
        </div>

      </div>

      <div class="info-box">

        <h3>Car Depreciation Calculation</h3>

        <p>
          Depreciation =
          ${currency}${formatNumber(purchasePrice)}
          −
          ${currency}${formatNumber(currentValue)}
          =
          <strong>
            ${currency}${formatNumber(totalDepreciation)}
          </strong>
        </p>

        <p>
          Depreciation percentage =
          ${currency}${formatNumber(totalDepreciation)}
          ÷
          ${currency}${formatNumber(purchasePrice)}
          × 100 =
          <strong>
            ${formatNumber(depreciationPercentage)}%
          </strong>
        </p>

        <p>
          Average annual depreciation =
          ${currency}${formatNumber(totalDepreciation)}
          ÷
          ${formatNumber(ownershipYears)}
          years =
          <strong>
            ${currency}${formatNumber(averageAnnualDepreciation)}
            per year
          </strong>
        </p>

      </div>
    `;


    summaryOriginal.textContent =
      `${currency}${formatNumber(purchasePrice)}`;

    summaryCurrent.textContent =
      `${currency}${formatNumber(currentValue)}`;

    summaryLoss.textContent =
      `${currency}${formatNumber(totalDepreciation)}`;

    summaryRate.textContent =
      `${formatNumber(depreciationPercentage)}%`;


    resultBox.hidden = false;


    setTimeout(() => {
      resultBox.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 50);
  }


  function resetDepreciation() {
    purchasePriceInput.value = "";
    currentValueInput.value = "";
    yearsInput.value = "";

    currencySelect.value = "$";

    customCurrencyInput.value = "";
    customCurrencyGroup.hidden = true;

    clearError();

    resultContent.innerHTML = "";
    resultBox.hidden = true;

    summaryOriginal.textContent = "—";
    summaryCurrent.textContent = "—";
    summaryLoss.textContent = "—";
    summaryRate.textContent = "—";

    purchasePriceInput.focus();
  }


  currencySelect.addEventListener(
    "change",
    function () {

      if (currencySelect.value === "custom") {
        customCurrencyGroup.hidden = false;
        customCurrencyInput.focus();
      } else {
        customCurrencyGroup.hidden = true;
        customCurrencyInput.value = "";
      }

    }
  );


  calculateButton.addEventListener(
    "click",
    calculateDepreciation
  );


  resetButton.addEventListener(
    "click",
    resetDepreciation
  );


  [
    purchasePriceInput,
    currentValueInput,
    yearsInput,
    customCurrencyInput
  ].forEach((input) => {

    input.addEventListener(
      "keydown",
      function (event) {

        if (event.key === "Enter") {
          event.preventDefault();
          calculateDepreciation();
        }

      }
    );

  });

})();