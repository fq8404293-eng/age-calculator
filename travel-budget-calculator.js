document.addEventListener("DOMContentLoaded", function () {
  const daysInput = document.getElementById("travel-days");
  const travelersInput = document.getElementById("travel-travelers");

  const currencyInput = document.getElementById("travel-currency");
  const customCurrencyGroup = document.getElementById(
    "travel-custom-currency-group"
  );
  const customCurrencyInput = document.getElementById(
    "travel-custom-currency"
  );

  const accommodationInput = document.getElementById(
    "travel-accommodation"
  );
  const foodInput = document.getElementById("travel-food");
  const transportationInput = document.getElementById(
    "travel-transportation"
  );
  const activitiesInput = document.getElementById("travel-activities");
  const otherInput = document.getElementById("travel-other");

  const calculateButton = document.getElementById("travel-calculate");
  const resetButton = document.getElementById("travel-reset");

  const errorBox = document.getElementById("travel-error");

  const resultBox = document.getElementById("travel-result");
  const resultContent = document.getElementById("travel-result-content");

  const summaryTotal = document.getElementById("travel-summary-total");
  const summaryDaily = document.getElementById("travel-summary-daily");
  const summaryPerson = document.getElementById("travel-summary-person");
  const summaryTravelers = document.getElementById(
    "travel-summary-travelers"
  );


  /*
    Show or hide the custom currency field.
  */

  function updateCustomCurrencyField() {
    if (currencyInput.value === "custom") {
      customCurrencyGroup.hidden = false;
    } else {
      customCurrencyGroup.hidden = true;
      customCurrencyInput.value = "";
    }
  }


  /*
    Get the selected currency symbol.
  */

  function getCurrencySymbol() {
    if (currencyInput.value === "custom") {
      return customCurrencyInput.value.trim();
    }

    return currencyInput.value;
  }


  /*
    Format monetary values.
  */

  function formatMoney(value, symbol) {
    return `${symbol}${value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }


  /*
    Format normal numbers.
  */

  function formatNumber(value, decimals = 2) {
    return value.toLocaleString("en-US", {
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


  /*
    Read an expense field.

    Empty expense fields are treated as zero.
  */

  function getExpenseValue(input) {
    const value = input.value.trim();

    if (value === "") {
      return 0;
    }

    return Number(value);
  }


  function calculateTravelBudget() {
    clearError();


    /*
      Read main trip inputs.
    */

    const daysValue = daysInput.value.trim();
    const travelersValue = travelersInput.value.trim();

    const days = Number(daysValue);
    const travelers = Number(travelersValue);


    /*
      Validate trip length.
    */

    if (daysValue === "") {
      showError("Please enter the number of trip days.");
      daysInput.focus();
      return;
    }

    if (!Number.isFinite(days) || days < 1) {
      showError("Trip length must be at least 1 day.");
      daysInput.focus();
      return;
    }

    if (!Number.isInteger(days)) {
      showError("Trip length must be a whole number of days.");
      daysInput.focus();
      return;
    }


    /*
      Validate travelers.
    */

    if (travelersValue === "") {
      showError("Please enter the number of travelers.");
      travelersInput.focus();
      return;
    }

    if (!Number.isFinite(travelers) || travelers < 1) {
      showError("Number of travelers must be at least 1.");
      travelersInput.focus();
      return;
    }

    if (!Number.isInteger(travelers)) {
      showError("Number of travelers must be a whole number.");
      travelersInput.focus();
      return;
    }


    /*
      Validate currency.
    */

    const currencySymbol = getCurrencySymbol();

    if (currencyInput.value === "custom" && currencySymbol === "") {
      showError("Please enter a custom currency symbol.");
      customCurrencyInput.focus();
      return;
    }


    /*
      Read expense values.
    */

    const accommodation = getExpenseValue(accommodationInput);
    const food = getExpenseValue(foodInput);
    const transportation = getExpenseValue(
      transportationInput
    );
    const activities = getExpenseValue(activitiesInput);
    const other = getExpenseValue(otherInput);


    /*
      Validate expense values.
    */

    const expenses = [
      {
        value: accommodation,
        input: accommodationInput,
        name: "Accommodation"
      },
      {
        value: food,
        input: foodInput,
        name: "Food"
      },
      {
        value: transportation,
        input: transportationInput,
        name: "Transportation"
      },
      {
        value: activities,
        input: activitiesInput,
        name: "Activities"
      },
      {
        value: other,
        input: otherInput,
        name: "Other expenses"
      }
    ];


    for (const expense of expenses) {
      if (!Number.isFinite(expense.value) || expense.value < 0) {
        showError(
          `${expense.name} must be a valid amount of 0 or greater.`
        );

        expense.input.focus();
        return;
      }
    }


    /*
      Accommodation is entered as a trip-level
      daily expense.

      Food, transportation, activities, and other
      expenses are entered per person per day.
    */

    const personalDailyExpenses =
      food +
      transportation +
      activities +
      other;

    const personalDailyCost =
      personalDailyExpenses * travelers;

    const totalDailyCost =
      accommodation +
      personalDailyCost;

    const totalTripCost =
      totalDailyCost * days;

    const costPerTraveler =
      totalTripCost / travelers;

    const personalDailyPerTraveler =
      personalDailyExpenses;

    const accommodationTotal =
      accommodation * days;

    const foodTotal =
      food * travelers * days;

    const transportationTotal =
      transportation * travelers * days;

    const activitiesTotal =
      activities * travelers * days;

    const otherTotal =
      other * travelers * days;


    /*
      Display detailed results.
    */

    resultContent.innerHTML = `

      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Total Trip Cost</h3>
          <p>${formatMoney(totalTripCost, currencySymbol)}</p>
        </div>

        <div class="result-card">
          <h3>Cost Per Day</h3>
          <p>${formatMoney(totalDailyCost, currencySymbol)}</p>
        </div>

        <div class="result-card">
          <h3>Cost Per Traveler</h3>
          <p>${formatMoney(costPerTraveler, currencySymbol)}</p>
        </div>

        <div class="result-card">
          <h3>Daily Cost Per Traveler</h3>
          <p>${formatMoney(personalDailyPerTraveler, currencySymbol)}</p>
        </div>

      </div>


      <div class="table-wrapper">

        <table class="amortization-table">

          <thead>

            <tr>
              <th>Expense</th>
              <th>Estimated Trip Cost</th>
            </tr>

          </thead>

          <tbody>

            <tr>
              <td>Accommodation</td>
              <td>${formatMoney(accommodationTotal, currencySymbol)}</td>
            </tr>

            <tr>
              <td>Food</td>
              <td>${formatMoney(foodTotal, currencySymbol)}</td>
            </tr>

            <tr>
              <td>Transportation</td>
              <td>${formatMoney(transportationTotal, currencySymbol)}</td>
            </tr>

            <tr>
              <td>Activities</td>
              <td>${formatMoney(activitiesTotal, currencySymbol)}</td>
            </tr>

            <tr>
              <td>Other Expenses</td>
              <td>${formatMoney(otherTotal, currencySymbol)}</td>
            </tr>

            <tr>
              <th>Total</th>
              <th>${formatMoney(totalTripCost, currencySymbol)}</th>
            </tr>

          </tbody>

        </table>

      </div>


      <div class="info-box">

        <p>
          <strong>
            ${formatNumber(days, 0)} days
          </strong>
          ×
          <strong>
            ${formatNumber(travelers, 0)} travelers
          </strong>
        </p>

        <p>
          Accommodation is calculated as a daily trip expense.
          Food, transportation, activities, and other expenses are
          calculated per person per day.
        </p>

        <p>
          This result is an estimate based on the expenses you entered.
          Actual travel costs may vary.
        </p>

      </div>

    `;


    /*
      Update summary.
    */

    summaryTotal.textContent =
      formatMoney(totalTripCost, currencySymbol);

    summaryDaily.textContent =
      formatMoney(totalDailyCost, currencySymbol);

    summaryPerson.textContent =
      formatMoney(costPerTraveler, currencySymbol);

    summaryTravelers.textContent =
      formatNumber(travelers, 0);


    resultBox.hidden = false;


    /*
      Smoothly scroll to the results.
    */

    resultBox.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }


  function resetCalculator() {
    daysInput.value = "";
    travelersInput.value = "";

    currencyInput.value = "$";

    customCurrencyGroup.hidden = true;
    customCurrencyInput.value = "";

    accommodationInput.value = "";
    foodInput.value = "";
    transportationInput.value = "";
    activitiesInput.value = "";
    otherInput.value = "";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    summaryTotal.textContent = "—";
    summaryDaily.textContent = "—";
    summaryPerson.textContent = "—";
    summaryTravelers.textContent = "—";

    daysInput.focus();
  }


  /*
    Currency selector.
  */

  currencyInput.addEventListener(
    "change",
    updateCustomCurrencyField
  );


  /*
    Buttons.
  */

  calculateButton.addEventListener(
    "click",
    calculateTravelBudget
  );

  resetButton.addEventListener(
    "click",
    resetCalculator
  );


  /*
    Allow Enter to calculate from any calculator field.
  */

  const calculatorInputs = [
    daysInput,
    travelersInput,
    currencyInput,
    customCurrencyInput,
    accommodationInput,
    foodInput,
    transportationInput,
    activitiesInput,
    otherInput
  ];


  calculatorInputs.forEach(function (input) {
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        calculateTravelBudget();
      }
    });
  });


  /*
    Initialize currency field state.
  */

  updateCustomCurrencyField();

});