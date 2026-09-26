"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const minimumInput = document.getElementById("minimum-value");
    const maximumInput = document.getElementById("maximum-value");
    const countInput = document.getElementById("number-count");
    const duplicatesInput = document.getElementById("allow-duplicates");

    const generateButton =
        document.getElementById("generate-random-numbers");

    const resetButton =
        document.getElementById("reset-random-number");

    const errorMessage =
        document.getElementById("random-number-error");

    const resultBox =
        document.getElementById("random-number-result");

    const resultContent =
        document.getElementById("random-number-result-content");


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


    function formatNumber(value) {

        return Number(value).toLocaleString("en-US");

    }


    /*
       Secure random integer when crypto.getRandomValues()
       is available, with Math.random() as a fallback.
    */

    function randomInteger(min, max) {

        const range = max - min + 1;

        if (
            window.crypto &&
            typeof window.crypto.getRandomValues === "function"
        ) {

            const maxUint32 = 4294967296;
            const limit =
                maxUint32 - (maxUint32 % range);

            const randomArray = new Uint32Array(1);

            let randomValue;

            do {

                window.crypto.getRandomValues(randomArray);
                randomValue = randomArray[0];

            } while (randomValue >= limit);

            return min + (randomValue % range);

        }

        return Math.floor(Math.random() * range) + min;

    }


    /* ==========================================================
       GENERATE RANDOM NUMBERS
    ========================================================== */

    function generateRandomNumbers() {

        clearError();

        const minimum = Number(minimumInput.value);
        const maximum = Number(maximumInput.value);
        const count = Number(countInput.value);

        const allowDuplicates =
            duplicatesInput.value === "yes";


        /* ------------------------------------------------------
           Validation
        ------------------------------------------------------ */

        if (minimumInput.value.trim() === "") {

            showError("Please enter a minimum value.");

            minimumInput.focus();

            return;

        }


        if (maximumInput.value.trim() === "") {

            showError("Please enter a maximum value.");

            maximumInput.focus();

            return;

        }


        if (!Number.isFinite(minimum)) {

            showError("Please enter a valid minimum value.");

            minimumInput.focus();

            return;

        }


        if (!Number.isFinite(maximum)) {

            showError("Please enter a valid maximum value.");

            maximumInput.focus();

            return;

        }


        if (!Number.isInteger(minimum)) {

            showError("The minimum value must be a whole number.");

            minimumInput.focus();

            return;

        }


        if (!Number.isInteger(maximum)) {

            showError("The maximum value must be a whole number.");

            maximumInput.focus();

            return;

        }


        if (minimum > maximum) {

            showError(
                "The minimum value cannot be greater than the maximum value."
            );

            minimumInput.focus();

            return;

        }


        if (countInput.value.trim() === "") {

            showError("Please enter how many numbers you want to generate.");

            countInput.focus();

            return;

        }


        if (!Number.isFinite(count)) {

            showError("Please enter a valid number count.");

            countInput.focus();

            return;

        }


        if (!Number.isInteger(count)) {

            showError("The number count must be a whole number.");

            countInput.focus();

            return;

        }


        if (count < 1) {

            showError("The number count must be at least 1.");

            countInput.focus();

            return;

        }


        if (count > 1000) {

            showError("You can generate a maximum of 1,000 numbers at once.");

            countInput.focus();

            return;

        }


        /*
           Number of available integers in the range.
        */

        const availableNumbers =
            maximum - minimum + 1;


        if (
            !Number.isSafeInteger(availableNumbers) ||
            availableNumbers <= 0
        ) {

            showError(
                "The selected range is too large to generate safely."
            );

            return;

        }


        if (
            !allowDuplicates &&
            count > availableNumbers
        ) {

            showError(
                `You cannot generate ${formatNumber(count)} unique numbers from a range containing only ${formatNumber(availableNumbers)} numbers. Increase the range or allow duplicates.`
            );

            countInput.focus();

            return;

        }


        /* ------------------------------------------------------
           Generate Results
        ------------------------------------------------------ */

        const numbers = [];


        if (allowDuplicates) {

            for (let i = 0; i < count; i++) {

                numbers.push(
                    randomInteger(minimum, maximum)
                );

            }

        } else {

            const usedNumbers = new Set();

            while (usedNumbers.size < count) {

                usedNumbers.add(
                    randomInteger(minimum, maximum)
                );

            }

            numbers.push(...usedNumbers);

        }


        /* ------------------------------------------------------
           Display Results
        ------------------------------------------------------ */

        const numberList = numbers
            .map(
                (number, index) => `
                    <div class="result-card">
                        <h3>Number ${index + 1}</h3>
                        <p>${formatNumber(number)}</p>
                    </div>
                `
            )
            .join("");


        const resultsText =
            numbers.map(formatNumber).join(", ");


        resultContent.innerHTML = `

            <div class="calculator-results-grid">

                ${numberList}

            </div>


            <div class="info-box">

                <p>
                    <strong>Generated Numbers</strong>
                </p>

                <p>
                    ${resultsText}
                </p>

                <p>
                    Range:
                    <strong>
                        ${formatNumber(minimum)}
                        to
                        ${formatNumber(maximum)}
                    </strong>
                </p>

                <p>
                    Numbers generated:
                    <strong>${formatNumber(count)}</strong>
                </p>

                <p>
                    Duplicates:
                    <strong>
                        ${allowDuplicates ? "Allowed" : "Not Allowed"}
                    </strong>
                </p>

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

        minimumInput.value = "";
        maximumInput.value = "";

        countInput.value = "1";

        duplicatesInput.value = "yes";

        clearError();

        resultContent.innerHTML = "";
        resultBox.hidden = true;

        minimumInput.focus();

    }


    /* ==========================================================
       EVENTS
    ========================================================== */

    generateButton.addEventListener(
        "click",
        generateRandomNumbers
    );


    resetButton.addEventListener(
        "click",
        resetCalculator
    );


    [
        minimumInput,
        maximumInput,
        countInput
    ].forEach(input => {

        input.addEventListener("keydown", event => {

            if (event.key === "Enter") {

                event.preventDefault();

                generateRandomNumbers();

            }

        });

    });

});