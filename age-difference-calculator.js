document.addEventListener("DOMContentLoaded", () => {

    const firstDateInput = document.getElementById("first-date");
    const secondDateInput = document.getElementById("second-date");

    const calculateButton = document.getElementById(
        "calculate-age-difference"
    );

    const resetButton = document.getElementById(
        "reset-age-difference"
    );

    const errorMessage = document.getElementById(
        "age-difference-error"
    );

    const resultSection = document.getElementById(
        "age-difference-result"
    );

    const resultContent = document.getElementById(
        "age-difference-result-content"
    );


    /* ==========================================================
       DATE HELPERS
    ========================================================== */

    function createLocalDate(dateString) {

        const parts = dateString.split("-");

        return new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );
    }


    function formatDate(date) {

        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }


    function daysInMonth(year, month) {

        return new Date(
            year,
            month + 1,
            0
        ).getDate();
    }


    function addYearsSafe(date, years) {

        const originalMonth = date.getMonth();
        const originalDay = date.getDate();

        const result = new Date(
            date.getFullYear() + years,
            originalMonth,
            originalDay
        );

        /*
         * Handle February 29 when the target year
         * is not a leap year.
         */
        if (
            result.getMonth() !== originalMonth ||
            result.getDate() !== originalDay
        ) {

            return new Date(
                date.getFullYear() + years,
                originalMonth,
                daysInMonth(
                    date.getFullYear() + years,
                    originalMonth
                )
            );
        }

        return result;
    }


    /* ==========================================================
       EXACT DATE DIFFERENCE
    ========================================================== */

    function calculateDateDifference(startDate, endDate) {

        let years = endDate.getFullYear() - startDate.getFullYear();

        let anniversary = addYearsSafe(
            startDate,
            years
        );

        /*
         * If the anniversary is after the end date,
         * one full year has not yet been completed.
         */
        if (anniversary > endDate) {

            years--;

            anniversary = addYearsSafe(
                startDate,
                years
            );
        }

        let months = 0;
        let monthDate = new Date(anniversary);

        while (true) {

            const nextMonth = new Date(
                monthDate.getFullYear(),
                monthDate.getMonth() + 1,
                monthDate.getDate()
            );

            /*
             * Handle dates such as January 31 → February.
             */
            if (
                nextMonth.getDate() !== monthDate.getDate()
            ) {

                nextMonth.setDate(
                    daysInMonth(
                        nextMonth.getFullYear(),
                        nextMonth.getMonth()
                    )
                );
            }

            if (nextMonth > endDate) {
                break;
            }

            monthDate = nextMonth;
            months++;
        }

        const millisecondsPerDay =
            24 * 60 * 60 * 1000;

        const days = Math.round(
            (endDate - monthDate) /
            millisecondsPerDay
        );

        return {
            years,
            months,
            days
        };
    }


    /* ==========================================================
       TOTAL DAYS
    ========================================================== */

    function calculateTotalDays(startDate, endDate) {

        const millisecondsPerDay =
            24 * 60 * 60 * 1000;

        return Math.round(
            (endDate - startDate) /
            millisecondsPerDay
        );
    }


    /* ==========================================================
       ERROR HANDLING
    ========================================================== */

    function showError(message) {

        errorMessage.textContent = message;
        errorMessage.hidden = false;

        resultSection.hidden = true;
    }


    function clearError() {

        errorMessage.textContent = "";
        errorMessage.hidden = true;
    }


    /* ==========================================================
       CALCULATE
    ========================================================== */

    function calculateAgeDifference() {

        clearError();

        const firstValue = firstDateInput.value;
        const secondValue = secondDateInput.value;


        if (!firstValue || !secondValue) {

            showError(
                "Please select both dates."
            );

            return;
        }


        const firstDate = createLocalDate(firstValue);
        const secondDate = createLocalDate(secondValue);


        if (
            Number.isNaN(firstDate.getTime()) ||
            Number.isNaN(secondDate.getTime())
        ) {

            showError(
                "Please enter valid dates."
            );

            return;
        }


        /*
         * Put the earlier date first so that the
         * calculator always returns a positive difference.
         */
        let startDate = firstDate;
        let endDate = secondDate;

        if (startDate > endDate) {

            startDate = secondDate;
            endDate = firstDate;
        }


        /*
         * Same date
         */
        if (
            startDate.getTime() ===
            endDate.getTime()
        ) {

            resultContent.innerHTML = `
                <div class="calculator-results-grid">

                    <div class="result-card">
                        <h3>Age Difference</h3>
                        <p>0 days</p>
                    </div>

                    <div class="result-card">
                        <h3>Years</h3>
                        <p>0 years</p>
                    </div>

                    <div class="result-card">
                        <h3>Months</h3>
                        <p>0 months</p>
                    </div>

                    <div class="result-card">
                        <h3>Days</h3>
                        <p>0 days</p>
                    </div>

                </div>

                <div class="info-box">
                    <strong>Calculation:</strong><br>
                    ${formatDate(startDate)}
                    → ${formatDate(endDate)}

                    <br><br>

                    The two dates are the same.
                </div>
            `;

            resultSection.hidden = false;

            resultSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            return;
        }


        const difference = calculateDateDifference(
            startDate,
            endDate
        );

        const totalDays = calculateTotalDays(
            startDate,
            endDate
        );


        const yearText =
            difference.years === 1
                ? "year"
                : "years";

        const monthText =
            difference.months === 1
                ? "month"
                : "months";

        const dayText =
            difference.days === 1
                ? "day"
                : "days";


        resultContent.innerHTML = `
            <div class="calculator-results-grid">

                <div class="result-card">
                    <h3>Age Difference</h3>
                    <p>
                        ${difference.years} ${yearText},
                        ${difference.months} ${monthText},
                        ${difference.days} ${dayText}
                    </p>
                </div>

                <div class="result-card">
                    <h3>Total Days</h3>
                    <p>
                        ${totalDays.toLocaleString("en-US")} days
                    </p>
                </div>

                <div class="result-card">
                    <h3>Total Months</h3>
                    <p>
                        Approximately
                        ${(totalDays / 30.4375).toFixed(2)} months
                    </p>
                </div>

                <div class="result-card">
                    <h3>Total Years</h3>
                    <p>
                        Approximately
                        ${(totalDays / 365.2425).toFixed(2)} years
                    </p>
                </div>

            </div>

            <div class="info-box">

                <strong>Calculation:</strong><br>

                ${formatDate(startDate)}
                → ${formatDate(endDate)}

                <br><br>

                Total difference:
                <strong>
                    ${difference.years} ${yearText},
                    ${difference.months} ${monthText},
                    ${difference.days} ${dayText}
                </strong>

            </div>
        `;


        resultSection.hidden = false;


        /*
         * Smoothly move the user to the result.
         */
        resultSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    /* ==========================================================
       RESET
    ========================================================== */

    function resetCalculator() {

        firstDateInput.value = "";
        secondDateInput.value = "";

        clearError();

        resultContent.innerHTML = "";

        resultSection.hidden = true;

        firstDateInput.focus();
    }


    /* ==========================================================
       BUTTON EVENTS
    ========================================================== */

    calculateButton.addEventListener(
        "click",
        calculateAgeDifference
    );


    resetButton.addEventListener(
        "click",
        resetCalculator
    );


    /* ==========================================================
       ENTER KEY
    ========================================================== */

    [firstDateInput, secondDateInput].forEach(input => {

        input.addEventListener("keydown", event => {

            if (event.key === "Enter") {

                event.preventDefault();

                calculateAgeDifference();
            }

        });

    });

});