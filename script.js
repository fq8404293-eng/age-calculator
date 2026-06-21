document.getElementById("dob").addEventListener("input", calculateAge);

function calculateAge() {
    const dobInput = document.getElementById("dob").value;

    const resultEl = document.getElementById("result");
    const birthdayEl = document.getElementById("birthday");
    const livedEl = document.getElementById("lived");
    const errorEl = document.getElementById("error");

    // reset
    errorEl.innerText = "";
    resultEl.innerText = "";
    birthdayEl.innerText = "";
    livedEl.innerText = "";

    if (!dobInput) return;

    const dob = new Date(dobInput);
    const today = new Date();

    // safety check
    if (isNaN(dob.getTime())) {
        errorEl.innerText = "⚠️ Invalid date selected!";
        return;
    }

    // future date check
    if (dob > today) {
        errorEl.innerText = "⚠️ Date of birth cannot be in the future!";
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

   const yearText = years === 1 ? "year" : "years";
const monthText = months === 1 ? "month" : "months";
const dayText = days === 1 ? "day" : "days";

resultEl.innerText =
    `You are ${years} ${yearText}, ${months} ${monthText} and ${days} ${dayText} old`;

    // next birthday
    let nextBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());

    if (nextBirthday <= today) {
        nextBirthday = new Date(today.getFullYear() + 1, dob.getMonth(), dob.getDate());
    }

    const diff = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

    birthdayEl.innerText = `🎉 Next birthday in ${diff} days`;

    // days lived
    const daysLived = Math.floor((today - dob) / (1000 * 60 * 60 * 24));

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

/* load theme safely */
window.addEventListener("load", () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }
});
