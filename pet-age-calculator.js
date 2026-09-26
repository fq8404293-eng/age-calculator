document.addEventListener("DOMContentLoaded", () => {
  const petTypeInput = document.getElementById("pet-type");
  const petAgeInput = document.getElementById("pet-age");

  const calculateButton = document.getElementById("calculate-pet-age");
  const clearButton = document.getElementById("clear-pet-age");

  const errorBox = document.getElementById("pet-age-error");
  const resultBox = document.getElementById("pet-age-result");
  const resultContent = document.getElementById("pet-age-result-content");

  const summaryPetType = document.getElementById("summary-pet-type");
  const summaryPetAge = document.getElementById("summary-pet-age");
  const summaryHumanAge = document.getElementById("summary-human-age");


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

  function formatNumber(value, decimals = 1) {
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }


  /* ---------------------------------------
     Pet type names
  --------------------------------------- */

  const petNames = {
    dog: "Dog",
    cat: "Cat"
  };


  /* ---------------------------------------
     Human-equivalent age calculation
  --------------------------------------- */

  function calculateHumanAge(petType, petAge) {

    /*
     * First year:
     * approximately 15 human years
     */
    if (petAge <= 1) {
      return petAge * 15;
    }


    /*
     * Second year:
     * approximately 9 additional human years
     */
    if (petAge <= 2) {
      return 15 + ((petAge - 1) * 9);
    }


    /*
     * Additional years:
     * Dogs: approximately 5 human years
     * Cats: approximately 4 human years
     */
    const additionalRate =
      petType === "dog" ? 5 : 4;

    return 24 + ((petAge - 2) * additionalRate);
  }


  /* ---------------------------------------
     Calculate pet age
  --------------------------------------- */

  function calculatePetAge() {

    clearError();

    const petType =
      petTypeInput.value;

    const petAge =
      Number(petAgeInput.value);


    /*
     * Validate pet type
     */
    if (!petNames[petType]) {

      showError(
        "Please select a valid pet type."
      );

      return;
    }


    /*
     * Validate pet age
     */
    if (
      !Number.isFinite(petAge) ||
      petAge < 0 ||
      petAge > 30
    ) {

      showError(
        "Please enter a pet age between 0 and 30 years."
      );

      return;
    }


    /*
     * Calculate human-equivalent age
     */
    const humanAge =
      calculateHumanAge(
        petType,
        petAge
      );


    const petName =
      petNames[petType];


    const formattedPetAge =
      formatNumber(petAge, 1);

    const formattedHumanAge =
      formatNumber(humanAge, 1);


    /* ---------------------------------------
       Main result
    --------------------------------------- */

    resultContent.innerHTML = `

      <div class="calculator-results-grid">

        <div class="result-card">

          <h3>Pet Type</h3>

          <p>
            ${petName}
          </p>

        </div>


        <div class="result-card">

          <h3>Pet Age</h3>

          <p>
            ${formattedPetAge} years
          </p>

        </div>


        <div class="result-card">

          <h3>Human-Equivalent Age</h3>

          <p>
            ${formattedHumanAge} years
          </p>

        </div>

      </div>


      <p>
        A
        <strong>${formattedPetAge}-year-old ${petName.toLowerCase()}</strong>
        has an approximate human-equivalent age of
        <strong>${formattedHumanAge} years</strong>.
      </p>


      <p class="small-text">
        This is an approximate age comparison. Actual aging varies between
        individual pets and can be influenced by breed, size, genetics,
        lifestyle, and health.
      </p>

    `;


    /*
     * Show result
     */
    resultBox.hidden = false;


    /* ---------------------------------------
       Summary
    --------------------------------------- */

    summaryPetType.textContent =
      petName;

    summaryPetAge.textContent =
      `${formattedPetAge} years`;

    summaryHumanAge.textContent =
      `${formattedHumanAge} years`;


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

    petTypeInput.value = "dog";

    petAgeInput.value = "5";

    resultContent.innerHTML = "";

    resultBox.hidden = true;


    summaryPetType.textContent =
      "—";

    summaryPetAge.textContent =
      "—";

    summaryHumanAge.textContent =
      "—";

  }


  /* ---------------------------------------
     Button events
  --------------------------------------- */

  calculateButton.addEventListener(
    "click",
    calculatePetAge
  );


  clearButton.addEventListener(
    "click",
    clearCalculator
  );


  /* ---------------------------------------
     Enter key
  --------------------------------------- */

  [
    petTypeInput,
    petAgeInput
  ].forEach((input) => {

    input.addEventListener(
      "keydown",
      (event) => {

        if (event.key === "Enter") {

          event.preventDefault();

          calculatePetAge();

        }

      }
    );

  });


  /* ---------------------------------------
     Clear errors when inputs change
  --------------------------------------- */

  petTypeInput.addEventListener(
    "change",
    clearError
  );

  petAgeInput.addEventListener(
    "input",
    clearError
  );

});