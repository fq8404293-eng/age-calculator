document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("retirement-form");

  if (!form) return;

  // ------------------------------------------------------------
  // Elements
  // ------------------------------------------------------------

  const currentAgeInput = document.getElementById("current-age");
  const retirementAgeInput = document.getElementById("retirement-age");
  const currentSavingsInput = document.getElementById("current-savings");
  const monthlyContributionInput = document.getElementById("monthly-contribution");
  const annualReturnInput = document.getElementById("annual-return");
  const inflationRateInput = document.getElementById("inflation-rate");
  const desiredIncomeInput = document.getElementById("desired-income");
  const socialSecurityInput = document.getElementById("social-security");

  const resultsSection = document.getElementById("retirement-results");
  const projectionSection = document.getElementById("projection-section");

  const futureSavingsOutput = document.getElementById("future-savings");
  const totalContributionsOutput = document.getElementById("total-contributions");
  const investmentGrowthOutput = document.getElementById("investment-growth");
  const yearsUntilRetirementOutput = document.getElementById("years-until-retirement");
  const monthlyRetirementIncomeOutput = document.getElementById("monthly-retirement-income");
  const annualRetirementIncomeOutput = document.getElementById("annual-retirement-income");
  const inflationAdjustedIncomeOutput = document.getElementById("inflation-adjusted-income");
  const retirementStatusOutput = document.getElementById("retirement-status");

  const tableBody = document.getElementById("retirement-table-body");

  const copyButton = document.getElementById("copy-retirement-result");
  const clearButton = document.getElementById("clear-retirement");

  // ------------------------------------------------------------
  // Constants
  // ------------------------------------------------------------

  const WITHDRAWAL_RATE = 0.04;

  // ------------------------------------------------------------
  // Formatting helpers
  // ------------------------------------------------------------

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  }

  function formatPercentage(value) {
    return `${value.toFixed(2)}%`;
  }

  // ------------------------------------------------------------
  // Error helpers
  // ------------------------------------------------------------

  function showError(input, message) {
    const errorElement = document.getElementById(`${input.id}-error`);

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.hidden = false;
    }

    input.setAttribute("aria-invalid", "true");
  }

  function clearError(input) {
    const errorElement = document.getElementById(`${input.id}-error`);

    if (errorElement) {
      errorElement.textContent = "";
      errorElement.hidden = true;
    }

    input.removeAttribute("aria-invalid");
  }

  function clearAllErrors() {
    const inputs = [
      currentAgeInput,
      retirementAgeInput,
      currentSavingsInput,
      monthlyContributionInput,
      annualReturnInput,
      inflationRateInput,
      desiredIncomeInput,
      socialSecurityInput
    ];

    inputs.forEach(clearError);
  }

  // ------------------------------------------------------------
  // Validation
  // ------------------------------------------------------------

  function validateInputs() {
    clearAllErrors();

    let valid = true;

    const currentAge = Number(currentAgeInput.value);
    const retirementAge = Number(retirementAgeInput.value);
    const currentSavings = Number(currentSavingsInput.value);
    const monthlyContribution = Number(monthlyContributionInput.value);
    const annualReturn = Number(annualReturnInput.value);
    const inflationRate = Number(inflationRateInput.value);
    const desiredIncome = Number(desiredIncomeInput.value);
    const socialSecurity = Number(
      socialSecurityInput.value === ""
        ? 0
        : socialSecurityInput.value
    );

    // Current age
    if (
      !Number.isFinite(currentAge) ||
      !Number.isInteger(currentAge) ||
      currentAge < 18 ||
      currentAge > 100
    ) {
      showError(
        currentAgeInput,
        "Enter a whole-number age between 18 and 100."
      );
      valid = false;
    }

    // Retirement age
    if (
      !Number.isFinite(retirementAge) ||
      !Number.isInteger(retirementAge) ||
      retirementAge < 19 ||
      retirementAge > 100
    ) {
      showError(
        retirementAgeInput,
        "Enter a whole-number retirement age between 19 and 100."
      );
      valid = false;
    }

    // Retirement age must be greater
    if (
      Number.isFinite(currentAge) &&
      Number.isFinite(retirementAge) &&
      retirementAge <= currentAge
    ) {
      showError(
        retirementAgeInput,
        "Retirement age must be greater than your current age."
      );
      valid = false;
    }

    // Current savings
    if (
      !Number.isFinite(currentSavings) ||
      currentSavings < 0
    ) {
      showError(
        currentSavingsInput,
        "Enter a current retirement savings amount of $0 or more."
      );
      valid = false;
    }

    // Monthly contribution
    if (
      !Number.isFinite(monthlyContribution) ||
      monthlyContribution < 0
    ) {
      showError(
        monthlyContributionInput,
        "Enter a monthly contribution of $0 or more."
      );
      valid = false;
    }

    // Annual return
    if (
      !Number.isFinite(annualReturn) ||
      annualReturn < 0 ||
      annualReturn > 50
    ) {
      showError(
        annualReturnInput,
        "Enter an expected annual return between 0% and 50%."
      );
      valid = false;
    }

    // Inflation
    if (
      !Number.isFinite(inflationRate) ||
      inflationRate < 0 ||
      inflationRate > 30
    ) {
      showError(
        inflationRateInput,
        "Enter an inflation rate between 0% and 30%."
      );
      valid = false;
    }

    // Desired income
    if (
      !Number.isFinite(desiredIncome) ||
      desiredIncome < 0
    ) {
      showError(
        desiredIncomeInput,
        "Enter a desired annual retirement income of $0 or more."
      );
      valid = false;
    }

    // Social Security
    if (
      !Number.isFinite(socialSecurity) ||
      socialSecurity < 0
    ) {
      showError(
        socialSecurityInput,
        "Enter Social Security income of $0 or more."
      );
      valid = false;
    }

    return valid;
  }

  // ------------------------------------------------------------
  // Retirement calculation
  // ------------------------------------------------------------

  function calculateRetirement() {
    if (!validateInputs()) {
      resultsSection.hidden = true;
      projectionSection.hidden = true;
      return;
    }

    const currentAge = Number(currentAgeInput.value);
    const retirementAge = Number(retirementAgeInput.value);
    const currentSavings = Number(currentSavingsInput.value);
    const monthlyContribution = Number(monthlyContributionInput.value);
    const annualReturn = Number(annualReturnInput.value);
    const inflationRate = Number(inflationRateInput.value);
    const desiredIncome = Number(desiredIncomeInput.value);
    const socialSecurity =
      socialSecurityInput.value === ""
        ? 0
        : Number(socialSecurityInput.value);

    const yearsUntilRetirement = retirementAge - currentAge;
    const totalMonths = yearsUntilRetirement * 12;

    const monthlyRate = annualReturn / 100 / 12;

    let balance = currentSavings;
    let totalContributions = 0;
    let totalInvestmentGrowth = 0;

    const yearlyProjection = [];

    // ----------------------------------------------------------
    // Monthly projection
    // ----------------------------------------------------------

    for (let month = 1; month <= totalMonths; month++) {
      const startingBalance = balance;

      // Monthly contribution
      balance += monthlyContribution;
      totalContributions += monthlyContribution;

      // Monthly investment growth
      let investmentGrowth = 0;

      if (monthlyRate > 0) {
        investmentGrowth = balance * monthlyRate;
        balance += investmentGrowth;
      }

      totalInvestmentGrowth += investmentGrowth;

      // Store each completed year
      if (month % 12 === 0) {
        const yearNumber = month / 12;
        const ageAtEnd = currentAge + yearNumber;

        const yearStartingBalance =
          yearNumber === 1
            ? currentSavings
            : yearlyProjection[yearlyProjection.length - 1].endingBalance;

        const yearContributions = monthlyContribution * 12;

        const yearInvestmentGrowth =
          balance -
          yearStartingBalance -
          yearContributions;

        yearlyProjection.push({
          year: yearNumber,
          age: ageAtEnd,
          startingBalance: yearStartingBalance,
          contributions: yearContributions,
          investmentGrowth: yearInvestmentGrowth,
          endingBalance: balance
        });
      }
    }

    // Avoid tiny floating-point residuals
    if (Math.abs(balance) < 0.000001) {
      balance = 0;
    }

    const futureSavings = balance;

    // ----------------------------------------------------------
    // Retirement income
    // ----------------------------------------------------------

    /*
      Simplified 4% withdrawal assumption.

      Investment-based annual income:
      projected savings × 4%

      Social Security is then added separately.
    */

    const investmentRetirementIncome =
      futureSavings * WITHDRAWAL_RATE;

    const estimatedAnnualRetirementIncome =
      investmentRetirementIncome + socialSecurity;

    const estimatedMonthlyRetirementIncome =
      estimatedAnnualRetirementIncome / 12;

    // ----------------------------------------------------------
    // Inflation adjustment
    // ----------------------------------------------------------

    /*
      The desired income is entered in today's dollars.

      This calculates the approximate amount that would be needed
      at retirement to have the same purchasing power.
    */

    const inflationMultiplier = Math.pow(
      1 + inflationRate / 100,
      yearsUntilRetirement
    );

    const futureIncomeNeed =
      desiredIncome * inflationMultiplier;

    /*
      Convert projected retirement income back into today's
      purchasing power.
    */

    const inflationAdjustedIncome =
      inflationMultiplier > 0
        ? estimatedAnnualRetirementIncome / inflationMultiplier
        : estimatedAnnualRetirementIncome;

    // ----------------------------------------------------------
    // Funding status
    // ----------------------------------------------------------

    let fundingStatus = "";

    if (desiredIncome === 0) {
      fundingStatus = "No income target entered";
    } else if (inflationAdjustedIncome >= desiredIncome) {
      fundingStatus = "Estimated income meets target";
    } else {
      fundingStatus = "Estimated income is below target";
    }

    // ----------------------------------------------------------
    // Display results
    // ----------------------------------------------------------

    futureSavingsOutput.textContent =
      formatCurrency(futureSavings);

    totalContributionsOutput.textContent =
      formatCurrency(totalContributions);

    investmentGrowthOutput.textContent =
      formatCurrency(totalInvestmentGrowth);

    yearsUntilRetirementOutput.textContent =
      formatNumber(yearsUntilRetirement);

    monthlyRetirementIncomeOutput.textContent =
      formatCurrency(estimatedMonthlyRetirementIncome);

    annualRetirementIncomeOutput.textContent =
      formatCurrency(estimatedAnnualRetirementIncome);

    inflationAdjustedIncomeOutput.textContent =
      formatCurrency(inflationAdjustedIncome);

    retirementStatusOutput.textContent =
      fundingStatus;

    // ----------------------------------------------------------
    // Projection table
    // ----------------------------------------------------------

    tableBody.innerHTML = "";

    yearlyProjection.forEach(function (row) {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${row.year}</td>
        <td>${row.age}</td>
        <td>${formatCurrency(row.startingBalance)}</td>
        <td>${formatCurrency(row.contributions)}</td>
        <td>${formatCurrency(row.investmentGrowth)}</td>
        <td>${formatCurrency(row.endingBalance)}</td>
      `;

      tableBody.appendChild(tr);
    });

    // Show sections
    resultsSection.hidden = false;
    projectionSection.hidden = false;

    // Scroll to results
    resultsSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    // Store result for copy function
    form.dataset.result = [
      "CalclyWorld Retirement Calculator",
      "",
      `Current Age: ${currentAge}`,
      `Retirement Age: ${retirementAge}`,
      `Years Until Retirement: ${yearsUntilRetirement}`,
      `Current Savings: ${formatCurrency(currentSavings)}`,
      `Monthly Contribution: ${formatCurrency(monthlyContribution)}`,
      `Expected Annual Return: ${formatPercentage(annualReturn)}`,
      `Expected Inflation Rate: ${formatPercentage(inflationRate)}`,
      `Projected Savings at Retirement: ${formatCurrency(futureSavings)}`,
      `Total Contributions: ${formatCurrency(totalContributions)}`,
      `Investment Growth: ${formatCurrency(totalInvestmentGrowth)}`,
      `Estimated Annual Retirement Income: ${formatCurrency(estimatedAnnualRetirementIncome)}`,
      `Estimated Monthly Retirement Income: ${formatCurrency(estimatedMonthlyRetirementIncome)}`,
      `Inflation-Adjusted Annual Income: ${formatCurrency(inflationAdjustedIncome)}`,
      `Estimated Annual Social Security: ${formatCurrency(socialSecurity)}`,
      `Retirement Funding Status: ${fundingStatus}`,
      "",
      "Note: Results are estimates based on the assumptions entered and are not guaranteed."
    ].join("\n");
  }

  // ------------------------------------------------------------
  // Copy result
  // ------------------------------------------------------------

  function copyResult() {
    const resultText = form.dataset.result;

    if (!resultText) return;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(resultText)
        .then(function () {
          showCopySuccess();
        })
        .catch(function () {
          fallbackCopy(resultText);
        });
    } else {
      fallbackCopy(resultText);
    }
  }

  function fallbackCopy(text) {
    const textarea = document.createElement("textarea");

    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);

    textarea.select();

    try {
      document.execCommand("copy");
      showCopySuccess();
    } catch (error) {
      alert("Unable to copy the result. Please copy it manually.");
    }

    document.body.removeChild(textarea);
  }

  function showCopySuccess() {
    const originalText = copyButton.textContent;

    copyButton.textContent = "Copied!";

    setTimeout(function () {
      copyButton.textContent = originalText;
    }, 1500);
  }

  // ------------------------------------------------------------
  // Form submit
  // ------------------------------------------------------------

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    calculateRetirement();
  });

  // ------------------------------------------------------------
  // Clear / reset
  // ------------------------------------------------------------

  form.addEventListener("reset", function () {
    setTimeout(function () {
      clearAllErrors();

      resultsSection.hidden = true;
      projectionSection.hidden = true;

      tableBody.innerHTML = "";

      form.removeAttribute("data-result");
    }, 0);
  });

  // ------------------------------------------------------------
  // Copy button
  // ------------------------------------------------------------

  if (copyButton) {
    copyButton.addEventListener("click", copyResult);
  }

  // ------------------------------------------------------------
  // Clear button
  // ------------------------------------------------------------

  if (clearButton) {
    clearButton.addEventListener("click", function () {
      form.reset();
    });
  }

  // ------------------------------------------------------------
  // Clear individual error when user edits an input
  // ------------------------------------------------------------

  const inputs = [
    currentAgeInput,
    retirementAgeInput,
    currentSavingsInput,
    monthlyContributionInput,
    annualReturnInput,
    inflationRateInput,
    desiredIncomeInput,
    socialSecurityInput
  ];

  inputs.forEach(function (input) {
    input.addEventListener("input", function () {
      clearError(input);
    });
  });
});