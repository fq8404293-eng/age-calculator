document.addEventListener("DOMContentLoaded", () => {
  const dataInput = document.getElementById("mean-median-mode-data");
  const calculateButton = document.getElementById("calculate-mean-median-mode");
  const resetButton = document.getElementById("reset-mean-median-mode");
  const errorMessage = document.getElementById("mean-median-mode-error");
  const resultBox = document.getElementById("mean-median-mode-result");
  const resultContent = document.getElementById("mean-median-mode-result-content");

  if (
    !dataInput ||
    !calculateButton ||
    !resetButton ||
    !errorMessage ||
    !resultBox ||
    !resultContent
  ) {
    return;
  }

  function parseDataset(value) {
    const cleaned = value
      .replace(/,/g, " ")
      .replace(/\n/g, " ")
      .replace(/\r/g, " ")
      .replace(/\t/g, " ");

    const tokens = cleaned.trim().split(/\s+/).filter(Boolean);

    if (tokens.length === 0) {
      throw new Error("Please enter at least one number.");
    }

    const numbers = tokens.map((token) => {
      const number = Number(token);

      if (!Number.isFinite(number)) {
        throw new Error(`"${token}" is not a valid number.`);
      }

      return number;
    });

    if (numbers.length > 10000) {
      throw new Error("Please enter no more than 10,000 values.");
    }

    return numbers;
  }

  function formatNumber(value, maxDecimals = 6) {
    if (!Number.isFinite(value)) {
      return "—";
    }

    const rounded = Number(value.toFixed(maxDecimals));

    return rounded.toLocaleString("en-US", {
      maximumFractionDigits: maxDecimals
    });
  }

  function formatDataset(numbers) {
    return numbers
      .map((number) => formatNumber(number))
      .join(", ");
  }

  function calculateMean(numbers) {
    const sum = numbers.reduce((total, number) => total + number, 0);
    return sum / numbers.length;
  }

  function calculateMedian(sortedNumbers) {
    const middle = Math.floor(sortedNumbers.length / 2);

    if (sortedNumbers.length % 2 === 1) {
      return sortedNumbers[middle];
    }

    return (sortedNumbers[middle - 1] + sortedNumbers[middle]) / 2;
  }

  function calculateMode(numbers) {
    const frequencyMap = new Map();

    numbers.forEach((number) => {
      frequencyMap.set(number, (frequencyMap.get(number) || 0) + 1);
    });

    let highestFrequency = 0;

    frequencyMap.forEach((frequency) => {
      if (frequency > highestFrequency) {
        highestFrequency = frequency;
      }
    });

    if (highestFrequency === 1) {
      return {
        modes: [],
        frequency: 1,
        hasMode: false
      };
    }

    const modes = [];

    frequencyMap.forEach((frequency, value) => {
      if (frequency === highestFrequency) {
        modes.push(value);
      }
    });

    modes.sort((a, b) => a - b);

    return {
      modes,
      frequency: highestFrequency,
      hasMode: true
    };
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
    resultBox.hidden = true;
    resultContent.innerHTML = "";
  }

  function clearError() {
    errorMessage.textContent = "";
    errorMessage.hidden = true;
  }

  function calculate() {
    clearError();

    try {
      const numbers = parseDataset(dataInput.value);

      const sortedNumbers = [...numbers].sort((a, b) => a - b);

      const count = numbers.length;
      const sum = numbers.reduce((total, number) => total + number, 0);
      const mean = sum / count;
      const median = calculateMedian(sortedNumbers);
      const modeResult = calculateMode(numbers);

      const minimum = sortedNumbers[0];
      const maximum = sortedNumbers[sortedNumbers.length - 1];
      const range = maximum - minimum;

      let modeText = "No mode";

      if (modeResult.hasMode) {
        modeText = modeResult.modes
          .map((mode) => formatNumber(mode))
          .join(", ");
      }

      let modeDescription = "";

      if (!modeResult.hasMode) {
        modeDescription =
          "Every value occurs once, so there is no mode.";
      } else if (modeResult.modes.length === 1) {
        modeDescription =
          `The mode occurs ${modeResult.frequency} ${
            modeResult.frequency === 1 ? "time" : "times"
          }.`;
      } else {
        modeDescription =
          `${modeResult.modes.length} values share the highest frequency of ${modeResult.frequency}.`;
      }

      resultContent.innerHTML = `
        <div class="calculator-results-grid">

          <div class="result-card">
            <h3>Mean</h3>
            <p>${formatNumber(mean)}</p>
          </div>

          <div class="result-card">
            <h3>Median</h3>
            <p>${formatNumber(median)}</p>
          </div>

          <div class="result-card">
            <h3>Mode</h3>
            <p>${modeText}</p>
          </div>

          <div class="result-card">
            <h3>Range</h3>
            <p>${formatNumber(range)}</p>
          </div>

          <div class="result-card">
            <h3>Sum</h3>
            <p>${formatNumber(sum)}</p>
          </div>

          <div class="result-card">
            <h3>Number of Values</h3>
            <p>${formatNumber(count, 0)}</p>
          </div>

        </div>

        <div class="content-card" style="margin-top: 1.5rem;">

          <h3>Calculation Summary</h3>

          <p>
            <strong>Mean:</strong>
            ${formatNumber(sum)} ÷ ${formatNumber(count, 0)}
            = ${formatNumber(mean)}
          </p>

          <p>
            <strong>Median:</strong>
            ${
              count % 2 === 1
                ? `The middle value is ${formatNumber(median)}.`
                : `The two middle values are
                   ${formatNumber(sortedNumbers[count / 2 - 1])}
                   and
                   ${formatNumber(sortedNumbers[count / 2])},
                   giving a median of ${formatNumber(median)}.`
            }
          </p>

          <p>
            <strong>Mode:</strong>
            ${modeText}
          </p>

          <p>
            ${modeDescription}
          </p>

          <p>
            <strong>Range:</strong>
            ${formatNumber(maximum)} − ${formatNumber(minimum)}
            = ${formatNumber(range)}
          </p>

        </div>

        <div class="content-card" style="margin-top: 1.5rem;">

          <h3>Sorted Dataset</h3>

          <p>
            ${formatDataset(sortedNumbers)}
          </p>

        </div>
      `;

      resultBox.hidden = false;

      setTimeout(() => {
        resultBox.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 100);

    } catch (error) {
      showError(error.message);
    }
  }

  function resetCalculator() {
    dataInput.value = "";
    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    dataInput.focus();
  }

  calculateButton.addEventListener("click", calculate);
  resetButton.addEventListener("click", resetCalculator);

  dataInput.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      calculate();
    }
  });
});