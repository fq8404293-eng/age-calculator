"use strict";

/* ==========================================================
   CalclyWorld Debt Payoff Calculator
   Version 2.0
========================================================== */


/* ==========================================================
   INITIALIZATION
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeDebtPayoffCalculator();

    }
);


/* ==========================================================
   MAIN INITIALIZATION
========================================================== */

function initializeDebtPayoffCalculator() {

    const form =
        document.getElementById(
            "debt-payoff-form"
        );

    const calculateButton =
        document.getElementById(
            "calculate-debt-payoff"
        );

    const resetButton =
        document.getElementById(
            "reset-debt-payoff"
        );


    /*
       The calculator can still work if the form
       exists but one of the optional buttons does not.
    */

    if (!form) {

        console.error(
            "Debt Payoff Calculator: Calculator form not found."
        );

        return;

    }


    /* ======================================================
       FORM SUBMISSION
    ======================================================= */

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            calculateDebtPayoff();

        }
    );


    /* ======================================================
       RESET BUTTON
    ======================================================= */

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            function () {

                resetDebtPayoffCalculator();

            }
        );

    }


    /* ======================================================
       ENTER KEY SUPPORT
    ======================================================= */

    const inputElements =
        document.querySelectorAll(
            "#debt-balance, #debt-apr, #debt-monthly-payment"
        );


    inputElements.forEach(
        function (input) {

            input.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        calculateDebtPayoff();

                    }

                }
            );

        }
    );


    /*
       Make sure the result area starts hidden.
    */

    const resultBox =
        document.getElementById(
            "debt-payoff-result"
        );


    if (resultBox) {

        resultBox.hidden = true;

    }

}


/* ==========================================================
   MAIN CALCULATION
========================================================== */

