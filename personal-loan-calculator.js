
"use strict";

/*
============================================================
PERSONAL LOAN CALCULATOR
CalclyWorld
============================================================

Features:
- Fixed-rate personal loan calculation
- Monthly payment calculation
- 0% interest support
- Total payments
- Total interest
- Amortization schedule
- Multiple currency display options
- Input validation
- Reset functionality
- Accessible error handling
============================================================
*/


/* ==========================================================
   DOM ELEMENTS
========================================================== */

const personalLoanCurrency =
    document.getElementById("personal-loan-currency");

const personalLoanAmount =
    document.getElementById("personal-loan-amount");

const personalLoanInterestRate =
    document.getElementById("personal-loan-interest-rate");

const personalLoanTerm =
    document.getElementById("personal-loan-term");

const personalLoanError =
    document.getElementById("personal-loan-error");

const calculatePersonalLoanButton =
    document.getElementById("calculate-personal-loan");

const resetPersonalLoanButton =
    document.getElementById("reset-personal-loan");

const personalLoanResult =
    document.getElementById("personal-loan-result");

const personalLoanResultContent =
    document.getElementById("personal-loan-result-content");

const summaryPersonalLoanAmount =
    document.getElementById("summary-personal-loan-amount");

const summaryPersonalLoanPayment =
    document.getElementById("summary-personal-loan-payment");

const summaryPersonalLoanTotalPayments =
    document.getElementById("summary-personal-loan-total-payments");

const summaryPersonalLoanInterest =
    document.getElementById("summary-personal-loan-interest");


/* ==========================================================
   CURRENCY CONFIGURATION
========================================================== */

const personalLoanCurrencyConfig = {

    USD: {
        locale: "en-US",
        currency: "USD"
    },

    EUR: {
        locale: "en-IE",
        currency: "EUR"
    },

    GBP: {
        locale: "en-GB",
        currency: "GBP"
    },

    CAD: {
        locale: "en-CA",
        currency: "CAD"
    },

    AUD: {
        locale: "en-AU",
        currency: "AUD"
    },

    INR: {
        locale: "en-IN",
        currency: "INR"
    }

};


/* ==========================================================
   FORMAT CURRENCY
========================================================== */

