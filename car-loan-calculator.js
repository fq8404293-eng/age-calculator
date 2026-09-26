
"use strict";

/* ==========================================================
   CAR LOAN CALCULATOR
   CalclyWorld
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

const currencySelect =
document.getElementById("car-currency");

const vehiclePriceInput =
document.getElementById("vehicle-price");

const downPaymentInput =
document.getElementById("down-payment");

const interestRateInput =
document.getElementById("interest-rate");

const loanTermInput =
document.getElementById("loan-term");

const calculateButton =
document.getElementById("calculate-car-loan");

const resetButton =
document.getElementById("reset-car-loan");

const errorBox =
document.getElementById("car-loan-error");

const resultCard =
document.getElementById("car-loan-result");

const resultContent =
document.getElementById("car-loan-result-content");


/* ==========================================================
   SUMMARY ELEMENTS
========================================================== */

const summaryVehiclePrice =
document.getElementById("summary-vehicle-price");

const summaryDownPayment =
document.getElementById("summary-down-payment");

const summaryLoanAmount =
document.getElementById("summary-loan-amount");

const summaryMonthlyPayment =
document.getElementById("summary-monthly-payment");

const summaryTotalInterest =
document.getElementById("summary-total-interest");

const summaryTotalCost =
document.getElementById("summary-total-cost");


/* ==========================================================
   CURRENCY FORMATTER
========================================================== */

function formatCurrency(value){

const currency =
currencySelect.value;

return new Intl.NumberFormat("en-US",{

style:"currency",

currency,

maximumFractionDigits:2

}).format(value);

}


/* ==========================================================
   SHOW ERROR
========================================================== */

function showError(message){

errorBox.hidden = false;

errorBox.textContent = message;

resultCard.hidden = true;

}


/* ==========================================================
   CLEAR ERROR
========================================================== */

function clearError(){

errorBox.hidden = true;

errorBox.textContent = "";

}


/* ==========================================================
   RESET SUMMARY
========================================================== */

function clearSummary(){

summaryVehiclePrice.textContent =
formatCurrency(0);

summaryDownPayment.textContent =
formatCurrency(0);

summaryLoanAmount.textContent =
formatCurrency(0);

summaryMonthlyPayment.textContent =
formatCurrency(0);

summaryTotalInterest.textContent =
formatCurrency(0);

summaryTotalCost.textContent =
formatCurrency(0);

}


/* ==========================================================
   RESET
========================================================== */

function resetCalculator(){

vehiclePriceInput.value = "";

downPaymentInput.value = "";

interestRateInput.value = "";

loanTermInput.value = "";

resultContent.innerHTML = "";

resultCard.hidden = true;

clearError();

clearSummary();

}


resetButton.addEventListener(
"click",
resetCalculator
);


/* ==========================================================
   CALCULATE BUTTON
========================================================== */

calculateButton.addEventListener(
"click",
calculateLoan
);


/* ==========================================================
   CALCULATE LOAN
========================================================== */

function calculateLoan(){

clearError();

const vehiclePrice =
parseFloat(vehiclePriceInput.value);

const downPayment =
parseFloat(downPaymentInput.value) || 0;

const annualRate =
parseFloat(interestRateInput.value);

const years =
parseInt(loanTermInput.value);


/* ==========================================================
   VALIDATION
========================================================== */

if(
isNaN(vehiclePrice) ||
vehiclePrice <= 0
){

showError("Please enter a valid vehicle price.");

return;

}


if(
downPayment < 0
){

showError("Down payment cannot be negative.");

return;

}


if(
downPayment > vehiclePrice
){

showError("Down payment cannot be greater than the vehicle price.");

return;

}


if(
isNaN(annualRate) ||
annualRate < 0
){

showError("Please enter a valid annual interest rate.");

return;

}


if(
isNaN(years) ||
years <= 0
){

showError("Please enter a valid loan term.");

return;

}


/* ==========================================================
   LOAN VALUES
========================================================== */

const loanAmount =
vehiclePrice - downPayment;

const monthlyRate =
annualRate / 100 / 12;

const totalMonths =
years * 12;

let monthlyPayment;


/* ==========================================================
   EMI FORMULA
========================================================== */

if(monthlyRate === 0){

monthlyPayment =
loanAmount / totalMonths;

}else{

monthlyPayment =

loanAmount *

(

monthlyRate *

Math.pow(
1 + monthlyRate,
totalMonths
)

)

/

(

Math.pow(
1 + monthlyRate,
totalMonths
)

-

1

);

}


const totalPayment =
monthlyPayment * totalMonths;

const totalInterest =
totalPayment - loanAmount;


/* ==========================================================
   UPDATE SUMMARY
========================================================== */

summaryVehiclePrice.textContent =
formatCurrency(vehiclePrice);

summaryDownPayment.textContent =
formatCurrency(downPayment);

summaryLoanAmount.textContent =
formatCurrency(loanAmount);

summaryMonthlyPayment.textContent =
formatCurrency(monthlyPayment);

summaryTotalInterest.textContent =
formatCurrency(totalInterest);

summaryTotalCost.textContent =
formatCurrency(totalPayment);


/* ==========================================================
   RESULT CARD
========================================================== */

resultCard.hidden = false;

resultContent.innerHTML = `

<div class="info-box">

<p>

<strong>Vehicle Price</strong>

<br>

${formatCurrency(vehiclePrice)}

</p>

<hr>

<p>

<strong>Down Payment</strong>

<br>

${formatCurrency(downPayment)}

</p>

<hr>

<p>

<strong>Loan Amount</strong>

<br>

${formatCurrency(loanAmount)}

</p>

<hr>

<p>

<strong>Estimated Monthly Payment</strong>

<br>

${formatCurrency(monthlyPayment)}

</p>

<hr>

<p>

<strong>Total Interest</strong>

<br>

${formatCurrency(totalInterest)}

</p>

<hr>

<p>

<strong>Total Loan Cost</strong>

<br>

${formatCurrency(totalPayment)}

</p>

</div>

<h3 style="margin-top:30px;">

Loan Amortization Schedule

</h3>

<div id="amortization-table"></div>

`;


generateAmortizationSchedule(

loanAmount,

monthlyRate,

monthlyPayment,

totalMonths

);


/* ==========================================================
   AUTO-SCROLL TO RESULTS
========================================================== */

requestAnimationFrame(() => {

resultCard.scrollIntoView({

behavior: "smooth",

block: "start"

});

});

}


