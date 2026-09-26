"use strict";

/* ==========================================================
   CalclyWorld Credit Card Payoff Calculator
   USA / Global Version
========================================================== */

document.addEventListener("DOMContentLoaded", function () {
    initializeCreditCardPayoffCalculator();
});

/* ==========================================================
   INITIALIZATION
========================================================== */

function initializeCreditCardPayoffCalculator() {

    const calculateButton = document.getElementById("calculate-credit-card");
    const resetButton = document.getElementById("reset-credit-card");

    if (!calculateButton || !resetButton) {
        console.error(
            "Credit Card Payoff Calculator: Calculate or Reset button not found."
        );
        return;
    }

    calculateButton.addEventListener(
        "click",
        calculateCreditCardPayoff
    );

    resetButton.addEventListener(
        "click",
        resetCreditCardCalculator
    );

    const inputElements = document.querySelectorAll(
        "#credit-card-balance, #credit-card-apr, #monthly-payment"
    );

    inputElements.forEach(function (input) {

        input.addEventListener("keydown", function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                calculateCreditCardPayoff();

            }

        });

    });

}

/* ==========================================================
   MAIN CALCULATION
========================================================== */

function calculateCreditCardPayoff() {

    clearCreditCardError();

    const balanceElement =
        document.getElementById("credit-card-balance");

    const aprElement =
        document.getElementById("credit-card-apr");

    const paymentElement =
        document.getElementById("monthly-payment");

    if (
        !balanceElement ||
        !aprElement ||
        !paymentElement
    ) {

        showCreditCardError(
            "The calculator could not load correctly. Please refresh the page and try again."
        );

        return;

    }

    const balance =
        parseFloat(balanceElement.value);

    const apr =
        parseFloat(aprElement.value);

    const monthlyPayment =
        parseFloat(paymentElement.value);

    /* ======================================================
       VALIDATION
    ====================================================== */

    if (
        !Number.isFinite(balance) ||
        balance <= 0
    ) {

        showCreditCardError(
            "Please enter a valid credit card balance greater than $0."
        );

        balanceElement.focus();

        return;

    }

    if (
        !Number.isFinite(apr) ||
        apr < 0 ||
        apr > 100
    ) {

        showCreditCardError(
            "Please enter an APR between 0% and 100%."
        );

        aprElement.focus();

        return;

    }

    if (
        !Number.isFinite(monthlyPayment) ||
        monthlyPayment <= 0
    ) {

        showCreditCardError(
            "Please enter a monthly payment greater than $0."
        );

        paymentElement.focus();

        return;

    }

    /* ======================================================
       ZERO APR CASE
    ====================================================== */

    if (apr === 0) {

        const payoffMonths =
            Math.ceil(balance / monthlyPayment);

        const totalPaid =
            balance;

        const totalInterest =
            0;

        const schedule =
            generatePayoffSchedule(
                balance,
                apr,
                monthlyPayment
            );

        const data = {

            balance: balance,

            apr: apr,

            monthlyPayment: monthlyPayment,

            payoffMonths: payoffMonths,

            totalPaid: totalPaid,

            totalInterest: totalInterest,

            schedule: schedule

        };

        displayCreditCardResults(data);

        return;

    }

    /* ======================================================
       MONTHLY INTEREST RATE
    ====================================================== */

    const monthlyInterestRate =
        apr / 100 / 12;

    /* ======================================================
       PAYMENT MUST EXCEED MONTHLY INTEREST
    ====================================================== */

    const firstMonthInterest =
        balance * monthlyInterestRate;

    if (
        monthlyPayment <= firstMonthInterest
    ) {

        showCreditCardError(
            "Your monthly payment is too low to pay off this credit card balance. Please enter a payment greater than the estimated first month's interest of " +
            formatCurrency(firstMonthInterest) +
            "."
        );

        paymentElement.focus();

        return;

    }

    /* ======================================================
       CALCULATE PAYOFF
    ====================================================== */

    let remainingBalance =
        balance;

    let totalInterest =
        0;

    let totalPaid =
        0;

    let payoffMonths =
        0;

    const schedule = [];

    const MAX_MONTHS = 1200;

    while (
        remainingBalance > 0.005 &&
        payoffMonths < MAX_MONTHS
    ) {

        payoffMonths++;

        const interest =
            remainingBalance *
            monthlyInterestRate;

        totalInterest += interest;

        let payment =
            monthlyPayment;

        const amountNeeded =
            remainingBalance +
            interest;

        if (
            payment > amountNeeded
        ) {

            payment =
                amountNeeded;

        }

        remainingBalance =
            remainingBalance +
            interest -
            payment;

        if (
            remainingBalance < 0.005
        ) {

            remainingBalance =
                0;

        }

        totalPaid += payment;

        schedule.push({

            month:
                payoffMonths,

            payment:
                payment,

            interest:
                interest,

            principal:
                payment - interest,

            balance:
                remainingBalance

        });

    }

    /* ======================================================
       SAFETY CHECK
    ====================================================== */

    if (
        payoffMonths >= MAX_MONTHS &&
        remainingBalance > 0.005
    ) {

        showCreditCardError(
            "The payoff period is longer than the calculator's supported limit. Please increase your monthly payment."
        );

        return;

    }

    /* ======================================================
       FINAL DATA
    ====================================================== */

    const data = {

        balance:
            balance,

        apr:
            apr,

        monthlyPayment:
            monthlyPayment,

        payoffMonths:
            payoffMonths,

        totalPaid:
            totalPaid,

        totalInterest:
            totalInterest,

        schedule:
            schedule

    };

    displayCreditCardResults(data);

}

