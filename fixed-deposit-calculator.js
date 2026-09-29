"use strict";

/* ==========================================================
CalclyWorld Fixed Deposit Calculator
========================================================== */

const fixedDepositCalculatorSearchData = [
{ name: "Fixed Deposit Calculator", url: "fixed-deposit-calculator.html" },
{ name: "Recurring Deposit Calculator", url: "recurring-deposit-calculator.html" },
{ name: "Investment Return Calculator", url: "investment-return-calculator.html" },
{ name: "Savings Growth Calculator", url: "savings-calculator.html" },
{ name: "Compound Interest Calculator", url: "compound-interest-calculator.html" },
{ name: "SIP Calculator", url: "sip-calculator.html" },
{ name: "Retirement Calculator", url: "retirement-calculator.html" },
{ name: "Loan Calculator", url: "loan-calculator.html" },
{ name: "Mortgage Calculator", url: "mortgage-calculator.html" },
{ name: "EMI Calculator", url: "emi-calculator.html" },
{ name: "GST Calculator", url: "gst-calculator.html" },
{ name: "Percentage Calculator", url: "percentage-calculator.html" },
{ name: "Tip Calculator", url: "tip-calculator.html" },
{ name: "Age Calculator", url: "age-calculator.html" }
];

/* ==========================================================
INITIALIZATION
========================================================== */

document.addEventListener("DOMContentLoaded", function () {


initializeFixedDepositCalculator();
initializeFixedDepositSearch();


});

/* ==========================================================
CALCULATOR INITIALIZATION
========================================================== */

function initializeFixedDepositCalculator() {


const calculateButton = document.getElementById("calculate-fd");
const resetButton = document.getElementById("reset-fd");

if (!calculateButton || !resetButton) {

    console.error(
        "Fixed Deposit Calculator: Required buttons were not found."
    );

    return;

}

calculateButton.addEventListener(
    "click",
    calculateFixedDeposit
);

resetButton.addEventListener(
    "click",
    resetFixedDepositCalculator
);

const inputElements = document.querySelectorAll(
    "#fd-currency, " +
    "#fd-principal, " +
    "#fd-interest-rate, " +
    "#fd-tenure, " +
    "#fd-tenure-unit, " +
    "#fd-compounding-frequency"
);

inputElements.forEach(function (input) {

    input.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                calculateFixedDeposit();

            }

        }
    );

});


}

/* ==========================================================
MAIN FIXED DEPOSIT CALCULATION
========================================================== */

