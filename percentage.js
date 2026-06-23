function calculatePercentage() {

    let percent = parseFloat(document.getElementById("percent").value);
    let number = parseFloat(document.getElementById("number").value);

    if (isNaN(percent) || isNaN(number)) {
        document.getElementById("result").innerText =
        "Please enter valid values.";
        return;
    }

    let answer = (percent / 100) * number;

    document.getElementById("result").innerText =
    percent + "% of " + number + " = " + answer.toFixed(2);
}

function calculatePercentOf() {

    let x = parseFloat(document.getElementById("valueX").value);
    let y = parseFloat(document.getElementById("valueY").value);

    if (isNaN(x) || isNaN(y) || y === 0) {
        document.getElementById("result2").innerText =
        "Please enter valid values.";
        return;
    }

    let result = (x / y) * 100;

    document.getElementById("result2").innerText =
    x + " is " + result.toFixed(2) + "% of " + y;
}

function calculateChange() {

    let oldValue = parseFloat(document.getElementById("oldValue").value);
    let newValue = parseFloat(document.getElementById("newValue").value);

    if (isNaN(oldValue) || isNaN(newValue) || oldValue === 0) {
        document.getElementById("result3").innerText =
        "Please enter valid values.";
        return;
    }

    let change = ((newValue - oldValue) / oldValue) * 100;

    if (change >= 0) {
        document.getElementById("result3").innerText =
        "Percentage Increase = " + change.toFixed(2) + "%";
    } else {
        document.getElementById("result3").innerText =
        "Percentage Decrease = " + Math.abs(change).toFixed(2) + "%";
    }
}
