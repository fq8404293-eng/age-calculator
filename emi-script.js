document.getElementById("emiForm").addEventListener("submit", function (e) {
    e.preventDefault();
    calculateEMI();
});

function calculateEMI() {

    const principal = parseFloat(document.getElementById("loanAmount").value);
    const annualRate = parseFloat(document.getElementById("interestRate").value);
    const years = parseFloat(document.getElementById("loanTenure").value);

    if (
        isNaN(principal) ||
        isNaN(annualRate) ||
        isNaN(years) ||
        principal <= 0 ||
        annualRate <= 0 ||
        years <= 0
    ) {
        alert("Please enter valid values.");
        return;
    }

    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;

    const emi =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;
    const interestPercent = (totalInterest / principal) * 100;

    document.getElementById("emi").textContent =
        emi.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    document.getElementById("principal").textContent =
        principal.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    document.getElementById("interest").textContent =
        totalInterest.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    document.getElementById("total").textContent =
        totalPayment.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    document.getElementById("interestPercent").textContent =
        interestPercent.toFixed(2);

    document.getElementById("emi-result").focus();
}
