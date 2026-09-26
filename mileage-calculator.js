(function () {
  "use strict";

  const distanceInput = document.getElementById("mileage-distance");
  const distanceUnit = document.getElementById("mileage-distance-unit");
  const fuelInput = document.getElementById("mileage-fuel");
  const fuelUnit = document.getElementById("mileage-fuel-unit");

  const calculateButton = document.getElementById("calculate-mileage");
  const resetButton = document.getElementById("reset-mileage");

  const errorBox = document.getElementById("mileage-error");
  const resultBox = document.getElementById("mileage-result");
  const resultContent = document.getElementById("mileage-result-content");

  const summaryDistance = document.getElementById("mileage-summary-distance");
  const summaryFuel = document.getElementById("mileage-summary-fuel");
  const summaryEconomy = document.getElementById("mileage-summary-economy");
  const summaryConsumption = document.getElementById("mileage-summary-consumption");

  const MILES_TO_KM = 1.609344;
  const US_GALLON_TO_LITERS = 3.785411784;

  function formatNumber(value, decimals = 2) {
    return Number(value).toLocaleString("en-US", {
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

  function calculateMileage() {
    clearError();

    const distance = parseFloat(distanceInput.value);
    const fuel = parseFloat(fuelInput.value);

    if (!Number.isFinite(distance) || distance <= 0) {
      showError("Please enter a distance greater than 0.");
      distanceInput.focus();
      return;
    }

    if (!Number.isFinite(fuel) || fuel <= 0) {
      showError("Please enter fuel used greater than 0.");
      fuelInput.focus();
      return;
    }

    let distanceKm;
    let fuelLiters;

    // Convert distance to kilometers.
    if (distanceUnit.value === "miles") {
      distanceKm = distance * MILES_TO_KM;
    } else {
      distanceKm = distance;
    }

    // Convert fuel to liters.
    if (fuelUnit.value === "gallon") {
      fuelLiters = fuel * US_GALLON_TO_LITERS;
    } else {
      fuelLiters = fuel;
    }

    if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
      showError("Unable to calculate the distance. Please check your input.");
      return;
    }

    if (!Number.isFinite(fuelLiters) || fuelLiters <= 0) {
      showError("Unable to calculate the fuel amount. Please check your input.");
      return;
    }

    // Core calculations.
    const kmPerLiter = distanceKm / fuelLiters;

    const litersPer100Km = (fuelLiters / distanceKm) * 100;

    const miles = distanceKm / MILES_TO_KM;

    const usGallons = fuelLiters / US_GALLON_TO_LITERS;

    const mpg = miles / usGallons;

    const kmPerGallon = distanceKm / usGallons;

    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Fuel Economy</h3>
          <p><strong>${formatNumber(kmPerLiter)} km/L</strong></p>
          <p>Higher values indicate better economy</p>
        </div>

        <div class="result-card">
          <h3>Fuel Consumption</h3>
          <p><strong>${formatNumber(litersPer100Km)} L/100 km</strong></p>
          <p>Lower values indicate better efficiency</p>
        </div>

        <div class="result-card">
          <h3>US Fuel Economy</h3>
          <p><strong>${formatNumber(mpg)} MPG</strong></p>
          <p>Miles per US gallon</p>
        </div>

        <div class="result-card">
          <h3>Fuel Used</h3>
          <p><strong>${formatNumber(fuelLiters)} L</strong></p>
          <p>${formatNumber(usGallons)} US gallons</p>
        </div>

        <div class="result-card">
          <h3>Distance</h3>
          <p><strong>${formatNumber(distanceKm)} km</strong></p>
          <p>${formatNumber(miles)} miles</p>
        </div>

        <div class="result-card">
          <h3>Kilometers Per Gallon</h3>
          <p><strong>${formatNumber(kmPerGallon)} km/gal</strong></p>
          <p>Based on a US gallon</p>
        </div>

      </div>

      <div class="info-box">

        <h3>Mileage Calculation</h3>

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
          ${formatNumber(miles)} miles ÷
          ${formatNumber(usGallons)} US gallons =
          <strong>${formatNumber(mpg)} MPG</strong>
        </p>

      </div>
    `;

    summaryDistance.textContent =
      `${formatNumber(distanceKm)} km`;

    summaryFuel.textContent =
      `${formatNumber(fuelLiters)} L`;

    summaryEconomy.textContent =
      `${formatNumber(kmPerLiter)} km/L`;

    summaryConsumption.textContent =
      `${formatNumber(litersPer100Km)} L/100 km`;

    resultBox.hidden = false;

    setTimeout(() => {
      resultBox.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 50);
  }

  function resetMileage() {
    distanceInput.value = "";
    distanceUnit.value = "km";

    fuelInput.value = "";
    fuelUnit.value = "liter";

    clearError();

    resultContent.innerHTML = "";
    resultBox.hidden = true;

    summaryDistance.textContent = "—";
    summaryFuel.textContent = "—";
    summaryEconomy.textContent = "—";
    summaryConsumption.textContent = "—";

    distanceInput.focus();
  }

  calculateButton.addEventListener("click", calculateMileage);

  resetButton.addEventListener("click", resetMileage);

  [distanceInput, fuelInput].forEach((input) => {
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        calculateMileage();
      }
    });
  });

})();