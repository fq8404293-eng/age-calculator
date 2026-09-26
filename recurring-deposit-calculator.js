"use strict";

/* ==========================================================
   CalclyWorld Recurring Deposit Calculator
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeRecurringDepositCalculator();

    }
);


/* ==========================================================
   INITIALIZATION
========================================================== */

function initializeRecurringDepositCalculator() {

    const calculateButton =
        document.getElementById(
            "calculate-rd"
        );

    const resetButton =
        document.getElementById(
            "reset-rd"
        );

    if (
        !calculateButton ||
        !resetButton
    ) {

        console.error(
            "Recurring Deposit Calculator: Required buttons not found."
        );

        return;

    }


    calculateButton.addEventListener(
        "click",
        calculateRecurringDeposit
    );


    resetButton.addEventListener(
        "click",
        resetRecurringDepositCalculator
    );


    const inputElements =
        document.querySelectorAll(
            "#rd-monthly-deposit, " +
            "#rd-interest-rate, " +
            "#rd-investment-period"
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

                        calculateRecurringDeposit();

                    }

                }
            );

        }
    );


    const selectElements =
        document.querySelectorAll(
            "#rd-currency, " +
            "#rd-deposit-frequency, " +
            "#rd-compounding-frequency"
        );


    selectElements.forEach(
        function (select) {

            select.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        calculateRecurringDeposit();

                    }

                }
            );

        }
    );

}


/* ==========================================================
   MAIN CALCULATION
========================================================== */