/* ==========================================================
   DISPLAY RESULTS
========================================================== */

function displayCreditCardResults(data) {

    const resultBox =
        document.getElementById("credit-card-result");

    const resultContent =
        document.getElementById(
            "credit-card-result-content"
        );

    if (
        !resultBox ||
        !resultContent
    ) {

        showCreditCardError(
            "The results section could not be loaded. Please refresh the page and try again."
        );

        return;

    }

    const payoffYears =
        Math.floor(
            data.payoffMonths / 12
        );

    const remainingMonths =
        data.payoffMonths % 12;

    let payoffTimeText = "";

    if (
        payoffYears > 0
    ) {

        payoffTimeText +=
            payoffYears +
            (
                payoffYears === 1
                    ? " year"
                    : " years"
            );

    }

    if (
        remainingMonths > 0
    ) {

        if (
            payoffTimeText
        ) {

            payoffTimeText +=
                " and ";

        }

        payoffTimeText +=
            remainingMonths +
            (
                remainingMonths === 1
                    ? " month"
                    : " months"
            );

    }

    if (
        !payoffTimeText
    ) {

        payoffTimeText =
            "Less than 1 month";

    }

    const totalReturnPercentage =
        data.balance > 0
            ? (
                data.totalInterest /
                data.balance
            ) * 100
            : 0;

    resultContent.innerHTML = `

        <div class="result-summary">

            <div class="result-item">

                <strong>
                    Starting Balance
                </strong>

                <span>
                    ${formatCurrency(data.balance)}
                </span>

            </div>


            <div class="result-item">

                <strong>
                    APR
                </strong>

                <span>
                    ${data.apr.toFixed(2)}%
                </span>

            </div>


            <div class="result-item">

                <strong>
                    Monthly Payment
                </strong>

                <span>
                    ${formatCurrency(data.monthlyPayment)}
                </span>

            </div>


            <div class="result-item">

                <strong>
                    Estimated Payoff Time
                </strong>

                <span>
                    ${payoffTimeText}
                </span>

            </div>


            <div class="result-item">

                <strong>
                    Estimated Interest
                </strong>

                <span>
                    ${formatCurrency(data.totalInterest)}
                </span>

            </div>


            <div class="result-item">

                <strong>
                    Estimated Total Paid
                </strong>

                <span>
                    ${formatCurrency(data.totalPaid)}
                </span>

            </div>


            <div class="result-item">

                <strong>
                    Interest as Percentage of Starting Balance
                </strong>

                <span>
                    ${totalReturnPercentage.toFixed(2)}%
                </span>

            </div>


            <div class="result-item result-highlight">

                <strong>
                    Debt-Free After
                </strong>

                <span>
                    ${data.payoffMonths} months
                </span>

            </div>

        </div>


        <div class="payoff-breakdown">

            <h3>
                Payoff Schedule
            </h3>

            <p class="small-text">

                This table shows an estimated month-by-month breakdown
                of your payments, interest, principal reduction,
                and remaining balance.

            </p>

            <div class="table-responsive">

                <table class="growth-table">

                    <thead>

                        <tr>

                            <th scope="col">
                                Month
                            </th>

                            <th scope="col">
                                Payment
                            </th>

                            <th scope="col">
                                Interest
                            </th>

                            <th scope="col">
                                Principal
                            </th>

                            <th scope="col">
                                Remaining Balance
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        ${generatePayoffTableRows(
                            data.schedule
                        )}

                    </tbody>

                </table>

            </div>

        </div>

    `;

    resultBox.hidden =
        false;

    updateCreditCardSummary(
        data
    );

    resultBox.scrollIntoView({

        behavior:
            "smooth",

        block:
            "start"

    });

}

