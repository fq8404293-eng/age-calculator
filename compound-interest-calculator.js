"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     ELEMENTS
  ========================================================= */

  const form =
    document.getElementById("compound-interest-form");

  const initialInvestmentInput =
    document.getElementById("initial-investment");

  const monthlyContributionInput =
    document.getElementById("monthly-contribution");

  const interestRateInput =
    document.getElementById("interest-rate");

  const investmentYearsInput =
    document.getElementById("investment-years");

  const compoundFrequencyInput =
    document.getElementById("compound-frequency");

  const clearButton =
    document.getElementById(
      "clear-compound-interest"
    );

  const resultSection =
    document.getElementById(
      "compound-interest-result"
    );

  const growthBreakdown =
    document.getElementById(
      "growth-breakdown"
    );

  const copyButton =
    document.getElementById(
      "copy-compound-result"
    );

  const copyStatus =
    document.getElementById(
      "compound-copy-status"
    );

  const growthTableBody =
    document.getElementById(
      "growth-table-body"
    );


  /* =========================================================
     RESULTS
  ========================================================= */

  const futureValueElement =
    document.getElementById(
      "future-value"
    );

  const totalContributionsElement =
    document.getElementById(
      "total-contributions"
    );

  const interestEarnedElement =
    document.getElementById(
      "interest-earned"
    );

  const interestShareElement =
    document.getElementById(
      "interest-share"
    );

  const resultPeriodElement =
    document.getElementById(
      "result-period"
    );


  /* =========================================================
     ERRORS
  ========================================================= */

  const initialInvestmentError =
    document.getElementById(
      "initial-investment-error"
    );

  const monthlyContributionError =
    document.getElementById(
      "monthly-contribution-error"
    );

  const interestRateError =
    document.getElementById(
      "interest-rate-error"
    );

  const investmentYearsError =
    document.getElementById(
      "investment-years-error"
    );


  /* =========================================================
     STATE
  ========================================================= */

  let latestCalculation = null;


  /* =========================================================
     FORMATTING
  ========================================================= */

  const currencyFormatter =
    new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    );


  function formatMoney(value) {

    return currencyFormatter.format(
      value
    );
  }


  function formatNumber(value) {

    return new Intl.NumberFormat(
      "en-US",
      {
        maximumFractionDigits: 2
      }
    ).format(value);
  }


  /* =========================================================
     ERROR HELPERS
  ========================================================= */

  function clearErrors() {

    const errors = [
      initialInvestmentError,
      monthlyContributionError,
      interestRateError,
      investmentYearsError
    ];


    errors.forEach((element) => {

      element.textContent = "";

      element.hidden = true;

    });
  }


  function showError(
    element,
    message
  ) {

    element.textContent =
      message;

    element.hidden =
      false;
  }


  /* =========================================================
     VALIDATION
  ========================================================= */

  function validateInputs() {

    clearErrors();


    const initialInvestment =
      Number(
        initialInvestmentInput.value
      );


    const monthlyContribution =
      Number(
        monthlyContributionInput.value
      );


    const interestRate =
      Number(
        interestRateInput.value
      );


    const investmentYears =
      Number(
        investmentYearsInput.value
      );


    const compoundFrequency =
      Number(
        compoundFrequencyInput.value
      );


    let valid = true;


    if (
      !Number.isFinite(
        initialInvestment
      ) ||
      initialInvestment < 0
    ) {

      showError(
        initialInvestmentError,
        "Please enter an initial investment of 0 or more."
      );

      valid = false;
    }


    if (
      !Number.isFinite(
        monthlyContribution
      ) ||
      monthlyContribution < 0
    ) {

      showError(
        monthlyContributionError,
        "Please enter a monthly contribution of 0 or more."
      );

      valid = false;
    }


    if (
      !Number.isFinite(
        interestRate
      ) ||
      interestRate < 0 ||
      interestRate > 100
    ) {

      showError(
        interestRateError,
        "Please enter an interest rate between 0% and 100%."
      );

      valid = false;
    }


    if (
      !Number.isFinite(
        investmentYears
      ) ||
      !Number.isInteger(
        investmentYears
      ) ||
      investmentYears < 1 ||
      investmentYears > 100
    ) {

      showError(
        investmentYearsError,
        "Please enter a whole number between 1 and 100 years."
      );

      valid = false;
    }


    if (
      !Number.isFinite(
        compoundFrequency
      ) ||
      ![
        1,
        2,
        4,
        12,
        365
      ].includes(
        compoundFrequency
      )
    ) {

      valid = false;
    }


    if (!valid) {
      return null;
    }


    /*
      At least one source of money must exist.
      An initial investment of zero is allowed when
      the user has a monthly contribution.
    */

    if (
      initialInvestment === 0 &&
      monthlyContribution === 0
    ) {

      showError(
        initialInvestmentError,
        "Enter an initial investment or a monthly contribution."
      );

      showError(
        monthlyContributionError,
        "Enter an initial investment or a monthly contribution."
      );

      return null;
    }


    return {
      initialInvestment,
      monthlyContribution,
      interestRate,
      investmentYears,
      compoundFrequency
    };
  }


  /* =========================================================
     COMPOUND INTEREST ENGINE
  ========================================================= */

  function calculateInvestment(
    data
  ) {

    const {
      initialInvestment,
      monthlyContribution,
      interestRate,
      investmentYears,
      compoundFrequency
    } = data;


    const annualRate =
      interestRate / 100;


    const totalMonths =
      investmentYears * 12;


    let balance =
      initialInvestment;


    let totalContributed =
      initialInvestment;


    const yearlyResults = [];


    let yearlyContributions =
      0;


    let yearlyInterest =
      0;


    /*
      We calculate month by month so that regular
      monthly contributions can be included.

      Contributions are added at the beginning
      of each month.

      Interest is then applied according to
      the selected compounding frequency.
    */

    for (
      let month = 1;
      month <= totalMonths;
      month++
    ) {

      /*
        Monthly contribution
      */

      if (
        monthlyContribution > 0
      ) {

        balance +=
          monthlyContribution;

        totalContributed +=
          monthlyContribution;

        yearlyContributions +=
          monthlyContribution;
      }


      let interest = 0;


      /*
        Daily compounding
      */

      if (
        compoundFrequency === 365
      ) {

        const dailyRate =
          annualRate / 365;


        const averageDaysPerMonth =
          365 / 12;


        interest =
          balance *
          (
            Math.pow(
              1 + dailyRate,
              averageDaysPerMonth
            ) - 1
          );


        balance +=
          interest;


        yearlyInterest +=
          interest;

      } else {

        /*
          Number of months between
          compounding events.
        */

        const monthsPerPeriod =
          12 /
          compoundFrequency;


        const shouldCompound =
          month %
            monthsPerPeriod ===
          0;


        if (
          shouldCompound
        ) {

          const periodicRate =
            annualRate /
            compoundFrequency;


          interest =
            balance *
            periodicRate;


          balance +=
            interest;


          yearlyInterest +=
            interest;
        }
      }


      /*
        End of year
      */

      if (
        month % 12 === 0
      ) {

        const year =
          month / 12;


        yearlyResults.push({
          year,
          contributions:
            yearlyContributions,
          interest:
            yearlyInterest,
          balance
        });


        yearlyContributions =
          0;


        yearlyInterest =
          0;
      }
    }


    const interestEarned =
      balance -
      totalContributed;


    const interestShare =
      balance > 0
        ? (
            interestEarned /
            balance
          ) * 100
        : 0;


    return {
      futureValue:
        balance,

      totalContributed:
        totalContributed,

      interestEarned:
        interestEarned,

      interestShare:
        interestShare,

      yearlyResults:
        yearlyResults
    };
  }


  /* =========================================================
     MAIN CALCULATION
  ========================================================= */

  function calculate() {

    const data =
      validateInputs();


    if (!data) {

      hideResults();

      return;
    }


    const result =
      calculateInvestment(
        data
      );


    latestCalculation = {
      ...data,
      ...result
    };


    futureValueElement.textContent =
      formatMoney(
        result.futureValue
      );


    totalContributionsElement.textContent =
      formatMoney(
        result.totalContributed
      );


    interestEarnedElement.textContent =
      formatMoney(
        result.interestEarned
      );


    interestShareElement.textContent =
      `${formatNumber(
        result.interestShare
      )}%`;


    resultPeriodElement.textContent =
      `${data.investmentYears} ${
        data.investmentYears === 1
          ? "year"
          : "years"
      }`;


    buildGrowthTable(
      result.yearlyResults
    );


    resultSection.hidden =
      false;


    growthBreakdown.hidden =
      false;


    setTimeout(() => {

      resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }, 100);
  }


  /* =========================================================
     YEARLY TABLE
  ========================================================= */

  function buildGrowthTable(
    yearlyResults
  ) {

    growthTableBody.innerHTML =
      "";


    yearlyResults.forEach(
      (row) => {

        const tr =
          document.createElement(
            "tr"
          );


        const yearCell =
          document.createElement(
            "td"
          );

        yearCell.textContent =
          row.year;


        const contributionsCell =
          document.createElement(
            "td"
          );

        contributionsCell.textContent =
          formatMoney(
            row.contributions
          );


        const interestCell =
          document.createElement(
            "td"
          );

        interestCell.textContent =
          formatMoney(
            row.interest
          );


        const balanceCell =
          document.createElement(
            "td"
          );

        balanceCell.textContent =
          formatMoney(
            row.balance
          );


        tr.appendChild(
          yearCell
        );

        tr.appendChild(
          contributionsCell
        );

        tr.appendChild(
          interestCell
        );

        tr.appendChild(
          balanceCell
        );


        growthTableBody.appendChild(
          tr
        );
      }
    );
  }


  /* =========================================================
     FREQUENCY NAME
  ========================================================= */

  function getFrequencyName(
    frequency
  ) {

    switch (frequency) {

      case 1:
        return "Annually";

      case 2:
        return "Semi-annually";

      case 4:
        return "Quarterly";

      case 12:
        return "Monthly";

      case 365:
        return "Daily";

      default:
        return "Unknown";
    }
  }


  /* =========================================================
     COPY RESULT
  ========================================================= */

  copyButton.addEventListener(
    "click",
    async () => {

      if (!latestCalculation) {
        return;
      }


      const data =
        latestCalculation;


      const text =
`Compound Interest Calculator Result

Initial Investment: ${formatMoney(
  data.initialInvestment
)}

Monthly Contribution: ${formatMoney(
  data.monthlyContribution
)}

Annual Interest Rate: ${formatNumber(
  data.interestRate
)}%

Investment Period: ${data.investmentYears} ${
  data.investmentYears === 1
    ? "year"
    : "years"
}

Compounding Frequency: ${getFrequencyName(
  data.compoundFrequency
)}

Future Value: ${formatMoney(
  data.futureValue
)}

Total Contributions: ${formatMoney(
  data.totalContributed
)}

Interest Earned: ${formatMoney(
  data.interestEarned
)}

Interest Share: ${formatNumber(
  data.interestShare
)}%`;


      const success =
        await copyToClipboard(
          text
        );


      copyStatus.textContent =
        success
          ? "Result copied!"
          : "Unable to copy the result.";


      setTimeout(() => {

        copyStatus.textContent =
          "";

      }, 2500);
    }
  );


  /* =========================================================
     CLIPBOARD
  ========================================================= */

  async function copyToClipboard(
    text
  ) {

    try {

      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {

        await navigator.clipboard.writeText(
          text
        );

        return true;
      }

    } catch (error) {
      /* Fallback below */
    }


    try {

      const textarea =
        document.createElement(
          "textarea"
        );


      textarea.value =
        text;


      textarea.style.position =
        "fixed";

      textarea.style.left =
        "-9999px";


      document.body.appendChild(
        textarea
      );


      textarea.focus();

      textarea.select();


      const successful =
        document.execCommand(
          "copy"
        );


      textarea.remove();


      return successful;

    } catch (error) {

      return false;
    }
  }


  /* =========================================================
     HIDE RESULTS
  ========================================================= */

  function hideResults() {

    resultSection.hidden =
      true;

    growthBreakdown.hidden =
      true;

    latestCalculation =
      null;

    growthTableBody.innerHTML =
      "";
  }


  /* =========================================================
     CLEAR
  ========================================================= */

  clearButton.addEventListener(
    "click",
    () => {

      form.reset();

      clearErrors();

      hideResults();


      /*
        Restore defaults.
      */

      monthlyContributionInput.value =
        "0";

      compoundFrequencyInput.value =
        "12";


      copyStatus.textContent =
        "";


      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  );


  /* =========================================================
     FORM SUBMIT
  ========================================================= */

  form.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();

      calculate();
    }
  );

});