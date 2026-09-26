document.addEventListener("DOMContentLoaded", () => {
  const weightInput = document.getElementById("water-weight");
  const weightUnit = document.getElementById("water-weight-unit");
  const wakeTimeInput = document.getElementById("wake-time");
  const bedTimeInput = document.getElementById("bed-time");
  const intervalInput = document.getElementById("reminder-interval");
  const waterUnitInput = document.getElementById("water-unit");

  const calculateButton = document.getElementById(
    "calculate-water-reminder"
  );

  const clearButton = document.getElementById(
    "clear-water-reminder"
  );

  const errorBox = document.getElementById(
    "water-reminder-error"
  );

  const resultBox = document.getElementById(
    "water-reminder-result"
  );

  const resultContent = document.getElementById(
    "water-reminder-result-content"
  );

  const summaryWaterTarget = document.getElementById(
    "summary-water-target"
  );

  const summaryWakingHours = document.getElementById(
    "summary-waking-hours"
  );

  const summaryInterval = document.getElementById(
    "summary-interval"
  );

  const summaryReminders = document.getElementById(
    "summary-reminders"
  );

  const summaryPerReminder = document.getElementById(
    "summary-per-reminder"
  );


  /* ---------------------------------------
     Constants
  --------------------------------------- */

  /*
   * General planning estimate:
   * approximately 35 mL of water per kg
   * of body weight per day.
   *
   * This is a general calculator estimate,
   * not an individualized medical prescription.
   */

  const ML_PER_KG = 35;

  const ML_PER_OUNCE = 29.5735295625;

  const ML_PER_CUP = 236.5882365;


  /* ---------------------------------------
     Formatting helpers
  --------------------------------------- */

  function formatNumber(value, decimals = 0) {
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }


  function formatTime(timeString) {
    const [hours, minutes] = timeString
      .split(":")
      .map(Number);

    const date = new Date();

    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit"
    });
  }


  function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);

    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${remainingMinutes} min`;
    }

    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }

    return `${hours} hr ${remainingMinutes} min`;
  }


  function showError(message) {
    errorBox.textContent = message;

    errorBox.hidden = false;

    resultBox.hidden = true;

    setTimeout(() => {
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
     Convert weight to kilograms
  --------------------------------------- */

  function getWeightInKg(weight, unit) {

    if (unit === "kg") {
      return weight;
    }

    if (unit === "lb") {
      return weight * 0.45359237;
    }

    return weight;
  }


  /* ---------------------------------------
     Convert water amount to selected unit
  --------------------------------------- */

  function convertWaterAmount(ml, unit) {

    if (unit === "ml") {
      return {
        value: ml,
        unit: "mL"
      };
    }

    if (unit === "oz") {
      return {
        value: ml / ML_PER_OUNCE,
        unit: "fl oz"
      };
    }

    if (unit === "cups") {
      return {
        value: ml / ML_PER_CUP,
        unit: "cups"
      };
    }

    return {
      value: ml,
      unit: "mL"
    };
  }


  /* ---------------------------------------
     Get waking duration
  --------------------------------------- */

  function getWakingMinutes(wakeTime, bedTime) {

    const [wakeHours, wakeMinutes] = wakeTime
      .split(":")
      .map(Number);

    const [bedHours, bedMinutes] = bedTime
      .split(":")
      .map(Number);

    let wakeTotal =
      wakeHours * 60 + wakeMinutes;

    let bedTotal =
      bedHours * 60 + bedMinutes;


    /*
     * If bedtime is earlier than wake-up time,
     * assume bedtime is on the following day.
     */
    if (bedTotal <= wakeTotal) {
      bedTotal += 24 * 60;
    }


    return bedTotal - wakeTotal;
  }


  /* ---------------------------------------
     Build reminder schedule
  --------------------------------------- */

  function buildSchedule(
    wakeTime,
    bedTime,
    intervalMinutes,
    waterPerReminder,
    waterUnit
  ) {

    const wakingMinutes =
      getWakingMinutes(wakeTime, bedTime);


    /*
     * Number of intervals available during
     * waking hours.
     *
     * The first reminder starts at wake-up.
     */
    const reminderCount =
      Math.floor(wakingMinutes / intervalMinutes) + 1;


    const [wakeHours, wakeMinutes] =
      wakeTime.split(":").map(Number);


    const startMinutes =
      wakeHours * 60 + wakeMinutes;


    const schedule = [];


    for (
      let i = 0;
      i < reminderCount;
      i++
    ) {

      const totalMinutes =
        startMinutes + (i * intervalMinutes);


      const dayMinutes =
        totalMinutes % (24 * 60);


      const hours =
        Math.floor(dayMinutes / 60);


      const minutes =
        dayMinutes % 60;


      const timeString =
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;


      schedule.push({
        time: formatTime(timeString),
        amount: waterPerReminder,
        unit: waterUnit
      });
    }


    return schedule;
  }


  /* ---------------------------------------
     Create schedule
  --------------------------------------- */

  function calculateWaterReminder() {

    clearError();


    const weight =
      Number(weightInput.value);


    const wakeTime =
      wakeTimeInput.value;


    const bedTime =
      bedTimeInput.value;


    const intervalMinutes =
      Number(intervalInput.value);


    const selectedWeightUnit =
      weightUnit.value;


    const selectedWaterUnit =
      waterUnitInput.value;


    /* ---------------------------------------
       Validation
    --------------------------------------- */

    if (
      !Number.isFinite(weight) ||
      weight <= 0
    ) {

      showError(
        "Please enter a valid body weight greater than 0."
      );

      return;
    }


    if (!wakeTime || !bedTime) {

      showError(
        "Please enter both your wake-up time and bedtime."
      );

      return;
    }


    if (
      !Number.isFinite(intervalMinutes) ||
      intervalMinutes <= 0
    ) {

      showError(
        "Please select a valid reminder interval."
      );

      return;
    }


    /* ---------------------------------------
       Weight conversion
    --------------------------------------- */

    const weightKg =
      getWeightInKg(
        weight,
        selectedWeightUnit
      );


    /* ---------------------------------------
       Daily water target
    --------------------------------------- */

    const dailyWaterML =
      weightKg * ML_PER_KG;


    /* ---------------------------------------
       Waking hours
    --------------------------------------- */

    const wakingMinutes =
      getWakingMinutes(
        wakeTime,
        bedTime
      );


    const wakingHours =
      wakingMinutes / 60;


    if (wakingMinutes <= 0) {

      showError(
        "Please enter a valid waking period."
      );

      return;
    }


    /* ---------------------------------------
       Reminder count
    --------------------------------------- */

    const reminderCount =
      Math.floor(
        wakingMinutes / intervalMinutes
      ) + 1;


    /* ---------------------------------------
       Water per reminder
    --------------------------------------- */

    const waterPerReminderML =
      dailyWaterML / reminderCount;


    /* ---------------------------------------
       Convert display units
    --------------------------------------- */

    const dailyDisplay =
      convertWaterAmount(
        dailyWaterML,
        selectedWaterUnit
      );


    const perReminderDisplay =
      convertWaterAmount(
        waterPerReminderML,
        selectedWaterUnit
      );


    /* ---------------------------------------
       Build schedule
    --------------------------------------- */

    const schedule =
      buildSchedule(
        wakeTime,
        bedTime,
        intervalMinutes,
        perReminderDisplay.value,
        perReminderDisplay.unit
      );


    /* ---------------------------------------
       Interval text
    --------------------------------------- */

    let intervalText;

    if (intervalMinutes === 60) {
      intervalText = "Every 1 hour";
    } else if (intervalMinutes === 90) {
      intervalText = "Every 1.5 hours";
    } else if (intervalMinutes === 120) {
      intervalText = "Every 2 hours";
    } else {
      intervalText =
        `Every ${formatDuration(intervalMinutes)}`;
    }


    /* ---------------------------------------
       Build result HTML
    --------------------------------------- */

    let scheduleHTML = "";


    schedule.forEach((item, index) => {

      scheduleHTML += `
        <tr>

          <td>
            ${index + 1}
          </td>

          <td>
            ${item.time}
          </td>

          <td>
            ${formatNumber(item.amount, 1)}
            ${item.unit}
          </td>

        </tr>
      `;

    });


    resultContent.innerHTML = `

      <p>
        Based on a body weight of
        <strong>
          ${formatNumber(weight, 1)}
          ${selectedWeightUnit}
        </strong>,
        the estimated daily water target is
        <strong>
          ${formatNumber(dailyDisplay.value, 1)}
          ${dailyDisplay.unit}
        </strong>.
      </p>


      <div class="calculator-results-grid">

        <div class="result-card">

          <h3>
            Daily Water Target
          </h3>

          <p>
            ${formatNumber(dailyDisplay.value, 1)}
            ${dailyDisplay.unit}
          </p>

        </div>


        <div class="result-card">

          <h3>
            Waking Hours
          </h3>

          <p>
            ${formatNumber(wakingHours, 1)}
            hr
          </p>

        </div>


        <div class="result-card">

          <h3>
            Reminder Interval
          </h3>

          <p>
            ${intervalText}
          </p>

        </div>


        <div class="result-card">

          <h3>
            Water Per Reminder
          </h3>

          <p>
            ${formatNumber(perReminderDisplay.value, 1)}
            ${perReminderDisplay.unit}
          </p>

        </div>

      </div>


      <h3>
        Suggested Water Schedule
      </h3>


      <div class="table-wrapper">

        <table class="amortization-table">

          <thead>

            <tr>

              <th scope="col">
                Reminder
              </th>

              <th scope="col">
                Time
              </th>

              <th scope="col">
                Suggested Amount
              </th>

            </tr>

          </thead>


          <tbody>

            ${scheduleHTML}

          </tbody>

        </table>

      </div>


      <p class="small-text">

        This is a general hydration planning estimate.
        Individual fluid needs can vary based on activity,
        climate, diet, health conditions, medications,
        and other factors.

      </p>

    `;


    /* ---------------------------------------
       Summary
    --------------------------------------- */

    summaryWaterTarget.textContent =
      `${formatNumber(dailyDisplay.value, 1)} ${dailyDisplay.unit}`;


    summaryWakingHours.textContent =
      `${formatNumber(wakingHours, 1)} hr`;


    summaryInterval.textContent =
      intervalText;


    summaryReminders.textContent =
      formatNumber(reminderCount);


    summaryPerReminder.textContent =
      `${formatNumber(perReminderDisplay.value, 1)} ${perReminderDisplay.unit}`;


    /* ---------------------------------------
       Show result
    --------------------------------------- */

    resultBox.hidden = false;


    /* ---------------------------------------
       Scroll to result
    --------------------------------------- */

    setTimeout(() => {

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

    weightInput.value = "70";

    weightUnit.value = "kg";

    wakeTimeInput.value = "07:00";

    bedTimeInput.value = "23:00";

    intervalInput.value = "90";

    waterUnitInput.value = "ml";


    clearError();


    resultBox.hidden = true;

    resultContent.innerHTML = "";


    summaryWaterTarget.textContent = "—";

    summaryWakingHours.textContent = "—";

    summaryInterval.textContent = "—";

    summaryReminders.textContent = "—";

    summaryPerReminder.textContent = "—";

  }


  /* ---------------------------------------
     Events
  --------------------------------------- */

  calculateButton.addEventListener(
    "click",
    calculateWaterReminder
  );


  clearButton.addEventListener(
    "click",
    clearCalculator
  );


  /* ---------------------------------------
     Enter key
  --------------------------------------- */

  [
    weightInput,
    wakeTimeInput,
    bedTimeInput
  ].forEach((input) => {

    input.addEventListener(
      "keydown",
      (event) => {

        if (event.key === "Enter") {

          event.preventDefault();

          calculateWaterReminder();

        }

      }
    );

  });

});