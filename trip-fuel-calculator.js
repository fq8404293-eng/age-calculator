document.addEventListener("DOMContentLoaded", function () {
  const distanceInput = document.getElementById(
    "trip-fuel-distance"
  );

  const distanceUnitInput = document.getElementById(
    "trip-fuel-distance-unit"
  );

  const economyInput = document.getElementById(
    "trip-fuel-economy"
  );

  const economyUnitInput = document.getElementById(
    "trip-fuel-economy-unit"
  );

  const priceInput = document.getElementById(
    "trip-fuel-price"
  );

  const priceUnitInput = document.getElementById(
    "trip-fuel-price-unit"
  );

  const tripsInput = document.getElementById(
    "trip-fuel-trips"
  );

  const currencyInput = document.getElementById(
    "trip-fuel-currency"
  );

  const customCurrencyGroup = document.getElementById(
    "trip-fuel-custom-currency-group"
  );

  const customCurrencyInput = document.getElementById(
    "trip-fuel-custom-currency"
  );

  const calculateButton = document.getElementById(
    "trip-fuel-calculate"
  );

  const resetButton = document.getElementById(
    "trip-fuel-reset"
  );

  const errorBox = document.getElementById(
    "trip-fuel-error"
  );

  const resultBox = document.getElementById(
    "trip-fuel-result"
  );

  const resultContent = document.getElementById(
    "trip-fuel-result-content"
  );

  const summaryDistance = document.getElementById(
    "trip-fuel-summary-distance"
  );

  const summaryFuel = document.getElementById(
    "trip-fuel-summary-fuel"
  );

  const summaryCost = document.getElementById(
    "trip-fuel-summary-cost"
  );

  const summaryTrips = document.getElementById(
    "trip-fuel-summary-trips"
  );


  /*
    Conversion constants.

    Distance:
    1 mile = 1.609344 km

    Fuel:
    1 US gallon = 3.785411784 liters
  */

  const MILES_TO_KM = 1.609344;
  const GALLON_TO_LITER = 3.785411784;


  /*
    Show or hide the custom currency field.
  */

  function updateCustomCurrencyField() {
    if (currencyInput.value === "custom") {
      customCurrencyGroup.hidden = false;
    } else {
      customCurrencyGroup.hidden = true;
      customCurrencyInput.value = "";
    }
  }


  /*
    Get currency symbol.
  */

  function getCurrencySymbol() {
    if (currencyInput.value === "custom") {
      return customCurrencyInput.value.trim();
    }

    return currencyInput.value;
  }


  /*
    Format numbers.
  */

  function formatNumber(number, decimals = 6) {
    if (!Number.isFinite(number)) {
      return "0";
    }

    return number.toLocaleString("en-US", {
      maximumFractionDigits: decimals
    });
  }


  /*
    Format money.
  */

  function formatMoney(number, symbol) {
    return `${symbol}${number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
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


  function calculateTripFuel() {
    clearError();


    /*
      Read raw values.
    */

    const distanceRaw =
      distanceInput.value.trim();

    const economyRaw =
      economyInput.value.trim();

    const priceRaw =
      priceInput.value.trim();

    const tripsRaw =
      tripsInput.value.trim();


    const distance =
      Number(distanceRaw);

    const economy =
      Number(economyRaw);

    const fuelPrice =
      Number(priceRaw);

    const trips =
      Number(tripsRaw);


    /*
      Validate distance.
    */

    if (distanceRaw === "") {
      showError("Please enter the trip distance.");
      distanceInput.focus();
      return;
    }

    if (!Number.isFinite(distance) || distance <= 0) {
      showError(
        "Trip distance must be greater than 0."
      );
      distanceInput.focus();
      return;
    }


    /*
      Validate fuel economy.
    */

    if (economyRaw === "") {
      showError("Please enter the fuel economy.");
      economyInput.focus();
      return;
    }

    if (!Number.isFinite(economy) || economy <= 0) {
      showError(
        "Fuel economy must be greater than 0."
      );
      economyInput.focus();
      return;
    }


    /*
      Validate fuel price.
    */

    if (priceRaw === "") {
      showError("Please enter the fuel price.");
      priceInput.focus();
      return;
    }

    if (!Number.isFinite(fuelPrice) || fuelPrice < 0) {
      showError(
        "Fuel price must be 0 or greater."
      );
      priceInput.focus();
      return;
    }


    /*
      Validate number of trips.
    */

    if (tripsRaw === "") {
      showError("Please enter the number of trips.");
      tripsInput.focus();
      return;
    }

    if (!Number.isFinite(trips) || trips < 1) {
      showError(
        "Number of trips must be at least 1."
      );
      tripsInput.focus();
      return;
    }

    if (!Number.isInteger(trips)) {
      showError(
        "Number of trips must be a whole number."
      );
      tripsInput.focus();
      return;
    }


    /*
      Validate custom currency.
    */

    const currencySymbol =
      getCurrencySymbol();

    if (
      currencyInput.value === "custom" &&
      currencySymbol === ""
    ) {
      showError(
        "Please enter a custom currency symbol."
      );
      customCurrencyInput.focus();
      return;
    }


    /*
      Convert distance to kilometers.
    */

    let distanceKm;

    if (distanceUnitInput.value === "km") {
      distanceKm = distance;
    } else {
      distanceKm = distance * MILES_TO_KM;
    }


    /*
      Convert fuel economy to km/L.

      km/L:
        already km/L

      L/100 km:
        km/L = 100 ÷ L/100 km

      MPG:
        1 US gallon = 3.785411784 L
        1 mile = 1.609344 km
        km/L = (MPG × 1.609344) ÷ 3.785411784
    */

    let kilometersPerLiter;

    if (economyUnitInput.value === "kmpl") {

      kilometersPerLiter = economy;

    } else if (economyUnitInput.value === "l100km") {

      kilometersPerLiter = 100 / economy;

    } else if (economyUnitInput.value === "mpg") {

      kilometersPerLiter =
        (economy * MILES_TO_KM) /
        GALLON_TO_LITER;

    } else {

      showError(
        "Please select a valid fuel economy unit."
      );
      economyUnitInput.focus();
      return;
    }


    /*
      Calculate fuel required for ONE trip.
    */

    const fuelLitersPerTrip =
      distanceKm / kilometersPerLiter;


    /*
      Calculate total fuel for all trips.
    */

    const totalFuelLiters =
      fuelLitersPerTrip * trips;


    /*
      Convert fuel price to price per liter.

      If entered per gallon, divide by
      liters per US gallon.
    */

    let pricePerLiter;

    if (priceUnitInput.value === "liter") {

      pricePerLiter = fuelPrice;

    } else if (priceUnitInput.value === "gallon") {

      pricePerLiter =
        fuelPrice / GALLON_TO_LITER;

    } else {

      showError(
        "Please select a valid fuel price unit."
      );
      priceUnitInput.focus();
      return;
    }


    /*
      Calculate total fuel cost.
    */

    const totalFuelCost =
      totalFuelLiters * pricePerLiter;


    /*
      Convert useful values.
    */

    const totalDistanceKm =
      distanceKm * trips;

    const totalDistanceMiles =
      totalDistanceKm / MILES_TO_KM;

    const fuelGallons =
      totalFuelLiters / GALLON_TO_LITER;

    const fuelGallonsPerTrip =
      fuelLitersPerTrip / GALLON_TO_LITER;

    const costPerKm =
      totalDistanceKm > 0
        ? totalFuelCost / totalDistanceKm
        : 0;

    const costPerMile =
      totalDistanceMiles > 0
        ? totalFuelCost / totalDistanceMiles
        : 0;

    const litersPer100Km =
      100 / kilometersPerLiter;

    const milesPerGallon =
      kilometersPerLiter *
      GALLON_TO_LITER /
      MILES_TO_KM;


    /*
      Display results.
    */

    resultContent.innerHTML = `

      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Total Trip Distance</h3>
          <p>${formatNumber(totalDistanceKm)} km</p>
        </div>

        <div class="result-card">
          <h3>Total Fuel Required</h3>
          <p>${formatNumber(totalFuelLiters)} L</p>
        </div>

        <div class="result-card">
          <h3>Total Fuel Cost</h3>
          <p>${formatMoney(totalFuelCost, currencySymbol)}</p>
        </div>

        <div class="result-card">
          <h3>Fuel Cost Per km</h3>
          <p>${formatMoney(costPerKm, currencySymbol)}</p>
        </div>

      </div>


      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Fuel Per Trip</h3>
          <p>${formatNumber(fuelLitersPerTrip)} L</p>
        </div>

        <div class="result-card">
          <h3>Fuel Per Trip</h3>
          <p>${formatNumber(fuelGallonsPerTrip)} US gal</p>
        </div>

        <div class="result-card">
          <h3>Total Fuel</h3>
          <p>${formatNumber(fuelGallons)} US gal</p>
        </div>

        <div class="result-card">
          <h3>Fuel Cost Per Mile</h3>
          <p>${formatMoney(costPerMile, currencySymbol)}</p>
        </div>

      </div>


      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Fuel Economy</h3>
          <p>${formatNumber(kilometersPerLiter)} km/L</p>
        </div>

        <div class="result-card">
          <h3>Fuel Consumption</h3>
          <p>${formatNumber(litersPer100Km)} L/100 km</p>
        </div>

        <div class="result-card">
          <h3>US MPG</h3>
          <p>${formatNumber(milesPerGallon)} MPG</p>
        </div>

        <div class="result-card">
          <h3>Total Distance</h3>
          <p>${formatNumber(totalDistanceMiles)} mi</p>
        </div>

      </div>


      <div class="info-box">

        <p>
          <strong>${formatNumber(trips, 0)} trip(s)</strong>
          ×
          <strong>${formatNumber(distance)} ${distanceUnitInput.value === "km" ? "km" : "mi"}</strong>
        </p>

        <p>
          Fuel required is calculated from the total distance and
          your entered fuel economy.
        </p>

        <p>
          Fuel cost is calculated using the fuel price converted
          to a price per liter when necessary.
        </p>

        <p>
          Actual fuel consumption can vary with traffic, speed,
          road conditions, weather, vehicle load, and driving style.
        </p>

      </div>

    `;


    /*
      Update summary.
    */

    summaryDistance.textContent =
      `${formatNumber(totalDistanceKm)} km`;

    summaryFuel.textContent =
      `${formatNumber(totalFuelLiters)} L`;

    summaryCost.textContent =
      formatMoney(totalFuelCost, currencySymbol);

    summaryTrips.textContent =
      formatNumber(trips, 0);


    resultBox.hidden = false;


    /*
      Smoothly scroll to results.
    */

    resultBox.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }


  function resetCalculator() {
    distanceInput.value = "";
    distanceUnitInput.value = "km";

    economyInput.value = "";
    economyUnitInput.value = "kmpl";

    priceInput.value = "";
    priceUnitInput.value = "liter";

    tripsInput.value = "1";

    currencyInput.value = "$";

    customCurrencyGroup.hidden = true;
    customCurrencyInput.value = "";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    summaryDistance.textContent = "—";
    summaryFuel.textContent = "—";
    summaryCost.textContent = "—";
    summaryTrips.textContent = "—";

    distanceInput.focus();
  }


  /*
    Currency selector.
  */

  currencyInput.addEventListener(
    "change",
    updateCustomCurrencyField
  );


  /*
    Calculate and reset buttons.
  */

  calculateButton.addEventListener(
    "click",
    calculateTripFuel
  );

  resetButton.addEventListener(
    "click",
    resetCalculator
  );


  /*
    Allow Enter to calculate.
  */

  const calculatorInputs = [
    distanceInput,
    distanceUnitInput,
    economyInput,
    economyUnitInput,
    priceInput,
    priceUnitInput,
    tripsInput,
    currencyInput,
    customCurrencyInput
  ];


  calculatorInputs.forEach(function (input) {
    input.addEventListener("keydown", function (event) {

      if (event.key === "Enter") {
        event.preventDefault();
        calculateTripFuel();
      }

    });
  });


  /*
    Initialize custom currency state.
  */

  updateCustomCurrencyField();

});