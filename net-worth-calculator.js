/* ==========================================================
   NET WORTH CALCULATOR
   CalclyWorld

   Calculates:
   - Total assets
   - Total liabilities
   - Net worth
   - Debt-to-asset ratio
   - Asset breakdown
   - Liability breakdown

   Currency: USD
========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ======================================================
       ASSET INPUTS
    ====================================================== */

    const assetCash =
        document.getElementById("asset-cash");

    const assetInvestments =
        document.getElementById("asset-investments");

    const assetRetirement =
        document.getElementById("asset-retirement");

    const assetRealEstate =
        document.getElementById("asset-real-estate");

    const assetVehicles =
        document.getElementById("asset-vehicles");

    const assetBusiness =
        document.getElementById("asset-business");

    const assetValuables =
        document.getElementById("asset-valuables");

    const assetOther =
        document.getElementById("asset-other");


    /* ======================================================
       LIABILITY INPUTS
    ====================================================== */

    const liabilityMortgage =
        document.getElementById("liability-mortgage");

    const liabilityCreditCard =
        document.getElementById("liability-credit-card");

    const liabilityStudent =
        document.getElementById("liability-student");

    const liabilityAuto =
        document.getElementById("liability-auto");

    const liabilityPersonal =
        document.getElementById("liability-personal");

    const liabilityOther =
        document.getElementById("liability-other");


    /* ======================================================
       BUTTONS
    ====================================================== */

    const calculateButton =
        document.getElementById("calculate-net-worth");

    const resetButton =
        document.getElementById("reset-net-worth");


    /* ======================================================
       ERROR / RESULT
    ====================================================== */

    const errorBox =
        document.getElementById("net-worth-error");

    const resultBox =
        document.getElementById("net-worth-result");

    const resultContent =
        document.getElementById("net-worth-result-content");


    /* ======================================================
       SUMMARY ELEMENTS
    ====================================================== */

    const summaryTotalAssets =
        document.getElementById("summary-total-assets");

    const summaryTotalLiabilities =
        document.getElementById("summary-total-liabilities");

    const summaryNetWorth =
        document.getElementById("summary-net-worth");

    const summaryDebtRatio =
        document.getElementById("summary-debt-ratio");

    const summaryNetWorthDetail =
        document.getElementById("summary-net-worth-detail");

    const summaryAssetsDetail =
        document.getElementById("summary-assets-detail");

    const summaryLiabilitiesDetail =
        document.getElementById("summary-liabilities-detail");

    const summaryRatioDetail =
        document.getElementById("summary-ratio-detail");


    /* ======================================================
       FORMAT CURRENCY
    ====================================================== */

    function formatCurrency(value) {

        if (!Number.isFinite(value)) {
            return "$0.00";
        }

        return new Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        ).format(value);

    }


    /* ======================================================
       FORMAT PERCENTAGE
    ====================================================== */

    function formatPercentage(value) {

        if (!Number.isFinite(value)) {
            return "0.00%";
        }

        return (
            new Intl.NumberFormat(
                "en-US",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            ).format(value)
            + "%"
        );

    }


    /* ======================================================
       GET INPUT VALUE
    ====================================================== */

    function getValue(element) {

        if (!element) {
            return 0;
        }

        const value =
            Number(element.value);

        if (
            !Number.isFinite(value) ||
            value < 0
        ) {
            return 0;
        }

        return value;

    }


    /* ======================================================
       GET ASSETS
    ====================================================== */

    function getAssets() {

        return {

            cash:
                getValue(assetCash),

            investments:
                getValue(assetInvestments),

            retirement:
                getValue(assetRetirement),

            realEstate:
                getValue(assetRealEstate),

            vehicles:
                getValue(assetVehicles),

            business:
                getValue(assetBusiness),

            valuables:
                getValue(assetValuables),

            other:
                getValue(assetOther)

        };

    }


    /* ======================================================
       GET LIABILITIES
    ====================================================== */

    function getLiabilities() {

        return {

            mortgage:
                getValue(liabilityMortgage),

            creditCard:
                getValue(liabilityCreditCard),

            student:
                getValue(liabilityStudent),

            auto:
                getValue(liabilityAuto),

            personal:
                getValue(liabilityPersonal),

            other:
                getValue(liabilityOther)

        };

    }


    /* ======================================================
       TOTAL OBJECT VALUES
    ====================================================== */

    function getTotal(object) {

        return Object.values(object)
            .reduce(
                function (total, value) {

                    return total + value;

                },
                0
            );

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
       VALIDATE INPUTS
    ====================================================== */

    function validateInputs() {

        const inputs = [

            assetCash,
            assetInvestments,
            assetRetirement,
            assetRealEstate,
            assetVehicles,
            assetBusiness,
            assetValuables,
            assetOther,

            liabilityMortgage,
            liabilityCreditCard,
            liabilityStudent,
            liabilityAuto,
            liabilityPersonal,
            liabilityOther

        ];


        for (
            let i = 0;
            i < inputs.length;
            i++
        ) {

            const element =
                inputs[i];

            if (!element) {
                continue;
            }


            const rawValue =
                element.value.trim();


            if (rawValue === "") {
                continue;
            }


            const value =
                Number(rawValue);


            if (
                !Number.isFinite(value) ||
                value < 0
            ) {

                showError(
                    "Please enter valid non-negative amounts in all fields."
                );

                element.focus();

                return false;

            }

        }


        return true;

    }


    /* ======================================================
       UPDATE SUMMARY
    ====================================================== */

    function updateSummary(
        totalAssets,
        totalLiabilities,
        netWorth,
        debtRatio
    ) {

        if (summaryTotalAssets) {

            summaryTotalAssets.textContent =
                formatCurrency(totalAssets);

        }


        if (summaryTotalLiabilities) {

            summaryTotalLiabilities.textContent =
                formatCurrency(totalLiabilities);

        }


        if (summaryNetWorth) {

            summaryNetWorth.textContent =
                formatCurrency(netWorth);

        }


        if (summaryDebtRatio) {

            summaryDebtRatio.textContent =
                formatPercentage(debtRatio);

        }


        if (summaryNetWorthDetail) {

            summaryNetWorthDetail.textContent =
                formatCurrency(netWorth);

        }


        if (summaryAssetsDetail) {

            summaryAssetsDetail.textContent =
                formatCurrency(totalAssets);

        }


        if (summaryLiabilitiesDetail) {

            summaryLiabilitiesDetail.textContent =
                formatCurrency(totalLiabilities);

        }


        if (summaryRatioDetail) {

            summaryRatioDetail.textContent =
                formatPercentage(debtRatio);

        }

    }


    /* ======================================================
       BREAKDOWN ELEMENT HELPER
    ====================================================== */

    function updateBreakdownValue(
        valueId,
        percentId,
        value,
        total
    ) {

        const valueElement =
            document.getElementById(valueId);

        const percentElement =
            document.getElementById(percentId);


        if (valueElement) {

            valueElement.textContent =
                formatCurrency(value);

        }


        let percentage = 0;


        if (total > 0) {

            percentage =
                (
                    value /
                    total
                ) * 100;

        }


        if (percentElement) {

            percentElement.textContent =
                formatPercentage(percentage);

        }

    }


    /* ======================================================
       UPDATE ASSET BREAKDOWN
    ====================================================== */

    function updateAssetBreakdown(
        assets,
        totalAssets
    ) {

        updateBreakdownValue(
            "breakdown-cash",
            "breakdown-cash-percent",
            assets.cash,
            totalAssets
        );


        updateBreakdownValue(
            "breakdown-investments",
            "breakdown-investments-percent",
            assets.investments,
            totalAssets
        );


        updateBreakdownValue(
            "breakdown-retirement",
            "breakdown-retirement-percent",
            assets.retirement,
            totalAssets
        );


        updateBreakdownValue(
            "breakdown-real-estate",
            "breakdown-real-estate-percent",
            assets.realEstate,
            totalAssets
        );


        updateBreakdownValue(
            "breakdown-vehicles",
            "breakdown-vehicles-percent",
            assets.vehicles,
            totalAssets
        );


        updateBreakdownValue(
            "breakdown-business",
            "breakdown-business-percent",
            assets.business,
            totalAssets
        );


        updateBreakdownValue(
            "breakdown-valuables",
            "breakdown-valuables-percent",
            assets.valuables,
            totalAssets
        );


        updateBreakdownValue(
            "breakdown-other-assets",
            "breakdown-other-assets-percent",
            assets.other,
            totalAssets
        );


        const totalElement =
            document.getElementById(
                "breakdown-total-assets"
            );


        const totalPercentElement =
            document.getElementById(
                "breakdown-total-assets-percent"
            );


        if (totalElement) {

            totalElement.textContent =
                formatCurrency(totalAssets);

        }


        if (totalPercentElement) {

            totalPercentElement.textContent =
                totalAssets > 0
                    ? "100.00%"
                    : "0.00%";

        }

    }


    /* ======================================================
       UPDATE LIABILITY BREAKDOWN
    ====================================================== */

    function updateLiabilityBreakdown(
        liabilities,
        totalLiabilities
    ) {

        updateBreakdownValue(
            "breakdown-mortgage",
            "breakdown-mortgage-percent",
            liabilities.mortgage,
            totalLiabilities
        );


        updateBreakdownValue(
            "breakdown-credit-card",
            "breakdown-credit-card-percent",
            liabilities.creditCard,
            totalLiabilities
        );


        updateBreakdownValue(
            "breakdown-student",
            "breakdown-student-percent",
            liabilities.student,
            totalLiabilities
        );


        updateBreakdownValue(
            "breakdown-auto",
            "breakdown-auto-percent",
            liabilities.auto,
            totalLiabilities
        );


        updateBreakdownValue(
            "breakdown-personal",
            "breakdown-personal-percent",
            liabilities.personal,
            totalLiabilities
        );


        updateBreakdownValue(
            "breakdown-other-liabilities",
            "breakdown-other-liabilities-percent",
            liabilities.other,
            totalLiabilities
        );


        const totalElement =
            document.getElementById(
                "breakdown-total-liabilities"
            );


        const totalPercentElement =
            document.getElementById(
                "breakdown-total-liabilities-percent"
            );


        if (totalElement) {

            totalElement.textContent =
                formatCurrency(
                    totalLiabilities
                );

        }


        if (totalPercentElement) {

            totalPercentElement.textContent =
                totalLiabilities > 0
                    ? "100.00%"
                    : "0.00%";

        }

    }


    /* ======================================================
       CREATE RESULT CONTENT
    ====================================================== */

    function createResultsHTML(
        totalAssets,
        totalLiabilities,
        netWorth,
        debtRatio
    ) {

        const netWorthStatus =
            netWorth > 0
                ? "Positive Net Worth"
                : netWorth < 0
                    ? "Negative Net Worth"
                    : "Zero Net Worth";


        return `

            <div class="calculator-results-grid">


                <div class="result-card">

                    <h3>
                        Total Assets
                    </h3>

                    <p class="result-value">
                        ${formatCurrency(totalAssets)}
                    </p>

                </div>


                <div class="result-card">

                    <h3>
                        Total Liabilities
                    </h3>

                    <p class="result-value">
                        ${formatCurrency(totalLiabilities)}
                    </p>

                </div>


                <div class="result-card">

                    <h3>
                        Net Worth
                    </h3>

                    <p class="result-value">
                        ${formatCurrency(netWorth)}
                    </p>

                </div>


                <div class="result-card">

                    <h3>
                        Debt-to-Asset Ratio
                    </h3>

                    <p class="result-value">
                        ${formatPercentage(debtRatio)}
                    </p>

                </div>


            </div>


            <div class="info-box">

                <h3>
                    Net Worth Status
                </h3>

                <p>

                    <strong>
                        ${netWorthStatus}
                    </strong>

                </p>

                <p>

                    Your net worth is calculated by subtracting
                    total liabilities from total assets.

                </p>

                <p>

                    ${formatCurrency(totalAssets)}
                    −
                    ${formatCurrency(totalLiabilities)}
                    =
                    ${formatCurrency(netWorth)}

                </p>

            </div>


            <div class="info-box">

                <h3>
                    Financial Summary
                </h3>

                <p>

                    <strong>
                        Total Assets:
                    </strong>

                    ${formatCurrency(totalAssets)}

                </p>

                <p>

                    <strong>
                        Total Liabilities:
                    </strong>

                    ${formatCurrency(totalLiabilities)}

                </p>

                <p>

                    <strong>
                        Net Worth:
                    </strong>

                    ${formatCurrency(netWorth)}

                </p>

                <p>

                    <strong>
                        Debt-to-Asset Ratio:
                    </strong>

                    ${formatPercentage(debtRatio)}

                </p>

            </div>


            <div class="info-box">

                <p>

                    These results are estimates based on the
                    values you entered. Actual asset values and
                    outstanding balances may change over time.

                </p>

            </div>

        `;

    }


    /* ======================================================
       CALCULATE NET WORTH
    ====================================================== */

    function calculateNetWorth() {

        clearError();


        if (!validateInputs()) {
            return;
        }


        try {

            const assets =
                getAssets();


            const liabilities =
                getLiabilities();


            const totalAssets =
                getTotal(assets);


            const totalLiabilities =
                getTotal(liabilities);


            const netWorth =
                totalAssets -
                totalLiabilities;


            let debtRatio =
                0;


            if (totalAssets > 0) {

                debtRatio =
                    (
                        totalLiabilities /
                        totalAssets
                    ) * 100;

            }


            updateSummary(
                totalAssets,
                totalLiabilities,
                netWorth,
                debtRatio
            );


            updateAssetBreakdown(
                assets,
                totalAssets
            );


            updateLiabilityBreakdown(
                liabilities,
                totalLiabilities
            );


            if (resultContent) {

                resultContent.innerHTML =
                    createResultsHTML(
                        totalAssets,
                        totalLiabilities,
                        netWorth,
                        debtRatio
                    );

            }


            if (resultBox) {

                resultBox.hidden =
                    false;

            }


            setTimeout(
                function () {

                    if (resultBox) {

                        resultBox.scrollIntoView({

                            behavior: "smooth",

                            block: "start"

                        });

                    }

                },
                100
            );


        } catch (error) {

            console.error(
                "Net Worth Calculator Error:",
                error
            );


            showError(
                "Unable to calculate net worth. Please check your entries and try again."
            );

        }

    }


    /* ======================================================
       RESET CALCULATOR
    ====================================================== */

    function resetCalculator() {

        clearError();


        const inputs = [

            assetCash,
            assetInvestments,
            assetRetirement,
            assetRealEstate,
            assetVehicles,
            assetBusiness,
            assetValuables,
            assetOther,

            liabilityMortgage,
            liabilityCreditCard,
            liabilityStudent,
            liabilityAuto,
            liabilityPersonal,
            liabilityOther

        ];


        inputs.forEach(
            function (element) {

                if (element) {

                    element.value =
                        "0";

                }

            }
        );


        if (resultContent) {

            resultContent.innerHTML =
                "";

        }


        if (resultBox) {

            resultBox.hidden =
                true;

        }


        updateSummary(
            0,
            0,
            0,
            0
        );


        updateAssetBreakdown(
            {
                cash: 0,
                investments: 0,
                retirement: 0,
                realEstate: 0,
                vehicles: 0,
                business: 0,
                valuables: 0,
                other: 0
            },
            0
        );


        updateLiabilityBreakdown(
            {
                mortgage: 0,
                creditCard: 0,
                student: 0,
                auto: 0,
                personal: 0,
                other: 0
            },
            0
        );


        if (assetCash) {

            assetCash.focus();

        }

    }


    /* ======================================================
       BUTTON EVENTS
    ====================================================== */

    if (calculateButton) {

        calculateButton.addEventListener(
            "click",
            calculateNetWorth
        );

    }


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetCalculator
        );

    }


    /* ======================================================
       ENTER KEY SUPPORT
    ====================================================== */

    const allInputs = [

        assetCash,
        assetInvestments,
        assetRetirement,
        assetRealEstate,
        assetVehicles,
        assetBusiness,
        assetValuables,
        assetOther,

        liabilityMortgage,
        liabilityCreditCard,
        liabilityStudent,
        liabilityAuto,
        liabilityPersonal,
        liabilityOther

    ];


    allInputs.forEach(
        function (element) {

            if (!element) {
                return;
            }


            element.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        calculateNetWorth();

                    }

                }
            );


            element.addEventListener(
                "input",
                function () {

                    clearError();

                }
            );

        }
    );


    /* ======================================================
       INITIALIZE
    ====================================================== */

    resetCalculator();

});