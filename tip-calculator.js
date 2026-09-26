"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tip-calculator-form");

  const billAmount = document.getElementById("bill-amount");
  const tipPercentage = document.getElementById("tip-percentage");
  const numberOfPeople = document.getElementById("number-of-people");

  const billError = document.getElementById("bill-amount-error");
  const tipError = document.getElementById("tip-percentage-error");
  const peopleError = document.getElementById("number-of-people-error");

  const resultSection = document.getElementById("tip-result");

  const tipAmountResult = document.getElementById(
    "summary-tip-amount"
  );

  const totalBillResult = document.getElementById(
    "summary-total-bill"
  );

  const perPersonResult = document.getElementById(
    "summary-per-person"
  );

  const tipPerPersonResult = document.getElementById(
    "summary-tip-per-person"
  );

  const resultValue = document.getElementById(
    "tip-result-value"
  );

  const copyButton = document.getElementById(
    "copy-tip-result"
  );

  const copyStatus = document.getElementById(
    "tip-copy-status"
  );

  const clearButton = document.getElementById(
    "clear-tip"
  );

  if (
    !form ||
    !billAmount ||
    !tipPercentage ||
    !numberOfPeople ||
    !billError ||
    !tipError ||
    !peopleError ||
    !resultSection ||
    !tipAmountResult ||
    !totalBillResult ||
    !perPersonResult ||
    !tipPerPersonResult ||
    !resultValue ||
    !copyButton ||
    !copyStatus ||
    !clearButton
  ) {
    return;
  }

  function showError(element, message, input) {
    element.textContent = message;
    element.hidden = false;

    input.setAttribute("aria-invalid", "true");
  }

  function clearError(element, input) {
    element.textContent = "";
    element.hidden = true;

    input.removeAttribute("aria-invalid");
  }

  function clearAllErrors() {
    clearError(billError, billAmount);
    clearError(tipError, tipPercentage);
    clearError(peopleError, numberOfPeople);
  }

  function formatMoney(value) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function calculateTip(event) {
    event.preventDefault();

    clearAllErrors();
    copyStatus.hidden = true;

    const bill = Number(billAmount.value);
    const tipPercent = Number(tipPercentage.value);
    const people = Number(numberOfPeople.value);

    let hasError = false;

    /*
     * Validate bill amount.
     */
    if (
      billAmount.value.trim() === "" ||
      !Number.isFinite(bill)
    ) {
      showError(
        billError,
        "Please enter a valid bill amount.",
        billAmount
      );

      hasError = true;
    } else if (bill < 0) {
      showError(
        billError,
        "Bill amount cannot be negative.",
        billAmount
      );

      hasError = true;
    }

    /*
     * Validate tip percentage.
     */
    if (
      tipPercentage.value.trim() === "" ||
      !Number.isFinite(tipPercent)
    ) {
      showError(
        tipError,
        "Please enter a valid tip percentage.",
        tipPercentage
      );

      hasError = true;
    } else if (tipPercent < 0 || tipPercent > 100) {
      showError(
        tipError,
        "Tip percentage must be between 0% and 100%.",
        tipPercentage
      );

      hasError = true;
    }

    /*
     * Validate number of people.
     */
    if (
      numberOfPeople.value.trim() === "" ||
      !Number.isFinite(people)
    ) {
      showError(
        peopleError,
        "Please enter the number of people.",
        numberOfPeople
      );

      hasError = true;
    } else if (
      !Number.isInteger(people) ||
      people < 1 ||
      people > 1000
    ) {
      showError(
        peopleError,
        "Number of people must be a whole number from 1 to 1,000.",
        numberOfPeople
      );

      hasError = true;
    }

    if (hasError) {
      resultSection.hidden = true;
      return;
    }

    /*
     * Calculate the tip.
     */
    const tipAmount =
      bill * (tipPercent / 100);

    /*
     * Calculate the total bill.
     */
    const totalBill =
      bill + tipAmount;

    /*
     * Calculate per-person amounts.
     */
    const tipPerPerson =
      tipAmount / people;

    const totalPerPerson =
      totalBill / people;

    /*
     * Display results.
     */
    tipAmountResult.textContent =
      formatMoney(tipAmount);

    totalBillResult.textContent =
      formatMoney(totalBill);

    perPersonResult.textContent =
      formatMoney(totalPerPerson);

    tipPerPersonResult.textContent =
      formatMoney(tipPerPerson);

    resultValue.textContent =
      formatMoney(totalBill);

    resultSection.hidden = false;

    resultSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  async function copyResult() {
    const value =
      resultValue.textContent.trim();

    if (!value || value === "—") {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);

      copyStatus.textContent =
        "Result copied to clipboard.";

      copyStatus.hidden = false;
    } catch (error) {
      /*
       * Clipboard fallback.
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

  function clearCalculator() {
    billAmount.value = "";
    tipPercentage.value = "15";
    numberOfPeople.value = "1";

    clearAllErrors();

    resultSection.hidden = true;

    tipAmountResult.textContent = "—";
    totalBillResult.textContent = "—";
    perPersonResult.textContent = "—";
    tipPerPersonResult.textContent = "—";
    resultValue.textContent = "—";

    copyStatus.hidden = true;
    copyStatus.textContent =
      "Result copied to clipboard.";

    billAmount.focus();
  }

  /*
   * Clear individual errors when the user edits a field.
   */
  billAmount.addEventListener("input", () => {
    clearError(billError, billAmount);
    copyStatus.hidden = true;
  });

  tipPercentage.addEventListener("input", () => {
    clearError(tipError, tipPercentage);
    copyStatus.hidden = true;
  });

  numberOfPeople.addEventListener("input", () => {
    clearError(peopleError, numberOfPeople);
    copyStatus.hidden = true;
  });

  form.addEventListener(
    "submit",
    calculateTip
  );

  copyButton.addEventListener(
    "click",
    copyResult
  );

  clearButton.addEventListener(
    "click",
    clearCalculator
  );
});