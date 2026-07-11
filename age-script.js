/* ==========================================================
   CalclyWorld Age Calculator
   Part 1
   Setup • Dark Mode • DOM Elements
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       DOM Elements
    ========================== */

    const dobInput = document.getElementById("dob");

    const error = document.getElementById("error");

    const result = document.getElementById("result");

    const birthday = document.getElementById("birthday");

    const lived = document.getElementById("lived");

    /* =========================
       Dark Mode
    ========================== */

    function toggleDarkMode() {

        document.body.classList.toggle("dark-mode");

        localStorage.setItem(
            "theme",
            document.body.classList.contains("dark-mode")
                ? "dark"
                : "light"
        );

    }

    window.toggleDarkMode = toggleDarkMode;

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

    }


    /* =========================
       Helper Functions
    ========================== */

    function clearResults() {

        error.textContent = "";

        result.textContent = "";

        birthday.textContent = "";

        lived.textContent = "";

    }

    function showError(message) {

        clearResults();

        error.textContent = message;

    }

    function daysInMonth(year, month) {

        return new Date(year, month + 1, 0).getDate();

    }

   function formatNumber(value) {

    return value.toLocaleString("en-US");

}

    /* =========================
       Date Validation
    ========================== */

    function validateDate(date) {

      const today = new Date();

if (isNaN(date.getTime())) {

    showError("Please select a valid date of birth.");

    return false;

}

today.setHours(0, 0, 0, 0);
date.setHours(0, 0, 0, 0);

if (date > today) {

    showError("Date of birth cannot be in the future.");

    return false;

}
        return true;
    }

    /* =========================
   Age Calculation
========================= */

function calculateAge() {

    clearResults();

    if (!dobInput.value) {

        showError("Please select your date of birth.");

        return;

    }

    const birthDate = new Date(dobInput.value);

    if (!validateDate(birthDate)) {

        return;

    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    birthDate.setHours(0, 0, 0, 0);

    let years = today.getFullYear() - birthDate.getFullYear();

    let months = today.getMonth() - birthDate.getMonth();

    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {

        months--;

        const previousMonth =
            today.getMonth() === 0 ? 11 : today.getMonth() - 1;

        const previousYear =
            today.getMonth() === 0
                ? today.getFullYear() - 1
                : today.getFullYear();

        days += daysInMonth(previousYear, previousMonth);

    }

    if (months < 0) {

        years--;

        months += 12;

    }

    const totalDays = Math.floor(
        (today - birthDate) / (1000 * 60 * 60 * 24)
    );

    let nextBirthday = new Date(
        today.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate()
    );

    nextBirthday.setHours(0, 0, 0, 0);

    if (nextBirthday < today) {

        nextBirthday.setFullYear(today.getFullYear() + 1);

    }

    const birthdayDays = Math.ceil(
        (nextBirthday - today) / (1000 * 60 * 60 * 24)
    );

    result.innerHTML =
        `🎉 You are <span class="result-value">${years}</span> years, ` +
        `<span class="result-value">${months}</span> months and ` +
        `<span class="result-value">${days}</span> days old.`;

    lived.innerHTML =
        `📅 Total days lived: <span class="result-value">${formatNumber(totalDays)}</span>`;

    birthday.innerHTML =
        `🎂 Next birthday in <span class="result-value">${birthdayDays}</span> day${birthdayDays === 1 ? "" : "s"}.`;

}
    /* ==========================================================
   Part 4
   Auto Calculate • Max Date • Initialization
========================================================== */

/* =========================
   AUTO CALCULATE
========================= */

dobInput.addEventListener("change", calculateAge);
dobInput.addEventListener("input", calculateAge);

/* =========================
   PREVENT FUTURE DATES
========================= */

const today = new Date();

const maxDate = today.toISOString().split("T")[0];

dobInput.setAttribute("max", maxDate);

/* =========================
   RESTORE LAST DATE
========================= */

const savedDOB = localStorage.getItem("ageCalculatorDOB");

if (savedDOB) {

    dobInput.value = savedDOB;

    calculateAge();

}

/* =========================
   SAVE DATE
========================= */

dobInput.addEventListener("change", () => {

    localStorage.setItem(
        "ageCalculatorDOB",
        dobInput.value
    );

});

/* =========================
   END
========================= */
});