function calculateFixedDeposit() {


clearFixedDepositError();

const currencyElement =
    document.getElementById("fd-currency");

const principalElement =
    document.getElementById("fd-principal");

const interestRateElement =
    document.getElementById("fd-interest-rate");

const tenureElement =
    document.getElementById("fd-tenure");

const tenureUnitElement =
    document.getElementById("fd-tenure-unit");

const compoundingFrequencyElement =
    document.getElementById("fd-compounding-frequency");

if (
    !currencyElement ||
    !principalElement ||
    !interestRateElement ||
    !tenureElement ||
    !tenureUnitElement ||
    !compoundingFrequencyElement
) {

    showFixedDepositError(
        "The calculator could not load correctly. Please refresh the page and try again."
    );

    return;

}

const currency =
    currencyElement.value;

const principal =
    parseFloat(principalElement.value);

const annualInterestRate =
    parseFloat(interestRateElement.value);

const tenure =
    parseFloat(tenureElement.value);

const tenureUnit =
    tenureUnitElement.value;

const compoundingFrequency =
    compoundingFrequencyElement.value;

/* ======================================================
   VALIDATION
====================================================== */

if (
    !Number.isFinite(principal) ||
    principal <= 0
) {

    showFixedDepositError(
        "Please enter a valid deposit amount greater than 0."
    );

    principalElement.focus();

    return;

}

if (
    !Number.isFinite(annualInterestRate) ||
    annualInterestRate < 0 ||
    annualInterestRate > 100
) {

    showFixedDepositError(
        "Please enter an annual interest rate between 0% and 100%."
    );

    interestRateElement.focus();

    return;

}

if (
    !Number.isFinite(tenure) ||
    tenure <= 0 ||
    tenure > 100
) {

    showFixedDepositError(
        "Please enter a valid investment tenure greater than 0 and no more than 100 years."
    );

    tenureElement.focus();

    return;

}

if (
    tenureUnit !== "years" &&
    tenureUnit !== "months"
) {

    showFixedDepositError(
        "Please select a valid tenure unit."
    );

    tenureUnitElement.focus();

    return;

}

if (
    compoundingFrequency !== "monthly" &&
    compoundingFrequency !== "quarterly" &&
    compoundingFrequency !== "half-yearly" &&
    compoundingFrequency !== "yearly"
) {

    showFixedDepositError(
        "Please select a valid compounding frequency."
    );

    compoundingFrequencyElement.focus();

    return;

}

/* ======================================================
   CONVERT TENURE TO YEARS
====================================================== */

const tenureYears =
    tenureUnit === "months"
        ? tenure / 12
        : tenure;

if (
    !Number.isFinite(tenureYears) ||
    tenureYears <= 0
) {

    showFixedDepositError(
        "Please enter a valid investment tenure."
    );

    tenureElement.focus();

    return;

}

/* ======================================================
   COMPOUNDING FREQUENCY
====================================================== */

let compoundsPerYear;

switch (compoundingFrequency) {

    case "monthly":
        compoundsPerYear = 12;
        break;

    case "quarterly":
        compoundsPerYear = 4;
        break;

    case "half-yearly":
        compoundsPerYear = 2;
        break;

    case "yearly":
        compoundsPerYear = 1;
        break;

    default:

        showFixedDepositError(
            "Please select a valid compounding frequency."
        );

        compoundingFrequencyElement.focus();

        return;

}

/* ======================================================
   CALCULATE MATURITY VALUE
====================================================== */

const annualRate =
    annualInterestRate / 100;

let maturityAmount;

if (annualInterestRate === 0) {

    maturityAmount = principal;

} else {

    maturityAmount =
        principal *
        Math.pow(
            1 +
            annualRate / compoundsPerYear,
            compoundsPerYear * tenureYears
        );

}

const totalInterest =
    maturityAmount - principal;

const totalReturnPercentage =
    principal > 0
        ? (totalInterest / principal) * 100
        : 0;

/* ======================================================
   PREVENT INVALID NUMBERS
====================================================== */

if (
    !Number.isFinite(maturityAmount) ||
    !Number.isFinite(totalInterest)
) {

    showFixedDepositError(
        "The calculation produced an invalid result. Please check your inputs and try again."
    );

    return;

}

const calculationData = {

    currency: currency,

    principal: principal,

    annualInterestRate:
        annualInterestRate,

    tenure: tenure,

    tenureUnit: tenureUnit,

    tenureYears: tenureYears,

    compoundingFrequency:
        compoundingFrequency,

    compoundsPerYear:
        compoundsPerYear,

    maturityAmount:
        maturityAmount,

    totalInterest:
        totalInterest,

    totalReturnPercentage:
        totalReturnPercentage

};

displayFixedDepositResults(
    calculationData
);


}

/* ==========================================================
DISPLAY RESULTS
========================================================== */

