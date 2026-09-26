document.addEventListener("DOMContentLoaded", () => {

    const startHour = document.getElementById("start-hour");
    const startMinute = document.getElementById("start-minute");
    const startPeriod = document.getElementById("start-period");

    const endHour = document.getElementById("end-hour");
    const endMinute = document.getElementById("end-minute");
    const endPeriod = document.getElementById("end-period");

    const breakInput = document.getElementById("break-minutes");

    const calculateButton = document.getElementById(
        "calculate-work-hours"
    );

    const resetButton = document.getElementById(
        "reset-work-hours"
    );

    const errorMessage = document.getElementById(
        "work-hours-error"
    );

    const resultSection = document.getElementById(
        "work-hours-result"
    );

    const resultContent = document.getElementById(
        "work-hours-result-content"
    );


    /* ==========================================================
       CONVERT 12-HOUR TIME TO MINUTES
    ========================================================== */

    function convertToMinutes(hour, minute, period) {

        hour = Number(hour);

        // Empty minute is automatically treated as 00
        minute = minute === "" ? 0 : Number(minute);

        if (period === "AM") {

            if (hour === 12) {
                hour = 0;
            }

        } else if (period === "PM") {

            if (hour !== 12) {
                hour += 12;
            }

        }

        return (hour * 60) + minute;
    }


    /* ==========================================================
       FORMAT DURATION
    ========================================================== */

    function formatDuration(totalMinutes) {

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        const hourText = hours === 1 ? "hour" : "hours";
        const minuteText = minutes === 1 ? "minute" : "minutes";

        if (hours === 0) {
            return `${minutes} ${minuteText}`;
        }

        if (minutes === 0) {
            return `${hours} ${hourText}`;
        }

        return `${hours} ${hourText}, ${minutes} ${minuteText}`;
    }


    /* ==========================================================
       SHOW ERROR
    ========================================================== */

    function showError(message) {

        errorMessage.textContent = message;
        errorMessage.hidden = false;

        resultSection.hidden = true;
    }


    /* ==========================================================
       CLEAR ERROR
    ========================================================== */

    function clearError() {

        errorMessage.textContent = "";
        errorMessage.hidden = true;
    }


    /* ==========================================================
       CALCULATE WORK HOURS
    ========================================================== */

    function calculateWorkHours() {

        clearError();


        /*
         * Start hour and AM/PM are required.
         * Start minute can be empty and becomes 00.
         */

        if (
            !startHour.value ||
            !startPeriod.value
        ) {

            showError(
                "Please select the start hour and AM/PM."
            );

            return;
        }


        /*
         * End hour and AM/PM are required.
         * End minute can be empty and becomes 00.
         */

        if (
            !endHour.value ||
            !endPeriod.value
        ) {

            showError(
                "Please select the end hour and AM/PM."
            );

            return;
        }


        /*
         * Break time.
         */

        let breakMinutes = 0;

        if (breakInput.value !== "") {

            breakMinutes = Number(
                breakInput.value
            );

            if (
                !Number.isFinite(breakMinutes) ||
                breakMinutes < 0 ||
                !Number.isInteger(breakMinutes)
            ) {

                showError(
                    "Please enter a valid break time in whole minutes."
                );

                return;
            }
        }


        /*
         * Convert times to minutes.
         * Empty minutes automatically become 00.
         */

        const startTotal = convertToMinutes(
            startHour.value,
            startMinute.value,
            startPeriod.value
        );

        const endTotal = convertToMinutes(
            endHour.value,
            endMinute.value,
            endPeriod.value
        );


        /*
         * Calculate shift duration.
         */

        let totalShiftMinutes =
            endTotal - startTotal;


        /*
         * Overnight shift.
         */

        if (totalShiftMinutes < 0) {

            totalShiftMinutes += 24 * 60;

        }


        /*
         * Same start and end time = 24-hour shift.
         */

        if (totalShiftMinutes === 0) {

            totalShiftMinutes = 24 * 60;

        }


        /*
         * Break cannot be equal to or greater
         * than the complete shift.
         */

        if (breakMinutes >= totalShiftMinutes) {

            showError(
                "Break time must be less than the total shift time."
            );

            return;
        }


        /*
         * Net working time.
         */

        const netWorkMinutes =
            totalShiftMinutes - breakMinutes;


        const totalHoursDecimal =
            totalShiftMinutes / 60;

        const netHoursDecimal =
            netWorkMinutes / 60;


        /*
         * Display result.
         */

        resultContent.innerHTML = `

            <div class="calculator-results-grid">

                <div class="result-card">

                    <h3>Total Shift Time</h3>

                    <p>
                        ${formatDuration(totalShiftMinutes)}
                    </p>

                </div>

                <div class="result-card">

                    <h3>Break Time</h3>

                    <p>
                        ${formatDuration(breakMinutes)}
                    </p>

                </div>

                <div class="result-card">

                    <h3>Net Work Time</h3>

                    <p>
                        ${formatDuration(netWorkMinutes)}
                    </p>

                </div>

                <div class="result-card">

                    <h3>Total Minutes</h3>

                    <p>
                        ${netWorkMinutes.toLocaleString("en-US")}
                        minutes
                    </p>

                </div>

            </div>

            <div class="info-box">

                <strong>Work Hours Summary</strong>

                <br><br>

                Total shift time:
                ${formatDuration(totalShiftMinutes)}
                (${totalHoursDecimal.toFixed(2)} hours)

                <br><br>

                Unpaid break:
                ${formatDuration(breakMinutes)}

                <br><br>

                Net work time:
                ${formatDuration(netWorkMinutes)}
                (${netHoursDecimal.toFixed(2)} hours)

            </div>
        `;


        resultSection.hidden = false;


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

        startHour.value = "";
        startMinute.value = "";
        startPeriod.value = "";

        endHour.value = "";
        endMinute.value = "";
        endPeriod.value = "";

        breakInput.value = "";

        clearError();

        resultContent.innerHTML = "";

        resultSection.hidden = true;

        startHour.focus();
    }


    /* ==========================================================
       BUTTON EVENTS
    ========================================================== */

    calculateButton.addEventListener(
        "click",
        calculateWorkHours
    );

    resetButton.addEventListener(
        "click",
        resetCalculator
    );


    /* ==========================================================
       ENTER KEY
    ========================================================== */

    [
        startHour,
        startMinute,
        startPeriod,
        endHour,
        endMinute,
        endPeriod,
        breakInput
    ].forEach(input => {

        input.addEventListener("keydown", event => {

            if (event.key === "Enter") {

                event.preventDefault();

                calculateWorkHours();

            }

        });

    });

});