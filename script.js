document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       🌙 DARK MODE (GLOBAL SAFE)
    ========================== */
    window.toggleDarkMode = function () {
        document.body.classList.toggle("dark");

        localStorage.setItem(
            "theme",
            document.body.classList.contains("dark") ? "dark" : "light"
        );
    };

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }


    /* =========================
       📅 AGE CALCULATOR (SAFE INIT)
    ========================== */
    const dobInput = document.getElementById("dob");

    if (dobInput) {

        const resultEl = document.getElementById("result");
        const birthdayEl = document.getElementById("birthday");
        const livedEl = document.getElementById("lived");
        const errorEl = document.getElementById("error");

        dobInput.addEventListener("input", calculateAge);

        function calculateAge() {

            const dobValue = dobInput.value;

            // reset
            errorEl.innerText = "";
            resultEl.innerText = "";
            birthdayEl.innerText = "";
            livedEl.innerText = "";

            if (!dobValue) {
                errorEl.innerText = "⚠️ Please select your date of birth";
                return;
            }

            const dob = new Date(dobValue);
            const today = new Date();

            // normalize time
            dob.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (isNaN(dob.getTime())) {
                errorEl.innerText = "⚠️ Invalid date selected!";
                return;
            }

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

            resultEl.innerText =
                `You are ${years} years, ${months} months and ${days} days old`;

            /* NEXT BIRTHDAY */
            let nextBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());

            if (nextBirthday <= today) {
                nextBirthday = new Date(today.getFullYear() + 1, dob.getMonth(), dob.getDate());
            }

            const diff = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

            if (diff === 0) {
                birthdayEl.innerText = "🎉 Happy Birthday! Today is your birthday!";
            } else {
                birthdayEl.innerText = `🎉 Next birthday in ${diff} days`;
            }

            /* DAYS LIVED */
            const daysLived = Math.floor((today - dob) / (1000 * 60 * 60 * 24));

            livedEl.innerText = `📊 You have lived approximately ${daysLived} days`;
        }
    }

});
