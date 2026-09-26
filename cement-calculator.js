document.addEventListener("DOMContentLoaded", () => {
  const volumeInput = document.getElementById("concrete-volume");
  const volumeUnit = document.getElementById("volume-unit");

  const cementRatioInput = document.getElementById("cement-ratio");
  const sandRatioInput = document.getElementById("sand-ratio");
  const aggregateRatioInput = document.getElementById("aggregate-ratio");

  const wasteInput = document.getElementById("cement-waste");
  const bagSizeSelect = document.getElementById("cement-bag-size");

  const calculateButton = document.getElementById("calculate-cement");
  const resetButton = document.getElementById("reset-cement");

  const errorBox = document.getElementById("cement-error");
  const resultBox = document.getElementById("cement-result");
  const resultContent = document.getElementById("cement-result-content");

  const summaryVolume = document.getElementById("summary-concrete-volume");
  const summaryMixRatio = document.getElementById("summary-mix-ratio");
  const summaryCement = document.getElementById("summary-cement-required");
  const summaryBags = document.getElementById("summary-cement-bags");

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

  function getVolumeInCubicFeet(volume, unit) {
    if (unit === "cubic-feet") {
      return volume;
    }

    if (unit === "cubic-yards") {
      return volume * 27;
    }

    if (unit === "cubic-meters") {
      return volume * 35.3146667;
    }

    return NaN;
  }

  function getUnitLabel(unit) {
    if (unit === "cubic-feet") return "ft³";
    if (unit === "cubic-yards") return "yd³";
    if (unit === "cubic-meters") return "m³";

    return "";
  }

  function getBagInfo(value) {
    const option = bagSizeSelect.options[bagSizeSelect.selectedIndex];
    const label = option ? option.textContent : `${value} lb bag`;

    return {
      value: Number(value),
      label
    };
  }

  function calculateCement() {
    clearError();

    const volume = Number.parseFloat(volumeInput.value);
    const cementRatio = Number.parseFloat(cementRatioInput.value);
    const sandRatio = Number.parseFloat(sandRatioInput.value);
    const aggregateRatio = Number.parseFloat(aggregateRatioInput.value);

    const wasteValue =
      wasteInput.value.trim() === ""
        ? 0
        : Number.parseFloat(wasteInput.value);

    const selectedBagValue = Number.parseFloat(bagSizeSelect.value);

    if (!Number.isFinite(volume) || volume <= 0) {
      showError("Please enter a concrete volume greater than 0.");
      volumeInput.focus();
      return;
    }

    if (!Number.isFinite(cementRatio) || cementRatio <= 0) {
      showError("Please enter a cement ratio greater than 0.");
      cementRatioInput.focus();
      return;
    }

    if (!Number.isFinite(sandRatio) || sandRatio < 0) {
      showError("Please enter a valid sand ratio.");
      sandRatioInput.focus();
      return;
    }

    if (!Number.isFinite(aggregateRatio) || aggregateRatio < 0) {
      showError("Please enter a valid aggregate ratio.");
      aggregateRatioInput.focus();
      return;
    }

    if (
      !Number.isFinite(wasteValue) ||
      wasteValue < 0 ||
      wasteValue > 100
    ) {
      showError("Waste allowance must be between 0% and 100%.");
      wasteInput.focus();
      return;
    }

    if (!Number.isFinite(selectedBagValue) || selectedBagValue <= 0) {
      showError("Please select a valid cement bag size.");
      bagSizeSelect.focus();
      return;
    }

    const totalParts =
      cementRatio + sandRatio + aggregateRatio;

    if (totalParts <= 0) {
      showError("The total mix ratio must be greater than 0.");
      return;
    }

    const volumeInCubicFeet = getVolumeInCubicFeet(
      volume,
      volumeUnit.value
    );

    if (!Number.isFinite(volumeInCubicFeet) || volumeInCubicFeet <= 0) {
      showError("Please enter a valid concrete volume.");
      return;
    }

    /*
      Estimate cement volume from the selected mix ratio.
    */
    const cementFraction = cementRatio / totalParts;

    const baseCementVolumeFt3 =
      volumeInCubicFeet * cementFraction;

    const wasteFactor = 1 + wasteValue / 100;

    const cementVolumeWithWasteFt3 =
      baseCementVolumeFt3 * wasteFactor;

    /*
      Convert cubic feet to cubic yards and cubic meters.
    */
    const cementVolumeYd3 =
      cementVolumeWithWasteFt3 / 27;

    const cementVolumeM3 =
      cementVolumeWithWasteFt3 / 35.3146667;

    /*
      Approximate cement density.

      94 lb/ft³ is used as a practical bulk-density estimate
      for converting cement volume to weight.
    */
    const cementDensityLbPerFt3 = 94;

    const cementWeightLb =
      cementVolumeWithWasteFt3 * cementDensityLbPerFt3;

    const cementWeightKg =
      cementWeightLb * 0.45359237;

    /*
      Bag size handling.

      The dropdown contains both lb and kg options, so determine
      the actual unit from the selected option text.
    */
    const bagInfo = getBagInfo(selectedBagValue);
    const bagLabel = bagInfo.label.toLowerCase();

    let bagWeightKg;

    if (bagLabel.includes("kg")) {
      bagWeightKg = selectedBagValue;
    } else {
      bagWeightKg = selectedBagValue * 0.45359237;
    }

    const exactBags =
      cementWeightKg / bagWeightKg;

    const bagsToPurchase =
      Math.ceil(exactBags);

    const mixRatioText =
      `${formatSmart(cementRatio)} : ${formatSmart(sandRatio)} : ${formatSmart(aggregateRatio)}`;

    const inputVolumeUnit = getUnitLabel(volumeUnit.value);

    /*
      Result section
    */
    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Concrete Volume</h3>
          <p>${formatNumber(volume)} ${inputVolumeUnit}</p>
        </div>

        <div class="result-card">
          <h3>Mix Ratio</h3>
          <p>${mixRatioText}</p>
        </div>

        <div class="result-card">
          <h3>Cement Volume</h3>
          <p>${formatNumber(cementVolumeWithWasteFt3)} ft³</p>
        </div>

        <div class="result-card">
          <h3>Cement Weight</h3>
          <p>${formatNumber(cementWeightKg)} kg</p>
        </div>

        <div class="result-card">
          <h3>Exact Bag Requirement</h3>
          <p>${formatNumber(exactBags)} bags</p>
        </div>

        <div class="result-card">
          <h3>Bags to Purchase</h3>
          <p>${bagsToPurchase} bags</p>
        </div>

      </div>

      <div class="info-box">

        <p>
          <strong>Cement before waste:</strong>
          ${formatNumber(baseCementVolumeFt3)} ft³
        </p>

        <p>
          <strong>Waste allowance:</strong>
          ${formatNumber(wasteValue)}%
        </p>

        <p>
          <strong>Cement with waste:</strong>
          ${formatNumber(cementVolumeWithWasteFt3)} ft³
          (${formatNumber(cementVolumeYd3)} yd³ /
          ${formatNumber(cementVolumeM3)} m³)
        </p>

        <p>
          <strong>Selected bag:</strong>
          ${bagInfo.label}
        </p>

        <p>
          <strong>Estimated cement weight:</strong>
          ${formatNumber(cementWeightLb)} lb
          (${formatNumber(cementWeightKg)} kg)
        </p>

        <p>
          <strong>Recommended purchase:</strong>
          ${bagsToPurchase} bags
        </p>

      </div>

      <p class="small-text">
        This is an estimate based on the entered mix ratio and an assumed
        cement bulk density of approximately 94 lb per cubic foot.
        Actual material requirements can vary by cement type, moisture,
        batching method, compaction, and project specifications.
      </p>
    `;

    /*
      Summary cards
    */
    summaryVolume.textContent =
      `${formatNumber(volume)} ${inputVolumeUnit}`;

    summaryMixRatio.textContent =
      mixRatioText;

    summaryCement.textContent =
      `${formatNumber(cementWeightKg)} kg`;

    summaryBags.textContent =
      `${bagsToPurchase} bags`;

    resultBox.hidden = false;

    setTimeout(() => {
      resultBox.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 50);
  }

  function resetCalculator() {
    volumeInput.value = "";
    volumeUnit.value = "cubic-feet";

    cementRatioInput.value = "";
    sandRatioInput.value = "";
    aggregateRatioInput.value = "";

    wasteInput.value = "5";
    bagSizeSelect.value = "80";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    summaryVolume.textContent = "—";
    summaryMixRatio.textContent = "—";
    summaryCement.textContent = "—";
    summaryBags.textContent = "—";

    volumeInput.focus();
  }

  calculateButton.addEventListener("click", calculateCement);
  resetButton.addEventListener("click", resetCalculator);

  /*
    Press Enter while entering calculator values.
  */
  [
    volumeInput,
    cementRatioInput,
    sandRatioInput,
    aggregateRatioInput,
    wasteInput
  ].forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        calculateCement();
      }
    });
  });
});