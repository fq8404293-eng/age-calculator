document.addEventListener("DOMContentLoaded", () => {
  const calculateButton = document.getElementById("tire-calculate");
  const resetButton = document.getElementById("tire-reset");

  const errorBox = document.getElementById("tire-error");
  const resultBox = document.getElementById("tire-result");
  const resultContent = document.getElementById("tire-result-content");

  const originalWidth = document.getElementById("tire-original-width");
  const originalAspect = document.getElementById("tire-original-aspect");
  const originalRim = document.getElementById("tire-original-rim");

  const newWidth = document.getElementById("tire-new-width");
  const newAspect = document.getElementById("tire-new-aspect");
  const newRim = document.getElementById("tire-new-rim");

  const speedInput = document.getElementById("tire-speed");

  const summaryOriginal = document.getElementById("tire-summary-original");
  const summaryNew = document.getElementById("tire-summary-new");
  const summaryDifference = document.getElementById("tire-summary-difference");
  const summaryPercent = document.getElementById("tire-summary-percent");


  function getNumber(input) {
    return Number.parseFloat(input.value);
  }


  function formatNumber(value, decimals = 2) {
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }


  function calculateTire(width, aspect, rim) {
    const sidewallMm = width * (aspect / 100);

    const sidewallInches = sidewallMm / 25.4;

    const diameterInches = (sidewallInches * 2) + rim;

    const diameterMm = diameterInches * 25.4;

    const diameterCm = diameterMm / 10;

    const diameterFeet = diameterInches / 12;

    const circumferenceInches = Math.PI * diameterInches;

    const circumferenceMm = circumferenceInches * 25.4;

    const circumferenceCm = circumferenceMm / 10;

    const circumferenceFeet = circumferenceInches / 12;

    return {
      width,
      aspect,
      rim,
      sidewallMm,
      sidewallInches,
      diameterInches,
      diameterMm,
      diameterCm,
      diameterFeet,
      circumferenceInches,
      circumferenceMm,
      circumferenceCm,
      circumferenceFeet
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


  function calculate() {
    clearError();

    const ow = getNumber(originalWidth);
    const oa = getNumber(originalAspect);
    const or = getNumber(originalRim);

    const nw = getNumber(newWidth);
    const na = getNumber(newAspect);
    const nr = getNumber(newRim);

    const speed = speedInput.value.trim() === ""
      ? null
      : getNumber(speedInput);


    /*
     * Validation
     */

    if (!Number.isFinite(ow) || ow <= 0) {
      showError("Please enter a valid original tire width.");
      originalWidth.focus();
      return;
    }

    if (!Number.isFinite(oa) || oa <= 0 || oa > 100) {
      showError("Please enter a valid original aspect ratio between 1% and 100%.");
      originalAspect.focus();
      return;
    }

    if (!Number.isFinite(or) || or <= 0) {
      showError("Please enter a valid original rim diameter.");
      originalRim.focus();
      return;
    }

    if (!Number.isFinite(nw) || nw <= 0) {
      showError("Please enter a valid new tire width.");
      newWidth.focus();
      return;
    }

    if (!Number.isFinite(na) || na <= 0 || na > 100) {
      showError("Please enter a valid new aspect ratio between 1% and 100%.");
      newAspect.focus();
      return;
    }

    if (!Number.isFinite(nr) || nr <= 0) {
      showError("Please enter a valid new rim diameter.");
      newRim.focus();
      return;
    }

    if (speed !== null && (!Number.isFinite(speed) || speed < 0)) {
      showError("Please enter a valid speedometer reading of 0 or greater.");
      speedInput.focus();
      return;
    }


    /*
     * Tire calculations
     */

    const original = calculateTire(ow, oa, or);
    const newer = calculateTire(nw, na, nr);


    /*
     * Differences
     */

    const diameterDifferenceMm =
      newer.diameterMm - original.diameterMm;

    const diameterDifferenceInches =
      newer.diameterInches - original.diameterInches;

    const diameterPercentage =
      (diameterDifferenceMm / original.diameterMm) * 100;


    const circumferenceDifferenceMm =
      newer.circumferenceMm - original.circumferenceMm;

    const circumferencePercentage =
      (circumferenceDifferenceMm / original.circumferenceMm) * 100;


    const sidewallDifferenceMm =
      newer.sidewallMm - original.sidewallMm;


    /*
     * Ground clearance change
     *
     * Approximately half of the overall diameter difference.
     */

    const groundClearanceChangeMm =
      diameterDifferenceMm / 2;


    /*
     * Speedometer comparison
     *
     * If the original speedometer says X, actual speed with
     * the new tire is approximately:
     *
     * X × new diameter / original diameter
     */

    let actualSpeed = null;
    let speedDifference = null;
    let speedDifferencePercentage = null;

    if (speed !== null) {
      actualSpeed =
        speed * (newer.diameterMm / original.diameterMm);

      speedDifference =
        actualSpeed - speed;

      speedDifferencePercentage =
        (speedDifference / speed) * 100;
    }


    /*
     * Revolutions per distance
     */

    const originalRevolutionsPerKm =
      1000000 / original.circumferenceMm;

    const newRevolutionsPerKm =
      1000000 / newer.circumferenceMm;


    /*
     * Difference classification
     */

    let differenceMessage = "";

    const absolutePercentage = Math.abs(diameterPercentage);

    if (absolutePercentage < 1) {
      differenceMessage =
        "The overall diameter difference is less than 1%, which is a relatively small change.";
    } else if (absolutePercentage < 3) {
      differenceMessage =
        "The overall diameter difference is between 1% and 3%. Check your vehicle manufacturer's approved tire sizes before fitting.";
    } else {
      differenceMessage =
        "The overall diameter difference is greater than 3%. A change of this size may significantly affect vehicle behavior, speedometer accuracy and clearance.";
    }


    /*
     * Direction text
     */

    const diameterDirection =
      diameterDifferenceMm > 0
        ? "larger"
        : diameterDifferenceMm < 0
          ? "smaller"
          : "the same size";

    const groundDirection =
      groundClearanceChangeMm > 0
        ? "increase"
        : groundClearanceChangeMm < 0
          ? "decrease"
          : "no change";


    /*
     * Result HTML
     */

    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Original Tire Diameter</h3>
          <p><strong>${formatNumber(original.diameterInches, 2)} in</strong></p>
          <small>${formatNumber(original.diameterMm, 1)} mm</small>
        </div>

        <div class="result-card">
          <h3>New Tire Diameter</h3>
          <p><strong>${formatNumber(newer.diameterInches, 2)} in</strong></p>
          <small>${formatNumber(newer.diameterMm, 1)} mm</small>
        </div>

        <div class="result-card">
          <h3>Diameter Difference</h3>
          <p>
            <strong>
              ${diameterDifferenceMm >= 0 ? "+" : ""}
              ${formatNumber(diameterDifferenceMm, 1)} mm
            </strong>
          </p>
          <small>
            ${diameterDifferenceInches >= 0 ? "+" : ""}
            ${formatNumber(diameterDifferenceInches, 3)} in
          </small>
        </div>

        <div class="result-card">
          <h3>Diameter Change</h3>
          <p>
            <strong>
              ${diameterPercentage >= 0 ? "+" : ""}
              ${formatNumber(diameterPercentage, 2)}%
            </strong>
          </p>
          <small>
            New tire is ${diameterDirection}.
          </small>
        </div>

        <div class="result-card">
          <h3>Original Sidewall</h3>
          <p>
            <strong>${formatNumber(original.sidewallMm, 1)} mm</strong>
          </p>
          <small>
            ${formatNumber(original.sidewallInches, 2)} in
          </small>
        </div>

        <div class="result-card">
          <h3>New Sidewall</h3>
          <p>
            <strong>${formatNumber(newer.sidewallMm, 1)} mm</strong>
          </p>
          <small>
            ${formatNumber(newer.sidewallInches, 2)} in
          </small>
        </div>

        <div class="result-card">
          <h3>Sidewall Difference</h3>
          <p>
            <strong>
              ${sidewallDifferenceMm >= 0 ? "+" : ""}
              ${formatNumber(sidewallDifferenceMm, 1)} mm
            </strong>
          </p>
          <small>
            Per sidewall
          </small>
        </div>

        <div class="result-card">
          <h3>Ground Clearance Change</h3>
          <p>
            <strong>
              ${groundClearanceChangeMm >= 0 ? "+" : ""}
              ${formatNumber(groundClearanceChangeMm, 1)} mm
            </strong>
          </p>
          <small>
            Approximate ${groundDirection}
          </small>
        </div>

        <div class="result-card">
          <h3>Original Circumference</h3>
          <p>
            <strong>${formatNumber(original.circumferenceMm, 1)} mm</strong>
          </p>
          <small>
            ${formatNumber(original.circumferenceInches, 2)} in
          </small>
        </div>

        <div class="result-card">
          <h3>New Circumference</h3>
          <p>
            <strong>${formatNumber(newer.circumferenceMm, 1)} mm</strong>
          </p>
          <small>
            ${formatNumber(newer.circumferenceInches, 2)} in
          </small>
        </div>

        <div class="result-card">
          <h3>Circumference Change</h3>
          <p>
            <strong>
              ${circumferencePercentage >= 0 ? "+" : ""}
              ${formatNumber(circumferencePercentage, 2)}%
            </strong>
          </p>
          <small>
            ${circumferenceDifferenceMm >= 0 ? "+" : ""}
            ${formatNumber(circumferenceDifferenceMm, 1)} mm
          </small>
        </div>

        <div class="result-card">
          <h3>Revolutions per km</h3>
          <p>
            <strong>${formatNumber(originalRevolutionsPerKm, 1)}</strong>
          </p>
          <small>
            New: ${formatNumber(newRevolutionsPerKm, 1)}
          </small>
        </div>

      </div>

      ${
        speed !== null
          ? `
            <div class="calculator-results-grid">

              <div class="result-card">
                <h3>Speedometer Reading</h3>
                <p>
                  <strong>${formatNumber(speed, 1)} km/h</strong>
                </p>
                <small>Original tire</small>
              </div>

              <div class="result-card">
                <h3>Estimated Actual Speed</h3>
                <p>
                  <strong>${formatNumber(actualSpeed, 1)} km/h</strong>
                </p>
                <small>With new tire</small>
              </div>

              <div class="result-card">
                <h3>Speed Difference</h3>
                <p>
                  <strong>
                    ${speedDifference >= 0 ? "+" : ""}
                    ${formatNumber(speedDifference, 1)} km/h
                  </strong>
                </p>
                <small>
                  ${speedDifferencePercentage >= 0 ? "+" : ""}
                  ${formatNumber(speedDifferencePercentage, 2)}%
                </small>
              </div>

            </div>
          `
          : ""
      }

      <div class="info-box">

        <h3>Tire Size Calculation</h3>

        <p>
          <strong>Original tire:</strong>
          ${ow}/${oa}R${or}
        </p>

        <p>
          <strong>New tire:</strong>
          ${nw}/${na}R${nr}
        </p>

        <p>
          Original diameter =
          <strong>${formatNumber(original.diameterMm, 1)} mm</strong>
        </p>

        <p>
          New diameter =
          <strong>${formatNumber(newer.diameterMm, 1)} mm</strong>
        </p>

        <p>
          Diameter change =
          <strong>
            ${diameterPercentage >= 0 ? "+" : ""}
            ${formatNumber(diameterPercentage, 2)}%
          </strong>
        </p>

        <p>
          ${differenceMessage}
        </p>

      </div>
    `;


    /*
     * Summary
     */

    summaryOriginal.textContent =
      `${formatNumber(original.diameterInches, 2)} in`;

    summaryNew.textContent =
      `${formatNumber(newer.diameterInches, 2)} in`;

    summaryDifference.textContent =
      `${diameterDifferenceMm >= 0 ? "+" : ""}${formatNumber(diameterDifferenceMm, 1)} mm`;

    summaryPercent.textContent =
      `${diameterPercentage >= 0 ? "+" : ""}${formatNumber(diameterPercentage, 2)}%`;


    resultBox.hidden = false;

    resultBox.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }


  function resetCalculator() {

    originalWidth.value = "";
    originalAspect.value = "";
    originalRim.value = "";

    newWidth.value = "";
    newAspect.value = "";
    newRim.value = "";

    speedInput.value = "";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    summaryOriginal.textContent = "—";
    summaryNew.textContent = "—";
    summaryDifference.textContent = "—";
    summaryPercent.textContent = "—";

    originalWidth.focus();
  }


  calculateButton.addEventListener("click", calculate);

  resetButton.addEventListener("click", resetCalculator);


  /*
   * Enter key support
   */

  document.querySelectorAll(".calculator-form input").forEach(input => {

    input.addEventListener("keydown", event => {

      if (event.key === "Enter") {
        event.preventDefault();
        calculate();
      }

    });

  });

});