function calculateRecurringDeposit() {

    clearRecurringDepositError();


    const currencyElement =
        document.getElementById(
            "rd-currency"
        );

    const depositElement =
        document.getElementById(
            "rd-monthly-deposit"
        );

    const depositFrequencyElement =
        document.getElementById(
            "rd-deposit-frequency"
        );

    const interestRateElement =
        document.getElementById(
            "rd-interest-rate"
        );

    const investmentPeriodElement =
        document.getElementById(
            "rd-investment-period"
        );

    const compoundingFrequencyElement =
        document.getElementById(
            "rd-compounding-frequency"
        );


    if (
        !currencyElement ||
        !depositElement ||
        !depositFrequencyElement ||
        !interestRateElement ||
        !investmentPeriodElement ||
        !compoundingFrequencyElement
    ) {

        showRecurringDepositError(
            "The calculator could not load correctly. Please refresh the page and try again."
        );

        return;

    }


    const currency =
        currencyElement.value;


    const regularDeposit =
        parseFloat(
            depositElement.value
        );


    const depositFrequency =
        depositFrequencyElement.value;


    const annualInterestRate =
        parseFloat(
            interestRateElement.value
        );


    const investmentYears =
        parseFloat(
            investmentPeriodElement.value
        );


    const compoundingFrequency =
        compoundingFrequencyElement.value;


    /* ======================================================
       VALIDATION
    ======================================================= */

    if (
        !Number.isFinite(
            regularDeposit
        ) ||
        regularDeposit <= 0
    ) {

        showRecurringDepositError(
            "Please enter a valid regular deposit amount greater than $0."
        );

        depositElement.focus();

        return;

    }


    if (
        depositFrequency !== "monthly" &&
        depositFrequency !== "yearly"
    ) {

        showRecurringDepositError(
            "Please select a valid deposit frequency."
        );

        depositFrequencyElement.focus();

        return;

    }


    if (
        !Number.isFinite(
            annualInterestRate
        ) ||
        annualInterestRate < 0 ||
        annualInterestRate > 100
    ) {

        showRecurringDepositError(
            "Please enter an annual interest rate between 0% and 100%."
        );

        interestRateElement.focus();

        return;

    }


    if (
        !Number.isFinite(
            investmentYears
        ) ||
        investmentYears <= 0 ||
        investmentYears > 100
    ) {

        showRecurringDepositError(
            "Please enter an investment period greater than 0 and no more than 100 years."
        );

        investmentPeriodElement.focus();

        return;

    }


    if (
        compoundingFrequency !== "monthly" &&
        compoundingFrequency !== "quarterly" &&
        compoundingFrequency !== "yearly"
    ) {

        showRecurringDepositError(
            "Please select a valid compounding frequency."
        );

        compoundingFrequencyElement.focus();

        return;

    }


    /* ======================================================
       CALCULATION SETTINGS
    ======================================================= */

    const annualRateDecimal =
        annualInterestRate / 100;


    const periodsPerYear =
        getCompoundingPeriodsPerYear(
            compoundingFrequency
        );


    const totalCompoundingPeriods =
        Math.round(
            investmentYears *
            periodsPerYear
        );


    const totalMonths =
        Math.round(
            investmentYears *
            12
        );


    const totalDepositPeriods =
        depositFrequency === "monthly"
            ? totalMonths
            : Math.round(
                investmentYears
            );


    /*
       Convert the regular deposit schedule
       into a time-based deposit schedule.

       Monthly deposits:
       One deposit every month.

       Yearly deposits:
       One deposit every year.

       Deposits are assumed to occur at
       the beginning of each deposit period.
    */


    let totalDeposits =
        regularDeposit *
        totalDepositPeriods;


    let maturityValue =
        0;


    let totalInterest =
        0;


    const yearlyBreakdown = [];


    /* ======================================================
       ZERO INTEREST RATE
    ======================================================= */

    if (
        annualInterestRate === 0
    ) {

        maturityValue =
            totalDeposits;


        totalInterest =
            0;


        for (
            let year = 1;
            year <= Math.ceil(
                investmentYears
            );
            year++
        ) {

            const elapsedYears =
                Math.min(
                    year,
                    investmentYears
                );


            const depositPeriods =
                depositFrequency === "monthly"
                    ? Math.round(
                        elapsedYears *
                        12
                    )
                    : Math.floor(
                        elapsedYears
                    );


            const contributions =
                regularDeposit *
                depositPeriods;


            yearlyBreakdown.push({

                year:
                    year,

                contributions:
                    contributions,

                interest:
                    0,

                balance:
                    contributions

            });

        }


        displayRecurringDepositResults({

            currency:
                currency,

            regularDeposit:
                regularDeposit,

            depositFrequency:
                depositFrequency,

            annualInterestRate:
                annualInterestRate,

            investmentYears:
                investmentYears,

            compoundingFrequency:
                compoundingFrequency,

            totalDeposits:
                totalDeposits,

            totalInterest:
                totalInterest,

            maturityValue:
                maturityValue,

            yearlyBreakdown:
                yearlyBreakdown

        });


        return;

    }


    /* ======================================================
       GENERAL RECURRING DEPOSIT CALCULATION
    ======================================================= */


    /*
       We calculate the account month by month.

       Interest is applied whenever the current month
       reaches a compounding period.

       Deposits are added at the beginning of their
       selected deposit period.

       This approach makes the calculator flexible
       for monthly and yearly deposits as well as
       monthly, quarterly, and yearly compounding.
    */


    let currentBalance =
        0;


    let contributionTotal =
        0;


    let interestTotal =
        0;


    let lastRecordedYear =
        0;


    for (
        let month = 1;
        month <= totalMonths;
        month++
    ) {


        /* ==================================================
           ADD REGULAR DEPOSIT
        =================================================== */


        let shouldDeposit =
            false;


        if (
            depositFrequency === "monthly"
        ) {

            shouldDeposit =
                true;

        }


        if (
            depositFrequency === "yearly" &&
            month % 12 === 1
        ) {

            shouldDeposit =
                true;

        }


        /*
           For a yearly deposit and an investment period
           that starts at month 1, the first yearly deposit
           is made at the beginning of the first year.
        */


        if (
            shouldDeposit
        ) {

            currentBalance +=
                regularDeposit;


            contributionTotal +=
                regularDeposit;

        }


        /* ==================================================
           APPLY COMPOUNDING
        =================================================== */


        const shouldCompound =
            month % (
                12 /
                periodsPerYear
            ) === 0;


        if (
            shouldCompound
        ) {

            const periodicRate =
                Math.pow(
                    1 +
                    annualRateDecimal,

                    1 /
                    periodsPerYear
                ) -
                1;


            const interestThisPeriod =
                currentBalance *
                periodicRate;


            currentBalance +=
                interestThisPeriod;


            interestTotal +=
                interestThisPeriod;

        }


        /* ==================================================
           YEARLY SNAPSHOT
        =================================================== */


        const currentYear =
            Math.ceil(
                month / 12
            );


        if (
            currentYear !==
            lastRecordedYear
        ) {

            /*
               Record the snapshot at the end
               of each completed year.

               For the final partial year,
               the snapshot is recorded at
               the end of the selected period.
            */


            if (
                month % 12 === 0 ||
                month === totalMonths
            ) {

                yearlyBreakdown.push({

                    year:
                        currentYear,

                    contributions:
                        contributionTotal,

                    interest:
                        interestTotal,

                    balance:
                        currentBalance

                });


                lastRecordedYear =
                    currentYear;

            }

        }

    }


    maturityValue =
        currentBalance;


    totalDeposits =
        contributionTotal;


    totalInterest =
        maturityValue -
        totalDeposits;


    /*
       Small floating-point corrections can sometimes
       occur in financial calculations.
    */


    if (
        Math.abs(
            totalInterest
        ) < 0.0000001
    ) {

        totalInterest =
            0;

    }


    /* ======================================================
       FINAL RESULTS
    ======================================================= */

    displayRecurringDepositResults({

        currency:
            currency,

        regularDeposit:
            regularDeposit,

        depositFrequency:
            depositFrequency,

        annualInterestRate:
            annualInterestRate,

        investmentYears:
            investmentYears,

        compoundingFrequency:
            compoundingFrequency,

        totalDeposits:
            totalDeposits,

        totalInterest:
            totalInterest,

        maturityValue:
            maturityValue,

        yearlyBreakdown:
            yearlyBreakdown

    });

}


