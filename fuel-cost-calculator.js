document.addEventListener("DOMContentLoaded", () => {
  const distanceInput = document.getElementById("fuel-distance");
  const distanceUnitInput = document.getElementById("fuel-distance-unit");

  const economyInput = document.getElementById("fuel-economy");
  const economyUnitInput = document.getElementById("fuel-economy-unit");

  const fuelPriceInput = document.getElementById("fuel-price");
  const fuelPriceUnitInput = document.getElementById("fuel-price-unit");

  const currencyInput = document.getElementById("fuel-currency");
  const customCurrencyGroup = document.getElementById("custom-currency-group");
  const customCurrencyInput = document.getElementById("custom-currency");

  const calculateButton = document.getElementById("calculate-fuel");
  const resetButton = document.getElementById("reset-fuel");

  const errorBox = document.getElementById("fuel-error");
  const resultBox = document.getElementById("fuel-result");
  const resultContent = document.getElementById("fuel-result-content");

  const summaryDistance = document.getElementById("summary-fuel-distance");
  const summaryMileage = document.getElementById("summary-fuel-mileage");
  const summaryPrice = document.getElementById("summary-fuel-price");
  const summaryCost = document.getElementById("summary-fuel-cost");


  function formatNumber(value, decimals = 2) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
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


  function updateCustomCurrencyVisibility() {
    const isCustom = currencyInput.value === "OTHER|";

    customCurrencyGroup.hidden = !isCustom;

    if (!isCustom) {
      customCurrencyInput.value = "";
    }
  }


  function getCurrencyData() {
    const selectedValue = currencyInput.value;

    if (selectedValue === "OTHER|") {
      const customSymbol = customCurrencyInput.value.trim();

      if (!customSymbol) {
        return null;
      }

      return {
        code: "CUSTOM",
        symbol: customSymbol
      };
    }

    const parts = selectedValue.split("|");

    return {
      code: parts[0],
      symbol: parts[1]
    };
  }


  function calculateFuelCost() {
    clearError();

    const distance = parseFloat(distanceInput.value);
    const economy = parseFloat(economyInput.value);
    const fuelPrice = parseFloat(fuelPriceInput.value);

    const distanceUnit = distanceUnitInput.value;
    const economyUnit = economyUnitInput.value;
    const fuelPriceUnit = fuelPriceUnitInput.value;

    const currency = getCurrencyData();


    /* -----------------------------
       Validation
    ----------------------------- */

    if (!Number.isFinite(distance) || distance <= 0) {
      showError("Please enter a valid trip distance greater than 0.");
      distanceInput.focus();
      return;
    }


    if (!Number.isFinite(economy) || economy <= 0) {
      showError("Please enter a valid fuel economy greater than 0.");
      economyInput.focus();
      return;
    }


    if (!Number.isFinite(fuelPrice) || fuelPrice < 0) {
      showError("Please enter a valid fuel price of 0 or greater.");
      fuelPriceInput.focus();
      return;
    }


    if (!currency) {
      showError("Please enter a custom currency symbol.");
      customCurrencyInput.focus();
      return;
    }


    /* -----------------------------
       Distance conversion
       Base unit: kilometers
    ----------------------------- */

    const distanceKm =
      distanceUnit === "mi"
        ? distance * 1.609344
        : distance;


    /* -----------------------------
       Fuel economy conversion
       Base unit: km/L
    ----------------------------- */

    let mileageKmPerLiter;


    if (economyUnit === "kmpl") {

      mileageKmPerLiter = economy;

    } else if (economyUnit === "l100km") {

      /*
       * L/100 km → km/L
       *
       * Example:
       * 6 L/100 km = 100 / 6 = 16.6667 km/L
       */

      mileageKmPerLiter = 100 / economy;

    } else if (economyUnit === "mpg") {

      /*
       * US MPG → km/L
       *
       * 1 US MPG = 0.425143707 km/L
       */

      mileageKmPerLiter =
        economy * 0.425143707;

    } else {

      showError("Please select a valid fuel economy unit.");
      economyUnitInput.focus();
      return;
    }


    /* -----------------------------
       Fuel consumption
       Base unit: liters
    ----------------------------- */

    const fuelUsedLiters =
      distanceKm / mileageKmPerLiter;


    /* -----------------------------
       Fuel price conversion
       Convert entered price to
       price per liter
    ----------------------------- */

    let pricePerLiter;


    if (fuelPriceUnit === "liter") {

      pricePerLiter = fuelPrice;

    } else if (fuelPriceUnit === "gallon") {

      /*
       * US gallon = 3.785411784 liters
       *
       * Example:
       * $3.50 / gallon
       * = $3.50 / 3.785411784 per liter
       */

      pricePerLiter =
        fuelPrice / 3.785411784;

    } else {

      showError("Please select a valid fuel price unit.");
      fuelPriceUnitInput.focus();
      return;
    }


    /* -----------------------------
       Total fuel cost
    ----------------------------- */

    const totalCost =
      fuelUsedLiters * pricePerLiter;


    /* -----------------------------
       Additional calculations
    ----------------------------- */

    const distanceMiles =
      distanceKm / 1.609344;

    const gallonsUsed =
      fuelUsedLiters / 3.785411784;

    const costPerKm =
      totalCost / distanceKm;

    const costPerMile =
      totalCost / distanceMiles;

    const litersPer100Km =
      100 / mileageKmPerLiter;

    const milesPerGallon =
      mileageKmPerLiter / 0.425143707;


    /* -----------------------------
       Display labels
    ----------------------------- */

    const distanceDisplay =
      distanceUnit === "mi"
        ? `${formatNumber(distance)} mi`
        : `${formatNumber(distance)} km`;


    let economyDisplay;

    if (economyUnit === "kmpl") {

      economyDisplay =
        `${formatNumber(economy)} km/L`;

    } else if (economyUnit === "l100km") {

      economyDisplay =
        `${formatNumber(economy)} L/100 km`;

    } else {

      economyDisplay =
        `${formatNumber(economy)} MPG`;
    }


    const fuelPriceDisplay =
      `${currency.symbol}${formatNumber(fuelPrice)} / ${
        fuelPriceUnit === "liter"
          ? "L"
          : "US gal"
      }`;


    /* -----------------------------
       Results
    ----------------------------- */

    resultContent.innerHTML = `

      <div class="calculator-results-grid">


        <div class="result-card">

          <h3>
            Estimated Fuel Used
          </h3>

          <p class="result-value">
            ${formatNumber(fuelUsedLiters)} L
          </p>

          <p>
            Approximately ${formatNumber(gallonsUsed)} US gallons
          </p>

        </div>


        <div class="result-card">

          <h3>
            Total Fuel Cost
          </h3>

          <p class="result-value">
            ${currency.symbol}${formatNumber(totalCost)}
          </p>

          <p>
            Estimated trip fuel expense
          </p>

        </div>


        <div class="result-card">

          <h3>
            Cost Per Kilometer
          </h3>

          <p class="result-value">
            ${currency.symbol}${formatNumber(costPerKm, 3)}
          </p>

          <p>
            Fuel cost per km
          </p>

        </div>


        <div class="result-card">

          <h3>
            Cost Per Mile
          </h3>

          <p class="result-value">
            ${currency.symbol}${formatNumber(costPerMile, 3)}
          </p>

          <p>
            Fuel cost per mile
          </p>

        </div>


        <div class="result-card">

          <h3>
            Fuel Economy
          </h3>

          <p class="result-value">
            ${economyDisplay}
          </p>

          <p>
            ${formatNumber(litersPer100Km, 2)} L/100 km
            ·
            ${formatNumber(milesPerGallon, 2)} MPG
          </p>

        </div>


        <div class="result-card">

          <h3>
            Trip Distance
          </h3>

          <p class="result-value">
            ${distanceDisplay}
          </p>

          <p>
            ${formatNumber(distanceKm)} km
            ·
            ${formatNumber(distanceMiles)} mi
          </p>

        </div>


      </div>


      <div class="info-box">

        <h3>
          Fuel Cost Calculation
        </h3>

        <p>
          Estimated fuel used =
          ${formatNumber(distanceKm)} km ÷
          ${formatNumber(mileageKmPerLiter)} km/L =
          <strong>${formatNumber(fuelUsedLiters)} L</strong>
        </p>

        <p>
          Fuel price =
          <strong>
            ${fuelPriceDisplay}
          </strong>
        </p>

        <p>
          Estimated fuel cost =
          ${formatNumber(fuelUsedLiters)} L ×
          ${currency.symbol}${formatNumber(pricePerLiter)}/L =
          <strong>
            ${currency.symbol}${formatNumber(totalCost)}
          </strong>
        </p>

      </div>

    `;


    /* -----------------------------
       Summary
    ----------------------------- */

    summaryDistance.textContent =
      distanceDisplay;

    summaryMileage.textContent =
      economyDisplay;

    summaryPrice.textContent =
      fuelPriceDisplay;

    summaryCost.textContent =
      `${currency.symbol}${formatNumber(totalCost)}`;


    resultBox.hidden = false;


    resultBox.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }


  /* -----------------------------
     Reset
  ----------------------------- */

  function resetCalculator() {

    distanceInput.value = "";
    distanceUnitInput.value = "km";

    economyInput.value = "";
    economyUnitInput.value = "kmpl";

    fuelPriceInput.value = "";
    fuelPriceUnitInput.value = "liter";

    currencyInput.value = "USD|$";
    customCurrencyInput.value = "";

    customCurrencyGroup.hidden = true;

    clearError();

    resultContent.innerHTML = "";
    resultBox.hidden = true;

    summaryDistance.textContent = "—";
    summaryMileage.textContent = "—";
    summaryPrice.textContent = "—";
    summaryCost.textContent = "—";

    distanceInput.focus();
  }


  /* -----------------------------
     Event listeners
  ----------------------------- */

  currencyInput.addEventListener(
    "change",
    updateCustomCurrencyVisibility
  );


  calculateButton.addEventListener(
    "click",
    calculateFuelCost
  );


  resetButton.addEventListener(
    "click",
    resetCalculator
  );


  [
    distanceInput,
    economyInput,
    fuelPriceInput,
    customCurrencyInput
  ].forEach((input) => {

    input.addEventListener("keydown", (event) => {

      if (event.key === "Enter") {

        event.preventDefault();

        calculateFuelCost();

      }

    });

  });

});