document.addEventListener("DOMContentLoaded", () => {
  const numberInput = document.getElementById("square-root-number");
  const calculateButton = document.getElementById("calculate-square-root");
  const resetButton = document.getElementById("reset-square-root");
  const errorBox = document.getElementById("square-root-error");
  const resultBox = document.getElementById("square-root-result");
  const resultContent = document.getElementById("square-root-result-content");

  if (
    !numberInput ||
    !calculateButton ||
    !resetButton ||
    !errorBox ||
    !resultBox ||
    !resultContent
  ) {
    return;
  }

  function formatNumber(value) {
    if (!Number.isFinite(value)) {
      return "Not available";
    }

    if (Number.isInteger(value)) {
      return value.toLocaleString("en-US");
    }

    return value.toLocaleString("en-US", {
      maximumFractionDigits: 12
    });
  }

  function formatCalculationNumber(value) {
    if (Number.isInteger(value)) {
      return value.toLocaleString("en-US");
    }

    return value.toLocaleString("en-US", {
      maximumFractionDigits: 12
    });
  }

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
    resultBox.hidden = true;
    resultContent.innerHTML = "";
  }

  function clearError() {
    errorBox.textContent = "";
    errorBox.hidden = true;
  }

  function calculateSquareRoot() {
    clearError();

    const rawValue = numberInput.value.trim();

    if (rawValue === "") {
      showError("Please enter a number.");
      numberInput.focus();
      return;
    }

    const number = Number(rawValue);

    if (!Number.isFinite(number)) {
      showError("Please enter a valid number.");
      numberInput.focus();
      return;
    }

    if (number < 0) {
      showError(
        "Please enter a number greater than or equal to 0. Negative numbers do not have a real-number square root."
      );
      numberInput.focus();
      return;
    }

    const squareRoot = Math.sqrt(number);
    const squaredResult = number * number;

    if (!Number.isFinite(squareRoot)) {
      showError("The square root result is too large to display.");
      return;
    }

    const isPerfectSquare =
      Number.isInteger(squareRoot);

    const resultType = isPerfectSquare
      ? "Perfect square"
      : "Decimal square root";

    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Square Root</h3>
          <p class="result-value">${formatNumber(squareRoot)}</p>
        </div>

        <div class="result-card">
          <h3>Input Number</h3>
          <p class="result-value">${formatCalculationNumber(number)}</p>
        </div>

        <div class="result-card">
          <h3>Result Type</h3>
          <p class="result-value">${resultType}</p>
        </div>

      </div>

      <div class="info-box">
        <h3>Calculation</h3>

        <p>
          √${formatCalculationNumber(number)}
          =
          <strong>${formatNumber(squareRoot)}</strong>
        </p>

        <p>
          Verification:
          <strong>
            ${formatNumber(squareRoot)} ×
            ${formatNumber(squareRoot)}
          </strong>
          ≈
          <strong>${formatCalculationNumber(number)}</strong>
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
    numberInput.value = "";
    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    numberInput.focus();
  }

  calculateButton.addEventListener("click", calculateSquareRoot);

  resetButton.addEventListener("click", resetCalculator);

  numberInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateSquareRoot();
    }
  });

  numberInput.addEventListener("input", () => {
    if (!errorBox.hidden) {
      clearError();
    }
  });
});