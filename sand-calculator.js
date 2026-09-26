document.addEventListener("DOMContentLoaded", () => {
  const volumeInput = document.getElementById("concrete-volume");
  const volumeUnit = document.getElementById("volume-unit");

  const cementRatioInput = document.getElementById("cement-ratio");
  const sandRatioInput = document.getElementById("sand-ratio");
  const aggregateRatioInput = document.getElementById("aggregate-ratio");

  const wasteInput = document.getElementById("sand-waste");

  const calculateButton = document.getElementById("calculate-sand");
  const resetButton = document.getElementById("reset-sand");

  const errorBox = document.getElementById("sand-error");
  const resultBox = document.getElementById("sand-result");
  const resultContent = document.getElementById("sand-result-content");

  const summaryConcreteVolume = document.getElementById(
    "summary-concrete-volume"
  );
  const summaryMixRatio = document.getElementById(
    "summary-mix-ratio"
  );
  const summarySandRequired = document.getElementById(
    "summary-sand-required"
  );
  const summarySandWaste = document.getElementById(
    "summary-sand-waste"
  );

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

  function calculateSand() {
    clearError();

    const volume = Number.parseFloat(volumeInput.value);
    const cementRatio = Number.parseFloat(cementRatioInput.value);
    const sandRatio = Number.parseFloat(sandRatioInput.value);
    const aggregateRatio = Number.parseFloat(aggregateRatioInput.value);

    const waste =
      wasteInput.value.trim() === ""
        ? 0
        : Number.parseFloat(wasteInput.value);

    if (!Number.isFinite(volume) || volume <= 0) {
      showError("Please enter a concrete volume greater than 0.");
      volumeInput.focus();
      return;
    }

    if (!Number.isFinite(cementRatio) || cementRatio < 0) {
      showError("Please enter a valid cement ratio.");
      cementRatioInput.focus();
      return;
    }

    if (!Number.isFinite(sandRatio) || sandRatio <= 0) {
      showError("Please enter a sand ratio greater than 0.");
      sandRatioInput.focus();
      return;
    }

    if (!Number.isFinite(aggregateRatio) || aggregateRatio < 0) {
      showError("Please enter a valid aggregate ratio.");
      aggregateRatioInput.focus();
      return;
    }

    if (!Number.isFinite(waste) || waste < 0 || waste > 100) {
      showError("Waste allowance must be between 0% and 100%.");
      wasteInput.focus();
      return;
    }

    const totalParts =
      cementRatio +
      sandRatio +
      aggregateRatio;

    if (totalParts <= 0) {
      showError("The total mix ratio must be greater than 0.");
      return;
    }

    const volumeInCubicFeet = getVolumeInCubicFeet(
      volume,
      volumeUnit.value
    );

    if (
      !Number.isFinite(volumeInCubicFeet) ||
      volumeInCubicFeet <= 0
    ) {
      showError("Please enter a valid concrete volume.");
      return;
    }

    /*
      Determine the sand fraction of the entered mix ratio.
    */
    const sandFraction =
      sandRatio / totalParts;

    /*
      Calculate sand volume before waste.
    */
    const sandVolumeBeforeWaste =
      volumeInCubicFeet * sandFraction;

    /*
      Apply waste allowance.
    */
    const wasteFactor = 1 + waste / 100;

    const sandVolumeWithWaste =
      sandVolumeBeforeWaste * wasteFactor;

    /*
      Convert the final sand volume.
    */
    const sandVolumeYd3 =
      sandVolumeWithWaste / 27;

    const sandVolumeM3 =
      sandVolumeWithWaste / 35.3146667;

    /*
      Calculate the amount added because of waste.
    */
    const wasteVolumeFt3 =
      sandVolumeWithWaste -
      sandVolumeBeforeWaste;

    const wasteVolumeYd3 =
      wasteVolumeFt3 / 27;

    const wasteVolumeM3 =
      wasteVolumeFt3 / 35.3146667;

    const mixRatioText =
      `${formatSmart(cementRatio)} : ${formatSmart(sandRatio)} : ${formatSmart(aggregateRatio)}`;

    const inputUnitLabel =
      getUnitLabel(volumeUnit.value);

    /*
      Result section.
    */
    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Concrete Volume</h3>
          <p>${formatNumber(volume)} ${inputUnitLabel}</p>
        </div>

        <div class="result-card">
          <h3>Mix Ratio</h3>
          <p>${mixRatioText}</p>
        </div>

        <div class="result-card">
          <h3>Sand Before Waste</h3>
          <p>${formatNumber(sandVolumeBeforeWaste)} ft³</p>
        </div>

        <div class="result-card">
          <h3>Sand With Waste</h3>
          <p>${formatNumber(sandVolumeWithWaste)} ft³</p>
        </div>

        <div class="result-card">
          <h3>Sand Quantity</h3>
          <p>${formatNumber(sandVolumeYd3)} yd³</p>
        </div>

        <div class="result-card">
          <h3>Sand Quantity</h3>
          <p>${formatNumber(sandVolumeM3)} m³</p>
        </div>

      </div>

      <div class="info-box">

        <p>
          <strong>Sand fraction of mix:</strong>
          ${formatNumber(sandFraction * 100)}%
        </p>

        <p>
          <strong>Total mix parts:</strong>
          ${formatSmart(totalParts)}
        </p>

        <p>
          <strong>Sand before waste:</strong>
          ${formatNumber(sandVolumeBeforeWaste)} ft³
          (${formatNumber(sandVolumeBeforeWaste / 27)} yd³ /
          ${formatNumber(sandVolumeBeforeWaste / 35.3146667)} m³)
        </p>

        <p>
          <strong>Waste allowance:</strong>
          ${formatNumber(waste)}%
        </p>

        <p>
          <strong>Additional sand for waste:</strong>
          ${formatNumber(wasteVolumeFt3)} ft³
          (${formatNumber(wasteVolumeYd3)} yd³ /
          ${formatNumber(wasteVolumeM3)} m³)
        </p>

        <p>
          <strong>Sand with waste:</strong>
          ${formatNumber(sandVolumeWithWaste)} ft³
          (${formatNumber(sandVolumeYd3)} yd³ /
          ${formatNumber(sandVolumeM3)} m³)
        </p>

      </div>

      <p class="small-text">
        This is a theoretical volume estimate based on the entered mix ratio.
        Actual sand requirements can vary because of aggregate grading,
        moisture, compaction, batching methods, mix design, and construction
        practices.
      </p>
    `;

    /*
      Summary cards.
    */
    summaryConcreteVolume.textContent =
      `${formatNumber(volume)} ${inputUnitLabel}`;

    summaryMixRatio.textContent =
      mixRatioText;

    summarySandRequired.textContent =
      `${formatNumber(sandVolumeBeforeWaste)} ft³`;

    summarySandWaste.textContent =
      `${formatNumber(sandVolumeWithWaste)} ft³`;

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

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    summaryConcreteVolume.textContent = "—";
    summaryMixRatio.textContent = "—";
    summarySandRequired.textContent = "—";
    summarySandWaste.textContent = "—";

    volumeInput.focus();
  }

  calculateButton.addEventListener("click", calculateSand);
  resetButton.addEventListener("click", resetCalculator);

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
        calculateSand();
      }
    });
  });
});