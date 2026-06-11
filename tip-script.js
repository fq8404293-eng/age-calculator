function calculateTip() {

    let billAmount = parseFloat(document.getElementById("billAmount").value);
    let tipPercent = parseFloat(document.getElementById("tipPercent").value);

    if (
        isNaN(billAmount) ||
        isNaN(tipPercent) ||
        billAmount <= 0 ||
        tipPercent < 0
    ) {
        alert("Please enter valid values.");
        return;
    }

    let tipAmount = billAmount * (tipPercent / 100);
    let totalBill = billAmount + tipAmount;

    document.getElementById("tip").innerText =
        tipAmount.toFixed(2);

    document.getElementById("total").innerText =
        totalBill.toFixed(2);
}
