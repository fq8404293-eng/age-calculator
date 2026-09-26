document.addEventListener("DOMContentLoaded", () => {

    const dateInput = document.getElementById("countdown-date");
    const hourInput = document.getElementById("countdown-hour");
    const minuteInput = document.getElementById("countdown-minute");
    const periodInput = document.getElementById("countdown-period");

    const calculateButton = document.getElementById(
        "calculate-countdown"
    );

    const resetButton = document.getElementById(
        "reset-countdown"
    );

    const errorMessage = document.getElementById(
        "countdown-error"
    );

    const resultSection = document.getElementById(
        "countdown-result"
    );

    const resultContent = document.getElementById(
        "countdown-result-content"
    );

    let countdownInterval = null;


    /* ==========================================================
       CONVERT 12-HOUR TIME TO 24-HOUR TIME
    ========================================================== */

    function convertTo24Hour(hour, period) {

        hour = Number(hour);

        if (period === "AM") {

            if (hour === 12) {
                return 0;
            }

            return hour;
        }

        if (period === "PM") {

            if (hour === 12) {
                return 12;
            }

            return hour + 12;
        }

        return null;
    }


    /* ==========================================================
       CREATE TARGET DATE
    ========================================================== */

    function getTargetDate() {

        const dateValue = dateInput.value;
        const hourValue = hourInput.value;
        const minuteValue = minuteInput.value;
        const periodValue = periodInput.value;

        if (
            !dateValue ||
            !hourValue ||
            !minuteValue ||
            !periodValue
        ) {
            return null;
        }

        const [year, month, day] = dateValue
            .split("-")
            .map(Number);

        const hour24 = convertTo24Hour(
            hourValue,
            periodValue
        );

        const minute = Number(minuteValue);

        if (hour24 === null) {
            return null;
        }

        return new Date(
            year,
            month - 1,
            day,
            hour24,
            minute,
            0,
            0
        );
    }


    /* ==========================================================
       FORMAT DATE AND TIME
    ========================================================== */

    function formatDateTime(date) {

        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
        });
    }


    /* ==========================================================
       FORMAT NUMBERS
    ========================================================== */

    function formatNumber(number) {

        return String(number).padStart(2, "0");
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
       UPDATE COUNTDOWN
    ========================================================== */

    function updateCountdown(targetDate) {

        const now = new Date();

        const difference =
            targetDate.getTime() - now.getTime();


        /*
         * Countdown completed.
         */
        if (difference <= 0) {

            clearInterval(countdownInterval);

            countdownInterval = null;

            resultContent.innerHTML = `

                <div class="calculator-results-grid">

                    <div class="result-card">

                        <h3>Time Remaining</h3>

                        <p>
                            0 days, 00 hours,
                            00 minutes, 00 seconds
                        </p>

                    </div>

                    <div class="result-card">

                        <h3>Days</h3>

                        <p>0 days</p>

                    </div>

                    <div class="result-card">

                        <h3>Hours</h3>

                        <p>0 hours</p>

                    </div>

                    <div class="result-card">

                        <h3>Minutes</h3>

                        <p>0 minutes</p>

                    </div>

                </div>

                <div class="info-box">

                    <strong>Countdown complete.</strong>

                    <br><br>

                    The target date and time has been reached.

                </div>
            `;

            return;
        }


        const totalSeconds =
            Math.floor(difference / 1000);

        const days =
            Math.floor(totalSeconds / 86400);

        const hours =
            Math.floor(
                (totalSeconds % 86400) / 3600
            );

        const minutes =
            Math.floor(
                (totalSeconds % 3600) / 60
            );

        const seconds =
            totalSeconds % 60;


        const dayText =
            days === 1 ? "day" : "days";

        const hourText =
            hours === 1 ? "hour" : "hours";

        const minuteText =
            minutes === 1 ? "minute" : "minutes";

        const secondText =
            seconds === 1 ? "second" : "seconds";


        resultContent.innerHTML = `

            <div class="calculator-results-grid">

                <div class="result-card">

                    <h3>Time Remaining</h3>

                    <p>
                        ${days} ${dayText},
                        ${formatNumber(hours)} hours,
                        ${formatNumber(minutes)} minutes,
                        ${formatNumber(seconds)} seconds
                    </p>

                </div>

                <div class="result-card">

                    <h3>Days</h3>

                    <p>
                        ${days.toLocaleString("en-US")}
                        ${dayText}
                    </p>

                </div>

                <div class="result-card">

                    <h3>Hours</h3>

                    <p>
                        ${hours} ${hourText}
                    </p>

                </div>

                <div class="result-card">

                    <h3>Minutes</h3>

                    <p>
                        ${minutes} ${minuteText}
                    </p>

                </div>

            </div>

            <div class="info-box">

                <strong>Countdown to:</strong>

                <br>

                ${formatDateTime(targetDate)}

                <br><br>

                <strong>Remaining:</strong>

                ${days} ${dayText},
                ${hours} ${hourText},
                ${minutes} ${minuteText},
                ${seconds} ${secondText}

            </div>
        `;
    }


    /* ==========================================================
       START COUNTDOWN
    ========================================================== */

    function startCountdown() {

        clearError();

        const targetDate = getTargetDate();


        if (!dateInput.value) {

            showError(
                "Please select a target date."
            );

            return;
        }


        if (
            !hourInput.value ||
            !minuteInput.value ||
            !periodInput.value
        ) {

            showError(
                "Please select the target hour, minute, and AM/PM."
            );

            return;
        }


        if (
            !targetDate ||
            Number.isNaN(targetDate.getTime())
        ) {

            showError(
                "Please enter a valid date and time."
            );

            return;
        }


        const now = new Date();


        if (targetDate <= now) {

            showError(
                "Please select a future date and time."
            );

            return;
        }


        /*
         * Stop any previous countdown.
         */
        clearInterval(countdownInterval);


        /*
         * Show result immediately.
         */
        resultSection.hidden = false;

        updateCountdown(targetDate);


        /*
         * Update every second.
         */
        countdownInterval = setInterval(() => {

            updateCountdown(targetDate);

        }, 1000);


        /*
         * Scroll to result.
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

        clearInterval(countdownInterval);

        countdownInterval = null;

        dateInput.value = "";
        hourInput.value = "";
        minuteInput.value = "";
        periodInput.value = "";

        clearError();

        resultContent.innerHTML = "";

        resultSection.hidden = true;

        dateInput.focus();
    }


    /* ==========================================================
       BUTTON EVENTS
    ========================================================== */

    calculateButton.addEventListener(
        "click",
        startCountdown
    );


    resetButton.addEventListener(
        "click",
        resetCalculator
    );


    /* ==========================================================
       ENTER KEY
    ========================================================== */

    [
        dateInput,
        hourInput,
        minuteInput,
        periodInput
    ].forEach(input => {

        input.addEventListener("keydown", event => {

            if (event.key === "Enter") {

                event.preventDefault();

                startCountdown();
            }

        });

    });

});