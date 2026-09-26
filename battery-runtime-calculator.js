document.addEventListener("DOMContentLoaded", () => {
  const capacityInput = document.getElementById("battery-capacity");
  const capacityUnitInput = document.getElementById("battery-capacity-unit");
  const voltageInput = document.getElementById("battery-voltage");
  const powerInput = document.getElementById("battery-power");
  const powerUnitInput = document.getElementById("battery-power-unit");
  const efficiencyInput = document.getElementById("battery-efficiency");

  const calculateButton = document.getElementById("battery-calculate");
  const resetButton = document.getElementById("battery-reset");

  const errorBox = document.getElementById("battery-error");
  const resultBox = document.getElementById("battery-result");
  const resultContent = document.getElementById("battery-result-content");

  const summaryCapacity = document.getElementById("battery-summary-capacity");
  const summaryVoltage = document.getElementById("battery-summary-voltage");
  const summaryPower = document.getElementById("battery-summary-power");
  const summaryRuntime = document.getElementById("battery-summary-runtime");


  function getNumber(input) {
    return Number.parseFloat(input.value);
  }


  function formatNumber(value, decimals = 2) {
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }


  function formatRuntime(hours) {
    if (!Number.isFinite(hours) || hours < 0) {
      return "—";
    }

    const totalMinutes = Math.round(hours * 60);

    const days = Math.floor(totalMinutes / 1440);
    const remainingMinutesAfterDays = totalMinutes % 1440;

    const wholeHours = Math.floor(
      remainingMinutesAfterDays / 60
    );

    const minutes = remainingMinutesAfterDays % 60;

    const parts = [];

    if (days > 0) {
      parts.push(`${days} day${days === 1 ? "" : "s"}`);
    }

    if (wholeHours > 0) {
      parts.push(`${wholeHours} hour${wholeHours === 1 ? "" : "s"}`);
    }

    if (minutes > 0 || parts.length === 0) {
      parts.push(`${minutes} minute${minutes === 1 ? "" : "s"}`);
    }

    return parts.join(", ");
  }


  function getCapacityAh(value, unit) {
    if (unit === "mAh") {
      return value / 1000;
    }

    return value;
  }


  function getPowerWatts(value, unit) {
    if (unit === "mW") {
      return value / 1000;
    }

    return value;
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

    const capacity = getNumber(capacityInput);
    const capacityUnit = capacityUnitInput.value;

    const voltage = getNumber(voltageInput);

    const power = getNumber(powerInput);
    const powerUnit = powerUnitInput.value;

    const efficiency = getNumber(efficiencyInput);


    /*
     * Validation
     */

    if (!Number.isFinite(capacity) || capacity <= 0) {
      showError("Please enter a valid battery capacity greater than 0.");
      capacityInput.focus();
      return;
    }

    if (!Number.isFinite(voltage) || voltage <= 0) {
      showError("Please enter a valid battery voltage greater than 0.");
      voltageInput.focus();
      return;
    }

    if (!Number.isFinite(power) || power <= 0) {
      showError("Please enter a valid device power consumption greater than 0.");
      powerInput.focus();
      return;
    }

    if (
      !Number.isFinite(efficiency) ||
      efficiency <= 0 ||
      efficiency > 100
    ) {
      showError("Please enter a system efficiency between 1% and 100%.");
      efficiencyInput.focus();
      return;
    }


    /*
     * Convert capacity to Ah.
     */

    const capacityAh =
      getCapacityAh(capacity, capacityUnit);


    /*
     * Convert device power to watts.
     */

    const powerWatts =
      getPowerWatts(power, powerUnit);


    /*
     * Nominal battery energy.
     *
     * Wh = Ah × V
     */

    const nominalEnergyWh =
      capacityAh * voltage;


    /*
     * Usable energy after efficiency.
     */

    const usableEnergyWh =
      nominalEnergyWh * (efficiency / 100);


    /*
     * Theoretical runtime.
     *
     * Runtime = Wh ÷ W
     */

    const runtimeHours =
      usableEnergyWh / powerWatts;


    /*
     * Runtime at 100% efficiency for comparison.
     */

    const theoreticalRuntimeHours =
      nominalEnergyWh / powerWatts;


    /*
     * Energy lost due to system inefficiency.
     */

    const energyLossWh =
      nominalEnergyWh - usableEnergyWh;


    /*
     * Current draw.
     *
     * I = P ÷ V
     */

    const currentAmps =
      powerWatts / voltage;


    /*
     * Approximate battery discharge rate.
     */

    const ampHoursUsedPerHour =
      currentAmps;


    /*
     * Energy per minute.
     */

    const energyPerMinuteWh =
      powerWatts / 60;


    /*
     * Results
     */

    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Estimated Runtime</h3>
          <p>
            <strong>${formatRuntime(runtimeHours)}</strong>
          </p>
          <small>
            ${formatNumber(runtimeHours, 2)} hours
          </small>
        </div>

        <div class="result-card">
          <h3>Battery Energy</h3>
          <p>
            <strong>${formatNumber(nominalEnergyWh, 2)} Wh</strong>
          </p>
          <small>
            Nominal energy capacity
          </small>
        </div>

        <div class="result-card">
          <h3>Usable Energy</h3>
          <p>
            <strong>${formatNumber(usableEnergyWh, 2)} Wh</strong>
          </p>
          <small>
            After ${formatNumber(efficiency, 1)}% efficiency
          </small>
        </div>

        <div class="result-card">
          <h3>Device Power</h3>
          <p>
            <strong>${formatNumber(powerWatts, 2)} W</strong>
          </p>
          <small>
            Continuous power consumption
          </small>
        </div>

        <div class="result-card">
          <h3>Approximate Current</h3>
          <p>
            <strong>${formatNumber(currentAmps, 2)} A</strong>
          </p>
          <small>
            At ${formatNumber(voltage, 2)} V
          </small>
        </div>

        <div class="result-card">
          <h3>Energy Loss</h3>
          <p>
            <strong>${formatNumber(energyLossWh, 2)} Wh</strong>
          </p>
          <small>
            Due to efficiency assumption
          </small>
        </div>

        <div class="result-card">
          <h3>Theoretical Runtime</h3>
          <p>
            <strong>${formatRuntime(theoreticalRuntimeHours)}</strong>
          </p>
          <small>
            At 100% efficiency
          </small>
        </div>

        <div class="result-card">
          <h3>Energy Used per Hour</h3>
          <p>
            <strong>${formatNumber(powerWatts, 2)} Wh</strong>
          </p>
          <small>
            At constant load
          </small>
        </div>

      </div>


      <div class="info-box">

        <h3>Battery Runtime Calculation</h3>

        <p>
          Battery capacity =
          <strong>
            ${formatNumber(capacityAh, 2)} Ah
          </strong>
        </p>

        <p>
          Battery voltage =
          <strong>
            ${formatNumber(voltage, 2)} V
          </strong>
        </p>

        <p>
          Battery energy =
          ${formatNumber(capacityAh, 2)} Ah ×
          ${formatNumber(voltage, 2)} V =
          <strong>${formatNumber(nominalEnergyWh, 2)} Wh</strong>
        </p>

        <p>
          Usable energy =
          ${formatNumber(nominalEnergyWh, 2)} Wh ×
          ${formatNumber(efficiency, 1)}% =
          <strong>${formatNumber(usableEnergyWh, 2)} Wh</strong>
        </p>

        <p>
          Runtime =
          ${formatNumber(usableEnergyWh, 2)} Wh ÷
          ${formatNumber(powerWatts, 2)} W =
          <strong>${formatRuntime(runtimeHours)}</strong>
        </p>

      </div>
    `;


    /*
     * Summary
     */

    summaryCapacity.textContent =
      `${formatNumber(capacityAh, 2)} Ah`;

    summaryVoltage.textContent =
      `${formatNumber(voltage, 2)} V`;

    summaryPower.textContent =
      `${formatNumber(powerWatts, 2)} W`;

    summaryRuntime.textContent =
      formatRuntime(runtimeHours);


    /*
     * Show result.
     */

    resultBox.hidden = false;

    resultBox.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }


  function resetCalculator() {

    capacityInput.value = "";
    capacityUnitInput.value = "Ah";

    voltageInput.value = "";

    powerInput.value = "";
    powerUnitInput.value = "W";

    efficiencyInput.value = "100";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    summaryCapacity.textContent = "—";
    summaryVoltage.textContent = "—";
    summaryPower.textContent = "—";
    summaryRuntime.textContent = "—";

    capacityInput.focus();
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