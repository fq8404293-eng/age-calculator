document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const numerator1 = document.getElementById("fraction1-numerator");
  const denominator1 = document.getElementById("fraction1-denominator");
  const numerator2 = document.getElementById("fraction2-numerator");
  const denominator2 = document.getElementById("fraction2-denominator");

  const operation = document.getElementById("fraction-operation");
  const calculateButton = document.getElementById("calculate-fraction");
  const resetButton = document.getElementById("reset-fraction");

  const errorBox = document.getElementById("fraction-error");
  const resultBox = document.getElementById("fraction-result");

  const equation = document.getElementById("fraction-equation");
  const simplifiedFraction = document.getElementById("simplified-fraction");
  const decimalResult = document.getElementById("decimal-result");
  const mixedNumberResult = document.getElementById("mixed-number-result");

  const resultNumerator = document.getElementById("result-numerator");
  const resultDenominator = document.getElementById("result-denominator");
  const resultGcd = document.getElementById("result-gcd");

  if (
    !numerator1 ||
    !denominator1 ||
    !numerator2 ||
    !denominator2 ||
    !operation ||
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
     Simplify Fraction
  -------------------------------------------------- */

  function simplifyFraction(numerator, denominator) {
    if (denominator === 0) {
      throw new Error("Denominator cannot be zero.");
    }

    if (numerator === 0) {
      return {
        numerator: 0,
        denominator: 1,
        gcd: Math.abs(denominator)
      };
    }

    let simplifiedNumerator = numerator;
    let simplifiedDenominator = denominator;

    /*
      Keep the denominator positive.
    */

    if (simplifiedDenominator < 0) {
      simplifiedNumerator *= -1;
      simplifiedDenominator *= -1;
    }

    const divisor = gcd(
      simplifiedNumerator,
      simplifiedDenominator
    );

    return {
      numerator: simplifiedNumerator / divisor,
      denominator: simplifiedDenominator / divisor,
      gcd: divisor
    };
  }


  /* --------------------------------------------------
     Read Fraction
  -------------------------------------------------- */

  function getFraction(numeratorInput, denominatorInput) {
    const numeratorValue = numeratorInput.value.trim();
    const denominatorValue = denominatorInput.value.trim();

    if (numeratorValue === "" || denominatorValue === "") {
      throw new Error("Please enter both the numerator and denominator.");
    }

    const numerator = Number(numeratorValue);
    const denominator = Number(denominatorValue);

    if (
      !Number.isFinite(numerator) ||
      !Number.isFinite(denominator)
    ) {
      throw new Error("Please enter valid numbers.");
    }

    if (!Number.isInteger(numerator) || !Number.isInteger(denominator)) {
      throw new Error("Numerators and denominators must be whole numbers.");
    }

    if (denominator === 0) {
      throw new Error("A denominator cannot be zero.");
    }

    return {
      numerator,
      denominator
    };
  }


  /* --------------------------------------------------
     Fraction Arithmetic
  -------------------------------------------------- */

  function addFractions(a, b) {
    return {
      numerator:
        a.numerator * b.denominator +
        b.numerator * a.denominator,

      denominator:
        a.denominator * b.denominator
    };
  }


  function subtractFractions(a, b) {
    return {
      numerator:
        a.numerator * b.denominator -
        b.numerator * a.denominator,

      denominator:
        a.denominator * b.denominator
    };
  }


  function multiplyFractions(a, b) {
    return {
      numerator:
        a.numerator * b.numerator,

      denominator:
        a.denominator * b.denominator
    };
  }


  function divideFractions(a, b) {
    if (b.numerator === 0) {
      throw new Error("Cannot divide by zero.");
    }

    return {
      numerator:
        a.numerator * b.denominator,

      denominator:
        a.denominator * b.numerator
    };
  }


  /* --------------------------------------------------
     Formatting
  -------------------------------------------------- */

  function fractionToString(fraction) {
    if (fraction.denominator === 1) {
      return String(fraction.numerator);
    }

    return `${fraction.numerator}/${fraction.denominator}`;
  }


  function decimalToString(value) {
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


  /* --------------------------------------------------
     Mixed Number
  -------------------------------------------------- */

  function mixedNumberString(numerator, denominator) {
    if (denominator === 0) {
      return "Undefined";
    }

    if (numerator === 0) {
      return "0";
    }

    const negative = numerator < 0;

    const absoluteNumerator = Math.abs(numerator);
    const absoluteDenominator = Math.abs(denominator);

    const wholeNumber = Math.floor(
      absoluteNumerator / absoluteDenominator
    );

    const remainder =
      absoluteNumerator % absoluteDenominator;

    if (remainder === 0) {
      return String(
        negative ? -wholeNumber : wholeNumber
      );
    }

    let result;

    if (wholeNumber === 0) {
      result = `${remainder}/${absoluteDenominator}`;
    } else {
      result =
        `${wholeNumber} ${remainder}/${absoluteDenominator}`;
    }

    return negative ? `−${result}` : result;
  }


  /* --------------------------------------------------
     Operation Symbol
  -------------------------------------------------- */

  function getOperationSymbol() {
    switch (operation.value) {
      case "add":
        return "+";

      case "subtract":
        return "−";

      case "multiply":
        return "×";

      case "divide":
        return "÷";

      default:
        return "+";
    }
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
     Calculate
  -------------------------------------------------- */

  function calculate() {
    clearError();

    try {
      const fractionA = getFraction(
        numerator1,
        denominator1
      );

      const fractionB = getFraction(
        numerator2,
        denominator2
      );

      let result;

      switch (operation.value) {
        case "add":
          result = addFractions(
            fractionA,
            fractionB
          );
          break;

        case "subtract":
          result = subtractFractions(
            fractionA,
            fractionB
          );
          break;

        case "multiply":
          result = multiplyFractions(
            fractionA,
            fractionB
          );
          break;

        case "divide":
          result = divideFractions(
            fractionA,
            fractionB
          );
          break;

        default:
          throw new Error("Please select an operation.");
      }

      const simplified = simplifyFraction(
        result.numerator,
        result.denominator
      );

      const decimal =
        simplified.numerator /
        simplified.denominator;

      const mixedNumber = mixedNumberString(
        simplified.numerator,
        simplified.denominator
      );

      const firstFraction =
        fractionToString(
          simplifyFraction(
            fractionA.numerator,
            fractionA.denominator
          )
        );

      const secondFraction =
        fractionToString(
          simplifyFraction(
            fractionB.numerator,
            fractionB.denominator
          )
        );

      const resultFraction =
        fractionToString(simplified);

      equation.textContent =
        `${firstFraction} ${getOperationSymbol()} ${secondFraction} = ${resultFraction}`;

      simplifiedFraction.textContent =
        resultFraction;

      decimalResult.textContent =
        decimalToString(decimal);

      mixedNumberResult.textContent =
        mixedNumber;

      resultNumerator.textContent =
        simplified.numerator;

      resultDenominator.textContent =
        simplified.denominator;

      resultGcd.textContent =
        simplified.gcd;

      resultBox.hidden = false;

      resultBox.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    } catch (error) {
      showError(
        error.message || "Unable to calculate the fraction."
      );
    }
  }


  /* --------------------------------------------------
     Reset
  -------------------------------------------------- */

  function resetCalculator() {
    numerator1.value = "";
    denominator1.value = "";
    numerator2.value = "";
    denominator2.value = "";

    operation.value = "add";

    clearError();

    resultBox.hidden = true;

    numerator1.focus();
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
    numerator1,
    denominator1,
    numerator2,
    denominator2
  ].forEach(input => {

    input.addEventListener("keydown", event => {

      if (event.key === "Enter") {
        event.preventDefault();
        calculate();
      }

    });

  });


  /* --------------------------------------------------
     Prevent Invalid Decimal Input
  -------------------------------------------------- */

  [
    numerator1,
    denominator1,
    numerator2,
    denominator2
  ].forEach(input => {

    input.addEventListener("input", () => {

      clearError();

      /*
        The HTML input already uses step="1".
        This additionally prevents accidental
        scientific notation characters.
      */

      input.value = input.value.replace(
        /[eE+]/g,
        ""
      );

    });

  });

});