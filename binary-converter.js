"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("binary-converter-form");
  const conversionType = document.getElementById("conversion-type");
  const input = document.getElementById("binary-input");
  const inputLabel = document.getElementById("binary-input-label");
  const inputHelp = document.getElementById("binary-input-help");
  const inputError = document.getElementById("binary-input-error");

  const resultSection = document.getElementById("binary-result");
  const resultValue = document.getElementById("binary-result-value");

  const summaryConversion = document.getElementById(
    "summary-binary-conversion"
  );
  const summaryInput = document.getElementById(
    "summary-binary-input"
  );
  const summaryOutput = document.getElementById(
    "summary-binary-output"
  );

  const copyButton = document.getElementById("copy-binary-result");
  const copyStatus = document.getElementById("binary-copy-status");
  const clearButton = document.getElementById("clear-binary");

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

  const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;

  function updateInputMode() {
    const type = conversionType.value;

    clearError();

    input.value = "";
    resultSection.hidden = true;
    copyStatus.hidden = true;

    if (type === "binary-to-decimal") {
      inputLabel.textContent = "Binary Number";
      input.placeholder = "Example: 101101";
      input.inputMode = "numeric";
      inputHelp.textContent =
        "Enter a binary number using only 0 and 1.";
    } else {
      inputLabel.textContent = "Decimal Number";
      input.placeholder = "Example: 45";
      input.inputMode = "numeric";
      inputHelp.textContent =
        "Enter a non-negative whole number.";
    }

    input.focus();
  }

  function showError(message) {
    inputError.textContent = message;
    inputError.hidden = false;
    input.setAttribute("aria-invalid", "true");
  }

  function clearError() {
    inputError.textContent = "";
    inputError.hidden = true;
    input.removeAttribute("aria-invalid");
  }

  function normalizeInput(value) {
    return value.trim().replace(/\s+/g, "");
  }

  function binaryToDecimal(binary) {
    /*
      Using BigInt avoids precision problems for long binary strings.
      We validate the final decimal value against JavaScript's safe
      integer range before displaying it.
    */
    const decimal = BigInt("0b" + binary);

    if (decimal > BigInt(MAX_SAFE_INTEGER)) {
      throw new Error(
        "This number is too large to be safely represented as a decimal number."
      );
    }

    return decimal.toString(10);
  }

  function decimalToBinary(decimal) {
    const number = BigInt(decimal);

    return number.toString(2);
  }

  function validateBinary(value) {
    if (value === "") {
      return "Please enter a binary number.";
    }

    if (!/^[01]+$/.test(value)) {
      return "Binary numbers can contain only 0 and 1.";
    }

    return "";
  }

  function validateDecimal(value) {
    if (value === "") {
      return "Please enter a decimal number.";
    }

    if (!/^\d+$/.test(value)) {
      return "Please enter a non-negative whole number.";
    }

    try {
      const number = BigInt(value);

      if (number > BigInt(MAX_SAFE_INTEGER)) {
        return (
          "Please enter a decimal number up to " +
          MAX_SAFE_INTEGER.toLocaleString("en-US") +
          "."
        );
      }
    } catch (error) {
      return "Please enter a valid decimal number.";
    }

    return "";
  }

  function formatDecimal(value) {
    return Number(value).toLocaleString("en-US");
  }

  function performConversion(event) {
    event.preventDefault();

    clearError();
    copyStatus.hidden = true;

    const type = conversionType.value;
    const rawValue = input.value.trim();

    if (type === "binary-to-decimal") {
      const validationError = validateBinary(rawValue);

      if (validationError) {
        showError(validationError);
        resultSection.hidden = true;
        return;
      }

      try {
        const decimalResult = binaryToDecimal(rawValue);

        resultValue.textContent = formatDecimal(decimalResult);

        summaryConversion.textContent = "Binary → Decimal";
        summaryInput.textContent = rawValue;
        summaryOutput.textContent = formatDecimal(decimalResult);

        resultSection.hidden = false;

        resultSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      } catch (error) {
        showError(
          error.message ||
          "Unable to convert this binary number."
        );
        resultSection.hidden = true;
      }

      return;
    }

    const validationError = validateDecimal(rawValue);

    if (validationError) {
      showError(validationError);
      resultSection.hidden = true;
      return;
    }

    try {
      const binaryResult = decimalToBinary(rawValue);

      resultValue.textContent = binaryResult;

      summaryConversion.textContent = "Decimal → Binary";
      summaryInput.textContent = formatDecimal(rawValue);
      summaryOutput.textContent = binaryResult;

      resultSection.hidden = false;

      resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    } catch (error) {
      showError(
        "Unable to convert this decimal number."
      );
      resultSection.hidden = true;
    }
  }

  async function copyResult() {
    const value = resultValue.textContent.trim();

    if (!value || value === "—") {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);

      copyStatus.textContent = "Result copied to clipboard.";
      copyStatus.hidden = false;
    } catch (error) {
      /*
        Fallback for browsers where Clipboard API is unavailable.
      */
      const temporaryInput = document.createElement("textarea");

      temporaryInput.value = value;
      temporaryInput.setAttribute("readonly", "");
      temporaryInput.style.position = "fixed";
      temporaryInput.style.opacity = "0";

      document.body.appendChild(temporaryInput);

      temporaryInput.select();

      let copied = false;

      try {
        copied = document.execCommand("copy");
      } catch (fallbackError) {
        copied = false;
      }

      document.body.removeChild(temporaryInput);

      if (copied) {
        copyStatus.textContent = "Result copied to clipboard.";
      } else {
        copyStatus.textContent =
          "Copy failed. Please select and copy the result manually.";
      }

      copyStatus.hidden = false;
    }
  }

  function clearCalculator() {
    input.value = "";

    clearError();

    resultSection.hidden = true;

    resultValue.textContent = "—";
    summaryConversion.textContent = "—";
    summaryInput.textContent = "—";
    summaryOutput.textContent = "—";

    copyStatus.hidden = true;
    copyStatus.textContent = "Result copied to clipboard.";

    input.focus();
  }

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

  input.addEventListener("input", () => {
    clearError();
    copyStatus.hidden = true;
  });

  updateInputMode();
});