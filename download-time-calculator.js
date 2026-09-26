document.addEventListener("DOMContentLoaded", () => {
  const fileSizeInput = document.getElementById("download-file-size");
  const fileUnitInput = document.getElementById("download-file-unit");
  const speedInput = document.getElementById("download-speed");
  const speedUnitInput = document.getElementById("download-speed-unit");
  const efficiencyInput = document.getElementById("download-efficiency");

  const calculateButton = document.getElementById("download-calculate");
  const resetButton = document.getElementById("download-reset");

  const errorBox = document.getElementById("download-error");
  const resultBox = document.getElementById("download-result");
  const resultContent = document.getElementById("download-result-content");

  const summaryFile = document.getElementById("download-summary-file");
  const summarySpeed = document.getElementById("download-summary-speed");
  const summaryTime = document.getElementById("download-summary-time");
  const summaryEffective = document.getElementById("download-summary-effective");


  function getNumber(input) {
    return Number.parseFloat(input.value);
  }


  function formatNumber(value, decimals = 2) {
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }


  /*
   * Convert file size to bytes.
   *
   * Decimal units are used:
   * 1 KB = 1,000 bytes
   * 1 MB = 1,000,000 bytes
   * 1 GB = 1,000,000,000 bytes
   * 1 TB = 1,000,000,000,000 bytes
   */

  function fileSizeToBytes(value, unit) {
    switch (unit) {
      case "B":
        return value;

      case "KB":
        return value * 1000;

      case "MB":
        return value * 1000000;

      case "GB":
        return value * 1000000000;

      case "TB":
        return value * 1000000000000;

      default:
        return NaN;
    }
  }


  /*
   * Convert speed to bits per second.
   */

  function speedToBitsPerSecond(value, unit) {
    switch (unit) {
      case "bps":
        return value;

      case "Kbps":
        return value * 1000;

      case "Mbps":
        return value * 1000000;

      case "Gbps":
        return value * 1000000000;

      case "MBps":
        return value * 1000000 * 8;

      case "GBps":
        return value * 1000000000 * 8;

      default:
        return NaN;
    }
  }


  function formatDuration(seconds) {
    if (seconds < 60) {
      return `${formatNumber(seconds, 2)} seconds`;
    }


    const totalSeconds = Math.round(seconds);

    const days = Math.floor(totalSeconds / 86400);

    const remainingAfterDays = totalSeconds % 86400;

    const hours = Math.floor(remainingAfterDays / 3600);

    const remainingAfterHours = remainingAfterDays % 3600;

    const minutes = Math.floor(remainingAfterHours / 60);

    const remainingSeconds = remainingAfterHours % 60;


    const parts = [];

    if (days > 0) {
      parts.push(`${days} day${days === 1 ? "" : "s"}`);
    }

    if (hours > 0) {
      parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
    }

    if (minutes > 0) {
      parts.push(`${minutes} minute${minutes === 1 ? "" : "s"}`);
    }

    if (remainingSeconds > 0 || parts.length === 0) {
      parts.push(
        `${remainingSeconds} second${remainingSeconds === 1 ? "" : "s"}`
      );
    }

    return parts.join(", ");
  }


  function formatCompactDuration(seconds) {
    if (seconds < 60) {
      return `${formatNumber(seconds, 1)} sec`;
    }

    if (seconds < 3600) {
      return `${formatNumber(seconds / 60, 1)} min`;
    }

    if (seconds < 86400) {
      return `${formatNumber(seconds / 3600, 2)} hr`;
    }

    return `${formatNumber(seconds / 86400, 2)} days`;
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

    const fileSize = getNumber(fileSizeInput);
    const fileUnit = fileUnitInput.value;

    const downloadSpeed = getNumber(speedInput);
    const speedUnit = speedUnitInput.value;

    const efficiency = getNumber(efficiencyInput);


    /*
     * Validation
     */

    if (!Number.isFinite(fileSize) || fileSize <= 0) {
      showError("Please enter a valid file size greater than 0.");
      fileSizeInput.focus();
      return;
    }

    if (!Number.isFinite(downloadSpeed) || downloadSpeed <= 0) {
      showError("Please enter a valid download speed greater than 0.");
      speedInput.focus();
      return;
    }

    if (
      !Number.isFinite(efficiency) ||
      efficiency <= 0 ||
      efficiency > 100
    ) {
      showError("Please enter a connection efficiency between 1% and 100%.");
      efficiencyInput.focus();
      return;
    }


    /*
     * Convert file size and speed
     */

    const fileBytes = fileSizeToBytes(fileSize, fileUnit);

    const fileBits = fileBytes * 8;

    const theoreticalSpeedBps =
      speedToBitsPerSecond(downloadSpeed, speedUnit);


    if (
      !Number.isFinite(fileBytes) ||
      !Number.isFinite(fileBits) ||
      !Number.isFinite(theoreticalSpeedBps) ||
      theoreticalSpeedBps <= 0
    ) {
      showError("Unable to process these values. Please check your inputs.");
      return;
    }


    /*
     * Apply connection efficiency.
     */

    const effectiveSpeedBps =
      theoreticalSpeedBps * (efficiency / 100);


    /*
     * Download time in seconds.
     */

    const downloadTimeSeconds =
      fileBits / effectiveSpeedBps;


    /*
     * Theoretical download time before efficiency adjustment.
     */

    const theoreticalTimeSeconds =
      fileBits / theoreticalSpeedBps;


    /*
     * Useful speed conversions.
     */

    const effectiveMbps =
      effectiveSpeedBps / 1000000;

    const effectiveMBps =
      effectiveSpeedBps / 8000000;

    const theoreticalMbps =
      theoreticalSpeedBps / 1000000;

    const theoreticalMBps =
      theoreticalSpeedBps / 8000000;


    /*
     * File size conversions.
     */

    const fileKB =
      fileBytes / 1000;

    const fileMB =
      fileBytes / 1000000;

    const fileGB =
      fileBytes / 1000000000;

    const fileTB =
      fileBytes / 1000000000000;


    /*
     * Time conversions.
     */

    const minutes =
      downloadTimeSeconds / 60;

    const hours =
      downloadTimeSeconds / 3600;

    const days =
      downloadTimeSeconds / 86400;


    /*
     * Result display.
     */

    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Estimated Download Time</h3>
          <p>
            <strong>${formatDuration(downloadTimeSeconds)}</strong>
          </p>
          <small>
            ${formatCompactDuration(downloadTimeSeconds)}
          </small>
        </div>

        <div class="result-card">
          <h3>File Size</h3>
          <p>
            <strong>${formatNumber(fileSize, 2)} ${fileUnit}</strong>
          </p>
          <small>
            ${formatNumber(fileGB, 3)} GB
          </small>
        </div>

        <div class="result-card">
          <h3>Entered Speed</h3>
          <p>
            <strong>${formatNumber(downloadSpeed, 2)} ${speedUnit}</strong>
          </p>
          <small>
            ${formatNumber(theoreticalMbps, 2)} Mbps
          </small>
        </div>

        <div class="result-card">
          <h3>Effective Speed</h3>
          <p>
            <strong>${formatNumber(effectiveMbps, 2)} Mbps</strong>
          </p>
          <small>
            ${formatNumber(effectiveMBps, 2)} MB/s
          </small>
        </div>

        <div class="result-card">
          <h3>Time in Minutes</h3>
          <p>
            <strong>${formatNumber(minutes, 2)}</strong>
          </p>
          <small>
            minutes
          </small>
        </div>

        <div class="result-card">
          <h3>Time in Hours</h3>
          <p>
            <strong>${formatNumber(hours, 3)}</strong>
          </p>
          <small>
            hours
          </small>
        </div>

        <div class="result-card">
          <h3>Time in Days</h3>
          <p>
            <strong>${formatNumber(days, 4)}</strong>
          </p>
          <small>
            days
          </small>
        </div>

        <div class="result-card">
          <h3>Theoretical Time</h3>
          <p>
            <strong>${formatDuration(theoreticalTimeSeconds)}</strong>
          </p>
          <small>
            At 100% efficiency
          </small>
        </div>

      </div>


      <div class="info-box">

        <h3>Download Time Calculation</h3>

        <p>
          File size =
          <strong>${formatNumber(fileBytes, 0)} bytes</strong>
        </p>

        <p>
          File size =
          <strong>${formatNumber(fileBits, 0)} bits</strong>
        </p>

        <p>
          Theoretical speed =
          <strong>${formatNumber(theoreticalSpeedBps, 0)} bits/s</strong>
        </p>

        <p>
          Connection efficiency =
          <strong>${formatNumber(efficiency, 1)}%</strong>
        </p>

        <p>
          Effective speed =
          <strong>${formatNumber(effectiveMbps, 2)} Mbps</strong>
          (${formatNumber(effectiveMBps, 2)} MB/s)
        </p>

        <p>
          Estimated download time =
          <strong>${formatDuration(downloadTimeSeconds)}</strong>
        </p>

      </div>
    `;


    /*
     * Summary
     */

    summaryFile.textContent =
      `${formatNumber(fileSize, 2)} ${fileUnit}`;

    summarySpeed.textContent =
      `${formatNumber(downloadSpeed, 2)} ${speedUnit}`;

    summaryTime.textContent =
      formatDuration(downloadTimeSeconds);

    summaryEffective.textContent =
      `${formatNumber(effectiveMbps, 2)} Mbps`;


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

    fileSizeInput.value = "";

    fileUnitInput.value = "GB";

    speedInput.value = "";

    speedUnitInput.value = "Mbps";

    efficiencyInput.value = "100";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    summaryFile.textContent = "—";
    summarySpeed.textContent = "—";
    summaryTime.textContent = "—";
    summaryEffective.textContent = "—";

    fileSizeInput.focus();
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

});