function calculateDebtPayoff() {

    clearDebtPayoffError();


    /* ======================================================
       GET INPUT ELEMENTS
    ======================================================= */

    const balanceElement =
        document.getElementById(
            "debt-balance"
        );


    const aprElement =
        document.getElementById(
            "debt-apr"
        );


    const monthlyPaymentElement =
        document.getElementById(
            "debt-monthly-payment"
        );


    if (
        !balanceElement ||
        !aprElement ||
        !monthlyPaymentElement
    ) {

        showDebtPayoffError(
            "The calculator could not load correctly. Please refresh the page and try again."
        );

        return;

    }


    /* ======================================================
       READ VALUES
    ======================================================= */

    const startingBalance =
        parseFloat(
            balanceElement.value
        );


    const annualAPR =
        parseFloat(
            aprElement.value
        );


    const monthlyPayment =
        parseFloat(
            monthlyPaymentElement.value
        );


    /* ======================================================
       VALIDATE STARTING BALANCE
    ======================================================= */

    if (
        !Number.isFinite(
            startingBalance
        ) ||
        startingBalance <= 0
    ) {

        showDebtPayoffError(
            "Please enter a valid starting debt balance greater than $0."
        );

        balanceElement.focus();

        return;

    }


    /* ======================================================
       VALIDATE APR
    ======================================================= */

    if (
        !Number.isFinite(
            annualAPR
        ) ||
        annualAPR < 0 ||
        annualAPR > 100
    ) {

        showDebtPayoffError(
            "Please enter an APR between 0% and 100%."
        );

        aprElement.focus();

        return;

    }


    /* ======================================================
       VALIDATE MONTHLY PAYMENT
    ======================================================= */

    if (
        !Number.isFinite(
            monthlyPayment
        ) ||
        monthlyPayment <= 0
    ) {

        showDebtPayoffError(
            "Please enter a monthly payment greater than $0."
        );

        monthlyPaymentElement.focus();

        return;

    }


    /* ======================================================
       MONTHLY INTEREST RATE
    ======================================================= */

    const monthlyInterestRate =
        annualAPR / 100 / 12;


    /* ======================================================
       ZERO APR CALCULATION
    ======================================================= */

    if (
        annualAPR === 0
    ) {

        calculateZeroInterestDebt(
            startingBalance,
            monthlyPayment
        );

        return;

    }


    /* ======================================================
       FIRST MONTH INTEREST
    ======================================================= */

    const firstMonthInterest =
        startingBalance *
        monthlyInterestRate;


    /* ======================================================
       PAYMENT TOO LOW CHECK
    ======================================================= */

    if (
        monthlyPayment <=
        firstMonthInterest
    ) {

        showDebtPayoffError(

            "Your monthly payment is not high enough to reduce this debt. " +

            "At the current APR, the estimated first month's interest is " +

            formatCurrency(
                firstMonthInterest
            ) +

            ". Please enter a monthly payment greater than this amount."

        );


        monthlyPaymentElement.focus();

        return;

    }


    /* ======================================================
       CALCULATE PAYOFF SCHEDULE
    ======================================================= */

    let remainingBalance =
        startingBalance;


    let totalInterest =
        0;


    let totalPaid =
        0;


    let month =
        0;


    const schedule =
        [];


    /*
       Maximum calculation period:
       100 years = 1,200 months.
    */

    const maximumMonths =
        1200;


    while (
        remainingBalance > 0.005 &&
        month < maximumMonths
    ) {

        month++;


        /* ==================================================
           CALCULATE MONTHLY INTEREST
        =================================================== */

        const interest =
            remainingBalance *
            monthlyInterestRate;


        /* ==================================================
           NORMAL PAYMENT
        =================================================== */

        let payment =
            monthlyPayment;


        let principal =
            payment -
            interest;


        /* ==================================================
           FINAL PAYMENT
        =================================================== */

        if (
            payment >=
            remainingBalance +
            interest
        ) {

            payment =
                remainingBalance +
                interest;


            principal =
                remainingBalance;

        }


        /* ==================================================
           UPDATE BALANCE
        =================================================== */

        remainingBalance -=
            principal;


        /*
           Avoid tiny floating-point
           balances caused by JavaScript
           decimal calculations.
        */

        if (
            remainingBalance < 0.005
        ) {

            remainingBalance = 0;

        }


        /* ==================================================
           UPDATE TOTALS
        =================================================== */

        totalInterest +=
            interest;


        totalPaid +=
            payment;


        /* ==================================================
           ADD MONTH TO SCHEDULE
        =================================================== */

        schedule.push({

            month:
                month,

            payment:
                payment,

            interest:
                interest,

            principal:
                principal,

            remainingBalance:
                remainingBalance

        });

    }


    /* ======================================================
       SAFETY CHECK
    ======================================================= */

    if (
        month >= maximumMonths &&
        remainingBalance > 0
    ) {

        showDebtPayoffError(

            "The debt could not be paid off within the calculator's maximum 100-year calculation period. Please check your debt balance, APR, and monthly payment."

        );

        return;

    }


    /* ======================================================
       PREPARE RESULTS
    ======================================================= */

    const calculationData = {

        startingBalance:
            startingBalance,

        annualAPR:
            annualAPR,

        monthlyPayment:
            monthlyPayment,

        payoffMonths:
            month,

        totalInterest:
            totalInterest,

        totalPaid:
            totalPaid,

        schedule:
            schedule

    };


    /* ======================================================
       DISPLAY RESULTS
    ======================================================= */

    displayDebtPayoffResults(
        calculationData
    );

}


/* ==========================================================
   ZERO INTEREST CALCULATION
========================================================== */

function calculateZeroInterestDebt(
    startingBalance,
    monthlyPayment
) {

    const payoffMonths =
        Math.ceil(
            startingBalance /
            monthlyPayment
        );


    const schedule =
        generateZeroInterestSchedule(

            startingBalance,

            monthlyPayment,

            payoffMonths

        );


    let totalPaid =
        0;


    schedule.forEach(
        function (row) {

            totalPaid +=
                row.payment;

        }
    );


    const calculationData = {

        startingBalance:
            startingBalance,

        annualAPR:
            0,

        monthlyPayment:
            monthlyPayment,

        payoffMonths:
            payoffMonths,

        totalInterest:
            0,

        totalPaid:
            totalPaid,

        schedule:
            schedule

    };


    displayDebtPayoffResults(
        calculationData
    );

}


