"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     ELEMENTS
  ========================================================= */

  const form =
    document.getElementById("age-calculator-form");

  const birthDateInput =
    document.getElementById("birth-date");

  const birthDateError =
    document.getElementById("birth-date-error");

  const birthMonth =
    document.getElementById("birth-month");

  const birthDay =
    document.getElementById("birth-day");

  const birthYear =
    document.getElementById("birth-year");

  const applyBirthdayButton =
    document.getElementById("apply-birthday");

  const clearButton =
    document.getElementById("clear-age");

  const resultSection =
    document.getElementById("age-result");

  const birthdayCountdown =
    document.getElementById("birthday-countdown");

  const birthdayInformation =
    document.getElementById("birthday-information");

  const timeLived =
    document.getElementById("time-lived");

  const liveAgeSection =
    document.getElementById("live-age-section");

  const copyButton =
    document.getElementById("copy-age-result");

  const copyStatus =
    document.getElementById("age-copy-status");


  /* =========================================================
     RESULT ELEMENTS
  ========================================================= */

  const exactAge =
    document.getElementById("exact-age");

  const ageYears =
    document.getElementById("age-years");

  const ageMonths =
    document.getElementById("age-months");

  const ageDays =
    document.getElementById("age-days");


  const countdownDays =
    document.getElementById("countdown-days");

  const countdownHours =
    document.getElementById("countdown-hours");

  const countdownMinutes =
    document.getElementById("countdown-minutes");

  const countdownSeconds =
    document.getElementById("countdown-seconds");

  const nextBirthdayText =
    document.getElementById("next-birthday-text");

  const birthdayMessage =
    document.getElementById("birthday-message");


  const birthWeekday =
    document.getElementById("birth-weekday");

  const zodiacSign =
    document.getElementById("zodiac-sign");

  const birthstone =
    document.getElementById("birthstone");

  const birthSeason =
    document.getElementById("birth-season");

  const nextBirthdayDate =
    document.getElementById("next-birthday-date");

  const nextBirthdayWeekday =
    document.getElementById("next-birthday-weekday");


  const totalMonths =
    document.getElementById("total-months");

  const totalWeeks =
    document.getElementById("total-weeks");

  const totalDays =
    document.getElementById("total-days");

  const totalHours =
    document.getElementById("total-hours");

  const totalMinutes =
    document.getElementById("total-minutes");


  const liveAge =
    document.getElementById("live-age");

  const liveAgeTime =
    document.getElementById("live-age-time");


  /* =========================================================
     STATE
  ========================================================= */

  let selectedBirthDate = null;

  let countdownTimer = null;

  let liveAgeTimer = null;


  /* =========================================================
     CONSTANTS
  ========================================================= */

  const WEEKDAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];


  /* =========================================================
     BASIC DATE FUNCTIONS
  ========================================================= */

  function today() {

    const now = new Date();

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
  }


  function dateToInput(date) {

    const year =
      date.getFullYear();

    const month =
      String(date.getMonth() + 1)
        .padStart(2, "0");

    const day =
      String(date.getDate())
        .padStart(2, "0");

    return `${year}-${month}-${day}`;
  }


  function inputToDate(value) {

    if (!value) {
      return null;
    }

    const parts =
      value.split("-");

    if (parts.length !== 3) {
      return null;
    }

    const year =
      Number(parts[0]);

    const month =
      Number(parts[1]);

    const day =
      Number(parts[2]);


    const date =
      new Date(
        year,
        month - 1,
        day
      );


    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  }


  function daysInMonth(year, month) {

    return new Date(
      year,
      month,
      0
    ).getDate();
  }


  function isLeapYear(year) {

    return (
      year % 4 === 0 &&
      (
        year % 100 !== 0 ||
        year % 400 === 0
      )
    );
  }


  function formatNumber(number) {

    return new Intl.NumberFormat(
      "en-US"
    ).format(number);
  }


  function formatDate(date) {

    return date.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric"
      }
    );
  }


  /* =========================================================
     INITIALIZE DATE
  ========================================================= */

  birthDateInput.max =
    dateToInput(today());


  /* =========================================================
     BIRTHDAY DROPDOWNS
  ========================================================= */

  function populateYears() {

    const currentYear =
      today().getFullYear();

    birthYear.innerHTML =
      '<option value="">Year</option>';


    for (
      let year = currentYear;
      year >= 1900;
      year--
    ) {

      const option =
        document.createElement("option");

      option.value =
        String(year);

      option.textContent =
        String(year);

      birthYear.appendChild(option);
    }
  }


  function populateDays() {

    const month =
      Number(birthMonth.value);

    const year =
      Number(birthYear.value) ||
      today().getFullYear();

    const previousDay =
      Number(birthDay.value);


    birthDay.innerHTML =
      '<option value="">Day</option>';


    if (!month) {
      return;
    }


    const totalDays =
      daysInMonth(
        year,
        month
      );


    for (
      let day = 1;
      day <= totalDays;
      day++
    ) {

      const option =
        document.createElement("option");

      option.value =
        String(day);

      option.textContent =
        String(day);

      birthDay.appendChild(option);
    }


    if (
      previousDay >= 1 &&
      previousDay <= totalDays
    ) {

      birthDay.value =
        String(previousDay);
    }
  }


  populateYears();


  birthMonth.addEventListener(
    "change",
    populateDays
  );


  birthYear.addEventListener(
    "change",
    populateDays
  );


  /* =========================================================
     USE DROPDOWN BIRTHDAY
  ========================================================= */

  applyBirthdayButton.addEventListener(
    "click",
    () => {

      clearError();


      const month =
        Number(birthMonth.value);

      const day =
        Number(birthDay.value);

      const year =
        Number(birthYear.value);


      if (!month || !day || !year) {

        showError(
          "Please select your month, day and year."
        );

        return;
      }


      const date =
        new Date(
          year,
          month - 1,
          day
        );


      if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
      ) {

        showError(
          "Please select a valid birthday."
        );

        return;
      }


      if (date > today()) {

        showError(
          "Your birthday cannot be in the future."
        );

        return;
      }


      birthDateInput.value =
        dateToInput(date);


      clearError();
    }
  );


  /* =========================================================
     VALIDATION
  ========================================================= */

  function showError(message) {

    birthDateError.textContent =
      message;

    birthDateError.hidden =
      false;
  }


  function clearError() {

    birthDateError.textContent =
      "";

    birthDateError.hidden =
      true;
  }


  function validateBirthDate() {

    clearError();


    const date =
      inputToDate(
        birthDateInput.value
      );


    if (!date) {

      showError(
        "Please enter your date of birth."
      );

      return null;
    }


    if (date > today()) {

      showError(
        "Date of birth cannot be in the future."
      );

      return null;
    }


    return date;
  }


  /* =========================================================
     EXACT AGE
  ========================================================= */

  function calculateExactAge(
    birthDate,
    currentDate
  ) {

    let years =
      currentDate.getFullYear() -
      birthDate.getFullYear();


    let months =
      currentDate.getMonth() -
      birthDate.getMonth();


    let days =
      currentDate.getDate() -
      birthDate.getDate();


    if (days < 0) {

      months--;

      const previousMonthDays =
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          0
        ).getDate();

      days += previousMonthDays;
    }


    if (months < 0) {

      years--;

      months += 12;
    }


    return {
      years,
      months,
      days
    };
  }


  /* =========================================================
     TOTAL DAYS
  ========================================================= */

  function getTotalDays(
    birthDate,
    currentDate
  ) {

    const milliseconds =
      currentDate.getTime() -
      birthDate.getTime();


    return Math.floor(
      milliseconds / 86400000
    );
  }


  /* =========================================================
     ZODIAC
  ========================================================= */

  function getZodiac(
    month,
    day
  ) {

    if (
      (month === 1 && day >= 20) ||
      (month === 2 && day <= 18)
    ) {
      return "Aquarius";
    }

    if (
      (month === 2 && day >= 19) ||
      (month === 3 && day <= 20)
    ) {
      return "Pisces";
    }

    if (
      (month === 3 && day >= 21) ||
      (month === 4 && day <= 19)
    ) {
      return "Aries";
    }

    if (
      (month === 4 && day >= 20) ||
      (month === 5 && day <= 20)
    ) {
      return "Taurus";
    }

    if (
      (month === 5 && day >= 21) ||
      (month === 6 && day <= 20)
    ) {
      return "Gemini";
    }

    if (
      (month === 6 && day >= 21) ||
      (month === 7 && day <= 22)
    ) {
      return "Cancer";
    }

    if (
      (month === 7 && day >= 23) ||
      (month === 8 && day <= 22)
    ) {
      return "Leo";
    }

    if (
      (month === 8 && day >= 23) ||
      (month === 9 && day <= 22)
    ) {
      return "Virgo";
    }

    if (
      (month === 9 && day >= 23) ||
      (month === 10 && day <= 22)
    ) {
      return "Libra";
    }

    if (
      (month === 10 && day >= 23) ||
      (month === 11 && day <= 21)
    ) {
      return "Scorpio";
    }

    if (
      (month === 11 && day >= 22) ||
      (month === 12 && day <= 21)
    ) {
      return "Sagittarius";
    }

    return "Capricorn";
  }


  /* =========================================================
     BIRTHSTONE
  ========================================================= */

  function getBirthstone(month) {

    const stones = {
      1: "Garnet",
      2: "Amethyst",
      3: "Aquamarine",
      4: "Diamond",
      5: "Emerald",
      6: "Pearl",
      7: "Ruby",
      8: "Peridot",
      9: "Sapphire",
      10: "Opal",
      11: "Topaz",
      12: "Turquoise"
    };

    return stones[month];
  }


  /* =========================================================
     BIRTH SEASON
  ========================================================= */

  function getBirthSeason(month) {

    if (
      month === 12 ||
      month === 1 ||
      month === 2
    ) {
      return "Winter";
    }

    if (
      month >= 3 &&
      month <= 5
    ) {
      return "Spring";
    }

    if (
      month >= 6 &&
      month <= 8
    ) {
      return "Summer";
    }

    return "Autumn";
  }


  /* =========================================================
     NEXT BIRTHDAY
  ========================================================= */

  function getNextBirthday(
    birthDate,
    referenceDate
  ) {

    let year =
      referenceDate.getFullYear();

    const month =
      birthDate.getMonth();

    const day =
      birthDate.getDate();


    let birthday;


    if (
      month === 1 &&
      day === 29 &&
      !isLeapYear(year)
    ) {

      birthday =
        new Date(
          year,
          1,
          28
        );

    } else {

      birthday =
        new Date(
          year,
          month,
          day
        );
    }


    if (birthday < referenceDate) {

      year++;


      if (
        month === 1 &&
        day === 29 &&
        !isLeapYear(year)
      ) {

        birthday =
          new Date(
            year,
            1,
            28
          );

      } else {

        birthday =
          new Date(
            year,
            month,
            day
          );
      }
    }


    return birthday;
  }


  /* =========================================================
     MAIN CALCULATION
  ========================================================= */

  function calculateAge() {

    const birthDate =
      validateBirthDate();


    if (!birthDate) {
      hideResults();
      return;
    }


    selectedBirthDate =
      birthDate;


    const currentDate =
      today();


    const age =
      calculateExactAge(
        birthDate,
        currentDate
      );


    const days =
      getTotalDays(
        birthDate,
        currentDate
      );


    const months =
      age.years * 12 +
      age.months;


    const weeks =
      Math.floor(
        days / 7
      );


    const hours =
      days * 24;


    const minutes =
      hours * 60;


    /* Exact age */

    ageYears.textContent =
      formatNumber(age.years);

    ageMonths.textContent =
      formatNumber(age.months);

    ageDays.textContent =
      formatNumber(age.days);


    exactAge.textContent =
      `${age.years} years, ${age.months} months, ${age.days} days`;


    /* Time lived */

    totalMonths.textContent =
      formatNumber(months);

    totalWeeks.textContent =
      formatNumber(weeks);

    totalDays.textContent =
      formatNumber(days);

    totalHours.textContent =
      formatNumber(hours);

    totalMinutes.textContent =
      formatNumber(minutes);


    /* Birthday information */

    const month =
      birthDate.getMonth() + 1;

    const day =
      birthDate.getDate();


    birthWeekday.textContent =
      WEEKDAYS[
        birthDate.getDay()
      ];


    zodiacSign.textContent =
      getZodiac(
        month,
        day
      );


    birthstone.textContent =
      getBirthstone(month);


    birthSeason.textContent =
      getBirthSeason(month);


    /* Next birthday */

    const nextBirthday =
      getNextBirthday(
        birthDate,
        currentDate
      );


    nextBirthdayDate.textContent =
      formatDate(
        nextBirthday
      );


    nextBirthdayWeekday.textContent =
      WEEKDAYS[
        nextBirthday.getDay()
      ];


    nextBirthdayText.textContent =
      `Your next birthday is ${formatDate(nextBirthday)}.`;


    /* Show sections */

    resultSection.hidden =
      false;

    birthdayCountdown.hidden =
      false;

    birthdayInformation.hidden =
      false;

    timeLived.hidden =
      false;

    liveAgeSection.hidden =
      false;


    /* Start live features */

    startBirthdayCountdown(
      birthDate
    );


    startLiveAge(
      birthDate
    );


    /* Scroll */

    setTimeout(() => {

      resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }, 100);
  }


  /* =========================================================
     BIRTHDAY COUNTDOWN
  ========================================================= */

  function startBirthdayCountdown(
    birthDate
  ) {

    stopBirthdayCountdown();

    updateBirthdayCountdown(
      birthDate
    );


    countdownTimer =
      setInterval(() => {

        updateBirthdayCountdown(
          birthDate
        );

      }, 1000);
  }


  function stopBirthdayCountdown() {

    if (countdownTimer) {

      clearInterval(
        countdownTimer
      );

      countdownTimer =
        null;
    }
  }


  function updateBirthdayCountdown(
    birthDate
  ) {

    const now =
      new Date();


    const todayDate =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );


    const nextBirthday =
      getNextBirthday(
        birthDate,
        todayDate
      );


    const birthdayStart =
      new Date(
        nextBirthday.getFullYear(),
        nextBirthday.getMonth(),
        nextBirthday.getDate()
      );


    let difference =
      birthdayStart.getTime() -
      now.getTime();


    const birthdayToday =
      nextBirthday.getFullYear() ===
        now.getFullYear() &&
      nextBirthday.getMonth() ===
        now.getMonth() &&
      nextBirthday.getDate() ===
        now.getDate();


    if (birthdayToday) {

      birthdayMessage.textContent =
        "🎉 Happy Birthday! Today is your birthday.";

      countdownDays.textContent =
        "0";

      countdownHours.textContent =
        "00";

      countdownMinutes.textContent =
        "00";

      countdownSeconds.textContent =
        "00";

      return;
    }


    difference =
      Math.max(
        0,
        difference
      );


    const totalSeconds =
      Math.floor(
        difference / 1000
      );


    const days =
      Math.floor(
        totalSeconds / 86400
      );


    const hours =
      Math.floor(
        (totalSeconds % 86400) /
        3600
      );


    const minutes =
      Math.floor(
        (totalSeconds % 3600) /
        60
      );


    const seconds =
      totalSeconds % 60;


    countdownDays.textContent =
      formatNumber(days);


    countdownHours.textContent =
      String(hours)
        .padStart(2, "0");


    countdownMinutes.textContent =
      String(minutes)
        .padStart(2, "0");


    countdownSeconds.textContent =
      String(seconds)
        .padStart(2, "0");


    birthdayMessage.textContent =
      `${days} days until your next birthday.`;
  }


  /* =========================================================
     LIVE AGE
  ========================================================= */

  function startLiveAge(
    birthDate
  ) {

    stopLiveAge();

    updateLiveAge(
      birthDate
    );


    liveAgeTimer =
      setInterval(() => {

        updateLiveAge(
          birthDate
        );

      }, 1000);
  }


  function stopLiveAge() {

    if (liveAgeTimer) {

      clearInterval(
        liveAgeTimer
      );

      liveAgeTimer =
        null;
    }
  }


  function updateLiveAge(
    birthDate
  ) {

    const now =
      new Date();


    const age =
      calculateExactAge(
        birthDate,
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        )
      );


    const anniversary =
      new Date(
        birthDate.getFullYear() +
          age.years,
        birthDate.getMonth(),
        birthDate.getDate()
      );


    let difference =
      now.getTime() -
      anniversary.getTime();


    if (difference < 0) {
      difference = 0;
    }


    const hours =
      Math.floor(
        difference / 3600000
      );


    const minutes =
      Math.floor(
        (difference % 3600000) /
        60000
      );


    const seconds =
      Math.floor(
        (difference % 60000) /
        1000
      );


    liveAge.textContent =
      `${age.years} years, ${age.months} months, ${age.days} days`;


    liveAgeTime.textContent =
      `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  }


  /* =========================================================
     COPY RESULT
  ========================================================= */

  copyButton.addEventListener(
    "click",
    async () => {

      if (!selectedBirthDate) {
        return;
      }


      const currentDate =
        today();


      const age =
        calculateExactAge(
          selectedBirthDate,
          currentDate
        );


      const days =
        getTotalDays(
          selectedBirthDate,
          currentDate
        );


      const nextBirthday =
        getNextBirthday(
          selectedBirthDate,
          currentDate
        );


      const text =
`Age Calculator Result

