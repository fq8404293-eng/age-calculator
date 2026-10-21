/* ==========================================================
   CALClyWorld CURRENCY CONVERTER — OFFLINE MODE
   Uses a rate entered by the visitor. No exchange-rate API.
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const amountInput = document.getElementById("currency-amount");
  const fromSelect = document.getElementById("currency-from");
  const toSelect = document.getElementById("currency-to");
  const rateInput = document.getElementById("currency-rate-input");
  const swapButton = document.getElementById("swap-currencies");
  const calculateButton = document.getElementById("calculate-currency");
  const resetButton = document.getElementById("reset-currency");
  const errorBox = document.getElementById("currency-error");
  const resultBox = document.getElementById("currency-result");
  const resultContent = document.getElementById("currency-result-content");

  const summaryAmount = document.getElementById("summary-currency-amount");
  const summaryFrom = document.getElementById("summary-currency-from");
  const summaryTo = document.getElementById("summary-currency-to");
  const summaryRate = document.getElementById("summary-currency-rate");
  const summaryConverted = document.getElementById("summary-currency-converted");
  const summaryUpdated = document.getElementById("summary-currency-updated");

  if (!amountInput || !fromSelect || !toSelect || !rateInput ||
      !swapButton || !calculateButton || !resetButton ||
      !errorBox || !resultBox || !resultContent) {
    return;
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

  function formatNumber(value, maximumFractionDigits = 6) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits
    }).format(value);
  }

  function formatCurrency(value, code) {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: code,
        maximumFractionDigits: code === "JPY" || code === "KRW" ? 0 : 2
      }).format(value);
    } catch {
      return `${code} ${formatNumber(value, 2)}`;
    }
  }

  function currencyLabel(select) {
    const option = select.options[select.selectedIndex];
    return option ? option.textContent.trim() : select.value;
  }

  function clearResult() {
    resultBox.hidden = true;
    resultContent.textContent = "";
  }

  function convertCurrency() {
    clearError();

    const amount = Number(amountInput.value);
    const from = fromSelect.value;
    const to = toSelect.value;

    if (amountInput.value.trim() === "" || !Number.isFinite(amount) || amount < 0) {
      showError("Enter a valid amount of 0 or more.");
      amountInput.focus();
      return;
    }

    if (!from || !to) {
      showError("Select both currencies.");
      return;
    }

    let rate;
    if (from === to) {
      rate = 1;
    } else {
      rate = Number(rateInput.value);
      if (rateInput.value.trim() === "" || !Number.isFinite(rate) || rate <= 0) {
        showError("Enter a valid exchange rate greater than 0. The rate must mean 1 unit of the source currency equals this many units of the destination currency.");
        rateInput.focus();
        return;
      }
    }

    const converted = amount * rate;
    if (!Number.isFinite(converted)) {
      showError("The converted amount is too large to calculate. Check your inputs.");
      return;
    }

    const fromName = currencyLabel(fromSelect);
    const toName = currencyLabel(toSelect);

    if (summaryAmount) summaryAmount.textContent = formatNumber(amount, 6);
    if (summaryFrom) summaryFrom.textContent = fromName;
    if (summaryTo) summaryTo.textContent = toName;
    if (summaryRate) summaryRate.textContent = `1 ${from} = ${formatNumber(rate, 8)} ${to}`;
    if (summaryConverted) summaryConverted.textContent = formatCurrency(converted, to);
    if (summaryUpdated) summaryUpdated.textContent = from === to ? "Same currency (1:1)" : "Manual rate entered by you";

    resultContent.innerHTML = `
      <div class="calculator-results-grid">
        <div class="result-card">
          <h3>Amount to Convert</h3>
          <p><strong>${formatCurrency(amount, from)}</strong></p>
        </div>
        <div class="result-card">
          <h3>Exchange Rate Used</h3>
          <p><strong>1 ${from} = ${formatNumber(rate, 8)} ${to}</strong></p>
        </div>
        <div class="result-card">
          <h3>Converted Amount</h3>
          <p><strong>${formatCurrency(converted, to)}</strong></p>
        </div>
      </div>
      <p class="small-text">This calculation uses the manual rate you entered; it does not fetch live market rates or include provider fees.</p>
    `;
    resultBox.hidden = false;
  }

  calculateButton.addEventListener("click", convertCurrency);

  swapButton.addEventListener("click", () => {
    const oldFrom = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = oldFrom;

    const rate = Number(rateInput.value);
    if (rateInput.value.trim() !== "" && Number.isFinite(rate) && rate > 0) {
      rateInput.value = (1 / rate).toPrecision(8).replace(/\.?0+$/, "");
    }

    clearError();
    clearResult();
  });

  resetButton.addEventListener("click", () => {
    amountInput.value = "";
    fromSelect.value = "USD";
    toSelect.value = "INR";
    rateInput.value = "";
    clearError();
    clearResult();
    if (summaryAmount) summaryAmount.textContent = "—";
    if (summaryFrom) summaryFrom.textContent = "USD";
    if (summaryTo) summaryTo.textContent = "INR";
    if (summaryRate) summaryRate.textContent = "—";
    if (summaryConverted) summaryConverted.textContent = "—";
    if (summaryUpdated) summaryUpdated.textContent = "—";
    amountInput.focus();
  });

  [amountInput, rateInput].forEach(input => {
    input.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        convertCurrency();
      }
    });
  });
});
