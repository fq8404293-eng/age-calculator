document.addEventListener("DOMContentLoaded", () => {
  const lengthInput = document.getElementById("flooring-length");
  const widthInput = document.getElementById("flooring-width");
  const coverageInput = document.getElementById("flooring-coverage");
  const wasteInput = document.getElementById("flooring-waste");

  const calculateButton = document.getElementById("calculate-flooring");
  const resetButton = document.getElementById("reset-flooring");

  const errorMessage = document.getElementById("flooring-error");
  const resultBox = document.getElementById("flooring-result");
  const resultContent = document.getElementById("flooring-result-content");

  if (
    !lengthInput ||
    !widthInput ||
    !coverageInput ||
    !wasteInput ||
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

  function calculateFlooring() {
    clearError();

    const length = getNumber(lengthInput);
    const width = getNumber(widthInput);
    const coveragePerBox = getNumber(coverageInput);
    const wastePercent = getNumber(wasteInput);

    if (!Number.isFinite(length) || length <= 0) {
      showError("Please enter a valid floor length greater than 0.");
      lengthInput.focus();
      return;
    }

    if (!Number.isFinite(width) || width <= 0) {
      showError("Please enter a valid floor width greater than 0.");
      widthInput.focus();
      return;
    }

    if (!Number.isFinite(coveragePerBox) || coveragePerBox <= 0) {
      showError(
        "Please enter a valid coverage per box greater than 0."
      );
      coverageInput.focus();
      return;
    }

    if (
      !Number.isFinite(wastePercent) ||
      wastePercent < 0 ||
      wastePercent > 50
    ) {
      showError("Waste allowance must be between 0% and 50%.");
      wasteInput.focus();
      return;
    }

    const floorArea = length * width;

    const wasteFactor = 1 + wastePercent / 100;

    const requiredArea = floorArea * wasteFactor;

    const boxesExact = requiredArea / coveragePerBox;

    const boxesNeeded = Math.ceil(boxesExact);

    const purchasedCoverage = boxesNeeded * coveragePerBox;

    const extraCoverage = purchasedCoverage - floorArea;

    const wasteArea = requiredArea - floorArea;

    const practicalExtraArea =
      purchasedCoverage - requiredArea;

    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Floor Area</h3>
          <p>${formatNumber(floorArea)} sq ft</p>
        </div>

        <div class="result-card">
          <h3>Required Area</h3>
          <p>${formatNumber(requiredArea)} sq ft</p>
        </div>

        <div class="result-card">
          <h3>Waste Allowance</h3>
          <p>${formatNumber(wastePercent)}%</p>
        </div>

        <div class="result-card">
          <h3>Boxes Needed</h3>
          <p>${formatNumber(boxesNeeded, 0)}</p>
        </div>

        <div class="result-card">
          <h3>Coverage per Box</h3>
          <p>${formatNumber(coveragePerBox)} sq ft</p>
        </div>

        <div class="result-card">
          <h3>Purchased Coverage</h3>
          <p>${formatNumber(purchasedCoverage)} sq ft</p>
        </div>

      </div>

      <div class="content-card" style="margin-top: 1.5rem;">

        <h3>Calculation Summary</h3>

        <p>
          <strong>Floor Area:</strong>
          ${formatNumber(length)}
          ×
          ${formatNumber(width)}
          =
          ${formatNumber(floorArea)} sq ft
        </p>

        <p>
          <strong>Waste Area:</strong>
          ${formatNumber(floorArea)}
          ×
          ${formatNumber(wastePercent / 100, 4)}
          =
          ${formatNumber(wasteArea)} sq ft
        </p>

        <p>
          <strong>Area Including Waste:</strong>
          ${formatNumber(floorArea)}
          ×
          ${formatNumber(wasteFactor, 2)}
          =
          ${formatNumber(requiredArea)} sq ft
        </p>

        <p>
          <strong>Boxes Required:</strong>
          ${formatNumber(requiredArea)}
          ÷
          ${formatNumber(coveragePerBox)}
          =
          ${formatNumber(boxesExact, 2)}
        </p>

        <p>
          <strong>Boxes to Purchase:</strong>
          ${formatNumber(boxesNeeded, 0)}
          complete boxes
        </p>

      </div>

      <div class="info-box" style="margin-top: 1.5rem;">

        <p>
          <strong>Practical estimate:</strong>
          You need approximately
          ${formatNumber(requiredArea)} sq ft of flooring
          including the ${formatNumber(wastePercent)}% waste allowance.
          At ${formatNumber(coveragePerBox)} sq ft per box,
          this requires ${formatNumber(boxesNeeded, 0)} boxes.
        </p>

        <p class="small-text">
          The calculated boxes provide approximately
          ${formatNumber(purchasedCoverage)} sq ft of material,
          leaving about ${formatNumber(practicalExtraArea)} sq ft
          beyond the waste-adjusted requirement.
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

  function resetCalculator() {
    lengthInput.value = "";
    widthInput.value = "";
    coverageInput.value = "";
    wasteInput.value = "10";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    lengthInput.focus();
  }

  calculateButton.addEventListener("click", calculateFlooring);

  resetButton.addEventListener("click", resetCalculator);

  [
    lengthInput,
    widthInput,
    coverageInput,
    wasteInput
  ].forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        calculateFlooring();
      }
    });
  });
});