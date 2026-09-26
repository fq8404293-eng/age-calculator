document.addEventListener("DOMContentLoaded", () => {
  const lengthInput = document.getElementById("concrete-length");
  const widthInput = document.getElementById("concrete-width");
  const thicknessInput = document.getElementById("concrete-thickness");
  const wasteInput = document.getElementById("concrete-waste");

  const calculateButton = document.getElementById("calculate-concrete");
  const resetButton = document.getElementById("reset-concrete");

  const errorMessage = document.getElementById("concrete-error");
  const resultBox = document.getElementById("concrete-result");
  const resultContent = document.getElementById("concrete-result-content");

  if (
    !lengthInput ||
    !widthInput ||
    !thicknessInput ||
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

  function calculateConcrete() {
    clearError();

    const length = getNumber(lengthInput);
    const width = getNumber(widthInput);
    const thicknessInches = getNumber(thicknessInput);
    const wastePercent = getNumber(wasteInput);

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

    if (!Number.isFinite(thicknessInches) || thicknessInches <= 0) {
      showError("Please enter a valid thickness greater than 0.");
      thicknessInput.focus();
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

    // Convert thickness from inches to feet.
    const thicknessFeet = thicknessInches / 12;

    // Calculate geometric volume.
    const volumeCubicFeet =
      length * width * thicknessFeet;

    // Convert cubic feet to cubic yards.
    const volumeCubicYards =
      volumeCubicFeet / 27;

    // Apply waste allowance.
    const wasteFactor =
      1 + wastePercent / 100;

    const requiredCubicFeet =
      volumeCubicFeet * wasteFactor;

    const requiredCubicYards =
      volumeCubicYards * wasteFactor;

    const wasteCubicFeet =
      requiredCubicFeet - volumeCubicFeet;

    const wasteCubicYards =
      requiredCubicYards - volumeCubicYards;

    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Concrete Needed</h3>
          <p>${formatNumber(requiredCubicYards)} yd³</p>
        </div>

        <div class="result-card">
          <h3>Base Volume</h3>
          <p>${formatNumber(volumeCubicYards)} yd³</p>
        </div>

        <div class="result-card">
          <h3>Volume in Cubic Feet</h3>
          <p>${formatNumber(volumeCubicFeet)} ft³</p>
        </div>

        <div class="result-card">
          <h3>Required Cubic Feet</h3>
          <p>${formatNumber(requiredCubicFeet)} ft³</p>
        </div>

        <div class="result-card">
          <h3>Waste Allowance</h3>
          <p>${formatNumber(wastePercent)}%</p>
        </div>

        <div class="result-card">
          <h3>Waste Volume</h3>
          <p>${formatNumber(wasteCubicYards)} yd³</p>
        </div>

      </div>

      <div class="content-card" style="margin-top: 1.5rem;">

        <h3>Calculation Summary</h3>

        <p>
          <strong>Thickness Conversion:</strong>
          ${formatNumber(thicknessInches)}
          ÷ 12
          =
          ${formatNumber(thicknessFeet, 4)} ft
        </p>

        <p>
          <strong>Base Volume:</strong>
          ${formatNumber(length)}
          ×
          ${formatNumber(width)}
          ×
          ${formatNumber(thicknessFeet, 4)}
          =
          ${formatNumber(volumeCubicFeet)} cubic ft
        </p>

        <p>
          <strong>Base Volume in Cubic Yards:</strong>
          ${formatNumber(volumeCubicFeet)}
          ÷ 27
          =
          ${formatNumber(volumeCubicYards)} cubic yd
        </p>

        <p>
          <strong>Waste-Adjusted Volume:</strong>
          ${formatNumber(volumeCubicYards)}
          ×
          ${formatNumber(wasteFactor, 2)}
          =
          ${formatNumber(requiredCubicYards)} cubic yd
        </p>

        <p>
          <strong>Concrete Estimate:</strong>
          ${formatNumber(requiredCubicFeet)} cubic ft
          or
          ${formatNumber(requiredCubicYards)} cubic yd
        </p>

      </div>

      <div class="info-box" style="margin-top: 1.5rem;">

        <p>
          <strong>Practical estimate:</strong>
          The project has a base volume of
          ${formatNumber(volumeCubicYards)} cubic yards.
          With a ${formatNumber(wastePercent)}% waste allowance,
          the estimated requirement is
          ${formatNumber(requiredCubicYards)} cubic yards.
        </p>

        <p class="small-text">
          The waste allowance adds approximately
          ${formatNumber(wasteCubicFeet)} cubic feet
          (${formatNumber(wasteCubicYards)} cubic yards)
          to the geometric volume.
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
    thicknessInput.value = "";

    wasteInput.value = "10";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    lengthInput.focus();
  }

  calculateButton.addEventListener(
    "click",
    calculateConcrete
  );

  resetButton.addEventListener(
    "click",
    resetCalculator
  );

  [
    lengthInput,
    widthInput,
    thicknessInput,
    wasteInput
  ].forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        calculateConcrete();
      }
    });
  });
});