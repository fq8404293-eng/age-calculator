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
    percent + "% of " + number + " = " + answer;
}
