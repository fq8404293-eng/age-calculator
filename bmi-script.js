/* ==========================================================
   CalclyWorld BMI Calculator
   Part 1
   Variables • Unit Switching • Helper Functions
========================================================== */

// ===========================
// Element References
// ===========================

const metricInputs = document.getElementById("metricInputs");
const imperialInputs = document.getElementById("imperialInputs");

const result = document.getElementById("result");
const category = document.getElementById("category");
const healthyWeight = document.getElementById("healthyWeight");

// ===========================
// Helper Functions
// ===========================

function showMetric() {

    metricInputs.style.display = "block";
    imperialInputs.style.display = "none";

    document.getElementById("weight").focus();

}

function showImperial() {

    metricInputs.style.display = "none";
    imperialInputs.style.display = "block";

    document.getElementById("weightLb").focus();

}

function clearResults() {

    result.textContent = "";
    category.textContent = "";
    healthyWeight.textContent = "";

}

// ===========================
// BMI Category
// ===========================

function getCategory(bmi) {

    if (bmi < 18.5) {

        return "Underweight";

    }

    if (bmi < 25) {

        return "Healthy Weight";

    }

    if (bmi < 30) {

        return "Overweight";

    }

    return "Obesity";

}

// ===========================
// Unit Switching
// ===========================

document.querySelectorAll('input[name="units"]').forEach(function (radio) {

    radio.addEventListener("change", function () {

        if (this.value === "metric") {

            showMetric();

        } else {

            showImperial();

        }

        clearResults();

    });

});

// ===========================
// Clear Results While Typing
// ===========================

document.querySelectorAll("input").forEach(function (input) {

    input.addEventListener("input", clearResults);

});
/* ==========================================================
   CalclyWorld BMI Calculator
   Part 2
   BMI Calculation • Healthy Weight Range
========================================================== */

// ===========================
// Main Calculator
// ===========================

function calculateBMI() {

    let bmi;
    let heightMeters;

    const selectedUnit =
        document.querySelector('input[name="units"]:checked').value;

    // ===========================
    // Metric
    // ===========================

    if (selectedUnit === "metric") {

        const weight =
            parseFloat(document.getElementById("weight").value);

        const height =
            parseFloat(document.getElementById("height").value);

        if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
            clearResults();

            result.textContent =
           "Please enter a valid weight and height.";
            return;
        }

        heightMeters = height / 100;

        bmi = weight / (heightMeters * heightMeters);

    }

    // ===========================
    // Imperial
    // ===========================

    else {

        const weightLb =
            parseFloat(document.getElementById("weightLb").value);

        const feet =
            parseFloat(document.getElementById("feet").value);

        const inches =
            parseFloat(document.getElementById("inches").value) || 0;

      if (
    isNaN(weightLb) ||
    isNaN(feet) ||
    weightLb <= 0 ||
    feet <= 0 ||
    inches < 0 ||
    inches > 11
){

    clearResults();

    result.textContent =
        "Please enter a valid weight and height.";

    return;

}

        const totalInches = (feet * 12) + inches;

        bmi = (703 * weightLb) / (totalInches * totalInches);

        heightMeters = totalInches * 0.0254;

    }

    // ===========================
    // Display Results
    // ===========================

    result.textContent =
        `Your BMI: ${bmi.toFixed(1)}`;

    category.textContent =
        `Category: ${getCategory(bmi)}`;

    const minWeight =
        (18.5 * heightMeters * heightMeters).toFixed(1);

    const maxWeight =
        (24.9 * heightMeters * heightMeters).toFixed(1);

    healthyWeight.textContent =
    `Healthy Weight Range: ${minWeight} kg – ${maxWeight} kg`;

document.getElementById("bmi-result").focus();

}
/* ==========================================================
   CalclyWorld BMI Calculator
   Part 3
   Events • Accessibility • Initialization
========================================================== */

// ===========================
// Enter Key Support
// ===========================

document
    .querySelectorAll("#metricInputs input, #imperialInputs input")
    .forEach(function (input) {

        input.addEventListener("keydown", function (event) {

           if (event.key === "Enter") {

    event.preventDefault();

    calculateBMI();

}

        });

    });

// ===========================
// Auto Focus
// ===========================

window.addEventListener("DOMContentLoaded", function () {

    const metricRadio =
        document.querySelector('input[name="units"][value="metric"]');

    if (metricRadio) {

        metricRadio.checked = true;

    }

    showMetric();

});

// ===========================
// Button Accessibility
// ===========================

const calculateButton =
    document.getElementById("calculateBtn");

if (calculateButton) {

    calculateButton.addEventListener("click", calculateBMI);

}

// ===========================
// Prevent Negative Numbers
// ===========================

document.querySelectorAll("input[type='number']").forEach(function (input) {

    input.addEventListener("input", function () {

       if (Number(this.value) < 0) {

    this.value = "";

}

    });

});

