document.addEventListener("DOMContentLoaded", () => {
  const lengthInput = document.getElementById("paint-length");
  const widthInput = document.getElementById("paint-width");
  const heightInput = document.getElementById("paint-height");
  const openingsInput = document.getElementById("paint-openings");
  const coatsInput = document.getElementById("paint-coats");
  const coverageInput = document.getElementById("paint-coverage");

  const calculateButton = document.getElementById("calculate-paint");
  const resetButton = document.getElementById("reset-paint");

  const errorMessage = document.getElementById("paint-error");
  const resultBox = document.getElementById("paint-result");
  const resultContent = document.getElementById("paint-result-content");

  if (
    !lengthInput ||
    !widthInput ||
    !heightInput ||
    !openingsInput ||
    !coatsInput ||
    !coverageInput ||
    !calculateButton ||
    !resetButton ||
    !errorMessage ||
    !resultBox ||
    !resultContent
  ) {
    return;
  }

  function getNumber(input) {
    return Number(input.value);
  }

  function formatNumber(value, decimals = 2) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    });
  }

  function formatGallons(value) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;

    resultBox.hidden = true;
    resultContent.innerHTML = "";
  }

  function clearError() {
    errorMessage.textContent = "";
    errorMessage.hidden = true;
  }

  function calculatePaint() {
    clearError();

    const length = getNumber(lengthInput);
    const width = getNumber(widthInput);
    const height = getNumber(heightInput);
    const openings = getNumber(openingsInput);
    const coats = getNumber(coatsInput);
    const coverage = getNumber(coverageInput);

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

    if (!Number.isFinite(height) || height <= 0) {
      showError("Please enter a valid wall height greater than 0.");
      heightInput.focus();
      return;
    }

    if (!Number.isFinite(openings) || openings < 0) {
      showError(
        "Doors and windows area cannot be negative."
      );
      openingsInput.focus();
      return;
    }

    if (!Number.isFinite(coats) || coats < 1 || !Number.isInteger(coats)) {
      showError(
        "Please enter a whole number of coats from 1 to 20."
      );
      coatsInput.focus();
      return;
    }

    if (coats > 20) {
      showError("The number of coats cannot exceed 20.");
      coatsInput.focus();
      return;
    }

    if (!Number.isFinite(coverage) || coverage <= 0) {
      showError(
        "Please enter a valid paint coverage greater than 0."
      );
      coverageInput.focus();
      return;
    }

    const wallArea = 2 * (length + width) * height;

    if (openings >= wallArea) {
      showError(
        "Doors and windows area must be less than the total wall area."
      );
      openingsInput.focus();
      return;
    }

    const paintableArea = wallArea - openings;

    const totalCoverageArea = paintableArea * coats;

    const gallonsNeeded = totalCoverageArea / coverage;

    const wholeGallons = Math.ceil(gallonsNeeded);

    const paintablePercentage =
      (paintableArea / wallArea) * 100;

    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Paint Needed</h3>
          <p>${formatGallons(gallonsNeeded)} gallons</p>
        </div>

        <div class="result-card">
          <h3>Whole Gallons</h3>
          <p>${formatNumber(wholeGallons, 0)} gallons</p>
        </div>

        <div class="result-card">
          <h3>Total Wall Area</h3>
          <p>${formatNumber(wallArea)} sq ft</p>
        </div>

        <div class="result-card">
          <h3>Paintable Area</h3>
          <p>${formatNumber(paintableArea)} sq ft</p>
        </div>

        <div class="result-card">
          <h3>Total Coverage Area</h3>
          <p>${formatNumber(totalCoverageArea)} sq ft</p>
        </div>

        <div class="result-card">
          <h3>Paintable Surface</h3>
          <p>${formatNumber(paintablePercentage)}%</p>
        </div>

      </div>

      <div class="content-card" style="margin-top: 1.5rem;">

        <h3>Calculation Summary</h3>

        <p>
          <strong>Wall Area:</strong>
          2 × (${formatNumber(length)} + ${formatNumber(width)})
          × ${formatNumber(height)}
          = ${formatNumber(wallArea)} sq ft
        </p>

        <p>
          <strong>Paintable Area:</strong>
          ${formatNumber(wallArea)}
          − ${formatNumber(openings)}
          = ${formatNumber(paintableArea)} sq ft
        </p>

        <p>
          <strong>Area for All Coats:</strong>
          ${formatNumber(paintableArea)}
          × ${formatNumber(coats, 0)}
          = ${formatNumber(totalCoverageArea)} sq ft
        </p>

        <p>
          <strong>Paint Required:</strong>
          ${formatNumber(totalCoverageArea)}
          ÷ ${formatNumber(coverage)}
          = ${formatGallons(gallonsNeeded)} gallons
        </p>

      </div>

      <div class="info-box" style="margin-top: 1.5rem;">

        <p>
          <strong>Practical purchase estimate:</strong>
          The mathematical estimate is
          ${formatGallons(gallonsNeeded)} gallons.
          If paint is sold in whole-gallon containers,
          ${formatNumber(wholeGallons, 0)} gallons would cover
          the calculated requirement.
        </p>

        <p class="small-text">
          Actual paint usage may vary because of surface texture,
          porosity, application method, paint type, and manufacturer
          coverage.
        </p>

      </div>
    `;

    resultBox.hidden = false;

    setTimeout(() => {
      resultBox.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  }

  function resetPaintCalculator() {
    lengthInput.value = "";
    widthInput.value = "";
    heightInput.value = "";

    openingsInput.value = "0";
    coatsInput.value = "2";
    coverageInput.value = "350";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    lengthInput.focus();
  }

  calculateButton.addEventListener("click", calculatePaint);

  resetButton.addEventListener("click", resetPaintCalculator);

  [
    lengthInput,
    widthInput,
    heightInput,
    openingsInput,
    coatsInput,
    coverageInput
  ].forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        calculatePaint();
      }
    });
  });
});