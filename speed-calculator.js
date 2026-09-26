document.addEventListener("DOMContentLoaded", function () {
  const valueInput = document.getElementById("speed-value");
  const unitInput = document.getElementById("speed-unit");

  const calculateButton = document.getElementById("speed-calculate");
  const resetButton = document.getElementById("speed-reset");

  const errorBox = document.getElementById("speed-error");

  const resultBox = document.getElementById("speed-result");
  const resultContent = document.getElementById("speed-result-content");

  const summaryInput = document.getElementById("speed-summary-input");
  const summaryKmh = document.getElementById("speed-summary-kmh");
  const summaryMph = document.getElementById("speed-summary-mph");
  const summaryMs = document.getElementById("speed-summary-ms");


  /*
    Conversion factors to meters per second.

    Meters per second is used as the common
    base unit for all calculations.
  */

  const conversionToMetersPerSecond = {
    ms: 1,
    kmh: 1000 / 3600,
    mph: 1609.344 / 3600,
    fts: 0.3048,
    knots: 1852 / 3600,
    mmin: 1 / 60,
    kmmin: 1000 / 60
  };


  const unitNames = {
    ms: "m/s",
    kmh: "km/h",
    mph: "mph",
    fts: "ft/s",
    knots: "kn",
    mmin: "m/min",
    kmmin: "km/min"
  };


  function formatNumber(number, decimals = 6) {
    if (!Number.isFinite(number)) {
      return "0";
    }

    return number.toLocaleString("en-US", {
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


  function calculateSpeed() {
    clearError();

    const rawValue = valueInput.value.trim();
    const value = Number(rawValue);
    const unit = unitInput.value;


    if (rawValue === "") {
      showError("Please enter a speed value.");
      valueInput.focus();
      return;
    }


    if (!Number.isFinite(value) || value < 0) {
      showError("Please enter a valid speed of 0 or greater.");
      valueInput.focus();
      return;
    }


    if (
      !Object.prototype.hasOwnProperty.call(
        conversionToMetersPerSecond,
        unit
      )
    ) {
      showError("Please select a valid speed unit.");
      unitInput.focus();
      return;
    }


    /*
      Convert the entered speed to meters per second.
    */

    const metersPerSecond =
      value * conversionToMetersPerSecond[unit];


    /*
      Convert meters per second into all supported units.
    */

    const kilometersPerHour =
      metersPerSecond / conversionToMetersPerSecond.kmh;

    const milesPerHour =
      metersPerSecond / conversionToMetersPerSecond.mph;

    const feetPerSecond =
      metersPerSecond / conversionToMetersPerSecond.fts;

    const knots =
      metersPerSecond / conversionToMetersPerSecond.knots;

    const metersPerMinute =
      metersPerSecond / conversionToMetersPerSecond.mmin;

    const kilometersPerMinute =
      metersPerSecond / conversionToMetersPerSecond.kmmin;


    /*
      Display results.
    */

    resultContent.innerHTML = `

      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Meters per Second</h3>
          <p>${formatNumber(metersPerSecond)} m/s</p>
        </div>

        <div class="result-card">
          <h3>Kilometers per Hour</h3>
          <p>${formatNumber(kilometersPerHour)} km/h</p>
        </div>

        <div class="result-card">
          <h3>Miles per Hour</h3>
          <p>${formatNumber(milesPerHour)} mph</p>
        </div>

        <div class="result-card">
          <h3>Feet per Second</h3>
          <p>${formatNumber(feetPerSecond)} ft/s</p>
        </div>

        <div class="result-card">
          <h3>Knots</h3>
          <p>${formatNumber(knots)} kn</p>
        </div>

        <div class="result-card">
          <h3>Meters per Minute</h3>
          <p>${formatNumber(metersPerMinute)} m/min</p>
        </div>

        <div class="result-card">
          <h3>Kilometers per Minute</h3>
          <p>${formatNumber(kilometersPerMinute)} km/min</p>
        </div>

      </div>


      <div class="info-box">

        <p>
          <strong>${formatNumber(value)} ${unitNames[unit]}</strong>
          equals
          <strong>${formatNumber(kilometersPerHour)} km/h</strong>,
          <strong>${formatNumber(milesPerHour)} mph</strong>,
          and
          <strong>${formatNumber(metersPerSecond)} m/s</strong>.
        </p>

        <p>
          The calculation first converts the entered speed to meters per
          second and then converts that value into each supported speed unit.
        </p>

      </div>

    `;


    /*
      Update summary.
    */

    summaryInput.textContent =
      `${formatNumber(value)} ${unitNames[unit]}`;

    summaryKmh.textContent =
      `${formatNumber(kilometersPerHour)} km/h`;

    summaryMph.textContent =
      `${formatNumber(milesPerHour)} mph`;

    summaryMs.textContent =
      `${formatNumber(metersPerSecond)} m/s`;


    resultBox.hidden = false;


    /*
      Smoothly scroll to the results.
    */

    resultBox.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }


  function resetCalculator() {
    valueInput.value = "";
    unitInput.value = "ms";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    summaryInput.textContent = "—";
    summaryKmh.textContent = "—";
    summaryMph.textContent = "—";
    summaryMs.textContent = "—";

    valueInput.focus();
  }


  calculateButton.addEventListener("click", calculateSpeed);

  resetButton.addEventListener("click", resetCalculator);


  /*
    Allow Enter to calculate.
  */

  valueInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateSpeed();
    }
  });


  unitInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateSpeed();
    }
  });

});