/* ==========================================================
   ZERO INTEREST SCHEDULE
========================================================== */

function generateZeroInterestSchedule(
    startingBalance,
    monthlyPayment,
    payoffMonths
) {

    const schedule =
        [];


    let remainingBalance =
        startingBalance;


    for (
        let month = 1;
        month <= payoffMonths;
        month++
    ) {

        const payment =
            Math.min(

                monthlyPayment,

                remainingBalance

            );


        const principal =
            payment;


        remainingBalance -=
            principal;


        if (
            remainingBalance < 0.005
        ) {

            remainingBalance = 0;

        }


        schedule.push({

            month:
                month,

            payment:
                payment,

            interest:
                0,

            principal:
                principal,

            remainingBalance:
                remainingBalance

        });

    }


    return schedule;

}


/* ==========================================================
   DISPLAY RESULTS
========================================================== */

function displayDebtPayoffResults(
    data
) {

    const resultBox =
        document.getElementById(
            "debt-payoff-result"
        );


    const resultContent =
        document.getElementById(
            "debt-payoff-result-content"
        );


    if (
        !resultBox ||
        !resultContent
    ) {

        showDebtPayoffError(

            "The results section could not be loaded. Please refresh the page and try again."

        );

        return;

    }


    /* ======================================================
       PAYOFF TIME
    ======================================================= */

    const payoffTimeText =
        formatPayoffTime(
            data.payoffMonths
        );


    /* ======================================================
       INTEREST PERCENTAGE
    ======================================================= */

    const interestPercentage =

        data.startingBalance > 0

            ? (

                data.totalInterest /

                data.startingBalance

            ) * 100

            : 0;


    /* ======================================================
       RESULT HTML
    ======================================================= */

    resultContent.innerHTML = `

        <div class="result-summary">


            <div class="result-item">

                <strong>
                    Starting Debt
                </strong>

                <span>
                    ${formatCurrency(
                        data.startingBalance
                    )}
                </span>

            </div>


            <div class="result-item">

                <strong>
                    APR
                </strong>

                <span>
                    ${data.annualAPR.toFixed(2)}%
                </span>

            </div>


            <div class="result-item">

                <strong>
                    Monthly Payment
                </strong>

                <span>
                    ${formatCurrency(
                        data.monthlyPayment
                    )}
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
                    ${formatCurrency(
                        data.totalInterest
                    )}
                </span>

            </div>


            <div class="result-item">

                <strong>
                    Estimated Total Paid
                </strong>

                <span>
                    ${formatCurrency(
                        data.totalPaid
                    )}
                </span>

            </div>


            <div class="result-item">

                <strong>
                    Interest as Percentage of Starting Debt
                </strong>

                <span>
                    ${interestPercentage.toFixed(2)}%
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


        <div class="debt-payoff-breakdown">


            <h3>
                Payoff Schedule
            </h3>


            <p class="small-text">

                This table shows an estimated month-by-month breakdown of your payments, interest, principal reduction, and remaining balance.

            </p>


            <div class="table-wrapper">


                <table class="payoff-table">


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


                    <tbody id="debt-payoff-table-body">

                    </tbody>


                </table>


            </div>


        </div>

    `;


    /* ======================================================
       GENERATE TABLE
    ======================================================= */

    generateDebtPayoffSchedule(
        data.schedule
    );


    /* ======================================================
       SHOW RESULTS
    ======================================================= */

    resultBox.hidden =
        false;


    /* ======================================================
       SCROLL TO RESULTS
    ======================================================= */

    resultBox.scrollIntoView({

        behavior:
            "smooth",

        block:
            "start"

    });

}


/* ==========================================================
   GENERATE PAYOFF SCHEDULE
========================================================== */

