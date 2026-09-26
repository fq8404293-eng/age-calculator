document.addEventListener("DOMContentLoaded", () => {
  const lengthInput = document.getElementById("tile-room-length");
  const widthInput = document.getElementById("tile-room-width");
  const tileLengthInput = document.getElementById("tile-length");
  const tileWidthInput = document.getElementById("tile-width");
  const wasteInput = document.getElementById("tile-waste");
  const boxQuantityInput = document.getElementById("tile-box-quantity");

  const calculateButton = document.getElementById("calculate-tile");
  const resetButton = document.getElementById("reset-tile");

  const errorMessage = document.getElementById("tile-error");
  const resultBox = document.getElementById("tile-result");
  const resultContent = document.getElementById("tile-result-content");

  if (
    !lengthInput ||
    !widthInput ||
    !tileLengthInput ||
    !tileWidthInput ||
    !wasteInput ||
    !boxQuantityInput ||
    !calculateButton ||
    !resetButton ||
    !errorMessage ||
    !resultBox ||
    !resultContent
  ) {
    return;
  }

  function getNumber(input) {
    return Number(input.value);
  }

  function formatNumber(value, decimals = 2) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    });
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;

    resultBox.hidden = true;
    resultContent.innerHTML = "";
  }

  function clearError() {
    errorMessage.textContent = "";
    errorMessage.hidden = true;
  }

  function calculateTiles() {
    clearError();

    const surfaceLength = getNumber(lengthInput);
    const surfaceWidth = getNumber(widthInput);

    const tileLengthInches = getNumber(tileLengthInput);
    const tileWidthInches = getNumber(tileWidthInput);

    const wastePercent = getNumber(wasteInput);

    const boxQuantityRaw = boxQuantityInput.value.trim();
    const boxQuantity =
      boxQuantityRaw === "" ? null : getNumber(boxQuantityInput);

    if (!Number.isFinite(surfaceLength) || surfaceLength <= 0) {
      showError("Please enter a valid surface length greater than 0.");
      lengthInput.focus();
      return;
    }

    if (!Number.isFinite(surfaceWidth) || surfaceWidth <= 0) {
      showError("Please enter a valid surface width greater than 0.");
      widthInput.focus();
      return;
    }

    if (!Number.isFinite(tileLengthInches) || tileLengthInches <= 0) {
      showError("Please enter a valid tile length greater than 0.");
      tileLengthInput.focus();
      return;
    }

    if (!Number.isFinite(tileWidthInches) || tileWidthInches <= 0) {
      showError("Please enter a valid tile width greater than 0.");
      tileWidthInput.focus();
      return;
    }

    if (
      !Number.isFinite(wastePercent) ||
      wastePercent < 0 ||
      wastePercent > 50
    ) {
      showError("Waste allowance must be between 0% and 50%.");
      wasteInput.focus();
      return;
    }

    if (boxQuantity !== null) {
      if (
        !Number.isFinite(boxQuantity) ||
        boxQuantity <= 0 ||
        !Number.isInteger(boxQuantity)
      ) {
        showError("Tiles per box must be a whole number greater than 0.");
        boxQuantityInput.focus();
        return;
      }
    }

    // Convert tile dimensions from inches to feet.
    const tileLengthFeet = tileLengthInches / 12;
    const tileWidthFeet = tileWidthInches / 12;

    // Calculate surface area.
    const surfaceArea = surfaceLength * surfaceWidth;

    // Calculate area of one tile.
    const tileArea = tileLengthFeet * tileWidthFeet;

    // Theoretical number of tiles before waste.
    const baseTiles = surfaceArea / tileArea;

    // Add waste allowance.
    const wasteFactor = 1 + wastePercent / 100;

    const tilesWithWaste = baseTiles * wasteFactor;

    // Tiles must be purchased as whole pieces.
    const tilesNeeded = Math.ceil(tilesWithWaste);

    // Additional tiles created by waste allowance.
    const additionalTiles = tilesNeeded - Math.ceil(baseTiles);

    // Actual coverage represented by the purchased tiles.
    const purchasedCoverage = tilesNeeded * tileArea;

    let boxesNeeded = null;
    let tilesPerBoxText = "";

    if (boxQuantity !== null) {
      boxesNeeded = Math.ceil(tilesNeeded / boxQuantity);

      tilesPerBoxText = `
        <p>
          <strong>Tiles per Box:</strong>
          ${formatNumber(boxQuantity, 0)}
        </p>

        <p>
          <strong>Estimated Boxes Needed:</strong>
          ${formatNumber(boxesNeeded, 0)}
        </p>
      `;
    }

    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Tiles Needed</h3>
          <p>${formatNumber(tilesNeeded, 0)}</p>
        </div>

        <div class="result-card">
          <h3>Surface Area</h3>
          <p>${formatNumber(surfaceArea)} sq ft</p>
        </div>

        <div class="result-card">
          <h3>Area per Tile</h3>
          <p>${formatNumber(tileArea, 4)} sq ft</p>
        </div>

        <div class="result-card">
          <h3>Tiles Before Waste</h3>
          <p>${formatNumber(Math.ceil(baseTiles), 0)}</p>
        </div>

        <div class="result-card">
          <h3>Waste Allowance</h3>
          <p>${formatNumber(wastePercent)}%</p>
        </div>

        <div class="result-card">
          <h3>Purchased Coverage</h3>
          <p>${formatNumber(purchasedCoverage)} sq ft</p>
        </div>

      </div>

      <div class="content-card" style="margin-top: 1.5rem;">

        <h3>Calculation Summary</h3>

        <p>
          <strong>Surface Area:</strong>
          ${formatNumber(surfaceLength)}
          × ${formatNumber(surfaceWidth)}
          = ${formatNumber(surfaceArea)} sq ft
        </p>

        <p>
          <strong>Tile Dimensions:</strong>
          ${formatNumber(tileLengthInches)}
          × ${formatNumber(tileWidthInches)}
          inches
          =
          ${formatNumber(tileLengthFeet, 4)}
          ×
          ${formatNumber(tileWidthFeet, 4)}
          feet
        </p>

        <p>
          <strong>Area per Tile:</strong>
          ${formatNumber(tileLengthFeet, 4)}
          ×
          ${formatNumber(tileWidthFeet, 4)}
          =
          ${formatNumber(tileArea, 4)} sq ft
        </p>

        <p>
          <strong>Tiles Before Waste:</strong>
          ${formatNumber(surfaceArea)}
          ÷
          ${formatNumber(tileArea, 4)}
          =
          ${formatNumber(baseTiles, 2)}
        </p>

        <p>
          <strong>With ${formatNumber(wastePercent)}% Waste:</strong>
          ${formatNumber(baseTiles, 2)}
          ×
          ${formatNumber(wasteFactor, 2)}
          =
          ${formatNumber(tilesWithWaste, 2)}
        </p>

        <p>
          <strong>Tiles to Purchase:</strong>
          ${formatNumber(tilesNeeded, 0)}
          whole tiles
        </p>

        ${tilesPerBoxText}

      </div>

      <div class="info-box" style="margin-top: 1.5rem;">

        <p>
          <strong>Waste added:</strong>
          Approximately ${formatNumber(additionalTiles, 0)}
          additional whole tiles are included beyond the
          theoretical requirement.
        </p>

        <p class="small-text">
          The estimate does not separately account for grout joint
          width or unusual installation patterns. Actual tile
          requirements can vary based on cuts, layout, damaged tiles,
          and the shape of the installation area.
        </p>

      </div>
    `;

    resultBox.hidden = false;

    setTimeout(() => {
      resultBox.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);
  }

  function resetCalculator() {
    lengthInput.value = "";
    widthInput.value = "";

    tileLengthInput.value = "";
    tileWidthInput.value = "";

    wasteInput.value = "10";
    boxQuantityInput.value = "";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    lengthInput.focus();
  }

  calculateButton.addEventListener("click", calculateTiles);

  resetButton.addEventListener("click", resetCalculator);

  [
    lengthInput,
    widthInput,
    tileLengthInput,
    tileWidthInput,
    wasteInput,
    boxQuantityInput
  ].forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        calculateTiles();
      }
    });
  });
});