document.addEventListener("DOMContentLoaded", function () {
  const valueInput = document.getElementById("weight-value");
  const unitInput = document.getElementById("weight-unit");

  const calculateButton = document.getElementById("weight-calculate");
  const resetButton = document.getElementById("weight-reset");

  const errorBox = document.getElementById("weight-error");

  const resultBox = document.getElementById("weight-result");
  const resultContent = document.getElementById("weight-result-content");

  const summaryInput = document.getElementById("weight-summary-input");
  const summaryKg = document.getElementById("weight-summary-kg");
  const summaryLb = document.getElementById("weight-summary-lb");
  const summaryOz = document.getElementById("weight-summary-oz");


  /*
    All conversion factors are based on kilograms.
  */

  const units = {
    mg: {
      label: "mg",
      name: "Milligrams",
      kilograms: 0.000001
    },

    g: {
      label: "g",
      name: "Grams",
      kilograms: 0.001
    },

    kg: {
      label: "kg",
      name: "Kilograms",
      kilograms: 1
    },

    t: {
      label: "t",
      name: "Metric Tons",
      kilograms: 1000
    },

    oz: {
      label: "oz",
      name: "Ounces",
      kilograms: 0.028349523125
    },

    lb: {
      label: "lb",
      name: "Pounds",
      kilograms: 0.45359237
    },

    st: {
      label: "st",
      name: "Stones",
      kilograms: 6.35029318
    }
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


  function calculateWeight() {
    clearError();

    const value = Number(valueInput.value);
    const selectedUnit = unitInput.value;

    if (valueInput.value.trim() === "") {
      showError("Please enter a weight value.");
      valueInput.focus();
      return;
    }

    if (!Number.isFinite(value) || value < 0) {
      showError("Please enter a valid weight of 0 or greater.");
      valueInput.focus();
      return;
    }

    if (!units[selectedUnit]) {
      showError("Please select a valid weight unit.");
      unitInput.focus();
      return;
    }


    /*
      Convert the entered value into kilograms.
    */

    const kilograms = value * units[selectedUnit].kilograms;


    /*
      Convert kilograms into all supported units.
    */

    const milligrams = kilograms / 0.000001;
    const grams = kilograms / 0.001;
    const metricTons = kilograms / 1000;
    const ounces = kilograms / 0.028349523125;
    const pounds = kilograms / 0.45359237;
    const stones = kilograms / 6.35029318;


    /*
      Display conversion results.
    */

    resultContent.innerHTML = `

      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Milligrams</h3>
          <p>${formatNumber(milligrams)} mg</p>
        </div>

        <div class="result-card">
          <h3>Grams</h3>
          <p>${formatNumber(grams)} g</p>
        </div>

        <div class="result-card">
          <h3>Kilograms</h3>
          <p>${formatNumber(kilograms)} kg</p>
        </div>

        <div class="result-card">
          <h3>Metric Tons</h3>
          <p>${formatNumber(metricTons)} t</p>
        </div>

        <div class="result-card">
          <h3>Ounces</h3>
          <p>${formatNumber(ounces)} oz</p>
        </div>

        <div class="result-card">
          <h3>Pounds</h3>
          <p>${formatNumber(pounds)} lb</p>
        </div>

        <div class="result-card">
          <h3>Stones</h3>
          <p>${formatNumber(stones)} st</p>
        </div>

      </div>


      <div class="info-box">

        <p>
          <strong>
            ${formatNumber(value)} ${units[selectedUnit].label}
          </strong>
          equals
          <strong>
            ${formatNumber(kilograms)} kilograms
          </strong>.
        </p>

        <p>
          The entered measurement was first converted to kilograms and
          then converted into the other supported weight units.
        </p>

      </div>

    `;


    /*
      Update summary.
    */

    summaryInput.textContent =
      `${formatNumber(value)} ${units[selectedUnit].label}`;

    summaryKg.textContent =
      `${formatNumber(kilograms)} kg`;

    summaryLb.textContent =
      `${formatNumber(pounds)} lb`;

    summaryOz.textContent =
      `${formatNumber(ounces)} oz`;


    resultBox.hidden = false;


    /*
      Smoothly scroll to the result.
    */

    resultBox.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }


  function resetCalculator() {
    valueInput.value = "";
    unitInput.value = "kg";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    summaryInput.textContent = "—";
    summaryKg.textContent = "—";
    summaryLb.textContent = "—";
    summaryOz.textContent = "—";

    valueInput.focus();
  }


  calculateButton.addEventListener("click", calculateWeight);

  resetButton.addEventListener("click", resetCalculator);


  /*
    Allow Enter to calculate.
  */

  valueInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateWeight();
    }
  });

  unitInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateWeight();
    }
  });

});