"use strict";

/* ==========================================================
CalclyWorld Investment Return Calculator
Matches:
investment-return-calculator.html
========================================================== */

document.addEventListener("DOMContentLoaded", function () {
initializeInvestmentReturnCalculator();
});

/* ==========================================================
INITIALIZATION
========================================================== */

function initializeInvestmentReturnCalculator() {


const calculateButton =
    document.getElementById("calculate-investment");

const resetButton =
    document.getElementById("reset-investment");

if (!calculateButton || !resetButton) {

    console.error(
        "Investment Return Calculator: Required buttons not found."
    );

    return;
}

calculateButton.addEventListener(
    "click",
    calculateInvestmentReturn
);

resetButton.addEventListener(
    "click",
    resetInvestmentReturnCalculator
);

/*
   Allow the user to press Enter from
   any calculator input.
*/

const inputElements = document.querySelectorAll(
    "#initial-investment, " +
    "#regular-contribution, " +
    "#investment-return, " +
    "#investment-period"
);

inputElements.forEach(function (input) {

    input.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                calculateInvestmentReturn();

            }

        }
    );

});


}

/* ==========================================================
MAIN CALCULATION
========================================================== */

function calculateInvestmentReturn() {


clearInvestmentReturnError();

const currencyElement =
    document.getElementById(
        "investment-currency"
    );

const initialInvestmentElement =
    document.getElementById(
        "initial-investment"
    );

const regularContributionElement =
    document.getElementById(
        "regular-contribution"
    );

const contributionFrequencyElement =
    document.getElementById(
        "contribution-frequency"
    );

const annualReturnElement =
    document.getElementById(
        "investment-return"
    );

const investmentPeriodElement =
    document.getElementById(
        "investment-period"
    );

const compoundingFrequencyElement =
    document.getElementById(
        "compounding-frequency"
    );

/*
   Check that every required calculator
   element exists.
*/

if (
    !currencyElement ||
    !initialInvestmentElement ||
    !regularContributionElement ||
    !contributionFrequencyElement ||
    !annualReturnElement ||
    !investmentPeriodElement ||
    !compoundingFrequencyElement
) {

    showInvestmentReturnError(
        "The calculator could not load correctly. Please refresh the page and try again."
    );

    return;
}

/* ======================================================
   READ INPUTS
======================================================= */

const currency =
    currencyElement.value;

const initialInvestment =
    parseFloat(
        initialInvestmentElement.value
    );

const regularContribution =
    parseFloat(
        regularContributionElement.value
    );

const contributionFrequency =
    contributionFrequencyElement.value;

const annualReturn =
    parseFloat(
        annualReturnElement.value
    );

const investmentYears =
    parseInt(
        investmentPeriodElement.value,
        10
    );

const compoundingFrequency =
    compoundingFrequencyElement.value;

/* ======================================================
   VALIDATION
======================================================= */

if (
    !Number.isFinite(initialInvestment) ||
    initialInvestment < 0
) {

    showInvestmentReturnError(
        "Please enter a valid initial investment amount of 0 or more."
    );

    initialInvestmentElement.focus();

    return;
}

if (
    !Number.isFinite(regularContribution) ||
    regularContribution < 0
) {

    showInvestmentReturnError(
        "Please enter a valid regular contribution amount of 0 or more."
    );

    regularContributionElement.focus();

    return;
}

if (
    initialInvestment === 0 &&
    regularContribution === 0
) {

    showInvestmentReturnError(
        "Please enter an initial investment or a regular contribution greater than 0."
    );

    initialInvestmentElement.focus();

    return;
}

if (
    !Number.isFinite(annualReturn) ||
    annualReturn < 0 ||
    annualReturn > 100
) {

    showInvestmentReturnError(
        "Please enter an expected annual return between 0% and 100%."
    );

    annualReturnElement.focus();

    return;
}

if (
    !Number.isFinite(investmentYears) ||
    investmentYears < 1 ||
    investmentYears > 100
) {

    showInvestmentReturnError(
        "Please enter an investment period between 1 and 100 years."
    );

    investmentPeriodElement.focus();

    return;
}

if (
    !["monthly", "yearly"].includes(
        contributionFrequency
    )
) {

    showInvestmentReturnError(
        "Please select a valid contribution frequency."
    );

    contributionFrequencyElement.focus();

    return;
}

if (
    !["monthly", "quarterly", "yearly"].includes(
        compoundingFrequency
    )
) {

    showInvestmentReturnError(
        "Please select a valid compounding frequency."
    );

    compoundingFrequencyElement.focus();

    return;
}

/* ======================================================
   CALCULATION SETTINGS
======================================================= */

const periodsPerYear =
    getPeriodsPerYear(
        compoundingFrequency
    );

const contributionIntervalMonths =
    contributionFrequency === "monthly"
        ? 1
        : 12;

const totalMonths =
    investmentYears * 12;

const totalPeriods =
    investmentYears *
    periodsPerYear;

/*
   Convert annual return to the selected
   compounding period.

   Example:

   8% annual return with monthly compounding:

   (1 + 0.08)^(1/12) - 1
*/

const periodicRate =
    annualReturn === 0
        ? 0
        : Math.pow(
            1 + annualReturn / 100,
            1 / periodsPerYear
        ) - 1;

/*
   Contribution is added according to
   the selected contribution frequency.

   Monthly:
   contribution is added every month.

   Yearly:
   contribution is added once every 12 months.
*/

let currentBalance =
    initialInvestment;

let totalContributions =
    initialInvestment;

let totalInterest =
    0;

const yearlyBreakdown = [];

/*
   Track the next contribution month.
*/

let nextContributionMonth =
    contributionIntervalMonths;

/*
   Track the number of completed
   compounding periods.
*/

let completedPeriods = 0;

/*
   For monthly compounding:
   one calculation every month.

   For quarterly:
   one calculation every 3 months.

   For yearly:
   one calculation every 12 months.
*/

for (
    let month = 1;
    month <= totalMonths;
    month++
) {

    /*
       Add contributions at the beginning
       of the selected contribution interval.

       This means a monthly contribution is
       added at the start of each month.

       A yearly contribution is added at
       the start of each investment year.
    */

    if (
        regularContribution > 0 &&
        month === nextContributionMonth
    ) {

        currentBalance +=
            regularContribution;

        totalContributions +=
            regularContribution;

        nextContributionMonth +=
            contributionIntervalMonths;

    }

    /*
       Apply investment growth only when
       the selected compounding period ends.
    */

    const shouldCompound =
        month %
        (
            12 /
            periodsPerYear
        ) === 0;

    if (shouldCompound) {

        const growthThisPeriod =
            currentBalance *
            periodicRate;

        currentBalance +=
            growthThisPeriod;

        totalInterest +=
            growthThisPeriod;

        completedPeriods++;

    }

    /*
       Save a yearly snapshot.

       Because the calculator accepts
       whole investment years, the table
       will contain one row per year.
    */

    if (
        month % 12 === 0
    ) {

        const currentYear =
            month / 12;

        yearlyBreakdown.push({

            year:
                currentYear,

            contributions:
                totalContributions,

            growth:
                currentBalance -
                totalContributions,

            balance:
                currentBalance

        });

    }

}

/* ======================================================
   FINAL CALCULATION
======================================================= */

const futureValue =
    currentBalance;

const totalInvestmentGrowth =
    futureValue -
    totalContributions;

/*
   Small floating-point corrections.
*/

const cleanedTotalGrowth =
    Math.abs(
        totalInvestmentGrowth
    ) < 0.005
        ? 0
        : totalInvestmentGrowth;

const calculationData = {

    currency:
        currency,

    initialInvestment:
        initialInvestment,

    regularContribution:
        regularContribution,

    contributionFrequency:
        contributionFrequency,

    annualReturn:
        annualReturn,

    investmentYears:
        investmentYears,

    compoundingFrequency:
        compoundingFrequency,

    totalContributions:
        totalContributions,

    totalInvestmentGrowth:
        cleanedTotalGrowth,

    futureValue:
        futureValue,

    totalPeriods:
        completedPeriods,

    yearlyBreakdown:
        yearlyBreakdown

};

displayInvestmentReturnResults(
    calculationData
);


}

