"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById(
    "roman-numeral-converter-form"
  );

  const conversionType = document.getElementById(
    "conversion-type"
  );

  const input = document.getElementById(
    "roman-input"
  );

  const inputLabel = document.getElementById(
    "roman-input-label"
  );

  const inputHelp = document.getElementById(
    "roman-input-help"
  );

  const inputError = document.getElementById(
    "roman-input-error"
  );

  const resultSection = document.getElementById(
    "roman-result"
  );

  const resultValue = document.getElementById(
    "roman-result-value"
  );

  const summaryConversion = document.getElementById(
    "summary-roman-conversion"
  );

  const summaryInput = document.getElementById(
    "summary-roman-input"
  );

  const summaryOutput = document.getElementById(
    "summary-roman-output"
  );

  const copyButton = document.getElementById(
    "copy-roman-result"
  );

  const copyStatus = document.getElementById(
    "roman-copy-status"
  );

  const clearButton = document.getElementById(
    "clear-roman"
  );

  if (
    !form ||
    !conversionType ||
    !input ||
    !inputLabel ||
    !inputHelp ||
    !inputError ||
    !resultSection ||
    !resultValue ||
    !summaryConversion ||
    !summaryInput ||
    !summaryOutput ||
    !copyButton ||
    !copyStatus ||
    !clearButton
  ) {
    return;
  }

  /*
   * Standard Roman numeral values.
   */
  const romanValues = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000
  };

  /*
   * Standard Roman numeral combinations.
   */
  const romanMap = [
    { value: 1000, symbol: "M" },
    { value: 900, symbol: "CM" },
    { value: 500, symbol: "D" },
    { value: 400, symbol: "CD" },
    { value: 100, symbol: "C" },
    { value: 90, symbol: "XC" },
    { value: 50, symbol: "L" },
    { value: 40, symbol: "XL" },
    { value: 10, symbol: "X" },
    { value: 9, symbol: "IX" },
    { value: 5, symbol: "V" },
    { value: 4, symbol: "IV" },
    { value: 1, symbol: "I" }
  ];

  /*
   * Updates the input field depending on the selected conversion.
   */
  function updateInputMode() {
    const type = conversionType.value;

    clearError();

    input.value = "";
    resultSection.hidden = true;
    copyStatus.hidden = true;

    if (type === "number-to-roman") {
      inputLabel.textContent = "Number";

      input.placeholder = "Example: 2026";

      input.inputMode = "numeric";

      inputHelp.textContent =
        "Enter a whole number from 1 to 3,999.";
    } else {
      inputLabel.textContent = "Roman Numeral";

      input.placeholder = "Example: MMXXVI";

      input.inputMode = "text";

      inputHelp.textContent =
        "Enter a valid Roman numeral from I to MMMCMXCIX.";
    }

    input.focus();
  }

  /*
   * Displays an error message.
   */
  function showError(message) {
    inputError.textContent = message;
    inputError.hidden = false;

    input.setAttribute(
      "aria-invalid",
      "true"
    );
  }

  /*
   * Clears the current error.
   */
  function clearError() {
    inputError.textContent = "";
    inputError.hidden = true;

    input.removeAttribute(
      "aria-invalid"
    );
  }

  /*
   * Converts a positive integer to a standard Roman numeral.
   */
  function numberToRoman(number) {
    let remaining = number;
    let result = "";

    for (const item of romanMap) {
      while (remaining >= item.value) {
        result += item.symbol;
        remaining -= item.value;
      }
    }

    return result;
  }

  /*
   * Converts a valid Roman numeral into a number.
   */
  function romanToNumber(roman) {
    let total = 0;

    for (let i = 0; i < roman.length; i++) {
      const current = romanValues[roman[i]];
      const next =
        i + 1 < roman.length
          ? romanValues[roman[i + 1]]
          : 0;

      if (current < next) {
        total -= current;
      } else {
        total += current;
      }
    }

    return total;
  }

  /*
   * Validates a Roman numeral by converting it to a number
   * and converting that number back to the canonical form.
   *
   * This rejects invalid forms such as:
   * IIII
   * IL
   * IC
   * XD
   * VX
   * IIX
   */
  function validateRomanNumeral(value) {
    if (value === "") {
      return "Please enter a Roman numeral.";
    }

    const normalized = value.toUpperCase();

    if (!/^[IVXLCDM]+$/.test(normalized)) {
      return (
        "Roman numerals can contain only " +
        "I, V, X, L, C, D, and M."
      );
    }

    const numericValue =
      romanToNumber(normalized);

    if (
      numericValue < 1 ||
      numericValue > 3999
    ) {
      return (
        "Please enter a Roman numeral representing " +
        "a number from 1 to 3,999."
      );
    }

    const canonical =
      numberToRoman(numericValue);

    if (canonical !== normalized) {
      return (
        "Please enter a valid standard Roman numeral."
      );
    }

    return "";
  }

  /*
   * Validates a number for Number → Roman conversion.
   */
  function validateNumber(value) {
    if (value === "") {
      return "Please enter a number.";
    }

    if (!/^\d+$/.test(value)) {
      return (
        "Please enter a positive whole number."
      );
    }

    const number = Number(value);

    if (!Number.isSafeInteger(number)) {
      return (
        "Please enter a valid whole number."
      );
    }

    if (number < 1 || number > 3999) {
      return (
        "Please enter a whole number from 1 to 3,999."
      );
    }

    return "";
  }

  /*
   * Performs the selected conversion.
   */
  function performConversion(event) {
    event.preventDefault();

    clearError();
    copyStatus.hidden = true;

    const type = conversionType.value;

    const rawValue =
      input.value.trim();

    /*
     * Number → Roman
     */
    if (type === "number-to-roman") {
      const validationError =
        validateNumber(rawValue);

      if (validationError) {
        showError(validationError);
        resultSection.hidden = true;
        return;
      }

      const number =
        Number(rawValue);

      const roman =
        numberToRoman(number);

      resultValue.textContent =
        roman;

      summaryConversion.textContent =
        "Number → Roman Numeral";

      summaryInput.textContent =
        number.toLocaleString("en-US");

      summaryOutput.textContent =
        roman;

      resultSection.hidden = false;

      resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      return;
    }

    /*
     * Roman → Number
     */
    const normalized =
      rawValue.toUpperCase();

    const validationError =
      validateRomanNumeral(normalized);

    if (validationError) {
      showError(validationError);
      resultSection.hidden = true;
      return;
    }

    const number =
      romanToNumber(normalized);

    resultValue.textContent =
      number.toLocaleString("en-US");

    summaryConversion.textContent =
      "Roman Numeral → Number";

    summaryInput.textContent =
      normalized;

    summaryOutput.textContent =
      number.toLocaleString("en-US");

    resultSection.hidden = false;

    resultSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  /*
   * Copies the displayed result.
   */
  async function copyResult() {
    const value =
      resultValue.textContent.trim();

    if (!value || value === "—") {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        value
      );

      copyStatus.textContent =
        "Result copied to clipboard.";

      copyStatus.hidden = false;
    } catch (error) {
      /*
       * Fallback for browsers where
       * Clipboard API is unavailable.
       */
      const temporaryInput =
        document.createElement("textarea");

      temporaryInput.value = value;

      temporaryInput.setAttribute(
        "readonly",
        ""
      );

      temporaryInput.style.position =
        "fixed";

      temporaryInput.style.opacity =
        "0";

      document.body.appendChild(
        temporaryInput
      );

      temporaryInput.select();

      let copied = false;

      try {
        copied =
          document.execCommand("copy");
      } catch (fallbackError) {
        copied = false;
      }

      document.body.removeChild(
        temporaryInput
      );

      if (copied) {
        copyStatus.textContent =
          "Result copied to clipboard.";
      } else {
        copyStatus.textContent =
          "Copy failed. Please select and copy the result manually.";
      }

      copyStatus.hidden = false;
    }
  }

  /*
   * Resets the calculator.
   */
  function clearCalculator() {
    input.value = "";

    clearError();

    resultSection.hidden = true;

    resultValue.textContent = "—";

    summaryConversion.textContent = "—";
    summaryInput.textContent = "—";
    summaryOutput.textContent = "—";

    copyStatus.hidden = true;

    copyStatus.textContent =
      "Result copied to clipboard.";

    input.focus();
  }

  /*
   * Event listeners.
   */
  conversionType.addEventListener(
    "change",
    updateInputMode
  );

  form.addEventListener(
    "submit",
    performConversion
  );

  copyButton.addEventListener(
    "click",
    copyResult
  );

  clearButton.addEventListener(
    "click",
    clearCalculator
  );

  input.addEventListener(
    "input",
    () => {
      clearError();
      copyStatus.hidden = true;
    }
  );

  /*
   * Initialize the calculator.
   */
  updateInputMode();
});