document.addEventListener("DOMContentLoaded", () => {

    const nameInput = document.getElementById("unit-price-name");
    const totalPriceInput = document.getElementById("unit-price-total");
    const quantityInput = document.getElementById("unit-price-quantity");
    const unitInput = document.getElementById("unit-price-unit");

    const calculateButton = document.getElementById(
        "calculate-unit-price"
    );

    const resetButton = document.getElementById(
        "reset-unit-price"
    );

    const errorMessage = document.getElementById(
        "unit-price-error"
    );

    const resultSection = document.getElementById(
        "unit-price-result"
    );

    const resultContent = document.getElementById(
        "unit-price-result-content"
    );


    /* ==========================================================
       UNIT INFORMATION
    ========================================================== */

    const unitInfo = {

        item: {
            name: "Item",
            short: "item"
        },

        ounce: {
            name: "Ounce",
            short: "oz"
        },

        pound: {
            name: "Pound",
            short: "lb"
        },

        gram: {
            name: "Gram",
            short: "g"
        },

        kilogram: {
            name: "Kilogram",
            short: "kg"
        },

        milliliter: {
            name: "Milliliter",
            short: "mL"
        },

        liter: {
            name: "Liter",
            short: "L"
        }

    };


    /* ==========================================================
       FORMAT MONEY
    ========================================================== */

    function formatMoney(value) {

        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 4
        }).format(value);

    }


    /* ==========================================================
       FORMAT NUMBER
    ========================================================== */

    function formatNumber(value) {

        return new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 4
        }).format(value);

    }


    /* ==========================================================
       SHOW ERROR
    ========================================================== */

    function showError(message) {

        errorMessage.textContent = message;
        errorMessage.hidden = false;

        resultSection.hidden = true;

    }


    /* ==========================================================
       CLEAR ERROR
    ========================================================== */

    function clearError() {

        errorMessage.textContent = "";
        errorMessage.hidden = true;

    }


    /* ==========================================================
       CALCULATE UNIT PRICE
    ========================================================== */

    function calculateUnitPrice() {

        clearError();

        const productName = nameInput.value.trim();

        const totalPrice = Number(
            totalPriceInput.value
        );

        const quantity = Number(
            quantityInput.value
        );

        const unit = unitInput.value;


        /* ------------------------------------------------------
           VALIDATE TOTAL PRICE
        ------------------------------------------------------ */

        if (
            totalPriceInput.value === "" ||
            !Number.isFinite(totalPrice) ||
            totalPrice <= 0
        ) {

            showError(
                "Please enter a total price greater than 0."
            );

            return;

        }


        /* ------------------------------------------------------
           VALIDATE QUANTITY
        ------------------------------------------------------ */

        if (
            quantityInput.value === "" ||
            !Number.isFinite(quantity) ||
            quantity <= 0
        ) {

            showError(
                "Please enter a quantity greater than 0."
            );

            return;

        }


        /* ------------------------------------------------------
           VALIDATE UNIT
        ------------------------------------------------------ */

        if (!unit || !unitInfo[unit]) {

            showError(
                "Please select a unit."
            );

            return;

        }


        /* ------------------------------------------------------
           CALCULATE
        ------------------------------------------------------ */

        const unitPrice = totalPrice / quantity;


        /* ------------------------------------------------------
           DISPLAY UNIT INFORMATION
        ------------------------------------------------------ */

        const selectedUnit = unitInfo[unit];

        const productLabel =
            productName || "Product";


        /* ------------------------------------------------------
           RESULT
        ------------------------------------------------------ */

        resultContent.innerHTML = `

            <div class="calculator-results-grid">

                <div class="result-card">

                    <h3>Unit Price</h3>

                    <p>
                        <strong>
                            ${formatMoney(unitPrice)}
                        </strong>
                        per ${selectedUnit.short}
                    </p>

                </div>


                <div class="result-card">

                    <h3>Total Price</h3>

                    <p>
                        ${formatMoney(totalPrice)}
                    </p>

                </div>


                <div class="result-card">

                    <h3>Total Quantity</h3>

                    <p>
                        ${formatNumber(quantity)}
                        ${selectedUnit.short}
                    </p>

                </div>


                <div class="result-card">

                    <h3>Product</h3>

                    <p>
                        ${productLabel}
                    </p>

                </div>

            </div>


            <div class="info-box">

                <strong>Unit Price Calculation</strong>

                <br><br>

                ${formatMoney(totalPrice)}
                ÷
                ${formatNumber(quantity)}
                ${selectedUnit.short}

                =
                <strong>
                    ${formatMoney(unitPrice)}
                    per ${selectedUnit.short}
                </strong>

            </div>

        `;


        resultSection.hidden = false;


        /* ------------------------------------------------------
           SCROLL TO RESULT
        ------------------------------------------------------ */

        resultSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    /* ==========================================================
       RESET
    ========================================================== */

    function resetCalculator() {

        nameInput.value = "";
        totalPriceInput.value = "";
        quantityInput.value = "";
        unitInput.value = "";

        clearError();

        resultContent.innerHTML = "";
        resultSection.hidden = true;

        nameInput.focus();

    }


    /* ==========================================================
       BUTTON EVENTS
    ========================================================== */

    calculateButton.addEventListener(
        "click",
        calculateUnitPrice
    );


    resetButton.addEventListener(
        "click",
        resetCalculator
    );


    /* ==========================================================
       ENTER KEY
    ========================================================== */

    [
        nameInput,
        totalPriceInput,
        quantityInput,
        unitInput
    ].forEach(input => {

        input.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    calculateUnitPrice();

                }

            }
        );

    });

});