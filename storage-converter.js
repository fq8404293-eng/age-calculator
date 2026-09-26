document.addEventListener("DOMContentLoaded", function () {
  const valueInput = document.getElementById("storage-value");
  const unitInput = document.getElementById("storage-unit");
  const systemInput = document.getElementById("storage-system");

  const calculateButton = document.getElementById("storage-calculate");
  const resetButton = document.getElementById("storage-reset");

  const errorBox = document.getElementById("storage-error");

  const resultBox = document.getElementById("storage-result");
  const resultContent = document.getElementById("storage-result-content");

  const summaryInput = document.getElementById("storage-summary-input");
  const summaryMB = document.getElementById("storage-summary-mb");
  const summaryGB = document.getElementById("storage-summary-gb");
  const summaryTB = document.getElementById("storage-summary-tb");


  /*
    Decimal units:
    1 KB = 1,000 bytes
    1 MB = 1,000,000 bytes
    1 GB = 1,000,000,000 bytes
    1 TB = 1,000,000,000,000 bytes

    Binary units:
    1 KiB = 1,024 bytes
    1 MiB = 1,048,576 bytes
    1 GiB = 1,073,741,824 bytes
    1 TiB = 1,099,511,627,776 bytes
  */

  const units = {
    B: {
      label: "B",
      name: "Bytes",
      bytes: 1,
      system: "decimal"
    },

    KB: {
      label: "KB",
      name: "Kilobytes",
      bytes: 1000,
      system: "decimal"
    },

    MB: {
      label: "MB",
      name: "Megabytes",
      bytes: 1000000,
      system: "decimal"
    },

    GB: {
      label: "GB",
      name: "Gigabytes",
      bytes: 1000000000,
      system: "decimal"
    },

    TB: {
      label: "TB",
      name: "Terabytes",
      bytes: 1000000000000,
      system: "decimal"
    },

    KiB: {
      label: "KiB",
      name: "Kibibytes",
      bytes: 1024,
      system: "binary"
    },

    MiB: {
      label: "MiB",
      name: "Mebibytes",
      bytes: 1048576,
      system: "binary"
    },

    GiB: {
      label: "GiB",
      name: "Gibibytes",
      bytes: 1073741824,
      system: "binary"
    },

    TiB: {
      label: "TiB",
      name: "Tebibytes",
      bytes: 1099511627776,
      system: "binary"
    }
  };


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


  function calculateStorage() {
    clearError();

    const value = Number(valueInput.value);
    const selectedUnit = unitInput.value;
    const selectedSystem = systemInput.value;

    if (valueInput.value.trim() === "") {
      showError("Please enter a storage value.");
      valueInput.focus();
      return;
    }

    if (!Number.isFinite(value) || value < 0) {
      showError("Please enter a valid storage value of 0 or greater.");
      valueInput.focus();
      return;
    }

    if (!units[selectedUnit]) {
      showError("Please select a valid storage unit.");
      unitInput.focus();
      return;
    }


    /*
      Convert the entered value to bytes.
    */

    const bytes = value * units[selectedUnit].bytes;


    /*
      Decimal conversions.
    */

    const decimalKB = bytes / 1000;
    const decimalMB = bytes / 1000000;
    const decimalGB = bytes / 1000000000;
    const decimalTB = bytes / 1000000000000;


    /*
      Binary conversions.
    */

    const binaryKiB = bytes / 1024;
    const binaryMiB = bytes / 1048576;
    const binaryGiB = bytes / 1073741824;
    const binaryTiB = bytes / 1099511627776;


    /*
      Determine the selected system's main conversion values.
    */

    let selectedSystemText;

    if (selectedSystem === "decimal") {
      selectedSystemText = `
        <div class="info-box">
          <p>
            <strong>Decimal (SI) storage system</strong>
          </p>

          <p>
            1 KB = 1,000 bytes
          </p>

          <p>
            1 MB = 1,000,000 bytes
          </p>

          <p>
            1 GB = 1,000,000,000 bytes
          </p>

          <p>
            1 TB = 1,000,000,000,000 bytes
          </p>
        </div>
      `;
    } else {
      selectedSystemText = `
        <div class="info-box">
          <p>
            <strong>Binary (IEC) storage system</strong>
          </p>

          <p>
            1 KiB = 1,024 bytes
          </p>

          <p>
            1 MiB = 1,048,576 bytes
          </p>

          <p>
            1 GiB = 1,073,741,824 bytes
          </p>

          <p>
            1 TiB = 1,099,511,627,776 bytes
          </p>
        </div>
      `;
    }


    /*
      Display all decimal and binary conversions.
    */

    resultContent.innerHTML = `

      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Bytes</h3>
          <p>${formatNumber(bytes)} B</p>
        </div>

        <div class="result-card">
          <h3>Kilobytes</h3>
          <p>${formatNumber(decimalKB)} KB</p>
        </div>

        <div class="result-card">
          <h3>Megabytes</h3>
          <p>${formatNumber(decimalMB)} MB</p>
        </div>

        <div class="result-card">
          <h3>Gigabytes</h3>
          <p>${formatNumber(decimalGB)} GB</p>
        </div>

        <div class="result-card">
          <h3>Terabytes</h3>
          <p>${formatNumber(decimalTB)} TB</p>
        </div>

        <div class="result-card">
          <h3>Kibibytes</h3>
          <p>${formatNumber(binaryKiB)} KiB</p>
        </div>

        <div class="result-card">
          <h3>Mebibytes</h3>
          <p>${formatNumber(binaryMiB)} MiB</p>
        </div>

        <div class="result-card">
          <h3>Gibibytes</h3>
          <p>${formatNumber(binaryGiB)} GiB</p>
        </div>

        <div class="result-card">
          <h3>Tebibytes</h3>
          <p>${formatNumber(binaryTiB)} TiB</p>
        </div>

      </div>

      <div class="info-box">

        <p>
          <strong>
            ${formatNumber(value)} ${units[selectedUnit].label}
          </strong>
          equals
          <strong>
            ${formatNumber(decimalGB)} GB
          </strong>
          and
          <strong>
            ${formatNumber(binaryGiB)} GiB
          </strong>.
        </p>

        <p>
          The entered value was first converted to bytes and then
          converted into decimal and binary storage units.
        </p>

      </div>

      ${selectedSystemText}
    `;


    /*
      Update summary.
    */

    summaryInput.textContent =
      `${formatNumber(value)} ${units[selectedUnit].label}`;

    summaryMB.textContent =
      `${formatNumber(decimalMB)} MB`;

    summaryGB.textContent =
      `${formatNumber(decimalGB)} GB`;

    summaryTB.textContent =
      `${formatNumber(decimalTB)} TB`;


    resultBox.hidden = false;


    /*
      Scroll to the results.
    */

    resultBox.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }


  function resetCalculator() {
    valueInput.value = "";
    unitInput.value = "GB";
    systemInput.value = "decimal";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    summaryInput.textContent = "—";
    summaryMB.textContent = "—";
    summaryGB.textContent = "—";
    summaryTB.textContent = "—";

    valueInput.focus();
  }


  calculateButton.addEventListener("click", calculateStorage);

  resetButton.addEventListener("click", resetCalculator);


  /*
    Allow Enter to calculate.
  */

  valueInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateStorage();
    }
  });

  unitInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateStorage();
    }
  });

  systemInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateStorage();
    }
  });

});