/* ==========================================================
   COMPOUNDING FREQUENCY
========================================================== */

function getCompoundingPeriodsPerYear(
    compoundingFrequency
) {

    if (
        compoundingFrequency === "monthly"
    ) {

        return 12;

    }


    if (
        compoundingFrequency === "quarterly"
    ) {

        return 4;

    }


    if (
        compoundingFrequency === "yearly"
    ) {

        return 1;

    }


    return 12;

}


/* ==========================================================
   DISPLAY RESULTS
========================================================== */

function displayRecurringDepositResults(
    data
) {

    const resultBox =
        document.getElementById(
            "rd-result"
        );


    const resultContent =
        document.getElementById(
            "rd-result-content"
        );


    if (
        !resultBox ||
        !resultContent
    ) {

        showRecurringDepositError(
            "The results section could not be loaded. Please refresh the page and try again."
        );

        return;

    }


    const growthPercentage =
        data.totalDeposits > 0
            ? (
                data.totalInterest /
                data.totalDeposits
            ) *
            100
            : 0;


    resultContent.innerHTML = `

        <div class="result-summary">


            <div class="result-item">

                <strong>
                    Regular Deposit
                </strong>

                <span>
                    ${formatCurrency(
                        data.regularDeposit,
                        data.currency
                    )}
                </span>

            </div>


            <div class="result-item">

                <strong>
                    Deposit Frequency
                </strong>

                <span>
                    ${formatDepositFrequency(
                        data.depositFrequency
                    )}
                </span>

            </div>


            <div class="result-item">

                <strong>
                    Annual Interest Rate
                </strong>

                <span>
                    ${data.annualInterestRate.toFixed(2)}%
                </span>

            </div>


            <div class="result-item">

                <strong>
                    Investment Period
                </strong>

                <span>
                    ${formatInvestmentPeriod(
                        data.investmentYears
                    )}
                </span>

            </div>


            <div class="result-item">

                <strong>
                    Compounding Frequency
                </strong>

                <span>
                    ${formatCompoundingFrequency(
                        data.compoundingFrequency
                    )}
                </span>

            </div>


            <div class="result-item">

                <strong>
                    Total Deposits
                </strong>

                <span>
                    ${formatCurrency(
                        data.totalDeposits,
                        data.currency
                    )}
                </span>

            </div>


            <div class="result-item">

                <strong>
                    Estimated Interest
                </strong>

                <span>
                    ${formatCurrency(
                        data.totalInterest,
                        data.currency
                    )}
                </span>

            </div>


            <div class="result-item">

                <strong>
                    Interest as Percentage of Deposits
                </strong>

                <span>
                    ${growthPercentage.toFixed(2)}%
                </span>

            </div>


            <div class="result-item result-highlight">

                <strong>
                    Estimated Maturity Value
                </strong>

                <span>
                    ${formatCurrency(
                        data.maturityValue,
                        data.currency
                    )}
                </span>

            </div>


        </div>


        <div class="investment-breakdown">


            <h3>
                Year-by-Year Recurring Deposit Growth
            </h3>


            <p class="small-text">

                This table provides an estimated year-by-year
                view of your total deposits, estimated interest,
                and projected account balance.

            </p>


            <div class="table-responsive">


                <table class="investment-table">


                    <thead>

                        <tr>

                            <th scope="col">
                                Year
                            </th>

                            <th scope="col">
                                Total Deposits
                            </th>

                            <th scope="col">
                                Estimated Interest
                            </th>

                            <th scope="col">
                                Estimated Balance
                            </th>

                        </tr>

                    </thead>


                    <tbody id="rd-table-body">

                    </tbody>


                </table>


            </div>


        </div>

    `;


    generateRecurringDepositSchedule(
        data.yearlyBreakdown,
        data.currency
    );


    resultBox.hidden =
        false;


    updateRecurringDepositSummary(
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
   YEARLY BREAKDOWN TABLE
========================================================== */

function generateRecurringDepositSchedule(
    yearlyBreakdown,
    currency
) {

    const tableBody =
        document.getElementById(
            "rd-table-body"
        );


    if (
        !tableBody
    ) {

        return;

    }


    tableBody.innerHTML =
        "";


    yearlyBreakdown.forEach(
        function (row) {

            const tableRow =
                document.createElement(
                    "tr"
                );


            tableRow.innerHTML = `

                <td>
                    ${row.year}
                </td>


                <td>
                    ${formatCurrency(
                        row.contributions,
                        currency
                    )}
                </td>


                <td>
                    ${formatCurrency(
                        row.interest,
                        currency
                    )}
                </td>


                <td>

                    <strong>
                        ${formatCurrency(
                            row.balance,
                            currency
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

function updateRecurringDepositSummary(
    data
) {

    const summaryDeposit =
        document.getElementById(
            "summary-rd-deposit"
        );


    const summaryTotalDeposits =
        document.getElementById(
            "summary-rd-total-deposits"
        );


    const summaryInterest =
        document.getElementById(
            "summary-rd-interest"
        );


    const summaryMaturity =
        document.getElementById(
            "summary-rd-maturity"
        );


    if (
        summaryDeposit
    ) {

        summaryDeposit.textContent =
            formatCurrency(
                data.regularDeposit || 0,
                data.currency
            );

    }


    if (
        summaryTotalDeposits
    ) {

        summaryTotalDeposits.textContent =
            formatCurrency(
                data.totalDeposits || 0,
                data.currency
            );

    }


    if (
        summaryInterest
    ) {

        summaryInterest.textContent =
            formatCurrency(
                data.totalInterest || 0,
                data.currency
            );

    }


    if (
        summaryMaturity
    ) {

        summaryMaturity.textContent =
            formatCurrency(
                data.maturityValue || 0,
                data.currency
            );

    }

}


/* ==========================================================
   DEPOSIT FREQUENCY FORMAT
========================================================== */

function formatDepositFrequency(
    frequency
) {

    if (
        frequency === "monthly"
    ) {

        return "Monthly";

    }


    if (
        frequency === "yearly"
    ) {

        return "Yearly";

    }


    return frequency;

}


/* ==========================================================
   COMPOUNDING FREQUENCY FORMAT
========================================================== */

function formatCompoundingFrequency(
    frequency
) {

    if (
        frequency === "monthly"
    ) {

        return "Monthly";

    }


    if (
        frequency === "quarterly"
    ) {

        return "Quarterly";

    }


    if (
        frequency === "yearly"
    ) {

        return "Yearly";

    }


    return frequency;

}


/* ==========================================================
   INVESTMENT PERIOD FORMAT
========================================================== */

function formatInvestmentPeriod(
    years
) {

    if (
        years === 1
    ) {

        return "1 year";

    }


    return (
        years +
        " years"
    );

}


/* ==========================================================
   CURRENCY FORMAT
========================================================== */

function formatCurrency(
    amount,
    currency
) {

    const supportedCurrencies = [

        "USD",
        "EUR",
        "GBP",
        "CAD",
        "AUD",
        "INR"

    ];


    const selectedCurrency =
        supportedCurrencies.includes(
            currency
        )
            ? currency
            : "USD";


    try {

        return new Intl.NumberFormat(

            "en-US",

            {

                style:
                    "currency",

                currency:
                    selectedCurrency,

                minimumFractionDigits:
                    2,

                maximumFractionDigits:
                    2

            }

        ).format(
            Number(amount) || 0
        );

    } catch (
        error
    ) {

        return (
            Number(amount) || 0
        ).toFixed(2);

    }

}


/* ==========================================================
   ERROR HANDLING
========================================================== */

function showRecurringDepositError(
    message
) {

    const errorBox =
        document.getElementById(
            "rd-error"
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

function clearRecurringDepositError() {

    const errorBox =
        document.getElementById(
            "rd-error"
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

function resetRecurringDepositCalculator() {

    const currencyElement =
        document.getElementById(
            "rd-currency"
        );


    const depositElement =
        document.getElementById(
            "rd-monthly-deposit"
        );


    const depositFrequencyElement =
        document.getElementById(
            "rd-deposit-frequency"
        );


    const interestRateElement =
        document.getElementById(
            "rd-interest-rate"
        );


    const investmentPeriodElement =
        document.getElementById(
            "rd-investment-period"
        );


    const compoundingFrequencyElement =
        document.getElementById(
            "rd-compounding-frequency"
        );


    const resultBox =
        document.getElementById(
            "rd-result"
        );


    const resultContent =
        document.getElementById(
            "rd-result-content"
        );


    /* ======================================================
       RESET INPUTS
    ======================================================= */

    if (
        currencyElement
    ) {

        currencyElement.value =
            "USD";

    }


    if (
        depositElement
    ) {

        depositElement.value =
            "";

    }


    if (
        depositFrequencyElement
    ) {

        depositFrequencyElement.value =
            "monthly";

    }


    if (
        interestRateElement
    ) {

        interestRateElement.value =
            "";

    }


    if (
        investmentPeriodElement
    ) {

        investmentPeriodElement.value =
            "";

    }


    if (
        compoundingFrequencyElement
    ) {

        compoundingFrequencyElement.value =
            "monthly";

    }


    /* ======================================================
       CLEAR ERROR
    ======================================================= */

    clearRecurringDepositError();


    /* ======================================================
       HIDE RESULTS
    ======================================================= */

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


    /* ======================================================
       RESET SUMMARY
    ======================================================= */

    updateRecurringDepositSummary({

        regularDeposit:
            0,

        totalDeposits:
            0,

        totalInterest:
            0,

        maturityValue:
            0,

        currency:
            "USD"

    });


    /* ======================================================
       FOCUS FIRST INPUT
    ======================================================= */

    if (
        depositElement
    ) {

        depositElement.focus();

    }

}


/* ==========================================================
   END
========================================================== */