document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const baseInput = document.getElementById("exponent-base");
  const powerInput = document.getElementById("exponent-power");

  const preview = document.getElementById("exponent-preview");

  const calculateButton =
    document.getElementById("calculate-exponent");

  const resetButton =
    document.getElementById("reset-exponent");

  const errorBox =
    document.getElementById("exponent-error");

  const resultBox =
    document.getElementById("exponent-result");

  const equation =
    document.getElementById("exponent-equation");

  const resultValue =
    document.getElementById("exponent-result-value");

  const baseResult =
    document.getElementById("exponent-base-result");

  const powerResult =
    document.getElementById("exponent-power-result");

  const calculationText =
    document.getElementById("exponent-calculation-text");


  if (
    !baseInput ||
    !powerInput ||
    !preview ||
    !calculateButton ||
    !resetButton
  ) {
    return;
  }


  /* --------------------------------------------------
     Formatting
  -------------------------------------------------- */

  function formatNumber(value) {
    if (!Number.isFinite(value)) {
      return "Error";
    }

    if (Math.abs(value) < 1e-12) {
      value = 0;
    }

    return value.toLocaleString("en-US", {
      useGrouping: false,
      maximumFractionDigits: 12
    });
  }


  function formatInputNumber(value) {
    return formatNumber(value);
  }


  /* --------------------------------------------------
     Preview
  -------------------------------------------------- */

  function updatePreview() {
    const baseText = baseInput.value.trim();
    const powerText = powerInput.value.trim();

    if (baseText === "" || powerText === "") {
      preview.textContent =
        "Enter values to see the expression.";

      return;
    }

    const base = Number(baseText);
    const power = Number(powerText);

    if (
      !Number.isFinite(base) ||
      !Number.isFinite(power)
    ) {
      preview.textContent =
        "Enter valid numbers to see the expression.";

      return;
    }

    preview.innerHTML =
      `${formatInputNumber(base)}<sup>${formatInputNumber(power)}</sup>`;
  }


  /* --------------------------------------------------
     Error Handling
  -------------------------------------------------- */

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
    resultBox.hidden = true;
  }


  function clearError() {
    errorBox.textContent = "";
    errorBox.hidden = true;
  }


  /* --------------------------------------------------
     Validation
  -------------------------------------------------- */

  function getInputValues() {
    const baseText = baseInput.value.trim();
    const powerText = powerInput.value.trim();

    if (baseText === "") {
      throw new Error("Please enter a base.");
    }

    if (powerText === "") {
      throw new Error("Please enter an exponent.");
    }

    const base = Number(baseText);
    const power = Number(powerText);

    if (!Number.isFinite(base)) {
      throw new Error("Please enter a valid base.");
    }

    if (!Number.isFinite(power)) {
      throw new Error("Please enter a valid exponent.");
    }

    return {
      base,
      power
    };
  }


  /* --------------------------------------------------
     Calculate Power
  -------------------------------------------------- */

  function calculatePower(base, power) {
    /*
      Math.pow handles:
      positive exponents
      zero exponents
      negative exponents
      fractional exponents
    */

    const result = Math.pow(base, power);

    if (!Number.isFinite(result)) {
      throw new Error(
        "The result is too large or undefined."
      );
    }

    /*
      Negative bases with non-integer exponents
      produce NaN in real-number arithmetic.
    */

    if (Number.isNaN(result)) {
      throw new Error(
        "This expression does not have a real-number result."
      );
    }

    return result;
  }


  /* --------------------------------------------------
     Calculation Explanation
  -------------------------------------------------- */

  function getCalculationExplanation(base, power, result) {

    if (power === 0 && base !== 0) {
      return `${formatNumber(base)} raised to the power of 0 equals 1.`;
    }


    if (power === 1) {
      return `${formatNumber(base)} raised to the power of 1 equals ${formatNumber(result)}.`;
    }


    if (Number.isInteger(power) && power > 1) {

      const terms = [];

      /*
        Avoid creating an extremely long explanation
        for very large exponents.
      */

      if (power <= 12) {

        for (let i = 0; i < power; i++) {
          terms.push(formatNumber(base));
        }

        return `${formatNumber(base)} × ${terms
          .slice(1)
          .join(" × ")} = ${formatNumber(result)}`;

      }

      return `${formatNumber(base)} is multiplied by itself ${power} times to give ${formatNumber(result)}.`;
    }


    if (Number.isInteger(power) && power < 0) {

      const positivePower = Math.abs(power);

      return `${formatNumber(base)} raised to the negative power ${formatNumber(power)} equals 1 ÷ ${formatNumber(base)}^${positivePower} = ${formatNumber(result)}.`;
    }


    return `${formatNumber(base)} raised to the power ${formatNumber(power)} equals ${formatNumber(result)}.`;
  }


  /* --------------------------------------------------
     Calculate
  -------------------------------------------------- */

  function calculate() {
    clearError();

    try {

      const {
        base,
        power
      } = getInputValues();


      /*
        Special mathematical case:
        0^0 is generally treated as undefined
        in this calculator rather than returning 1.
      */

      if (base === 0 && power === 0) {
        throw new Error(
          "0⁰ is undefined in this calculator."
        );
      }


      const result =
        calculatePower(base, power);


      if (!Number.isFinite(result)) {
        throw new Error(
          "The result is outside the supported range."
        );
      }


      /* ----------------------------------------------
         Result expression
      ---------------------------------------------- */

      equation.innerHTML =
        `${formatNumber(base)}<sup>${formatNumber(power)}</sup> = ${formatNumber(result)}`;


      /* ----------------------------------------------
         Result values
      ---------------------------------------------- */

      resultValue.textContent =
        formatNumber(result);

      baseResult.textContent =
        formatNumber(base);

      powerResult.textContent =
        formatNumber(power);


      /* ----------------------------------------------
         Explanation
      ---------------------------------------------- */

      calculationText.textContent =
        getCalculationExplanation(
          base,
          power,
          result
        );


      /* ----------------------------------------------
         Show result
      ---------------------------------------------- */

      resultBox.hidden = false;

      resultBox.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    } catch (error) {

      showError(
        error.message ||
        "Unable to calculate the exponent."
      );

    }
  }


  /* --------------------------------------------------
     Reset
  -------------------------------------------------- */

  function resetCalculator() {

    baseInput.value = "";
    powerInput.value = "";

    preview.textContent =
      "Enter values to see the expression.";

    clearError();

    resultBox.hidden = true;

    baseInput.focus();
  }


  /* --------------------------------------------------
     Input Events
  -------------------------------------------------- */

  baseInput.addEventListener("input", () => {
    clearError();
    updatePreview();
  });


  powerInput.addEventListener("input", () => {
    clearError();
    updatePreview();
  });


  /* --------------------------------------------------
     Buttons
  -------------------------------------------------- */

  calculateButton.addEventListener(
    "click",
    calculate
  );


  resetButton.addEventListener(
    "click",
    resetCalculator
  );


  /* --------------------------------------------------
     Enter Key
  -------------------------------------------------- */

  baseInput.addEventListener(
    "keydown",
    event => {

      if (event.key === "Enter") {
        event.preventDefault();
        calculate();
      }

    }
  );


  powerInput.addEventListener(
    "keydown",
    event => {

      if (event.key === "Enter") {
        event.preventDefault();
        calculate();
      }

    }
  );


  /* --------------------------------------------------
     Initial State
  -------------------------------------------------- */

  updatePreview();

});