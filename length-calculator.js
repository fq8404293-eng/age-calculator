document.addEventListener("DOMContentLoaded", function () {
  const valueInput = document.getElementById("length-value");
  const unitInput = document.getElementById("length-unit");

  const calculateButton = document.getElementById("length-calculate");
  const resetButton = document.getElementById("length-reset");

  const errorBox = document.getElementById("length-error");

  const resultBox = document.getElementById("length-result");
  const resultContent = document.getElementById("length-result-content");

  const summaryInput = document.getElementById("length-summary-input");
  const summaryMeters = document.getElementById("length-summary-meters");
  const summaryFeet = document.getElementById("length-summary-feet");
  const summaryMiles = document.getElementById("length-summary-miles");


  /*
    All conversion factors are based on meters.
  */

  const units = {
    mm: {
      label: "mm",
      name: "Millimeters",
      meters: 0.001
    },

    cm: {
      label: "cm",
      name: "Centimeters",
      meters: 0.01
    },

    m: {
      label: "m",
      name: "Meters",
      meters: 1
    },

    km: {
      label: "km",
      name: "Kilometers",
      meters: 1000
    },

    in: {
      label: "in",
      name: "Inches",
      meters: 0.0254
    },

    ft: {
      label: "ft",
      name: "Feet",
      meters: 0.3048
    },

    yd: {
      label: "yd",
      name: "Yards",
      meters: 0.9144
    },

    mi: {
      label: "mi",
      name: "Miles",
      meters: 1609.344
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


  function calculateLength() {
    clearError();

    const value = Number(valueInput.value);
    const selectedUnit = unitInput.value;

    if (valueInput.value.trim() === "") {
      showError("Please enter a length value.");
      valueInput.focus();
      return;
    }

    if (!Number.isFinite(value) || value < 0) {
      showError("Please enter a valid length of 0 or greater.");
      valueInput.focus();
      return;
    }

    if (!units[selectedUnit]) {
      showError("Please select a valid length unit.");
      unitInput.focus();
      return;
    }


    /*
      Convert the entered value into meters.
    */

    const meters = value * units[selectedUnit].meters;


    /*
      Convert meters into all supported units.
    */

    const millimeters = meters / 0.001;
    const centimeters = meters / 0.01;
    const kilometers = meters / 1000;
    const inches = meters / 0.0254;
    const feet = meters / 0.3048;
    const yards = meters / 0.9144;
    const miles = meters / 1609.344;


    /*
      Display conversion results.
    */

    resultContent.innerHTML = `

      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Millimeters</h3>
          <p>${formatNumber(millimeters)} mm</p>
        </div>

        <div class="result-card">
          <h3>Centimeters</h3>
          <p>${formatNumber(centimeters)} cm</p>
        </div>

        <div class="result-card">
          <h3>Meters</h3>
          <p>${formatNumber(meters)} m</p>
        </div>

        <div class="result-card">
          <h3>Kilometers</h3>
          <p>${formatNumber(kilometers)} km</p>
        </div>

        <div class="result-card">
          <h3>Inches</h3>
          <p>${formatNumber(inches)} in</p>
        </div>

        <div class="result-card">
          <h3>Feet</h3>
          <p>${formatNumber(feet)} ft</p>
        </div>

        <div class="result-card">
          <h3>Yards</h3>
          <p>${formatNumber(yards)} yd</p>
        </div>

        <div class="result-card">
          <h3>Miles</h3>
          <p>${formatNumber(miles)} mi</p>
        </div>

      </div>


      <div class="info-box">

        <p>
          <strong>
            ${formatNumber(value)} ${units[selectedUnit].label}
          </strong>
          equals
          <strong>
            ${formatNumber(meters)} meters
          </strong>.
        </p>

        <p>
          The entered measurement was first converted to meters and then
          converted into the other supported length units.
        </p>

      </div>

    `;


    /*
      Update summary.
    */

    summaryInput.textContent =
      `${formatNumber(value)} ${units[selectedUnit].label}`;

    summaryMeters.textContent =
      `${formatNumber(meters)} m`;

    summaryFeet.textContent =
      `${formatNumber(feet)} ft`;

    summaryMiles.textContent =
      `${formatNumber(miles)} mi`;


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
    unitInput.value = "ft";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    summaryInput.textContent = "—";
    summaryMeters.textContent = "—";
    summaryFeet.textContent = "—";
    summaryMiles.textContent = "—";

    valueInput.focus();
  }


  calculateButton.addEventListener("click", calculateLength);

  resetButton.addEventListener("click", resetCalculator);


  /*
    Allow Enter to calculate.
  */

  valueInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateLength();
    }
  });

  unitInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateLength();
    }
  });

});