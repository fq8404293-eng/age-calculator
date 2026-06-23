function setTip(percent) {
    document.getElementById("tipPercent").value = percent;
}

function calculateTip() {

    let billAmount = parseFloat(
        document.getElementById("billAmount").value
    );

    let tipPercent = parseFloat(
        document.getElementById("tipPercent").value
    );

    let people = parseInt(
        document.getElementById("people").value
    );

    if (
        isNaN(billAmount) ||
        isNaN(tipPercent) ||
        billAmount <= 0 ||
        tipPercent < 0
    ) {
        alert("Please enter valid values.");
        return;
    }

    if (isNaN(people) || people < 1) {
        people = 1;
    }

    let tipAmount = billAmount * (tipPercent / 100);

    let totalBill = billAmount + tipAmount;

    let perPerson = totalBill / people;

    document.getElementById("tip").innerText =
        tipAmount.toFixed(2);

    document.getElementById("total").innerText =
        totalBill.toFixed(2);

    document.getElementById("perPerson").innerText =
        perPerson.toFixed(2);
}
