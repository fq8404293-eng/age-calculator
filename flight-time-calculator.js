document.addEventListener("DOMContentLoaded", function () {
  const distanceInput = document.getElementById("flight-distance");
  const distanceUnitInput = document.getElementById("flight-distance-unit");

  const speedInput = document.getElementById("flight-speed");
  const speedUnitInput = document.getElementById("flight-speed-unit");

  const calculateButton = document.getElementById("flight-calculate");
  const resetButton = document.getElementById("flight-reset");

  const errorBox = document.getElementById("flight-error");

  const resultBox = document.getElementById("flight-result");
  const resultContent = document.getElementById("flight-result-content");

  const summaryDistance = document.getElementById(
    "flight-summary-distance"
  );

  const summaryTime = document.getElementById(
    "flight-summary-time"
  );

  const summaryHours = document.getElementById(
    "flight-summary-hours"
  );

  const summaryMinutes = document.getElementById(
    "flight-summary-minutes"
  );


  /*
    Conversion constants.

    1 mile = 1.609344 km
    1 knot = 1.852 km/h
  */

  const MILES_TO_KM = 1.609344;
  const KNOTS_TO_KMH = 1.852;


  function formatNumber(number, decimals = 6) {
    if (!Number.isFinite(number)) {
      return "0";
    }

    return number.toLocaleString("en-US", {
      maximumFractionDigits: decimals
    });
  }


  function formatTime(totalSeconds) {
    const roundedSeconds = Math.round(totalSeconds);

    const hours = Math.floor(roundedSeconds / 3600);

    const minutes = Math.floor(
      (roundedSeconds % 3600) / 60
    );

    const seconds = roundedSeconds % 60;

    return {
      hours: hours,
      minutes: minutes,
      seconds: seconds,
      text: `${hours} hr ${minutes} min ${seconds} sec`
    };
  }


  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
    resultBox.hidden = true;
  }


  function clearError() {
    errorBox.textContent = "";
    errorBox.hidden = true;
  }


  function calculateFlightTime() {
    clearError();


    /*
      Read input values.
    */

    const distanceRaw =
      distanceInput.value.trim();

    const speedRaw =
      speedInput.value.trim();

    const distance =
      Number(distanceRaw);

    const speed =
      Number(speedRaw);


    /*
      Validate distance.
    */

    if (distanceRaw === "") {
      showError("Please enter the flight distance.");
      distanceInput.focus();
      return;
    }

    if (!Number.isFinite(distance) || distance <= 0) {
      showError(
        "Flight distance must be greater than 0."
      );
      distanceInput.focus();
      return;
    }


    /*
      Validate speed.
    */

    if (speedRaw === "") {
      showError("Please enter the average flight speed.");
      speedInput.focus();
      return;
    }

    if (!Number.isFinite(speed) || speed <= 0) {
      showError(
        "Average flight speed must be greater than 0."
      );
      speedInput.focus();
      return;
    }


    /*
      Convert distance to kilometers.
    */

    let distanceKm;

    if (distanceUnitInput.value === "km") {

      distanceKm = distance;

    } else if (distanceUnitInput.value === "miles") {

      distanceKm =
        distance * MILES_TO_KM;

    } else {

      showError(
        "Please select a valid distance unit."
      );
      distanceUnitInput.focus();
      return;
    }


    /*
      Convert aircraft speed to km/h.
    */

    let speedKmh;

    if (speedUnitInput.value === "kmh") {

      speedKmh = speed;

    } else if (speedUnitInput.value === "mph") {

      speedKmh =
        speed * MILES_TO_KM;

    } else if (speedUnitInput.value === "knots") {

      speedKmh =
        speed * KNOTS_TO_KMH;

    } else {

      showError(
        "Please select a valid speed unit."
      );
      speedUnitInput.focus();
      return;
    }


    /*
      Flight time in hours.

      Time = Distance ÷ Speed
    */

    const timeHours =
      distanceKm / speedKmh;


    /*
      Convert time to minutes and seconds.
    */

    const totalMinutes =
      timeHours * 60;

    const totalSeconds =
      timeHours * 3600;

    const time =
      formatTime(totalSeconds);


    /*
      Display results.
    */

    resultContent.innerHTML = `

      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Estimated Flight Time</h3>
          <p>${time.text}</p>
        </div>

        <div class="result-card">
          <h3>Hours</h3>
          <p>${formatNumber(timeHours)} hr</p>
        </div>

        <div class="result-card">
          <h3>Total Minutes</h3>
          <p>${formatNumber(totalMinutes)} min</p>
        </div>

        <div class="result-card">
          <h3>Total Seconds</h3>
          <p>${formatNumber(totalSeconds)} sec</p>
        </div>

      </div>


      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Distance</h3>
          <p>${formatNumber(distanceKm)} km</p>
        </div>

        <div class="result-card">
          <h3>Distance</h3>
          <p>${formatNumber(distanceKm / MILES_TO_KM)} mi</p>
        </div>

        <div class="result-card">
          <h3>Average Speed</h3>
          <p>${formatNumber(speedKmh)} km/h</p>
        </div>

        <div class="result-card">
          <h3>Average Speed</h3>
          <p>${formatNumber(speedKmh / MILES_TO_KM)} mph</p>
        </div>

      </div>


      <div class="info-box">

        <p>
          <strong>Estimated flight time:</strong>
          ${formatNumber(distanceKm)} km ÷
          ${formatNumber(speedKmh)} km/h =
          ${formatNumber(timeHours)} hours.
        </p>

        <p>
          This is a mathematical estimate based on constant average speed.
          Actual flight times can differ because of wind, routing,
          air traffic, takeoff, landing, and taxiing.
        </p>

      </div>

    `;


    /*
      Update summary.
    */

    summaryDistance.textContent =
      `${formatNumber(distanceKm)} km`;

    summaryTime.textContent =
      time.text;

    summaryHours.textContent =
      `${formatNumber(timeHours)} hr`;

    summaryMinutes.textContent =
      `${formatNumber(totalMinutes)} min`;


    resultBox.hidden = false;


    /*
      Smoothly scroll to results.
    */

    resultBox.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }


  function resetCalculator() {
    distanceInput.value = "";
    distanceUnitInput.value = "km";

    speedInput.value = "";
    speedUnitInput.value = "kmh";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    summaryDistance.textContent = "—";
    summaryTime.textContent = "—";
    summaryHours.textContent = "—";
    summaryMinutes.textContent = "—";

    distanceInput.focus();
  }


  /*
    Calculate button.
  */

  calculateButton.addEventListener(
    "click",
    calculateFlightTime
  );


  /*
    Reset button.
  */

  resetButton.addEventListener(
    "click",
    resetCalculator
  );


  /*
    Allow Enter to calculate.
  */

  const calculatorInputs = [
    distanceInput,
    distanceUnitInput,
    speedInput,
    speedUnitInput
  ];


  calculatorInputs.forEach(function (input) {

    input.addEventListener("keydown", function (event) {

      if (event.key === "Enter") {
        event.preventDefault();
        calculateFlightTime();
      }

    });

  });

});