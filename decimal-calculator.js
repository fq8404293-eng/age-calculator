document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const number1Input = document.getElementById("decimal-number-1");
  const number2Input = document.getElementById("decimal-number-2");
  const operationInput = document.getElementById("decimal-operation");
  const secondNumberGroup = document.getElementById("second-decimal-group");

  const calculateButton = document.getElementById("calculate-decimal");
  const resetButton = document.getElementById("reset-decimal");

  const errorBox = document.getElementById("decimal-error");
  const resultBox = document.getElementById("decimal-result");

  const equation = document.getElementById("decimal-equation");
  const resultValue = document.getElementById("decimal-result-value");
  const fractionResult = document.getElementById("decimal-fraction");
  const percentageResult = document.getElementById("decimal-percentage");

  const onesResult = document.getElementById("decimal-ones");
  const tenthsResult = document.getElementById("decimal-tenths");
  const hundredthsResult = document.getElementById("decimal-hundredths");
  const thousandthsResult = document.getElementById("decimal-thousandths");

  if (
    !number1Input ||
    !number2Input ||
    !operationInput ||
    !calculateButton ||
    !resetButton
  ) {
    return;
  }


  /* --------------------------------------------------
     Greatest Common Divisor
  -------------------------------------------------- */

  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);

    while (b !== 0) {
      const remainder = a % b;
      a = b;
      b = remainder;
    }

    return a;
  }


  /* --------------------------------------------------
     Decimal Formatting
  -------------------------------------------------- */

  function formatNumber(value, maximumFractionDigits = 12) {
    if (!Number.isFinite(value)) {
      return "Error";
    }

    if (Math.abs(value) < 1e-12) {
      value = 0;
    }

    return value.toLocaleString("en-US", {
      useGrouping: false,
      maximumFractionDigits
    });
  }


  /* --------------------------------------------------
     Convert Decimal to Fraction
  -------------------------------------------------- */

  function decimalToFraction(value) {
    if (!Number.isFinite(value)) {
      throw new Error("Invalid decimal number.");
    }

    if (value === 0) {
      return {
        numerator: 0,
        denominator: 1
      };
    }

    const negative = value < 0;
    const absoluteValue = Math.abs(value);

    /*
      Convert the decimal into a string so that the
      number of decimal places can be determined
      without relying directly on floating-point
      arithmetic.
    */

    const decimalString = absoluteValue.toString();

    let numerator;
    let denominator;

    if (decimalString.includes("e")) {
      /*
        Handle scientific notation such as
        1e-7 or 2.5e-6.
      */

      const parts = decimalString.split("e");

      const coefficient = parts[0];
      const exponent = Number(parts[1]);

      const coefficientParts = coefficient.split(".");

      const wholePart = coefficientParts[0];
      const fractionalPart = coefficientParts[1] || "";

      const digits = wholePart + fractionalPart;

      const decimalPlaces =
        fractionalPart.length - exponent;

      if (decimalPlaces <= 0) {
        numerator =
          Number(digits) *
          Math.pow(10, -decimalPlaces);

        denominator = 1;
      } else {
        numerator = Number(digits);
        denominator = Math.pow(10, decimalPlaces);
      }

    } else if (decimalString.includes(".")) {

      const parts = decimalString.split(".");

      const wholePart = parts[0];
      const fractionalPart = parts[1];

      const decimalPlaces = fractionalPart.length;

      denominator = Math.pow(10, decimalPlaces);

      numerator =
        Number(wholePart) * denominator +
        Number(fractionalPart);

    } else {

      numerator = Number(decimalString);
      denominator = 1;

    }

    const divisor = gcd(numerator, denominator);

    numerator /= divisor;
    denominator /= divisor;

    if (negative) {
      numerator *= -1;
    }

    return {
      numerator,
      denominator
    };
  }


  /* --------------------------------------------------
     Fraction Formatting
  -------------------------------------------------- */

  function fractionToString(fraction) {
    if (fraction.denominator === 1) {
      return String(fraction.numerator);
    }

    return `${fraction.numerator}/${fraction.denominator}`;
  }


  /* --------------------------------------------------
     Decimal Place Values
  -------------------------------------------------- */

  function updatePlaceValues(value) {
    const absoluteString = Math.abs(value).toString();

    let integerPart = absoluteString;
    let decimalPart = "";

    if (absoluteString.includes(".")) {
      const parts = absoluteString.split(".");
      integerPart = parts[0];
      decimalPart = parts[1];
    }

    /*
      Ones digit.
    */

    const onesDigit =
      integerPart.charAt(integerPart.length - 1);

    onesResult.textContent =
      onesDigit || "0";


    /*
      Tenths, hundredths and thousandths.
    */

    tenthsResult.textContent =
      decimalPart.charAt(0) || "0";

    hundredthsResult.textContent =
      decimalPart.charAt(1) || "0";

    thousandthsResult.textContent =
      decimalPart.charAt(2) || "0";
  }


  /* --------------------------------------------------
     Operation Symbol
  -------------------------------------------------- */

  function getOperationSymbol() {
    switch (operationInput.value) {
      case "add":
        return "+";

      case "subtract":
        return "−";

      case "multiply":
        return "×";

      case "divide":
        return "÷";

      default:
        return "";
    }
  }


  /* --------------------------------------------------
     Show / Hide Second Number
  -------------------------------------------------- */

  function updateOperationUI() {
    const isConversion =
      operationInput.value === "convert";

    secondNumberGroup.hidden = isConversion;

    number2Input.disabled = isConversion;
  }


  operationInput.addEventListener(
    "change",
    updateOperationUI
  );


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
     Validate Input
  -------------------------------------------------- */

  function getNumber(input, label) {
    const value = input.value.trim();

    if (value === "") {
      throw new Error(`Please enter ${label}.`);
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
      throw new Error(`Please enter a valid ${label}.`);
    }

    return number;
  }


  /* --------------------------------------------------
     Calculate
  -------------------------------------------------- */

  function calculate() {
    clearError();

    try {
      const number1 =
        getNumber(number1Input, "the first number");

      let result;

      /*
        Conversion mode
      */

      if (operationInput.value === "convert") {

        result = number1;

      } else {

        const number2 =
          getNumber(number2Input, "the second number");

        switch (operationInput.value) {

          case "add":
            result = number1 + number2;
            break;

          case "subtract":
            result = number1 - number2;
            break;

          case "multiply":
            result = number1 * number2;
            break;

          case "divide":

            if (number2 === 0) {
              throw new Error(
                "Cannot divide by zero."
              );
            }

            result = number1 / number2;
            break;

          default:
            throw new Error(
              "Please select a valid operation."
            );
        }
      }


      if (!Number.isFinite(result)) {
        throw new Error(
          "The calculation produced an invalid result."
        );
      }


      /* ----------------------------------------------
         Conversion values
      ---------------------------------------------- */

      const fraction =
        decimalToFraction(result);

      const percentage =
        result * 100;


      /* ----------------------------------------------
         Equation
      ---------------------------------------------- */

      if (operationInput.value === "convert") {

        equation.textContent =
          `${formatNumber(result)} = ${fractionToString(fraction)} = ${formatNumber(percentage)}%`;

      } else {

        const symbol =
          getOperationSymbol();

        equation.textContent =
          `${formatNumber(number1)} ${symbol} ${formatNumber(getNumber(number2Input, "the second number"))} = ${formatNumber(result)}`;
      }


      /* ----------------------------------------------
         Results
      ---------------------------------------------- */

      resultValue.textContent =
        formatNumber(result);

      fractionResult.textContent =
        fractionToString(fraction);

      percentageResult.textContent =
        `${formatNumber(percentage)}%`;


      /* ----------------------------------------------
         Decimal places
      ---------------------------------------------- */

      updatePlaceValues(result);


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
        "Unable to complete the calculation."
      );

    }
  }


  /* --------------------------------------------------
     Reset
  -------------------------------------------------- */

  function resetCalculator() {

    number1Input.value = "";
    number2Input.value = "";

    operationInput.value = "add";

    updateOperationUI();

    clearError();

    resultBox.hidden = true;

    onesResult.textContent = "—";
    tenthsResult.textContent = "—";
    hundredthsResult.textContent = "—";
    thousandthsResult.textContent = "—";

    number1Input.focus();
  }


  /* --------------------------------------------------
     Button Events
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

  [
    number1Input,
    number2Input
  ].forEach(input => {

    input.addEventListener(
      "keydown",
      event => {

        if (event.key === "Enter") {
          event.preventDefault();
          calculate();
        }

      }
    );

  });


  /* --------------------------------------------------
     Clear Errors When Typing
  -------------------------------------------------- */

  [
    number1Input,
    number2Input
  ].forEach(input => {

    input.addEventListener(
      "input",
      clearError
    );

  });


  /* --------------------------------------------------
     Initial State
  -------------------------------------------------- */

  updateOperationUI();

});