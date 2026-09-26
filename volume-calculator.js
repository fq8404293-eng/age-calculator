document.addEventListener("DOMContentLoaded", function () {
  const valueInput = document.getElementById("volume-value");
  const unitInput = document.getElementById("volume-unit");

  const calculateButton = document.getElementById("volume-calculate");
  const resetButton = document.getElementById("volume-reset");

  const errorBox = document.getElementById("volume-error");

  const resultBox = document.getElementById("volume-result");
  const resultContent = document.getElementById("volume-result-content");

  const summaryInput = document.getElementById("volume-summary-input");
  const summaryLiters = document.getElementById("volume-summary-liters");
  const summaryMilliliters = document.getElementById("volume-summary-milliliters");
  const summaryGallons = document.getElementById("volume-summary-gallons");


  /*
    Conversion factors to liters.

    All calculations use liters as the base unit.

    US liquid-volume conversions are used for
    fluid ounces, cups, pints, quarts, and gallons.
  */

  const conversionToLiters = {
    ml: 0.001,
    l: 1,
    cm3: 0.001,
    m3: 1000,
    floz: 0.0295735295625,
    cup: 0.2365882365,
    pint: 0.473176473,
    quart: 0.946352946,
    gallon: 3.785411784
  };


  const unitNames = {
    ml: "mL",
    l: "L",
    cm3: "cm³",
    m3: "m³",
    floz: "US fl oz",
    cup: "US cups",
    pint: "US pints",
    quart: "US quarts",
    gallon: "US gallons"
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


  function calculateVolume() {
    clearError();

    const rawValue = valueInput.value.trim();
    const value = Number(rawValue);
    const unit = unitInput.value;


    if (rawValue === "") {
      showError("Please enter a volume value.");
      valueInput.focus();
      return;
    }


    if (!Number.isFinite(value) || value < 0) {
      showError("Please enter a valid volume of 0 or greater.");
      valueInput.focus();
      return;
    }


    if (!Object.prototype.hasOwnProperty.call(conversionToLiters, unit)) {
      showError("Please select a valid volume unit.");
      unitInput.focus();
      return;
    }


    /*
      Convert the entered value to liters.
    */

    const liters = value * conversionToLiters[unit];


    /*
      Convert liters to every supported unit.
    */

    const milliliters = liters / conversionToLiters.ml;
    const cubicCentimeters = liters / conversionToLiters.cm3;
    const cubicMeters = liters / conversionToLiters.m3;
    const fluidOunces = liters / conversionToLiters.floz;
    const cups = liters / conversionToLiters.cup;
    const pints = liters / conversionToLiters.pint;
    const quarts = liters / conversionToLiters.quart;
    const gallons = liters / conversionToLiters.gallon;


    /*
      Display conversion results.
    */

    resultContent.innerHTML = `

      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Milliliters</h3>
          <p>${formatNumber(milliliters)} mL</p>
        </div>

        <div class="result-card">
          <h3>Liters</h3>
          <p>${formatNumber(liters)} L</p>
        </div>

        <div class="result-card">
          <h3>Cubic Centimeters</h3>
          <p>${formatNumber(cubicCentimeters)} cm³</p>
        </div>

        <div class="result-card">
          <h3>Cubic Meters</h3>
          <p>${formatNumber(cubicMeters)} m³</p>
        </div>

        <div class="result-card">
          <h3>US Fluid Ounces</h3>
          <p>${formatNumber(fluidOunces)} fl oz</p>
        </div>

        <div class="result-card">
          <h3>US Cups</h3>
          <p>${formatNumber(cups)} cups</p>
        </div>

        <div class="result-card">
          <h3>US Pints</h3>
          <p>${formatNumber(pints)} pints</p>
        </div>

        <div class="result-card">
          <h3>US Quarts</h3>
          <p>${formatNumber(quarts)} quarts</p>
        </div>

        <div class="result-card">
          <h3>US Gallons</h3>
          <p>${formatNumber(gallons)} gallons</p>
        </div>

      </div>


      <div class="info-box">

        <p>
          <strong>${formatNumber(value)} ${unitNames[unit]}</strong>
          equals
          <strong>${formatNumber(liters)} L</strong>.
        </p>

        <p>
          The calculation first converts the entered volume to liters and
          then converts that value into each supported volume unit.
        </p>

      </div>

    `;


    /*
      Update summary.
    */

    summaryInput.textContent =
      `${formatNumber(value)} ${unitNames[unit]}`;

    summaryLiters.textContent =
      `${formatNumber(liters)} L`;

    summaryMilliliters.textContent =
      `${formatNumber(milliliters)} mL`;

    summaryGallons.textContent =
      `${formatNumber(gallons)} US gal`;


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
    unitInput.value = "ml";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    summaryInput.textContent = "—";
    summaryLiters.textContent = "—";
    summaryMilliliters.textContent = "—";
    summaryGallons.textContent = "—";

    valueInput.focus();
  }


  calculateButton.addEventListener("click", calculateVolume);

  resetButton.addEventListener("click", resetCalculator);


  /*
    Allow Enter to calculate.
  */

  valueInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateVolume();
    }
  });


  unitInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateVolume();
    }
  });

});