function calculateRetirement() {

    let currentSavings = parseFloat(document.getElementById("currentSavings").value) || 0;
    let monthlyContribution = parseFloat(document.getElementById("monthlyContribution").value) || 0;
    let annualReturn = parseFloat(document.getElementById("annualReturn").value) || 0;
    let years = parseFloat(document.getElementById("yearsToRetirement").value) || 0;

    let monthlyRate = (annualReturn / 100) / 12;
    let totalMonths = years * 12;

    let futureValue = currentSavings;

    // compound growth for current savings
    futureValue = futureValue * Math.pow((1 + annualReturn / 100), years);

    // future value of monthly contributions
    for (let i = 0; i < totalMonths; i++) {
        futureValue += monthlyContribution * Math.pow((1 + monthlyRate), (totalMonths - i));
    }

    document.getElementById("retirementFund").innerText =
        futureValue.toFixed(2);
}