/* ==========================================================
PERIODS PER YEAR
========================================================== */

function getPeriodsPerYear(
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

return 1;


}

/* ==========================================================
DISPLAY RESULTS
========================================================== */

function displayInvestmentReturnResults(
data
) {


const resultBox =
    document.getElementById(
        "investment-result"
    );

const resultContent =
    document.getElementById(
        "investment-result-content"
    );

if (
    !resultBox ||
    !resultContent
) {

    showInvestmentReturnError(
        "The results section could not be loaded. Please refresh the page and try again."
    );

    return;
}

const totalReturnPercentage =
    data.totalContributions > 0
        ? (
            data.totalInvestmentGrowth /
            data.totalContributions
        ) * 100
        : 0;

resultContent.innerHTML = `

    <div class="result-summary">

        <div class="result-item">

            <strong>
                Currency
            </strong>

            <span>
                ${getCurrencyDisplayName(
                    data.currency
                )}
            </span>

        </div>


        <div class="result-item">

            <strong>
                Initial Investment
            </strong>

            <span>
                ${formatCurrency(
                    data.initialInvestment,
                    data.currency
                )}
            </span>

        </div>


        <div class="result-item">

            <strong>
                Regular Contribution
            </strong>

            <span>
                ${formatCurrency(
                    data.regularContribution,
                    data.currency
                )}
            </span>

        </div>


        <div class="result-item">

            <strong>
                Contribution Frequency
            </strong>

            <span>
                ${formatFrequency(
                    data.contributionFrequency
                )}
            </span>

        </div>


        <div class="result-item">

            <strong>
                Expected Annual Return
            </strong>

            <span>
                ${data.annualReturn.toFixed(2)}%
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
                ${formatFrequency(
                    data.compoundingFrequency
                )}
            </span>

        </div>


        <div class="result-item">

            <strong>
                Total Amount Invested
            </strong>

            <span>
                ${formatCurrency(
                    data.totalContributions,
                    data.currency
                )}
            </span>

        </div>


        <div class="result-item">

            <strong>
                Estimated Investment Earnings
            </strong>

            <span>
                ${formatCurrency(
                    data.totalInvestmentGrowth,
                    data.currency
                )}
            </span>

        </div>


        <div class="result-item">

            <strong>
                Estimated Total Return
            </strong>

            <span>
                ${totalReturnPercentage.toFixed(2)}%
            </span>

        </div>


        <div class="result-item result-highlight">

            <strong>
                Estimated Final Value
            </strong>

            <span>
                ${formatCurrency(
                    data.futureValue,
                    data.currency
                )}
            </span>

        </div>

    </div>


    <div class="investment-breakdown">

        <h3>
            Year-by-Year Investment Growth
        </h3>


        <p class="small-text">

            This table provides an estimated year-by-year
            breakdown based on the assumptions entered.
            It shows how much has been contributed,
            estimated investment earnings, and the
            projected account value at the end of each year.

        </p>


        <div class="table-responsive">

            <table class="investment-table">

                <thead>

                    <tr>

                        <th scope="col">
                            Year
                        </th>

                        <th scope="col">
                            Total Amount Invested
                        </th>

                        <th scope="col">
                            Estimated Earnings
                        </th>

                        <th scope="col">
                            Estimated Balance
                        </th>

                    </tr>

                </thead>


                <tbody id="investment-return-table-body">

                </tbody>

            </table>

        </div>

    </div>

`;

generateInvestmentReturnSchedule(
    data.yearlyBreakdown,
    data.currency
);

resultBox.hidden = false;

updateInvestmentReturnSummary(
    data
);

resultBox.scrollIntoView({

    behavior: "smooth",

    block: "start"

});


}

