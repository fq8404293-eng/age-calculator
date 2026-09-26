"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("hexadecimal-converter-form");
  const conversionType = document.getElementById("conversion-type");
  const input = document.getElementById("hexadecimal-input");
  const inputLabel = document.getElementById("hexadecimal-input-label");
  const inputHelp = document.getElementById("hexadecimal-input-help");
  const inputError = document.getElementById("hexadecimal-input-error");

  const resultSection = document.getElementById("hexadecimal-result");
  const resultValue = document.getElementById(
    "hexadecimal-result-value"
  );

  const summaryConversion = document.getElementById(
    "summary-hexadecimal-conversion"
  );

  const summaryInput = document.getElementById(
    "summary-hexadecimal-input"
  );

  const summaryOutput = document.getElementById(
    "summary-hexadecimal-output"
  );

  const copyButton = document.getElementById(
    "copy-hexadecimal-result"
  );

  const copyStatus = document.getElementById(
    "hexadecimal-copy-status"
  );

  const clearButton = document.getElementById(
    "clear-hexadecimal"
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

  const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;

  function updateInputMode() {
    const type = conversionType.value;

    clearError();

    input.value = "";
    resultSection.hidden = true;
    copyStatus.hidden = true;

    if (type === "hex-to-decimal") {
      inputLabel.textContent = "Hexadecimal Number";
      input.placeholder = "Example: 2F";
      input.inputMode = "text";

      inputHelp.textContent =
        "Enter a hexadecimal number using 0–9 and A–F.";
    } else {
      inputLabel.textContent = "Decimal Number";
      input.placeholder = "Example: 47";
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

  function validateHexadecimal(value) {
    if (value === "") {
      return "Please enter a hexadecimal number.";
    }

    if (!/^[0-9a-fA-F]+$/.test(value)) {
      return "Hexadecimal numbers can contain only 0–9 and A–F.";
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

  function hexadecimalToDecimal(hexadecimal) {
    const decimal = BigInt("0x" + hexadecimal);

    if (decimal > BigInt(MAX_SAFE_INTEGER)) {
      throw new Error(
        "This hexadecimal number is too large to safely display as a decimal number."
      );
    }

    return decimal.toString(10);
  }

  function decimalToHexadecimal(decimal) {
    const number = BigInt(decimal);

    return number.toString(16).toUpperCase();
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

    if (type === "hex-to-decimal") {
      const validationError = validateHexadecimal(rawValue);

      if (validationError) {
        showError(validationError);
        resultSection.hidden = true;
        return;
      }

      try {
        const decimalResult =
          hexadecimalToDecimal(rawValue);

        resultValue.textContent =
          formatDecimal(decimalResult);

        summaryConversion.textContent =
          "Hexadecimal → Decimal";

        summaryInput.textContent =
          rawValue.toUpperCase();

        summaryOutput.textContent =
          formatDecimal(decimalResult);

        resultSection.hidden = false;

        resultSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      } catch (error) {
        showError(
          error.message ||
          "Unable to convert this hexadecimal number."
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
      const hexadecimalResult =
        decimalToHexadecimal(rawValue);

      resultValue.textContent =
        hexadecimalResult;

      summaryConversion.textContent =
        "Decimal → Hexadecimal";

      summaryInput.textContent =
        formatDecimal(rawValue);

      summaryOutput.textContent =
        hexadecimalResult;

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

      copyStatus.textContent =
        "Result copied to clipboard.";

      copyStatus.hidden = false;
    } catch (error) {
      const temporaryInput =
        document.createElement("textarea");

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
        copyStatus.textContent =
          "Result copied to clipboard.";
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
    copyStatus.textContent =
      "Result copied to clipboard.";

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