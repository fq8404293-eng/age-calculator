document.addEventListener("DOMContentLoaded", () => {
  const diagonalInput = document.getElementById("screen-diagonal");
  const diagonalUnitInput = document.getElementById("screen-diagonal-unit");

  const aspectWidthInput = document.getElementById("screen-aspect-width");
  const aspectHeightInput = document.getElementById("screen-aspect-height");

  const resolutionWidthInput = document.getElementById("screen-resolution-width");
  const resolutionHeightInput = document.getElementById("screen-resolution-height");

  const calculateButton = document.getElementById("screen-calculate");
  const resetButton = document.getElementById("screen-reset");

  const errorBox = document.getElementById("screen-error");
  const resultBox = document.getElementById("screen-result");
  const resultContent = document.getElementById("screen-result-content");

  const summaryDiagonal = document.getElementById("screen-summary-diagonal");
  const summaryWidth = document.getElementById("screen-summary-width");
  const summaryHeight = document.getElementById("screen-summary-height");
  const summaryAspect = document.getElementById("screen-summary-aspect");


  function getNumber(input) {
    return Number.parseFloat(input.value);
  }


  function formatNumber(value, decimals = 2) {
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
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
    const diagonalUnit = diagonalUnitInput.value;

    const aspectWidth = getNumber(aspectWidthInput);
    const aspectHeight = getNumber(aspectHeightInput);

    const resolutionWidthValue = resolutionWidthInput.value.trim();
    const resolutionHeightValue = resolutionHeightInput.value.trim();

    const hasResolutionWidth = resolutionWidthValue !== "";
    const hasResolutionHeight = resolutionHeightValue !== "";


    /*
     * Validation
     */

    if (!Number.isFinite(diagonal) || diagonal <= 0) {
      showError("Please enter a valid screen diagonal greater than 0.");
      diagonalInput.focus();
      return;
    }

    if (!Number.isFinite(aspectWidth) || aspectWidth <= 0) {
      showError("Please enter a valid horizontal aspect ratio greater than 0.");
      aspectWidthInput.focus();
      return;
    }

    if (!Number.isFinite(aspectHeight) || aspectHeight <= 0) {
      showError("Please enter a valid vertical aspect ratio greater than 0.");
      aspectHeightInput.focus();
      return;
    }


    /*
     * Resolution is optional, but both values must be entered together.
     */

    if (hasResolutionWidth !== hasResolutionHeight) {
      showError(
        "Please enter both horizontal and vertical resolution, or leave both blank."
      );
      return;
    }


    let resolutionWidth = null;
    let resolutionHeight = null;


    if (hasResolutionWidth && hasResolutionHeight) {

      resolutionWidth = Number.parseInt(
        resolutionWidthValue,
        10
      );

      resolutionHeight = Number.parseInt(
        resolutionHeightValue,
        10
      );


      if (
        !Number.isFinite(resolutionWidth) ||
        resolutionWidth <= 0
      ) {
        showError("Please enter a valid horizontal resolution greater than 0.");
        resolutionWidthInput.focus();
        return;
      }


      if (
        !Number.isFinite(resolutionHeight) ||
        resolutionHeight <= 0
      ) {
        showError("Please enter a valid vertical resolution greater than 0.");
        resolutionHeightInput.focus();
        return;
      }
    }


    /*
     * Convert diagonal to inches.
     */

    const diagonalInches =
      diagonalUnit === "cm"
        ? diagonal / 2.54
        : diagonal;


    /*
     * Aspect ratio.
     *
     * width : height
     */

    const ratio =
      aspectWidth / aspectHeight;


    /*
     * Using:
     *
     * diagonal² = width² + height²
     *
     * width = diagonal × ratio / sqrt(ratio² + 1)
     *
     * height = width / ratio
     */

    const widthInches =
      diagonalInches *
      aspectWidth /
      Math.sqrt(
        (aspectWidth * aspectWidth) +
        (aspectHeight * aspectHeight)
      );


    const heightInches =
      diagonalInches *
      aspectHeight /
      Math.sqrt(
        (aspectWidth * aspectWidth) +
        (aspectHeight * aspectHeight)
      );


    /*
     * Centimeter dimensions.
     */

    const widthCm =
      widthInches * 2.54;

    const heightCm =
      heightInches * 2.54;


    /*
     * Screen area.
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
     * Pixel density.
     */

    let ppi = null;

    if (
      resolutionWidth !== null &&
      resolutionHeight !== null
    ) {

      const diagonalPixels =
        Math.sqrt(
          (resolutionWidth * resolutionWidth) +
          (resolutionHeight * resolutionHeight)
        );

      ppi =
        diagonalPixels / diagonalInches;
    }


    /*
     * Pixel dimensions and total pixels.
     */

    let totalPixels = null;
    let megapixels = null;

    if (
      resolutionWidth !== null &&
      resolutionHeight !== null
    ) {

      totalPixels =
        resolutionWidth * resolutionHeight;

      megapixels =
        totalPixels / 1000000;
    }


    /*
     * Aspect ratio display.
     */

    const aspectRatioText =
      `${formatNumber(aspectWidth, 2).replace(/\.00$/, "")}:` +
      `${formatNumber(aspectHeight, 2).replace(/\.00$/, "")}`;


    /*
     * Result HTML.
     */

    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Screen Diagonal</h3>
          <p>
            <strong>${formatNumber(diagonalInches, 2)} in</strong>
          </p>
          <small>
            ${formatNumber(diagonalInches * 2.54, 2)} cm
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
            <strong>${aspectRatioText}</strong>
          </p>
          <small>
            Width : Height
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

        <h3>Screen Size Calculation</h3>

        <p>
          Diagonal =
          <strong>
            ${formatNumber(diagonalInches, 2)} inches
          </strong>
        </p>

        <p>
          Aspect ratio =
          <strong>${aspectRatioText}</strong>
        </p>

        <p>
          Screen width =
          <strong>
            ${formatNumber(widthInches, 2)} inches
          </strong>
          (${formatNumber(widthCm, 2)} cm)
        </p>

        <p>
          Screen height =
          <strong>
            ${formatNumber(heightInches, 2)} inches
          </strong>
          (${formatNumber(heightCm, 2)} cm)
        </p>

        <p>
          Screen area =
          <strong>
            ${formatNumber(areaSquareInches, 2)} square inches
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
                Pixel density was not calculated because resolution
                was not provided.
              </p>
            `
        }

      </div>
    `;


    /*
     * Summary.
     */

    summaryDiagonal.textContent =
      `${formatNumber(diagonalInches, 2)} in`;

    summaryWidth.textContent =
      `${formatNumber(widthInches, 2)} in`;

    summaryHeight.textContent =
      `${formatNumber(heightInches, 2)} in`;

    summaryAspect.textContent =
      aspectRatioText;


    /*
     * Show result.
     */

    resultBox.hidden = false;

    resultBox.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }


  function resetCalculator() {

    diagonalInput.value = "";

    diagonalUnitInput.value = "in";

    aspectWidthInput.value = "16";
    aspectHeightInput.value = "9";

    resolutionWidthInput.value = "";
    resolutionHeightInput.value = "";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    summaryDiagonal.textContent = "—";
    summaryWidth.textContent = "—";
    summaryHeight.textContent = "—";
    summaryAspect.textContent = "—";

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