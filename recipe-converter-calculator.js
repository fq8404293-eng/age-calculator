document.addEventListener("DOMContentLoaded", () => {
  const originalServings = document.getElementById("original-servings");
  const desiredServings = document.getElementById("desired-servings");

  const calculateButton = document.getElementById("calculate-recipe");
  const clearButton = document.getElementById("clear-recipe");

  const errorBox = document.getElementById("recipe-error");
  const resultBox = document.getElementById("recipe-result");
  const resultContent = document.getElementById("recipe-result-content");

  const summaryOriginalServings =
    document.getElementById("summary-original-servings");

  const summaryDesiredServings =
    document.getElementById("summary-desired-servings");

  const summaryScalingFactor =
    document.getElementById("summary-scaling-factor");

  const summaryIngredients =
    document.getElementById("summary-ingredients");


  /* ---------------------------------------
     Helpers
  --------------------------------------- */

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


  function formatNumber(value) {
    if (!Number.isFinite(value)) {
      return "0";
    }

    if (Number.isInteger(value)) {
      return value.toLocaleString("en-US");
    }

    return value.toLocaleString("en-US", {
      maximumFractionDigits: 4
    });
  }


  /* ---------------------------------------
     Read ingredients
  --------------------------------------- */

  function getIngredients() {
    const ingredients = [];

    for (let i = 1; i <= 5; i++) {

      const nameInput =
        document.getElementById(`ingredient-${i}`);

      const quantityInput =
        document.getElementById(`quantity-${i}`);

      const unitInput =
        document.getElementById(`unit-${i}`);


      const name = nameInput.value.trim();
      const quantityText = quantityInput.value.trim();
      const unit = unitInput.value.trim();


      /*
       * Completely empty ingredient row
       */
      if (
        name === "" &&
        quantityText === "" &&
        unit === ""
      ) {
        continue;
      }


      /*
       * If anything is entered, all important
       * fields must be completed.
       */
      if (name === "") {
        throw new Error(
          `Please enter the name for Ingredient ${i}.`
        );
      }


      if (quantityText === "") {
        throw new Error(
          `Please enter the quantity for ${name}.`
        );
      }


      const quantity = Number(quantityText);


      if (
        !Number.isFinite(quantity) ||
        quantity < 0
      ) {
        throw new Error(
          `Please enter a valid quantity for ${name}.`
        );
      }


      if (unit === "") {
        throw new Error(
          `Please enter the unit for ${name}.`
        );
      }


      ingredients.push({
        name,
        quantity,
        unit
      });
    }


    return ingredients;
  }


  /* ---------------------------------------
     Convert recipe
  --------------------------------------- */

  function convertRecipe() {

    clearError();


    const original = Number(
      originalServings.value
    );

    const desired = Number(
      desiredServings.value
    );


    /*
     * Validate servings
     */
    if (
      !Number.isFinite(original) ||
      original <= 0
    ) {
      showError(
        "Please enter a valid original serving size greater than 0."
      );
      return;
    }


    if (
      !Number.isFinite(desired) ||
      desired <= 0
    ) {
      showError(
        "Please enter a valid desired serving size greater than 0."
      );
      return;
    }


    /*
     * Read ingredients
     */
    let ingredients;

    try {

      ingredients = getIngredients();

    } catch (error) {

      showError(error.message);
      return;

    }


    /*
     * Require at least one ingredient
     */
    if (ingredients.length === 0) {

      showError(
        "Please enter at least one ingredient."
      );

      return;
    }


    /*
     * Scaling factor
     */
    const scalingFactor =
      desired / original;


    /*
     * Convert ingredient quantities
     */
    const convertedIngredients =
      ingredients.map((ingredient) => {

        const convertedQuantity =
          ingredient.quantity * scalingFactor;

        return {
          ...ingredient,
          convertedQuantity
        };

      });


    /*
     * Build result
     */
    let resultHTML = `
      <p>
        This recipe has been scaled from
        <strong>${formatNumber(original)}</strong>
        servings to
        <strong>${formatNumber(desired)}</strong>
        servings.
      </p>

      <p>
        Scaling factor:
        <strong>${formatNumber(scalingFactor)}×</strong>
      </p>

      <div class="table-wrapper">

        <table class="amortization-table">

          <thead>
            <tr>
              <th scope="col">Ingredient</th>
              <th scope="col">Original</th>
              <th scope="col">Converted</th>
            </tr>
          </thead>

          <tbody>
    `;


    convertedIngredients.forEach((ingredient) => {

      resultHTML += `
        <tr>

          <td>
            ${escapeHTML(ingredient.name)}
          </td>

          <td>
            ${formatNumber(ingredient.quantity)}
            ${escapeHTML(ingredient.unit)}
          </td>

          <td>
            <strong>
              ${formatNumber(ingredient.convertedQuantity)}
              ${escapeHTML(ingredient.unit)}
            </strong>
          </td>

        </tr>
      `;

    });


    resultHTML += `
          </tbody>

        </table>

      </div>

      <p class="small-text">
        The calculator scales each ingredient quantity
        proportionally. Measurement units are kept the
        same as the original recipe.
      </p>
    `;


    /*
     * Display result
     */
    resultContent.innerHTML = resultHTML;

    resultBox.hidden = false;


    /*
     * Summary
     */
    summaryOriginalServings.textContent =
      formatNumber(original);


    summaryDesiredServings.textContent =
      formatNumber(desired);


    summaryScalingFactor.textContent =
      `${formatNumber(scalingFactor)}×`;


    summaryIngredients.textContent =
      formatNumber(convertedIngredients.length);


    /*
     * Scroll to result
     */
    setTimeout(() => {

      resultBox.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }, 100);
  }


  /* ---------------------------------------
     HTML escaping
  --------------------------------------- */

  function escapeHTML(value) {

    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  /* ---------------------------------------
     Clear calculator
  --------------------------------------- */

  function clearCalculator() {

    originalServings.value = "4";
    desiredServings.value = "8";


    for (let i = 1; i <= 5; i++) {

      document.getElementById(
        `ingredient-${i}`
      ).value = "";

      document.getElementById(
        `quantity-${i}`
      ).value = "";

      document.getElementById(
        `unit-${i}`
      ).value = "";
    }


    clearError();


    resultBox.hidden = true;

    resultContent.innerHTML = "";


    summaryOriginalServings.textContent = "—";
    summaryDesiredServings.textContent = "—";
    summaryScalingFactor.textContent = "—";
    summaryIngredients.textContent = "—";
  }


  /* ---------------------------------------
     Button events
  --------------------------------------- */

  calculateButton.addEventListener(
    "click",
    convertRecipe
  );


  clearButton.addEventListener(
    "click",
    clearCalculator
  );


  /* ---------------------------------------
     Enter key support
  --------------------------------------- */

  const allInputs =
    document.querySelectorAll(
      "#original-servings, #desired-servings, " +
      "#ingredient-1, #quantity-1, #unit-1, " +
      "#ingredient-2, #quantity-2, #unit-2, " +
      "#ingredient-3, #quantity-3, #unit-3, " +
      "#ingredient-4, #quantity-4, #unit-4, " +
      "#ingredient-5, #quantity-5, #unit-5"
    );


  allInputs.forEach((input) => {

    input.addEventListener(
      "keydown",
      (event) => {

        if (event.key === "Enter") {

          event.preventDefault();

          convertRecipe();

        }

      }
    );

  });

});