function generateDebtPayoffSchedule(
    schedule
) {

    const tableBody =
        document.getElementById(
            "debt-payoff-table-body"
        );


    if (!tableBody) {

        return;

    }


    tableBody.innerHTML =
        "";


    schedule.forEach(
        function (row) {

            const tableRow =
                document.createElement(
                    "tr"
                );


            tableRow.innerHTML = `

                <td>
                    ${row.month}
                </td>


                <td>
                    ${formatCurrency(
                        row.payment
                    )}
                </td>


                <td>
                    ${formatCurrency(
                        row.interest
                    )}
                </td>


                <td>
                    ${formatCurrency(
                        row.principal
                    )}
                </td>


                <td>

                    <strong>

                        ${formatCurrency(
                            row.remainingBalance
                        )}

                    </strong>

                </td>

            `;


            tableBody.appendChild(
                tableRow
            );

        }
    );

}


/* ==========================================================
   PAYOFF TIME FORMAT
========================================================== */

function formatPayoffTime(
    totalMonths
) {

    if (
        totalMonths <= 0
    ) {

        return "0 months";

    }


    const years =
        Math.floor(
            totalMonths / 12
        );


    const months =
        totalMonths % 12;


    if (
        years > 0 &&
        months > 0
    ) {

        return (

            years +

            (
                years === 1
                    ? " year "
                    : " years "
            ) +

            months +

            (
                months === 1
                    ? " month"
                    : " months"
            )

        );

    }


    if (
        years > 0
    ) {

        return (

            years +

            (
                years === 1
                    ? " year"
                    : " years"
            )

        );

    }


    return (

        totalMonths +

        (
            totalMonths === 1
                ? " month"
                : " months"
        )

    );

}
/* ==========================================================
   MAIN CALCULATION
========================================================== */

