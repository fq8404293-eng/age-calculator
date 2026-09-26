/* ==========================================================
   CURRENCY CONVERTER
   CalclyWorld
========================================================== */

document.addEventListener("DOMContentLoaded", function () {


    /* ======================================================
       ELEMENTS
    ====================================================== */

    const currencyAmount =
        document.getElementById("currency-amount");

    const currencyFrom =
        document.getElementById("currency-from");

    const currencyTo =
        document.getElementById("currency-to");

    const swapButton =
        document.getElementById("swap-currencies");

    const calculateButton =
        document.getElementById("calculate-currency");

    const resetButton =
        document.getElementById("reset-currency");

    const errorBox =
        document.getElementById("currency-error");

    const resultBox =
        document.getElementById("currency-result");

    const resultContent =
        document.getElementById("currency-result-content");


    /* ======================================================
       SUMMARY ELEMENTS
    ====================================================== */

    const summaryAmount =
        document.getElementById(
            "summary-currency-amount"
        );

    const summaryFrom =
        document.getElementById(
            "summary-currency-from"
        );

    const summaryTo =
        document.getElementById(
            "summary-currency-to"
        );

    const summaryRate =
        document.getElementById(
            "summary-currency-rate"
        );

    const summaryConverted =
        document.getElementById(
            "summary-currency-converted"
        );

    const summaryUpdated =
        document.getElementById(
            "summary-currency-updated"
        );


    /* ======================================================
       API CONFIGURATION
    ====================================================== */

    const API_BASE_URL =
        "https://api.frankfurter.dev/v2";


    /* ======================================================
       CURRENCY INFORMATION
       
       These names provide readable labels for commonly
       used currencies. The API can provide the complete
       supported currency list as well.
    ====================================================== */

    const currencyNames = {

        AED: "UAE Dirham",
        AUD: "Australian Dollar",
        BGN: "Bulgarian Lev",
        BRL: "Brazilian Real",
        CAD: "Canadian Dollar",
        CHF: "Swiss Franc",
        CNY: "Chinese Yuan",
        CZK: "Czech Koruna",
        DKK: "Danish Krone",
        EUR: "Euro",
        GBP: "British Pound",
        HKD: "Hong Kong Dollar",
        HUF: "Hungarian Forint",
        IDR: "Indonesian Rupiah",
        ILS: "Israeli New Shekel",
        INR: "Indian Rupee",
        ISK: "Icelandic Krona",
        JPY: "Japanese Yen",
        KRW: "South Korean Won",
        MXN: "Mexican Peso",
        MYR: "Malaysian Ringgit",
        NOK: "Norwegian Krone",
        NZD: "New Zealand Dollar",
        PHP: "Philippine Peso",
        PLN: "Polish Zloty",
        RON: "Romanian Leu",
        SEK: "Swedish Krona",
        SGD: "Singapore Dollar",
        THB: "Thai Baht",
        TRY: "Turkish Lira",
        USD: "US Dollar",
        ZAR: "South African Rand"

    };


    /* ======================================================
       STATE
    ====================================================== */

    let lastConversion = null;

    let currencyListLoaded = false;


    /* ======================================================
       FORMAT NUMBER
    ====================================================== */

    function formatNumber(value) {

        const numericValue =
            Number(value);


        if (!Number.isFinite(numericValue)) {
            return "0.00";
        }


        return new Intl.NumberFormat(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6
            }
        ).format(numericValue);

    }


    /* ======================================================
       FORMAT CURRENCY
    ====================================================== */

    function formatCurrency(
        value,
        currencyCode
    ) {

        const numericValue =
            Number(value);


        if (!Number.isFinite(numericValue)) {
            return "0.00";
        }


        try {

            return new Intl.NumberFormat(
                undefined,
                {
                    style: "currency",
                    currency: currencyCode,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            ).format(numericValue);

        } catch (error) {

            return (
                formatNumber(numericValue) +
                " " +
                currencyCode
            );

        }

    }


    /* ======================================================
       GET CURRENCY NAME
    ====================================================== */

    function getCurrencyName(code) {

        if (
            currencyNames[code]
        ) {

            return currencyNames[code];

        }


        return code;

    }


    /* ======================================================
       FORMAT CURRENCY OPTION
    ====================================================== */

    function createCurrencyOption(
        code,
        name
    ) {

        const option =
            document.createElement("option");


        option.value =
            code;


        option.textContent =
            code +
            " — " +
            (
                name ||
                getCurrencyName(code)
            );


        return option;

    }


    /* ======================================================
       LOAD SUPPORTED CURRENCIES
       
       The API currently provides a broad currency list.
       This allows the converter to be global instead of
       being limited to the currencies hard-coded in HTML.
    ====================================================== */

    async function loadCurrencies() {

        if (
            !currencyFrom ||
            !currencyTo
        ) {

            return;

        }


        try {

            const response =
                await fetch(
                    API_BASE_URL +
                    "/currencies"
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to load currencies."
                );

            }


            const data =
                await response.json();


            if (
                !data ||
                typeof data !== "object"
            ) {

                throw new Error(
                    "Invalid currency data."
                );

            }


           async function loadCurrencies() {

    if (
        !currencyFrom ||
        !currencyTo
    ) {
        return;
    }

    try {

        const response =
            await fetch(
                API_BASE_URL +
                "/currencies"
            );

        if (!response.ok) {

            throw new Error(
                "Unable to load currencies."
            );

        }

        const data =
            await response.json();

        /*
            Frankfurter v2 returns an array of
            currency objects.

            Example structure:

            [
                {
                    "iso_code": "AED",
                    "name": "United Arab Emirates Dirham",
                    ...
                }
            ]
        */

        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {

            throw new Error(
                "Invalid currency data."
            );

        }

        const currentFrom =
            currencyFrom.value ||
            "USD";

        const currentTo =
            currencyTo.value ||
            "INR";


        currencyFrom.innerHTML =
            "";

        currencyTo.innerHTML =
            "";


        data
            .filter(function (currency) {

                return (
                    currency &&
                    typeof currency.iso_code === "string"
                );

            })
            .sort(function (a, b) {

                return a.iso_code
                    .localeCompare(
                        b.iso_code
                    );

            })
            .forEach(function (currency) {

                const code =
                    currency.iso_code;

                const name =
                    currency.name ||
                    getCurrencyName(code);


                currencyFrom.appendChild(
                    createCurrencyOption(
                        code,
                        name
                    )
                );


                currencyTo.appendChild(
                    createCurrencyOption(
                        code,
                        name
                    )
                );

            });


        /*
            Restore the selected currencies.
        */

        if (
            Array.from(
                currencyFrom.options
            ).some(function (option) {

                return option.value === currentFrom;

            })
        ) {

            currencyFrom.value =
                currentFrom;

        }


        if (
            Array.from(
                currencyTo.options
            ).some(function (option) {

                return option.value === currentTo;

            })
        ) {

            currencyTo.value =
                currentTo;

        }


        currencyListLoaded =
            true;


    } catch (error) {

        /*
            Keep the fallback currencies already
            present in the HTML if the API request
            fails.
        */

        currencyListLoaded =
            false;

        console.warn(
            "Currency list could not be loaded:",
            error
        );

    }

}


            if (
                currencies.length === 0
            ) {

                throw new Error(
                    "No currencies were returned."
                );

            }


            const currentFrom =
                currencyFrom.value ||
                "USD";


            const currentTo =
                currencyTo.value ||
                "INR";


            currencyFrom.innerHTML =
                "";


            currencyTo.innerHTML =
                "";


            currencies
                .sort(function (a, b) {

                    return a[0]
                        .localeCompare(b[0]);

                })
                .forEach(function (entry) {

                    const code =
                        entry[0];

                    const name =
                        entry[1];


                    currencyFrom.appendChild(
                        createCurrencyOption(
                            code,
                            name
                        )
                    );


                    currencyTo.appendChild(
                        createCurrencyOption(
                            code,
                            name
                        )
                    );

                });


            if (
                Array.from(
                    currencyFrom.options
                ).some(function (option) {

                    return option.value === currentFrom;

                })
            ) {

                currencyFrom.value =
                    currentFrom;

            }


            if (
                Array.from(
                    currencyTo.options
                ).some(function (option) {

                    return option.value === currentTo;

                })
            ) {

                currencyTo.value =
                    currentTo;

            }


            currencyListLoaded =
                true;


        } catch (error) {

            /*
                Keep the currencies already present in the
                HTML if the API currency-list request fails.

                Conversion can still work for those currencies
                if the rate endpoint supports the pair.
            */

            currencyListLoaded =
                false;

            console.warn(
                "Currency list could not be loaded:",
                error
            );

        }

    }


    /* ======================================================
       SHOW ERROR
    ====================================================== */

    function showError(message) {

        if (!errorBox) {
            return;
        }


        errorBox.textContent =
            message;


        errorBox.hidden =
            false;


        if (resultBox) {

            resultBox.hidden =
                true;

        }

    }


    /* ======================================================
       CLEAR ERROR
    ====================================================== */

    function clearError() {

        if (!errorBox) {
            return;
        }


        errorBox.textContent =
            "";


        errorBox.hidden =
            true;

    }


    /* ======================================================
       SET LOADING STATE
    ====================================================== */

    function setLoadingState(
        isLoading
    ) {

        if (!calculateButton) {
            return;
        }


        if (isLoading) {

            calculateButton.disabled =
                true;

            calculateButton.textContent =
                "Converting...";

        } else {

            calculateButton.disabled =
                false;

            calculateButton.textContent =
                "Convert Currency";

        }

    }


    /* ======================================================
       GET INPUTS
    ====================================================== */

    function getInputs() {

        const amount =
            Number(
                currencyAmount
                    ? currencyAmount.value
                    : NaN
            );


        const from =
            currencyFrom
                ? currencyFrom.value
                : "";


        const to =
            currencyTo
                ? currencyTo.value
                : "";


        return {
            amount,
            from,
            to
        };

    }


    /* ======================================================
       VALIDATE INPUTS
    ====================================================== */

    function validateInputs(
        amount,
        from,
        to
    ) {


        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            showError(
                "Please enter an amount greater than 0."
            );


            if (currencyAmount) {

                currencyAmount.focus();

            }


            return false;

        }


        if (!from) {

            showError(
                "Please select the currency you are converting from."
            );


            if (currencyFrom) {

                currencyFrom.focus();

            }


            return false;

        }


        if (!to) {

            showError(
                "Please select the currency you are converting to."
            );


            if (currencyTo) {

                currencyTo.focus();

            }


            return false;

        }


        return true;

    }


    /* ======================================================
       FETCH EXCHANGE RATE
    ====================================================== */

    async function fetchExchangeRate(
        from,
        to
    ) {

        /*
            Same-currency conversion is exactly 1.
            No API request is necessary.
        */

        if (
            from === to
        ) {

            return {
                rate: 1,
                date: null,
                source: "Same currency"
            };

        }


        const url =
            API_BASE_URL +
            "/rate/" +
            encodeURIComponent(from) +
            "/" +
            encodeURIComponent(to);


        const response =
            await fetch(url);


        if (!response.ok) {

            let errorMessage =
                "Unable to retrieve the exchange rate.";


            try {

                const errorData =
                    await response.json();


                if (
                    errorData &&
                    errorData.message
                ) {

                    errorMessage =
                        errorData.message;

                }

            } catch (error) {

                /*
                    Keep the default error message.
                */

            }


            throw new Error(
                errorMessage
            );

        }


        const data =
            await response.json();


        if (
            !data ||
            !Number.isFinite(
                Number(data.rate)
            )
        ) {

            throw new Error(
                "The exchange-rate service returned an invalid rate."
            );

        }


        return {

            rate:
                Number(data.rate),

            date:
                data.date ||
                null,

            source:
                "Frankfurter reference rate"

        };

    }


    /* ======================================================
       FORMAT RATE
    ====================================================== */

    function formatRate(
        rate
    ) {

        const numericRate =
            Number(rate);


        if (
            !Number.isFinite(
                numericRate
            )
        ) {

            return "—";

        }


        return new Intl.NumberFormat(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6
            }
        ).format(
            numericRate
        );

    }


    /* ======================================================
       FORMAT DATE
    ====================================================== */

    function formatRateDate(
        dateString
    ) {

        if (!dateString) {

            return "Current conversion";

        }


        const date =
            new Date(
                dateString +
                "T00:00:00"
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return dateString;

        }


        return new Intl.DateTimeFormat(
            undefined,
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        ).format(date);

    }


    /* ======================================================
       CREATE RESULTS HTML
    ====================================================== */

    function createResultsHTML(
        amount,
        from,
        to,
        rate,
        convertedAmount,
        rateDate,
        source
    ) {

        let html =
            "";


        /* ==================================================
           MAIN RESULT
        ================================================== */

        html += `

            <div class="calculator-results-grid">

                <div class="result-card">

                    <h3>
                        Amount
                    </h3>

                    <p class="result-value">
                        ${formatCurrency(
                            amount,
                            from
                        )}
                    </p>

                </div>


                <div class="result-card">

                    <h3>
                        Exchange Rate
                    </h3>

                    <p class="result-value">
                        ${formatRate(rate)}
                    </p>

                </div>


                <div class="result-card">

                    <h3>
                        Converted Amount
                    </h3>

                    <p class="result-value">
                        ${formatCurrency(
                            convertedAmount,
                            to
                        )}
                    </p>

                </div>


                <div class="result-card">

                    <h3>
                        Currency Pair
                    </h3>

                    <p class="result-value">
                        ${from} / ${to}
                    </p>

                </div>

            </div>

        `;


        /* ==================================================
           CONVERSION DETAILS
        ================================================== */

        html += `

            <div class="info-box">

                <h3>
                    Conversion Details
                </h3>

                <p>

                    <strong>
                        Amount:
                    </strong>

                    ${formatCurrency(
                        amount,
                        from
                    )}

                </p>

                <p>

                    <strong>
                        From Currency:
                    </strong>

                    ${from} —
                    ${getCurrencyName(from)}

                </p>

                <p>

                    <strong>
                        To Currency:
                    </strong>

                    ${to} —
                    ${getCurrencyName(to)}

                </p>

                <p>

                    <strong>
                        Exchange Rate:
                    </strong>

                    1 ${from} =
                    ${formatRate(rate)}
                    ${to}

                </p>

                <p>

                    <strong>
                        Converted Amount:
                    </strong>

                    ${formatCurrency(
                        convertedAmount,
                        to
                    )}

                </p>

                <p>

                    <strong>
                        Rate Date:
                    </strong>

                    ${formatRateDate(
                        rateDate
                    )}

                </p>

            </div>

        `;


        /* ==================================================
           EXPLANATION
        ================================================== */

        html += `

            <div class="info-box">

                <h3>
                    What This Result Means
                </h3>

                <p>

                    Based on the selected exchange rate,
                    <strong>
                        ${formatCurrency(
                            amount,
                            from
                        )}
                    </strong>

                    is equivalent to approximately

                    <strong>
                        ${formatCurrency(
                            convertedAmount,
                            to
                        )}
                    </strong>.

                </p>

                <p>

                    The calculation uses an exchange rate of

                    <strong>
                        1 ${from} =
                        ${formatRate(rate)}
                        ${to}
                    </strong>.

                </p>

                <p>

                    The actual amount received or charged by
                    a bank, card provider, currency exchange,
                    or money-transfer service may differ because
                    providers can apply their own rates, fees,
                    commissions, or exchange-rate margins.

                </p>

            </div>

        `;


        /* ==================================================
           REVERSE RATE
        ================================================== */

        const reverseRate =
            rate > 0
                ? 1 / rate
                : 0;


        html += `

            <div class="info-box">

                <h3>
                    Reverse Exchange Rate
                </h3>

                <p>

                    The reverse exchange rate is approximately:

                </p>

                <p class="text-center">

                    <strong>
                        1 ${to} =
                        ${formatRate(reverseRate)}
                        ${from}
                    </strong>

                </p>

            </div>

        `;


        /* ==================================================
           RATE INFORMATION
        ================================================== */

        html += `

            <div class="info-box">

                <h3>
                    Exchange Rate Information
                </h3>

                <p>

                    <strong>
                        Rate source:
                    </strong>

                    ${source}

                </p>

                <p>

                    <strong>
                        Rate date:
                    </strong>

                    ${formatRateDate(
                        rateDate
                    )}

                </p>

                <p class="small-text">

                    Exchange rates are reference rates and
                    can differ from the rates offered by banks,
                    card providers, currency exchanges, and
                    money-transfer services.

                </p>

            </div>

        `;


        /* ==================================================
           FORMULA
        ================================================== */

        html += `

            <div class="info-box">

                <h3>
                    Currency Conversion Formula
                </h3>

                <p class="text-center">

                    <strong>
                        Converted Amount =
                        Amount × Exchange Rate
                    </strong>

                </p>

                <p class="text-center">

                    <strong>
                        ${formatCurrency(
                            amount,
                            from
                        )}
                        ×
                        ${formatRate(rate)}
                        =
                        ${formatCurrency(
                            convertedAmount,
                            to
                        )}
                    </strong>

                </p>

            </div>

        `;


        return html;

    }


    /* ======================================================
       UPDATE SUMMARY
    ====================================================== */

    function updateSummary(
        amount,
        from,
        to,
        rate,
        convertedAmount,
        rateDate
    ) {

        if (summaryAmount) {

            summaryAmount.textContent =
                formatCurrency(
                    amount,
                    from
                );

        }


        if (summaryFrom) {

            summaryFrom.textContent =
                from +
                " — " +
                getCurrencyName(from);

        }


        if (summaryTo) {

            summaryTo.textContent =
                to +
                " — " +
                getCurrencyName(to);

        }


        if (summaryRate) {

            summaryRate.textContent =
                "1 " +
                from +
                " = " +
                formatRate(rate) +
                " " +
                to;

        }


        if (summaryConverted) {

            summaryConverted.textContent =
                formatCurrency(
                    convertedAmount,
                    to
                );

        }


        if (summaryUpdated) {

            summaryUpdated.textContent =
                formatRateDate(
                    rateDate
                );

        }

    }


    /* ======================================================
       RESET SUMMARY
    ====================================================== */

    function resetSummary() {

        if (summaryAmount) {

            summaryAmount.textContent =
                "0.00";

        }


        if (summaryFrom) {

            summaryFrom.textContent =
                "USD";

        }


        if (summaryTo) {

            summaryTo.textContent =
                "INR";

        }


        if (summaryRate) {

            summaryRate.textContent =
                "—";

        }


        if (summaryConverted) {

            summaryConverted.textContent =
                "0.00";

        }


        if (summaryUpdated) {

            summaryUpdated.textContent =
                "—";

        }

    }


    /* ======================================================
       CALCULATE CURRENCY
    ====================================================== */

    async function calculateCurrency() {

        clearError();


        const {
            amount,
            from,
            to
        } = getInputs();


        if (
            !validateInputs(
                amount,
                from,
                to
            )
        ) {

            return;

        }


        setLoadingState(true);


        try {

            const exchangeData =
                await fetchExchangeRate(
                    from,
                    to
                );


            const rate =
                exchangeData.rate;


            const convertedAmount =
                amount * rate;


            if (
                !Number.isFinite(
                    convertedAmount
                )
            ) {

                throw new Error(
                    "The converted amount could not be calculated."
                );

            }


            lastConversion = {

                amount:
                    amount,

                from:
                    from,

                to:
                    to,

                rate:
                    rate,

                convertedAmount:
                    convertedAmount,

                date:
                    exchangeData.date,

                source:
                    exchangeData.source

            };


            if (resultContent) {

                resultContent.innerHTML =
                    createResultsHTML(
                        amount,
                        from,
                        to,
                        rate,
                        convertedAmount,
                        exchangeData.date,
                        exchangeData.source
                    );

            }


            if (resultBox) {

                resultBox.hidden =
                    false;

            }


            updateSummary(
                amount,
                from,
                to,
                rate,
                convertedAmount,
                exchangeData.date
            );


            setTimeout(function () {

                if (resultBox) {

                    resultBox.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }, 100);


        } catch (error) {

            console.error(
                "Currency conversion error:",
                error
            );


            showError(
                "Unable to retrieve the exchange rate right now. Please check your internet connection and try again."
            );

        } finally {

            setLoadingState(false);

        }

    }


    /* ======================================================
       SWAP CURRENCIES
    ====================================================== */

    function swapCurrencies() {

        if (
            !currencyFrom ||
            !currencyTo
        ) {

            return;

        }


        const currentFrom =
            currencyFrom.value;


        const currentTo =
            currencyTo.value;


        currencyFrom.value =
            currentTo;


        currencyTo.value =
            currentFrom;


        clearError();


        /*
            If a result is already visible,
            automatically recalculate using the
            swapped currency pair.
        */

        if (
            resultBox &&
            !resultBox.hidden &&
            currencyAmount &&
            Number(currencyAmount.value) > 0
        ) {

            calculateCurrency();

        }

    }


    /* ======================================================
       RESET CALCULATOR
    ====================================================== */

    function resetCalculator() {

        clearError();


        if (currencyAmount) {

            currencyAmount.value =
                "";

        }


        if (currencyFrom) {

            currencyFrom.value =
                "USD";

        }


        if (currencyTo) {

            currencyTo.value =
                "INR";

        }


        if (resultContent) {

            resultContent.innerHTML =
                "";

        }


        if (resultBox) {

            resultBox.hidden =
                true;

        }


        lastConversion =
            null;


        resetSummary();


        if (currencyAmount) {

            currencyAmount.focus();

        }

    }


    /* ======================================================
       AMOUNT INPUT CLEANUP
    ====================================================== */

    if (currencyAmount) {

        currencyAmount.addEventListener(
            "input",
            function () {

                clearError();

            }
        );

    }


    /* ======================================================
       CALCULATE BUTTON
    ====================================================== */

    if (calculateButton) {

        calculateButton.addEventListener(
            "click",
            calculateCurrency
        );

    }


    /* ======================================================
       RESET BUTTON
    ====================================================== */

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetCalculator
        );

    }


    /* ======================================================
       SWAP BUTTON
    ====================================================== */

    if (swapButton) {

        swapButton.addEventListener(
            "click",
            swapCurrencies
        );

    }


    /* ======================================================
       ENTER KEY SUPPORT
    ====================================================== */

    if (currencyAmount) {

        currencyAmount.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    calculateCurrency();

                }

            }
        );

    }


    /* ======================================================
       CURRENCY CHANGE
    ====================================================== */

    [
        currencyFrom,
        currencyTo

    ].forEach(function (select) {

        if (!select) {
            return;
        }


        select.addEventListener(
            "change",
            function () {

                clearError();


                /*
                    If the user already has a result,
                    recalculate automatically after
                    changing either currency.
                */

                if (
                    resultBox &&
                    !resultBox.hidden &&
                    currencyAmount &&
                    Number(currencyAmount.value) > 0
                ) {

                    calculateCurrency();

                }

            }
        );

    });


    /* ======================================================
       INITIALIZE
    ====================================================== */

    resetSummary();


    /*
        Load the broader global currency list.
        The HTML contains fallback currencies, so the
        calculator remains usable if this request fails.
    */

    loadCurrencies();

});