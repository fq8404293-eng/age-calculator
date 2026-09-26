document.addEventListener("DOMContentLoaded", () => {
  const habitNameInput = document.getElementById("habit-name");
  const trackingDaysInput = document.getElementById("tracking-days");
  const goalFrequency = document.getElementById("goal-frequency");
  const completedDaysInput = document.getElementById("completed-days");
  const currentStreakInput = document.getElementById("current-streak");
  const longestStreakInput = document.getElementById("longest-streak");

  const calculateButton = document.getElementById("calculate-habit-tracker");
  const clearButton = document.getElementById("clear-habit-tracker");

  const errorBox = document.getElementById("habit-tracker-error");
  const resultBox = document.getElementById("habit-tracker-result");

  const resultHeading = document.getElementById("habit-result-heading");
  const progressMessage = document.getElementById("habit-progress-message");
  const progressDetails = document.getElementById("habit-progress-details");

  const summaryCompletionRate = document.getElementById(
    "summary-completion-rate"
  );
  const summaryPlannedDays = document.getElementById(
    "summary-planned-days"
  );
  const summaryCompletedDays = document.getElementById(
    "summary-completed-days"
  );
  const summaryMissedDays = document.getElementById(
    "summary-missed-days"
  );
  const summaryCurrentStreak = document.getElementById(
    "summary-current-streak"
  );
  const summaryLongestStreak = document.getElementById(
    "summary-longest-streak"
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
     Calculate planned days
  --------------------------------------- */

  function calculatePlannedDays(trackingDays, frequency) {
    if (frequency === "daily") {
      return trackingDays;
    }

    const daysPerWeek = Number(frequency);

    return Math.ceil(
      trackingDays * daysPerWeek / 7
    );
  }


  /* ---------------------------------------
     Calculate habit progress
  --------------------------------------- */

  function calculateHabitProgress() {

    clearError();

    const habitName =
      habitNameInput.value.trim();

    const trackingDays =
      Number(trackingDaysInput.value);

    const frequency =
      goalFrequency.value;

    const completedDays =
      Number(completedDaysInput.value);

    const currentStreak =
      Number(currentStreakInput.value);

    const longestStreak =
      Number(longestStreakInput.value);


    /*
     * Validate tracking period
     */
    if (
      !Number.isFinite(trackingDays) ||
      trackingDays < 1 ||
      !Number.isInteger(trackingDays)
    ) {
      showError(
        "Please enter a valid tracking period of at least 1 whole day."
      );

      return;
    }


    /*
     * Validate completed days
     */
    if (
      !Number.isFinite(completedDays) ||
      completedDays < 0 ||
      !Number.isInteger(completedDays)
    ) {
      showError(
        "Please enter a valid number of completed days."
      );

      return;
    }


    /*
     * Calculate planned days
     */
    const plannedDays =
      calculatePlannedDays(
        trackingDays,
        frequency
      );


    /*
     * Completed days cannot exceed planned days
     */
    if (completedDays > plannedDays) {
      showError(
        `Completed days cannot be greater than the ${plannedDays} planned days.`
      );

      return;
    }


    /*
     * Validate current streak
     */
    if (
      !Number.isFinite(currentStreak) ||
      currentStreak < 0 ||
      !Number.isInteger(currentStreak)
    ) {
      showError(
        "Please enter a valid current streak."
      );

      return;
    }


    /*
     * Current streak cannot exceed completed days
     */
    if (currentStreak > completedDays) {
      showError(
        "Current streak cannot be greater than completed days."
      );

      return;
    }


    /*
     * Validate longest streak
     */
    if (
      !Number.isFinite(longestStreak) ||
      longestStreak < 0 ||
      !Number.isInteger(longestStreak)
    ) {
      showError(
        "Please enter a valid longest streak."
      );

      return;
    }


    /*
     * Longest streak cannot be smaller
     * than current streak
     */
    if (longestStreak < currentStreak) {
      showError(
        "Longest streak cannot be smaller than the current streak."
      );

      return;
    }


    /*
     * A streak cannot exceed the tracking period
     */
    if (longestStreak > trackingDays) {
      showError(
        "Longest streak cannot be greater than the tracking period."
      );

      return;
    }


    /*
     * Calculate completion rate
     */
    const completionRate =
      plannedDays > 0
        ? (completedDays / plannedDays) * 100
        : 0;


    /*
     * Calculate missed days
     */
    const missedDays =
      Math.max(
        plannedDays - completedDays,
        0
      );


    const formattedCompletionRate =
      formatNumber(
        completionRate,
        1
      );


    /*
     * Habit display name
     */
    const displayHabitName =
      habitName || "Your habit";


    /* ---------------------------------------
       Main result
    --------------------------------------- */

    resultHeading.textContent =
      `${displayHabitName} Progress Result`;


    progressMessage.innerHTML = `

      <div class="calculator-results-grid">

        <div class="result-card">

          <h3>Completion Rate</h3>

          <p>
            ${formattedCompletionRate}%
          </p>

        </div>


        <div class="result-card">

          <h3>Planned Days</h3>

          <p>
            ${formatNumber(plannedDays)}
          </p>

        </div>


        <div class="result-card">

          <h3>Completed Days</h3>

          <p>
            ${formatNumber(completedDays)}
          </p>

        </div>


        <div class="result-card">

          <h3>Missed Days</h3>

          <p>
            ${formatNumber(missedDays)}
          </p>

        </div>


        <div class="result-card">

          <h3>Current Streak</h3>

          <p>
            ${formatNumber(currentStreak)} days
          </p>

        </div>


        <div class="result-card">

          <h3>Longest Streak</h3>

          <p>
            ${formatNumber(longestStreak)} days
          </p>

        </div>

      </div>

    `;


    /* ---------------------------------------
       Progress message
    --------------------------------------- */

    let message = "";

    if (completionRate === 100) {

      message =
        `<p><strong>${displayHabitName}</strong> was completed on all planned days during this tracking period.</p>`;

    } else if (completionRate >= 80) {

      message =
        `<p><strong>${displayHabitName}</strong> has a completion rate of <strong>${formattedCompletionRate}%</strong> across the planned days.</p>`;

    } else if (completionRate >= 50) {

      message =
        `<p><strong>${displayHabitName}</strong> was completed on <strong>${formattedCompletionRate}%</strong> of the planned days.</p>`;

    } else {

      message =
        `<p><strong>${displayHabitName}</strong> was completed on <strong>${formattedCompletionRate}%</strong> of the planned days.</p>`;

    }


    progressDetails.innerHTML = `

      ${message}

      <p>
        You completed
        <strong>${formatNumber(completedDays)}</strong>
        of
        <strong>${formatNumber(plannedDays)}</strong>
        planned days, leaving
        <strong>${formatNumber(missedDays)}</strong>
        missed planned days.
      </p>

      <p>
        Your current streak is
        <strong>${formatNumber(currentStreak)} days</strong>,
        while your longest recorded streak is
        <strong>${formatNumber(longestStreak)} days</strong>.
      </p>

    `;


    /*
     * Show result
     */
    resultBox.hidden = false;


    /* ---------------------------------------
       Summary
    --------------------------------------- */

    summaryCompletionRate.textContent =
      `${formattedCompletionRate}%`;

    summaryPlannedDays.textContent =
      formatNumber(plannedDays);

    summaryCompletedDays.textContent =
      formatNumber(completedDays);

    summaryMissedDays.textContent =
      formatNumber(missedDays);

    summaryCurrentStreak.textContent =
      `${formatNumber(currentStreak)} days`;

    summaryLongestStreak.textContent =
      `${formatNumber(longestStreak)} days`;


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

    habitNameInput.value = "";

    trackingDaysInput.value = "30";

    goalFrequency.value = "daily";

    completedDaysInput.value = "20";

    currentStreakInput.value = "5";

    longestStreakInput.value = "10";


    resultHeading.textContent =
      "Habit Progress Result";

    progressMessage.innerHTML = "";

    progressDetails.innerHTML = "";

    resultBox.hidden = true;


    summaryCompletionRate.textContent =
      "—";

    summaryPlannedDays.textContent =
      "—";

    summaryCompletedDays.textContent =
      "—";

    summaryMissedDays.textContent =
      "—";

    summaryCurrentStreak.textContent =
      "—";

    summaryLongestStreak.textContent =
      "—";

  }


  /* ---------------------------------------
     Button events
  --------------------------------------- */

  calculateButton.addEventListener(
    "click",
    calculateHabitProgress
  );


  clearButton.addEventListener(
    "click",
    clearCalculator
  );


  /* ---------------------------------------
     Enter key
  --------------------------------------- */

  [
    habitNameInput,
    trackingDaysInput,
    completedDaysInput,
    currentStreakInput,
    longestStreakInput
  ].forEach((input) => {

    input.addEventListener(
      "keydown",
      (event) => {

        if (event.key === "Enter") {

          event.preventDefault();

          calculateHabitProgress();

        }

      }
    );

  });


  /* ---------------------------------------
     Clear errors when inputs change
  --------------------------------------- */

  [
    trackingDaysInput,
    goalFrequency,
    completedDaysInput,
    currentStreakInput,
    longestStreakInput
  ].forEach((input) => {

    input.addEventListener(
      "input",
      clearError
    );

    input.addEventListener(
      "change",
      clearError
    );

  });

});