"use strict";

/*
===========================================================
CalclyWorld GST Calculator
File: gst-calculator.js
===========================================================

Features:
- Add GST
- Remove GST / Reverse GST
- Preset GST rates
- Custom GST rate
- CGST + SGST / UTGST breakdown
- IGST breakdown
- Input validation
- Reset support
- Accessible result updates
===========================================================
*/


document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       GET HTML ELEMENTS
    ===================================================== */

    const gstForm =
        document.getElementById("gst-form");

    const gstAmount =
        document.getElementById("gst-amount");

    const gstRate =
        document.getElementById("gst-rate");

    const customRateGroup =
        document.getElementById("custom-rate-group");

    const customGstRate =
        document.getElementById("custom-gst-rate");

    const gstOperation =
        document.getElementById("gst-operation");

    const gstTransaction =
        document.getElementById("gst-transaction");

    const gstReset =
        document.getElementById("gst-reset");

    const gstError =
        document.getElementById("gst-error");

    const gstResult =
        document.getElementById("gst-result");

    const gstOriginal =
        document.getElementById("gst-original");

    const gstPercentage =
        document.getElementById("gst-percentage");

    const gstTax =
        document.getElementById("gst-tax");

    const gstTotal =
        document.getElementById("gst-total");

    const gstCgst =
        document.getElementById("gst-cgst");

    const gstSgst =
        document.getElementById("gst-sgst");

    const gstIgst =
        document.getElementById("gst-igst");

    const gstTaxable =
        document.getElementById("gst-taxable");

    const gstBreakdownNote =
        document.getElementById("gst-breakdown-note");


    /* =====================================================
       SAFETY CHECK
    ===================================================== */

    if (!gstForm) {
        return;
    }


    /* =====================================================
       NUMBER FORMATTING
    ===================================================== */

    function formatNumber(value) {

        if (!Number.isFinite(value)) {
            return "0.00";
        }

        return value.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    }


    /* =====================================================
       GET GST RATE
    ===================================================== */

    function getGstRate() {

        if (gstRate.value === "custom") {

            const customValue =
                Number(customGstRate.value);

            return customValue;

        }

        return Number(gstRate.value);

    }


    /* =====================================================
       SHOW ERROR
    ===================================================== */

    function showError(message) {

        gstError.textContent = message;

        gstError.hidden = false;

        gstResult.hidden = true;

    }


    /* =====================================================
       CLEAR ERROR
    ===================================================== */

    function clearError() {

        gstError.textContent = "";

        gstError.hidden = true;

    }


    /* =====================================================
       SHOW / HIDE CUSTOM RATE
    ===================================================== */

    function updateCustomRateVisibility() {

        if (gstRate.value === "custom") {

            customRateGroup.hidden = false;

            customGstRate.required = true;

            setTimeout(function () {

                customGstRate.focus();

            }, 0);

        } else {

            customRateGroup.hidden = true;

            customGstRate.required = false;

            customGstRate.value = "";

        }

    }


    /* =====================================================
       VALIDATE INPUT
    ===================================================== */

    function validateInputs(amount, rate) {


        if (!Number.isFinite(amount)) {

            showError(
                "Please enter a valid amount."
            );

            gstAmount.focus();

            return false;

        }


        if (amount < 0) {

            showError(
                "Amount cannot be negative."
            );

            gstAmount.focus();

            return false;

        }


        if (amount === 0) {

            showError(
                "Please enter an amount greater than zero."
            );

            gstAmount.focus();

            return false;

        }


        if (!Number.isFinite(rate)) {

            showError(
                "Please enter a valid GST rate."
            );

            customGstRate.focus();

            return false;

        }


        if (rate < 0 || rate > 100) {

            showError(
                "GST rate must be between 0% and 100%."
            );

            if (gstRate.value === "custom") {
                customGstRate.focus();
            }

            return false;

        }


        return true;

    }


    /* =====================================================
       CALCULATE GST
    ===================================================== */

    function calculateGST(amount, rate, operation) {


        let taxableAmount;

        let gstAmount;

        let finalAmount;


        /*
        -----------------------------------------------------
        ADD GST
        -----------------------------------------------------
        */

        if (operation === "add") {


            taxableAmount =
                amount;


            gstAmount =
                amount * rate / 100;


            finalAmount =
                amount + gstAmount;

        }


        /*
        -----------------------------------------------------
        REMOVE GST
        -----------------------------------------------------
        */

        else {


            /*
            Reverse GST formula:

            Taxable Amount =
            Inclusive Amount × 100
            ÷ (100 + GST Rate)
            */

            taxableAmount =
                amount * 100 / (100 + rate);


            gstAmount =
                amount - taxableAmount;


            finalAmount =
                amount;

        }


        return {

            taxableAmount: taxableAmount,

            gstAmount: gstAmount,

            finalAmount: finalAmount

        };

    }


    /* =====================================================
       CALCULATE TAX COMPONENTS
    ===================================================== */

    function calculateTaxComponents(
        taxableAmount,
        totalGst,
        transactionType
    ) {


        let cgst = 0;

        let sgst = 0;

        let igst = 0;


        /*
        -----------------------------------------------------
        INTRA-STATE
        -----------------------------------------------------
        */

        if (transactionType === "intra") {

            cgst =
                totalGst / 2;

            sgst =
                totalGst / 2;

        }


        /*
        -----------------------------------------------------
        INTER-STATE
        -----------------------------------------------------
        */

        else {

            igst =
                totalGst;

        }


        return {

            cgst: cgst,

            sgst: sgst,

            igst: igst,

            taxableAmount: taxableAmount

        };

    }


    /* =====================================================
       UPDATE RESULT
    ===================================================== */

    function displayResult(
        calculation,
        rate,
        transactionType
    ) {


        const components =
            calculateTaxComponents(
                calculation.taxableAmount,
                calculation.gstAmount,
                transactionType
            );


        /*
        -----------------------------------------------------
        MAIN RESULT
        -----------------------------------------------------
        */

        gstOriginal.textContent =
            formatNumber(
                calculation.taxableAmount
            );


        gstPercentage.textContent =
            rate.toFixed(2) + "%";


        gstTax.textContent =
            formatNumber(
                calculation.gstAmount
            );


        gstTotal.textContent =
            formatNumber(
                calculation.finalAmount
            );


        /*
        -----------------------------------------------------
        TAX COMPONENTS
        -----------------------------------------------------
        */

        gstCgst.textContent =
            formatNumber(
                components.cgst
            );


        gstSgst.textContent =
            formatNumber(
                components.sgst
            );


        gstIgst.textContent =
            formatNumber(
                components.igst
            );


        gstTaxable.textContent =
            formatNumber(
                components.taxableAmount
            );


        /*
        -----------------------------------------------------
        BREAKDOWN MESSAGE
        -----------------------------------------------------
        */

        if (transactionType === "intra") {

            gstBreakdownNote.textContent =
                "The GST amount is displayed as an equal CGST and SGST/UTGST split for this calculation.";

        } else {

            gstBreakdownNote.textContent =
                "The full GST amount is displayed as IGST for this calculation.";

        }


        /*
        -----------------------------------------------------
        SHOW RESULT
        -----------------------------------------------------
        */

        gstResult.hidden = false;


        /*
        -----------------------------------------------------
        SCROLL RESULT INTO VIEW
        -----------------------------------------------------
        */

        setTimeout(function () {

            gstResult.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });

        }, 50);

    }


    /* =====================================================
       FORM SUBMIT
    ===================================================== */

    gstForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            clearError();


            const amount =
                Number(gstAmount.value);


            const rate =
                getGstRate();


            const operation =
                gstOperation.value;


            const transactionType =
                gstTransaction.value;


            /*
            -------------------------------------------------
            VALIDATE
            -------------------------------------------------
            */

            if (
                !validateInputs(
                    amount,
                    rate
                )
            ) {

                return;

            }


            /*
            -------------------------------------------------
            CALCULATE
            -------------------------------------------------
            */

            const calculation =
                calculateGST(
                    amount,
                    rate,
                    operation
                );


            /*
            -------------------------------------------------
            DISPLAY
            -------------------------------------------------
            */

            displayResult(
                calculation,
                rate,
                transactionType
            );

        }
    );


    /* =====================================================
       GST RATE CHANGE
    ===================================================== */

    gstRate.addEventListener(
        "change",
        function () {

            updateCustomRateVisibility();

            clearError();

        }
    );


    /* =====================================================
       CUSTOM RATE INPUT
    ===================================================== */

    customGstRate.addEventListener(
        "input",
        function () {

            clearError();

        }
    );


    /* =====================================================
       AMOUNT INPUT
    ===================================================== */

    gstAmount.addEventListener(
        "input",
        function () {

            clearError();

        }
    );


    /* =====================================================
       OPERATION CHANGE
    ===================================================== */

    gstOperation.addEventListener(
        "change",
        function () {

            clearError();

        }
    );


    /* =====================================================
       TRANSACTION TYPE CHANGE
    ===================================================== */

    gstTransaction.addEventListener(
        "change",
        function () {

            clearError();

        }
    );


    /* =====================================================
       RESET
    ===================================================== */

    gstForm.addEventListener(
        "reset",
        function () {

            setTimeout(function () {

                clearError();

                gstResult.hidden = true;

                customRateGroup.hidden = true;

                customGstRate.required = false;

                customGstRate.value = "";

                gstOriginal.textContent =
                    "0.00";

                gstPercentage.textContent =
                    "0%";

                gstTax.textContent =
                    "0.00";

                gstTotal.textContent =
                    "0.00";

                gstCgst.textContent =
                    "0.00";

                gstSgst.textContent =
                    "0.00";

                gstIgst.textContent =
                    "0.00";

                gstTaxable.textContent =
                    "0.00";

                gstBreakdownNote.textContent =
                    "";

            }, 0);

        }
    );


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    updateCustomRateVisibility();


});