function displayFixedDepositResults(data) {


const resultBox =
    document.getElementById("fd-result");

const resultContent =
    document.getElementById("fd-result-content");

if (
    !resultBox ||
    !resultContent
) {

    showFixedDepositError(
        "The results section could not be loaded. Please refresh the page and try again."
    );

    return;

}

const formatMoney =
    createMoneyFormatter(
        data.currency
    );

const tenureText =
    data.tenureUnit === "months"
        ? `${data.tenure} month${data.tenure === 1 ? "" : "s"}`
        : `${data.tenure} year${data.tenure === 1 ? "" : "s"}`;

const compoundingText =
    getCompoundingFrequencyText(
        data.compoundingFrequency
    );

resultContent.innerHTML = `

    <div class="result-summary">

        <div class="result-item">

            <strong>
                Deposit Amount
            </strong>

            <span>
                ${formatMoney(data.principal)}
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
                Investment Tenure
            </strong>

            <span>
                ${tenureText}
            </span>

        </div>

        <div class="result-item">

            <strong>
                Compounding Frequency
            </strong>

            <span>
                ${compoundingText}
            </span>

        </div>

        <div class="result-item">

            <strong>
                Estimated Interest Earned
            </strong>

            <span>
                ${formatMoney(data.totalInterest)}
            </span>

        </div>

        <div class="result-item">

            <strong>
                Estimated Total Return
            </strong>

            <span>
                ${data.totalReturnPercentage.toFixed(2)}%
            </span>

        </div>

        <div class="result-item result-highlight">

            <strong>
                Estimated Maturity Amount
            </strong>

            <span>
                ${formatMoney(data.maturityAmount)}
            </span>

        </div>

    </div>

    <div class="investment-breakdown">

        <h3>
            Year-by-Year Growth Breakdown
        </h3>

        <p class="small-text">

            This table shows an estimated view of how the fixed deposit
            balance could grow over the selected investment period.

        </p>

        <div class="table-responsive">

            <table class="growth-table">

                <thead>

                    <tr>

                        <th scope="col">
                            Year
                        </th>

                        <th scope="col">
                            Principal
                        </th>

                        <th scope="col">
                            Estimated Interest
                        </th>

                        <th scope="col">
                            Estimated Balance
                        </th>

                    </tr>

                </thead>

                <tbody id="fd-growth-table">
                </tbody>

            </table>

        </div>

    </div>

`;

generateFixedDepositBreakdown(
    data,
    formatMoney
);

resultBox.hidden = false;

resultBox.scrollIntoView({
    behavior: "smooth",
    block: "start"
});

updateFixedDepositSummary(
    data,
    formatMoney
);


}

/* ==========================================================
YEAR-BY-YEAR BREAKDOWN
========================================================== */

function generateFixedDepositBreakdown(
data,
formatMoney
) {


const tableBody =
    document.getElementById(
        "fd-growth-table"
    );

if (!tableBody) {
    return;
}

tableBody.innerHTML = "";

const fullYears =
    Math.floor(
        data.tenureYears
    );

const hasPartialYear =
    data.tenureYears > fullYears;

const totalRows =
    hasPartialYear
        ? fullYears + 1
        : fullYears;

for (
    let year = 1;
    year <= totalRows;
    year++
) {

    const elapsedYears =
        Math.min(
            year,
            data.tenureYears
        );

    const balance =
        calculateFixedDepositBalanceAtTime(
            data,
            elapsedYears
        );

    const interestEarned =
        balance -
        data.principal;

    const row =
        document.createElement(
            "tr"
        );

    const yearLabel =
        elapsedYears === data.tenureYears
            ? `${year} (Final)`
            : `${year}`;

    row.innerHTML = `

        <td>
            ${yearLabel}
        </td>

        <td>
            ${formatMoney(data.principal)}
        </td>

        <td>
            ${formatMoney(interestEarned)}
        </td>

        <td>
            <strong>
                ${formatMoney(balance)}
            </strong>
        </td>

    `;

    tableBody.appendChild(
        row
    );

}


}

/* ==========================================================
BALANCE AT SPECIFIC TIME
========================================================== */

function calculateFixedDepositBalanceAtTime(
data,
yearsElapsed
) {


if (
    yearsElapsed <= 0
) {

    return data.principal;

}

if (
    data.annualInterestRate === 0
) {

    return data.principal;

}

const annualRate =
    data.annualInterestRate / 100;

const periodicRate =
    annualRate /
    data.compoundsPerYear;

const compoundingPeriods =
    data.compoundsPerYear *
    yearsElapsed;

const balance =
    data.principal *
    Math.pow(
        1 + periodicRate,
        compoundingPeriods
    );

return balance;


}

/* ==========================================================
SUMMARY
========================================================== */

function updateFixedDepositSummary(
data,
formatMoney
) {


const summaryPrincipal =
    document.getElementById(
        "summary-fd-principal"
    );

const summaryInterest =
    document.getElementById(
        "summary-fd-interest"
    );

const summaryMaturity =
    document.getElementById(
        "summary-fd-maturity"
    );

if (summaryPrincipal) {

    summaryPrincipal.textContent =
        formatMoney(
            data.principal
        );

}

if (summaryInterest) {

    summaryInterest.textContent =
        formatMoney(
            data.totalInterest
        );

}

if (summaryMaturity) {

    summaryMaturity.textContent =
        formatMoney(
            data.maturityAmount
        );

}


}

