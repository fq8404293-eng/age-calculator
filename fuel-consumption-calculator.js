document.addEventListener("DOMContentLoaded", () => {
  const distanceInput = document.getElementById("consumption-distance");
  const distanceUnitInput = document.getElementById("consumption-distance-unit");

  const fuelInput = document.getElementById("consumption-fuel");
  const fuelUnitInput = document.getElementById("consumption-fuel-unit");

  const calculateButton = document.getElementById("calculate-consumption");
  const resetButton = document.getElementById("reset-consumption");

  const errorBox = document.getElementById("consumption-error");
  const resultBox = document.getElementById("consumption-result");
  const resultContent = document.getElementById("consumption-result-content");

  const summaryDistance = document.getElementById("summary-consumption-distance");
  const summaryFuel = document.getElementById("summary-consumption-fuel");
  const summaryEconomy = document.getElementById("summary-consumption-economy");
  const summaryRate = document.getElementById("summary-consumption-rate");


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


  function calculateConsumption() {
    clearError();

    const distance = parseFloat(distanceInput.value);
    const fuelUsed = parseFloat(fuelInput.value);

    const distanceUnit = distanceUnitInput.value;
    const fuelUnit = fuelUnitInput.value;


    /* -----------------------------
       Validation
    ----------------------------- */

    if (!Number.isFinite(distance) || distance <= 0) {
      showError("Please enter a valid distance greater than 0.");
      distanceInput.focus();
      return;
    }


    if (!Number.isFinite(fuelUsed) || fuelUsed <= 0) {
      showError("Please enter a valid amount of fuel greater than 0.");
      fuelInput.focus();
      return;
    }


    /* -----------------------------
       Convert distance to kilometers
    ----------------------------- */

    const distanceKm =
      distanceUnit === "mi"
        ? distance * 1.609344
        : distance;


    /* -----------------------------
       Convert fuel to liters
    ----------------------------- */

    const fuelLiters =
      fuelUnit === "gallon"
        ? fuelUsed * 3.785411784
        : fuelUsed;


    /* -----------------------------
       Fuel economy
       km/L
    ----------------------------- */

    const kmPerLiter =
      distanceKm / fuelLiters;


    /* -----------------------------
       Fuel consumption
       L/100 km
    ----------------------------- */

    const litersPer100Km =
      (fuelLiters / distanceKm) * 100;


    /* -----------------------------
       US MPG
    ----------------------------- */

    const distanceMiles =
      distanceKm / 1.609344;

    const gallonsUsed =
      fuelLiters / 3.785411784;

    const mpg =
      distanceMiles / gallonsUsed;


    /* -----------------------------
       Additional conversions
    ----------------------------- */

    const milesPerLiter =
      distanceMiles / fuelLiters;

    const kilometersPerGallon =
      distanceKm / gallonsUsed;


    /* -----------------------------
       Display values
    ----------------------------- */

    const distanceDisplay =
      distanceUnit === "mi"
        ? `${formatNumber(distance)} mi`
        : `${formatNumber(distance)} km`;


    const fuelDisplay =
      fuelUnit === "gallon"
        ? `${formatNumber(fuelUsed)} US gal`
        : `${formatNumber(fuelUsed)} L`;


    /* -----------------------------
       Results
    ----------------------------- */

    resultContent.innerHTML = `

      <div class="calculator-results-grid">


        <div class="result-card">

          <h3>
            Fuel Economy
          </h3>

          <p class="result-value">
            ${formatNumber(kmPerLiter)} km/L
          </p>

          <p>
            Higher values indicate better economy
          </p>

        </div>


        <div class="result-card">

          <h3>
            Fuel Consumption
          </h3>

          <p class="result-value">
            ${formatNumber(litersPer100Km)} L/100 km
          </p>

          <p>
            Lower values indicate better efficiency
          </p>

        </div>


        <div class="result-card">

          <h3>
            US Fuel Economy
          </h3>

          <p class="result-value">
            ${formatNumber(mpg)} MPG
          </p>

          <p>
            Miles per US gallon
          </p>

        </div>


        <div class="result-card">

          <h3>
            Fuel Used
          </h3>

          <p class="result-value">
            ${formatNumber(fuelLiters)} L
          </p>

          <p>
            ${formatNumber(gallonsUsed)} US gallons
          </p>

        </div>


        <div class="result-card">

          <h3>
            Distance
          </h3>

          <p class="result-value">
            ${formatNumber(distanceKm)} km
          </p>

          <p>
            ${formatNumber(distanceMiles)} miles
          </p>

        </div>


        <div class="result-card">

          <h3>
            Kilometers Per Gallon
          </h3>

          <p class="result-value">
            ${formatNumber(kilometersPerGallon)} km/gal
          </p>

          <p>
            Based on a US gallon
          </p>

        </div>


      </div>


      <div class="info-box">

        <h3>
          Fuel Consumption Calculation
        </h3>

        <p>
          Fuel economy =
          ${formatNumber(distanceKm)} km ÷
          ${formatNumber(fuelLiters)} L =
          <strong>${formatNumber(kmPerLiter)} km/L</strong>
        </p>

        <p>
          Fuel consumption =
          ${formatNumber(fuelLiters)} L ÷
          ${formatNumber(distanceKm)} km × 100 =
          <strong>${formatNumber(litersPer100Km)} L/100 km</strong>
        </p>

        <p>
          US fuel economy =
          ${formatNumber(distanceMiles)} miles ÷
          ${formatNumber(gallonsUsed)} US gallons =
          <strong>${formatNumber(mpg)} MPG</strong>
        </p>

      </div>

    `;


    /* -----------------------------
       Summary
    ----------------------------- */

    summaryDistance.textContent =
      distanceDisplay;

    summaryFuel.textContent =
      fuelDisplay;

    summaryEconomy.textContent =
      `${formatNumber(kmPerLiter)} km/L`;

    summaryRate.textContent =
      `${formatNumber(litersPer100Km)} L/100 km`;


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

    fuelInput.value = "";
    fuelUnitInput.value = "liter";

    clearError();

    resultContent.innerHTML = "";
    resultBox.hidden = true;

    summaryDistance.textContent = "—";
    summaryFuel.textContent = "—";
    summaryEconomy.textContent = "—";
    summaryRate.textContent = "—";

    distanceInput.focus();
  }


  /* -----------------------------
     Event listeners
  ----------------------------- */

  calculateButton.addEventListener(
    "click",
    calculateConsumption
  );


  resetButton.addEventListener(
    "click",
    resetCalculator
  );


  [
    distanceInput,
    fuelInput
  ].forEach((input) => {

    input.addEventListener("keydown", (event) => {

      if (event.key === "Enter") {

        event.preventDefault();

        calculateConsumption();

      }

    });

  });

});