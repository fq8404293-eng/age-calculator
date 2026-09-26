document.addEventListener("DOMContentLoaded", () => {
  const lengthInput = document.getElementById("roof-length");
  const widthInput = document.getElementById("roof-width");
  const riseInput = document.getElementById("pitch-rise");
  const runInput = document.getElementById("pitch-run");
  const overhangInput = document.getElementById("roof-overhang");
  const wasteInput = document.getElementById("roof-waste");

  const calculateButton = document.getElementById("calculate-roofing");
  const resetButton = document.getElementById("reset-roofing");

  const errorBox = document.getElementById("roofing-error");
  const resultBox = document.getElementById("roofing-result");
  const resultContent = document.getElementById("roofing-result-content");

  const summaryFootprint = document.getElementById("summary-roof-footprint");
  const summaryPitch = document.getElementById("summary-roof-pitch");
  const summaryArea = document.getElementById("summary-roof-area");
  const summaryWaste = document.getElementById("summary-roof-waste");

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
    resultBox.hidden = true;
  }

  function clearError() {
    errorBox.textContent = "";
    errorBox.hidden = true;
  }

  function formatNumber(value, decimals = 2) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function calculateRoofing() {
    clearError();

    const length = parseFloat(lengthInput.value);
    const width = parseFloat(widthInput.value);
    const rise = parseFloat(riseInput.value);
    const run = parseFloat(runInput.value);

    const overhangValue =
      overhangInput.value.trim() === ""
        ? 0
        : parseFloat(overhangInput.value);

    const wasteValue =
      wasteInput.value.trim() === ""
        ? 0
        : parseFloat(wasteInput.value);

    if (!Number.isFinite(length) || length <= 0) {
      showError("Please enter a valid roof length greater than 0.");
      lengthInput.focus();
      return;
    }

    if (!Number.isFinite(width) || width <= 0) {
      showError("Please enter a valid roof width greater than 0.");
      widthInput.focus();
      return;
    }

    if (!Number.isFinite(rise) || rise < 0) {
      showError("Please enter a valid pitch rise of 0 or greater.");
      riseInput.focus();
      return;
    }

    if (!Number.isFinite(run) || run <= 0) {
      showError("Please enter a valid pitch run greater than 0.");
      runInput.focus();
      return;
    }

    if (!Number.isFinite(overhangValue) || overhangValue < 0) {
      showError("Please enter a valid overhang of 0 or greater.");
      overhangInput.focus();
      return;
    }

    if (!Number.isFinite(wasteValue) || wasteValue < 0 || wasteValue > 100) {
      showError("Roofing waste must be between 0% and 100%.");
      wasteInput.focus();
      return;
    }

    /*
     * The overhang is entered for each side.
     * Therefore, add twice the overhang to both dimensions.
     */
    const adjustedLength = length + (2 * overhangValue);
    const adjustedWidth = width + (2 * overhangValue);

    const roofFootprint = adjustedLength * adjustedWidth;

    /*
     * Pitch factor:
     *
     * sqrt(1 + (rise / run)^2)
     *
     * For a symmetrical gable roof, this factor converts
     * the horizontal roof footprint into the sloped roof area.
     */
    const pitchFactor = Math.sqrt(
      1 + Math.pow(rise / run, 2)
    );

    const slopedRoofArea = roofFootprint * pitchFactor;

    const wasteAmount = slopedRoofArea * (wasteValue / 100);

    const totalRoofingArea = slopedRoofArea + wasteAmount;

    // Useful conversions
    const slopedRoofSquareFeet = slopedRoofArea;
    const roofingSquares = totalRoofingArea / 100;
    const roofingSquareMeters = totalRoofingArea * 0.092903;
    const roofSquaresBeforeWaste = slopedRoofArea / 100;

    // Pitch percentage
    const pitchPercent = (rise / run) * 100;

    // Pitch angle in degrees
    const pitchAngle =
      Math.atan(rise / run) * (180 / Math.PI);

    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Adjusted Roof Footprint</h3>
          <p class="result-value">
            ${formatNumber(roofFootprint)} ft²
          </p>
          <p>
            ${formatNumber(adjustedLength)} ft ×
            ${formatNumber(adjustedWidth)} ft
          </p>
        </div>

        <div class="result-card">
          <h3>Pitch Factor</h3>
          <p class="result-value">
            ${formatNumber(pitchFactor, 4)}
          </p>
          <p>
            ${rise}:${run} pitch
          </p>
        </div>

        <div class="result-card">
          <h3>Sloped Roof Area</h3>
          <p class="result-value">
            ${formatNumber(slopedRoofArea)} ft²
          </p>
          <p>
            ${formatNumber(roofSquaresBeforeWaste)} roofing squares
          </p>
        </div>

        <div class="result-card">
          <h3>Waste / Allowance</h3>
          <p class="result-value">
            ${formatNumber(wasteAmount)} ft²
          </p>
          <p>
            ${formatNumber(wasteValue)}%
          </p>
        </div>

        <div class="result-card">
          <h3>Roofing Area Needed</h3>
          <p class="result-value">
            ${formatNumber(totalRoofingArea)} ft²
          </p>
          <p>
            Includes waste allowance
          </p>
        </div>

        <div class="result-card">
          <h3>Roofing Squares</h3>
          <p class="result-value">
            ${formatNumber(roofingSquares)} squares
          </p>
          <p>
            1 roofing square = 100 ft²
          </p>
        </div>

      </div>

      <div class="info-box">
        <h3>Roofing Estimate Summary</h3>
        <p>
          A ${formatNumber(length)} ft × ${formatNumber(width)} ft
          roof with a ${rise}:${run} pitch has approximately
          <strong>${formatNumber(slopedRoofArea)} ft²</strong>
          of sloped roof area before waste.
        </p>
        <p>
          With a ${formatNumber(wasteValue)}% allowance, plan for
          approximately <strong>${formatNumber(totalRoofingArea)} ft²</strong>
          of roofing material, or
          <strong>${formatNumber(roofingSquares)} roofing squares</strong>.
        </p>
      </div>

      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Roof Pitch</h3>
          <p class="result-value">${rise}:${run}</p>
          <p>${formatNumber(pitchPercent)}% slope</p>
        </div>

        <div class="result-card">
          <h3>Pitch Angle</h3>
          <p class="result-value">
            ${formatNumber(pitchAngle)}°
          </p>
          <p>Approximate roof angle</p>
        </div>

        <div class="result-card">
          <h3>Metric Area</h3>
          <p class="result-value">
            ${formatNumber(roofingSquareMeters)} m²
          </p>
          <p>Including waste allowance</p>
        </div>

      </div>
    `;

    summaryFootprint.textContent =
      `${formatNumber(roofFootprint)} ft²`;

    summaryPitch.textContent =
      `${rise}:${run}`;

    summaryArea.textContent =
      `${formatNumber(slopedRoofArea)} ft²`;

    summaryWaste.textContent =
      `${formatNumber(wasteValue)}%`;

    resultBox.hidden = false;

    resultBox.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function resetCalculator() {
    lengthInput.value = "";
    widthInput.value = "";
    riseInput.value = "";
    runInput.value = "";
    overhangInput.value = "";
    wasteInput.value = "";

    clearError();

    resultContent.innerHTML = "";
    resultBox.hidden = true;

    summaryFootprint.textContent = "—";
    summaryPitch.textContent = "—";
    summaryArea.textContent = "—";
    summaryWaste.textContent = "—";

    lengthInput.focus();
  }

  calculateButton.addEventListener("click", calculateRoofing);
  resetButton.addEventListener("click", resetCalculator);

  [
    lengthInput,
    widthInput,
    riseInput,
    runInput,
    overhangInput,
    wasteInput
  ].forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        calculateRoofing();
      }
    });
  });
});