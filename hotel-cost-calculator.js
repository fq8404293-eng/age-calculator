document.addEventListener("DOMContentLoaded", function () {
  const nightlyRateInput = document.getElementById(
    "hotel-nightly-rate"
  );

  const nightsInput = document.getElementById(
    "hotel-nights"
  );

  const roomsInput = document.getElementById(
    "hotel-rooms"
  );

  const taxInput = document.getElementById(
    "hotel-tax"
  );

  const feesInput = document.getElementById(
    "hotel-fees"
  );

  const currencyInput = document.getElementById(
    "hotel-currency"
  );

  const customCurrencyGroup = document.getElementById(
    "hotel-custom-currency-group"
  );

  const customCurrencyInput = document.getElementById(
    "hotel-custom-currency"
  );

  const calculateButton = document.getElementById(
    "hotel-calculate"
  );

  const resetButton = document.getElementById(
    "hotel-reset"
  );

  const errorBox = document.getElementById(
    "hotel-error"
  );

  const resultBox = document.getElementById(
    "hotel-result"
  );

  const resultContent = document.getElementById(
    "hotel-result-content"
  );

  const summaryRoom = document.getElementById(
    "hotel-summary-room"
  );

  const summaryTax = document.getElementById(
    "hotel-summary-tax"
  );

  const summaryFees = document.getElementById(
    "hotel-summary-fees"
  );

  const summaryTotal = document.getElementById(
    "hotel-summary-total"
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
    Format regular numbers.
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


  function calculateHotelCost() {
    clearError();


    /*
      Read input values.
    */

    const nightlyRateValue =
      nightlyRateInput.value.trim();

    const nightsValue =
      nightsInput.value.trim();

    const roomsValue =
      roomsInput.value.trim();

    const taxValue =
      taxInput.value.trim();

    const feesValue =
      feesInput.value.trim();


    const nightlyRate =
      Number(nightlyRateValue);

    const nights =
      Number(nightsValue);

    const rooms =
      Number(roomsValue);

    const taxRate =
      taxValue === "" ? 0 : Number(taxValue);

    const additionalFees =
      feesValue === "" ? 0 : Number(feesValue);


    /*
      Validate nightly rate.
    */

    if (nightlyRateValue === "") {
      showError("Please enter the nightly room rate.");
      nightlyRateInput.focus();
      return;
    }

    if (!Number.isFinite(nightlyRate) || nightlyRate < 0) {
      showError(
        "Nightly room rate must be a valid amount of 0 or greater."
      );
      nightlyRateInput.focus();
      return;
    }


    /*
      Validate nights.
    */

    if (nightsValue === "") {
      showError("Please enter the number of nights.");
      nightsInput.focus();
      return;
    }

    if (!Number.isFinite(nights) || nights < 1) {
      showError("Number of nights must be at least 1.");
      nightsInput.focus();
      return;
    }

    if (!Number.isInteger(nights)) {
      showError("Number of nights must be a whole number.");
      nightsInput.focus();
      return;
    }


    /*
      Validate rooms.
    */

    if (roomsValue === "") {
      showError("Please enter the number of rooms.");
      roomsInput.focus();
      return;
    }

    if (!Number.isFinite(rooms) || rooms < 1) {
      showError("Number of rooms must be at least 1.");
      roomsInput.focus();
      return;
    }

    if (!Number.isInteger(rooms)) {
      showError("Number of rooms must be a whole number.");
      roomsInput.focus();
      return;
    }


    /*
      Validate tax.
    */

    if (
      !Number.isFinite(taxRate) ||
      taxRate < 0 ||
      taxRate > 100
    ) {
      showError(
        "Hotel tax must be between 0% and 100%."
      );
      taxInput.focus();
      return;
    }


    /*
      Validate additional fees.
    */

    if (
      !Number.isFinite(additionalFees) ||
      additionalFees < 0
    ) {
      showError(
        "Additional fees must be a valid amount of 0 or greater."
      );
      feesInput.focus();
      return;
    }


    /*
      Validate currency.
    */

    const currencySymbol =
      getCurrencySymbol();

    if (
      currencyInput.value === "custom" &&
      currencySymbol === ""
    ) {
      showError(
        "Please enter a custom currency symbol."
      );
      customCurrencyInput.focus();
      return;
    }


    /*
      Calculate room cost.

      Nightly rate × nights × rooms
    */

    const roomCost =
      nightlyRate *
      nights *
      rooms;


    /*
      Calculate hotel tax.

      Room cost × tax percentage
    */

    const hotelTax =
      roomCost *
      (taxRate / 100);


    /*
      Calculate additional fees.

      Fee per night × nights × rooms
    */

    const totalAdditionalFees =
      additionalFees *
      nights *
      rooms;


    /*
      Calculate total hotel cost.
    */

    const totalCost =
      roomCost +
      hotelTax +
      totalAdditionalFees;


    /*
      Additional useful calculations.
    */

    const averageCostPerNight =
      totalCost / nights;

    const averageCostPerRoomNight =
      totalCost / (nights * rooms);


    /*
      Display results.
    */

    resultContent.innerHTML = `

      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Room Cost</h3>
          <p>${formatMoney(roomCost, currencySymbol)}</p>
        </div>

        <div class="result-card">
          <h3>Hotel Tax</h3>
          <p>${formatMoney(hotelTax, currencySymbol)}</p>
        </div>

        <div class="result-card">
          <h3>Additional Fees</h3>
          <p>${formatMoney(totalAdditionalFees, currencySymbol)}</p>
        </div>

        <div class="result-card">
          <h3>Total Hotel Cost</h3>
          <p>${formatMoney(totalCost, currencySymbol)}</p>
        </div>

      </div>


      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>Average Cost Per Night</h3>
          <p>${formatMoney(averageCostPerNight, currencySymbol)}</p>
        </div>

        <div class="result-card">
          <h3>Cost Per Room-Night</h3>
          <p>${formatMoney(averageCostPerRoomNight, currencySymbol)}</p>
        </div>

        <div class="result-card">
          <h3>Nights</h3>
          <p>${formatNumber(nights, 0)}</p>
        </div>

        <div class="result-card">
          <h3>Rooms</h3>
          <p>${formatNumber(rooms, 0)}</p>
        </div>

      </div>


      <div class="table-wrapper">

        <table class="amortization-table">

          <thead>

            <tr>
              <th>Cost</th>
              <th>Estimated Amount</th>
            </tr>

          </thead>

          <tbody>

            <tr>
              <td>Room Cost</td>
              <td>${formatMoney(roomCost, currencySymbol)}</td>
            </tr>

            <tr>
              <td>Hotel Tax</td>
              <td>${formatMoney(hotelTax, currencySymbol)}</td>
            </tr>

            <tr>
              <td>Additional Fees</td>
              <td>${formatMoney(totalAdditionalFees, currencySymbol)}</td>
            </tr>

            <tr>
              <th>Total Hotel Cost</th>
              <th>${formatMoney(totalCost, currencySymbol)}</th>
            </tr>

          </tbody>

        </table>

      </div>


      <div class="info-box">

        <p>
          <strong>
            ${formatNumber(nights, 0)} nights
          </strong>
          ×
          <strong>
            ${formatNumber(rooms, 0)} rooms
          </strong>
        </p>

        <p>
          The room cost is calculated from the nightly room rate,
          number of nights, and number of rooms.
        </p>

        <p>
          Hotel tax is applied to the room cost, while additional
          fees are calculated per room per night.
        </p>

        <p>
          This is an estimate based on the values entered.
          Actual hotel charges may differ.
        </p>

      </div>

    `;


    /*
      Update summary.
    */

    summaryRoom.textContent =
      formatMoney(roomCost, currencySymbol);

    summaryTax.textContent =
      formatMoney(hotelTax, currencySymbol);

    summaryFees.textContent =
      formatMoney(totalAdditionalFees, currencySymbol);

    summaryTotal.textContent =
      formatMoney(totalCost, currencySymbol);


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
    nightlyRateInput.value = "";
    nightsInput.value = "";
    roomsInput.value = "";
    taxInput.value = "";
    feesInput.value = "";

    currencyInput.value = "$";

    customCurrencyGroup.hidden = true;
    customCurrencyInput.value = "";

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    summaryRoom.textContent = "—";
    summaryTax.textContent = "—";
    summaryFees.textContent = "—";
    summaryTotal.textContent = "—";

    nightlyRateInput.focus();
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
    calculateHotelCost
  );

  resetButton.addEventListener(
    "click",
    resetCalculator
  );


  /*
    Allow Enter to calculate.
  */

  const calculatorInputs = [
    nightlyRateInput,
    nightsInput,
    roomsInput,
    taxInput,
    feesInput,
    currencyInput,
    customCurrencyInput
  ];


  calculatorInputs.forEach(function (input) {
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        calculateHotelCost();
      }
    });
  });


  /*
    Initialize currency field.
  */

  updateCustomCurrencyField();

});