/* ==========================================================
   SALARY CALCULATOR
   CalclyWorld

   Scope:
   - USA-focused gross salary/pay calculator
   - Annual, monthly, biweekly, weekly, daily, hourly pay
   - Overtime estimate
   - No tax calculation
   - No take-home-pay calculation
========================================================== */

document.addEventListener("DOMContentLoaded", function () {


    /* ======================================================
       ELEMENTS
    ====================================================== */

    const salaryAmount =
        document.getElementById(
            "salary-amount"
        );

    const salaryFrequency =
        document.getElementById(
            "salary-frequency"
        );

    const hoursPerWeek =
        document.getElementById(
            "salary-hours-per-week"
        );

    const weeksPerYear =
        document.getElementById(
            "salary-weeks-per-year"
        );

    const overtimeHours =
        document.getElementById(
            "salary-overtime-hours"
        );

    const overtimeMultiplier =
        document.getElementById(
            "salary-overtime-multiplier"
        );

    const calculateButton =
        document.getElementById(
            "calculate-salary"
        );

    const resetButton =
        document.getElementById(
            "reset-salary"
        );

    const errorBox =
        document.getElementById(
            "salary-error"
        );

    const resultBox =
        document.getElementById(
            "salary-result"
        );

    const resultContent =
        document.getElementById(
            "salary-result-content"
        );


    /* ======================================================
       SUMMARY ELEMENTS
    ====================================================== */

    const summaryAnnualSalary =
        document.getElementById(
            "summary-annual-salary"
        );

    const summaryMonthlySalary =
        document.getElementById(
            "summary-monthly-salary"
        );

    const summaryWeeklyPay =
        document.getElementById(
            "summary-weekly-pay"
        );

    const summaryHourlyPay =
        document.getElementById(
            "summary-hourly-pay"
        );

    const summaryBiweeklyPay =
        document.getElementById(
            "summary-biweekly-pay"
        );

    const summaryDailyPay =
        document.getElementById(
            "summary-daily-pay"
        );

    const summaryRegularPay =
        document.getElementById(
            "summary-regular-pay"
        );

    const summaryOvertimePay =
        document.getElementById(
            "summary-overtime-pay"
        );

    const summaryTotalGrossPay =
        document.getElementById(
            "summary-total-gross-pay"
        );


    /* ======================================================
       BREAKDOWN ELEMENTS
    ====================================================== */

    const breakdownAnnual =
        document.getElementById(
            "breakdown-annual"
        );

    const breakdownMonthly =
        document.getElementById(
            "breakdown-monthly"
        );

    const breakdownBiweekly =
        document.getElementById(
            "breakdown-biweekly"
        );

    const breakdownWeekly =
        document.getElementById(
            "breakdown-weekly"
        );

    const breakdownDaily =
        document.getElementById(
            "breakdown-daily"
        );

    const breakdownHourly =
        document.getElementById(
            "breakdown-hourly"
        );


    /* ======================================================
       OVERTIME RESULT ELEMENTS
    ====================================================== */

    const overtimeRegularRate =
        document.getElementById(
            "overtime-regular-rate"
        );

    const overtimeHourlyRate =
        document.getElementById(
            "overtime-hourly-rate"
        );

    const overtimeHoursWeek =
        document.getElementById(
            "overtime-hours-week"
        );

    const overtimeAnnualPay =
        document.getElementById(
            "overtime-annual-pay"
        );

    const overtimeMultiplierDisplay =
        document.getElementById(
            "overtime-multiplier-display"
        );

    const overtimeTotalAnnual =
        document.getElementById(
            "overtime-total-annual"
        );


    /* ======================================================
       PAY PERIOD CONSTANTS
    ====================================================== */

    const PAY_PERIODS = {

        annual: 1,

        monthly: 12,

        biweekly: 26,

        weekly: 52

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
       FORMAT NUMBER
    ====================================================== */

    function formatNumber(value) {

        const numericValue =
            Number(value);


        if (
            !Number.isFinite(
                numericValue
            )
        ) {

            return "0.00";

        }


        return new Intl.NumberFormat(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        ).format(
            numericValue
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

        const amount =
            Number(
                salaryAmount
                    ? salaryAmount.value
                    : NaN
            );


        const frequency =
            salaryFrequency
                ? salaryFrequency.value
                : "";


        const weeklyHours =
            Number(
                hoursPerWeek
                    ? hoursPerWeek.value
                    : NaN
            );


        const workingWeeks =
            Number(
                weeksPerYear
                    ? weeksPerYear.value
                    : NaN
            );


        const weeklyOvertime =
            Number(
                overtimeHours
                    ? overtimeHours.value
                    : NaN
            );


        const multiplier =
            Number(
                overtimeMultiplier
                    ? overtimeMultiplier.value
                    : NaN
            );


        return {

            amount,

            frequency,

            weeklyHours,

            workingWeeks,

            weeklyOvertime,

            multiplier

        };

    }


    /* ======================================================
       VALIDATE INPUTS
    ====================================================== */

    function validateInputs(
        amount,
        frequency,
        weeklyHours,
        workingWeeks,
        weeklyOvertime,
        multiplier
    ) {


        if (
            !Number.isFinite(
                amount
            ) ||
            amount <= 0
        ) {

            showError(
                "Please enter a salary amount greater than $0."
            );


            if (salaryAmount) {

                salaryAmount.focus();

            }


            return false;

        }


        if (
            !PAY_PERIODS[
                frequency
            ] &&
            frequency !== "daily" &&
            frequency !== "hourly"
        ) {

            showError(
                "Please select a valid salary frequency."
            );


            if (salaryFrequency) {

                salaryFrequency.focus();

            }


            return false;

        }


        if (
            !Number.isFinite(
                weeklyHours
            ) ||
            weeklyHours <= 0 ||
            weeklyHours > 168
        ) {

            showError(
                "Please enter work hours per week between 0.01 and 168."
            );


            if (hoursPerWeek) {

                hoursPerWeek.focus();

            }


            return false;

        }


        if (
            !Number.isFinite(
                workingWeeks
            ) ||
            workingWeeks <= 0 ||
            workingWeeks > 52
        ) {

            showError(
                "Please enter working weeks per year between 1 and 52."
            );


            if (weeksPerYear) {

                weeksPerYear.focus();

            }


            return false;

        }


        if (
            !Number.isFinite(
                weeklyOvertime
            ) ||
            weeklyOvertime < 0 ||
            weeklyOvertime > 168
        ) {

            showError(
                "Please enter overtime hours per week between 0 and 168."
            );


            if (overtimeHours) {

                overtimeHours.focus();

            }


            return false;

        }


        if (
            !Number.isFinite(
                multiplier
            ) ||
            multiplier <= 0
        ) {

            showError(
                "Please select a valid overtime multiplier."
            );


            if (overtimeMultiplier) {

                overtimeMultiplier.focus();

            }


            return false;

        }


        if (
            weeklyOvertime >
            weeklyHours
        ) {

            showError(
                "Overtime hours cannot be greater than total work hours per week."
            );


            if (overtimeHours) {

                overtimeHours.focus();

            }


            return false;

        }


        return true;

    }


    /* ======================================================
       CONVERT INPUT TO ANNUAL SALARY
    ====================================================== */

    function calculateAnnualSalary(
        amount,
        frequency,
        weeklyHours,
        workingWeeks
    ) {

        switch (frequency) {


            case "annual":

                return amount;


            case "monthly":

                return amount * 12;


            case "biweekly":

                return amount * 26;


            case "weekly":

                return amount * workingWeeks;


            case "daily":

                /*
                    Assumes 5 working days per week.
                */

                return (
                    amount *
                    5 *
                    workingWeeks
                );


            case "hourly":

                return (
                    amount *
                    weeklyHours *
                    workingWeeks
                );


            default:

                return NaN;

        }

    }


    /* ======================================================
       CALCULATE PAY PERIODS
    ====================================================== */

    function calculatePayPeriods(
        annualSalary,
        weeklyHours,
        workingWeeks
    ) {

        const monthly =
            annualSalary / 12;


        const biweekly =
            annualSalary / 26;


        const weekly =
            annualSalary /
            workingWeeks;


        const daily =
            weekly / 5;


        const hourly =
            annualSalary /
            (
                workingWeeks *
                weeklyHours
            );


        return {

            annual:
                annualSalary,

            monthly:
                monthly,

            biweekly:
                biweekly,

            weekly:
                weekly,

            daily:
                daily,

            hourly:
                hourly

        };

    }


    /* ======================================================
       CALCULATE OVERTIME
    ====================================================== */

    function calculateOvertime(
        hourlyRate,
        weeklyOvertime,
        multiplier,
        workingWeeks
    ) {

        const overtimeRate =
            hourlyRate *
            multiplier;


        const weeklyOvertimePay =
            overtimeRate *
            weeklyOvertime;


        const annualOvertimePay =
            weeklyOvertimePay *
            workingWeeks;


        return {

            regularRate:
                hourlyRate,

            overtimeRate:
                overtimeRate,

            weeklyOvertimePay:
                weeklyOvertimePay,

            annualOvertimePay:
                annualOvertimePay

        };

    }


    /* ======================================================
       UPDATE SUMMARY
    ====================================================== */

    function updateSummary(
        pay,
        regularAnnualPay,
        annualOvertimePay
    ) {

        const totalAnnualGrossPay =
            regularAnnualPay +
            annualOvertimePay;


        if (
            summaryAnnualSalary
        ) {

            summaryAnnualSalary.textContent =
                formatCurrency(
                    pay.annual
                );

        }


        if (
            summaryMonthlySalary
        ) {

            summaryMonthlySalary.textContent =
                formatCurrency(
                    pay.monthly
                );

        }


        if (
            summaryWeeklyPay
        ) {

            summaryWeeklyPay.textContent =
                formatCurrency(
                    pay.weekly
                );

        }


        if (
            summaryHourlyPay
        ) {

            summaryHourlyPay.textContent =
                formatCurrency(
                    pay.hourly
                );

        }


        if (
            summaryBiweeklyPay
        ) {

            summaryBiweeklyPay.textContent =
                formatCurrency(
                    pay.biweekly
                );

        }


        if (
            summaryDailyPay
        ) {

            summaryDailyPay.textContent =
                formatCurrency(
                    pay.daily
                );

        }


        if (
            summaryRegularPay
        ) {

            summaryRegularPay.textContent =
                formatCurrency(
                    regularAnnualPay
                );

        }


        if (
            summaryOvertimePay
        ) {

            summaryOvertimePay.textContent =
                formatCurrency(
                    annualOvertimePay
                );

        }


        if (
            summaryTotalGrossPay
        ) {

            summaryTotalGrossPay.textContent =
                formatCurrency(
                    totalAnnualGrossPay
                );

        }

    }


    /* ======================================================
       UPDATE BREAKDOWN
    ====================================================== */

    function updateBreakdown(
        pay
    ) {

        if (
            breakdownAnnual
        ) {

            breakdownAnnual.textContent =
                formatCurrency(
                    pay.annual
                );

        }


        if (
            breakdownMonthly
        ) {

            breakdownMonthly.textContent =
                formatCurrency(
                    pay.monthly
                );

        }


        if (
            breakdownBiweekly
        ) {

            breakdownBiweekly.textContent =
                formatCurrency(
                    pay.biweekly
                );

        }


        if (
            breakdownWeekly
        ) {

            breakdownWeekly.textContent =
                formatCurrency(
                    pay.weekly
                );

        }


        if (
            breakdownDaily
        ) {

            breakdownDaily.textContent =
                formatCurrency(
                    pay.daily
                );

        }


        if (
            breakdownHourly
        ) {

            breakdownHourly.textContent =
                formatCurrency(
                    pay.hourly
                );

        }

    }


    /* ======================================================
       UPDATE OVERTIME DISPLAY
    ====================================================== */

    function updateOvertimeDisplay(
        overtime,
        weeklyOvertime,
        multiplier,
        totalAnnualPay
    ) {

        if (
            overtimeRegularRate
        ) {

            overtimeRegularRate.textContent =
                formatCurrency(
                    overtime.regularRate
                );

        }


        if (
            overtimeHourlyRate
        ) {

            overtimeHourlyRate.textContent =
                formatCurrency(
                    overtime.overtimeRate
                );

        }


        if (
            overtimeHoursWeek
        ) {

            overtimeHoursWeek.textContent =
                formatNumber(
                    weeklyOvertime
                );

        }


        if (
            overtimeAnnualPay
        ) {

            overtimeAnnualPay.textContent =
                formatCurrency(
                    overtime.annualOvertimePay
                );

        }


        if (
            overtimeMultiplierDisplay
        ) {

            overtimeMultiplierDisplay.textContent =
                formatNumber(
                    multiplier
                ) +
                "×";

        }


        if (
            overtimeTotalAnnual
        ) {

            overtimeTotalAnnual.textContent =
                formatCurrency(
                    totalAnnualPay
                );

        }

    }


    /* ======================================================
       CREATE RESULT HTML
    ====================================================== */

    function createResultsHTML(
        pay,
        regularAnnualPay,
        annualOvertimePay,
        totalAnnualPay,
        weeklyOvertime,
        overtimeMultiplierValue
    ) {

        let html = "";


        /* ==================================================
           MAIN RESULT CARDS
        ================================================== */

        html += `

            <div class="calculator-results-grid">


                <div class="result-card">

                    <h3>
                        Annual Salary
                    </h3>

                    <p class="result-value">
                        ${formatCurrency(
                            pay.annual
                        )}
                    </p>

                </div>


                <div class="result-card">

                    <h3>
                        Monthly Salary
                    </h3>

                    <p class="result-value">
                        ${formatCurrency(
                            pay.monthly
                        )}
                    </p>

                </div>


                <div class="result-card">

                    <h3>
                        Weekly Pay
                    </h3>

                    <p class="result-value">
                        ${formatCurrency(
                            pay.weekly
                        )}
                    </p>

                </div>


                <div class="result-card">

                    <h3>
                        Hourly Pay
                    </h3>

                    <p class="result-value">
                        ${formatCurrency(
                            pay.hourly
                        )}
                    </p>

                </div>


            </div>

        `;


        /* ==================================================
           PAY DETAILS
        ================================================== */

        html += `

            <div class="info-box">

                <h3>
                    Salary Details
                </h3>

                <p>

                    <strong>
                        Annual Salary:
                    </strong>

                    ${formatCurrency(
                        pay.annual
                    )}

                </p>

                <p>

                    <strong>
                        Monthly Salary:
                    </strong>

                    ${formatCurrency(
                        pay.monthly
                    )}

                </p>

                <p>

                    <strong>
                        Biweekly Pay:
                    </strong>

                    ${formatCurrency(
                        pay.biweekly
                    )}

                </p>

                <p>

                    <strong>
                        Weekly Pay:
                    </strong>

                    ${formatCurrency(
                        pay.weekly
                    )}

                </p>

                <p>

                    <strong>
                        Daily Pay:
                    </strong>

                    ${formatCurrency(
                        pay.daily
                    )}

                </p>

                <p>

                    <strong>
                        Hourly Pay:
                    </strong>

                    ${formatCurrency(
                        pay.hourly
                    )}

                </p>

            </div>

        `;


        /* ==================================================
           OVERTIME RESULT
        ================================================== */

        html += `

            <div class="info-box">

                <h3>
                    Overtime Estimate
                </h3>

                <p>

                    <strong>
                        Overtime Hours Per Week:
                    </strong>

                    ${formatNumber(
                        weeklyOvertime
                    )}

                </p>

                <p>

                    <strong>
                        Overtime Multiplier:
                    </strong>

                    ${formatNumber(
                        overtimeMultiplierValue
                    )}×

                </p>

                <p>

                    <strong>
                        Annual Overtime Pay:
                    </strong>

                    ${formatCurrency(
                        annualOvertimePay
                    )}

                </p>

                <p>

                    <strong>
                        Total Annual Gross Pay:
                    </strong>

                    ${formatCurrency(
                        totalAnnualPay
                    )}

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

                    These results represent estimated gross
                    earnings before taxes and other deductions.

                </p>

                <p>

                    Actual pay can vary depending on your
                    employer's payroll schedule, unpaid time,
                    bonuses, commissions, benefits, deductions,
                    and other compensation.

                </p>

                <p>

                    Overtime calculations are mathematical
                    estimates and do not determine whether
                    overtime is legally required.

                </p>

            </div>

        `;


        return html;

    }


    /* ======================================================
       RESET SUMMARY
    ====================================================== */

    function resetSummary() {

        if (
            summaryAnnualSalary
        ) {

            summaryAnnualSalary.textContent =
                "$0.00";

        }


        if (
            summaryMonthlySalary
        ) {

            summaryMonthlySalary.textContent =
                "$0.00";

        }


        if (
            summaryWeeklyPay
        ) {

            summaryWeeklyPay.textContent =
                "$0.00";

        }


        if (
            summaryHourlyPay
        ) {

            summaryHourlyPay.textContent =
                "$0.00";

        }


        if (
            summaryBiweeklyPay
        ) {

            summaryBiweeklyPay.textContent =
                "$0.00";

        }


        if (
            summaryDailyPay
        ) {

            summaryDailyPay.textContent =
                "$0.00";

        }


        if (
            summaryRegularPay
        ) {

            summaryRegularPay.textContent =
                "$0.00";

        }


        if (
            summaryOvertimePay
        ) {

            summaryOvertimePay.textContent =
                "$0.00";

        }


        if (
            summaryTotalGrossPay
        ) {

            summaryTotalGrossPay.textContent =
                "$0.00";

        }


        if (
            breakdownAnnual
        ) {

            breakdownAnnual.textContent =
                "$0.00";

        }


        if (
            breakdownMonthly
        ) {

            breakdownMonthly.textContent =
                "$0.00";

        }


        if (
            breakdownBiweekly
        ) {

            breakdownBiweekly.textContent =
                "$0.00";

        }


        if (
            breakdownWeekly
        ) {

            breakdownWeekly.textContent =
                "$0.00";

        }


        if (
            breakdownDaily
        ) {

            breakdownDaily.textContent =
                "$0.00";

        }


        if (
            breakdownHourly
        ) {

            breakdownHourly.textContent =
                "$0.00";

        }


        if (
            overtimeRegularRate
        ) {

            overtimeRegularRate.textContent =
                "$0.00";

        }


        if (
            overtimeHourlyRate
        ) {

            overtimeHourlyRate.textContent =
                "$0.00";

        }


        if (
            overtimeHoursWeek
        ) {

            overtimeHoursWeek.textContent =
                "0.00";

        }


        if (
            overtimeAnnualPay
        ) {

            overtimeAnnualPay.textContent =
                "$0.00";

        }


        if (
            overtimeMultiplierDisplay
        ) {

            overtimeMultiplierDisplay.textContent =
                "1.5×";

        }


        if (
            overtimeTotalAnnual
        ) {

            overtimeTotalAnnual.textContent =
                "$0.00";

        }

    }


    /* ======================================================
       MAIN CALCULATION
    ====================================================== */

    function calculateSalary() {

        clearError();


        const {
            amount,
            frequency,
            weeklyHours,
            workingWeeks,
            weeklyOvertime,
            multiplier
        } = getInputs();


        /* ==================================================
           VALIDATE
        ================================================== */

        if (
            !validateInputs(
                amount,
                frequency,
                weeklyHours,
                workingWeeks,
                weeklyOvertime,
                multiplier
            )
        ) {

            return;

        }


        try {


            /* ==============================================
               ANNUAL SALARY
            ============================================== */

            const annualSalary =
                calculateAnnualSalary(
                    amount,
                    frequency,
                    weeklyHours,
                    workingWeeks
                );


            if (
                !Number.isFinite(
                    annualSalary
                ) ||
                annualSalary <= 0
            ) {

                throw new Error(
                    "Invalid annual salary."
                );

            }


            /* ==============================================
               PAY PERIODS
            ============================================== */

            const pay =
                calculatePayPeriods(
                    annualSalary,
                    weeklyHours,
                    workingWeeks
                );


            /* ==============================================
               OVERTIME
            ============================================== */

            const overtime =
                calculateOvertime(
                    pay.hourly,
                    weeklyOvertime,
                    multiplier,
                    workingWeeks
                );


            /* ==============================================
               TOTAL PAY
            ============================================== */

            const regularAnnualPay =
                annualSalary;


            const annualOvertimePay =
                overtime.annualOvertimePay;


            const totalAnnualPay =
                regularAnnualPay +
                annualOvertimePay;


            /* ==============================================
               CREATE RESULTS
            ============================================== */

            if (
                resultContent
            ) {

                resultContent.innerHTML =
                    createResultsHTML(
                        pay,
                        regularAnnualPay,
                        annualOvertimePay,
                        totalAnnualPay,
                        weeklyOvertime,
                        multiplier
                    );

            }


            /* ==============================================
               SHOW RESULT
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
                pay,
                regularAnnualPay,
                annualOvertimePay
            );


            /* ==============================================
               UPDATE BREAKDOWN
            ============================================== */

            updateBreakdown(
                pay
            );


            /* ==============================================
               UPDATE OVERTIME
            ============================================== */

            updateOvertimeDisplay(
                overtime,
                weeklyOvertime,
                multiplier,
                totalAnnualPay
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
                "Salary calculation error:",
                error
            );


            showError(
                "Unable to calculate salary. Please check your inputs and try again."
            );

        }

    }


    /* ======================================================
       RESET CALCULATOR
    ====================================================== */

    function resetCalculator() {

        clearError();


        if (
            salaryAmount
        ) {

            salaryAmount.value =
                "";

        }


        if (
            salaryFrequency
        ) {

            salaryFrequency.value =
                "annual";

        }


        if (
            hoursPerWeek
        ) {

            hoursPerWeek.value =
                "40";

        }


        if (
            weeksPerYear
        ) {

            weeksPerYear.value =
                "52";

        }


        if (
            overtimeHours
        ) {

            overtimeHours.value =
                "0";

        }


        if (
            overtimeMultiplier
        ) {

            overtimeMultiplier.value =
                "1.5";

        }


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


        resetSummary();


        if (
            salaryAmount
        ) {

            salaryAmount.focus();

        }

    }


    /* ======================================================
       CALCULATE BUTTON
    ====================================================== */

    if (
        calculateButton
    ) {

        calculateButton.addEventListener(
            "click",
            calculateSalary
        );

    }


    /* ======================================================
       RESET BUTTON
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
        salaryAmount,
        salaryFrequency,
        hoursPerWeek,
        weeksPerYear,
        overtimeHours,
        overtimeMultiplier

    ].forEach(
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

                        calculateSalary();

                    }

                }
            );

        }
    );


    /* ======================================================
       CLEAR ERROR WHEN INPUT CHANGES
    ====================================================== */

    [
        salaryAmount,
        salaryFrequency,
        hoursPerWeek,
        weeksPerYear,
        overtimeHours,
        overtimeMultiplier

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
       INITIALIZE
    ====================================================== */

    resetSummary();

});