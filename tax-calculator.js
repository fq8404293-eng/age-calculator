/* ==========================================================
   2026 US FEDERAL TAX CALCULATOR
   CalclyWorld

   Scope:
   - US Federal Individual Income Tax
   - Tax Year 2026
   - Simplified estimate
   - No state/local tax
   - No payroll taxes
   - No tax credits
   - No capital gains calculation
========================================================== */

document.addEventListener("DOMContentLoaded", function () {


    /* ======================================================
       ELEMENTS
    ====================================================== */

    const filingStatus =
        document.getElementById(
            "tax-filing-status"
        );

    const incomeInput =
        document.getElementById(
            "tax-income"
        );

    const deductionsInput =
        document.getElementById(
            "tax-deductions"
        );

    const calculateButton =
        document.getElementById(
            "calculate-tax"
        );

    const resetButton =
        document.getElementById(
            "reset-tax"
        );

    const errorBox =
        document.getElementById(
            "tax-error"
        );

    const resultBox =
        document.getElementById(
            "tax-result"
        );

    const resultContent =
        document.getElementById(
            "tax-result-content"
        );


    /* ======================================================
       SUMMARY ELEMENTS
    ====================================================== */

    const summaryTaxableIncome =
        document.getElementById(
            "summary-taxable-income"
        );

    const summaryFederalTax =
        document.getElementById(
            "summary-federal-tax"
        );

    const summaryEffectiveRate =
        document.getElementById(
            "summary-effective-rate"
        );

    const summaryMarginalRate =
        document.getElementById(
            "summary-marginal-rate"
        );

    const summaryFilingStatus =
        document.getElementById(
            "summary-filing-status"
        );

    const summaryGrossIncome =
        document.getElementById(
            "summary-gross-income"
        );

    const summaryStandardDeduction =
        document.getElementById(
            "summary-standard-deduction"
        );

    const summaryAdditionalDeductions =
        document.getElementById(
            "summary-additional-deductions"
        );

    const summaryTotalDeductions =
        document.getElementById(
            "summary-total-deductions"
        );

    const summaryTax =
        document.getElementById(
            "summary-tax"
        );


    /* ======================================================
       TAX YEAR
    ====================================================== */

    const TAX_YEAR = 2026;


    /* ======================================================
       2026 STANDARD DEDUCTIONS
       
       Official IRS amounts:
       
       Single:
       $16,100

       Married Filing Jointly:
       $32,200

       Married Filing Separately:
       $16,100

       Head of Household:
       $24,150
    ====================================================== */

    const STANDARD_DEDUCTIONS = {

        "single": 16100,

        "married-joint": 32200,

        "married-separate": 16100,

        "head-household": 24150

    };


    /* ======================================================
       2026 FEDERAL TAX BRACKETS
       
       Each bracket contains:
       - upper limit
       - tax rate

       The brackets are progressive.
    ====================================================== */

    const TAX_BRACKETS = {

        "single": [

            {
                upper: 12400,
                rate: 0.10
            },

            {
                upper: 50400,
                rate: 0.12
            },

            {
                upper: 105700,
                rate: 0.22
            },

            {
                upper: 201775,
                rate: 0.24
            },

            {
                upper: 256225,
                rate: 0.32
            },

            {
                upper: 640600,
                rate: 0.35
            },

            {
                upper: Infinity,
                rate: 0.37
            }

        ],


        "married-joint": [

            {
                upper: 24800,
                rate: 0.10
            },

            {
                upper: 100800,
                rate: 0.12
            },

            {
                upper: 211400,
                rate: 0.22
            },

            {
                upper: 403550,
                rate: 0.24
            },

            {
                upper: 512450,
                rate: 0.32
            },

            {
                upper: 768700,
                rate: 0.35
            },

            {
                upper: Infinity,
                rate: 0.37
            }

        ],


        "married-separate": [

            {
                upper: 12400,
                rate: 0.10
            },

            {
                upper: 50400,
                rate: 0.12
            },

            {
                upper: 105700,
                rate: 0.22
            },

            {
                upper: 201775,
                rate: 0.24
            },

            {
                upper: 256225,
                rate: 0.32
            },

            {
                upper: 384350,
                rate: 0.35
            },

            {
                upper: Infinity,
                rate: 0.37
            }

        ],


        "head-household": [

            {
                upper: 17700,
                rate: 0.10
            },

            {
                upper: 67450,
                rate: 0.12
            },

            {
                upper: 105700,
                rate: 0.22
            },

            {
                upper: 201750,
                rate: 0.24
            },

            {
                upper: 256200,
                rate: 0.32
            },

            {
                upper: 640600,
                rate: 0.35
            },

            {
                upper: Infinity,
                rate: 0.37
            }

        ]

    };


    /* ======================================================
       FILING STATUS NAMES
    ====================================================== */

    const FILING_STATUS_NAMES = {

        "single":
            "Single",

        "married-joint":
            "Married Filing Jointly",

        "married-separate":
            "Married Filing Separately",

        "head-household":
            "Head of Household"

    };


    /* ======================================================
       FORMAT CURRENCY
    ====================================================== */

    function formatCurrency(value) {

        const numericValue =
            Number(value);


        if (
            !Number.isFinite(
                numericValue
            )
        ) {

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
        ).format(
            numericValue
        );

    }


    /* ======================================================
       FORMAT PERCENTAGE
    ====================================================== */

    function formatPercentage(value) {

        const numericValue =
            Number(value);


        if (
            !Number.isFinite(
                numericValue
            )
        ) {

            return "0.00%";

        }


        return (
            numericValue.toFixed(2) +
            "%"
        );

    }


    /* ======================================================
       FORMAT RATE
    ====================================================== */

    function formatRate(value) {

        return (
            Number(value * 100).toFixed(0) +
            "%"
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
       GET INPUTS
    ====================================================== */

    function getInputs() {

        const income =
            Number(
                incomeInput
                    ? incomeInput.value
                    : NaN
            );


        const additionalDeductions =
            Number(
                deductionsInput
                    ? deductionsInput.value
                    : NaN
            );


        const status =
            filingStatus
                ? filingStatus.value
                : "";


        return {

            income,

            additionalDeductions,

            status

        };

    }


    /* ======================================================
       VALIDATE INPUTS
    ====================================================== */

    function validateInputs(
        income,
        additionalDeductions,
        status
    ) {


        if (
            !status ||
            !STANDARD_DEDUCTIONS[
                status
            ]
        ) {

            showError(
                "Please select a valid filing status."
            );


            if (filingStatus) {

                filingStatus.focus();

            }


            return false;

        }


        if (
            !Number.isFinite(
                income
            ) ||
            income < 0
        ) {

            showError(
                "Please enter a valid annual gross income of $0 or more."
            );


            if (incomeInput) {

                incomeInput.focus();

            }


            return false;

        }


        if (
            !Number.isFinite(
                additionalDeductions
            ) ||
            additionalDeductions < 0
        ) {

            showError(
                "Please enter valid additional deductions of $0 or more."
            );


            if (deductionsInput) {

                deductionsInput.focus();

            }


            return false;

        }


        return true;

    }


    /* ======================================================
       CALCULATE TAXABLE INCOME
    ====================================================== */

    function calculateTaxableIncome(
        grossIncome,
        standardDeduction,
        additionalDeductions
    ) {

        const totalDeductions =
            standardDeduction +
            additionalDeductions;


        return Math.max(
            0,
            grossIncome -
            totalDeductions
        );

    }


    /* ======================================================
       CALCULATE FEDERAL TAX
       
       Progressive bracket calculation.
    ====================================================== */

    function calculateFederalTax(
        taxableIncome,
        status
    ) {

        const brackets =
            TAX_BRACKETS[
                status
            ];


        if (
            !brackets ||
            taxableIncome <= 0
        ) {

            return {

                tax: 0,

                marginalRate: 0,

                breakdown: []

            };

        }


        let tax =
            0;

        let previousLimit =
            0;

        let marginalRate =
            0;

        const breakdown = [];


        for (
            let i = 0;
            i < brackets.length;
            i++
        ) {

            const bracket =
                brackets[i];


            const upperLimit =
                bracket.upper;

            const rate =
                bracket.rate;


            const taxableInBracket =
                Math.min(
                    taxableIncome,
                    upperLimit
                ) -
                previousLimit;


            if (
                taxableInBracket > 0
            ) {

                const taxForBracket =
                    taxableInBracket *
                    rate;


                tax +=
                    taxForBracket;


                marginalRate =
                    rate;


                breakdown.push({

                    lower:
                        previousLimit,

                    upper:
                        upperLimit,

                    rate:
                        rate,

                    taxableAmount:
                        taxableInBracket,

                    tax:
                        taxForBracket

                });

            }


            if (
                taxableIncome <=
                upperLimit
            ) {

                break;

            }


            previousLimit =
                upperLimit;

        }


        return {

            tax:

                Math.max(
                    0,
                    tax
                ),

            marginalRate:

                marginalRate,

            breakdown:

                breakdown

        };

    }


    /* ======================================================
       CALCULATE EFFECTIVE TAX RATE
    ====================================================== */

    function calculateEffectiveRate(
        tax,
        grossIncome
    ) {

        if (
            grossIncome <= 0
        ) {

            return 0;

        }


        return (
            tax /
            grossIncome
        ) * 100;

    }


    /* ======================================================
       GET BRACKET LABEL
    ====================================================== */

    function getBracketLabel(
        lower,
        upper
    ) {

        const lowerText =
            formatCurrency(
                lower
            );


        if (
            upper === Infinity
        ) {

            return (
                "Over " +
                lowerText
            );

        }


        return (

            lowerText +
            " – " +
            formatCurrency(
                upper
            )

        );

    }


    /* ======================================================
       CREATE TAX BREAKDOWN HTML
    ====================================================== */

    function createTaxBreakdownHTML(
        breakdown
    ) {

        let html =
            "";


        html += `

            <div class="info-box">

                <h3>
                    Tax Bracket Breakdown
                </h3>

                <div class="table-wrapper">

                    <table class="amortization-table">

                        <thead>

                            <tr>

                                <th>
                                    Tax Bracket
                                </th>

                                <th>
                                    Rate
                                </th>

                                <th>
                                    Taxable in Bracket
                                </th>

                                <th>
                                    Tax
                                </th>

                            </tr>

                        </thead>

                        <tbody>

        `;


        breakdown.forEach(
            function (row) {

                html += `

                    <tr>

                        <td>
                            ${getBracketLabel(
                                row.lower,
                                row.upper
                            )}
                        </td>

                        <td>
                            ${formatRate(
                                row.rate
                            )}
                        </td>

                        <td>
                            ${formatCurrency(
                                row.taxableAmount
                            )}
                        </td>

                        <td>
                            ${formatCurrency(
                                row.tax
                            )}
                        </td>

                    </tr>

                `;

            }
        );


        html += `

                        </tbody>

                    </table>

                </div>

            </div>

        `;


        return html;

    }


    /* ======================================================
       CREATE RESULTS HTML
    ====================================================== */

    function createResultsHTML(
        grossIncome,
        status,
        standardDeduction,
        additionalDeductions,
        totalDeductions,
        taxableIncome,
        federalTax,
        effectiveRate,
        marginalRate,
        breakdown
    ) {

        let html =
            "";


        /* ==================================================
           RESULT CARDS
        ================================================== */

        html += `

            <div class="calculator-results-grid">


                <div class="result-card">

                    <h3>
                        Taxable Income
                    </h3>

                    <p class="result-value">
                        ${formatCurrency(
                            taxableIncome
                        )}
                    </p>

                </div>


                <div class="result-card">

                    <h3>
                        Federal Income Tax
                    </h3>

                    <p class="result-value">
                        ${formatCurrency(
                            federalTax
                        )}
                    </p>

                </div>


                <div class="result-card">

                    <h3>
                        Effective Tax Rate
                    </h3>

                    <p class="result-value">
                        ${formatPercentage(
                            effectiveRate
                        )}
                    </p>

                </div>


                <div class="result-card">

                    <h3>
                        Marginal Tax Rate
                    </h3>

                    <p class="result-value">
                        ${formatRate(
                            marginalRate
                        )}
                    </p>

                </div>


            </div>

        `;


        /* ==================================================
           TAX DETAILS
        ================================================== */

        html += `

            <div class="info-box">

                <h3>
                    Calculation Details
                </h3>

                <p>

                    <strong>
                        Tax Year:
                    </strong>

                    ${TAX_YEAR}

                </p>

                <p>

                    <strong>
                        Filing Status:
                    </strong>

                    ${FILING_STATUS_NAMES[
                        status
                    ]}

                </p>

                <p>

                    <strong>
                        Gross Income:
                    </strong>

                    ${formatCurrency(
                        grossIncome
                    )}

                </p>

                <p>

                    <strong>
                        Standard Deduction:
                    </strong>

                    ${formatCurrency(
                        standardDeduction
                    )}

                </p>

                <p>

                    <strong>
                        Additional Deductions:
                    </strong>

                    ${formatCurrency(
                        additionalDeductions
                    )}

                </p>

                <p>

                    <strong>
                        Total Deductions:
                    </strong>

                    ${formatCurrency(
                        totalDeductions
                    )}

                </p>

                <p>

                    <strong>
                        Taxable Income:
                    </strong>

                    ${formatCurrency(
                        taxableIncome
                    )}

                </p>

                <p>

                    <strong>
                        Estimated Federal Income Tax:
                    </strong>

                    ${formatCurrency(
                        federalTax
                    )}

                </p>

            </div>

        `;


        /* ==================================================
           TAKE-HOME ESTIMATE
        ================================================== */

        const incomeAfterFederalTax =
            Math.max(
                0,
                grossIncome -
                federalTax
            );


        html += `

            <div class="info-box">

                <h3>
                    Income After Estimated Federal Income Tax
                </h3>

                <p>

                    Based only on this simplified federal
                    income-tax estimate, your income after
                    estimated federal income tax would be
                    approximately:

                </p>

                <p class="text-center">

                    <strong>
                        ${formatCurrency(
                            incomeAfterFederalTax
                        )}
                    </strong>

                </p>

                <p class="small-text">

                    This is not a complete take-home-pay
                    calculation. State taxes, Social Security,
                    Medicare, benefits, retirement contributions,
                    and other payroll deductions are not included.

                </p>

            </div>

        `;


        /* ==================================================
           TAX BREAKDOWN
        ================================================== */

        html +=
            createTaxBreakdownHTML(
                breakdown
            );


        /* ==================================================
           WHAT THE RESULT MEANS
        ================================================== */

        html += `

            <div class="info-box">

                <h3>
                    What This Result Means
                </h3>

                <p>

                    Based on a gross annual income of

                    <strong>
                        ${formatCurrency(
                            grossIncome
                        )}
                    </strong>

                    and the selected filing status,
                    the estimated taxable income is

                    <strong>
                        ${formatCurrency(
                            taxableIncome
                        )}
                    </strong>.

                </p>

                <p>

                    The estimated federal income tax is

                    <strong>
                        ${formatCurrency(
                            federalTax
                        )}
                    </strong>.

                </p>

                <p>

                    Your estimated effective federal income
                    tax rate is

                    <strong>
                        ${formatPercentage(
                            effectiveRate
                        )}
                    </strong>,

                    while your marginal tax rate is

                    <strong>
                        ${formatRate(
                            marginalRate
                        )}
                    </strong>.

                </p>

            </div>

        `;


        /* ==================================================
           IMPORTANT NOTE
        ================================================== */

        html += `

            <div class="info-box">

                <h3>
                    Important
                </h3>

                <p>

                    This calculator provides a simplified
                    estimate of 2026 US federal individual
                    income tax.

                </p>

                <p>

                    It does not calculate state or local taxes,
                    Social Security or Medicare taxes, capital
                    gains taxes, alternative minimum tax,
                    detailed itemized deductions, or all
                    available tax credits.

                </p>

                <p>

                    Actual tax liability can differ based on
                    your complete tax situation.

                </p>

            </div>

        `;


        return html;

    }


    /* ======================================================
       UPDATE SUMMARY
    ====================================================== */

    function updateSummary(
        grossIncome,
        status,
        standardDeduction,
        additionalDeductions,
        totalDeductions,
        taxableIncome,
        federalTax,
        effectiveRate,
        marginalRate
    ) {

        if (
            summaryTaxableIncome
        ) {

            summaryTaxableIncome.textContent =
                formatCurrency(
                    taxableIncome
                );

        }


        if (
            summaryFederalTax
        ) {

            summaryFederalTax.textContent =
                formatCurrency(
                    federalTax
                );

        }


        if (
            summaryEffectiveRate
        ) {

            summaryEffectiveRate.textContent =
                formatPercentage(
                    effectiveRate
                );

        }


        if (
            summaryMarginalRate
        ) {

            summaryMarginalRate.textContent =
                formatRate(
                    marginalRate
                );

        }


        if (
            summaryFilingStatus
        ) {

            summaryFilingStatus.textContent =
                FILING_STATUS_NAMES[
                    status
                ];

        }


        if (
            summaryGrossIncome
        ) {

            summaryGrossIncome.textContent =
                formatCurrency(
                    grossIncome
                );

        }


        if (
            summaryStandardDeduction
        ) {

            summaryStandardDeduction.textContent =
                formatCurrency(
                    standardDeduction
                );

        }


        if (
            summaryAdditionalDeductions
        ) {

            summaryAdditionalDeductions.textContent =
                formatCurrency(
                    additionalDeductions
                );

        }


        if (
            summaryTotalDeductions
        ) {

            summaryTotalDeductions.textContent =
                formatCurrency(
                    totalDeductions
                );

        }


        if (
            summaryTax
        ) {

            summaryTax.textContent =
                formatCurrency(
                    federalTax
                );

        }

    }


    /* ======================================================
       RESET SUMMARY
    ====================================================== */

    function resetSummary() {

        if (
            summaryTaxableIncome
        ) {

            summaryTaxableIncome.textContent =
                "$0.00";

        }


        if (
            summaryFederalTax
        ) {

            summaryFederalTax.textContent =
                "$0.00";

        }


        if (
            summaryEffectiveRate
        ) {

            summaryEffectiveRate.textContent =
                "0.00%";

        }


        if (
            summaryMarginalRate
        ) {

            summaryMarginalRate.textContent =
                "0.00%";

        }


        if (
            summaryFilingStatus
        ) {

            summaryFilingStatus.textContent =
                "Single";

        }


        if (
            summaryGrossIncome
        ) {

            summaryGrossIncome.textContent =
                "$0.00";

        }


        if (
            summaryStandardDeduction
        ) {

            summaryStandardDeduction.textContent =
                "$0.00";

        }


        if (
            summaryAdditionalDeductions
        ) {

            summaryAdditionalDeductions.textContent =
                "$0.00";

        }


        if (
            summaryTotalDeductions
        ) {

            summaryTotalDeductions.textContent =
                "$0.00";

        }


        if (
            summaryTax
        ) {

            summaryTax.textContent =
                "$0.00";

        }

    }


    /* ======================================================
       SET CALCULATE BUTTON LOADING STATE
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
                "Calculating...";

        } else {

            calculateButton.disabled =
                false;

            calculateButton.textContent =
                "Calculate Tax";

        }

    }


    /* ======================================================
       CALCULATE TAX
    ====================================================== */

    function calculateTax() {

        clearError();


        const {
            income,
            additionalDeductions,
            status
        } = getInputs();


        /* ==================================================
           VALIDATION
        ================================================== */

        if (
            !validateInputs(
                income,
                additionalDeductions,
                status
            )
        ) {

            return;

        }


        setLoadingState(true);


        try {


            /* ==============================================
               STANDARD DEDUCTION
            ============================================== */

            const standardDeduction =
                STANDARD_DEDUCTIONS[
                    status
                ];


            /* ==============================================
               TOTAL DEDUCTIONS
            ============================================== */

            const totalDeductions =
                standardDeduction +
                additionalDeductions;


            /* ==============================================
               TAXABLE INCOME
            ============================================== */

            const taxableIncome =
                calculateTaxableIncome(
                    income,
                    standardDeduction,
                    additionalDeductions
                );


            /* ==============================================
               FEDERAL TAX
            ============================================== */

            const taxResult =
                calculateFederalTax(
                    taxableIncome,
                    status
                );


            const federalTax =
                taxResult.tax;


            const marginalRate =
                taxResult.marginalRate;


            /* ==============================================
               EFFECTIVE TAX RATE
            ============================================== */

            const effectiveRate =
                calculateEffectiveRate(
                    federalTax,
                    income
                );


            /* ==============================================
               UPDATE RESULTS
            ============================================== */

            if (
                resultContent
            ) {

                resultContent.innerHTML =
                    createResultsHTML(
                        income,
                        status,
                        standardDeduction,
                        additionalDeductions,
                        totalDeductions,
                        taxableIncome,
                        federalTax,
                        effectiveRate,
                        marginalRate,
                        taxResult.breakdown
                    );

            }


            /* ==============================================
               SHOW RESULTS
            ============================================== */

            if (
                resultBox
            ) {

                resultBox.hidden =
                    false;

            }


            /* ==============================================
               UPDATE SUMMARY
            ============================================== */

            updateSummary(
                income,
                status,
                standardDeduction,
                additionalDeductions,
                totalDeductions,
                taxableIncome,
                federalTax,
                effectiveRate,
                marginalRate
            );


            /* ==============================================
               SCROLL TO RESULTS
            ============================================== */

            setTimeout(
                function () {

                    if (
                        resultBox
                    ) {

                        resultBox.scrollIntoView({

                            behavior:
                                "smooth",

                            block:
                                "start"

                        });

                    }

                },
                100
            );


        } catch (error) {

            console.error(
                "Tax calculation error:",
                error
            );


            showError(
                "Unable to calculate the tax estimate. Please check your inputs and try again."
            );

        } finally {

            setLoadingState(false);

        }

    }


    /* ======================================================
       RESET CALCULATOR
    ====================================================== */

    function resetCalculator() {

        clearError();


        /* ==================================================
           RESET INPUTS
        ================================================== */

        if (
            filingStatus
        ) {

            filingStatus.value =
                "single";

        }


        if (
            incomeInput
        ) {

            incomeInput.value =
                "";

        }


        if (
            deductionsInput
        ) {

            deductionsInput.value =
                "0";

        }


        /* ==================================================
           CLEAR RESULTS
        ================================================== */

        if (
            resultContent
        ) {

            resultContent.innerHTML =
                "";

        }


        if (
            resultBox
        ) {

            resultBox.hidden =
                true;

        }


        /* ==================================================
           RESET SUMMARY
        ================================================== */

        resetSummary();


        /* ==================================================
           RETURN FOCUS
        ================================================== */

        if (
            incomeInput
        ) {

            incomeInput.focus();

        }

    }


    /* ======================================================
       CALCULATE BUTTON EVENT
    ====================================================== */

    if (
        calculateButton
    ) {

        calculateButton.addEventListener(
            "click",
            calculateTax
        );

    }


    /* ======================================================
       RESET BUTTON EVENT
    ====================================================== */

    if (
        resetButton
    ) {

        resetButton.addEventListener(
            "click",
            resetCalculator
        );

    }


    /* ======================================================
       ENTER KEY SUPPORT
    ====================================================== */

    [
        incomeInput,
        deductionsInput

    ].forEach(
        function (input) {

            if (!input) {
                return;
            }


            input.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        calculateTax();

                    }

                }
            );

        }
    );


    /* ======================================================
       CLEAR ERROR WHEN INPUT CHANGES
    ====================================================== */

    [
        filingStatus,
        incomeInput,
        deductionsInput

    ].forEach(
        function (element) {

            if (!element) {
                return;
            }


            element.addEventListener(
                "input",
                function () {

                    clearError();

                }
            );


            element.addEventListener(
                "change",
                function () {

                    clearError();

                }
            );

        }
    );


    /* ======================================================
       INITIALIZATION
    ====================================================== */

    resetSummary();

});