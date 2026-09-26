document.addEventListener("DOMContentLoaded", () => {
  const lengthInput = document.getElementById("square-length");
  const widthInput = document.getElementById("square-width");
  const unitInput = document.getElementById("square-unit");

  const calculateButton = document.getElementById("calculate-square");
  const resetButton = document.getElementById("reset-square");

  const errorBox = document.getElementById("square-error");
  const resultBox = document.getElementById("square-result");
  const resultContent = document.getElementById("square-result-content");

  const summaryLength = document.getElementById("summary-square-length");
  const summaryWidth = document.getElementById("summary-square-width");
  const summaryArea = document.getElementById("summary-square-area");
  const summaryMeters = document.getElementById("summary-square-meters");

  // Conversion factors to feet
  const unitToFeet = {
    ft: 1,
    in: 1 / 12,
    yd: 3,
    m: 3.280839895013123,
    cm: 0.03280839895013123
  };

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

  function calculateSquareFeet() {
    clearError();

    const length = parseFloat(lengthInput.value);
    const width = parseFloat(widthInput.value);
    const unit = unitInput.value;

    if (!Number.isFinite(length) || length <= 0) {
      showError("Please enter a valid length greater than 0.");
      lengthInput.focus();
      return;
    }

    if (!Number.isFinite(width) || width <= 0) {
      showError("Please enter a valid width greater than 0.");
      widthInput.focus();
      return;
    }

    if (!unitToFeet[unit]) {
      showError("Please select a valid measurement unit.");
      unitInput.focus();
      return;
    }

    // Convert both dimensions to feet
    const lengthFeet = length * unitToFeet[unit];
    const widthFeet = width * unitToFeet[unit];

    // Calculate square footage
    const squareFeet = lengthFeet * widthFeet;

    // Convert to other useful area units
    const squareMeters = squareFeet * 0.09290304;
    const squareYards = squareFeet / 9;
    const squareInches = squareFeet * 144;
    const acres = squareFeet / 43560;

    // Original-unit area
    const originalUnitArea = length * width;

    const unitNames = {
      ft: "ft²",
      in: "in²",
      yd: "yd²",
      m: "m²",
      cm: "cm²"
    };

    const selectedUnitName = unitNames[unit];

    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Square Feet</h3>
          <p class="result-value">
            ${formatNumber(squareFeet)} ft²
          </p>
          <p>
            Primary area measurement
          </p>
        </div>

        <div class="result-card">
          <h3>Square Meters</h3>
          <p class="result-value">
            ${formatNumber(squareMeters)} m²
          </p>
          <p>
            Metric area
          </p>
        </div>

        <div class="result-card">
          <h3>Square Yards</h3>
          <p class="result-value">
            ${formatNumber(squareYards)} yd²
          </p>
          <p>
            Area in square yards
          </p>
        </div>

        <div class="result-card">
          <h3>Square Inches</h3>
          <p class="result-value">
            ${formatNumber(squareInches)} in²
          </p>
          <p>
            Area in square inches
          </p>
        </div>

        <div class="result-card">
          <h3>Acres</h3>
          <p class="result-value">
            ${formatNumber(acres, 4)} acres
          </p>
          <p>
            Approximate land area
          </p>
        </div>

        <div class="result-card">
          <h3>Entered Area</h3>
          <p class="result-value">
            ${formatNumber(originalUnitArea)} ${selectedUnitName}
          </p>
          <p>
            Based on your selected unit
          </p>
        </div>

      </div>

      <div class="info-box">

        <h3>Square Footage Calculation</h3>

        <p>
          ${formatNumber(length)} ${unit} ×
          ${formatNumber(width)} ${unit}
          =
          <strong>${formatNumber(originalUnitArea)} ${selectedUnitName}</strong>
        </p>

        <p>
          After converting the measurements to feet, the area is
          <strong>${formatNumber(squareFeet)} ft²</strong>.
        </p>

      </div>
    `;

    // Update summary
    summaryLength.textContent =
      `${formatNumber(length)} ${unit}`;

    summaryWidth.textContent =
      `${formatNumber(width)} ${unit}`;

    summaryArea.textContent =
      `${formatNumber(squareFeet)} ft²`;

    summaryMeters.textContent =
      `${formatNumber(squareMeters)} m²`;

    resultBox.hidden = false;

    resultBox.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function resetCalculator() {
    lengthInput.value = "";
    widthInput.value = "";
    unitInput.value = "ft";

    clearError();

    resultContent.innerHTML = "";
    resultBox.hidden = true;

    summaryLength.textContent = "—";
    summaryWidth.textContent = "—";
    summaryArea.textContent = "—";
    summaryMeters.textContent = "—";

    lengthInput.focus();
  }

  calculateButton.addEventListener(
    "click",
    calculateSquareFeet
  );

  resetButton.addEventListener(
    "click",
    resetCalculator
  );

  // Enter key support
  [lengthInput, widthInput].forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        calculateSquareFeet();
      }
    });
  });
});