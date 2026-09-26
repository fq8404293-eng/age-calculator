document.addEventListener("DOMContentLoaded", () => {
  const firstInput = document.getElementById("gcd-first-number");
  const secondInput = document.getElementById("gcd-second-number");
  const calculateButton = document.getElementById("calculate-gcd");
  const resetButton = document.getElementById("reset-gcd");
  const errorBox = document.getElementById("gcd-error");
  const resultBox = document.getElementById("gcd-result");
  const resultContent = document.getElementById("gcd-result-content");

  if (
    !firstInput ||
    !secondInput ||
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

  function calculateGCD(a, b) {
    let x = a;
    let y = b;

    while (y !== 0) {
      const remainder = x % y;
      x = y;
      y = remainder;
    }

    return x;
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

  function getEuclideanSteps(a, b) {
    const steps = [];

    let larger = Math.max(a, b);
    let smaller = Math.min(a, b);

    while (smaller !== 0) {
      const quotient = Math.floor(larger / smaller);
      const remainder = larger % smaller;

      steps.push({
        larger,
        smaller,
        quotient,
        remainder
      });

      larger = smaller;
      smaller = remainder;
    }

    return steps;
  }

  function calculateGcdResult() {
    clearError();

    const firstRaw = firstInput.value.trim();
    const secondRaw = secondInput.value.trim();

    if (firstRaw === "" || secondRaw === "") {
      showError("Please enter both numbers.");
      return;
    }

    const firstNumber = Number(firstRaw);
    const secondNumber = Number(secondRaw);

    if (!Number.isFinite(firstNumber) || !Number.isFinite(secondNumber)) {
      showError("Please enter valid numbers.");
      return;
    }

    if (!Number.isInteger(firstNumber) || !Number.isInteger(secondNumber)) {
      showError(
        "Please enter whole numbers. Decimal numbers are not accepted."
      );
      return;
    }

    if (firstNumber < 1 || secondNumber < 1) {
      showError("Please enter positive whole numbers greater than 0.");
      return;
    }

    if (
      !Number.isSafeInteger(firstNumber) ||
      !Number.isSafeInteger(secondNumber)
    ) {
      showError(
        "Please enter whole numbers within the calculator's safe range."
      );
      return;
    }

    const gcd = calculateGCD(firstNumber, secondNumber);

    const firstFactors = findFactors(firstNumber);
    const secondFactors = findFactors(secondNumber);

    const commonFactors = firstFactors.filter((factor) =>
      secondNumber % factor === 0
    );

    const steps = getEuclideanSteps(firstNumber, secondNumber);

    const factorList = commonFactors
      .map(formatNumber)
      .join(", ");

    const euclideanSteps = steps
      .map((step) => {
        if (step.remainder === 0) {
          return `
            <p>
              <strong>
                ${formatNumber(step.larger)}
                ÷
                ${formatNumber(step.smaller)}
                =
                ${formatNumber(step.quotient)}
                remainder 0
              </strong>
            </p>
          `;
        }

        return `
          <p>
            <strong>
              ${formatNumber(step.larger)}
              ÷
              ${formatNumber(step.smaller)}
              =
              ${formatNumber(step.quotient)}
              remainder
              ${formatNumber(step.remainder)}
            </strong>
          </p>
        `;
      })
      .join("");

    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>GCD</h3>
          <p class="result-value">${formatNumber(gcd)}</p>
        </div>

        <div class="result-card">
          <h3>First Number</h3>
          <p class="result-value">${formatNumber(firstNumber)}</p>
        </div>

        <div class="result-card">
          <h3>Second Number</h3>
          <p class="result-value">${formatNumber(secondNumber)}</p>
        </div>

        <div class="result-card">
          <h3>Common Factors</h3>
          <p class="result-value">${formatNumber(commonFactors.length)}</p>
        </div>

      </div>

      <div class="info-box">

        <h3>Common Factors</h3>

        <p>
          The common factors of
          ${formatNumber(firstNumber)}
          and
          ${formatNumber(secondNumber)}
          are:
        </p>

        <p>
          <strong>${factorList}</strong>
        </p>

        <p>
          The largest common factor is
          <strong>${formatNumber(gcd)}</strong>.
        </p>

      </div>

      <div class="info-box">

        <h3>Euclidean Algorithm</h3>

        ${euclideanSteps}

        <p>
          The last non-zero remainder is
          <strong>${formatNumber(gcd)}</strong>.
        </p>

        <p class="text-center">
          <strong>
            GCD(${formatNumber(firstNumber)}, ${formatNumber(secondNumber)})
            = ${formatNumber(gcd)}
          </strong>
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
    firstInput.value = "";
    secondInput.value = "";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    firstInput.focus();
  }

  calculateButton.addEventListener("click", calculateGcdResult);

  resetButton.addEventListener("click", resetCalculator);

  firstInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateGcdResult();
    }
  });

  secondInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateGcdResult();
    }
  });

  firstInput.addEventListener("input", () => {
    if (!errorBox.hidden) {
      clearError();
    }
  });

  secondInput.addEventListener("input", () => {
    if (!errorBox.hidden) {
      clearError();
    }
  });
});