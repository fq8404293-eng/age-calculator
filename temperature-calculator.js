document.addEventListener("DOMContentLoaded", function () {
  const valueInput = document.getElementById("temperature-value");
  const unitInput = document.getElementById("temperature-unit");

  const calculateButton = document.getElementById("temperature-calculate");
  const resetButton = document.getElementById("temperature-reset");

  const errorBox = document.getElementById("temperature-error");

  const resultBox = document.getElementById("temperature-result");
  const resultContent = document.getElementById("temperature-result-content");

  const summaryInput = document.getElementById("temperature-summary-input");
  const summaryCelsius = document.getElementById("temperature-summary-celsius");
  const summaryFahrenheit = document.getElementById("temperature-summary-fahrenheit");
  const summaryKelvin = document.getElementById("temperature-summary-kelvin");


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


  function calculateTemperature() {
    clearError();

    const value = Number(valueInput.value);
    const unit = unitInput.value;

    if (valueInput.value.trim() === "") {
      showError("Please enter a temperature value.");
      valueInput.focus();
      return;
    }

    if (!Number.isFinite(value)) {
      showError("Please enter a valid temperature.");
      valueInput.focus();
      return;
    }


    /*
      Convert the input temperature to Celsius first.
    */

    let celsius;

    if (unit === "C") {
      celsius = value;
    } else if (unit === "F") {
      celsius = (value - 32) * 5 / 9;
    } else if (unit === "K") {
      celsius = value - 273.15;
    } else {
      showError("Please select a valid temperature unit.");
      unitInput.focus();
      return;
    }


    /*
      Kelvin cannot be below absolute zero.
    */

    if (celsius < -273.15) {
      showError(
        "Temperature cannot be below absolute zero (−273.15°C or 0 K)."
      );
      valueInput.focus();
      return;
    }


    /*
      Convert Celsius to the other temperature scales.
    */

    const fahrenheit = (celsius * 9 / 5) + 32;
    const kelvin = celsius + 273.15;


    /*
      Display results.
    */

    resultContent.innerHTML = `

      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Celsius</h3>
          <p>${formatNumber(celsius)} °C</p>
        </div>

        <div class="result-card">
          <h3>Fahrenheit</h3>
          <p>${formatNumber(fahrenheit)} °F</p>
        </div>

        <div class="result-card">
          <h3>Kelvin</h3>
          <p>${formatNumber(kelvin)} K</p>
        </div>

      </div>


      <div class="info-box">

        <p>
          <strong>
            ${formatNumber(value)} ${unit === "C" ? "°C" : unit === "F" ? "°F" : "K"}
          </strong>
          equals
          <strong>
            ${formatNumber(celsius)} °C
          </strong>,
          <strong>
            ${formatNumber(fahrenheit)} °F
          </strong>,
          and
          <strong>
            ${formatNumber(kelvin)} K
          </strong>.
        </p>

        <p>
          The calculation first converts the entered temperature to
          Celsius and then converts it to Fahrenheit and Kelvin.
        </p>

      </div>

    `;


    /*
      Update summary.
    */

    summaryInput.textContent =
      `${formatNumber(value)} ${unit === "C" ? "°C" : unit === "F" ? "°F" : "K"}`;

    summaryCelsius.textContent =
      `${formatNumber(celsius)} °C`;

    summaryFahrenheit.textContent =
      `${formatNumber(fahrenheit)} °F`;

    summaryKelvin.textContent =
      `${formatNumber(kelvin)} K`;


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
    unitInput.value = "C";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    summaryInput.textContent = "—";
    summaryCelsius.textContent = "—";
    summaryFahrenheit.textContent = "—";
    summaryKelvin.textContent = "—";

    valueInput.focus();
  }


  calculateButton.addEventListener("click", calculateTemperature);

  resetButton.addEventListener("click", resetCalculator);


  /*
    Allow Enter to calculate.
  */

  valueInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateTemperature();
    }
  });

  unitInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateTemperature();
    }
  });

});