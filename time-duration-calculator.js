document.addEventListener("DOMContentLoaded", function () {

  /* ==========================================================
     ELEMENTS
  ========================================================== */

  const startHour = document.getElementById("start-hour");
  const startMinute = document.getElementById("start-minute");
  const startPeriod = document.getElementById("start-period");

  const endHour = document.getElementById("end-hour");
  const endMinute = document.getElementById("end-minute");
  const endPeriod = document.getElementById("end-period");

  const calculateButton = document.getElementById(
    "calculate-time-duration"
  );

  const resetButton = document.getElementById(
    "reset-time-duration"
  );

  const errorMessage = document.getElementById(
    "time-duration-error"
  );

  const resultBox = document.getElementById(
    "time-duration-result"
  );

  const resultContent = document.getElementById(
    "time-duration-result-content"
  );


  /* ==========================================================
     SAFETY CHECK
  ========================================================== */

  if (
    !startHour ||
    !startMinute ||
    !startPeriod ||
    !endHour ||
    !endMinute ||
    !endPeriod ||
    !calculateButton ||
    !resetButton ||
    !errorMessage ||
    !resultBox ||
    !resultContent
  ) {
    return;
  }


  /* ==========================================================
     FORMAT NUMBER
  ========================================================== */

  function formatNumber(number) {
    return number.toLocaleString("en-US");
  }


  /* ==========================================================
     CONVERT 12-HOUR TIME TO MINUTES
  ========================================================== */

  function convertToMinutes(hour, minute, period) {

    let hours = Number(hour);
    const minutes = Number(minute);

    if (period === "AM") {

      if (hours === 12) {
        hours = 0;
      }

    } else if (period === "PM") {

      if (hours !== 12) {
        hours += 12;
      }

    }

    return (hours * 60) + minutes;
  }


  /* ==========================================================
     DISPLAY TIME
  ========================================================== */

  function formatTime(hour, minute, period) {

    return `${hour}:${minute} ${period}`;
  }


  /* ==========================================================
     CALCULATE
  ========================================================== */

  function calculateDuration() {

    errorMessage.hidden = true;
    errorMessage.textContent = "";

    resultBox.hidden = true;
    resultContent.innerHTML = "";


    /* ========================================================
       VALIDATION
    ======================================================== */

    if (
      !startHour.value ||
      !startMinute.value ||
      !startPeriod.value ||
      !endHour.value ||
      !endMinute.value ||
      !endPeriod.value
    ) {

      errorMessage.textContent =
        "Please select both a start time and an end time.";

      errorMessage.hidden = false;

      return;
    }


    /* ========================================================
       CONVERT TIMES
    ======================================================== */

    let startMinutes = convertToMinutes(
      startHour.value,
      startMinute.value,
      startPeriod.value
    );

    let endMinutes = convertToMinutes(
      endHour.value,
      endMinute.value,
      endPeriod.value
    );


    /* ========================================================
       HANDLE MIDNIGHT
    ======================================================== */

    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }


    const totalMinutes = endMinutes - startMinutes;


    /* ========================================================
       SAME TIME
    ======================================================== */

    if (totalMinutes === 0) {

      errorMessage.textContent =
        "The start time and end time are the same. Please enter different times.";

      errorMessage.hidden = false;

      return;
    }


    /* ========================================================
       CALCULATE RESULTS
    ======================================================== */

    const hours = Math.floor(totalMinutes / 60);

    const minutes = totalMinutes % 60;

    const totalHours = totalMinutes / 60;

    const totalSeconds = totalMinutes * 60;


    /* ========================================================
       DURATION TEXT
    ======================================================== */

    let durationText = "";


    if (hours > 0) {

      durationText +=
        `${hours} hour${hours !== 1 ? "s" : ""}`;
    }


    if (minutes > 0) {

      if (durationText !== "") {
        durationText += " ";
      }

      durationText +=
        `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }


    /* ========================================================
       TIME DISPLAY
    ======================================================== */

    const startDisplay = formatTime(
      startHour.value,
      startMinute.value,
      startPeriod.value
    );

    const endDisplay = formatTime(
      endHour.value,
      endMinute.value,
      endPeriod.value
    );


    /* ========================================================
       RESULT
    ======================================================== */

    resultContent.innerHTML = `

      <div class="calculator-results-grid">

        <div class="result-card">

          <h3>
            Time Duration
          </h3>

          <p>
            ${durationText}
          </p>

        </div>


        <div class="result-card">

          <h3>
            Total Hours
          </h3>

          <p>
            ${totalHours.toFixed(2)} hours
          </p>

        </div>


        <div class="result-card">

          <h3>
            Total Minutes
          </h3>

          <p>
            ${formatNumber(totalMinutes)} minutes
          </p>

        </div>


        <div class="result-card">

          <h3>
            Total Seconds
          </h3>

          <p>
            ${formatNumber(totalSeconds)} seconds
          </p>

        </div>

      </div>


      <div class="info-box">

        <strong>
          Calculation:
        </strong>

        <p>
          ${startDisplay} → ${endDisplay}
        </p>

        <p>
          Total duration: ${durationText}
        </p>

      </div>

    `;


    resultBox.hidden = false;


    /* ========================================================
       SCROLL TO RESULT
    ======================================================== */

    resultBox.scrollIntoView({
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

    errorMessage.textContent = "";
    errorMessage.hidden = true;

    resultContent.innerHTML = "";
    resultBox.hidden = true;

    startHour.focus();
  }


  /* ==========================================================
     BUTTON EVENTS
  ========================================================== */

  calculateButton.addEventListener(
    "click",
    calculateDuration
  );

  resetButton.addEventListener(
    "click",
    resetCalculator
  );


  /* ==========================================================
     ENTER KEY SUPPORT
  ========================================================== */

  const allInputs = [
    startHour,
    startMinute,
    startPeriod,
    endHour,
    endMinute,
    endPeriod
  ];


  allInputs.forEach(function (input) {

    input.addEventListener(
      "keydown",
      function (event) {

        if (event.key === "Enter") {

          event.preventDefault();

          calculateDuration();
        }

      }
    );

  });

});