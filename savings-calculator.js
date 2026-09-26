
"use strict";

/* ==========================================================
   CalclyWorld
   Savings Growth Calculator
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeSavingsCalculator();

});


/* ==========================================================
   SAVINGS CALCULATOR
========================================================== */

function initializeSavingsCalculator() {

    const currencySelect =
        document.getElementById("savings-currency");

    const startingBalanceInput =
        document.getElementById("starting-balance");

    const monthlyContributionInput =
        document.getElementById("monthly-contribution");

    const interestRateInput =
        document.getElementById("savings-interest-rate");

    const savingsYearsInput =
        document.getElementById("savings-years");

    const compoundingFrequencySelect =
        document.getElementById("compounding-frequency");

    const calculateButton =
        document.getElementById("calculate-savings");

    const resetButton =
        document.getElementById("reset-savings");

    const result =
        document.getElementById("savings-result");

    const resultContent =
        document.getElementById("savings-result-content");

    const totalContributedElement =
        document.getElementById("total-contributed");

    const interestEarnedElement =
        document.getElementById("interest-earned");

    const finalBalanceElement =
        document.getElementById("final-balance");

    const yearlyBreakdown =
        document.getElementById("yearly-breakdown");

    const yearlyBreakdownContent =
        document.getElementById("yearly-breakdown-content");


    if (
        !currencySelect ||
        !startingBalanceInput ||
        !monthlyContributionInput ||
        !interestRateInput ||
        !savingsYearsInput ||
        !compoundingFrequencySelect ||
        !calculateButton ||
        !resetButton ||
        !result ||
        !resultContent ||
        !totalContributedElement ||
        !interestEarnedElement ||
        !finalBalanceElement ||
        !yearlyBreakdown ||
        !yearlyBreakdownContent
    ) {

        return;

    }


    /* ======================================================
       CURRENCY SETTINGS
    ====================================================== */

    const currencySettings = {

        USD: {
            locale: "en-US",
            currency: "USD"
        },

        INR: {
            locale: "en-IN",
            currency: "INR"
        },

        GBP: {
            locale: "en-GB",
            currency: "GBP"
        },

        EUR: {
            locale: "de-DE",
            currency: "EUR"
        }

    };


    /* ======================================================
       FORMAT CURRENCY
    ====================================================== */

    function formatCurrency(amount) {

        const selectedCurrency =
            currencySelect.value;

        const settings =
            currencySettings[selectedCurrency] ||
            currencySettings.USD;

        return new Intl.NumberFormat(
            settings.locale,
            {
                style: "currency",
                currency: settings.currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        ).format(amount);

    }


    /* ======================================================
       VALIDATE INPUTS
    ====================================================== */

    function validateInputs() {

        const startingBalance =
            Number(startingBalanceInput.value);

        const monthlyContribution =
            Number(monthlyContributionInput.value);

        const annualInterestRate =
            Number(interestRateInput.value);

        const savingsYears =
            Number(savingsYearsInput.value);

        const compoundingFrequency =
            Number(compoundingFrequencySelect.value);


        if (
            !Number.isFinite(startingBalance) ||
            startingBalance < 0
        ) {

            alert(
                "Please enter a valid starting balance."
            );

            startingBalanceInput.focus();

            return null;

        }


        if (
            !Number.isFinite(monthlyContribution) ||
            monthlyContribution < 0
        ) {

            alert(
                "Please enter a valid monthly contribution."
            );

            monthlyContributionInput.focus();

            return null;

        }


        if (
            !Number.isFinite(annualInterestRate) ||
            annualInterestRate < 0 ||
            annualInterestRate > 100
        ) {

            alert(
                "Please enter an annual interest rate between 0% and 100%."
            );

            interestRateInput.focus();

            return null;

        }


        if (
            !Number.isFinite(savingsYears) ||
            savingsYears <= 0 ||
            savingsYears > 100
        ) {

            alert(
                "Please enter a savings period between 0.25 and 100 years."
            );

            savingsYearsInput.focus();

            return null;

        }


        if (
            !Number.isFinite(compoundingFrequency) ||
            compoundingFrequency <= 0
        ) {

            alert(
                "Please select a valid compounding frequency."
            );

            compoundingFrequencySelect.focus();

            return null;

        }


        return {

            startingBalance,
            monthlyContribution,
            annualInterestRate,
            savingsYears,
            compoundingFrequency

        };

    }


    /* ======================================================
       CALCULATE SAVINGS
    ====================================================== */

    function calculateSavings() {

        const inputs =
            validateInputs();

        if (!inputs) return;


        const {
            startingBalance,
            monthlyContribution,
            annualInterestRate,
            savingsYears,
            compoundingFrequency
        } = inputs;


        /*
            The calculator uses monthly time steps because
            monthly contributions are entered by the user.

            The selected compounding frequency determines
            the periodic interest rate used for each month.

            For annual, semi-annual, quarterly, and monthly
            compounding, interest is applied according to
            the selected number of compounding periods.

            Daily compounding uses an effective daily rate
            and applies the equivalent monthly growth factor.
        */


        const totalMonths =
            Math.round(savingsYears * 12);


        const monthlyContributionCount =
            totalMonths;


        const totalContributed =
            startingBalance +
            (
                monthlyContribution *
                monthlyContributionCount
            );


        let balance =
            startingBalance;


        const annualRateDecimal =
            annualInterestRate / 100;


        let monthlyGrowthFactor;


        if (annualRateDecimal === 0) {

            monthlyGrowthFactor = 1;

        } else {

            const periodicRate =
                annualRateDecimal /
                compoundingFrequency;


            const periodsPerMonth =
                compoundingFrequency /
                12;


            if (
                compoundingFrequency === 365
            ) {

                const dailyRate =
                    annualRateDecimal /
                    365;

                monthlyGrowthFactor =
                    Math.pow(
                        1 + dailyRate,
                        365 / 12
                    );

            } else {

                monthlyGrowthFactor =
                    Math.pow(
                        1 + periodicRate,
                        periodsPerMonth
                    );

            }

        }


        const yearlyData = [];


        let totalInterestEarned = 0;


        /*
            Calculate month by month.

            Monthly contribution is added at the end
            of each month after the balance grows.
        */


        for (
            let month = 1;
            month <= totalMonths;
            month++
        ) {


            const balanceBeforeInterest =
                balance;


            balance =
                balance *
                monthlyGrowthFactor;


            const monthlyInterest =
                balance -
                balanceBeforeInterest;


            totalInterestEarned +=
                monthlyInterest;


            balance +=
                monthlyContribution;


            /*
                Save a yearly snapshot.

                A partial final year is also included.
            */

            if (
                month % 12 === 0 ||
                month === totalMonths
            ) {

                const yearNumber =
                    Math.ceil(month / 12);


                const amountContributed =
                    startingBalance +
                    (
                        monthlyContribution *
                        month
                    );


                const interestEarned =
                    balance -
                    amountContributed;


                yearlyData.push({

                    year:
                        yearNumber,

                    months:
                        month,

                    contributed:
                        amountContributed,

                    interest:
                        interestEarned,

                    balance:
                        balance

                });

            }

        }


        const finalBalance =
            balance;


        const interestEarned =
            finalBalance -
            totalContributed;


        /*
            Prevent very small floating point
            differences from appearing as negative zero.
        */

        const safeInterestEarned =
            Math.abs(interestEarned) < 0.005
                ? 0
                : interestEarned;


        /* ==================================================
           UPDATE SUMMARY
        ================================================== */

        totalContributedElement.textContent =
            formatCurrency(totalContributed);


        interestEarnedElement.textContent =
            formatCurrency(safeInterestEarned);


        finalBalanceElement.textContent =
            formatCurrency(finalBalance);


        /* ==================================================
           UPDATE RESULT MESSAGE
        ================================================== */

        resultContent.innerHTML = `

            <div class="info-box">

                <p>
                    <strong>
                        Starting Balance
                    </strong>
                    <br>
                    ${formatCurrency(startingBalance)}
                </p>

                <hr>

                <p>
                    <strong>
                        Monthly Contribution
                    </strong>
                    <br>
                    ${formatCurrency(monthlyContribution)}
                </p>

                <hr>

                <p>
                    <strong>
                        Annual Interest Rate
                    </strong>
                    <br>
                    ${annualInterestRate.toFixed(2)}%
                </p>

                <hr>

                <p>
                    <strong>
                        Savings Period
                    </strong>
                    <br>
                    ${savingsYears} ${
                        savingsYears === 1
                            ? "year"
                            : "years"
                    }
                </p>

                <hr>

                <p>
                    <strong>
                        Estimated Final Balance
                    </strong>
                    <br>
                    ${formatCurrency(finalBalance)}
                </p>

            </div>

            <p class="small-text">

                Based on the assumptions you entered, your estimated final
                savings balance could be
                <strong>${formatCurrency(finalBalance)}</strong>.
                This includes an estimated
                <strong>${formatCurrency(safeInterestEarned)}</strong>
                in interest growth.

                Actual results may differ because interest rates,
                account conditions, fees, taxes, and other factors
                can change.

            </p>

        `;


        /* ==================================================
           YEAR-BY-YEAR BREAKDOWN
        ================================================== */


        if (
            yearlyData.length > 0
        ) {

            let tableHTML = `

                <div class="table-wrapper">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Year
                                </th>

                                <th>
                                    Total Contributed
                                </th>

                                <th>
                                    Interest Earned
                                </th>

                                <th>
                                    Estimated Balance
                                </th>

                            </tr>

                        </thead>

                        <tbody>

            `;


            yearlyData.forEach(data => {

                tableHTML += `

                    <tr>

                        <td>
                            ${data.year}
                        </td>

                        <td>
                            ${formatCurrency(
                                data.contributed
                            )}
                        </td>

                        <td>
                            ${formatCurrency(
                                Math.max(
                                    0,
                                    data.interest
                                )
                            )}
                        </td>

                        <td>
                            ${formatCurrency(
                                data.balance
                            )}
                        </td>

                    </tr>

                `;

            });


            tableHTML += `

                        </tbody>

                    </table>

                </div>

                <p class="small-text">

                    The year-by-year figures are estimates based on the
                    assumptions entered into the calculator. They are
                    intended to help you compare how your savings balance
                    may change over time.

                </p>

            `;


            yearlyBreakdownContent.innerHTML =
                tableHTML;


            yearlyBreakdown.hidden =
                false;

        }


        /* ==================================================
           SHOW RESULTS
        ================================================== */

        result.hidden =
            false;


        /*
            Scroll to results after calculation.

            A short timeout allows the hidden result
            section to become visible before scrolling.
        */

        setTimeout(() => {

            result.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        }, 100);

    }


    /* ======================================================
       RESET CALCULATOR
    ====================================================== */

    function resetCalculator() {

        startingBalanceInput.value =
            "";

        monthlyContributionInput.value =
            "";

        interestRateInput.value =
            "";

        savingsYearsInput.value =
            "";

        currencySelect.value =
            "USD";

        compoundingFrequencySelect.value =
            "12";


        totalContributedElement.textContent =
            "$0.00";

        interestEarnedElement.textContent =
            "$0.00";

        finalBalanceElement.textContent =
            "$0.00";


        resultContent.innerHTML =
            "";

        yearlyBreakdownContent.innerHTML =
            "";


        result.hidden =
            true;

        yearlyBreakdown.hidden =
            true;


        startingBalanceInput.focus();

    }


    /* ======================================================
       EVENT LISTENERS
    ====================================================== */

    calculateButton.addEventListener(
        "click",
        calculateSavings
    );


    resetButton.addEventListener(
        "click",
        resetCalculator
    );


    /*
        Allow Enter key to calculate
        when typing inside calculator inputs.
    */

    [
        startingBalanceInput,
        monthlyContributionInput,
        interestRateInput,
        savingsYearsInput
    ].forEach(input => {

        input.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    calculateSavings();

                }

            }
        );

    });


    /*
        Recalculate currency formatting
        when the user changes currency
        after results are already visible.
    */

    currencySelect.addEventListener(
        "change",
        () => {

            if (
                !result.hidden
            ) {

                calculateSavings();

            }

        }
    );


    /*
        Recalculate when compounding
        frequency changes after results
        are already visible.
    */

    compoundingFrequencySelect.addEventListener(
        "change",
        () => {

            if (
                !result.hidden
            ) {

                calculateSavings();

            }

        }
    );

}

