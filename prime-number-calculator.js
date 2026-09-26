document.addEventListener("DOMContentLoaded", () => {
  const numberInput = document.getElementById("prime-number");
  const calculateButton = document.getElementById("calculate-prime-number");
  const resetButton = document.getElementById("reset-prime-number");
  const errorBox = document.getElementById("prime-number-error");
  const resultBox = document.getElementById("prime-number-result");
  const resultContent = document.getElementById("prime-number-result-content");

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
    return Number(value).toLocaleString("en-US");
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

  function isPrime(number) {
    if (number < 2) {
      return false;
    }

    if (number === 2) {
      return true;
    }

    if (number % 2 === 0) {
      return false;
    }

    const limit = Math.floor(Math.sqrt(number));

    for (let divisor = 3; divisor <= limit; divisor += 2) {
      if (number % divisor === 0) {
        return false;
      }
    }

    return true;
  }

  function findFactors(number) {
    const factors = [];

    for (let divisor = 1; divisor <= Math.sqrt(number); divisor++) {
      if (number % divisor === 0) {
        factors.push(divisor);

        const pairedFactor = number / divisor;

        if (pairedFactor !== divisor) {
          factors.push(pairedFactor);
        }
      }
    }

    factors.sort((a, b) => a - b);

    return factors;
  }

  function findSmallestDivisor(number) {
    if (number % 2 === 0) {
      return 2;
    }

    const limit = Math.floor(Math.sqrt(number));

    for (let divisor = 3; divisor <= limit; divisor += 2) {
      if (number % divisor === 0) {
        return divisor;
      }
    }

    return null;
  }

  function calculatePrimeNumber() {
    clearError();

    const rawValue = numberInput.value.trim();

    if (rawValue === "") {
      showError("Please enter a whole number.");
      numberInput.focus();
      return;
    }

    const number = Number(rawValue);

    if (!Number.isFinite(number)) {
      showError("Please enter a valid number.");
      numberInput.focus();
      return;
    }

    if (!Number.isInteger(number)) {
      showError("Please enter a whole number. Decimal numbers are not accepted.");
      numberInput.focus();
      return;
    }

    if (number < 2) {
      showError(
        "Please enter a whole number greater than or equal to 2. Numbers below 2 are not prime numbers."
      );
      numberInput.focus();
      return;
    }

    if (!Number.isSafeInteger(number)) {
      showError(
        "Please enter a whole number within the calculator's safe range."
      );
      numberInput.focus();
      return;
    }

    const prime = isPrime(number);

    if (prime) {
      resultContent.innerHTML = `
        <div class="calculator-results-grid">

          <div class="result-card">
            <h3>Result</h3>
            <p class="result-value">Prime</p>
          </div>

          <div class="result-card">
            <h3>Number</h3>
            <p class="result-value">${formatNumber(number)}</p>
          </div>

          <div class="result-card">
            <h3>Number of Factors</h3>
            <p class="result-value">2</p>
          </div>

        </div>

        <div class="info-box">
          <h3>Why Is ${formatNumber(number)} Prime?</h3>

          <p>
            ${formatNumber(number)} has exactly two positive factors:
            <strong>1</strong> and
            <strong>${formatNumber(number)}</strong>.
          </p>

          <p>
            Therefore, ${formatNumber(number)} is a
            <strong>prime number</strong>.
          </p>

          <p>
            Factor pair:
            <strong>1 × ${formatNumber(number)} = ${formatNumber(number)}</strong>
          </p>
        </div>
      `;
    } else {
      const factors = findFactors(number);
      const smallestDivisor = findSmallestDivisor(number);

      const factorList = factors
        .map((factor) => formatNumber(factor))
        .join(", ");

      resultContent.innerHTML = `
        <div class="calculator-results-grid">

          <div class="result-card">
            <h3>Result</h3>
            <p class="result-value">Composite</p>
          </div>

          <div class="result-card">
            <h3>Number</h3>
            <p class="result-value">${formatNumber(number)}</p>
          </div>

          <div class="result-card">
            <h3>Number of Factors</h3>
            <p class="result-value">${formatNumber(factors.length)}</p>
          </div>

        </div>

        <div class="info-box">
          <h3>Why Is ${formatNumber(number)} Composite?</h3>

          <p>
            ${formatNumber(number)} has more than two positive factors,
            so it is a <strong>composite number</strong>.
          </p>

          <p>
            Factors:
            <strong>${factorList}</strong>
          </p>

          <p>
            One factor pair is:
            <strong>
              ${formatNumber(smallestDivisor)}
              ×
              ${formatNumber(number / smallestDivisor)}
              =
              ${formatNumber(number)}
            </strong>
          </p>
        </div>
      `;
    }

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

  calculateButton.addEventListener("click", calculatePrimeNumber);

  resetButton.addEventListener("click", resetCalculator);

  numberInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      calculatePrimeNumber();
    }
  });

  numberInput.addEventListener("input", () => {
    if (!errorBox.hidden) {
      clearError();
    }
  });
});