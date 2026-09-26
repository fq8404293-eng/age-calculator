/* ==========================================================
   INFLATION CALCULATOR
   CalclyWorld
========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ======================================================
       ELEMENTS
    ====================================================== */

    const currencySelect =
        document.getElementById("inflation-currency");

    const amountInput =
        document.getElementById("inflation-amount");

    const rateInput =
        document.getElementById("inflation-rate");

    const yearsInput =
        document.getElementById("inflation-years");

    const calculateButton =
        document.getElementById("calculate-inflation");

    const resetButton =
        document.getElementById("reset-inflation");

    const errorBox =
        document.getElementById("inflation-error");

    const resultBox =
        document.getElementById("inflation-result");

    const resultContent =
        document.getElementById("inflation-result-content");

    /* ======================================================
       SUMMARY ELEMENTS
    ====================================================== */

    const summaryStartingAmount =
        document.getElementById(
            "summary-inflation-starting-amount"
        );

    const summaryAdjustedValue =
        document.getElementById(
            "summary-inflation-adjusted-value"
        );

    const summaryTotalInflation =
        document.getElementById(
            "summary-inflation-total"
        );

    const summaryPurchasingPower =
        document.getElementById(
            "summary-inflation-purchasing-power"
        );

    /* ======================================================
       CURRENCY CONFIGURATION
    ====================================================== */

    const currencyConfig = {

        USD: {
            locale: "en-US",
            currency: "USD",
            symbol: "$"
        },

        EUR: {
            locale: "en-IE",
            currency: "EUR",
            symbol: "€"
        },

        GBP: {
            locale: "en-GB",
            currency: "GBP",
            symbol: "£"
        },

        CAD: {
            locale: "en-CA",
            currency: "CAD",
            symbol: "C$"
        },

        AUD: {
            locale: "en-AU",
            currency: "AUD",
            symbol: "A$"
        },

        INR: {
            locale: "en-IN",
            currency: "INR",
            symbol: "₹"
        }

    };

    /* ======================================================
       FORMAT CURRENCY
    ====================================================== */

    function formatCurrency(value) {

        const selectedCurrency =
            currencySelect && currencySelect.value
                ? currencySelect.value
                : "USD";

        const config =
            currencyConfig[selectedCurrency] ||
            currencyConfig.USD;

        const numericValue = Number(value);

        if (!Number.isFinite(numericValue)) {
            return config.symbol + "0.00";
        }

        try {

            return new Intl.NumberFormat(
                config.locale,
                {
                    style: "currency",
                    currency: config.currency,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            ).format(numericValue);

        } catch (error) {

            return (
                config.symbol +
                numericValue.toFixed(2)
            );

        }
    }

    /* ======================================================
       FORMAT NUMBER
    ====================================================== */

    function formatNumber(value) {

        const numericValue = Number(value);

        if (!Number.isFinite(numericValue)) {
            return "0.00";
        }

        return new Intl.NumberFormat(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        ).format(numericValue);
    }

    /* ======================================================
       FORMAT PERCENTAGE
    ====================================================== */

    function formatPercentage(value) {

        const numericValue = Number(value);

        if (!Number.isFinite(numericValue)) {
            return "0.00%";
        }

        return (
            formatNumber(numericValue) +
            "%"
        );
    }

    /* ======================================================
       SHOW ERROR
    ====================================================== */

    function showError(message) {

        if (errorBox) {

            errorBox.textContent = message;
            errorBox.hidden = false;

        }

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

        const amount =
            Number(
                amountInput
                    ? amountInput.value
                    : NaN
            );

        const annualRate =
            Number(
                rateInput
                    ? rateInput.value
                    : NaN
            );

        const years =
            Number(
                yearsInput
                    ? yearsInput.value
                    : NaN
            );

        return {
            amount,
            annualRate,
            years
        };
    }

    /* ======================================================
       VALIDATE INPUTS
    ====================================================== */

    function validateInputs(
        amount,
        annualRate,
        years
    ) {

        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            showError(
                "Please enter a valid starting amount greater than 0."
            );

            if (amountInput) {
                amountInput.focus();
            }

            return false;
        }

        if (
            !Number.isFinite(annualRate) ||
            annualRate < 0 ||
            annualRate > 100
        ) {

            showError(
                "Please enter an annual inflation rate between 0% and 100%."
            );

            if (rateInput) {
                rateInput.focus();
            }

            return false;
        }

        if (
            !Number.isFinite(years) ||
            years < 1 ||
            years > 100 ||
            !Number.isInteger(years)
        ) {

            showError(
                "Please enter a whole number of years between 1 and 100."
            );

            if (yearsInput) {
                yearsInput.focus();
            }

            return false;
        }

        return true;
    }

    /* ======================================================
       CALCULATE INFLATION-ADJUSTED VALUE
    ====================================================== */

    function calculateInflationValue(
        startingAmount,
        annualRate,
        years
    ) {

        const rate =
            annualRate / 100;

        return (
            startingAmount *
            Math.pow(
                1 + rate,
                years
            )
        );
    }

    /* ======================================================
       CALCULATE PURCHASING POWER
    ====================================================== */

    function calculatePurchasingPower(
        annualRate,
        years
    ) {

        const rate =
            annualRate / 100;

        return (
            1 /
            Math.pow(
                1 + rate,
                years
            )
        ) * 100;
    }

    /* ======================================================
       CALCULATE TOTAL INFLATION
    ====================================================== */

    function calculateTotalInflation(
        annualRate,
        years
    ) {

        const rate =
            annualRate / 100;

        return (
            Math.pow(
                1 + rate,
                years
            ) - 1
        ) * 100;
    }

    /* ======================================================
       CREATE YEAR-BY-YEAR INFLATION SCHEDULE
    ====================================================== */

    function createInflationSchedule(
        startingAmount,
        annualRate,
        years
    ) {

        const rate =
            annualRate / 100;

        const schedule = [];

        let currentValue =
            startingAmount;

        for (
            let year = 1;
            year <= years;
            year++
        ) {

            const inflationIncrease =
                currentValue * rate;

            const endingValue =
                currentValue +
                inflationIncrease;

            const cumulativeInflation =
                (
                    (
                        endingValue /
                        startingAmount
                    ) - 1
                ) * 100;

            schedule.push({

                year: year,

                startingValue:
                    currentValue,

                inflationIncrease:
                    inflationIncrease,

                endingValue:
                    endingValue,

                cumulativeInflation:
                    cumulativeInflation

            });

            currentValue =
                endingValue;
        }

        return schedule;
    }

    /* ======================================================
       VALIDATE CALCULATION RESULTS
    ====================================================== */

    function validateCalculationResults(
        adjustedValue,
        purchasingPower,
        totalInflation
    ) {

        if (
            !Number.isFinite(adjustedValue) ||
            adjustedValue <= 0
        ) {

            showError(
                "Unable to calculate the inflation-adjusted value. Please check your inputs and try again."
            );

            return false;
        }

        if (
            !Number.isFinite(purchasingPower) ||
            purchasingPower < 0
        ) {

            showError(
                "Unable to calculate purchasing power. Please check your inputs and try again."
            );

            return false;
        }

        if (
            !Number.isFinite(totalInflation) ||
            totalInflation < 0
        ) {

            showError(
                "Unable to calculate total inflation. Please check your inputs and try again."
            );

            return false;
        }

        return true;
    }

    /* ======================================================
       CREATE RESULTS HTML
    ====================================================== */

    function createResultsHTML(
        startingAmount,
        annualRate,
        years,
        adjustedValue,
        totalInflation,
        purchasingPower,
        schedule
    ) {

        let html = "";

        /* ==================================================
           RESULTS SUMMARY CARDS
        ================================================== */

        html += `

            <div class="calculator-results-grid">

                <div class="result-card">

                    <h3>
                        Inflation-Adjusted Value
                    </h3>

                    <p class="result-value">
                        ${formatCurrency(adjustedValue)}
                    </p>

                </div>

                <div class="result-card">

                    <h3>
                        Total Inflation
                    </h3>

                    <p class="result-value">
                        ${formatPercentage(totalInflation)}
                    </p>

                </div>

                <div class="result-card">

                    <h3>
                        Purchasing Power Remaining
                    </h3>

                    <p class="result-value">
                        ${formatPercentage(purchasingPower)}
                    </p>

                </div>

                <div class="result-card">

                    <h3>
                        Period
                    </h3>

                    <p class="result-value">
                        ${years} years
                    </p>

                </div>

            </div>

        `;

        /* ==================================================
           CALCULATION DETAILS
        ================================================== */

        html += `

            <div class="info-box">

                <h3>
                    Calculation Details
                </h3>

                <p>
                    <strong>
                        Starting Amount:
                    </strong>
                    ${formatCurrency(startingAmount)}
                </p>

                <p>
                    <strong>
                        Annual Inflation Rate:
                    </strong>
                    ${formatPercentage(annualRate)}
                </p>

                <p>
                    <strong>
                        Number of Years:
                    </strong>
                    ${years}
                </p>

                <p>
                    <strong>
                        Inflation-Adjusted Value:
                    </strong>
                    ${formatCurrency(adjustedValue)}
                </p>

                <p>
                    <strong>
                        Total Increase:
                    </strong>
                    ${formatCurrency(
                        adjustedValue - startingAmount
                    )}
                </p>

                <p>
                    <strong>
                        Total Inflation:
                    </strong>
                    ${formatPercentage(totalInflation)}
                </p>

                <p>
                    <strong>
                        Estimated Purchasing Power Remaining:
                    </strong>
                    ${formatPercentage(purchasingPower)}
                </p>

            </div>

        `;

        /* ==================================================
           EXPLANATION
        ================================================== */

        html += `

            <div class="info-box">

                <h3>
                    What This Result Means
                </h3>

                <p>

                    Starting with
                    <strong>
                        ${formatCurrency(startingAmount)}
                    </strong>
                    and assuming an annual inflation rate of
                    <strong>
                        ${formatPercentage(annualRate)}
                    </strong>,
                    the simplified model estimates that the
                    equivalent future amount after
                    <strong>
                        ${years} years
                    </strong>
                    would be
                    <strong>
                        ${formatCurrency(adjustedValue)}
                    </strong>.

                </p>

                <p>

                    This represents a total estimated price-level
                    increase of approximately
                    <strong>
                        ${formatPercentage(totalInflation)}
                    </strong>
                    over the selected period.

                </p>

                <p>

                    A fixed amount of money would retain
                    approximately
                    <strong>
                        ${formatPercentage(purchasingPower)}
                    </strong>
                    of its original purchasing power under
                    this simplified constant-rate model.

                </p>

            </div>

        `;

        /* ==================================================
           FORMULA
        ================================================== */

        html += `

            <div class="info-box">

                <h3>
                    Inflation Calculation
                </h3>

                <p>
                    The calculator uses a simplified compound
                    inflation model:
                </p>

                <p class="text-center">

                    <strong>
                        Future Value = Starting Amount ×
                        (1 + Inflation Rate)<sup>Years</sup>
                    </strong>

                </p>

                <p>
                    The annual inflation rate is converted
                    from a percentage to a decimal before
                    the calculation is performed.
                </p>

            </div>

        `;

        /* ==================================================
           YEAR-BY-YEAR SCHEDULE
        ================================================== */

        html += `

            <div class="amortization-section">

                <h3>
                    Year-by-Year Inflation Estimate
                </h3>

                <p class="small-text">

                    The table below shows how the starting
                    amount changes each year when the same
                    annual inflation assumption is applied
                    repeatedly.

                </p>

                <div class="table-wrapper">

                    <table class="amortization-table">

                        <thead>

                            <tr>

                                <th>
                                    Year
                                </th>

                                <th>
                                    Starting Value
                                </th>

                                <th>
                                    Inflation Increase
                                </th>

                                <th>
                                    Ending Value
                                </th>

                                <th>
                                    Cumulative Inflation
                                </th>

                            </tr>

                        </thead>

                        <tbody>
        `;

        schedule.forEach(function (row) {

            html += `

                <tr>

                    <td>
                        ${row.year}
                    </td>

                    <td>
                        ${formatCurrency(
                            row.startingValue
                        )}
                    </td>

                    <td>
                        ${formatCurrency(
                            row.inflationIncrease
                        )}
                    </td>

                    <td>
                        ${formatCurrency(
                            row.endingValue
                        )}
                    </td>

                    <td>
                        ${formatPercentage(
                            row.cumulativeInflation
                        )}
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
           IMPORTANT NOTE
        ================================================== */

        html += `

            <div class="info-box">

                <h3>
                    Important
                </h3>

                <p>

                    This calculator uses the annual inflation
                    rate entered by the user and assumes that
                    the same rate remains constant throughout
                    the selected period.

                </p>

                <p>

                    Actual inflation can change from year to
                    year, and individual goods and services
                    can experience different price changes.

                    Therefore, this result is a mathematical
                    estimate rather than a guaranteed prediction
                    of future prices.

                </p>

            </div>

        `;

        return html;
    }

    /* ======================================================
       UPDATE SUMMARY
    ====================================================== */

    function updateSummary(
        startingAmount,
        adjustedValue,
        totalInflation,
        purchasingPower
    ) {

        if (summaryStartingAmount) {

            summaryStartingAmount.textContent =
                formatCurrency(startingAmount);

        }

        if (summaryAdjustedValue) {

            summaryAdjustedValue.textContent =
                formatCurrency(adjustedValue);

        }

        if (summaryTotalInflation) {

            summaryTotalInflation.textContent =
                formatPercentage(totalInflation);

        }

        if (summaryPurchasingPower) {

            summaryPurchasingPower.textContent =
                formatPercentage(purchasingPower);

        }
    }

    /* ======================================================
       RESET SUMMARY
    ====================================================== */

    function resetSummary() {

        if (summaryStartingAmount) {

            summaryStartingAmount.textContent =
                formatCurrency(0);

        }

        if (summaryAdjustedValue) {

            summaryAdjustedValue.textContent =
                formatCurrency(0);

        }

        if (summaryTotalInflation) {

            summaryTotalInflation.textContent =
                "0.00%";

        }

        if (summaryPurchasingPower) {

            summaryPurchasingPower.textContent =
                "100.00%";

        }
    }

    /* ======================================================
       CALCULATE INFLATION
    ====================================================== */

    function calculateInflation() {

        clearError();

        /* ==================================================
           GET INPUTS
        ================================================== */

        const {
            amount,
            annualRate,
            years
        } = getInputs();

        /* ==================================================
           VALIDATE INPUTS
        ================================================== */

        if (
            !validateInputs(
                amount,
                annualRate,
                years
            )
        ) {

            return;
        }

        /* ==================================================
           CALCULATE ADJUSTED VALUE
        ================================================== */

        const adjustedValue =
            calculateInflationValue(
                amount,
                annualRate,
                years
            );

        /* ==================================================
           CALCULATE TOTAL INFLATION
        ================================================== */

        const totalInflation =
            calculateTotalInflation(
                annualRate,
                years
            );

        /* ==================================================
           CALCULATE PURCHASING POWER
        ================================================== */

        const purchasingPower =
            calculatePurchasingPower(
                annualRate,
                years
            );

        /* ==================================================
           VALIDATE RESULTS
        ================================================== */

        if (
            !validateCalculationResults(
                adjustedValue,
                purchasingPower,
                totalInflation
            )
        ) {

            return;
        }

        /* ==================================================
           CREATE SCHEDULE
        ================================================== */

        const schedule =
            createInflationSchedule(
                amount,
                annualRate,
                years
            );

        /* ==================================================
           CREATE RESULTS
        ================================================== */

        if (resultContent) {

            resultContent.innerHTML =
                createResultsHTML(
                    amount,
                    annualRate,
                    years,
                    adjustedValue,
                    totalInflation,
                    purchasingPower,
                    schedule
                );
        }

        /* ==================================================
           SHOW RESULTS
        ================================================== */

        if (resultBox) {

            resultBox.hidden = false;
        }

        /* ==================================================
           UPDATE SUMMARY
        ================================================== */

        updateSummary(
            amount,
            adjustedValue,
            totalInflation,
            purchasingPower
        );

        /* ==================================================
           SCROLL TO RESULTS
        ================================================== */

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

        /* ==================================================
           CLEAR INPUTS
        ================================================== */

        if (amountInput) {
            amountInput.value = "";
        }

        if (rateInput) {
            rateInput.value = "";
        }

        if (yearsInput) {
            yearsInput.value = "";
        }

        /* ==================================================
           RESET CURRENCY
        ================================================== */

        if (currencySelect) {
            currencySelect.value = "USD";
        }

        /* ==================================================
           CLEAR RESULTS
        ================================================== */

        if (resultContent) {
            resultContent.innerHTML = "";
        }

        if (resultBox) {
            resultBox.hidden = true;
        }

        /* ==================================================
           RESET SUMMARY
        ================================================== */

        resetSummary();

        /* ==================================================
           RETURN FOCUS
        ================================================== */

        if (amountInput) {
            amountInput.focus();
        }
    }

    /* ======================================================
       CALCULATE BUTTON
    ====================================================== */

    if (calculateButton) {

        calculateButton.addEventListener(
            "click",
            calculateInflation
        );

    }

    /* ======================================================
       RESET BUTTON
    ====================================================== */

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
        amountInput,
        rateInput,
        yearsInput

    ].forEach(function (input) {

        if (!input) {
            return;
        }

        input.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    calculateInflation();

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

                    calculateInflation();

                }

            }
        );

    }

    /* ======================================================
       INITIALIZATION
    ====================================================== */

    resetSummary();

});