/* ==========================================================
YEARLY BREAKDOWN TABLE
========================================================== */

function generateInvestmentReturnSchedule(
yearlyBreakdown,
currency
) {


const tableBody =
    document.getElementById(
        "investment-return-table-body"
    );

if (!tableBody) {

    return;

}

tableBody.innerHTML = "";

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
                    row.growth,
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

function updateInvestmentReturnSummary(
data
) {


const summaryInitial =
    document.getElementById(
        "summary-initial-investment"
    );

const summaryContributions =
    document.getElementById(
        "summary-contributions"
    );

const summaryTotalInvested =
    document.getElementById(
        "summary-total-invested"
    );

const summaryEarnings =
    document.getElementById(
        "summary-earnings"
    );

const summaryFinalValue =
    document.getElementById(
        "summary-final-value"
    );

const currency =
    data.currency ||
    "USD";

if (summaryInitial) {

    summaryInitial.textContent =
        formatCurrency(
            data.initialInvestment || 0,
            currency
        );

}

/*
   The HTML summary calls this
   "Total Contributions".

   We display the amount added after
   the initial investment.
*/

if (summaryContributions) {

    const additionalContributions =
        Math.max(
            0,
            (
                data.totalContributions || 0
            ) -
            (
                data.initialInvestment || 0
            )
        );

    summaryContributions.textContent =
        formatCurrency(
            additionalContributions,
            currency
        );

}

if (summaryTotalInvested) {

    summaryTotalInvested.textContent =
        formatCurrency(
            data.totalContributions || 0,
            currency
        );

}

if (summaryEarnings) {

    summaryEarnings.textContent =
        formatCurrency(
            data.totalInvestmentGrowth || 0,
            currency
        );

}

if (summaryFinalValue) {

    summaryFinalValue.textContent =
        formatCurrency(
            data.futureValue || 0,
            currency
        );

}


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
FREQUENCY FORMAT
========================================================== */

function formatFrequency(
frequency
) {


if (!frequency) {

    return "";

}

return (
    frequency.charAt(0).toUpperCase() +
    frequency.slice(1)
);


}

/* ==========================================================
CURRENCY DISPLAY NAME
========================================================== */

function getCurrencyDisplayName(
currency
) {


const currencyNames = {

    USD:
        "USD — US Dollar ($)",

    INR:
        "INR — Indian Rupee (₹)",

    GBP:
        "GBP — British Pound (£)",

    EUR:
        "EUR — Euro (€)"

};

return (
    currencyNames[currency] ||
    currency
);


}

/* ==========================================================
CURRENCY FORMAT
========================================================== */

function formatCurrency(
amount,
currency
) {


const selectedCurrency =
    currency || "USD";

const currencyLocales = {

    USD:
        "en-US",

    INR:
        "en-IN",

    GBP:
        "en-GB",

    EUR:
        "en-IE"

};

const locale =
    currencyLocales[
        selectedCurrency
    ] ||
    "en-US";

try {

    return new Intl.NumberFormat(
        locale,
        {
            style: "currency",
            currency: selectedCurrency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ).format(
        Number.isFinite(
            Number(amount)
        )
            ? Number(amount)
            : 0
    );

} catch (error) {

    return (
        Number(
            amount || 0
        ).toFixed(2) +
        " " +
        selectedCurrency
    );

}


}

/* ==========================================================
ERROR HANDLING
========================================================== */

function showInvestmentReturnError(
message
) {


const errorBox =
    document.getElementById(
        "investment-error"
    );

if (!errorBox) {

    console.error(
        "Investment Return Calculator:",
        message
    );

    return;

}

errorBox.textContent =
    message;

errorBox.hidden = false;

errorBox.scrollIntoView({

    behavior: "smooth",

    block: "center"

});


}

/* ==========================================================
CLEAR ERROR
========================================================== */

function clearInvestmentReturnError() {


const errorBox =
    document.getElementById(
        "investment-error"
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
RESET
========================================================== */

function resetInvestmentReturnCalculator() {


const currencyElement =
    document.getElementById(
        "investment-currency"
    );

const initialInvestmentElement =
    document.getElementById(
        "initial-investment"
    );

const regularContributionElement =
    document.getElementById(
        "regular-contribution"
    );

const contributionFrequencyElement =
    document.getElementById(
        "contribution-frequency"
    );

const annualReturnElement =
    document.getElementById(
        "investment-return"
    );

const investmentPeriodElement =
    document.getElementById(
        "investment-period"
    );

const compoundingFrequencyElement =
    document.getElementById(
        "compounding-frequency"
    );

const resultBox =
    document.getElementById(
        "investment-result"
    );

const resultContent =
    document.getElementById(
        "investment-result-content"
    );

/*
   Reset currency.
*/

if (currencyElement) {

    currencyElement.value =
        "USD";

}

/*
   Reset all input fields.
*/

if (initialInvestmentElement) {

    initialInvestmentElement.value =
        "";

}

if (regularContributionElement) {

    regularContributionElement.value =
        "";

}

if (contributionFrequencyElement) {

    contributionFrequencyElement.value =
        "monthly";

}

if (annualReturnElement) {

    annualReturnElement.value =
        "";

}

if (investmentPeriodElement) {

    investmentPeriodElement.value =
        "";

}

if (compoundingFrequencyElement) {

    compoundingFrequencyElement.value =
        "monthly";

}

/*
   Clear errors.
*/

clearInvestmentReturnError();

/*
   Hide results.
*/

if (resultBox) {

    resultBox.hidden =
        true;

}

if (resultContent) {

    resultContent.innerHTML =
        "";

}

/*
   Reset summary.
*/

updateInvestmentReturnSummary({

    currency:
        "USD",

    initialInvestment:
        0,

    totalContributions:
        0,

    totalInvestmentGrowth:
        0,

    futureValue:
        0

});

/*
   Return focus to the first field.
*/

if (initialInvestmentElement) {

    initialInvestmentElement.focus();

}


}

/* ==========================================================
END
========================================================== */
