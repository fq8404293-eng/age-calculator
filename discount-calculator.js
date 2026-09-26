document.addEventListener("DOMContentLoaded", () => {

    const originalPriceInput = document.getElementById(
        "discount-original-price"
    );

    const discountPercentageInput = document.getElementById(
        "discount-percentage"
    );

    const secondDiscountInput = document.getElementById(
        "discount-second"
    );

    const calculateButton = document.getElementById(
        "calculate-discount"
    );

    const resetButton = document.getElementById(
        "reset-discount"
    );

    const errorMessage = document.getElementById(
        "discount-error"
    );

    const resultSection = document.getElementById(
        "discount-result"
    );

    const resultContent = document.getElementById(
        "discount-result-content"
    );


    /* ==========================================================
       FORMAT CURRENCY
    ========================================================== */

    function formatMoney(value) {

        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
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
       CALCULATE DISCOUNT
    ========================================================== */

    function calculateDiscount() {

        clearError();

        const originalPrice = Number(
            originalPriceInput.value
        );

        const discountPercentage = Number(
            discountPercentageInput.value
        );

        const secondDiscountValue =
            secondDiscountInput.value.trim();

        const secondDiscount =
            secondDiscountValue === ""
                ? 0
                : Number(secondDiscountValue);


        /* ------------------------------------------------------
           VALIDATE ORIGINAL PRICE
        ------------------------------------------------------ */

        if (
            originalPriceInput.value === "" ||
            !Number.isFinite(originalPrice) ||
            originalPrice <= 0
        ) {

            showError(
                "Please enter an original price greater than 0."
            );

            return;

        }


        /* ------------------------------------------------------
           VALIDATE FIRST DISCOUNT
        ------------------------------------------------------ */

        if (
            discountPercentageInput.value === "" ||
            !Number.isFinite(discountPercentage) ||
            discountPercentage < 0 ||
            discountPercentage > 100
        ) {

            showError(
                "Please enter a discount percentage between 0% and 100%."
            );

            return;

        }


        /* ------------------------------------------------------
           VALIDATE SECOND DISCOUNT
        ------------------------------------------------------ */

        if (
            secondDiscountValue !== "" &&
            (
                !Number.isFinite(secondDiscount) ||
                secondDiscount < 0 ||
                secondDiscount > 100
            )
        ) {

            showError(
                "Please enter an additional discount between 0% and 100%."
            );

            return;

        }


        /* ------------------------------------------------------
           FIRST DISCOUNT
        ------------------------------------------------------ */

        const firstDiscountAmount =
            originalPrice *
            (discountPercentage / 100);

        const priceAfterFirstDiscount =
            originalPrice -
            firstDiscountAmount;


        /* ------------------------------------------------------
           SECOND DISCOUNT
        ------------------------------------------------------ */

        let secondDiscountAmount = 0;
        let finalPrice = priceAfterFirstDiscount;

        if (secondDiscountValue !== "") {

            secondDiscountAmount =
                priceAfterFirstDiscount *
                (secondDiscount / 100);

            finalPrice =
                priceAfterFirstDiscount -
                secondDiscountAmount;

        }


        /* ------------------------------------------------------
           TOTAL SAVINGS
        ------------------------------------------------------ */

        const totalSavings =
            originalPrice - finalPrice;

        const effectiveDiscount =
            (totalSavings / originalPrice) * 100;


        /* ------------------------------------------------------
           DISPLAY RESULT
        ------------------------------------------------------ */

        if (secondDiscountValue === "") {

            resultContent.innerHTML = `

                <div class="calculator-results-grid">

                    <div class="result-card">

                        <h3>Final Price</h3>

                        <p>
                            <strong>
                                ${formatMoney(finalPrice)}
                            </strong>
                        </p>

                    </div>

                    <div class="result-card">

                        <h3>You Save</h3>

                        <p>
                            <strong>
                                ${formatMoney(totalSavings)}
                            </strong>
                        </p>

                    </div>

                    <div class="result-card">

                        <h3>Discount Amount</h3>

                        <p>
                            ${formatMoney(firstDiscountAmount)}
                        </p>

                    </div>

                    <div class="result-card">

                        <h3>Discount</h3>

                        <p>
                            ${discountPercentage}%
                        </p>

                    </div>

                </div>

                <div class="info-box">

                    <strong>Discount Calculation</strong>

                    <br><br>

                    Original Price:
                    ${formatMoney(originalPrice)}

                    <br><br>

                    Discount:
                    ${discountPercentage}%

                    <br><br>

                    Savings:
                    ${formatMoney(firstDiscountAmount)}

                    <br><br>

                    Final Price:
                    <strong>
                        ${formatMoney(finalPrice)}
                    </strong>

                </div>

            `;

        } else {

            resultContent.innerHTML = `

                <div class="calculator-results-grid">

                    <div class="result-card">

                        <h3>Final Price</h3>

                        <p>
                            <strong>
                                ${formatMoney(finalPrice)}
                            </strong>
                        </p>

                    </div>

                    <div class="result-card">

                        <h3>Total Savings</h3>

                        <p>
                            <strong>
                                ${formatMoney(totalSavings)}
                            </strong>
                        </p>

                    </div>

                    <div class="result-card">

                        <h3>Effective Discount</h3>

                        <p>
                            ${effectiveDiscount.toFixed(2)}%
                        </p>

                    </div>

                    <div class="result-card">

                        <h3>First Discount</h3>

                        <p>
                            ${formatMoney(firstDiscountAmount)}
                        </p>

                    </div>

                    <div class="result-card">

                        <h3>Second Discount</h3>

                        <p>
                            ${formatMoney(secondDiscountAmount)}
                        </p>

                    </div>

                    <div class="result-card">

                        <h3>Original Price</h3>

                        <p>
                            ${formatMoney(originalPrice)}
                        </p>

                    </div>

                </div>

                <div class="info-box">

                    <strong>Successive Discount Calculation</strong>

                    <br><br>

                    Original Price:
                    ${formatMoney(originalPrice)}

                    <br><br>

                    After ${discountPercentage}% discount:
                    ${formatMoney(priceAfterFirstDiscount)}

                    <br><br>

                    After additional ${secondDiscount}% discount:
                    <strong>
                        ${formatMoney(finalPrice)}
                    </strong>

                    <br><br>

                    Total Savings:
                    <strong>
                        ${formatMoney(totalSavings)}
                    </strong>

                    <br><br>

                    Effective Discount:
                    <strong>
                        ${effectiveDiscount.toFixed(2)}%
                    </strong>

                </div>

            `;

        }


        /* ------------------------------------------------------
           SHOW RESULT
        ------------------------------------------------------ */

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

        originalPriceInput.value = "";
        discountPercentageInput.value = "";
        secondDiscountInput.value = "";

        clearError();

        resultContent.innerHTML = "";
        resultSection.hidden = true;

        originalPriceInput.focus();

    }


    /* ==========================================================
       BUTTON EVENTS
    ========================================================== */

    calculateButton.addEventListener(
        "click",
        calculateDiscount
    );

    resetButton.addEventListener(
        "click",
        resetCalculator
    );


    /* ==========================================================
       ENTER KEY
    ========================================================== */

    [
        originalPriceInput,
        discountPercentageInput,
        secondDiscountInput
    ].forEach(input => {

        input.addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    calculateDiscount();

                }

            }
        );

    });

});