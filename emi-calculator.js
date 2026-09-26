"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     ELEMENTS
  ========================================================= */

  const form =
    document.getElementById("emi-form");

  const loanAmountInput =
    document.getElementById("loan-amount");

  const interestRateInput =
    document.getElementById("interest-rate");

  const loanTenureInput =
    document.getElementById("loan-tenure");

  const tenureUnitInput =
    document.getElementById("tenure-unit");

  const clearButton =
    document.getElementById("clear-emi");

  const resultSection =
    document.getElementById("emi-result");

  const breakdownSection =
    document.getElementById("emi-breakdown");

  const amortizationTableBody =
    document.getElementById(
      "amortization-table-body"
    );

  const copyButton =
    document.getElementById(
      "copy-emi-result"
    );

  const copyStatus =
    document.getElementById(
      "emi-copy-status"
    );


  /* =========================================================
     RESULT ELEMENTS
  ========================================================= */

  const monthlyEmiElement =
    document.getElementById(
      "monthly-emi"
    );

  const resultLoanAmountElement =
    document.getElementById(
      "result-loan-amount"
    );

  const totalInterestElement =
    document.getElementById(
      "total-interest"
    );

  const totalPaymentElement =
    document.getElementById(
      "total-payment"
    );

  const numberOfPaymentsElement =
    document.getElementById(
      "number-of-payments"
    );


  /* =========================================================
     ERROR ELEMENTS
  ========================================================= */

  const loanAmountError =
    document.getElementById(
      "loan-amount-error"
    );

  const interestRateError =
    document.getElementById(
      "interest-rate-error"
    );

  const loanTenureError =
    document.getElementById(
      "loan-tenure-error"
    );


  /* =========================================================
     STATE
  ========================================================= */

  let latestCalculation = null;


  /* =========================================================
     CURRENCY FORMATTER
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
     ERROR HANDLING
  ========================================================= */

  function clearErrors() {

    const errors = [
      loanAmountError,
      interestRateError,
      loanTenureError
    ];


    errors.forEach((errorElement) => {

      errorElement.textContent =
        "";

      errorElement.hidden =
        true;

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


    const loanAmount =
      Number(
        loanAmountInput.value
      );


    const annualRate =
      Number(
        interestRateInput.value
      );


    const tenure =
      Number(
        loanTenureInput.value
      );


    let valid = true;


    /*
      Loan amount
    */

    if (
      !Number.isFinite(
        loanAmount
      ) ||
      loanAmount <= 0
    ) {

      showError(
        loanAmountError,
        "Please enter a loan amount greater than 0."
      );

      valid = false;
    }


    /*
      Interest rate

      0% is allowed because it is
      mathematically valid.
    */

    if (
      !Number.isFinite(
        annualRate
      ) ||
      annualRate < 0 ||
      annualRate > 100
    ) {

      showError(
        interestRateError,
        "Please enter an interest rate between 0% and 100%."
      );

      valid = false;
    }


    /*
      Tenure
    */

    if (
      !Number.isFinite(
        tenure
      ) ||
      !Number.isInteger(
        tenure
      ) ||
      tenure <= 0
    ) {

      showError(
        loanTenureError,
        "Please enter a whole number greater than 0."
      );

      valid = false;
    }


    /*
      Maximum tenure depends on the selected unit.

      Years:
      maximum 50 years

      Months:
      maximum 600 months
    */

    if (
      tenureUnitInput.value === "years" &&
      tenure > 50
    ) {

      showError(
        loanTenureError,
        "For years, please enter a tenure between 1 and 50 years."
      );

      valid = false;
    }


    if (
      tenureUnitInput.value === "months" &&
      tenure > 600
    ) {

      showError(
        loanTenureError,
        "For months, please enter a tenure between 1 and 600 months."
      );

      valid = false;
    }


    if (!valid) {
      return null;
    }


    /*
      Convert tenure to months.
    */

    const totalMonths =
      tenureUnitInput.value === "years"
        ? tenure * 12
        : tenure;


    return {
      loanAmount,
      annualRate,
      tenure,
      tenureUnit:
        tenureUnitInput.value,
      totalMonths
    };
  }


  /* =========================================================
     EMI CALCULATION
  ========================================================= */

  function calculateLoan(
    data
  ) {

    const {
      loanAmount,
      annualRate,
      totalMonths
    } = data;


    /*
      Convert annual percentage rate
      to monthly decimal rate.
    */

    const monthlyRate =
      annualRate / 100 / 12;


    let monthlyEmi;


    /*
      Special case:
      0% interest.

      In that situation the loan is
      simply divided across the payments.
    */

    if (
      monthlyRate === 0
    ) {

      monthlyEmi =
        loanAmount /
        totalMonths;

    } else {

      const factor =
        Math.pow(
          1 + monthlyRate,
          totalMonths
        );


      monthlyEmi =
        loanAmount *
        monthlyRate *
        factor /
        (factor - 1);
    }


    /*
      Generate monthly amortization.
    */

    let remainingBalance =
      loanAmount;


    let totalInterest =
      0;


    const yearlyResults = [];


    let yearlyPrincipal =
      0;


    let yearlyInterest =
      0;


    let yearlyPayment =
      0;


    for (
      let month = 1;
      month <= totalMonths;
      month++
    ) {

      let interestForMonth;


      if (
        monthlyRate === 0
      ) {

        interestForMonth =
          0;

      } else {

        interestForMonth =
          remainingBalance *
          monthlyRate;
      }


      let principalForMonth =
        monthlyEmi -
        interestForMonth;


      /*
        Protect against tiny floating-point
        rounding differences near the end.
      */

      if (
        month === totalMonths
      ) {

        principalForMonth =
          remainingBalance;
      }


      if (
        principalForMonth >
        remainingBalance
      ) {

        principalForMonth =
          remainingBalance;
      }


      const actualPayment =
        principalForMonth +
        interestForMonth;


      remainingBalance -=
        principalForMonth;


      /*
        Avoid tiny negative values such as
        -0.00000001.
      */

      if (
        Math.abs(
          remainingBalance
        ) < 0.005
      ) {

        remainingBalance =
          0;
      }


      totalInterest +=
        interestForMonth;


      yearlyPrincipal +=
        principalForMonth;


      yearlyInterest +=
        interestForMonth;


      yearlyPayment +=
        actualPayment;


      /*
        End of year
      */

      if (
        month % 12 === 0 ||
        month === totalMonths
      ) {

        const year =
          Math.ceil(
            month / 12
          );


        yearlyResults.push({

          year,

          principal:
            yearlyPrincipal,

          interest:
            yearlyInterest,

          payment:
            yearlyPayment,

          remainingBalance:
            remainingBalance

        });


        yearlyPrincipal =
          0;


        yearlyInterest =
          0;


        yearlyPayment =
          0;
      }
    }


    const totalPayment =
      monthlyEmi *
      totalMonths;


    /*
      Use principal + interest for the
      displayed total because this keeps
      the relationship clear even with
      small floating-point differences.
    */

    const calculatedTotalPayment =
      loanAmount +
      totalInterest;


    return {

      monthlyEmi,

      totalInterest,

      totalPayment:
        calculatedTotalPayment,

      numberOfPayments:
        totalMonths,

      yearlyResults

    };
  }


  /* =========================================================
     DISPLAY RESULTS
  ========================================================= */

  function displayResults(
    data,
    result
  ) {

    latestCalculation = {
      ...data,
      ...result
    };


    monthlyEmiElement.textContent =
      formatMoney(
        result.monthlyEmi
      );


    resultLoanAmountElement.textContent =
      formatMoney(
        data.loanAmount
      );


    totalInterestElement.textContent =
      formatMoney(
        result.totalInterest
      );


    totalPaymentElement.textContent =
      formatMoney(
        result.totalPayment
      );


    numberOfPaymentsElement.textContent =
      formatNumber(
        result.numberOfPayments
      );


    buildAmortizationTable(
      result.yearlyResults
    );


    resultSection.hidden =
      false;


    breakdownSection.hidden =
      false;


    /*
      Scroll to results after calculation.
    */

    setTimeout(() => {

      resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }, 100);
  }


  /* =========================================================
     AMORTIZATION TABLE
  ========================================================= */

  function buildAmortizationTable(
    yearlyResults
  ) {

    amortizationTableBody.innerHTML =
      "";


    yearlyResults.forEach(
      (row) => {

        const tableRow =
          document.createElement(
            "tr"
          );


        const yearCell =
          document.createElement(
            "td"
          );

        yearCell.textContent =
          row.year;


        const principalCell =
          document.createElement(
            "td"
          );

        principalCell.textContent =
          formatMoney(
            row.principal
          );


        const interestCell =
          document.createElement(
            "td"
          );

        interestCell.textContent =
          formatMoney(
            row.interest
          );


        const paymentCell =
          document.createElement(
            "td"
          );

        paymentCell.textContent =
          formatMoney(
            row.payment
          );


        const balanceCell =
          document.createElement(
            "td"
          );

        balanceCell.textContent =
          formatMoney(
            row.remainingBalance
          );


        tableRow.appendChild(
          yearCell
        );

        tableRow.appendChild(
          principalCell
        );

        tableRow.appendChild(
          interestCell
        );

        tableRow.appendChild(
          paymentCell
        );

        tableRow.appendChild(
          balanceCell
        );


        amortizationTableBody.appendChild(
          tableRow
        );

      }
    );
  }


  /* =========================================================
     MAIN CALCULATE FUNCTION
  ========================================================= */

  function calculate() {

    const data =
      validateInputs();


    if (!data) {

      hideResults();

      return;
    }


    const result =
      calculateLoan(
        data
      );


    displayResults(
      data,
      result
    );
  }


  /* =========================================================
     HIDE RESULTS
  ========================================================= */

  function hideResults() {

    resultSection.hidden =
      true;


    breakdownSection.hidden =
      true;


    amortizationTableBody.innerHTML =
      "";


    latestCalculation =
      null;
  }


  /* =========================================================
     COPY RESULT
  ========================================================= */

  copyButton.addEventListener(
    "click",
    async () => {

      if (
        !latestCalculation
      ) {

        return;
      }


      const data =
        latestCalculation;


      const text =
`EMI Calculator Result

Loan Amount: ${formatMoney(
  data.loanAmount
)}

Annual Interest Rate: ${formatNumber(
  data.annualRate
)}%

Loan Tenure: ${data.tenure} ${
  data.tenureUnit === "years"
    ? (
        data.tenure === 1
          ? "year"
          : "years"
      )
    : (
        data.tenure === 1
          ? "month"
          : "months"
      )
}

Number of Payments: ${formatNumber(
  data.numberOfPayments
)}

Monthly EMI: ${formatMoney(
  data.monthlyEmi
)}

Total Interest: ${formatMoney(
  data.totalInterest
)}

Total Payment: ${formatMoney(
  data.totalPayment
)}`;


      const copied =
        await copyToClipboard(
          text
        );


      copyStatus.textContent =
        copied
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

      /*
        Use fallback below.
      */
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
     CLEAR BUTTON
  ========================================================= */

  clearButton.addEventListener(
    "click",
    () => {

      form.reset();


      clearErrors();


      hideResults();


      /*
        Restore default tenure unit.
      */

      tenureUnitInput.value =
        "years";


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


  /* =========================================================
     TENURE UNIT CHANGE
  ========================================================= */

  tenureUnitInput.addEventListener(
    "change",
    () => {

      clearErrors();


      /*
        Update the maximum allowed
        value to match the selected unit.
      */

      if (
        tenureUnitInput.value === "years"
      ) {

        loanTenureInput.max =
          "50";

      } else {

        loanTenureInput.max =
          "600";
      }

    }
  );

});