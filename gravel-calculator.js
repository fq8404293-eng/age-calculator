document.addEventListener("DOMContentLoaded", () => {
  const lengthInput = document.getElementById("gravel-length");
  const widthInput = document.getElementById("gravel-width");
  const depthInput = document.getElementById("gravel-depth");
  const depthUnit = document.getElementById("depth-unit");
  const wasteInput = document.getElementById("gravel-waste");

  const calculateButton = document.getElementById("calculate-gravel");
  const resetButton = document.getElementById("reset-gravel");

  const errorBox = document.getElementById("gravel-error");
  const resultBox = document.getElementById("gravel-result");
  const resultContent = document.getElementById("gravel-result-content");

  const summaryProjectArea =
    document.getElementById("summary-project-area");

  const summaryGravelDepth =
    document.getElementById("summary-gravel-depth");

  const summaryGravelRequired =
    document.getElementById("summary-gravel-required");

  const summaryGravelWaste =
    document.getElementById("summary-gravel-waste");

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
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function formatSmart(value, decimals = 2) {
    return Number(value).toLocaleString("en-US", {
      maximumFractionDigits: decimals
    });
  }

  function convertDepthToFeet(depth, unit) {
    switch (unit) {
      case "inches":
        return depth / 12;

      case "feet":
        return depth;

      case "centimeters":
        return depth / 30.48;

      case "meters":
        return depth * 3.280839895;

      default:
        return NaN;
    }
  }

  function getDepthUnitLabel(unit) {
    switch (unit) {
      case "inches":
        return "in";

      case "feet":
        return "ft";

      case "centimeters":
        return "cm";

      case "meters":
        return "m";

      default:
        return "";
    }
  }

  function calculateGravel() {
    clearError();

    const length = Number.parseFloat(lengthInput.value);
    const width = Number.parseFloat(widthInput.value);
    const depth = Number.parseFloat(depthInput.value);

    const waste =
      wasteInput.value.trim() === ""
        ? 0
        : Number.parseFloat(wasteInput.value);

    if (!Number.isFinite(length) || length <= 0) {
      showError("Please enter a length greater than 0.");
      lengthInput.focus();
      return;
    }

    if (!Number.isFinite(width) || width <= 0) {
      showError("Please enter a width greater than 0.");
      widthInput.focus();
      return;
    }

    if (!Number.isFinite(depth) || depth <= 0) {
      showError("Please enter a gravel depth greater than 0.");
      depthInput.focus();
      return;
    }

    if (!Number.isFinite(waste) || waste < 0 || waste > 100) {
      showError("Waste / settling allowance must be between 0% and 100%.");
      wasteInput.focus();
      return;
    }

    /*
      Convert the entered depth to feet.
    */
    const depthInFeet = convertDepthToFeet(
      depth,
      depthUnit.value
    );

    if (!Number.isFinite(depthInFeet) || depthInFeet <= 0) {
      showError("Please enter a valid gravel depth.");
      depthInput.focus();
      return;
    }

    /*
      Calculate project area.
    */
    const projectAreaFt2 =
      length * width;

    /*
      Calculate gravel volume before allowance.
    */
    const gravelVolumeFt3 =
      projectAreaFt2 * depthInFeet;

    /*
      Apply waste / settling allowance.
    */
    const allowanceFactor =
      1 + waste / 100;

    const gravelVolumeWithAllowanceFt3 =
      gravelVolumeFt3 * allowanceFactor;

    /*
      Calculate additional volume.
    */
    const additionalVolumeFt3 =
      gravelVolumeWithAllowanceFt3 -
      gravelVolumeFt3;

    /*
      Convert volumes.
    */
    const gravelVolumeYd3 =
      gravelVolumeWithAllowanceFt3 / 27;

    const gravelVolumeM3 =
      gravelVolumeWithAllowanceFt3 / 35.3146667;

    const baseVolumeYd3 =
      gravelVolumeFt3 / 27;

    const baseVolumeM3 =
      gravelVolumeFt3 / 35.3146667;

    const additionalVolumeYd3 =
      additionalVolumeFt3 / 27;

    const additionalVolumeM3 =
      additionalVolumeFt3 / 35.3146667;

    /*
      Convert project area to square meters.
    */
    const projectAreaM2 =
      projectAreaFt2 * 0.09290304;

    /*
      Result section.
    */
    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Project Area</h3>
          <p>${formatNumber(projectAreaFt2)} ft²</p>
        </div>

        <div class="result-card">
          <h3>Gravel Depth</h3>
          <p>${formatSmart(depth)} ${getDepthUnitLabel(depthUnit.value)}</p>
        </div>

        <div class="result-card">
          <h3>Gravel Before Allowance</h3>
          <p>${formatNumber(gravelVolumeFt3)} ft³</p>
        </div>

        <div class="result-card">
          <h3>Gravel With Allowance</h3>
          <p>${formatNumber(gravelVolumeWithAllowanceFt3)} ft³</p>
        </div>

        <div class="result-card">
          <h3>Gravel Quantity</h3>
          <p>${formatNumber(gravelVolumeYd3)} yd³</p>
        </div>

        <div class="result-card">
          <h3>Gravel Quantity</h3>
          <p>${formatNumber(gravelVolumeM3)} m³</p>
        </div>

      </div>

      <div class="info-box">

        <p>
          <strong>Project dimensions:</strong>
          ${formatSmart(length)} × ${formatSmart(width)} ft
        </p>

        <p>
          <strong>Project area:</strong>
          ${formatNumber(projectAreaFt2)} ft²
          (${formatNumber(projectAreaM2)} m²)
        </p>

        <p>
          <strong>Depth in feet:</strong>
          ${formatNumber(depthInFeet, 4)} ft
        </p>

        <p>
          <strong>Gravel before allowance:</strong>
          ${formatNumber(gravelVolumeFt3)} ft³
          (${formatNumber(baseVolumeYd3)} yd³ /
          ${formatNumber(baseVolumeM3)} m³)
        </p>

        <p>
          <strong>Waste / settling allowance:</strong>
          ${formatNumber(waste)}%
        </p>

        <p>
          <strong>Additional volume:</strong>
          ${formatNumber(additionalVolumeFt3)} ft³
          (${formatNumber(additionalVolumeYd3)} yd³ /
          ${formatNumber(additionalVolumeM3)} m³)
        </p>

        <p>
          <strong>Recommended gravel volume:</strong>
          ${formatNumber(gravelVolumeWithAllowanceFt3)} ft³
          (${formatNumber(gravelVolumeYd3)} yd³ /
          ${formatNumber(gravelVolumeM3)} m³)
        </p>

      </div>

      <p class="small-text">
        This is a volume estimate. Actual gravel requirements can vary because
        of material grading, compaction, settling, moisture, project shape,
        and installation conditions.
      </p>
    `;

    /*
      Summary cards.
    */
    summaryProjectArea.textContent =
      `${formatNumber(projectAreaFt2)} ft²`;

    summaryGravelDepth.textContent =
      `${formatSmart(depth)} ${getDepthUnitLabel(depthUnit.value)}`;

    summaryGravelRequired.textContent =
      `${formatNumber(gravelVolumeFt3)} ft³`;

    summaryGravelWaste.textContent =
      `${formatNumber(gravelVolumeWithAllowanceFt3)} ft³`;

    resultBox.hidden = false;

    setTimeout(() => {
      resultBox.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 50);
  }

  function resetCalculator() {
    lengthInput.value = "";
    widthInput.value = "";
    depthInput.value = "";

    depthUnit.value = "inches";
    wasteInput.value = "10";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    summaryProjectArea.textContent = "—";
    summaryGravelDepth.textContent = "—";
    summaryGravelRequired.textContent = "—";
    summaryGravelWaste.textContent = "—";

    lengthInput.focus();
  }

  calculateButton.addEventListener(
    "click",
    calculateGravel
  );

  resetButton.addEventListener(
    "click",
    resetCalculator
  );

  [
    lengthInput,
    widthInput,
    depthInput,
    wasteInput
  ].forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        calculateGravel();
      }
    });
  });
});