function addGST() {
  let amount = parseFloat(document.getElementById("amount").value);
  let rate = parseFloat(document.getElementById("gstRate").value);

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  let gstAmount = (amount * rate) / 100;
  let total = amount + gstAmount;

  document.getElementById("base").innerText = amount.toFixed(2);
  document.getElementById("gst").innerText = gstAmount.toFixed(2);
  document.getElementById("total").innerText = total.toFixed(2);
}


function removeGST() {
  let amount = parseFloat(document.getElementById("amount").value);
  let rate = parseFloat(document.getElementById("gstRate").value);

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  // Reverse GST calculation (Inclusive → Exclusive)
  let base = amount / (1 + rate / 100);
  let gstAmount = amount - base;

  document.getElementById("base").innerText = base.toFixed(2);
  document.getElementById("gst").innerText = gstAmount.toFixed(2);
  document.getElementById("total").innerText = amount.toFixed(2);
}
