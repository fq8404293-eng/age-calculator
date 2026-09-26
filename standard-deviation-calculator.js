document.addEventListener("DOMContentLoaded", () => {
  const dataInput = document.getElementById("standard-deviation-data");
  const typeInput = document.getElementById("standard-deviation-type");
  const calculateButton = document.getElementById(
    "calculate-standard-deviation"
  );
  const resetButton = document.getElementById(
    "reset-standard-deviation"
  );
  const errorBox = document.getElementById(
    "standard-deviation-error"
  );
  const resultBox = document.getElementById(
    "standard-deviation-result"
  );
  const resultContent = document.getElementById(
    "standard-deviation-result-content"
  );

  if (
    !dataInput ||
    !typeInput ||
    !calculateButton ||
    !resetButton ||
    !errorBox ||
    !resultBox ||
    !resultContent
  ) {
    return;
  }

  function formatNumber(value, decimals = 6) {
    if (!Number.isFinite(value)) {
      return "Not available";
    }

    if (Number.isInteger(value)) {
      return value.toLocaleString("en-US");
    }

    return value.toLocaleString("en-US", {
      maximumFractionDigits: decimals
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

  function parseDataset(rawValue) {
    const normalized = rawValue
      .replace(/,/g, " ")
      .trim();

    if (normalized === "") {
      return [];
    }

    const parts = normalized.split(/\s+/);

    const values = [];

    for (const part of parts) {
      const value = Number(part);

      if (!Number.isFinite(value)) {
        return null;
      }

      values.push(value);
    }

    return values;
  }

  function calculateMean(values) {
    const sum = values.reduce((total, value) => total + value, 0);

    return sum / values.length;
  }

  function calculateVariance(values, mean, type) {
    const squaredDifferences = values.map((value) => {
      const difference = value - mean;
      return difference * difference;
    });

    const sumOfSquaredDifferences = squaredDifferences.reduce(
      (total, value) => total + value,
      0
    );

    const divisor =
      type === "sample"
        ? values.length - 1
        : values.length;

    return sumOfSquaredDifferences / divisor;
  }

  function calculateStandardDeviation() {
    clearError();

    const rawValue = dataInput.value.trim();

    if (rawValue === "") {
      showError("Please enter a dataset.");
      dataInput.focus();
      return;
    }

    const values = parseDataset(rawValue);

    if (values === null) {
      showError(
        "Please enter valid numbers separated by commas, spaces, or line breaks."
      );
      dataInput.focus();
      return;
    }

    if (values.length < 2) {
      showError(
        "Please enter at least 2 numerical values."
      );
      dataInput.focus();
      return;
    }

    if (values.length > 10000) {
      showError(
        "Please enter no more than 10,000 values."
      );
      dataInput.focus();
      return;
    }

    const type = typeInput.value;

    const mean = calculateMean(values);
    const variance = calculateVariance(
      values,
      mean,
      type
    );
    const standardDeviation = Math.sqrt(variance);

    const sum = values.reduce(
      (total, value) => total + value,
      0
    );

    const sumOfSquaredDifferences = values.reduce(
      (total, value) => {
        const difference = value - mean;
        return total + difference * difference;
      },
      0
    );

    const divisor =
      type === "sample"
        ? values.length - 1
        : values.length;

    const typeLabel =
      type === "sample"
        ? "Sample"
        : "Population";

    const varianceLabel =
      type === "sample"
        ? "Sample Variance"
        : "Population Variance";

    const standardDeviationLabel =
      type === "sample"
        ? "Sample Standard Deviation"
        : "Population Standard Deviation";

    const datasetPreview = values
      .slice(0, 12)
      .map((value) => formatNumber(value))
      .join(", ");

    const hasMoreValues = values.length > 12;

    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>${standardDeviationLabel}</h3>
          <p class="result-value">
            ${formatNumber(standardDeviation)}
          </p>
        </div>

        <div class="result-card">
          <h3>Mean</h3>
          <p class="result-value">
            ${formatNumber(mean)}
          </p>
        </div>

        <div class="result-card">
          <h3>${varianceLabel}</h3>
          <p class="result-value">
            ${formatNumber(variance)}
          </p>
        </div>

        <div class="result-card">
          <h3>Number of Values</h3>
          <p class="result-value">
            ${formatNumber(values.length)}
          </p>
        </div>

      </div>

      <div class="info-box">

        <h3>Calculation Summary</h3>

        <p>
          Calculation type:
          <strong>${typeLabel} Standard Deviation</strong>
        </p>

        <p>
          Sum of values:
          <strong>${formatNumber(sum)}</strong>
        </p>

        <p>
          Mean:
          <strong>${formatNumber(mean)}</strong>
        </p>

        <p>
          Sum of squared deviations:
          <strong>
            ${formatNumber(sumOfSquaredDifferences)}
          </strong>
        </p>

        <p>
          Divisor:
          <strong>${formatNumber(divisor)}</strong>
        </p>

        <p>
          Variance:
          <strong>${formatNumber(variance)}</strong>
        </p>

        <p>
          Standard deviation:
          <strong>${formatNumber(standardDeviation)}</strong>
        </p>

      </div>

      <div class="info-box">

        <h3>Your Dataset</h3>

        <p>
          ${datasetPreview}${hasMoreValues ? ", ..." : ""}
        </p>

        <p>
          The calculator used all
          <strong>${formatNumber(values.length)}</strong>
          values in the dataset.
        </p>

      </div>

      <div class="info-box">

        <h3>Formula Used</h3>

        ${
          type === "sample"
            ? `
              <p class="text-center">
                <strong>
                  s = √[Σ(x − x̄)² ÷ (n − 1)]
                </strong>
              </p>

              <p>
                The sample calculation uses
                <strong>n − 1</strong>
                as the divisor.
              </p>
            `
            : `
              <p class="text-center">
                <strong>
                  σ = √[Σ(x − μ)² ÷ N]
                </strong>
              </p>

              <p>
                The population calculation uses
                <strong>N</strong>
                as the divisor.
              </p>
            `
        }

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
    dataInput.value = "";
    typeInput.value = "population";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    dataInput.focus();
  }

  calculateButton.addEventListener(
    "click",
    calculateStandardDeviation
  );

  resetButton.addEventListener(
    "click",
    resetCalculator
  );

  dataInput.addEventListener("keydown", (event) => {
    if (
      event.key === "Enter" &&
      (event.ctrlKey || event.metaKey)
    ) {
      event.preventDefault();
      calculateStandardDeviation();
    }
  });

  dataInput.addEventListener("input", () => {
    if (!errorBox.hidden) {
      clearError();
    }
  });

  typeInput.addEventListener("change", () => {
    if (!errorBox.hidden) {
      clearError();
    }
  });
});