function formatPersonalLoanCurrency(
    amount,
    currencyCode
) {

    const config =
        personalLoanCurrencyConfig[currencyCode] ||
        personalLoanCurrencyConfig.USD;

    return new Intl.NumberFormat(
        config.locale,
        {
            style: "currency",
            currency: config.currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ).format(amount);

}


/* ==========================================================
   FORMAT NUMBER
========================================================== */

function formatPersonalLoanNumber(
    number
) {

    return new Intl.NumberFormat(
        "en-US",
        {
            maximumFractionDigits: 2
        }
    ).format(number);

}


/* ==========================================================
   SHOW ERROR
========================================================== */

function showPersonalLoanError(
    message
) {

    personalLoanError.textContent = message;

    personalLoanError.hidden = false;

    personalLoanResult.hidden = true;

}


/* ==========================================================
   CLEAR ERROR
========================================================== */

function clearPersonalLoanError() {

    personalLoanError.textContent = "";

    personalLoanError.hidden = true;

}


/* ==========================================================
   VALIDATE INPUTS
========================================================== */

function validatePersonalLoanInputs() {

    const loanAmount =
        Number(personalLoanAmount.value);

    const annualInterestRate =
        Number(personalLoanInterestRate.value);

    const loanTermYears =
        Number(personalLoanTerm.value);


    if (
        personalLoanAmount.value.trim() === "" ||
        !Number.isFinite(loanAmount) ||
        loanAmount <= 0
    ) {

        showPersonalLoanError(
            "Please enter a valid loan amount greater than 0."
        );

        personalLoanAmount.focus();

        return null;

    }


    if (
        personalLoanInterestRate.value.trim() === "" ||
        !Number.isFinite(annualInterestRate) ||
        annualInterestRate < 0 ||
        annualInterestRate > 100
    ) {

        showPersonalLoanError(
            "Please enter an annual interest rate between 0% and 100%."
        );

        personalLoanInterestRate.focus();

        return null;

    }


    if (
        personalLoanTerm.value.trim() === "" ||
        !Number.isFinite(loanTermYears) ||
        loanTermYears < 1 ||
        loanTermYears > 50
    ) {

        showPersonalLoanError(
            "Please enter a loan term between 1 and 50 years."
        );

        personalLoanTerm.focus();

        return null;

    }


    const totalMonths =
        loanTermYears * 12;


    if (
        !Number.isInteger(totalMonths) ||
        totalMonths <= 0
    ) {

        showPersonalLoanError(
            "Please enter a valid loan term."
        );

        personalLoanTerm.focus();

        return null;

    }


    return {

        loanAmount,
        annualInterestRate,
        loanTermYears,
        totalMonths

    };

}


/* ==========================================================
   CALCULATE MONTHLY PAYMENT
========================================================== */

function calculatePersonalLoanPayment(
    principal,
    annualInterestRate,
    totalMonths
) {

    if (
        annualInterestRate === 0
    ) {

        return principal / totalMonths;

    }


    const monthlyInterestRate =
        annualInterestRate / 100 / 12;


    const growthFactor =
        Math.pow(
            1 + monthlyInterestRate,
            totalMonths
        );


    const monthlyPayment =
        principal *
        (
            monthlyInterestRate *
            growthFactor
        ) /
        (
            growthFactor - 1
        );


    return monthlyPayment;

}


/* ==========================================================
   GENERATE AMORTIZATION SCHEDULE
========================================================== */

function generatePersonalLoanAmortizationSchedule(
    principal,
    annualInterestRate,
    totalMonths,
    monthlyPayment
) {

    const schedule = [];

    let remainingBalance =
        principal;

    const monthlyInterestRate =
        annualInterestRate / 100 / 12;


    for (
        let month = 1;
        month <= totalMonths;
        month++
    ) {

        const startingBalance =
            remainingBalance;


        let interestPayment =
            remainingBalance *
            monthlyInterestRate;


        let principalPayment =
            monthlyPayment -
            interestPayment;


        /*
        ------------------------------------------------------
        HANDLE FINAL PAYMENT ROUNDING
        ------------------------------------------------------
        */

        if (
            month === totalMonths
        ) {

            principalPayment =
                remainingBalance;

            interestPayment =
                monthlyPayment -
                principalPayment;

        }


        /*
        ------------------------------------------------------
        PREVENT NEGATIVE BALANCE
        ------------------------------------------------------
        */

        if (
            principalPayment >
            remainingBalance
        ) {

            principalPayment =
                remainingBalance;

        }


        remainingBalance -=
            principalPayment;


        if (
            Math.abs(remainingBalance) <
            0.005
        ) {

            remainingBalance = 0;

        }


        schedule.push({

            month,
            startingBalance,
            payment:
                principalPayment +
                interestPayment,
            principalPayment,
            interestPayment,
            remainingBalance

        });

    }


    return schedule;

}


/* ==========================================================
   CALCULATE PERSONAL LOAN
========================================================== */

function calculatePersonalLoan() {

    clearPersonalLoanError();


    const inputs =
        validatePersonalLoanInputs();


    if (!inputs) {

        return;

    }


    const {

        loanAmount,
        annualInterestRate,
        loanTermYears,
        totalMonths

    } = inputs;


    const currencyCode =
        personalLoanCurrency.value;


    /*
    ----------------------------------------------------------
    MONTHLY PAYMENT
    ----------------------------------------------------------
    */

    const monthlyPayment =
        calculatePersonalLoanPayment(
            loanAmount,
            annualInterestRate,
            totalMonths
        );


    /*
    ----------------------------------------------------------
    AMORTIZATION SCHEDULE
    ----------------------------------------------------------
    */

    const amortizationSchedule =
        generatePersonalLoanAmortizationSchedule(
            loanAmount,
            annualInterestRate,
            totalMonths,
            monthlyPayment
        );


    /*
    ----------------------------------------------------------
    TOTAL PAYMENTS
    ----------------------------------------------------------
    */

    let totalPayments =
        amortizationSchedule.reduce(
            function (
                total,
                row
            ) {

                return total +
                    row.payment;

            },
            0
        );


    /*
    ----------------------------------------------------------
    TOTAL INTEREST
    ----------------------------------------------------------
    */

    const totalInterest =
        totalPayments -
        loanAmount;


    /*
    ----------------------------------------------------------
    UPDATE SUMMARY
    ----------------------------------------------------------
    */

    summaryPersonalLoanAmount.textContent =
        formatPersonalLoanCurrency(
            loanAmount,
            currencyCode
        );


    summaryPersonalLoanPayment.textContent =
        formatPersonalLoanCurrency(
            monthlyPayment,
            currencyCode
        );


    summaryPersonalLoanTotalPayments.textContent =
        formatPersonalLoanCurrency(
            totalPayments,
            currencyCode
        );


    summaryPersonalLoanInterest.textContent =
        formatPersonalLoanCurrency(
            totalInterest,
            currencyCode
        );


    /*
    ----------------------------------------------------------
    GENERATE YEARLY BREAKDOWN
    ----------------------------------------------------------
    */

    const yearlyBreakdown = [];


    for (
        let year = 1;
        year <= loanTermYears;
        year++
    ) {

        const startIndex =
            (year - 1) * 12;

        const endIndex =
            Math.min(
                year * 12,
                amortizationSchedule.length
            );


        const yearRows =
            amortizationSchedule.slice(
                startIndex,
                endIndex
            );


        const yearlyPayments =
            yearRows.reduce(
                function (
                    total,
                    row
                ) {

                    return total +
                        row.payment;

                },
                0
            );


        const yearlyPrincipal =
            yearRows.reduce(
                function (
                    total,
                    row
                ) {

                    return total +
                        row.principalPayment;

                },
                0
            );


        const yearlyInterest =
            yearRows.reduce(
                function (
                    total,
                    row
                ) {

                    return total +
                        row.interestPayment;

                },
                0
            );


        const endingBalance =
            yearRows.length > 0
                ? yearRows[
                    yearRows.length - 1
                ].remainingBalance
                : 0;


        yearlyBreakdown.push({

            year,
            payments:
                yearlyPayments,

            principal:
                yearlyPrincipal,

            interest:
                yearlyInterest,

            endingBalance

        });

    }


    /*
    ----------------------------------------------------------
    BUILD YEARLY BREAKDOWN HTML
    ----------------------------------------------------------
    */

    const yearlyBreakdownRows =
        yearlyBreakdown.map(
            function (row) {

                return `

                    <tr>

                        <td>
                            ${row.year}
                        </td>

                        <td>
                            ${formatPersonalLoanCurrency(
                                row.payments,
                                currencyCode
                            )}
                        </td>

                        <td>
                            ${formatPersonalLoanCurrency(
                                row.principal,
                                currencyCode
                            )}
                        </td>

                        <td>
                            ${formatPersonalLoanCurrency(
                                row.interest,
                                currencyCode
                            )}
                        </td>

                        <td>
                            ${formatPersonalLoanCurrency(
                                row.endingBalance,
                                currencyCode
                            )}
                        </td>

                    </tr>

                `;

            }
        ).join("");


    /*
    ----------------------------------------------------------
    BUILD FULL AMORTIZATION TABLE
    ----------------------------------------------------------
    */

    const amortizationRows =
        amortizationSchedule.map(
            function (row) {

                return `

                    <tr>

                        <td>
                            ${row.month}
                        </td>

                        <td>
                            ${formatPersonalLoanCurrency(
                                row.payment,
                                currencyCode
                            )}
                        </td>

                        <td>
                            ${formatPersonalLoanCurrency(
                                row.principalPayment,
                                currencyCode
                            )}
                        </td>

                        <td>
                            ${formatPersonalLoanCurrency(
                                row.interestPayment,
                                currencyCode
                            )}
                        </td>

                        <td>
                            ${formatPersonalLoanCurrency(
                                row.remainingBalance,
                                currencyCode
                            )}
                        </td>

                    </tr>

                `;

            }
        ).join("");


    /*
    ----------------------------------------------------------
    RESULTS HTML
    ----------------------------------------------------------
    */

    personalLoanResultContent.innerHTML = `

        <div class="result-grid">

            <div class="result-card">

                <h3>
                    Loan Amount
                </h3>

                <p>
                    ${formatPersonalLoanCurrency(
                        loanAmount,
                        currencyCode
                    )}
                </p>

            </div>


            <div class="result-card">

                <h3>
                    Estimated Monthly Payment
                </h3>

                <p>
                    ${formatPersonalLoanCurrency(
                        monthlyPayment,
                        currencyCode
                    )}
                </p>

            </div>


            <div class="result-card">

                <h3>
                    Estimated Total Payments
                </h3>

                <p>
                    ${formatPersonalLoanCurrency(
                        totalPayments,
                        currencyCode
                    )}
                </p>

            </div>


            <div class="result-card">

                <h3>
                    Estimated Total Interest
                </h3>

                <p>
                    ${formatPersonalLoanCurrency(
                        totalInterest,
                        currencyCode
                    )}
                </p>

            </div>

        </div>


        <div class="info-box">

            <p>

                <strong>
                    Loan Term:
                </strong>

                ${loanTermYears}
                ${loanTermYears === 1 ? "year" : "years"}

            </p>


            <p>

                <strong>
                    Annual Interest Rate:
                </strong>

                ${formatPersonalLoanNumber(
                    annualInterestRate
                )}%

            </p>


            <p>

                <strong>
                    Number of Payments:
                </strong>

                ${totalMonths}

            </p>


            <p>

                <strong>
                    Estimated Total Interest:
                </strong>

                ${formatPersonalLoanCurrency(
                    totalInterest,
                    currencyCode
                )}

            </p>

        </div>


        <h3>
            Year-by-Year Loan Breakdown
        </h3>


        <div class="table-container">

            <table>

                <thead>

                    <tr>

                        <th>
                            Year
                        </th>

                        <th>
                            Payments
                        </th>

                        <th>
                            Principal
                        </th>

                        <th>
                            Interest
                        </th>

                        <th>
                            Ending Balance
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${yearlyBreakdownRows}

                </tbody>

            </table>

        </div>


        <h3>
            Monthly Amortization Schedule
        </h3>


        <p class="small-text">

            The table below shows how each estimated monthly
            payment is divided between principal and interest.

        </p>


        <div class="table-container">

            <table>

                <thead>

                    <tr>

                        <th>
                            Payment #
                        </th>

                        <th>
                            Payment
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

                    ${amortizationRows}

                </tbody>

            </table>

        </div>


        <p class="small-text">

            This calculation assumes a standard fixed-rate
            installment loan with regular monthly payments.

            Actual lender calculations may differ because of
            fees, rounding, payment timing, taxes, insurance,
            and other loan-specific terms.

        </p>

    `;


    /*
    ----------------------------------------------------------
    SHOW RESULTS
    ----------------------------------------------------------
    */

    personalLoanResult.hidden = false;


    /*
    ----------------------------------------------------------
    SCROLL TO RESULTS
    ----------------------------------------------------------
    */

    personalLoanResult.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


/* ==========================================================
   RESET CALCULATOR
========================================================== */

function resetPersonalLoanCalculator() {

    personalLoanCurrency.value =
        "USD";

    personalLoanAmount.value =
        "";

    personalLoanInterestRate.value =
        "";

    personalLoanTerm.value =
        "";


    clearPersonalLoanError();


    personalLoanResultContent.innerHTML =
        "";


    personalLoanResult.hidden =
        true;


    summaryPersonalLoanAmount.textContent =
        formatPersonalLoanCurrency(
            0,
            "USD"
        );


    summaryPersonalLoanPayment.textContent =
        formatPersonalLoanCurrency(
            0,
            "USD"
        );


    summaryPersonalLoanTotalPayments.textContent =
        formatPersonalLoanCurrency(
            0,
            "USD"
        );


    summaryPersonalLoanInterest.textContent =
        formatPersonalLoanCurrency(
            0,
            "USD"
        );


    personalLoanAmount.focus();

}


/* ==========================================================
   EVENT LISTENERS
========================================================== */

if (
    calculatePersonalLoanButton
) {

    calculatePersonalLoanButton.addEventListener(
        "click",
        calculatePersonalLoan
    );

}


if (
    resetPersonalLoanButton
) {

    resetPersonalLoanButton.addEventListener(
        "click",
        resetPersonalLoanCalculator
    );

}


/* ==========================================================
   ENTER KEY SUPPORT
========================================================== */

[
    personalLoanAmount,
    personalLoanInterestRate,
    personalLoanTerm
].forEach(
    function (input) {

        if (!input) {

            return;

        }


        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    calculatePersonalLoan();

                }

            }
        );

    }
);


/* ==========================================================
   UPDATE CURRENCY DISPLAY WHEN CURRENCY CHANGES
========================================================== */

if (
    personalLoanCurrency
) {

    personalLoanCurrency.addEventListener(
        "change",
        function () {

            const currencyCode =
                personalLoanCurrency.value;


            /*
            --------------------------------------------------
            UPDATE SUMMARY PLACEHOLDERS
            --------------------------------------------------
            */

            if (
                personalLoanResult.hidden
            ) {

                summaryPersonalLoanAmount.textContent =
                    formatPersonalLoanCurrency(
                        0,
                        currencyCode
                    );


                summaryPersonalLoanPayment.textContent =
                    formatPersonalLoanCurrency(
                        0,
                        currencyCode
                    );


                summaryPersonalLoanTotalPayments.textContent =
                    formatPersonalLoanCurrency(
                        0,
                        currencyCode
                    );


                summaryPersonalLoanInterest.textContent =
                    formatPersonalLoanCurrency(
                        0,
                        currencyCode
                    );

            }

        }
    );

}


/* ==========================================================
   INITIAL STATE
========================================================== */

resetPersonalLoanCalculator();

