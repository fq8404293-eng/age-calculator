function calculateBMI() {

    let weight = parseFloat(document.getElementById("weight").value);
    let height = parseFloat(document.getElementById("height").value);

    if (!weight || !height || weight <= 0 || height <= 0) {
        document.getElementById("result").innerText =
            "Please enter a valid weight and height.";

        document.getElementById("category").innerText = "";
        return;
    }

    let heightInMeters = height / 100;

    let bmi = weight / (heightInMeters * heightInMeters);

    let category = "";

    if (bmi < 18.5) {
        category = "Underweight";
    }
    else if (bmi < 25) {
        category = "Normal Weight";
    }
    else if (bmi < 30) {
        category = "Overweight";
    }
    else {
        category = "Obese";
    }

    document.getElementById("result").innerText =
        "Your BMI: " + bmi.toFixed(1);

    document.getElementById("category").innerText =
        "Category: " + category;
}

// Focus on Weight input when page loads
window.addEventListener("load", function () {
    document.getElementById("weight").focus();
});

// Press Enter to calculate BMI
document.getElementById("weight").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        calculateBMI();
    }
});

document.getElementById("height").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        calculateBMI();
    }
});