/* ==========================================================
   AMORTIZATION SCHEDULE
========================================================== */

function generateAmortizationSchedule(

loanAmount,

monthlyRate,

monthlyPayment,

totalMonths

){

const tableContainer =
document.getElementById("amortization-table");

if(!tableContainer){

return;

}


let balance =
loanAmount;

let totalPrincipal =
0;

let totalInterest =
0;

let rows = "";


/* ======================================================
   MONTHLY AMORTIZATION
====================================================== */

for(

let month = 1;

month <= totalMonths;

month++

){

const interestForMonth =

monthlyRate === 0

? 0

: balance * monthlyRate;


let principalForMonth =

monthlyPayment - interestForMonth;


/*
 * Prevent a tiny floating-point remainder
 * on the final payment.
 */

if(month === totalMonths){

principalForMonth =
balance;

}


/*
 * Make sure principal never exceeds
 * the remaining balance.
 */

if(principalForMonth > balance){

principalForMonth =
balance;

}


const actualPayment =

principalForMonth +
interestForMonth;


balance -=
principalForMonth;


if(Math.abs(balance) < 0.005){

balance = 0;

}


totalPrincipal +=
principalForMonth;

totalInterest +=
interestForMonth;


rows += `

<tr>

<td>

${month}

</td>

<td>

${formatCurrency(actualPayment)}

</td>

<td>

${formatCurrency(principalForMonth)}

</td>

<td>

${formatCurrency(interestForMonth)}

</td>

<td>

${formatCurrency(balance)}

</td>

</tr>

`;

}


/* ======================================================
   TABLE OUTPUT
====================================================== */

tableContainer.innerHTML = `

<div

style="

overflow-x:auto;

width:100%;

"

>

<table

style="

width:100%;

border-collapse:collapse;

min-width:650px;

"

>

<thead>

<tr>

<th

scope="col"

style="padding:12px;text-align:left;"

>

Payment #

</th>

<th

scope="col"

style="padding:12px;text-align:left;"

>

Payment

</th>

<th

scope="col"

style="padding:12px;text-align:left;"

>

Principal

</th>

<th

scope="col"

style="padding:12px;text-align:left;"

>

Interest

</th>

<th

scope="col"

style="padding:12px;text-align:left;"

>

Remaining Balance

</th>

</tr>

</thead>

<tbody>

${rows}

</tbody>

</table>

</div>

<div

class="info-box"

style="margin-top:25px;"

>

<p>

<strong>

Total Principal Paid

</strong>

<br>

${formatCurrency(totalPrincipal)}

</p>

<hr>

<p>

<strong>

Total Interest Paid

</strong>

<br>

${formatCurrency(totalInterest)}

</p>

<hr>

<p>

<strong>

Number of Payments

</strong>

<br>

${totalMonths}

</p>

</div>

`;

}


/* ==========================================================
   UPDATE CURRENCY DISPLAY WHEN CURRENCY CHANGES
========================================================== */

currencySelect.addEventListener(

"change",

() => {

/*
 * Recalculate automatically if a result
 * is already visible.
 */

if(!resultCard.hidden){

calculateLoan();

}else{

clearSummary();

}

}

);


/* ==========================================================
   INITIAL STATE
========================================================== */

clearSummary();

});

