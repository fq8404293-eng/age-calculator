function calculateCompoundInterest() {

    let principal = parseFloat(document.getElementById("principal").value);
    let rate = parseFloat(document.getElementById("rate").value);
    let years = parseFloat(document.getElementById("years").value);

    if (
        isNaN(principal) ||
        isNaN(rate) ||
        isNaN(years) ||
        principal <= 0 ||
        rate <= 0 ||
        years <= 0
    ) {
        alert("Please enter valid values.");
        return;
    }

  let futureValue = principal * Math.pow((1 + rate / 100), years);

let interestEarned = futureValue - principal;

let multiplier = futureValue / principal;

document.getElementById("futureValue").innerText =
    futureValue.toFixed(2);

document.getElementById("totalInvestment").innerText =
    principal.toFixed(2);

document.getElementById("interestEarned").innerText =
    interestEarned.toFixed(2);

document.getElementById("multiplier").innerText =
    multiplier.toFixed(2);
}
