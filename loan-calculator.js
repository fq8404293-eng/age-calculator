"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const amountInput = document.getElementById("loan-amount");
    const rateInput = document.getElementById("interest-rate");
    const yearsInput = document.getElementById("loan-years");
    const currencyInput = document.getElementById("loan-currency");

    const calculateButton = document.getElementById("calculate-loan");
    const resetButton = document.getElementById("reset-loan");

    const resultCard = document.getElementById("loan-result");
    const resultContent = document.getElementById("loan-result-content");

    const monthlyPaymentElement =
        document.getElementById("monthly-payment");

    const totalInterestElement =
        document.getElementById("total-interest");

    const totalPaymentElement =
        document.getElementById("total-payment");


    if (
        !amountInput ||
        !rateInput ||
        !yearsInput ||
        !currencyInput ||
        !calculateButton ||
        !resetButton ||
        !resultCard ||
        !resultContent ||
        !monthlyPaymentElement ||
        !totalInterestElement ||
        !totalPaymentElement
    ) {
        return;
    }


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


    function showWarning(message) {

        resultCard.hidden = false;

        resultContent.innerHTML = `
            <div class="warning-box" role="alert">

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


    function calculateLoan() {

        const principal =
            parseFloat(amountInput.value);

        const annualRate =
            parseFloat(rateInput.value);

        const years =
            parseFloat(yearsInput.value);

        const currencyCode =
            currencyInput.value;


        if (
            !Number.isFinite(principal) ||
            !Number.isFinite(annualRate) ||
            !Number.isFinite(years)
        ) {

            showWarning(
                "Please enter a loan amount, interest rate, and loan term before calculating."
            );

            return;

        }


        if (principal <= 0) {

            showWarning(
                "Please enter a loan amount greater than zero."
            );

            amountInput.focus();

            return;

        }


        if (annualRate < 0 || annualRate > 100) {

            showWarning(
                "Please enter an annual interest rate between 0% and 100%."
            );

            rateInput.focus();

            return;

        }


        if (years < 0.25 || years > 100) {

            showWarning(
                "Please enter a loan term between 0.25 and 100 years."
            );

            yearsInput.focus();

            return;

        }


        const monthlyRate =
            annualRate / 100 / 12;

        const months =
            years * 12;


        let monthlyPayment;


        if (monthlyRate === 0) {

            monthlyPayment =
                principal / months;

        } else {

            const growthFactor =
                Math.pow(
                    1 + monthlyRate,
                    months
                );


            monthlyPayment =
                (
                    principal *
                    monthlyRate *
                    growthFactor
                ) /
                (
                    growthFactor - 1
                );

        }


        const totalPayment =
            monthlyPayment * months;


        const totalInterest =
            totalPayment - principal;


        const formattedMonthly =
            formatCurrency(
                monthlyPayment,
                currencyCode
            );


        const formattedInterest =
            formatCurrency(
                totalInterest,
                currencyCode
            );


        const formattedTotal =
            formatCurrency(
                totalPayment,
                currencyCode
            );


        monthlyPaymentElement.textContent =
            formattedMonthly;

        totalInterestElement.textContent =
            formattedInterest;

        totalPaymentElement.textContent =
            formattedTotal;


        resultCard.hidden = false;


        resultContent.innerHTML = `

            <div class="table-wrapper">

                <table>

                    <caption class="sr-only">
                        Loan calculation results
                    </caption>

                    <tbody>

                        <tr>

                            <th scope="row">
                                Loan Amount
                            </th>

                            <td>
                                ${formatCurrency(
                                    principal,
                                    currencyCode
                                )}
                            </td>

                        </tr>


                        <tr>

                            <th scope="row">
                                Monthly Payment
                            </th>

                            <td>
                                ${formattedMonthly}
                            </td>

                        </tr>


                        <tr>

                            <th scope="row">
                                Total Interest
                            </th>

                            <td>
                                ${formattedInterest}
                            </td>

                        </tr>


                        <tr>

                            <th scope="row">
                                Total Repayment
                            </th>

                            <td>
                                ${formattedTotal}
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        `;


        resultCard.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    function resetCalculator() {

        amountInput.value = "";

        rateInput.value = "";

        yearsInput.value = "";

        currencyInput.value = "USD";


        resultContent.innerHTML = "";

        resultCard.hidden = true;


        monthlyPaymentElement.textContent =
            formatCurrency(
                0,
                "USD"
            );


        totalInterestElement.textContent =
            formatCurrency(
                0,
                "USD"
            );


        totalPaymentElement.textContent =
            formatCurrency(
                0,
                "USD"
            );


        amountInput.focus();

    }


    calculateButton.addEventListener(
        "click",
        calculateLoan
    );


    resetButton.addEventListener(
        "click",
        resetCalculator
    );


    [
        amountInput,
        rateInput,
        yearsInput
    ].forEach(input => {

        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    calculateLoan();

                }

            }
        );

    });


    currencyInput.addEventListener(
        "change",
        () => {

            const currentCurrency =
                currencyInput.value;

            if (
                !resultCard.hidden &&
                amountInput.value
            ) {

                calculateLoan();

            } else {

                monthlyPaymentElement.textContent =
                    formatCurrency(
                        0,
                        currentCurrency
                    );


                totalInterestElement.textContent =
                    formatCurrency(
                        0,
                        currentCurrency
                    );


                totalPaymentElement.textContent =
                    formatCurrency(
                        0,
                        currentCurrency
                    );

            }

        }
    );


    resetCalculator();

});