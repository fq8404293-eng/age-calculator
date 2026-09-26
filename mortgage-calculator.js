"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     ELEMENTS
  ========================================================= */

  const form =
    document.getElementById("mortgage-form");

  const homePriceInput =
    document.getElementById("home-price");

  const downPaymentInput =
    document.getElementById("down-payment");

  const interestRateInput =
    document.getElementById("interest-rate");

  const loanTermInput =
    document.getElementById("loan-term");

  const clearButton =
    document.getElementById("clear-mortgage");

  const resultSection =
    document.getElementById("mortgage-result");

  const breakdownSection =
    document.getElementById("mortgage-breakdown");

  const mortgageTableBody =
    document.getElementById(
      "mortgage-table-body"
    );

  const copyButton =
    document.getElementById(
      "copy-mortgage-result"
    );

  const copyStatus =
    document.getElementById(
      "mortgage-copy-status"
    );


  /* =========================================================
     RESULT ELEMENTS
  ========================================================= */

  const monthlyPaymentElement =
    document.getElementById(
      "monthly-payment"
    );

  const resultHomePriceElement =
    document.getElementById(
      "result-home-price"
    );

  const resultDownPaymentElement =
    document.getElementById(
      "result-down-payment"
    );

  const resultLoanAmountElement =
    document.getElementById(
      "result-loan-amount"
    );

  const resultDownPaymentPercentElement =
    document.getElementById(
      "result-down-payment-percent"
    );

  const totalInterestElement =
    document.getElementById(
      "total-interest"
    );

  const totalPaymentElement =
    document.getElementById(
      "total-payment"
    );


  /* =========================================================
     ERROR ELEMENTS
  ========================================================= */

  const homePriceError =
    document.getElementById(
      "home-price-error"
    );

  const downPaymentError =
    document.getElementById(
      "down-payment-error"
    );

  const interestRateError =
    document.getElementById(
      "interest-rate-error"
    );

  const loanTermError =
    document.getElementById(
      "loan-term-error"
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
      homePriceError,
      downPaymentError,
      interestRateError,
      loanTermError
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


    const homePrice =
      Number(
        homePriceInput.value
      );


    const downPayment =
      Number(
        downPaymentInput.value
      );


    const annualRate =
      Number(
        interestRateInput.value
      );


    const loanTerm =
      Number(
        loanTermInput.value
      );


    let valid = true;


    /* -------------------------------------------------------
       HOME PRICE
    ------------------------------------------------------- */

    if (
      !Number.isFinite(
        homePrice
      ) ||
      homePrice <= 0
    ) {

      showError(
        homePriceError,
        "Please enter a home price greater than 0."
      );

      valid = false;
    }


    /* -------------------------------------------------------
       DOWN PAYMENT
    ------------------------------------------------------- */

    if (
      !Number.isFinite(
        downPayment
      ) ||
      downPayment < 0
    ) {

      showError(
        downPaymentError,
        "Please enter a down payment of 0 or more."
      );

      valid = false;

    } else if (
      Number.isFinite(homePrice) &&
      downPayment >= homePrice
    ) {

      showError(
        downPaymentError,
        "The down payment must be less than the home price."
      );

      valid = false;
    }


    /* -------------------------------------------------------
       INTEREST RATE
    ------------------------------------------------------- */

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


    /* -------------------------------------------------------
       LOAN TERM
    ------------------------------------------------------- */

    if (
      !Number.isFinite(
        loanTerm
      ) ||
      !Number.isInteger(
        loanTerm
      ) ||
      loanTerm < 1 ||
      loanTerm > 50
    ) {

      showError(
        loanTermError,
        "Please enter a whole number between 1 and 50 years."
      );

      valid = false;
    }


    if (!valid) {
      return null;
    }


    /* -------------------------------------------------------
       MORTGAGE PRINCIPAL
    ------------------------------------------------------- */

    const loanAmount =
      homePrice -
      downPayment;


    if (
      loanAmount <= 0
    ) {

      showError(
        downPaymentError,
        "The down payment must be less than the home price."
      );

      return null;
    }


    return {

      homePrice,

      downPayment,

      annualRate,

      loanTerm,

      loanAmount,

      totalMonths:
        loanTerm * 12

    };
  }


  /* =========================================================
     MORTGAGE CALCULATION
  ========================================================= */

  function calculateMortgage(
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


    let monthlyPayment;


    /* -------------------------------------------------------
       ZERO INTEREST
    ------------------------------------------------------- */

    if (
      monthlyRate === 0
    ) {

      monthlyPayment =
        loanAmount /
        totalMonths;

    } else {

      const factor =
        Math.pow(
          1 + monthlyRate,
          totalMonths
        );


      monthlyPayment =
        loanAmount *
        monthlyRate *
        factor /
        (factor - 1);
    }


    /* -------------------------------------------------------
       AMORTIZATION
    ------------------------------------------------------- */

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
        monthlyPayment -
        interestForMonth;


      /*
        On the final payment, use the
        exact remaining balance to avoid
        floating-point residue.
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
        Remove tiny floating-point values.
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
        End of year OR final month
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


    /*
      Total payment based on actual
      principal + accumulated interest.
    */

    const totalPayment =
      loanAmount +
      totalInterest;


    const downPaymentPercent =
      (
        data.downPayment /
        data.homePrice
      ) * 100;


    return {

      monthlyPayment,

      totalInterest,

      totalPayment,

      downPaymentPercent,

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


    monthlyPaymentElement.textContent =
      formatMoney(
        result.monthlyPayment
      );


    resultHomePriceElement.textContent =
      formatMoney(
        data.homePrice
      );


    resultDownPaymentElement.textContent =
      formatMoney(
        data.downPayment
      );


    resultLoanAmountElement.textContent =
      formatMoney(
        data.loanAmount
      );


    resultDownPaymentPercentElement.textContent =
      `${formatNumber(
        result.downPaymentPercent
      )}%`;


    totalInterestElement.textContent =
      formatMoney(
        result.totalInterest
      );


    totalPaymentElement.textContent =
      formatMoney(
        result.totalPayment
      );


    buildAmortizationTable(
      result.yearlyResults
    );


    resultSection.hidden =
      false;


    breakdownSection.hidden =
      false;


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

    mortgageTableBody.innerHTML =
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


        mortgageTableBody.appendChild(
          tableRow
        );

      }
    );
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
      calculateMortgage(
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


    mortgageTableBody.innerHTML =
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
`Mortgage Calculator Result

Home Price: ${formatMoney(
  data.homePrice
)}

Down Payment: ${formatMoney(
  data.downPayment
)}

Down Payment Percentage: ${formatNumber(
  data.downPaymentPercent
)}%

Mortgage Amount: ${formatMoney(
  data.loanAmount
)}

Annual Interest Rate: ${formatNumber(
  data.annualRate
)}%

Mortgage Term: ${data.loanTerm} ${
  data.loanTerm === 1
    ? "year"
    : "years"
}

Monthly Mortgage Payment: ${formatMoney(
  data.monthlyPayment
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
        Fallback below.
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
     CLEAR
  ========================================================= */

  clearButton.addEventListener(
    "click",
    () => {

      form.reset();


      clearErrors();


      hideResults();


      /*
        Restore the default down payment
        value used in the HTML.
      */

      downPaymentInput.value =
        "0";


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