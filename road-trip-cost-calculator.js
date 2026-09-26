(function () {
  "use strict";

  const distanceInput = document.getElementById("trip-distance");
  const distanceUnit = document.getElementById("trip-distance-unit");

  const economyInput = document.getElementById("trip-economy");
  const economyUnit = document.getElementById("trip-economy-unit");

  const fuelPriceInput = document.getElementById("trip-fuel-price");
  const fuelPriceUnit = document.getElementById("trip-fuel-price-unit");

  const currencySelect = document.getElementById("trip-fuel-currency");
  const customCurrencyGroup = document.getElementById("trip-custom-currency-group");
  const customCurrencyInput = document.getElementById("trip-custom-currency");

  const tripCountInput = document.getElementById("trip-count");

  const calculateButton = document.getElementById("calculate-trip");
  const resetButton = document.getElementById("reset-trip");

  const errorBox = document.getElementById("trip-error");
  const resultBox = document.getElementById("trip-result");
  const resultContent = document.getElementById("trip-result-content");

  const summaryDistance = document.getElementById("trip-summary-distance");
  const summaryFuel = document.getElementById("trip-summary-fuel");
  const summaryCost = document.getElementById("trip-summary-cost");
  const summaryPerDistance = document.getElementById("trip-summary-per-distance");

  const MILES_TO_KM = 1.609344;
  const US_GALLON_TO_LITERS = 3.785411784;

  function formatNumber(value, decimals = 2) {
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function getCurrencySymbol() {
    if (currencySelect.value === "custom") {
      const customSymbol = customCurrencyInput.value.trim();

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

  function calculateFuelEconomyInKmPerLiter() {
    const economy = parseFloat(economyInput.value);

    if (economyUnit.value === "kmpl") {
      return economy;
    }

    if (economyUnit.value === "l100km") {
      return 100 / economy;
    }

    if (economyUnit.value === "mpg") {
      // 1 US MPG = 0.425143707 km/L
      return economy * (MILES_TO_KM / US_GALLON_TO_LITERS);
    }

    return NaN;
  }

  function calculateTripCost() {
    clearError();

    const distance = parseFloat(distanceInput.value);
    const economy = parseFloat(economyInput.value);
    const fuelPrice = parseFloat(fuelPriceInput.value);
    const tripCount = parseInt(tripCountInput.value, 10);

    if (!Number.isFinite(distance) || distance <= 0) {
      showError("Please enter a distance greater than 0.");
      distanceInput.focus();
      return;
    }

    if (!Number.isFinite(economy) || economy <= 0) {
      showError("Please enter a fuel economy greater than 0.");
      economyInput.focus();
      return;
    }

    if (!Number.isFinite(fuelPrice) || fuelPrice < 0) {
      showError("Please enter a valid fuel price.");
      fuelPriceInput.focus();
      return;
    }

    if (!Number.isInteger(tripCount) || tripCount < 1) {
      showError("Number of trips must be at least 1.");
      tripCountInput.focus();
      return;
    }

    if (
      currencySelect.value === "custom" &&
      customCurrencyInput.value.trim() === ""
    ) {
      showError("Please enter a custom currency symbol.");
      customCurrencyInput.focus();
      return;
    }

    const fuelEconomyKmPerLiter =
      calculateFuelEconomyInKmPerLiter();

    if (
      !Number.isFinite(fuelEconomyKmPerLiter) ||
      fuelEconomyKmPerLiter <= 0
    ) {
      showError("Please enter a valid fuel economy.");
      economyInput.focus();
      return;
    }

    // Convert one-trip distance to kilometers.
    let oneWayDistanceKm;

    if (distanceUnit.value === "miles") {
      oneWayDistanceKm = distance * MILES_TO_KM;
    } else {
      oneWayDistanceKm = distance;
    }

    // Calculate total distance for all trips.
    const totalDistanceKm =
      oneWayDistanceKm * tripCount;

    // Fuel required for the complete journey.
    const fuelRequiredLiters =
      totalDistanceKm / fuelEconomyKmPerLiter;

    // Convert fuel requirement to US gallons.
    const fuelRequiredGallons =
      fuelRequiredLiters / US_GALLON_TO_LITERS;

    // Convert price to price per liter if necessary.
    let pricePerLiter;

    if (fuelPriceUnit.value === "gallon") {
      pricePerLiter =
        fuelPrice / US_GALLON_TO_LITERS;
    } else {
      pricePerLiter = fuelPrice;
    }

    const totalFuelCost =
      fuelRequiredLiters * pricePerLiter;

    const totalDistanceMiles =
      totalDistanceKm / MILES_TO_KM;

    const costPerKm =
      totalFuelCost / totalDistanceKm;

    const costPerMile =
      totalFuelCost / totalDistanceMiles;

    const litersPer100Km =
      100 / fuelEconomyKmPerLiter;

    const mpg =
      fuelEconomyKmPerLiter *
      (US_GALLON_TO_LITERS / MILES_TO_KM);

    const currency = getCurrencySymbol();

    const tripDescription =
      tripCount === 1
        ? "1 trip"
        : `${tripCount} trips`;

    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Total Distance</h3>
          <p><strong>${formatNumber(totalDistanceKm)} km</strong></p>
          <p>${formatNumber(totalDistanceMiles)} miles</p>
        </div>

        <div class="result-card">
          <h3>Fuel Required</h3>
          <p><strong>${formatNumber(fuelRequiredLiters)} L</strong></p>
          <p>${formatNumber(fuelRequiredGallons)} US gallons</p>
        </div>

        <div class="result-card">
          <h3>Total Fuel Cost</h3>
          <p><strong>${currency}${formatNumber(totalFuelCost)}</strong></p>
          <p>Estimated fuel expense</p>
        </div>

        <div class="result-card">
          <h3>Cost Per Kilometer</h3>
          <p><strong>${currency}${formatNumber(costPerKm)}</strong></p>
          <p>Fuel cost per km</p>
        </div>

        <div class="result-card">
          <h3>Cost Per Mile</h3>
          <p><strong>${currency}${formatNumber(costPerMile)}</strong></p>
          <p>Fuel cost per mile</p>
        </div>

        <div class="result-card">
          <h3>Fuel Economy</h3>
          <p><strong>${formatNumber(fuelEconomyKmPerLiter)} km/L</strong></p>
          <p>${formatNumber(litersPer100Km)} L/100 km</p>
        </div>

        <div class="result-card">
          <h3>US Fuel Economy</h3>
          <p><strong>${formatNumber(mpg)} MPG</strong></p>
          <p>Miles per US gallon</p>
        </div>

        <div class="result-card">
          <h3>Trip Count</h3>
          <p><strong>${tripDescription}</strong></p>
          <p>Used for total distance</p>
        </div>

      </div>

      <div class="info-box">

        <h3>Road Trip Cost Calculation</h3>

        <p>
          Total distance =
          ${formatNumber(oneWayDistanceKm)} km ×
          ${tripCount} =
          <strong>${formatNumber(totalDistanceKm)} km</strong>
        </p>

        <p>
          Fuel required =
          ${formatNumber(totalDistanceKm)} km ÷
          ${formatNumber(fuelEconomyKmPerLiter)} km/L =
          <strong>${formatNumber(fuelRequiredLiters)} L</strong>
        </p>

        <p>
          Fuel cost =
          ${formatNumber(fuelRequiredLiters)} L ×
          ${currency}${formatNumber(pricePerLiter)} per L =
          <strong>${currency}${formatNumber(totalFuelCost)}</strong>
        </p>

      </div>
    `;

    summaryDistance.textContent =
      `${formatNumber(totalDistanceKm)} km`;

    summaryFuel.textContent =
      `${formatNumber(fuelRequiredLiters)} L`;

    summaryCost.textContent =
      `${currency}${formatNumber(totalFuelCost)}`;

    summaryPerDistance.textContent =
      `${currency}${formatNumber(costPerKm)}/km`;

    resultBox.hidden = false;

    setTimeout(() => {
      resultBox.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 50);
  }

  function resetTripCalculator() {
    distanceInput.value = "";
    distanceUnit.value = "km";

    economyInput.value = "";
    economyUnit.value = "kmpl";

    fuelPriceInput.value = "";
    fuelPriceUnit.value = "liter";

    currencySelect.value = "$";
    customCurrencyInput.value = "";
    customCurrencyGroup.hidden = true;

    tripCountInput.value = "1";

    clearError();

    resultContent.innerHTML = "";
    resultBox.hidden = true;

    summaryDistance.textContent = "—";
    summaryFuel.textContent = "—";
    summaryCost.textContent = "—";
    summaryPerDistance.textContent = "—";

    distanceInput.focus();
  }

  currencySelect.addEventListener("change", function () {
    if (currencySelect.value === "custom") {
      customCurrencyGroup.hidden = false;
      customCurrencyInput.focus();
    } else {
      customCurrencyGroup.hidden = true;
      customCurrencyInput.value = "";
    }
  });

  calculateButton.addEventListener(
    "click",
    calculateTripCost
  );

  resetButton.addEventListener(
    "click",
    resetTripCalculator
  );

  [
    distanceInput,
    economyInput,
    fuelPriceInput,
    tripCountInput,
    customCurrencyInput
  ].forEach((input) => {
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        calculateTripCost();
      }
    });
  });

})();