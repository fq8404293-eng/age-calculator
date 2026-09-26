document.addEventListener("DOMContentLoaded", () => {
  const diagonalInput = document.getElementById("tv-diagonal");
  const unitInput = document.getElementById("tv-unit");
  const resolutionInput = document.getElementById("tv-resolution");

  const calculateButton = document.getElementById("tv-calculate");
  const resetButton = document.getElementById("tv-reset");

  const errorBox = document.getElementById("tv-error");
  const resultBox = document.getElementById("tv-result");
  const resultContent = document.getElementById("tv-result-content");

  const summarySize = document.getElementById("tv-summary-size");
  const summaryWidth = document.getElementById("tv-summary-width");
  const summaryHeight = document.getElementById("tv-summary-height");
  const summaryDistance = document.getElementById("tv-summary-distance");


  function getNumber(input) {
    return Number.parseFloat(input.value);
  }


  function formatNumber(value, decimals = 2) {
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }


  function formatViewingDistance(inches) {
    const feet = inches / 12;

    const minimumFeet = feet * 0.75;
    const maximumFeet = feet * 1.25;

    return {
      minFeet: minimumFeet,
      maxFeet: maximumFeet
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

    const diagonal = getNumber(diagonalInput);
    const unit = unitInput.value;
    const resolution = resolutionInput.value;


    /*
     * Validation
     */

    if (!Number.isFinite(diagonal) || diagonal <= 0) {
      showError("Please enter a valid TV size greater than 0.");
      diagonalInput.focus();
      return;
    }


    /*
     * Convert diagonal to inches.
     */

    const diagonalInches =
      unit === "cm"
        ? diagonal / 2.54
        : diagonal;


    /*
     * Standard TV aspect ratio:
     * 16:9
     */

    const aspectWidth = 16;
    const aspectHeight = 9;

    const aspectDiagonalFactor =
      Math.sqrt(
        (aspectWidth * aspectWidth) +
        (aspectHeight * aspectHeight)
      );


    /*
     * Calculate screen dimensions.
     */

    const widthInches =
      diagonalInches *
      aspectWidth /
      aspectDiagonalFactor;

    const heightInches =
      diagonalInches *
      aspectHeight /
      aspectDiagonalFactor;


    /*
     * Convert dimensions to centimeters.
     */

    const widthCm =
      widthInches * 2.54;

    const heightCm =
      heightInches * 2.54;

    const diagonalCm =
      diagonalInches * 2.54;


    /*
     * Calculate screen area.
     */

    const areaSquareInches =
      widthInches * heightInches;

    const areaSquareCm =
      widthCm * heightCm;

    const areaSquareFeet =
      areaSquareInches / 144;

    const areaSquareMeters =
      areaSquareCm / 10000;


    /*
     * Recommended viewing distance.
     *
     * This calculator uses a practical estimate of
     * 0.75x to 1.25x the TV diagonal in feet.
     */

    const viewingDistance =
      formatViewingDistance(diagonalInches);

    const minViewingFeet =
      viewingDistance.minFeet;

    const maxViewingFeet =
      viewingDistance.maxFeet;

    const minViewingInches =
      minViewingFeet * 12;

    const maxViewingInches =
      maxViewingFeet * 12;


    /*
     * Resolution and pixel density.
     */

    let resolutionWidth = null;
    let resolutionHeight = null;
    let totalPixels = null;
    let megapixels = null;
    let ppi = null;


    if (resolution !== "") {

      const parts = resolution.split("x");

      if (parts.length === 2) {

        resolutionWidth =
          Number.parseInt(parts[0], 10);

        resolutionHeight =
          Number.parseInt(parts[1], 10);


        if (
          Number.isFinite(resolutionWidth) &&
          Number.isFinite(resolutionHeight) &&
          resolutionWidth > 0 &&
          resolutionHeight > 0
        ) {

          totalPixels =
            resolutionWidth * resolutionHeight;

          megapixels =
            totalPixels / 1000000;


          const diagonalPixels =
            Math.sqrt(
              (resolutionWidth * resolutionWidth) +
              (resolutionHeight * resolutionHeight)
            );

          ppi =
            diagonalPixels / diagonalInches;

        }

      }

    }


    /*
     * Result.
     */

    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>TV Diagonal</h3>
          <p>
            <strong>${formatNumber(diagonalInches, 2)} in</strong>
          </p>
          <small>
            ${formatNumber(diagonalCm, 2)} cm
          </small>
        </div>

        <div class="result-card">
          <h3>Screen Width</h3>
          <p>
            <strong>${formatNumber(widthInches, 2)} in</strong>
          </p>
          <small>
            ${formatNumber(widthCm, 2)} cm
          </small>
        </div>

        <div class="result-card">
          <h3>Screen Height</h3>
          <p>
            <strong>${formatNumber(heightInches, 2)} in</strong>
          </p>
          <small>
            ${formatNumber(heightCm, 2)} cm
          </small>
        </div>

        <div class="result-card">
          <h3>Aspect Ratio</h3>
          <p>
            <strong>16:9</strong>
          </p>
          <small>
            Standard widescreen format
          </small>
        </div>

        <div class="result-card">
          <h3>Screen Area</h3>
          <p>
            <strong>${formatNumber(areaSquareInches, 2)} in²</strong>
          </p>
          <small>
            ${formatNumber(areaSquareCm, 2)} cm²
          </small>
        </div>

        <div class="result-card">
          <h3>Screen Area</h3>
          <p>
            <strong>${formatNumber(areaSquareFeet, 2)} ft²</strong>
          </p>
          <small>
            ${formatNumber(areaSquareMeters, 3)} m²
          </small>
        </div>

        <div class="result-card">
          <h3>Viewing Distance</h3>
          <p>
            <strong>
              ${formatNumber(minViewingFeet, 1)} – ${formatNumber(maxViewingFeet, 1)} ft
            </strong>
          </p>
          <small>
            ${formatNumber(minViewingInches, 0)} – ${formatNumber(maxViewingInches, 0)} in
          </small>
        </div>

        ${
          ppi !== null
            ? `
              <div class="result-card">
                <h3>Pixel Density</h3>
                <p>
                  <strong>${formatNumber(ppi, 2)} PPI</strong>
                </p>
                <small>
                  Pixels per inch
                </small>
              </div>

              <div class="result-card">
                <h3>Total Pixels</h3>
                <p>
                  <strong>${totalPixels.toLocaleString("en-US")}</strong>
                </p>
                <small>
                  ${formatNumber(megapixels, 2)} megapixels
                </small>
              </div>
            `
            : ""
        }

      </div>


      <div class="info-box">

        <h3>TV Size Calculation</h3>

        <p>
          TV diagonal =
          <strong>${formatNumber(diagonalInches, 2)} inches</strong>
          (${formatNumber(diagonalCm, 2)} cm)
        </p>

        <p>
          Aspect ratio =
          <strong>16:9</strong>
        </p>

        <p>
          Screen width =
          <strong>${formatNumber(widthInches, 2)} inches</strong>
          (${formatNumber(widthCm, 2)} cm)
        </p>

        <p>
          Screen height =
          <strong>${formatNumber(heightInches, 2)} inches</strong>
          (${formatNumber(heightCm, 2)} cm)
        </p>

        <p>
          Screen area =
          <strong>${formatNumber(areaSquareInches, 2)} square inches</strong>
        </p>

        <p>
          Estimated viewing distance =
          <strong>
            ${formatNumber(minViewingFeet, 1)} –
            ${formatNumber(maxViewingFeet, 1)} feet
          </strong>
        </p>

        ${
          ppi !== null
            ? `
              <p>
                Pixel density =
                <strong>${formatNumber(ppi, 2)} PPI</strong>
              </p>
            `
            : `
              <p>
                Pixel density was not calculated because no resolution
                was selected.
              </p>
            `
        }

      </div>
    `;


    /*
     * Summary.
     */

    summarySize.textContent =
      `${formatNumber(diagonalInches, 2)} in`;

    summaryWidth.textContent =
      `${formatNumber(widthInches, 2)} in`;

    summaryHeight.textContent =
      `${formatNumber(heightInches, 2)} in`;

    summaryDistance.textContent =
      `${formatNumber(minViewingFeet, 1)} – ${formatNumber(maxViewingFeet, 1)} ft`;


    /*
     * Show results.
     */

    resultBox.hidden = false;

    resultBox.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }


  function resetCalculator() {

    diagonalInput.value = "";

    unitInput.value = "in";

    resolutionInput.value = "3840x2160";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    summarySize.textContent = "—";
    summaryWidth.textContent = "—";
    summaryHeight.textContent = "—";
    summaryDistance.textContent = "—";

    diagonalInput.focus();
  }


  calculateButton.addEventListener("click", calculate);

  resetButton.addEventListener("click", resetCalculator);


  /*
   * Enter key support.
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