function calculateDebtPayoff() {

    clearDebtPayoffError();

    const balanceElement =
        document.getElementById("debt-balance");

    const aprElement =
        document.getElementById("debt-apr");

    const monthlyPaymentElement =
        document.getElementById("debt-monthly-payment");

    if (
        !balanceElement ||
        !aprElement ||
        !monthlyPaymentElement
    ) {

        showDebtPayoffError(
            "The calculator could not load correctly. Please refresh the page and try again."
        );

        return;

    }

    const startingBalance =
        parseFloat(balanceElement.value);

    const annualAPR =
        parseFloat(aprElement.value);

    const monthlyPayment =
        parseFloat(monthlyPaymentElement.value);


    /* ======================================================
       VALIDATION
    ======================================================= */

    if (
        !Number.isFinite(startingBalance) ||
        startingBalance <= 0
    ) {

        showDebtPayoffError(
            "Please enter a valid starting debt greater than $0."
        );

        balanceElement.focus();

        return;

    }


    if (
        !Number.isFinite(annualAPR) ||
        annualAPR < 0 ||
        annualAPR > 100
    ) {

        showDebtPayoffError(
            "Please enter an APR between 0% and 100%."
        );

        aprElement.focus();

        return;

    }


    if (
        !Number.isFinite(monthlyPayment) ||
        monthlyPayment <= 0
    ) {

        showDebtPayoffError(
            "Please enter a valid monthly payment greater than $0."
        );

        monthlyPaymentElement.focus();

        return;

    }


    /* ======================================================
       MONTHLY INTEREST RATE
    ======================================================= */

    const monthlyInterestRate =
        annualAPR / 100 / 12;


    /* ======================================================
       PAYMENT TOO LOW CHECK
    ======================================================= */

    const firstMonthInterest =
        startingBalance *
        monthlyInterestRate;


    if (
        monthlyInterestRate > 0 &&
        monthlyPayment <= firstMonthInterest
    ) {

        showDebtPayoffError(
            "Your monthly payment is not high enough to pay off this debt. " +
            "Please enter a monthly payment greater than " +
            formatCurrency(firstMonthInterest) +
            ", which is the estimated interest charged during the first month."
        );

        monthlyPaymentElement.focus();

        return;

    }


    /* ======================================================
       ZERO INTEREST DEBT
    ======================================================= */

    if (
        annualAPR === 0
    ) {

        const payoffMonths =
            Math.ceil(
                startingBalance /
                monthlyPayment
            );


        const schedule =
            generateZeroInterestSchedule(
                startingBalance,
                monthlyPayment,
                payoffMonths
            );


        const calculationData = {

            startingBalance:
                startingBalance,

            annualAPR:
                annualAPR,

            monthlyPayment:
                monthlyPayment,

            payoffMonths:
                payoffMonths,

            totalInterest:
                0,

            totalPaid:
                startingBalance,

            schedule:
                schedule

        };


        displayDebtPayoffResults(
            calculationData
        );

        return;

    }


    /* ======================================================
       STANDARD INTEREST CALCULATION
    ======================================================= */

    let remainingBalance =
        startingBalance;

    let totalInterest =
        0;

    let totalPaid =
        0;

    let month =
        0;


    const schedule =
        [];


    /*
       Maximum calculation period:
       100 years = 1,200 months
    */

    const maximumMonths =
        1200;


    while (
        remainingBalance > 0.005 &&
        month < maximumMonths
    ) {

        month++;


        /* ==============================================
           MONTHLY INTEREST
        =============================================== */

        const interest =
            remainingBalance *
            monthlyInterestRate;


        /* ==============================================
           REGULAR PAYMENT
        =============================================== */

        let payment =
            monthlyPayment;


        let principal =
            payment -
            interest;


        /* ==============================================
           FINAL PAYMENT
        =============================================== */

        if (
            payment >=
            remainingBalance +
            interest
        ) {

            payment =
                remainingBalance +
                interest;


            principal =
                remainingBalance;

        }


        /* ==============================================
           UPDATE BALANCE
        =============================================== */

        remainingBalance -=
            principal;


        /*
           Prevent tiny floating-point
           balances such as $0.000001
        */

        if (
            remainingBalance < 0.005
        ) {

            remainingBalance =
                0;

        }


        /* ==============================================
           UPDATE TOTALS
        =============================================== */

        totalInterest +=
            interest;


        totalPaid +=
            payment;


        /* ==============================================
           SAVE MONTHLY DATA
        =============================================== */

        schedule.push({

            month:
                month,

            payment:
                payment,

            interest:
                interest,

            principal:
                principal,

            remainingBalance:
                remainingBalance

        });

    }


    /* ======================================================
       SAFETY CHECK
    ======================================================= */

    if (
        month >= maximumMonths &&
        remainingBalance > 0
    ) {

        showDebtPayoffError(
            "This debt could not be paid off within the calculator's maximum 100-year calculation period. Please check your debt balance, APR, and monthly payment."
        );

        return;

    }


    /* ======================================================
       FINAL CALCULATION DATA
    ======================================================= */

    const calculationData = {

        startingBalance:
            startingBalance,

        annualAPR:
            annualAPR,

        monthlyPayment:
            monthlyPayment,

        payoffMonths:
            month,

        totalInterest:
            totalInterest,

        totalPaid:
            totalPaid,

        schedule:
            schedule

    };


    /* ======================================================
       DISPLAY RESULTS
    ======================================================= */

    displayDebtPayoffResults(
        calculationData
    );

}


/* ==========================================================
   ZERO INTEREST SCHEDULE
========================================================== */

function generateZeroInterestSchedule(
    startingBalance,
    monthlyPayment,
    payoffMonths
) {

    const schedule =
        [];

    let remainingBalance =
        startingBalance;


    for (
        let month = 1;
        month <= payoffMonths;
        month++
    ) {

        const payment =
            Math.min(
                monthlyPayment,
                remainingBalance
            );


        const principal =
            payment;


        remainingBalance -=
            principal;


        if (
            remainingBalance < 0.005
        ) {

            remainingBalance =
                0;

        }


        schedule.push({

            month:
                month,

            payment:
                payment,

            interest:
                0,

            principal:
                principal,

            remainingBalance:
                remainingBalance

        });

    }


    return schedule;

}