/* ==========================================================
   PAYOFF TABLE
========================================================== */

function generatePayoffTableRows(
    schedule
) {

    return schedule.map(
        function (row) {

            return `

                <tr>

                    <td>
                        ${row.month}
                    </td>

                    <td>
                        ${formatCurrency(row.payment)}
                    </td>

                    <td>
                        ${formatCurrency(row.interest)}
                    </td>

                    <td>
                        ${formatCurrency(row.principal)}
                    </td>

                    <td>
                        <strong>
                            ${formatCurrency(row.balance)}
                        </strong>
                    </td>

                </tr>

            `;

        }
    ).join("");

}

/* ==========================================================
   SUMMARY
========================================================== */

function updateCreditCardSummary(
    data
) {

    const startingBalance =
        document.getElementById(
            "summary-starting-balance"
        );

    const monthlyPayment =
        document.getElementById(
            "summary-monthly-payment"
        );

    const interest =
        document.getElementById(
            "summary-interest"
        );

    const totalPaid =
        document.getElementById(
            "summary-total-paid"
        );

    const payoffTime =
        document.getElementById(
            "summary-payoff-time"
        );

    if (
        startingBalance
    ) {

        startingBalance.textContent =
            formatCurrency(
                data.balance
            );

    }

    if (
        monthlyPayment
    ) {

        monthlyPayment.textContent =
            formatCurrency(
                data.monthlyPayment
            );

    }

    if (
        interest
    ) {

        interest.textContent =
            formatCurrency(
                data.totalInterest
            );

    }

    if (
        totalPaid
    ) {

        totalPaid.textContent =
            formatCurrency(
                data.totalPaid
            );

    }

    if (
        payoffTime
    ) {

        payoffTime.textContent =
            data.payoffMonths +
            (
                data.payoffMonths === 1
                    ? " month"
                    : " months"
            );

    }

}

/* ==========================================================
   CURRENCY FORMAT
========================================================== */

function formatCurrency(
    amount
) {

    try {

        return new Intl.NumberFormat(
            "en-US",
            {

                style:
                    "currency",

                currency:
                    "USD",

                minimumFractionDigits:
                    2,

                maximumFractionDigits:
                    2

            }
        ).format(amount);

    } catch (error) {

        return (
            "$" +
            Number(amount).toFixed(2)
        );

    }

}

/* ==========================================================
   ERROR HANDLING
========================================================== */

function showCreditCardError(
    message
) {

    const errorBox =
        document.getElementById(
            "credit-card-error"
        );

    if (
        !errorBox
    ) {

        console.error(
            message
        );

        return;

    }

    errorBox.textContent =
        message;

    errorBox.hidden =
        false;

    errorBox.scrollIntoView({

        behavior:
            "smooth",

        block:
            "center"

    });

}

/* ==========================================================
   CLEAR ERROR
========================================================== */

function clearCreditCardError() {

    const errorBox =
        document.getElementById(
            "credit-card-error"
        );

    if (
        !errorBox
    ) {

        return;

    }

    errorBox.textContent =
        "";

    errorBox.hidden =
        true;

}

/* ==========================================================
   RESET
========================================================== */

function resetCreditCardCalculator() {

    const balanceElement =
        document.getElementById(
            "credit-card-balance"
        );

    const aprElement =
        document.getElementById(
            "credit-card-apr"
        );

    const paymentElement =
        document.getElementById(
            "monthly-payment"
        );

    const resultBox =
        document.getElementById(
            "credit-card-result"
        );

    const resultContent =
        document.getElementById(
            "credit-card-result-content"
        );

    if (
        balanceElement
    ) {

        balanceElement.value =
            "";

    }

    if (
        aprElement
    ) {

        aprElement.value =
            "";

    }

    if (
        paymentElement
    ) {

        paymentElement.value =
            "";

    }

    clearCreditCardError();

    if (
        resultBox
    ) {

        resultBox.hidden =
            true;

    }

    if (
        resultContent
    ) {

        resultContent.innerHTML =
            "";

    }

    updateCreditCardSummary({

        balance:
            0,

        monthlyPayment:
            0,

        totalInterest:
            0,

        totalPaid:
            0,

        payoffMonths:
            0

    });

    if (
        balanceElement
    ) {

        balanceElement.focus();

    }

}

/* ==========================================================
   END
========================================================== */