document.addEventListener("DOMContentLoaded", () => {
  const wordCountInput = document.getElementById("word-count");
  const readingSpeedInput = document.getElementById("reading-speed");

  const calculateButton = document.getElementById("calculate-reading-time");
  const clearButton = document.getElementById("clear-reading-time");

  const errorBox = document.getElementById("reading-time-error");
  const resultBox = document.getElementById("reading-time-result");
  const resultContent = document.getElementById("reading-time-result-content");

  const summaryWordCount = document.getElementById("summary-word-count");
  const summaryReadingSpeed = document.getElementById(
    "summary-reading-speed"
  );
  const summaryReadingTime = document.getElementById(
    "summary-reading-time"
  );
  const summaryReadingMinutes = document.getElementById(
    "summary-reading-minutes"
  );


  /* ---------------------------------------
     Error handling
  --------------------------------------- */

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;

    resultBox.hidden = true;

    window.setTimeout(() => {
      errorBox.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 50);
  }


  function clearError() {
    errorBox.textContent = "";
    errorBox.hidden = true;
  }


  /* ---------------------------------------
     Number formatting
  --------------------------------------- */

  function formatNumber(value, decimals = 0) {
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }


  /* ---------------------------------------
     Calculate reading time
  --------------------------------------- */

  function calculateReadingTime() {

    clearError();

    const wordCount =
      Number(wordCountInput.value);

    const readingSpeed =
      Number(readingSpeedInput.value);


    /*
     * Validate word count
     */
    if (
      !Number.isFinite(wordCount) ||
      wordCount <= 0 ||
      !Number.isInteger(wordCount)
    ) {
      showError(
        "Please enter a valid whole-number word count greater than 0."
      );

      return;
    }


    /*
     * Validate reading speed
     */
    if (
      !Number.isFinite(readingSpeed) ||
      readingSpeed <= 0 ||
      !Number.isInteger(readingSpeed)
    ) {
      showError(
        "Please enter a valid whole-number reading speed greater than 0."
      );

      return;
    }


    /*
     * Calculate total minutes
     */
    const totalMinutes =
      wordCount / readingSpeed;


    /*
     * Convert to seconds
     */
    const totalSeconds =
      Math.round(totalMinutes * 60);


    /*
     * Calculate hours, minutes, and seconds
     */
    const hours =
      Math.floor(totalSeconds / 3600);

    const remainingSeconds =
      totalSeconds % 3600;

    const minutes =
      Math.floor(remainingSeconds / 60);

    const seconds =
      remainingSeconds % 60;


    /*
     * Create readable time
     */
    const timeParts = [];

    if (hours > 0) {
      timeParts.push(
        `${formatNumber(hours)} hour${hours === 1 ? "" : "s"}`
      );
    }

    if (minutes > 0) {
      timeParts.push(
        `${formatNumber(minutes)} minute${minutes === 1 ? "" : "s"}`
      );
    }

    if (seconds > 0 || timeParts.length === 0) {
      timeParts.push(
        `${formatNumber(seconds)} second${seconds === 1 ? "" : "s"}`
      );
    }

    const readableTime =
      timeParts.join(", ");


    /* ---------------------------------------
       Main result
    --------------------------------------- */

    resultContent.innerHTML = `

      <div class="calculator-results-grid">

        <div class="result-card">

          <h3>Word Count</h3>

          <p>
            ${formatNumber(wordCount)}
          </p>

        </div>


        <div class="result-card">

          <h3>Reading Speed</h3>

          <p>
            ${formatNumber(readingSpeed)} WPM
          </p>

        </div>


        <div class="result-card">

          <h3>Estimated Reading Time</h3>

          <p>
            ${readableTime}
          </p>

        </div>

      </div>


      <p>
        At a reading speed of
        <strong>${formatNumber(readingSpeed)} words per minute</strong>,
        approximately
        <strong>${formatNumber(wordCount)} words</strong>
        will take about
        <strong>${readableTime}</strong>
        to read.
      </p>


      <p class="small-text">
        This is an estimate. Actual reading time may vary depending on
        reading speed, text complexity, familiarity with the subject,
        pauses, and comprehension.
      </p>

    `;


    /*
     * Show result
     */
    resultBox.hidden = false;


    /* ---------------------------------------
       Summary
    --------------------------------------- */

    summaryWordCount.textContent =
      formatNumber(wordCount);

    summaryReadingSpeed.textContent =
      `${formatNumber(readingSpeed)} WPM`;

    summaryReadingTime.textContent =
      readableTime;

    summaryReadingMinutes.textContent =
      formatNumber(totalMinutes, 2);


    /*
     * Scroll down to result automatically
     */
    window.setTimeout(() => {

      resultBox.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }, 100);

  }


  /* ---------------------------------------
     Clear calculator
  --------------------------------------- */

  function clearCalculator() {

    clearError();

    wordCountInput.value = "1000";

    readingSpeedInput.value = "200";

    resultContent.innerHTML = "";

    resultBox.hidden = true;


    summaryWordCount.textContent =
      "—";

    summaryReadingSpeed.textContent =
      "—";

    summaryReadingTime.textContent =
      "—";

    summaryReadingMinutes.textContent =
      "—";

  }


  /* ---------------------------------------
     Button events
  --------------------------------------- */

  calculateButton.addEventListener(
    "click",
    calculateReadingTime
  );


  clearButton.addEventListener(
    "click",
    clearCalculator
  );


  /* ---------------------------------------
     Enter key
  --------------------------------------- */

  [
    wordCountInput,
    readingSpeedInput
  ].forEach((input) => {

    input.addEventListener(
      "keydown",
      (event) => {

        if (event.key === "Enter") {

          event.preventDefault();

          calculateReadingTime();

        }

      }
    );

  });


  /* ---------------------------------------
     Clear errors when inputs change
  --------------------------------------- */

  [
    wordCountInput,
    readingSpeedInput
  ].forEach((input) => {

    input.addEventListener(
      "input",
      clearError
    );

  });

});