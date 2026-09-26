document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // =========================================================
    // DOM ELEMENTS
    // =========================================================

    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");

    const calculateDifferenceButton = document.getElementById("calculate-difference");
    const resetDifferenceButton = document.getElementById("reset-difference");

    const differenceError = document.getElementById("date-difference-error");
    const differenceResult = document.getElementById("date-difference-result");
    const differenceResultContent = document.getElementById("date-difference-result-content");

    const calculationDateInput = document.getElementById("calculation-date");
    const calculationOperationInput = document.getElementById("calculation-operation");
    const calculationValueInput = document.getElementById("calculation-value");
    const calculationUnitInput = document.getElementById("calculation-unit");

    const calculateDateButton = document.getElementById("calculate-date");
    const resetDateButton = document.getElementById("reset-date");

    const calculationError = document.getElementById("date-calculation-error");
    const calculationResult = document.getElementById("date-calculation-result");
    const calculationResultContent = document.getElementById("date-calculation-result-content");


    // =========================================================
    // DATE HELPERS
    // =========================================================

    /**
     * Convert a YYYY-MM-DD input value into a local Date object.
     * Using the local constructor avoids the UTC date-shift problem
     * that can occur with new Date("YYYY-MM-DD").
     */
    function parseDateInput(value) {
        if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            return null;
        }

        const parts = value.split("-").map(Number);

        const year = parts[0];
        const month = parts[1];
        const day = parts[2];

        const date = new Date(year, month - 1, day);

        // Validate that the browser did not normalize an invalid date.
        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {
            return null;
        }

        return date;
    }


    /**
     * Format a Date object for display.
     */
    function formatDate(date) {
        return new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }).format(date);
    }


    /**
     * Format a Date object as YYYY-MM-DD.
     */
    function formatDateInputValue(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }


    /**
     * Get the number of days in a particular month.
     */
    function daysInMonth(year, monthIndex) {
        return new Date(year, monthIndex + 1, 0).getDate();
    }


    /**
     * Clone a Date object.
     */
    function cloneDate(date) {
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );
    }


    /**
     * Calculate the number of calendar days between two dates.
     */
    function differenceInDays(startDate, endDate) {
        const start = Date.UTC(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()
        );

        const end = Date.UTC(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate()
        );

        return Math.round((end - start) / 86400000);
    }


    /**
     * Add calendar months while handling dates such as January 31
     * correctly when the destination month has fewer days.
     */
    function addMonths(date, months) {
        const result = cloneDate(date);

        const originalDay = result.getDate();

        const targetMonthIndex =
            result.getMonth() + months;

        result.setDate(1);
        result.setMonth(targetMonthIndex);

        const maximumDay = daysInMonth(
            result.getFullYear(),
            result.getMonth()
        );

        result.setDate(
            Math.min(originalDay, maximumDay)
        );

        return result;
    }


    /**
     * Add calendar years while handling February 29.
     */
    function addYears(date, years) {
        const result = cloneDate(date);

        const originalMonth = result.getMonth();
        const originalDay = result.getDate();

        result.setDate(1);
        result.setFullYear(
            result.getFullYear() + years
        );

        const maximumDay = daysInMonth(
            result.getFullYear(),
            originalMonth
        );

        result.setMonth(originalMonth);
        result.setDate(
            Math.min(originalDay, maximumDay)
        );

        return result;
    }


    /**
     * Add or subtract a selected amount of time.
     */
    function calculateNewDate(date, amount, unit, operation) {
        const signedAmount =
            operation === "subtract"
                ? -amount
                : amount;

        const result = cloneDate(date);

        switch (unit) {
            case "days":
                result.setDate(
                    result.getDate() + signedAmount
                );
                break;

            case "weeks":
                result.setDate(
                    result.getDate() + (signedAmount * 7)
                );
                break;

            case "months":
                return addMonths(
                    result,
                    signedAmount
                );

            case "years":
                return addYears(
                    result,
                    signedAmount
                );

            default:
                return null;
        }

        return result;
    }


    // =========================================================
    // DIFFERENCE BREAKDOWN
    // =========================================================

    /**
     * Calculate a calendar-based years/months/days breakdown.
     *
     * The function assumes startDate <= endDate.
     */
    function getCalendarDifference(startDate, endDate) {
        let cursor = cloneDate(startDate);

        let years = 0;
        let months = 0;

        while (true) {
            const next = addYears(cursor, 1);

            if (next <= endDate) {
                cursor = next;
                years++;
            } else {
                break;
            }
        }

        while (true) {
            const next = addMonths(cursor, 1);

            if (next <= endDate) {
                cursor = next;
                months++;
            } else {
                break;
            }
        }

        const days = differenceInDays(
            cursor,
            endDate
        );

        return {
            years,
            months,
            days
        };
    }


    // =========================================================
    // TEXT HELPERS
    // =========================================================

    function pluralize(value, singular, plural = `${singular}s`) {
        return value === 1
            ? singular
            : plural;
    }


    function formatYearsMonthsDays(years, months, days) {
        const parts = [];

        if (years > 0) {
            parts.push(
                `${years} ${pluralize(years, "year")}`
            );
        }

        if (months > 0) {
            parts.push(
                `${months} ${pluralize(months, "month")}`
            );
        }

        if (days > 0 || parts.length === 0) {
            parts.push(
                `${days} ${pluralize(days, "day")}`
            );
        }

        return parts.join(", ");
    }


    function clearDifferenceError() {
        if (!differenceError) {
            return;
        }

        differenceError.textContent = "";
        differenceError.hidden = true;
    }


    function showDifferenceError(message) {
        if (!differenceError) {
            return;
        }

        differenceError.textContent = message;
        differenceError.hidden = false;

        if (differenceResult) {
            differenceResult.hidden = true;
        }
    }


    function clearCalculationError() {
        if (!calculationError) {
            return;
        }

        calculationError.textContent = "";
        calculationError.hidden = true;
    }


    function showCalculationError(message) {
        if (!calculationError) {
            return;
        }

        calculationError.textContent = message;
        calculationError.hidden = false;

        if (calculationResult) {
            calculationResult.hidden = true;
        }
    }


    // =========================================================
    // DATE DIFFERENCE CALCULATOR
    // =========================================================

    function calculateDateDifference() {
        clearDifferenceError();

        const startDate = parseDateInput(
            startDateInput.value
        );

        const endDate = parseDateInput(
            endDateInput.value
        );

        if (!startDate || !endDate) {
            showDifferenceError(
                "Please enter both a valid start date and end date."
            );
            return;
        }

        if (endDate < startDate) {
            showDifferenceError(
                "The end date must be the same as or later than the start date."
            );
            return;
        }

        const totalDays = differenceInDays(
            startDate,
            endDate
        );

        const totalWeeks = Math.floor(
            totalDays / 7
        );

        const remainingDays = totalDays % 7;

        const calendarDifference =
            getCalendarDifference(
                startDate,
                endDate
            );

        const calendarDescription =
            formatYearsMonthsDays(
                calendarDifference.years,
                calendarDifference.months,
                calendarDifference.days
            );

        differenceResultContent.innerHTML = `
            <div class="calculator-results-grid">

                <div class="result-card">
                    <h3>Total Days</h3>
                    <p class="result-value">
                        ${totalDays.toLocaleString("en-US")}
                    </p>
                    <p>calendar days</p>
                </div>

                <div class="result-card">
                    <h3>Weeks & Days</h3>
                    <p class="result-value">
                        ${totalWeeks.toLocaleString("en-US")}
                    </p>
                    <p>
                        ${pluralize(totalWeeks, "week")}
                        ${remainingDays > 0
                            ? `and ${remainingDays} ${pluralize(remainingDays, "day")}`
                            : ""}
                    </p>
                </div>

                <div class="result-card">
                    <h3>Calendar Difference</h3>
                    <p class="result-value">
                        ${calendarDescription}
                    </p>
                    <p>years, months, and days</p>
                </div>

            </div>

            <div class="info-box">
                <p>
                    <strong>Start date:</strong>
                    ${formatDate(startDate)}
                </p>

                <p>
                    <strong>End date:</strong>
                    ${formatDate(endDate)}
                </p>

                <p>
                    The calculation shows elapsed calendar time between
                    the two selected dates. It does not count the starting
                    date as an additional elapsed day.
                </p>
            </div>
        `;

        differenceResult.hidden = false;

differenceResult.scrollIntoView({
    behavior: "smooth",
    block: "start"
});
    }


    // =========================================================
    // RESET DATE DIFFERENCE
    // =========================================================

    function resetDateDifference() {
        startDateInput.value = "";
        endDateInput.value = "";

        clearDifferenceError();

        if (differenceResultContent) {
            differenceResultContent.innerHTML = "";
        }

        if (differenceResult) {
            differenceResult.hidden = true;
        }
    }


    // =========================================================
    // ADD / SUBTRACT DATE CALCULATOR
    // =========================================================

    function calculateDateOperation() {
        clearCalculationError();

        const startingDate = parseDateInput(
            calculationDateInput.value
        );

        const operation =
            calculationOperationInput.value;

        const unit =
            calculationUnitInput.value;

        const rawValue =
            calculationValueInput.value.trim();

        if (!startingDate) {
            showCalculationError(
                "Please enter a valid starting date."
            );
            return;
        }

        if (rawValue === "") {
            showCalculationError(
                "Please enter an amount."
            );
            return;
        }

        const amount = Number(rawValue);

        if (!Number.isFinite(amount)) {
            showCalculationError(
                "Please enter a valid number."
            );
            return;
        }

        if (amount < 0) {
            showCalculationError(
                "Please enter a value of zero or greater."
            );
            return;
        }

        if (!Number.isInteger(amount)) {
            showCalculationError(
                "Please enter a whole number for the amount."
            );
            return;
        }

        const resultDate = calculateNewDate(
            startingDate,
            amount,
            unit,
            operation
        );

        if (!resultDate || Number.isNaN(resultDate.getTime())) {
            showCalculationError(
                "Unable to calculate the requested date. Please check your inputs."
            );
            return;
        }

        const operationText =
            operation === "subtract"
                ? "subtracted from"
                : "added to";

        const unitText =
            pluralize(
                amount,
                unit.replace(/s$/, "")
            );

        const formattedAmount =
            amount.toLocaleString("en-US");

        const resultDateInputValue =
            formatDateInputValue(resultDate);

        calculationResultContent.innerHTML = `
            <div class="calculator-results-grid">

                <div class="result-card">

                    <h3>Calculated Date</h3>

                    <p class="result-value">
                        ${formatDate(resultDate)}
                    </p>

                    <p>
                        ${resultDateInputValue}
                    </p>

                </div>

                <div class="result-card">

                    <h3>Calculation</h3>

                    <p class="result-value">
                        ${formattedAmount}
                    </p>

                    <p>
                        ${unitText} ${operationText}
                        ${formatDate(startingDate)}
                    </p>

                </div>

            </div>

            <div class="info-box">

                <p>
                    <strong>Starting date:</strong>
                    ${formatDate(startingDate)}
                </p>

                <p>
                    <strong>Operation:</strong>
                    ${operation === "subtract"
                        ? "Subtract"
                        : "Add"}
                </p>

                <p>
                    <strong>Amount:</strong>
                    ${formattedAmount}
                    ${unitText}
                </p>

                <p>
                    <strong>Result:</strong>
                    ${formatDate(resultDate)}
                </p>

            </div>
        `;

        calculationResult.hidden = false;

calculationResult.scrollIntoView({
    behavior: "smooth",
    block: "start"
});
    }


    // =========================================================
    // RESET ADD / SUBTRACT CALCULATOR
    // =========================================================

    function resetDateCalculation() {
        calculationDateInput.value = "";
        calculationOperationInput.value = "add";
        calculationValueInput.value = "1";
        calculationUnitInput.value = "days";

        clearCalculationError();

        if (calculationResultContent) {
            calculationResultContent.innerHTML = "";
        }

        if (calculationResult) {
            calculationResult.hidden = true;
        }
    }


    // =========================================================
    // EVENT LISTENERS
    // =========================================================

    if (calculateDifferenceButton) {
        calculateDifferenceButton.addEventListener(
            "click",
            calculateDateDifference
        );
    }

    if (resetDifferenceButton) {
        resetDifferenceButton.addEventListener(
            "click",
            resetDateDifference
        );
    }

    if (calculateDateButton) {
        calculateDateButton.addEventListener(
            "click",
            calculateDateOperation
        );
    }

    if (resetDateButton) {
        resetDateButton.addEventListener(
            "click",
            resetDateCalculation
        );
    }


    // =========================================================
    // CLEAR ERRORS WHILE CORRECTING INPUTS
    // =========================================================

    if (startDateInput) {
        startDateInput.addEventListener(
            "input",
            clearDifferenceError
        );
    }

    if (endDateInput) {
        endDateInput.addEventListener(
            "input",
            clearDifferenceError
        );
    }

    if (calculationDateInput) {
        calculationDateInput.addEventListener(
            "input",
            clearCalculationError
        );
    }

    if (calculationValueInput) {
        calculationValueInput.addEventListener(
            "input",
            clearCalculationError
        );
    }

    if (calculationOperationInput) {
        calculationOperationInput.addEventListener(
            "change",
            clearCalculationError
        );
    }

    if (calculationUnitInput) {
        calculationUnitInput.addEventListener(
            "change",
            clearCalculationError
        );
    }


    // =========================================================
    // ENTER KEY SUPPORT
    // =========================================================

    if (startDateInput) {
        startDateInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                calculateDateDifference();
            }
        });
    }

    if (endDateInput) {
        endDateInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                calculateDateDifference();
            }
        });
    }

    if (calculationValueInput) {
        calculationValueInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                calculateDateOperation();
            }
        });
    }


    // =========================================================
    // INITIAL STATE
    // =========================================================

    clearDifferenceError();
    clearCalculationError();

    if (differenceResult) {
        differenceResult.hidden = true;
    }

    if (calculationResult) {
        calculationResult.hidden = true;
    }

});