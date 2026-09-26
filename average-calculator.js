document.addEventListener("DOMContentLoaded", () => {
  const numbersInput = document.getElementById("average-numbers");
  const calculateButton = document.getElementById("calculate-average");
  const resetButton = document.getElementById("reset-average");

  const errorMessage = document.getElementById("average-error");
  const resultBox = document.getElementById("average-result");
  const resultContent = document.getElementById("average-result-content");

  const summaryAverage = document.getElementById("average-summary-value");
  const summarySum = document.getElementById("average-summary-sum");
  const summaryCount = document.getElementById("average-summary-count");

  function formatNumber(number) {
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 10
    });
  }

  function formatAverage(number) {
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 10
    });
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
    resultBox.hidden = true;
  }

  function clearError() {
    errorMessage.textContent = "";
    errorMessage.hidden = true;
  }

  function calculateAverage() {
    clearError();

    const rawInput = numbersInput.value.trim();

    if (!rawInput) {
      showError("Please enter at least one number.");
      numbersInput.focus();
      return;
    }

    /*
      Accept:
      10, 20, 30
      10 20 30
      10
      20
      30
      10, 20
      10,20,30
    */

    const values = rawInput
      .split(/[\s,]+/)
      .map(value => value.trim())
      .filter(value => value !== "");

    if (values.length === 0) {
      showError("Please enter valid numbers.");
      numbersInput.focus();
      return;
    }

    const numbers = values.map(value => Number(value));

    if (numbers.some(number => !Number.isFinite(number))) {
      showError(
        "Please enter valid numbers only. Separate each number with commas, spaces, or new lines."
      );
      numbersInput.focus();
      return;
    }

    const sum = numbers.reduce((total, number) => total + number, 0);
    const count = numbers.length;
    const average = sum / count;

    if (!Number.isFinite(average)) {
      showError("The numbers entered are too large to calculate safely.");
      return;
    }

    const numberList = numbers
      .map(number => formatNumber(number))
      .join(", ");

    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Average</h3>
          <p>${formatAverage(average)}</p>
        </div>

        <div class="result-card">
          <h3>Sum</h3>
          <p>${formatNumber(sum)}</p>
        </div>

        <div class="result-card">
          <h3>Number of Values</h3>
          <p>${count}</p>
        </div>

      </div>

      <div class="info-box">
        <p>
          <strong>Average Calculation</strong>
        </p>

        <p>
          Numbers: ${numberList}
        </p>

        <p>
          Sum: ${formatNumber(sum)}
        </p>

        <p>
          Number of values: ${count}
        </p>

        <p>
          Average = ${formatNumber(sum)} ÷ ${count}
          = <strong>${formatAverage(average)}</strong>
        </p>
      </div>
    `;

    summaryAverage.textContent = formatAverage(average);
    summarySum.textContent = formatNumber(sum);
    summaryCount.textContent = count;

    resultBox.hidden = false;

    resultBox.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function resetCalculator() {
    numbersInput.value = "";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    summaryAverage.textContent = "—";
    summarySum.textContent = "—";
    summaryCount.textContent = "—";

    numbersInput.focus();
  }

  calculateButton.addEventListener("click", calculateAverage);

  resetButton.addEventListener("click", resetCalculator);

  numbersInput.addEventListener("keydown", event => {
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault();
      calculateAverage();
    }
  });
});