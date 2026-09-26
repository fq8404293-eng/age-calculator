document.addEventListener("DOMContentLoaded", function () {
  const valueInput = document.getElementById("internet-speed-value");
  const unitInput = document.getElementById("internet-speed-unit");

  const calculateButton = document.getElementById("internet-speed-calculate");
  const resetButton = document.getElementById("internet-speed-reset");

  const errorBox = document.getElementById("internet-speed-error");

  const resultBox = document.getElementById("internet-speed-result");
  const resultContent = document.getElementById("internet-speed-result-content");

  const summaryInput = document.getElementById("internet-speed-summary-input");
  const summaryMbps = document.getElementById("internet-speed-summary-mbps");
  const summaryMbpsByte = document.getElementById("internet-speed-summary-mbps-byte");
  const summaryGbps = document.getElementById("internet-speed-summary-gbps");


  const units = {
    bps: {
      label: "bps",
      name: "Bits per second",
      bits: 1
    },

    Kbps: {
      label: "Kbps",
      name: "Kilobits per second",
      bits: 1000
    },

    Mbps: {
      label: "Mbps",
      name: "Megabits per second",
      bits: 1000000
    },

    Gbps: {
      label: "Gbps",
      name: "Gigabits per second",
      bits: 1000000000
    },

    Tbps: {
      label: "Tbps",
      name: "Terabits per second",
      bits: 1000000000000
    },

    Bps: {
      label: "B/s",
      name: "Bytes per second",
      bits: 8
    },

    KBps: {
      label: "KB/s",
      name: "Kilobytes per second",
      bits: 8000
    },

    MBps: {
      label: "MB/s",
      name: "Megabytes per second",
      bits: 8000000
    },

    GBps: {
      label: "GB/s",
      name: "Gigabytes per second",
      bits: 8000000000
    },

    TBps: {
      label: "TB/s",
      name: "Terabytes per second",
      bits: 8000000000000
    }
  };


  function formatNumber(number, decimals = 6) {
    if (!Number.isFinite(number)) {
      return "0";
    }

    if (Math.abs(number) >= 1000000) {
      return number.toLocaleString("en-US", {
        maximumFractionDigits: 2
      });
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


  function calculateSpeed() {
    clearError();

    const value = Number(valueInput.value);
    const selectedUnit = unitInput.value;

    if (valueInput.value.trim() === "") {
      showError("Please enter an internet speed.");
      valueInput.focus();
      return;
    }

    if (!Number.isFinite(value) || value < 0) {
      showError("Please enter a valid speed of 0 or greater.");
      valueInput.focus();
      return;
    }

    if (!units[selectedUnit]) {
      showError("Please select a valid speed unit.");
      unitInput.focus();
      return;
    }


    /*
      Convert the entered value into bits per second.
    */

    const bitsPerSecond = value * units[selectedUnit].bits;


    /*
      Convert the base value into every supported unit.
    */

    const bps = bitsPerSecond;
    const Kbps = bitsPerSecond / 1000;
    const Mbps = bitsPerSecond / 1000000;
    const Gbps = bitsPerSecond / 1000000000;
    const Tbps = bitsPerSecond / 1000000000000;

    const Bps = bitsPerSecond / 8;
    const KBps = bitsPerSecond / 8000;
    const MBps = bitsPerSecond / 8000000;
    const GBps = bitsPerSecond / 8000000000;
    const TBps = bitsPerSecond / 8000000000000;


    /*
      Main result.
    */

    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Bits per Second</h3>
          <p>${formatNumber(bps)} bps</p>
        </div>

        <div class="result-card">
          <h3>Kilobits per Second</h3>
          <p>${formatNumber(Kbps)} Kbps</p>
        </div>

        <div class="result-card">
          <h3>Megabits per Second</h3>
          <p>${formatNumber(Mbps)} Mbps</p>
        </div>

        <div class="result-card">
          <h3>Gigabits per Second</h3>
          <p>${formatNumber(Gbps)} Gbps</p>
        </div>

        <div class="result-card">
          <h3>Terabits per Second</h3>
          <p>${formatNumber(Tbps)} Tbps</p>
        </div>

        <div class="result-card">
          <h3>Bytes per Second</h3>
          <p>${formatNumber(Bps)} B/s</p>
        </div>

        <div class="result-card">
          <h3>Kilobytes per Second</h3>
          <p>${formatNumber(KBps)} KB/s</p>
        </div>

        <div class="result-card">
          <h3>Megabytes per Second</h3>
          <p>${formatNumber(MBps)} MB/s</p>
        </div>

        <div class="result-card">
          <h3>Gigabytes per Second</h3>
          <p>${formatNumber(GBps)} GB/s</p>
        </div>

        <div class="result-card">
          <h3>Terabytes per Second</h3>
          <p>${formatNumber(TBps)} TB/s</p>
        </div>

      </div>

      <div class="info-box">

        <p>
          <strong>${formatNumber(value)} ${units[selectedUnit].label}</strong>
          equals
          <strong>${formatNumber(Mbps)} Mbps</strong>
          or
          <strong>${formatNumber(MBps)} MB/s</strong>.
        </p>

        <p>
          The conversion uses decimal networking units:
          1 Kbps = 1,000 bps and 1 Mbps = 1,000,000 bps.
        </p>

      </div>
    `;


    /*
      Summary values.
    */

    summaryInput.textContent =
      `${formatNumber(value)} ${units[selectedUnit].label}`;

    summaryMbps.textContent =
      `${formatNumber(Mbps)} Mbps`;

    summaryMbpsByte.textContent =
      `${formatNumber(MBps)} MB/s`;

    summaryGbps.textContent =
      `${formatNumber(Gbps)} Gbps`;


    resultBox.hidden = false;


    /*
      Smoothly move the result into view.
    */

    resultBox.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }


  function resetCalculator() {
    valueInput.value = "";
    unitInput.value = "Mbps";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    summaryInput.textContent = "—";
    summaryMbps.textContent = "—";
    summaryMbpsByte.textContent = "—";
    summaryGbps.textContent = "—";

    valueInput.focus();
  }


  calculateButton.addEventListener("click", calculateSpeed);

  resetButton.addEventListener("click", resetCalculator);


  /*
    Allow Enter to calculate.
  */

  valueInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateSpeed();
    }
  });

  unitInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateSpeed();
    }
  });

});