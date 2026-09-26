document.addEventListener("DOMContentLoaded", () => {

    const dateInput = document.getElementById("timezone-date");

    const hourInput = document.getElementById("timezone-hour");
    const minuteInput = document.getElementById("timezone-minute");
    const periodInput = document.getElementById("timezone-period");

    const fromTimezone = document.getElementById("from-timezone");
    const toTimezone = document.getElementById("to-timezone");

    const calculateButton = document.getElementById(
        "calculate-timezone"
    );

    const resetButton = document.getElementById(
        "reset-timezone"
    );

    const errorMessage = document.getElementById(
        "timezone-error"
    );

    const resultSection = document.getElementById(
        "timezone-result"
    );

    const resultContent = document.getElementById(
        "timezone-result-content"
    );


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
       GET TIME ZONE OFFSET
    ========================================================== */

    function getTimeZoneOffset(timeZone, date) {

        const parts = new Intl.DateTimeFormat("en-US", {
            timeZone,
            timeZoneName: "longOffset"
        }).formatToParts(date);

        const offsetPart = parts.find(
            part => part.type === "timeZoneName"
        );

        if (!offsetPart) {
            return "UTC";
        }

        return offsetPart.value;
    }


    /* ==========================================================
       FORMAT DATE AND TIME
    ========================================================== */

    function formatDateTime(date, timeZone) {

        return new Intl.DateTimeFormat("en-US", {
            timeZone,
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZoneName: "short"
        }).format(date);
    }


    /* ==========================================================
       GET TIME ZONE NAME
    ========================================================== */

    function getTimeZoneName(timeZone) {

        const names = {

            "America/New_York":
                "Eastern Time",

            "America/Chicago":
                "Central Time",

            "America/Denver":
                "Mountain Time",

            "America/Los_Angeles":
                "Pacific Time",

            "America/Anchorage":
                "Alaska Time",

            "Pacific/Honolulu":
                "Hawaii Time",

            "America/Toronto":
                "Toronto",

            "America/Vancouver":
                "Vancouver",

            "America/Mexico_City":
                "Mexico City",

            "America/Sao_Paulo":
                "São Paulo",

            "America/Argentina/Buenos_Aires":
                "Buenos Aires",

            "Europe/London":
                "London",

            "Europe/Paris":
                "Paris",

            "Europe/Berlin":
                "Berlin",

            "Europe/Madrid":
                "Madrid",

            "Europe/Rome":
                "Rome",

            "Europe/Amsterdam":
                "Amsterdam",

            "Europe/Moscow":
                "Moscow",

            "Africa/Cairo":
                "Cairo",

            "Africa/Johannesburg":
                "Johannesburg",

            "Asia/Dubai":
                "Dubai",

            "Asia/Kolkata":
                "India Standard Time",

            "Asia/Singapore":
                "Singapore",

            "Asia/Bangkok":
                "Bangkok",

            "Asia/Shanghai":
                "China Standard Time",

            "Asia/Hong_Kong":
                "Hong Kong",

            "Asia/Tokyo":
                "Tokyo",

            "Asia/Seoul":
                "Seoul",

            "Australia/Sydney":
                "Sydney",

            "Australia/Melbourne":
                "Melbourne",

            "Pacific/Auckland":
                "Auckland"
        };

        return names[timeZone] || timeZone;
    }


    /* ==========================================================
       CREATE SOURCE DATE
    ========================================================== */

    function createSourceDate() {

        const dateValue = dateInput.value;

        if (!dateValue) {
            return null;
        }

        if (
            !hourInput.value ||
            !periodInput.value
        ) {
            return null;
        }

        const [year, month, day] =
            dateValue.split("-").map(Number);

        const hour24 = convertTo24Hour(
            hourInput.value,
            periodInput.value
        );

        /*
         * Empty minute = 00.
         */

        const minute =
            minuteInput.value === ""
                ? 0
                : Number(minuteInput.value);


        /*
         * Create a temporary UTC date using the
         * selected local clock values.
         */

        return {
            year,
            month,
            day,
            hour: hour24,
            minute
        };
    }


    /* ==========================================================
       CONVERT SOURCE LOCAL TIME TO UTC
    ========================================================== */

    function localTimeToUTC(
        year,
        month,
        day,
        hour,
        minute,
        timeZone
    ) {

        /*
         * Start with an approximate UTC timestamp.
         */

        let utcDate = new Date(
            Date.UTC(
                year,
                month - 1,
                day,
                hour,
                minute,
                0,
                0
            )
        );


        /*
         * Determine the actual time-zone offset.
         */

        const formatter = new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone,
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hourCycle: "h23"
            }
        );


        /*
         * Extract the local time represented by the
         * approximate UTC timestamp.
         */

        const parts = formatter.formatToParts(utcDate);

        const values = {};

        parts.forEach(part => {

            if (part.type !== "literal") {
                values[part.type] = Number(part.value);
            }

        });


        /*
         * Calculate difference between desired local
         * time and the formatted time.
         */

        const desiredUTC = Date.UTC(
            year,
            month - 1,
            day,
            hour,
            minute,
            0,
            0
        );

        const actualUTC = Date.UTC(
            values.year,
            values.month - 1,
            values.day,
            values.hour,
            values.minute,
            values.second
        );


        const difference =
            desiredUTC - actualUTC;


        return new Date(
            utcDate.getTime() + difference
        );
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
       CALCULATE TIME ZONE CONVERSION
    ========================================================== */

    function calculateTimeZone() {

        clearError();


        /*
         * Validate date.
         */

        if (!dateInput.value) {

            showError(
                "Please select a date."
            );

            return;
        }


        /*
         * Validate hour and AM/PM.
         * Minute is optional and defaults to 00.
         */

        if (
            !hourInput.value ||
            !periodInput.value
        ) {

            showError(
                "Please select the hour and AM/PM period."
            );

            return;
        }


        /*
         * Validate source time zone.
         */

        if (!fromTimezone.value) {

            showError(
                "Please select the source time zone."
            );

            return;
        }


        /*
         * Validate destination time zone.
         */

        if (!toTimezone.value) {

            showError(
                "Please select the destination time zone."
            );

            return;
        }


        /*
         * Source and destination can be the same.
         * This is valid and will simply return the
         * same local time.
         */

        const source = createSourceDate();


        if (!source) {

            showError(
                "Please enter a valid date and time."
            );

            return;
        }


        /*
         * Convert the selected source local time
         * into an actual UTC timestamp.
         */

        const utcDate = localTimeToUTC(
            source.year,
            source.month,
            source.day,
            source.hour,
            source.minute,
            fromTimezone.value
        );


        /*
         * Format source and destination results.
         */

        const sourceFormatted =
            formatDateTime(
                utcDate,
                fromTimezone.value
            );

        const destinationFormatted =
            formatDateTime(
                utcDate,
                toTimezone.value
            );


        const sourceZoneName =
            getTimeZoneName(
                fromTimezone.value
            );

        const destinationZoneName =
            getTimeZoneName(
                toTimezone.value
            );


        const sourceOffset =
            getTimeZoneOffset(
                fromTimezone.value,
                utcDate
            );

        const destinationOffset =
            getTimeZoneOffset(
                toTimezone.value,
                utcDate
            );


        /*
         * Display result.
         */

        resultContent.innerHTML = `

            <div class="calculator-results-grid">

                <div class="result-card">

                    <h3>Original Time</h3>

                    <p>
                        ${sourceFormatted}
                    </p>

                </div>

                <div class="result-card">

                    <h3>Converted Time</h3>

                    <p>
                        ${destinationFormatted}
                    </p>

                </div>

                <div class="result-card">

                    <h3>From</h3>

                    <p>
                        ${sourceZoneName}
                        <br>
                        ${sourceOffset}
                    </p>

                </div>

                <div class="result-card">

                    <h3>To</h3>

                    <p>
                        ${destinationZoneName}
                        <br>
                        ${destinationOffset}
                    </p>

                </div>

            </div>

            <div class="info-box">

                <strong>Time Zone Conversion</strong>

                <br><br>

                <strong>Original:</strong>
                ${sourceFormatted}

                <br><br>

                <strong>Converted:</strong>
                ${destinationFormatted}

                <br><br>

                The conversion uses the selected time zones'
                current daylight saving rules where applicable.

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

        dateInput.value = "";

        hourInput.value = "";

        minuteInput.value = "";

        periodInput.value = "";

        fromTimezone.value = "";

        toTimezone.value = "";

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
        calculateTimeZone
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
        periodInput,
        fromTimezone,
        toTimezone
    ].forEach(input => {

        input.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    calculateTimeZone();

                }

            }
        );

    });

});