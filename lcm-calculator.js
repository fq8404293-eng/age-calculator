document.addEventListener("DOMContentLoaded", () => {
  const firstInput = document.getElementById("lcm-first-number");
  const secondInput = document.getElementById("lcm-second-number");
  const calculateButton = document.getElementById("calculate-lcm");
  const resetButton = document.getElementById("reset-lcm");
  const errorBox = document.getElementById("lcm-error");
  const resultBox = document.getElementById("lcm-result");
  const resultContent = document.getElementById("lcm-result-content");

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
    while (b !== 0) {
      const remainder = a % b;
      a = b;
      b = remainder;
    }

    return a;
  }

  function calculateLCM(a, b) {
    const gcd = calculateGCD(a, b);

    return (a / gcd) * b;
  }

  function getMultiples(number, limit) {
    const multiples = [];

    for (let i = 1; i <= limit; i++) {
      multiples.push(number * i);
    }

    return multiples;
  }

  function calculateLcmResult() {
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
      showError("Please enter whole numbers. Decimal numbers are not accepted.");
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
    const lcm = calculateLCM(firstNumber, secondNumber);

    if (!Number.isSafeInteger(lcm)) {
      showError(
        "The LCM is too large to calculate safely. Please use smaller numbers."
      );
      return;
    }

    const firstMultiples = getMultiples(firstNumber, Math.ceil(lcm / firstNumber));
    const secondMultiples = getMultiples(
      secondNumber,
      Math.ceil(lcm / secondNumber)
    );

    const firstPreview = firstMultiples
      .slice(0, 10)
      .map(formatNumber)
      .join(", ");

    const secondPreview = secondMultiples
      .slice(0, 10)
      .map(formatNumber)
      .join(", ");

    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>LCM</h3>
          <p class="result-value">${formatNumber(lcm)}</p>
        </div>

        <div class="result-card">
          <h3>GCD</h3>
          <p class="result-value">${formatNumber(gcd)}</p>
        </div>

        <div class="result-card">
          <h3>Numbers</h3>
          <p class="result-value">
            ${formatNumber(firstNumber)} &amp;
            ${formatNumber(secondNumber)}
          </p>
        </div>

      </div>

      <div class="info-box">

        <h3>LCM Calculation</h3>

        <p>
          Using the formula:
          <strong>
            LCM(a, b) = (a × b) ÷ GCD(a, b)
          </strong>
        </p>

        <p>
          LCM(${formatNumber(firstNumber)}, ${formatNumber(secondNumber)})
          =
          (${formatNumber(firstNumber)} × ${formatNumber(secondNumber)})
          ÷ ${formatNumber(gcd)}
        </p>

        <p>
          <strong>
            LCM = ${formatNumber(lcm)}
          </strong>
        </p>

      </div>

      <div class="info-box">

        <h3>Multiples</h3>

        <p>
          Multiples of ${formatNumber(firstNumber)}:
          <strong>${firstPreview}</strong>
        </p>

        <p>
          Multiples of ${formatNumber(secondNumber)}:
          <strong>${secondPreview}</strong>
        </p>

        <p>
          The first positive multiple shared by both numbers is
          <strong>${formatNumber(lcm)}</strong>.
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

  calculateButton.addEventListener("click", calculateLcmResult);

  resetButton.addEventListener("click", resetCalculator);

  firstInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateLcmResult();
    }
  });

  secondInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      calculateLcmResult();
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