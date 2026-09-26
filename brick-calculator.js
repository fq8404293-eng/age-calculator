document.addEventListener("DOMContentLoaded", () => {
  const wallLengthInput = document.getElementById("wall-length");
  const wallHeightInput = document.getElementById("wall-height");
  const wallOpeningsInput = document.getElementById("wall-openings");

  const brickLengthInput = document.getElementById("brick-length");
  const brickHeightInput = document.getElementById("brick-height");
  const brickThicknessInput = document.getElementById("brick-thickness");

  const mortarJointInput = document.getElementById("mortar-joint");
  const wasteInput = document.getElementById("brick-waste");

  const calculateButton = document.getElementById("calculate-bricks");
  const resetButton = document.getElementById("reset-bricks");

  const errorBox = document.getElementById("brick-error");
  const resultBox = document.getElementById("brick-result");
  const resultContent = document.getElementById("brick-result-content");

  const summaryWallArea = document.getElementById("summary-wall-area");
  const summaryBrickSize = document.getElementById("summary-brick-size");
  const summaryBricksRequired = document.getElementById("summary-bricks-required");
  const summaryBricksPurchase = document.getElementById("summary-bricks-purchase");

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
    resultBox.hidden = true;
  }

  function clearError() {
    errorBox.textContent = "";
    errorBox.hidden = true;
  }

  function formatNumber(value, decimals = 2) {
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function formatSmart(value, decimals = 2) {
    return Number(value).toLocaleString("en-US", {
      maximumFractionDigits: decimals
    });
  }

  function calculateBricks() {
    clearError();

    const wallLength = Number.parseFloat(wallLengthInput.value);
    const wallHeight = Number.parseFloat(wallHeightInput.value);

    const openings =
      wallOpeningsInput.value.trim() === ""
        ? 0
        : Number.parseFloat(wallOpeningsInput.value);

    const brickLength = Number.parseFloat(brickLengthInput.value);
    const brickHeight = Number.parseFloat(brickHeightInput.value);
    const brickThickness = Number.parseFloat(brickThicknessInput.value);

    const mortarJoint = Number.parseFloat(mortarJointInput.value);

    const waste =
      wasteInput.value.trim() === ""
        ? 0
        : Number.parseFloat(wasteInput.value);

    if (!Number.isFinite(wallLength) || wallLength <= 0) {
      showError("Please enter a wall length greater than 0.");
      wallLengthInput.focus();
      return;
    }

    if (!Number.isFinite(wallHeight) || wallHeight <= 0) {
      showError("Please enter a wall height greater than 0.");
      wallHeightInput.focus();
      return;
    }

    if (!Number.isFinite(openings) || openings < 0) {
      showError("Please enter a valid doors and windows area.");
      wallOpeningsInput.focus();
      return;
    }

    if (!Number.isFinite(brickLength) || brickLength <= 0) {
      showError("Please enter a brick length greater than 0.");
      brickLengthInput.focus();
      return;
    }

    if (!Number.isFinite(brickHeight) || brickHeight <= 0) {
      showError("Please enter a brick height greater than 0.");
      brickHeightInput.focus();
      return;
    }

    if (!Number.isFinite(brickThickness) || brickThickness <= 0) {
      showError("Please enter a brick thickness greater than 0.");
      brickThicknessInput.focus();
      return;
    }

    if (!Number.isFinite(mortarJoint) || mortarJoint < 0) {
      showError("Please enter a valid mortar joint thickness.");
      mortarJointInput.focus();
      return;
    }

    if (!Number.isFinite(waste) || waste < 0 || waste > 100) {
      showError("Waste allowance must be between 0% and 100%.");
      wasteInput.focus();
      return;
    }

    /*
      Convert brick dimensions from inches to feet.
    */
    const brickLengthFt = brickLength / 12;
    const brickHeightFt = brickHeight / 12;
    const mortarJointFt = mortarJoint / 12;

    /*
      Calculate total wall area.
    */
    const totalWallArea = wallLength * wallHeight;

    /*
      Remove doors and windows.
    */
    const usableWallArea = totalWallArea - openings;

    if (usableWallArea <= 0) {
      showError(
        "Doors and windows area cannot be equal to or greater than the total wall area."
      );
      wallOpeningsInput.focus();
      return;
    }

    /*
      Include mortar joint in the effective brick dimensions.
    */
    const effectiveBrickLength =
      brickLengthFt + mortarJointFt;

    const effectiveBrickHeight =
      brickHeightFt + mortarJointFt;

    /*
      Effective face area covered by one brick.
    */
    const brickCoverageArea =
      effectiveBrickLength * effectiveBrickHeight;

    /*
      Bricks before waste.
    */
    const bricksBeforeWaste =
      usableWallArea / brickCoverageArea;

    /*
      Apply waste allowance.
    */
    const wasteFactor = 1 + waste / 100;

    const bricksWithWaste =
      bricksBeforeWaste * wasteFactor;

    const bricksToPurchase =
      Math.ceil(bricksWithWaste);

    const wasteBricks =
      bricksWithWaste - bricksBeforeWaste;

    /*
      Brick volume calculations.
    */
    const individualBrickVolume =
      brickLengthFt *
      brickHeightFt *
      (brickThickness / 12);

    const totalBrickVolume =
      bricksBeforeWaste * individualBrickVolume;

    /*
      Convert wall area to square meters.
    */
    const usableWallAreaM2 =
      usableWallArea * 0.09290304;

    /*
      Result section.
    */
    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Total Wall Area</h3>
          <p>${formatNumber(totalWallArea)} ft²</p>
        </div>

        <div class="result-card">
          <h3>Usable Wall Area</h3>
          <p>${formatNumber(usableWallArea)} ft²</p>
        </div>

        <div class="result-card">
          <h3>Brick Coverage</h3>
          <p>${formatNumber(brickCoverageArea, 4)} ft²</p>
        </div>

        <div class="result-card">
          <h3>Bricks Before Waste</h3>
          <p>${formatNumber(bricksBeforeWaste)} bricks</p>
        </div>

        <div class="result-card">
          <h3>Waste Allowance</h3>
          <p>${formatNumber(waste)}%</p>
        </div>

        <div class="result-card">
          <h3>Bricks to Purchase</h3>
          <p>${bricksToPurchase.toLocaleString("en-US")} bricks</p>
        </div>

      </div>

      <div class="info-box">

        <p>
          <strong>Brick size:</strong>
          ${formatSmart(brickLength)} ×
          ${formatSmart(brickHeight)} ×
          ${formatSmart(brickThickness)} inches
        </p>

        <p>
          <strong>Mortar joint:</strong>
          ${formatSmart(mortarJoint)} inches
        </p>

        <p>
          <strong>Effective brick coverage:</strong>
          ${formatNumber(effectiveBrickLength * 12)} ×
          ${formatNumber(effectiveBrickHeight * 12)} inches
        </p>

        <p>
          <strong>Bricks before waste:</strong>
          ${formatNumber(bricksBeforeWaste)}
        </p>

        <p>
          <strong>Additional bricks for waste:</strong>
          ${formatNumber(wasteBricks)}
        </p>

        <p>
          <strong>Estimated brick volume:</strong>
          ${formatNumber(totalBrickVolume, 3)} ft³
        </p>

        <p>
          <strong>Usable wall area:</strong>
          ${formatNumber(usableWallAreaM2)} m²
        </p>

        <p>
          <strong>Recommended purchase:</strong>
          ${bricksToPurchase.toLocaleString("en-US")} bricks
        </p>

      </div>

      <p class="small-text">
        This is an estimate based on the dimensions and mortar joint entered.
        Actual brick quantities can vary because of wall layout, corners,
        cutting, joint thickness, brick size variations, and breakage.
      </p>
    `;

    /*
      Summary cards.
    */
    summaryWallArea.textContent =
      `${formatNumber(usableWallArea)} ft²`;

    summaryBrickSize.textContent =
      `${formatSmart(brickLength)} × ${formatSmart(brickHeight)} × ${formatSmart(brickThickness)} in`;

    summaryBricksRequired.textContent =
      `${formatNumber(bricksBeforeWaste)} bricks`;

    summaryBricksPurchase.textContent =
      `${bricksToPurchase.toLocaleString("en-US")} bricks`;

    resultBox.hidden = false;

    setTimeout(() => {
      resultBox.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 50);
  }

  function resetCalculator() {
    wallLengthInput.value = "";
    wallHeightInput.value = "";
    wallOpeningsInput.value = "0";

    brickLengthInput.value = "";
    brickHeightInput.value = "";
    brickThicknessInput.value = "";

    mortarJointInput.value = "0.375";
    wasteInput.value = "5";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    summaryWallArea.textContent = "—";
    summaryBrickSize.textContent = "—";
    summaryBricksRequired.textContent = "—";
    summaryBricksPurchase.textContent = "—";

    wallLengthInput.focus();
  }

  calculateButton.addEventListener("click", calculateBricks);
  resetButton.addEventListener("click", resetCalculator);

  [
    wallLengthInput,
    wallHeightInput,
    wallOpeningsInput,
    brickLengthInput,
    brickHeightInput,
    brickThicknessInput,
    mortarJointInput,
    wasteInput
  ].forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        calculateBricks();
      }
    });
  });
});