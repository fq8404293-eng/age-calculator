"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const firstValueInput = document.getElementById("ratio-a");
    const secondValueInput = document.getElementById("ratio-b");

    const calculateButton = document.getElementById("calculate-ratio");
    const resetButton = document.getElementById("reset-ratio");

    const errorMessage = document.getElementById("ratio-error");
    const resultBox = document.getElementById("ratio-result");
    const resultContent = document.getElementById("ratio-result-content");


    /* ==========================================================
       HELPERS
    ========================================================== */

    function showError(message) {

        errorMessage.textContent = message;
        errorMessage.hidden = false;

        resultBox.hidden = true;

    }


    function clearError() {

        errorMessage.textContent = "";
        errorMessage.hidden = true;

    }


    function formatNumber(value, decimals = 2) {

        return Number(value).toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });

    }


    /*
       Greatest Common Divisor
       Used to simplify whole-number ratios.
    */

    function gcd(a, b) {

        a = Math.abs(a);
        b = Math.abs(b);

        while (b !== 0) {

            const remainder = a % b;

            a = b;
            b = remainder;

        }

        return a;

    }


    /*
       Convert a decimal ratio into a simplified
       whole-number ratio when practical.
    */

    function getSimplifiedRatio(a, b) {

        const precision = 1000000;

        const scaledA = Math.round(a * precision);
        const scaledB = Math.round(b * precision);

        const divisor = gcd(scaledA, scaledB);

        if (divisor === 0) {

            return {
                first: a,
                second: b
            };

        }

        return {
            first: scaledA / divisor,
            second: scaledB / divisor
        };

    }


    /* ==========================================================
       CALCULATE RATIO
    ========================================================== */

    function calculateRatio() {

        clearError();

        const firstValue = parseFloat(firstValueInput.value);
        const secondValue = parseFloat(secondValueInput.value);


        if (firstValueInput.value.trim() === "") {

            showError("Please enter the first value.");

            firstValueInput.focus();

            return;

        }


        if (secondValueInput.value.trim() === "") {

            showError("Please enter the second value.");

            secondValueInput.focus();

            return;

        }


        if (
            !Number.isFinite(firstValue) ||
            !Number.isFinite(secondValue)
        ) {

            showError("Please enter valid numbers.");

            return;

        }


        if (firstValue <= 0) {

            showError("The first value must be greater than 0.");

            firstValueInput.focus();

            return;

        }


        if (secondValue <= 0) {

            showError("The second value must be greater than 0.");

            secondValueInput.focus();

            return;

        }


        const simplified = getSimplifiedRatio(
            firstValue,
            secondValue
        );


        const decimalRatio =
            firstValue / secondValue;


        const reverseRatio =
            secondValue / firstValue;


        const ratioDifference =
            firstValue - secondValue;


        const simplifiedFirst =
            simplified.first;


        const simplifiedSecond =
            simplified.second;


        const multiplier =
            firstValue / simplifiedFirst;


        resultContent.innerHTML = `

            <div class="calculator-results-grid">

                <div class="result-card">
                    <h3>Original Ratio</h3>
                    <p>
                        ${formatNumber(firstValue)} :
                        ${formatNumber(secondValue)}
                    </p>
                </div>


                <div class="result-card">
                    <h3>Simplified Ratio</h3>
                    <p>
                        ${formatNumber(simplifiedFirst)} :
                        ${formatNumber(simplifiedSecond)}
                    </p>
                </div>


                <div class="result-card">
                    <h3>Ratio as a Decimal</h3>
                    <p>
                        ${formatNumber(decimalRatio, 4)}
                    </p>
                </div>


                <div class="result-card">
                    <h3>Reverse Ratio</h3>
                    <p>
                        ${formatNumber(simplifiedSecond)} :
                        ${formatNumber(simplifiedFirst)}
                    </p>
                </div>

            </div>


            <div class="info-box">

                <p>
                    <strong>
                        ${formatNumber(firstValue)} :
                        ${formatNumber(secondValue)}
                        = 
                        ${formatNumber(simplifiedFirst)} :
                        ${formatNumber(simplifiedSecond)}
                    </strong>
                </p>

                <p>
                    The first value is
                    <strong>${formatNumber(decimalRatio, 4)}</strong>
                    times the second value.
                </p>

                <p>
                    The values can be multiplied by the same factor
                    to create equivalent ratios.
                </p>

            </div>


            <div class="table-wrapper">

                <table class="amortization-table">

                    <thead>

                        <tr>
                            <th>Calculation</th>
                            <th>Result</th>
                        </tr>

                    </thead>

                    <tbody>

                        <tr>
                            <td>First Value</td>
                            <td>${formatNumber(firstValue)}</td>
                        </tr>

                        <tr>
                            <td>Second Value</td>
                            <td>${formatNumber(secondValue)}</td>
                        </tr>

                        <tr>
                            <td>Simplified First Part</td>
                            <td>${formatNumber(simplifiedFirst)}</td>
                        </tr>

                        <tr>
                            <td>Simplified Second Part</td>
                            <td>${formatNumber(simplifiedSecond)}</td>
                        </tr>

                        <tr>
                            <td>Decimal Ratio</td>
                            <td>${formatNumber(decimalRatio, 4)}</td>
                        </tr>

                    </tbody>

                </table>

            </div>

        `;


        resultBox.hidden = false;


        setTimeout(() => {

            resultBox.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 50);

    }


    /* ==========================================================
       RESET
    ========================================================== */

    function resetCalculator() {

        firstValueInput.value = "";
        secondValueInput.value = "";

        clearError();

        resultContent.innerHTML = "";
        resultBox.hidden = true;

        firstValueInput.focus();

    }


    /* ==========================================================
       EVENTS
    ========================================================== */

    calculateButton.addEventListener(
        "click",
        calculateRatio
    );


    resetButton.addEventListener(
        "click",
        resetCalculator
    );


    [firstValueInput, secondValueInput].forEach(input => {

        input.addEventListener("keydown", event => {

            if (event.key === "Enter") {

                event.preventDefault();

                calculateRatio();

            }

        });

    });

});