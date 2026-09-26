(function () {
  "use strict";

  const batteryInput = document.getElementById("ev-battery-capacity");
  const startChargeInput = document.getElementById("ev-start-charge");
  const targetChargeInput = document.getElementById("ev-target-charge");
  const electricityPriceInput = document.getElementById("ev-electricity-price");
  const currencySelect = document.getElementById("ev-currency");
  const customCurrencyGroup = document.getElementById("ev-custom-currency-group");
  const customCurrencyInput = document.getElementById("ev-custom-currency");
  const efficiencyInput = document.getElementById("ev-charging-efficiency");

  const calculateButton = document.getElementById("calculate-ev");
  const resetButton = document.getElementById("reset-ev");

  const errorBox = document.getElementById("ev-error");
  const resultBox = document.getElementById("ev-result");
  const resultContent = document.getElementById("ev-result-content");

  const summaryBattery = document.getElementById("ev-summary-battery");
  const summaryEnergy = document.getElementById("ev-summary-energy");
  const summaryGrid = document.getElementById("ev-summary-grid");
  const summaryCost = document.getElementById("ev-summary-cost");

  function formatNumber(value, decimals = 2) {
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function getCurrencySymbol() {
    if (currencySelect.value === "custom") {
      const customSymbol = customCurrencyInput.value.trim();

      if (customSymbol) {
        return customSymbol;
      }

      return "$";
    }

    return currencySelect.value;
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

  function calculateEVChargingCost() {
    clearError();

    const batteryCapacity = parseFloat(batteryInput.value);
    const startCharge = parseFloat(startChargeInput.value);
    const targetCharge = parseFloat(targetChargeInput.value);
    const electricityPrice = parseFloat(electricityPriceInput.value);
    const efficiency = parseFloat(efficiencyInput.value);

    if (!Number.isFinite(batteryCapacity) || batteryCapacity <= 0) {
      showError("Please enter a battery capacity greater than 0 kWh.");
      batteryInput.focus();
      return;
    }

    if (
      !Number.isFinite(startCharge) ||
      startCharge < 0 ||
      startCharge > 100
    ) {
      showError("Current charge must be between 0% and 100%.");
      startChargeInput.focus();
      return;
    }

    if (
      !Number.isFinite(targetCharge) ||
      targetCharge < 0 ||
      targetCharge > 100
    ) {
      showError("Target charge must be between 0% and 100%.");
      targetChargeInput.focus();
      return;
    }

    if (targetCharge <= startCharge) {
      showError("Target charge must be greater than the current charge.");
      targetChargeInput.focus();
      return;
    }

    if (!Number.isFinite(electricityPrice) || electricityPrice < 0) {
      showError("Please enter a valid electricity price.");
      electricityPriceInput.focus();
      return;
    }

    if (
      !Number.isFinite(efficiency) ||
      efficiency <= 0 ||
      efficiency > 100
    ) {
      showError("Charging efficiency must be between 1% and 100%.");
      efficiencyInput.focus();
      return;
    }

    if (
      currencySelect.value === "custom" &&
      customCurrencyInput.value.trim() === ""
    ) {
      showError("Please enter a custom currency symbol.");
      customCurrencyInput.focus();
      return;
    }

    const chargePercentage = targetCharge - startCharge;

    // Energy actually stored in the battery.
    const energyStored =
      batteryCapacity * (chargePercentage / 100);

    // Electricity required from the grid after accounting for
    // charging losses.
    const gridEnergy =
      energyStored / (efficiency / 100);

    const chargingLoss =
      gridEnergy - energyStored;

    const chargingCost =
      gridEnergy * electricityPrice;

    const costPerStoredKWh =
      energyStored > 0
        ? chargingCost / energyStored
        : 0;

    const currency = getCurrencySymbol();

    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Energy Stored</h3>
          <p><strong>${formatNumber(energyStored)} kWh</strong></p>
          <p>Energy added to the battery</p>
        </div>

        <div class="result-card">
          <h3>Energy From Grid</h3>
          <p><strong>${formatNumber(gridEnergy)} kWh</strong></p>
          <p>Estimated electricity drawn</p>
        </div>

        <div class="result-card">
          <h3>Charging Cost</h3>
          <p><strong>${currency}${formatNumber(chargingCost)}</strong></p>
          <p>Estimated electricity cost</p>
        </div>

        <div class="result-card">
          <h3>Charging Loss</h3>
          <p><strong>${formatNumber(chargingLoss)} kWh</strong></p>
          <p>Estimated energy lost during charging</p>
        </div>

        <div class="result-card">
          <h3>Charge Added</h3>
          <p><strong>${formatNumber(chargePercentage)}%</strong></p>
          <p>Battery percentage added</p>
        </div>

        <div class="result-card">
          <h3>Cost Per Stored kWh</h3>
          <p><strong>${currency}${formatNumber(costPerStoredKWh)}</strong></p>
          <p>Cost per kWh stored in battery</p>
        </div>

      </div>

      <div class="info-box">

        <h3>EV Charging Cost Calculation</h3>

        <p>
          Energy stored =
          ${formatNumber(batteryCapacity)} kWh ×
          ${formatNumber(chargePercentage)}% ÷ 100 =
          <strong>${formatNumber(energyStored)} kWh</strong>
        </p>

        <p>
          Grid energy =
          ${formatNumber(energyStored)} kWh ÷
          ${formatNumber(efficiency)}% =
          <strong>${formatNumber(gridEnergy)} kWh</strong>
        </p>

        <p>
          Charging cost =
          ${formatNumber(gridEnergy)} kWh ×
          ${currency}${formatNumber(electricityPrice)} per kWh =
          <strong>${currency}${formatNumber(chargingCost)}</strong>
        </p>

      </div>
    `;

    summaryBattery.textContent =
      `${formatNumber(batteryCapacity)} kWh`;

    summaryEnergy.textContent =
      `${formatNumber(energyStored)} kWh`;

    summaryGrid.textContent =
      `${formatNumber(gridEnergy)} kWh`;

    summaryCost.textContent =
      `${currency}${formatNumber(chargingCost)}`;

    resultBox.hidden = false;

    setTimeout(() => {
      resultBox.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 50);
  }

  function resetEVCharging() {
    batteryInput.value = "";
    startChargeInput.value = "20";
    targetChargeInput.value = "80";
    electricityPriceInput.value = "";
    currencySelect.value = "$";
    customCurrencyInput.value = "";
    efficiencyInput.value = "90";

    customCurrencyGroup.hidden = true;

    clearError();

    resultContent.innerHTML = "";
    resultBox.hidden = true;

    summaryBattery.textContent = "—";
    summaryEnergy.textContent = "—";
    summaryGrid.textContent = "—";
    summaryCost.textContent = "—";

    batteryInput.focus();
  }

  currencySelect.addEventListener("change", function () {
    if (currencySelect.value === "custom") {
      customCurrencyGroup.hidden = false;
      customCurrencyInput.focus();
    } else {
      customCurrencyGroup.hidden = true;
      customCurrencyInput.value = "";
    }
  });

  calculateButton.addEventListener(
    "click",
    calculateEVChargingCost
  );

  resetButton.addEventListener(
    "click",
    resetEVCharging
  );

  [
    batteryInput,
    startChargeInput,
    targetChargeInput,
    electricityPriceInput,
    efficiencyInput,
    customCurrencyInput
  ].forEach((input) => {
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        calculateEVChargingCost();
      }
    });
  });

})();