"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /*
    --------------------------------------------------
    Get Calculator Elements
    --------------------------------------------------
    */

    const monthlyInvestmentInput =
        document.getElementById("monthly-investment");

    const annualReturnInput =
        document.getElementById("annual-return");

    const investmentYearsInput =
        document.getElementById("investment-years");

    const currencyInput =
        document.getElementById("sip-currency");

    const calculateButton =
        document.getElementById("calculate-sip");

    const resetButton =
        document.getElementById("reset-sip");

    const resultCard =
        document.getElementById("sip-result");

    const resultContent =
        document.getElementById("sip-result-content");

    const investedAmountElement =
        document.getElementById("total-invested");

    const estimatedReturnElement =
        document.getElementById("estimated-returns");

    const futureValueElement =
        document.getElementById("future-value");


    /*
    --------------------------------------------------
    Check Required Elements
    --------------------------------------------------
    */

    if (
        !monthlyInvestmentInput ||
        !annualReturnInput ||
        !investmentYearsInput ||
        !currencyInput ||
        !calculateButton ||
        !resetButton ||
        !resultCard ||
        !resultContent ||
        !investedAmountElement ||
        !estimatedReturnElement ||
        !futureValueElement
    ) {
        console.error(
            "SIP Calculator: One or more required HTML elements were not found."
        );

        return;
    }


    /*
    --------------------------------------------------
    Currency Settings
    --------------------------------------------------
    */

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


    /*
    --------------------------------------------------
    Format Currency
    --------------------------------------------------
    */

    function formatCurrency(value, currencyCode) {

        const settings =
            currencySettings[currencyCode] ||
            currencySettings.USD;

        return new Intl.NumberFormat(
            settings.locale,
            {
                style: "currency",
                currency: settings.currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        ).format(value);

    }


    /*
    --------------------------------------------------
    Show Warning
    --------------------------------------------------
    */

    function showWarning(message) {

        resultCard.hidden = false;

        resultContent.innerHTML = `

            <div
                class="warning-box"
                role="alert">

                <p>
                    ${message}
                </p>

            </div>

        `;

        resultCard.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    /*
    --------------------------------------------------
    Calculate SIP
    --------------------------------------------------
    */

    function calculateSIP() {

        /*
        --------------------------------------------------
        Read User Inputs
        --------------------------------------------------
        */

        const monthlyInvestment =
            parseFloat(
                monthlyInvestmentInput.value
            );

        const annualReturn =
            parseFloat(
                annualReturnInput.value
            );

        const investmentYears =
            parseFloat(
                investmentYearsInput.value
            );

        const currencyCode =
            currencyInput.value;


        /*
        --------------------------------------------------
        Basic Validation
        --------------------------------------------------
        */

        if (
            !Number.isFinite(monthlyInvestment) ||
            !Number.isFinite(annualReturn) ||
            !Number.isFinite(investmentYears)
        ) {

            showWarning(
                "Please enter your monthly investment, expected annual return, and investment period."
            );

            return;

        }


        /*
        --------------------------------------------------
        Monthly Investment Validation
        --------------------------------------------------
        */

        if (
            monthlyInvestment <= 0
        ) {

            showWarning(
                "Please enter a monthly investment amount greater than zero."
            );

            monthlyInvestmentInput.focus();

            return;

        }


        /*
        --------------------------------------------------
        Annual Return Validation
        --------------------------------------------------
        */

        if (
            annualReturn < 0 ||
            annualReturn > 100
        ) {

            showWarning(
                "Please enter an expected annual return between 0% and 100%."
            );

            annualReturnInput.focus();

            return;

        }


        /*
        --------------------------------------------------
        Investment Period Validation
        --------------------------------------------------
        */

        if (
            investmentYears < 0.25 ||
            investmentYears > 100
        ) {

            showWarning(
                "Please enter an investment period between 0.25 and 100 years."
            );

            investmentYearsInput.focus();

            return;

        }


        /*
        --------------------------------------------------
        Convert Years to Months
        --------------------------------------------------
        */

        const months =
            Math.round(
                investmentYears * 12
            );


        /*
        --------------------------------------------------
        Total Amount Invested
        --------------------------------------------------
        */

        const totalInvested =
            monthlyInvestment * months;


        /*
        --------------------------------------------------
        Monthly Return Rate
        --------------------------------------------------
        */

        const monthlyRate =
            annualReturn / 100 / 12;


        /*
        --------------------------------------------------
        Calculate Future Value
        --------------------------------------------------

        Formula:

        FV = P × [((1 + r)^n - 1) / r]

        P = Monthly Investment
        r = Monthly Return Rate
        n = Total Number of Months

        Monthly investments are assumed
        to be made at the end of each month.
        --------------------------------------------------
        */

        let futureValue;


        /*
        --------------------------------------------------
        Zero Return Case
        --------------------------------------------------
        */

        if (
            monthlyRate === 0
        ) {

            futureValue =
                totalInvested;

        } else {

            const growthFactor =
                Math.pow(
                    1 + monthlyRate,
                    months
                );


            futureValue =
                monthlyInvestment *
                (
                    (growthFactor - 1) /
                    monthlyRate
                );

        }


        /*
        --------------------------------------------------
        Estimated Returns
        --------------------------------------------------
        */

        const estimatedReturns =
            futureValue -
            totalInvested;


        /*
        --------------------------------------------------
        Format Results
        --------------------------------------------------
        */

        const formattedInvested =
            formatCurrency(
                totalInvested,
                currencyCode
            );

        const formattedReturns =
            formatCurrency(
                estimatedReturns,
                currencyCode
            );

        const formattedFutureValue =
            formatCurrency(
                futureValue,
                currencyCode
            );


        /*
        --------------------------------------------------
        Update Summary Section
        --------------------------------------------------
        */

        investedAmountElement.textContent =
            formattedInvested;

        estimatedReturnElement.textContent =
            formattedReturns;

        futureValueElement.textContent =
            formattedFutureValue;


        /*
        --------------------------------------------------
        Show Detailed Results
        --------------------------------------------------
        */

        resultCard.hidden = false;

        resultContent.innerHTML = `

            <div class="table-wrapper">

                <table>

                    <caption class="sr-only">
                        SIP investment calculation results
                    </caption>

                    <tbody>

                        <tr>

                            <th scope="row">
                                Currency
                            </th>

                            <td>
                                ${currencyCode}
                            </td>

                        </tr>


                        <tr>

                            <th scope="row">
                                Monthly Investment
                            </th>

                            <td>
                                ${formatCurrency(
                                    monthlyInvestment,
                                    currencyCode
                                )}
                            </td>

                        </tr>


                        <tr>

                            <th scope="row">
                                Expected Annual Return
                            </th>

                            <td>
                                ${annualReturn.toFixed(2)}%
                            </td>

                        </tr>


                        <tr>

                            <th scope="row">
                                Investment Period
                            </th>

                            <td>
                                ${investmentYears} years
                            </td>

                        </tr>


                        <tr>

                            <th scope="row">
                                Total Amount Invested
                            </th>

                            <td>
                                ${formattedInvested}
                            </td>

                        </tr>


                        <tr>

                            <th scope="row">
                                Estimated Returns
                            </th>

                            <td>
                                ${formattedReturns}
                            </td>

                        </tr>


                        <tr>

                            <th scope="row">
                                Estimated Future Value
                            </th>

                            <td>
                                ${formattedFutureValue}
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        `;


        /*
        --------------------------------------------------
        Scroll to Results
        --------------------------------------------------
        */

        resultCard.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    /*
    --------------------------------------------------
    Reset Calculator
    --------------------------------------------------
    */

    function resetCalculator() {

        monthlyInvestmentInput.value = "";

        annualReturnInput.value = "";

        investmentYearsInput.value = "";

        currencyInput.value = "USD";


        /*
        Clear Detailed Results
        */

        resultContent.innerHTML = "";

        resultCard.hidden = true;


        /*
        Reset Summary
        */

        investedAmountElement.textContent =
            formatCurrency(
                0,
                "USD"
            );

        estimatedReturnElement.textContent =
            formatCurrency(
                0,
                "USD"
            );

        futureValueElement.textContent =
            formatCurrency(
                0,
                "USD"
            );

    }


    /*
    --------------------------------------------------
    Calculate Button
    --------------------------------------------------
    */

    calculateButton.addEventListener(
        "click",
        calculateSIP
    );


    /*
    --------------------------------------------------
    Reset Button
    --------------------------------------------------
    */

    resetButton.addEventListener(
        "click",
        resetCalculator
    );


    /*
    --------------------------------------------------
    Enter Key Support
    --------------------------------------------------
    */

    [
        monthlyInvestmentInput,
        annualReturnInput,
        investmentYearsInput

    ].forEach(input => {

        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    calculateSIP();

                }

            }
        );

    });


    /*
    --------------------------------------------------
    Currency Change
    --------------------------------------------------
    */

    currencyInput.addEventListener(
        "change",
        () => {

            const currentCurrency =
                currencyInput.value;


            /*
            If a calculation has already
            been performed, recalculate
            using the new currency.
            */

            if (
                !resultCard.hidden &&
                monthlyInvestmentInput.value &&
                annualReturnInput.value &&
                investmentYearsInput.value
            ) {

                calculateSIP();

            } else {

                /*
                Update Summary Currency
                Without Calculating
                */

                investedAmountElement.textContent =
                    formatCurrency(
                        0,
                        currentCurrency
                    );

                estimatedReturnElement.textContent =
                    formatCurrency(
                        0,
                        currentCurrency
                    );

                futureValueElement.textContent =
                    formatCurrency(
                        0,
                        currentCurrency
                    );

            }

        }
    );


    /*
    --------------------------------------------------
    Initialize Calculator
    --------------------------------------------------
    */

    resetCalculator();

});