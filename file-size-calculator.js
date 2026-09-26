document.addEventListener("DOMContentLoaded", () => {
  const valueInput = document.getElementById("file-size-value");
  const unitInput = document.getElementById("file-size-unit");
  const systemInput = document.getElementById("file-size-system");

  const calculateButton = document.getElementById("file-size-calculate");
  const resetButton = document.getElementById("file-size-reset");

  const errorBox = document.getElementById("file-size-error");
  const resultBox = document.getElementById("file-size-result");
  const resultContent = document.getElementById("file-size-result-content");

  const summaryInput = document.getElementById("file-size-summary-input");
  const summaryBytes = document.getElementById("file-size-summary-bytes");
  const summaryMB = document.getElementById("file-size-summary-mb");
  const summaryGB = document.getElementById("file-size-summary-gb");


  const DECIMAL = {
    B: 1,
    KB: 1000,
    MB: 1000 ** 2,
    GB: 1000 ** 3,
    TB: 1000 ** 4
  };


  const BINARY = {
    B: 1,
    KiB: 1024,
    MiB: 1024 ** 2,
    GiB: 1024 ** 3,
    TiB: 1024 ** 4
  };


  function getNumber(input) {
    return Number.parseFloat(input.value);
  }


  function formatNumber(value, decimals = 2) {
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }


  function formatBytes(value) {
    if (Math.abs(value) < 1) {
      return `${formatNumber(value, 4)} bytes`;
    }

    return `${formatNumber(value, 0)} bytes`;
  }


  function getUnitLabel(unit) {
    const labels = {
      B: "B",
      KB: "KB",
      MB: "MB",
      GB: "GB",
      TB: "TB",
      KiB: "KiB",
      MiB: "MiB",
      GiB: "GiB",
      TiB: "TiB"
    };

    return labels[unit] || unit;
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


  function calculate() {
    clearError();

    const value = getNumber(valueInput);
    const unit = unitInput.value;
    const system = systemInput.value;


    /*
     * Validation
     */

    if (!Number.isFinite(value) || value < 0) {
      showError("Please enter a valid file size of 0 or greater.");
      valueInput.focus();
      return;
    }


    /*
     * Select the correct unit system.
     */

    const units = system === "binary"
      ? BINARY
      : DECIMAL;


    /*
     * Convert input value to bytes.
     */

    let bytes;


    if (units[unit] !== undefined) {
      bytes = value * units[unit];
    } else {
      showError("The selected unit is not compatible with the selected unit system.");
      unitInput.focus();
      return;
    }


    if (!Number.isFinite(bytes)) {
      showError("The entered value is too large to calculate safely.");
      return;
    }


    /*
     * Convert bytes into decimal units.
     */

    const decimalKB = bytes / DECIMAL.KB;
    const decimalMB = bytes / DECIMAL.MB;
    const decimalGB = bytes / DECIMAL.GB;
    const decimalTB = bytes / DECIMAL.TB;


    /*
     * Convert bytes into binary units.
     */

    const binaryKiB = bytes / BINARY.KiB;
    const binaryMiB = bytes / BINARY.MiB;
    const binaryGiB = bytes / BINARY.GiB;
    const binaryTiB = bytes / BINARY.TiB;


    /*
     * Determine the selected system's equivalent values.
     */

    const selectedKB = system === "binary"
      ? binaryKiB
      : decimalKB;

    const selectedMB = system === "binary"
      ? binaryMiB
      : decimalMB;

    const selectedGB = system === "binary"
      ? binaryGiB
      : decimalGB;

    const selectedTB = system === "binary"
      ? binaryTiB
      : decimalTB;


    /*
     * Result display.
     */

    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Bytes</h3>
          <p>
            <strong>${formatBytes(bytes)}</strong>
          </p>
          <small>
            Base storage value
          </small>
        </div>

        <div class="result-card">
          <h3>Kilobytes</h3>
          <p>
            <strong>${formatNumber(selectedKB, 4)}</strong>
          </p>
          <small>
            ${system === "binary" ? "KiB" : "KB"}
          </small>
        </div>

        <div class="result-card">
          <h3>Megabytes</h3>
          <p>
            <strong>${formatNumber(selectedMB, 4)}</strong>
          </p>
          <small>
            ${system === "binary" ? "MiB" : "MB"}
          </small>
        </div>

        <div class="result-card">
          <h3>Gigabytes</h3>
          <p>
            <strong>${formatNumber(selectedGB, 6)}</strong>
          </p>
          <small>
            ${system === "binary" ? "GiB" : "GB"}
          </small>
        </div>

        <div class="result-card">
          <h3>Terabytes</h3>
          <p>
            <strong>${formatNumber(selectedTB, 8)}</strong>
          </p>
          <small>
            ${system === "binary" ? "TiB" : "TB"}
          </small>
        </div>

      </div>


      <div class="info-box">

        <h3>File Size Conversion</h3>

        <p>
          Input =
          <strong>
            ${formatNumber(value, 4)}
            ${getUnitLabel(unit)}
          </strong>
        </p>

        <p>
          Unit system =
          <strong>
            ${system === "binary" ? "Binary" : "Decimal"}
          </strong>
        </p>

        <p>
          Equivalent bytes =
          <strong>${formatBytes(bytes)}</strong>
        </p>

        <p>
          Decimal equivalent =
          <strong>
            ${formatNumber(decimalMB, 4)} MB
          </strong>
          /
          <strong>
            ${formatNumber(decimalGB, 6)} GB
          </strong>
        </p>

        <p>
          Binary equivalent =
          <strong>
            ${formatNumber(binaryMiB, 4)} MiB
          </strong>
          /
          <strong>
            ${formatNumber(binaryGiB, 6)} GiB
          </strong>
        </p>

      </div>
    `;


    /*
     * Summary
     */

    summaryInput.textContent =
      `${formatNumber(value, 2)} ${getUnitLabel(unit)}`;

    summaryBytes.textContent =
      formatBytes(bytes);

    summaryMB.textContent =
      `${formatNumber(selectedMB, 4)} ${system === "binary" ? "MiB" : "MB"}`;

    summaryGB.textContent =
      `${formatNumber(selectedGB, 6)} ${system === "binary" ? "GiB" : "GB"}`;


    /*
     * Show results.
     */

    resultBox.hidden = false;

    resultBox.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }


  function resetCalculator() {

    valueInput.value = "";

    unitInput.value = "KB";

    systemInput.value = "decimal";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    summaryInput.textContent = "—";
    summaryBytes.textContent = "—";
    summaryMB.textContent = "—";
    summaryGB.textContent = "—";

    valueInput.focus();
  }


  calculateButton.addEventListener("click", calculate);

  resetButton.addEventListener("click", resetCalculator);


  /*
   * Enter key support.
   */

  document.querySelectorAll(".calculator-form input").forEach(input => {

    input.addEventListener("keydown", event => {

      if (event.key === "Enter") {
        event.preventDefault();
        calculate();
      }

    });

  });


  /*
   * Update unit options when the unit system changes.
   */

  systemInput.addEventListener("change", () => {

    const currentUnit = unitInput.value;

    if (systemInput.value === "binary") {

      if (currentUnit === "KB") {
        unitInput.value = "KiB";
      } else if (currentUnit === "MB") {
        unitInput.value = "MiB";
      } else if (currentUnit === "GB") {
        unitInput.value = "GiB";
      } else if (currentUnit === "TB") {
        unitInput.value = "TiB";
      }

    } else {

      if (currentUnit === "KiB") {
        unitInput.value = "KB";
      } else if (currentUnit === "MiB") {
        unitInput.value = "MB";
      } else if (currentUnit === "GiB") {
        unitInput.value = "GB";
      } else if (currentUnit === "TiB") {
        unitInput.value = "TB";
      }

    }

  });

});