/* ==========================================================
   DISPLAY RESULTS
========================================================== */

function displayDebtPayoffResults(
    data
) {

    const resultBox =
        document.getElementById(
            "debt-payoff-result"
        );


    const resultContent =
        document.getElementById(
            "debt-payoff-result-content"
        );


    if (
        !resultBox ||
        !resultContent
    ) {

        showDebtPayoffError(
            "The results section could not be loaded. Please refresh the page and try again."
        );

        return;

    }


    const payoffTimeText =
        formatPayoffTime(
            data.payoffMonths
        );


    const interestPercentage =
        data.startingBalance > 0
            ? (
                data.totalInterest /
                data.startingBalance
            ) * 100
            : 0;


    resultContent.innerHTML = `

        <div class="result-summary">

            <div class="result-item">

                <strong>
                    Starting Debt
                </strong>

                <span>
                    ${formatCurrency(
                        data.startingBalance
                    )}
                </span>

            </div>


            <div class="result-item">

                <strong>
                    APR
                </strong>

                <span>
                    ${data.annualAPR.toFixed(2)}%
                </span>

            </div>


            <div class="result-item">

                <strong>
                    Monthly Payment
                </strong>

                <span>
                    ${formatCurrency(
                        data.monthlyPayment
                    )}
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
                    ${formatCurrency(
                        data.totalInterest
                    )}
                </span>

            </div>


            <div class="result-item">

                <strong>
                    Estimated Total Paid
                </strong>

                <span>
                    ${formatCurrency(
                        data.totalPaid
                    )}
                </span>

            </div>


            <div class="result-item">

                <strong>
                    Interest as Percentage of Starting Debt
                </strong>

                <span>
                    ${interestPercentage.toFixed(2)}%
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


        <div class="debt-payoff-breakdown">

            <h3>
                Payoff Schedule
            </h3>


            <p class="small-text">

                This table shows an estimated month-by-month
                breakdown of your payment, interest,
                principal reduction, and remaining balance.

            </p>


            <div class="table-responsive">

                <table class="payoff-table">

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


                    <tbody id="debt-payoff-table-body">

                    </tbody>

                </table>

            </div>

        </div>

    `;


    generateDebtPayoffSchedule(
        data.schedule
    );


    resultBox.hidden =
        false;


    updateDebtPayoffSummary(
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
   PAYOFF SCHEDULE
========================================================== */

function generateDebtPayoffSchedule(
    schedule
) {

    const tableBody =
        document.getElementById(
            "debt-payoff-table-body"
        );


    if (!tableBody) {

        return;

    }


    tableBody.innerHTML =
        "";


    schedule.forEach(
        function (row) {

            const tableRow =
                document.createElement(
                    "tr"
                );


            tableRow.innerHTML = `

                <td>
                    ${row.month}
                </td>


                <td>
                    ${formatCurrency(
                        row.payment
                    )}
                </td>


                <td>
                    ${formatCurrency(
                        row.interest
                    )}
                </td>


                <td>
                    ${formatCurrency(
                        row.principal
                    )}
                </td>


                <td>
                    <strong>
                        ${formatCurrency(
                            row.remainingBalance
                        )}
                    </strong>
                </td>

            `;


            tableBody.appendChild(
                tableRow
            );

        }
    );

}


/* ==========================================================
   SUMMARY
========================================================== */

function updateDebtPayoffSummary(
    data
) {

    const summaryBalance =
        document.getElementById(
            "summary-debt-balance"
        );


    const summaryPayment =
        document.getElementById(
            "summary-debt-monthly-payment"
        );


    const summaryInterest =
        document.getElementById(
            "summary-debt-interest"
        );


    const summaryTotalPaid =
        document.getElementById(
            "summary-debt-total-paid"
        );


    const summaryPayoffTime =
        document.getElementById(
            "summary-debt-payoff-time"
        );


    if (summaryBalance) {

        summaryBalance.textContent =
            formatCurrency(
                data.startingBalance
            );

    }


    if (summaryPayment) {

        summaryPayment.textContent =
            formatCurrency(
                data.monthlyPayment
            );

    }


    if (summaryInterest) {

        summaryInterest.textContent =
            formatCurrency(
                data.totalInterest
            );

    }


    if (summaryTotalPaid) {

        summaryTotalPaid.textContent =
            formatCurrency(
                data.totalPaid
            );

    }


    if (summaryPayoffTime) {

        summaryPayoffTime.textContent =
            data.payoffMonths > 0
                ? formatPayoffTime(
                    data.payoffMonths
                )
                : "—";

    }

}


/* ==========================================================
   PAYOFF TIME FORMAT
========================================================== */

function formatPayoffTime(
    totalMonths
) {

    if (
        !Number.isFinite(totalMonths) ||
        totalMonths <= 0
    ) {

        return "0 months";

    }


    const years =
        Math.floor(
            totalMonths / 12
        );


    const months =
        totalMonths % 12;


    if (
        years > 0 &&
        months > 0
    ) {

        return (
            years +
            (
                years === 1
                    ? " year "
                    : " years "
            ) +
            months +
            (
                months === 1
                    ? " month"
                    : " months"
            )
        );

    }


    if (
        years > 0
    ) {

        return (
            years +
            (
                years === 1
                    ? " year"
                    : " years"
            )
        );

    }


    return (
        totalMonths +
        (
            totalMonths === 1
                ? " month"
                : " months"
        )
    );

}


/* ==========================================================
   CURRENCY FORMAT
========================================================== */

function formatCurrency(
    amount
) {

    const numericAmount =
        Number(amount);


    if (
        !Number.isFinite(
            numericAmount
        )
    ) {

        return "$0.00";

    }


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
        ).format(
            numericAmount
        );

    } catch (error) {

        return (
            "$" +
            numericAmount.toFixed(2)
        );

    }

}