Date of Birth: ${formatDate(selectedBirthDate)}

Exact Age: ${age.years} years, ${age.months} months, ${age.days} days

Total Months: ${formatNumber(
  age.years * 12 + age.months
)}

Total Weeks: ${formatNumber(
  Math.floor(days / 7)
)}

Total Days: ${formatNumber(days)}

Total Hours: ${formatNumber(
  days * 24
)}

Total Minutes: ${formatNumber(
  days * 24 * 60
)}

Born On: ${WEEKDAYS[
  selectedBirthDate.getDay()
]}

Zodiac Sign: ${getZodiac(
  selectedBirthDate.getMonth() + 1,
  selectedBirthDate.getDate()
)}

Birthstone: ${getBirthstone(
  selectedBirthDate.getMonth() + 1
)}

Birth Season: ${getBirthSeason(
  selectedBirthDate.getMonth() + 1
)}

Next Birthday: ${formatDate(nextBirthday)}

Next Birthday Day: ${WEEKDAYS[
  nextBirthday.getDay()
]}`;


      const success =
        await copyText(text);


      if (success) {

        copyStatus.textContent =
          "Result copied!";

      } else {

        copyStatus.textContent =
          "Could not copy the result.";

      }


      setTimeout(() => {

        copyStatus.textContent =
          "";

      }, 2500);
    }
  );


  /* =========================================================
     COPY FUNCTION
  ========================================================= */

  async function copyText(text) {

    try {

      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {

        await navigator.clipboard.writeText(
          text
        );

        return true;
      }

    } catch (error) {
      /* Use fallback */
    }


    try {

      const textarea =
        document.createElement(
          "textarea"
        );


      textarea.value =
        text;


      textarea.style.position =
        "fixed";

      textarea.style.left =
        "-9999px";


      document.body.appendChild(
        textarea
      );


      textarea.focus();

      textarea.select();


      const success =
        document.execCommand(
          "copy"
        );


      textarea.remove();


      return success;

    } catch (error) {

      return false;
    }
  }


  /* =========================================================
     CLEAR
  ========================================================= */

  clearButton.addEventListener(
    "click",
    () => {

      form.reset();

      clearError();

      selectedBirthDate =
        null;


      stopBirthdayCountdown();

      stopLiveAge();


      resultSection.hidden =
        true;

      birthdayCountdown.hidden =
        true;

      birthdayInformation.hidden =
        true;

      timeLived.hidden =
        true;

      liveAgeSection.hidden =
        true;


      copyStatus.textContent =
        "";


      birthDay.innerHTML =
        '<option value="">Day</option>';


      birthYear.value =
        "";


      birthMonth.value =
        "";


      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  );


  /* =========================================================
     FORM SUBMIT
  ========================================================= */

  form.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();

      calculateAge();
    }
  );


  /* =========================================================
     CLEANUP
  ========================================================= */

  window.addEventListener(
    "beforeunload",
    () => {

      stopBirthdayCountdown();

      stopLiveAge();
    }
  );

});