/* ==========================================================
MONEY FORMATTER
========================================================== */

function createMoneyFormatter(
currency
) {


return function (amount) {

    try {

        return new Intl.NumberFormat(
            undefined,
            {
                style: "currency",
                currency: currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        ).format(amount);

    } catch (error) {

        return (
            currency +
            " " +
            Number(amount).toFixed(2)
        );

    }

};


}

/* ==========================================================
COMPOUNDING FREQUENCY TEXT
========================================================== */

function getCompoundingFrequencyText(
frequency
) {


switch (frequency) {

    case "monthly":
        return "Monthly";

    case "quarterly":
        return "Quarterly";

    case "half-yearly":
        return "Half-Yearly";

    case "yearly":
        return "Yearly";

    default:
        return "Not specified";

}


}

/* ==========================================================
ERROR HANDLING
========================================================== */

function showFixedDepositError(
message
) {


const errorBox =
    document.getElementById(
        "fd-error"
    );

if (!errorBox) {

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
    behavior: "smooth",
    block: "center"
});


}

/* ==========================================================
CLEAR ERROR
========================================================== */

function clearFixedDepositError() {


const errorBox =
    document.getElementById(
        "fd-error"
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

function resetFixedDepositCalculator() {


const currencyElement =
    document.getElementById(
        "fd-currency"
    );

const principalElement =
    document.getElementById(
        "fd-principal"
    );

const interestRateElement =
    document.getElementById(
        "fd-interest-rate"
    );

const tenureElement =
    document.getElementById(
        "fd-tenure"
    );

const tenureUnitElement =
    document.getElementById(
        "fd-tenure-unit"
    );

const compoundingFrequencyElement =
    document.getElementById(
        "fd-compounding-frequency"
    );

const resultBox =
    document.getElementById(
        "fd-result"
    );

const resultContent =
    document.getElementById(
        "fd-result-content"
    );

if (currencyElement) {

    currencyElement.value =
        "INR";

}

if (principalElement) {

    principalElement.value =
        "";

}

if (interestRateElement) {

    interestRateElement.value =
        "";

}

if (tenureElement) {

    tenureElement.value =
        "";

}

if (tenureUnitElement) {

    tenureUnitElement.value =
        "years";

}

if (compoundingFrequencyElement) {

    compoundingFrequencyElement.value =
        "quarterly";

}

clearFixedDepositError();

if (resultBox) {

    resultBox.hidden =
        true;

}

if (resultContent) {

    resultContent.innerHTML =
        "";

}

updateFixedDepositSummary(

    {
        principal: 0,
        totalInterest: 0,
        maturityAmount: 0,
        currency: "INR"
    },

    createMoneyFormatter(
        "INR"
    )

);

if (principalElement) {

    principalElement.focus();

}


}

/* ==========================================================
CALCULATOR SEARCH
========================================================== */

function initializeFixedDepositSearch() {


const searchInput =
    document.getElementById(
        "calculator-search"
    );

const searchResults =
    document.getElementById(
        "calculator-search-results"
    );

if (
    !searchInput ||
    !searchResults
) {

    return;

}

searchInput.addEventListener(
    "input",
    function () {

        const query =
            searchInput.value
                .trim()
                .toLowerCase();

        if (
            query.length === 0
        ) {

            searchResults.innerHTML =
                "";

            searchResults.hidden =
                true;

            return;

        }

        const matches =
            fixedDepositCalculatorSearchData.filter(
                function (calculator) {

                    return calculator.name
                        .toLowerCase()
                        .includes(query);

                }
            );

        if (
            matches.length === 0
        ) {

            searchResults.innerHTML =
                '<div class="search-no-results">No calculators found.</div>';

            searchResults.hidden =
                false;

            return;

        }

        searchResults.innerHTML =
            matches
                .map(
                    function (calculator) {

                        return `
                            <a
                                class="search-result-item"
                                href="${calculator.url}">
                                ${calculator.name}
                            </a>
                        `;

                    }
                )
                .join("");

        searchResults.hidden =
            false;

    }
);

document.addEventListener(
    "click",
    function (event) {

        if (
            !event.target.closest(
                ".calculator-search"
            )
        ) {

            searchResults.hidden =
                true;

        }

    }
);


}