/* ==========================================================
   ERROR HANDLING
========================================================== */

function showDebtPayoffError(
    message
) {

    const errorBox =
        document.getElementById(
            "debt-payoff-error"
        );


    if (!errorBox) {

        console.error(
            "Debt Payoff Calculator:",
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

function clearDebtPayoffError() {

    const errorBox =
        document.getElementById(
            "debt-payoff-error"
        );


    if (!errorBox) {

        return;

    }


    errorBox.textContent =
        "";


    errorBox.hidden =
        true;

}


/* ==========================================================
   RESET CALCULATOR
========================================================== */

function resetDebtPayoffCalculator() {

    const balanceElement =
        document.getElementById(
            "debt-balance"
        );


    const aprElement =
        document.getElementById(
            "debt-apr"
        );


    const monthlyPaymentElement =
        document.getElementById(
            "debt-monthly-payment"
        );


    const resultBox =
        document.getElementById(
            "debt-payoff-result"
        );


    const resultContent =
        document.getElementById(
            "debt-payoff-result-content"
        );


    /* ======================================================
       CLEAR INPUTS
    ======================================================= */

    if (balanceElement) {

        balanceElement.value =
            "";

    }


    if (aprElement) {

        aprElement.value =
            "";

    }


    if (monthlyPaymentElement) {

        monthlyPaymentElement.value =
            "";

    }


    /* ======================================================
       CLEAR ERROR
    ======================================================= */

    clearDebtPayoffError();


    /* ======================================================
       HIDE RESULTS
    ======================================================= */

    if (resultBox) {

        resultBox.hidden =
            true;

    }


    if (resultContent) {

        resultContent.innerHTML =
            "";

    }


    /* ======================================================
       RESET SUMMARY
    ======================================================= */

    updateDebtPayoffSummary({

        startingBalance:
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


    /* ======================================================
       FOCUS FIRST INPUT
    ======================================================= */

    if (balanceElement) {

        balanceElement.focus();

    }

}



/* ==========================================================
   END OF DEBT PAYOFF CALCULATOR
========================================================== */