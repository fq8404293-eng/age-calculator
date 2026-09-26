/* ==========================================================
   HOME LOAN EMI CALCULATOR
   CalclyWorld
========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ======================================================
       ELEMENTS
    ====================================================== */

    const currencySelect = document.getElementById(
        "home-loan-currency"
    );

    const loanAmountInput = document.getElementById(
        "home-loan-amount"
    );

    const interestRateInput = document.getElementById(
        "home-loan-interest-rate"
    );

    const loanTermInput = document.getElementById(
        "home-loan-term"
    );

    const calculateButton = document.getElementById(
        "calculate-home-loan"
    );

    const resetButton = document.getElementById(
        "reset-home-loan"
    );

    const errorBox = document.getElementById(
        "home-loan-error"
    );

    const resultBox = document.getElementById(
        "home-loan-result"
    );

    const resultContent = document.getElementById(
        "home-loan-result-content"
    );

    const summaryLoanAmount = document.getElementById(
        "summary-home-loan-amount"
    );

    const summaryPayment = document.getElementById(
        "summary-home-loan-payment"
    );

    const summaryTotalPayments = document.getElementById(
        "summary-home-loan-total-payments"
    );

    const summaryInterest = document.getElementById(
        "summary-home-loan-interest"
    );


    /* ======================================================
       CURRENCY CONFIGURATION
    ====================================================== */

    const currencyConfig = {

        USD: {
            symbol: "$",
            locale: "en-US",
            currency: "USD"
        },

        EUR: {
            symbol: "€",
            locale: "en-IE",
            currency: "EUR"
        },

        GBP: {
            symbol: "£",
            locale: "en-GB",
            currency: "GBP"
        },

        CAD: {
            symbol: "C$",
            locale: "en-CA",
            currency: "CAD"
        },

        AUD: {
            symbol: "A$",
            locale: "en-AU",
            currency: "AUD"
        },

        INR: {
            symbol: "₹",
            locale: "en-IN",
            currency: "INR"
        }

    };


    /* ======================================================
       FORMAT CURRENCY
    ====================================================== */

    function formatCurrency(value) {

        const selectedCurrency =
            currencySelect.value || "USD";

        const config =
            currencyConfig[selectedCurrency] ||
            currencyConfig.USD;

        try {

            return new Intl.NumberFormat(
                config.locale,
                {
                    style: "currency",
                    currency: config.currency,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            ).format(value);

        } catch (error) {

            return (
                config.symbol +
                Number(value).toFixed(2)
            );

        }

    }


    /* ======================================================
       FORMAT NUMBER
    ====================================================== */

    function formatNumber(value) {

        return new Intl.NumberFormat(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        ).format(value);

    }


    /* ======================================================
       SHOW ERROR
    ====================================================== */

    function showError(message) {

        if (!errorBox) {
            return;
        }

        errorBox.textContent = message;

        errorBox.hidden = false;

        if (resultBox) {
            resultBox.hidden = true;
        }

    }


    /* ======================================================
       CLEAR ERROR
    ====================================================== */

    function clearError() {

        if (!errorBox) {
            return;
        }

        errorBox.textContent = "";

        errorBox.hidden = true;

    }


    /* ======================================================
       GET INPUT VALUES
    ====================================================== */

    function getInputs() {

        const loanAmount =
            Number(loanAmountInput.value);

        const annualRate =
            Number(interestRateInput.value);

        const years =
            Number(loanTermInput.value);

        return {
            loanAmount,
            annualRate,
            years
        };

    }


    /* ======================================================
       VALIDATE INPUTS
    ====================================================== */

    function validateInputs(
        loanAmount,
        annualRate,
        years
    ) {

        if (
            !Number.isFinite(loanAmount) ||
            loanAmount <= 0
        ) {

            showError(
                "Please enter a valid home loan amount greater than 0."
            );

            loanAmountInput.focus();

            return false;

        }


        if (
            !Number.isFinite(annualRate) ||
            annualRate < 0 ||
            annualRate > 100
        ) {

            showError(
                "Please enter an annual interest rate between 0% and 100%."
            );

            interestRateInput.focus();

            return false;

        }


        if (
            !Number.isFinite(years) ||
            years < 1 ||
            years > 50
        ) {

            showError(
                "Please enter a loan term between 1 and 50 years."
            );

            loanTermInput.focus();

            return false;

        }


        return true;

    }


    /* ======================================================
       CALCULATE MONTHLY PAYMENT
    ====================================================== */

    function calculateMonthlyPayment(
        principal,
        annualRate,
        numberOfPayments
    ) {

        const monthlyRate =
            annualRate / 100 / 12;


        /* -----------------------------------------------
           ZERO INTEREST
        ------------------------------------------------ */

        if (monthlyRate === 0) {

            return principal / numberOfPayments;

        }


        /* -----------------------------------------------
           STANDARD EMI FORMULA

           M = P × r × (1+r)^n
               ----------------
                 (1+r)^n - 1

        ------------------------------------------------ */

        const power =
            Math.pow(
                1 + monthlyRate,
                numberOfPayments
            );


        const payment =
            principal *
            monthlyRate *
            power /
            (power - 1);


        return payment;

    }


    /* ======================================================
       CALCULATE AMORTIZATION SCHEDULE
    ====================================================== */

    function createAmortizationSchedule(
        principal,
        annualRate,
        numberOfPayments,
        monthlyPayment
    ) {

        const monthlyRate =
            annualRate / 100 / 12;

        let balance = principal;

        const schedule = [];


        for (
            let month = 1;
            month <= numberOfPayments;
            month++
        ) {

            let interestPayment = 0;

            let principalPayment = 0;

            let payment = monthlyPayment;


            /* -------------------------------------------
               MONTHLY INTEREST
            ------------------------------------------- */

            interestPayment =
                balance * monthlyRate;


            /* -------------------------------------------
               PRINCIPAL PORTION
            ------------------------------------------- */

            principalPayment =
                payment - interestPayment;


            /* -------------------------------------------
               FINAL PAYMENT ADJUSTMENT
            ------------------------------------------- */

            if (
                month === numberOfPayments ||
                principalPayment > balance
            ) {

                principalPayment = balance;

                payment =
                    principalPayment +
                    interestPayment;

            }


            /* -------------------------------------------
               UPDATE BALANCE
            ------------------------------------------- */

            balance -= principalPayment;


            if (Math.abs(balance) < 0.01) {

                balance = 0;

            }


            schedule.push({

                month: month,

                payment: payment,

                principal: principalPayment,

                interest: interestPayment,

                balance: balance

            });

        }


        return schedule;

    }


    /* ======================================================
       CREATE RESULTS HTML
    ====================================================== */

    function createResultsHTML(
        loanAmount,
        annualRate,
        years,
        numberOfPayments,
        monthlyPayment,
        totalPayments,
        totalInterest,
        schedule
    ) {

        let html = "";


        /* ==================================================
           SUMMARY CARDS
        ================================================== */

        html += `

            <div class="calculator-results-grid">

                <div class="result-card">

                    <h3>
                        Monthly Payment
                    </h3>

                    <p class="result-value">
                        ${formatCurrency(monthlyPayment)}
                    </p>

                </div>


                <div class="result-card">

                    <h3>
                        Total Payments
                    </h3>

                    <p class="result-value">
                        ${formatCurrency(totalPayments)}
                    </p>

                </div>


                <div class="result-card">

                    <h3>
                        Total Interest
                    </h3>

                    <p class="result-value">
                        ${formatCurrency(totalInterest)}
                    </p>

                </div>


                <div class="result-card">

                    <h3>
                        Loan Term
                    </h3>

                    <p class="result-value">
                        ${years} years
                    </p>

                </div>

            </div>

        `;


        /* ==================================================
           LOAN DETAILS
        ================================================== */

        html += `

            <div class="info-box">

                <h3>
                    Loan Details
                </h3>

                <p>

                    <strong>
                        Loan Amount:
                    </strong>

                    ${formatCurrency(loanAmount)}

                </p>

                <p>

                    <strong>
                        Annual Interest Rate:
                    </strong>

                    ${formatNumber(annualRate)}%

                </p>

                <p>

                    <strong>
                        Loan Term:
                    </strong>

                    ${years} years

                </p>

                <p>

                    <strong>
                        Number of Monthly Payments:
                    </strong>

                    ${numberOfPayments}

                </p>

            </div>

        `;


        /* ==================================================
           EXPLANATION
        ================================================== */

        html += `

            <div class="info-box">

                <h3>
                    Estimated Repayment
                </h3>

                <p>

                    Based on the information entered, your
                    estimated monthly principal-and-interest
                    payment is

                    <strong>
                        ${formatCurrency(monthlyPayment)}
                    </strong>.

                </p>

                <p>

                    Over the full repayment period, you would
                    make approximately

                    <strong>
                        ${formatCurrency(totalPayments)}
                    </strong>

                    in total payments, including approximately

                    <strong>
                        ${formatCurrency(totalInterest)}
                    </strong>

                    in interest.

                </p>

            </div>

        `;


        /* ==================================================
           AMORTIZATION SCHEDULE
        ================================================== */

        html += `

            <div class="amortization-section">

                <h3>
                    Home Loan Amortization Schedule
                </h3>

                <p class="small-text">

                    The table below shows how each estimated
                    monthly payment is divided between principal
                    and interest and how the remaining loan
                    balance changes over time.

                </p>

                <div class="table-wrapper">

                    <table class="amortization-table">

                        <thead>

                            <tr>

                                <th>
                                    Payment
                                </th>

                                <th>
                                    Monthly Payment
                                </th>

                                <th>
                                    Principal
                                </th>

                                <th>
                                    Interest
                                </th>

                                <th>
                                    Remaining Balance
                                </th>

                            </tr>

                        </thead>

                        <tbody>
        `;


        /* ==================================================
           TABLE ROWS
        ================================================== */

        schedule.forEach(function (row) {

            html += `

                <tr>

                    <td>
                        ${row.month}
                    </td>

                    <td>
                        ${formatCurrency(row.payment)}
                    </td>

                    <td>
                        ${formatCurrency(row.principal)}
                    </td>

                    <td>
                        ${formatCurrency(row.interest)}
                    </td>

                    <td>
                        ${formatCurrency(row.balance)}
                    </td>

                </tr>

            `;

        });


        html += `

                        </tbody>

                    </table>

                </div>

            </div>

        `;


        /* ==================================================
           DISCLAIMER
        ================================================== */

        html += `

            <div class="info-box">

                <h3>
                    Important
                </h3>

                <p>

                    This calculator provides a mathematical
                    estimate based on the assumptions entered.

                    Actual home loan or mortgage payments may
                    differ because of lender-specific rates,
                    fees, taxes, insurance, payment timing,
                    rounding, and other loan conditions.

                </p>

            </div>

        `;


        return html;

    }


    /* ======================================================
       UPDATE SUMMARY
    ====================================================== */

    function updateSummary(
        loanAmount,
        monthlyPayment,
        totalPayments,
        totalInterest
    ) {

        if (summaryLoanAmount) {

            summaryLoanAmount.textContent =
                formatCurrency(loanAmount);

        }


        if (summaryPayment) {

            summaryPayment.textContent =
                formatCurrency(monthlyPayment);

        }


        if (summaryTotalPayments) {

            summaryTotalPayments.textContent =
                formatCurrency(totalPayments);

        }


        if (summaryInterest) {

            summaryInterest.textContent =
                formatCurrency(totalInterest);

        }

    }


    /* ======================================================
       CALCULATE HOME LOAN
    ====================================================== */

    function calculateHomeLoan() {

        clearError();


        const {
            loanAmount,
            annualRate,
            years
        } = getInputs();


        /* -----------------------------------------------
           VALIDATION
        ------------------------------------------------ */

        if (
            !validateInputs(
                loanAmount,
                annualRate,
                years
            )
        ) {

            return;

        }


        /* -----------------------------------------------
           NUMBER OF PAYMENTS
        ------------------------------------------------ */

        const numberOfPayments =
            years * 12;


        /* -----------------------------------------------
           MONTHLY PAYMENT
        ------------------------------------------------ */

        const monthlyPayment =
            calculateMonthlyPayment(
                loanAmount,
                annualRate,
                numberOfPayments
            );


        if (
            !Number.isFinite(monthlyPayment) ||
            monthlyPayment <= 0
        ) {

            showError(
                "Unable to calculate the loan payment. Please check your values and try again."
            );

            return;

        }


        /* -----------------------------------------------
           TOTAL PAYMENTS
        ------------------------------------------------ */

        const totalPayments =
            monthlyPayment *
            numberOfPayments;


        /* -----------------------------------------------
           TOTAL INTEREST
        ------------------------------------------------ */

        const totalInterest =
            totalPayments -
            loanAmount;


        /* -----------------------------------------------
           AMORTIZATION
        ------------------------------------------------ */

        const schedule =
            createAmortizationSchedule(
                loanAmount,
                annualRate,
                numberOfPayments,
                monthlyPayment
            );


        /* -----------------------------------------------
           RESULTS HTML
        ------------------------------------------------ */

        if (resultContent) {

            resultContent.innerHTML =
                createResultsHTML(
                    loanAmount,
                    annualRate,
                    years,
                    numberOfPayments,
                    monthlyPayment,
                    totalPayments,
                    totalInterest,
                    schedule
                );

        }


        /* -----------------------------------------------
           SHOW RESULTS
        ------------------------------------------------ */

        if (resultBox) {

            resultBox.hidden = false;

        }


        /* -----------------------------------------------
           UPDATE SUMMARY
        ------------------------------------------------ */

        updateSummary(
            loanAmount,
            monthlyPayment,
            totalPayments,
            totalInterest
        );


        /* -----------------------------------------------
           SCROLL TO RESULTS
        ------------------------------------------------ */

        setTimeout(function () {

            if (resultBox) {

                resultBox.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }, 100);

    }


    /* ======================================================
       RESET CALCULATOR
    ====================================================== */

    function resetCalculator() {

        clearError();


        if (loanAmountInput) {

            loanAmountInput.value = "";

        }


        if (interestRateInput) {

            interestRateInput.value = "";

        }


        if (loanTermInput) {

            loanTermInput.value = "";

        }


        if (currencySelect) {

            currencySelect.value = "USD";

        }


        if (resultContent) {

            resultContent.innerHTML = "";

        }


        if (resultBox) {

            resultBox.hidden = true;

        }


        if (summaryLoanAmount) {

            summaryLoanAmount.textContent =
                formatCurrency(0);

        }


        if (summaryPayment) {

            summaryPayment.textContent =
                formatCurrency(0);

        }


        if (summaryTotalPayments) {

            summaryTotalPayments.textContent =
                formatCurrency(0);

        }


        if (summaryInterest) {

            summaryInterest.textContent =
                formatCurrency(0);

        }


        if (loanAmountInput) {

            loanAmountInput.focus();

        }

    }


    /* ======================================================
       EVENT LISTENERS
    ====================================================== */

    if (calculateButton) {

        calculateButton.addEventListener(
            "click",
            calculateHomeLoan
        );

    }


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetCalculator
        );

    }


    /* ======================================================
       ENTER KEY SUPPORT
    ====================================================== */

    [
        loanAmountInput,
        interestRateInput,
        loanTermInput
    ].forEach(function (input) {

        if (!input) {
            return;
        }

        input.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    calculateHomeLoan();

                }

            }
        );

    });


    /* ======================================================
       RECALCULATE WHEN CURRENCY CHANGES
    ====================================================== */

    if (currencySelect) {

        currencySelect.addEventListener(
            "change",
            function () {

                if (
                    resultBox &&
                    !resultBox.hidden
                ) {

                    calculateHomeLoan();

                }

            }
        );

    }


});