document.addEventListener("DOMContentLoaded", () => {
  const sweptInput = document.getElementById("compression-swept-volume");
  const clearanceInput = document.getElementById("compression-clearance-volume");
  const unitInput = document.getElementById("compression-unit");

  const calculateButton = document.getElementById("compression-calculate");
  const resetButton = document.getElementById("compression-reset");

  const errorBox = document.getElementById("compression-error");
  const resultBox = document.getElementById("compression-result");
  const resultContent = document.getElementById("compression-result-content");

  const summarySwept = document.getElementById("compression-summary-swept");
  const summaryClearance = document.getElementById("compression-summary-clearance");
  const summaryTotal = document.getElementById("compression-summary-total");
  const summaryRatio = document.getElementById("compression-summary-ratio");


  function getNumber(input) {
    return Number.parseFloat(input.value);
  }


  function formatNumber(value, decimals = 2) {
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }


  function getUnitName(unit) {
    switch (unit) {
      case "cc":
        return "cc";

      case "in3":
        return "in³";

      case "liters":
        return "L";

      default:
        return "";
    }
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

    const sweptVolume = getNumber(sweptInput);
    const clearanceVolume = getNumber(clearanceInput);
    const unit = unitInput.value;


    /*
     * Validation
     */

    if (!Number.isFinite(sweptVolume) || sweptVolume <= 0) {
      showError("Please enter a valid swept volume greater than 0.");
      sweptInput.focus();
      return;
    }

    if (!Number.isFinite(clearanceVolume) || clearanceVolume <= 0) {
      showError("Please enter a valid clearance volume greater than 0.");
      clearanceInput.focus();
      return;
    }


    /*
     * Total cylinder volume
     */

    const totalVolume = sweptVolume + clearanceVolume;


    /*
     * Static compression ratio
     *
     * CR = (Swept Volume + Clearance Volume)
     *      ÷ Clearance Volume
     */

    const compressionRatio =
      totalVolume / clearanceVolume;


    /*
     * Additional useful measurements
     */

    const sweptToClearanceRatio =
      sweptVolume / clearanceVolume;

    const clearancePercentage =
      (clearanceVolume / totalVolume) * 100;

    const sweptPercentage =
      (sweptVolume / totalVolume) * 100;


    /*
     * Display unit
     */

    const unitName = getUnitName(unit);


    /*
     * Result
     */

    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Compression Ratio</h3>
          <p>
            <strong>${formatNumber(compressionRatio, 2)}:1</strong>
          </p>
          <small>
            Static compression ratio
          </small>
        </div>

        <div class="result-card">
          <h3>Swept Volume</h3>
          <p>
            <strong>${formatNumber(sweptVolume, 2)} ${unitName}</strong>
          </p>
          <small>
            Piston displacement volume
          </small>
        </div>

        <div class="result-card">
          <h3>Clearance Volume</h3>
          <p>
            <strong>${formatNumber(clearanceVolume, 2)} ${unitName}</strong>
          </p>
          <small>
            Volume remaining at TDC
          </small>
        </div>

        <div class="result-card">
          <h3>Total Cylinder Volume</h3>
          <p>
            <strong>${formatNumber(totalVolume, 2)} ${unitName}</strong>
          </p>
          <small>
            Swept + clearance volume
          </small>
        </div>

        <div class="result-card">
          <h3>Swept-to-Clearance Ratio</h3>
          <p>
            <strong>${formatNumber(sweptToClearanceRatio, 2)}:1</strong>
          </p>
          <small>
            Swept volume compared with clearance volume
          </small>
        </div>

        <div class="result-card">
          <h3>Clearance Volume Share</h3>
          <p>
            <strong>${formatNumber(clearancePercentage, 2)}%</strong>
          </p>
          <small>
            Of total cylinder volume
          </small>
        </div>

      </div>


      <div class="info-box">

        <h3>Compression Ratio Calculation</h3>

        <p>
          Total cylinder volume =
          ${formatNumber(sweptVolume, 2)} ${unitName}
          +
          ${formatNumber(clearanceVolume, 2)} ${unitName}
          =
          <strong>${formatNumber(totalVolume, 2)} ${unitName}</strong>
        </p>

        <p>
          Compression ratio =
          (${formatNumber(sweptVolume, 2)}
          +
          ${formatNumber(clearanceVolume, 2)})
          ÷
          ${formatNumber(clearanceVolume, 2)}
          =
          <strong>${formatNumber(compressionRatio, 2)}:1</strong>
        </p>

        <p>
          The swept volume represents approximately
          <strong>${formatNumber(sweptPercentage, 2)}%</strong>
          of the total cylinder volume, while the clearance volume represents
          <strong>${formatNumber(clearancePercentage, 2)}%</strong>.
        </p>

      </div>
    `;


    /*
     * Summary
     */

    summarySwept.textContent =
      `${formatNumber(sweptVolume, 2)} ${unitName}`;

    summaryClearance.textContent =
      `${formatNumber(clearanceVolume, 2)} ${unitName}`;

    summaryTotal.textContent =
      `${formatNumber(totalVolume, 2)} ${unitName}`;

    summaryRatio.textContent =
      `${formatNumber(compressionRatio, 2)}:1`;


    /*
     * Show result
     */

    resultBox.hidden = false;

    resultBox.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }


  function resetCalculator() {

    sweptInput.value = "";
    clearanceInput.value = "";
    unitInput.value = "cc";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    summarySwept.textContent = "—";
    summaryClearance.textContent = "—";
    summaryTotal.textContent = "—";
    summaryRatio.textContent = "—";

    sweptInput.focus();
  }


  calculateButton.addEventListener("click", calculate);

  resetButton.addEventListener("click", resetCalculator);


  /*
   * Enter key support
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