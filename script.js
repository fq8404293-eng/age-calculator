document.getElementById("dob").addEventListener("input", calculateAge);

function calculateAge() {
    let dobInput = document.getElementById("dob").value;

    let resultEl = document.getElementById("result");
    let birthdayEl = document.getElementById("birthday");
    let livedEl = document.getElementById("lived");
    let errorEl = document.getElementById("error");

    errorEl.innerText = "";

    if (!dobInput) {
        resultEl.innerText = "";
        birthdayEl.innerText = "";
        livedEl.innerText = "";
        return;
    }

    let dob = new Date(dobInput);
    let today = new Date();

    if (isNaN(dob.getTime())) return;

    // 🚨 Future date check
    if (dob > today) {
        errorEl.innerText = "⚠️ Date of birth cannot be in the future!";
        resultEl.innerText = "";
        birthdayEl.innerText = "";
        livedEl.innerText = "";
        return;
    }

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();

    if (days < 0) {
        months--;
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    resultEl.innerText =
        `You are ${years} years, ${months} months and ${days} days old`;

    let nextBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());

    if (nextBirthday < today) {
        nextBirthday = new Date(today.getFullYear() + 1, dob.getMonth(), dob.getDate());
    }

    let diff = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

    birthdayEl.innerText = `🎉 Next birthday in ${diff} days`;

    let daysLived = Math.floor((today - dob) / (1000 * 60 * 60 * 24));

    livedEl.innerText = `📊 You have lived approximately ${daysLived} days`;
}

/* 🌙 DARK MODE */
function toggleDarkMode() {
    document.body.classList.toggle("dark");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark") ? "dark" : "light"
    );
}

window.onload = function () {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }
};
