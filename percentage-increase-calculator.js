document.addEventListener("DOMContentLoaded", () => {
  const originalValueInput = document.getElementById("original-value");
  const newValueInput = document.getElementById("new-value");

  const calculateButton = document.getElementById("calculate-percentage-increase");
  const resetButton = document.getElementById("reset-percentage-increase");

  const errorMessage = document.getElementById("percentage-increase-error");
  const resultBox = document.getElementById("percentage-increase-result");
  const resultContent = document.getElementById("percentage-increase-result-content");

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
    resultBox.hidden = true;
  }

  function clearError() {
    errorMessage.textContent = "";
    errorMessage.hidden = true;
  }

  function formatNumber(value, decimals = 2) {
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function calculatePercentageIncrease() {
    clearError();

    const originalValue = parseFloat(originalValueInput.value);
    const newValue = parseFloat(newValueInput.value);

    if (originalValueInput.value.trim() === "") {
      showError("Please enter the original value.");
      originalValueInput.focus();
      return;
    }

    if (newValueInput.value.trim() === "") {
      showError("Please enter the new value.");
      newValueInput.focus();
      return;
    }

    if (!Number.isFinite(originalValue) || !Number.isFinite(newValue)) {
      showError("Please enter valid numbers.");
      return;
    }

    if (originalValue <= 0) {
      showError("The original value must be greater than 0.");
      originalValueInput.focus();
      return;
    }

    if (newValue < 0) {
      showError("The new value cannot be negative.");
      newValueInput.focus();
      return;
    }

    const changeAmount = newValue - originalValue;
    const percentageChange = (changeAmount / originalValue) * 100;

    let changeType;
    let resultTitle;
    let description;

    if (changeAmount > 0) {
      changeType = "Increase";
      resultTitle = "Percentage Increase";
      description =
        `The value increased by ${formatNumber(changeAmount)} from the original value.`;
    } else if (changeAmount < 0) {
      changeType = "Decrease";
      resultTitle = "Percentage Change";
      description =
        `The value decreased by ${formatNumber(Math.abs(changeAmount))} from the original value.`;
    } else {
      changeType = "No Change";
      resultTitle = "Percentage Change";
      description = "The original value and new value are the same.";
    }

    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Original Value</h3>
          <p>${formatNumber(originalValue)}</p>
        </div>

        <div class="result-card">
          <h3>New Value</h3>
          <p>${formatNumber(newValue)}</p>
        </div>

        <div class="result-card">
          <h3>Change Amount</h3>
          <p>${formatNumber(Math.abs(changeAmount))}</p>
        </div>

        <div class="result-card">
          <h3>${resultTitle}</h3>
          <p>${formatNumber(Math.abs(percentageChange))}%</p>
        </div>

      </div>

      <div class="info-box">
        <p>
          <strong>${changeType}</strong><br>
          ${description}
        </p>

        <p>
          ${formatNumber(originalValue)} → ${formatNumber(newValue)}
        </p>

        <p>
          Percentage change:
          <strong>${percentageChange >= 0 ? "+" : ""}${formatNumber(percentageChange)}%</strong>
        </p>
      </div>
    `;

    resultBox.hidden = false;

    setTimeout(() => {
      resultBox.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 50);
  }

  function resetCalculator() {
    originalValueInput.value = "";
    newValueInput.value = "";

    clearError();

    resultContent.innerHTML = "";
    resultBox.hidden = true;

    originalValueInput.focus();
  }

  calculateButton.addEventListener("click", calculatePercentageIncrease);
  resetButton.addEventListener("click", resetCalculator);

  [originalValueInput, newValueInput].forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        calculatePercentageIncrease();
      }
    });
  });
});