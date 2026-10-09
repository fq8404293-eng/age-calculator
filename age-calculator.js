
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
     BIRTHDAY DROPDOWNS
  ========================================================= */

  function populateBirthdayDropdowns() {

    if (!birthMonth || !birthDay || !birthYear) {
      return;
    }

    birthMonth.innerHTML =
      '<option value="">Month</option>';

    const months = [
      "January", "February", "March",
      "April", "May", "June",
      "July", "August", "September",
      "October", "November", "December"
    ];

    months.forEach((month, index) => {

      const option =
        document.createElement("option");

      option.value = String(index + 1);
      option.textContent = month;

      birthMonth.appendChild(option);
    });


    birthDay.innerHTML =
      '<option value="">Day</option>';

    for (let day = 1; day <= 31; day++) {

      const option =
        document.createElement("option");

      option.value = String(day);
      option.textContent = String(day);

      birthDay.appendChild(option);
    }


    birthYear.innerHTML =
      '<option value="">Year</option>';

    const currentYear =
      today().getFullYear();

    for (
      let year = currentYear;
      year >= 1900;
      year--
    ) {

      const option =
        document.createElement("option");

      option.value = String(year);
      option.textContent = String(year);

      birthYear.appendChild(option);
    }
  }


  function updateBirthdayDays() {

    if (!birthMonth || !birthDay) {
      return;
    }

    const month =
      Number(birthMonth.value);

    const year =
      birthYear && birthYear.value
        ? Number(birthYear.value)
        : today().getFullYear();

    if (!month) {
      return;
    }

    const maximumDay =
      daysInMonth(year, month);

    const previousDay =
      Number(birthDay.value);

    birthDay.innerHTML =
      '<option value="">Day</option>';

    for (
      let day = 1;
      day <= maximumDay;
      day++
    ) {

      const option =
        document.createElement("option");

      option.value = String(day);
      option.textContent = String(day);

      birthDay.appendChild(option);
    }

    if (
      previousDay >= 1 &&
      previousDay <= maximumDay
    ) {
      birthDay.value =
        String(previousDay);
    }
  }


  populateBirthdayDropdowns();


  if (birthMonth) {
    birthMonth.addEventListener(
      "change",
      updateBirthdayDays
    );
  }

  if (birthYear) {
    birthYear.addEventListener(
      "change",
      updateBirthdayDays
    );
  }


  /* =========================================================
     AGE CALCULATION
  ========================================================= */

  function calculateAge(birthDate, referenceDate = today()) {

    if (
      !(birthDate instanceof Date) ||
      Number.isNaN(birthDate.getTime()) ||
      birthDate > referenceDate
    ) {
      return null;
    }

    let years =
      referenceDate.getFullYear() -
      birthDate.getFullYear();

    let months =
      referenceDate.getMonth() -
      birthDate.getMonth();

    let days =
      referenceDate.getDate() -
      birthDate.getDate();


    if (days < 0) {

      months--;

      const previousMonth =
        referenceDate.getMonth() === 0
          ? 12
          : referenceDate.getMonth();

      const previousMonthYear =
        referenceDate.getMonth() === 0
          ? referenceDate.getFullYear() - 1
          : referenceDate.getFullYear();

      days += daysInMonth(
        previousMonthYear,
        previousMonth
      );
    }


    if (months < 0) {
      years--;
      months += 12;
    }


    /*
      Handle February 29 birthdays in non-leap years.
      This uses the common February 28 convention.
    */

    const birthdayThisYear =
      new Date(
        referenceDate.getFullYear(),
        birthDate.getMonth(),
        birthDate.getDate()
      );

    if (
      birthDate.getMonth() === 1 &&
      birthDate.getDate() === 29 &&
      !isLeapYear(referenceDate.getFullYear())
    ) {
      birthdayThisYear.setDate(28);
    }


    return {
      years,
      months,
      days,
      totalDays: Math.floor(
        (
          referenceDate.getTime() -
          new Date(
            birthDate.getFullYear(),
            birthDate.getMonth(),
            birthDate.getDate()
          ).getTime()
        ) / 86400000
      )
    };
  }


  /* =========================================================
     INPUT VALIDATION
  ========================================================= */

  function showBirthDateError(message) {

    if (birthDateError) {
      birthDateError.textContent = message;
      birthDateError.hidden = false;
    }

    if (birthDateInput) {
      birthDateInput.setAttribute(
        "aria-invalid",
        "true"
      );
    }
  }


  function clearBirthDateError() {

    if (birthDateError) {
      birthDateError.textContent = "";
      birthDateError.hidden = true;
    }

    if (birthDateInput) {
      birthDateInput.removeAttribute(
        "aria-invalid"
      );
    }
  }


  function getValidBirthDate() {

    clearBirthDateError();

    const birthDate =
      inputToDate(
        birthDateInput
          ? birthDateInput.value
          : ""
      );

    if (!birthDateInput || !birthDateInput.value) {

      showBirthDateError(
        "Please enter your date of birth."
      );

      return null;
    }

    if (!birthDate) {

      showBirthDateError(
        "Please enter a valid date."
      );

      return null;
    }

    if (birthDate > today()) {

      showBirthDateError(
        "Your date of birth cannot be in the future."
      );

      return null;
    }

    if (
      birthDate.getFullYear() < 1900
    ) {

      showBirthDateError(
        "Please enter a year from 1900 onward."
      );

      return null;
    }

    return birthDate;
  }

  /* =========================================================
     DISPLAY AGE RESULTS
  ========================================================= */

  function setText(element, value) {

    if (element) {
      element.textContent = String(value);
    }
  }


  function showSection(element) {

    if (element) {
      element.hidden = false;
    }
  }


  function displayAgeResults(birthDate) {

    const age =
      calculateAge(birthDate);

    if (!age) {
      return;
    }

    selectedBirthDate = birthDate;

    setText(
      exactAge,
      `${age.years} years, ${age.months} months, ${age.days} days`
    );

    setText(ageYears, age.years);
    setText(ageMonths, age.months);
    setText(ageDays, age.days);


    /* Birthday information */

    setText(
      birthWeekday,
      WEEKDAYS[birthDate.getDay()]
    );

    setText(
      zodiacSign,
      getZodiacSign(
        birthDate.getMonth() + 1,
        birthDate.getDate()
      )
    );

    setText(
      birthstone,
      getBirthstone(birthDate.getMonth())
    );

    setText(
      birthSeason,
      getBirthSeason(birthDate.getMonth())
    );


    /* Total time lived */

    const totalDaysLived =
      age.totalDays;

    setText(
      totalMonths,
      age.years * 12 + age.months
    );

    setText(
      totalWeeks,
      Math.floor(totalDaysLived / 7)
    );

    setText(
      totalDays,
      formatNumber(totalDaysLived)
    );

    setText(
      totalHours,
      formatNumber(totalDaysLived * 24)
    );

    setText(
      totalMinutes,
      formatNumber(totalDaysLived * 1440)
    );


    /* Show result sections */

    showSection(resultSection);
    showSection(birthdayCountdown);
    showSection(birthdayInformation);
    showSection(timeLived);
    showSection(liveAgeSection);


    updateBirthdayCountdown();
    updateLiveAge();

    startCountdownTimer();
    startLiveAgeTimer();

    if (resultSection) {
      resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }


  /* =========================================================
     ZODIAC SIGN
  ========================================================= */

  function getZodiacSign(month, day) {

    if (
      (month === 3 && day >= 21) ||
      (month === 4 && day <= 19)
    ) return "Aries";

    if (
      (month === 4 && day >= 20) ||
      (month === 5 && day <= 20)
    ) return "Taurus";

    if (
      (month === 5 && day >= 21) ||
      (month === 6 && day <= 20)
    ) return "Gemini";

    if (
      (month === 6 && day >= 21) ||
      (month === 7 && day <= 22)
    ) return "Cancer";

    if (
      (month === 7 && day >= 23) ||
      (month === 8 && day <= 22)
    ) return "Leo";

    if (
      (month === 8 && day >= 23) ||
      (month === 9 && day <= 22)
    ) return "Virgo";

    if (
      (month === 9 && day >= 23) ||
      (month === 10 && day <= 22)
    ) return "Libra";

    if (
      (month === 10 && day >= 23) ||
      (month === 11 && day <= 21)
    ) return "Scorpio";

    if (
      (month === 11 && day >= 22) ||
      (month === 12 && day <= 21)
    ) return "Sagittarius";

    if (
      (month === 12 && day >= 22) ||
      (month === 1 && day <= 19)
    ) return "Capricorn";

    if (
      (month === 1 && day >= 20) ||
      (month === 2 && day <= 18)
    ) return "Aquarius";

    return "Pisces";
  }


  /* =========================================================
     BIRTHSTONE
  ========================================================= */

  function getBirthstone(monthIndex) {

    const stones = [
      "Garnet",
      "Amethyst",
      "Aquamarine",
      "Diamond",
      "Emerald",
      "Pearl",
      "Ruby",
      "Peridot",
      "Sapphire",
      "Opal",
      "Topaz",
      "Turquoise"
    ];

    return stones[monthIndex] || "Unknown";
  }


  /* =========================================================
     BIRTH SEASON
  ========================================================= */

  function getBirthSeason(monthIndex) {

    const month = monthIndex + 1;

    /*
      Meteorological seasons for the Northern Hemisphere.
    */

    if ([3, 4, 5].includes(month)) {
      return "Spring";
    }

    if ([6, 7, 8].includes(month)) {
      return "Summer";
    }

    if ([9, 10, 11].includes(month)) {
      return "Autumn";
    }

    return "Winter";
  }

  /* =========================================================
     NEXT BIRTHDAY
  ========================================================= */

  function getNextBirthday(birthDate) {

    const currentDate = new Date();

    const currentYear = currentDate.getFullYear();

    const month = birthDate.getMonth();
    const day = birthDate.getDate();

    let nextBirthday = new Date(
      currentYear,
      month,
      day
    );

    /*
      Use February 28 for a February 29 birthday
      in a non-leap year.
    */

    if (
      month === 1 &&
      day === 29 &&
      !isLeapYear(currentYear)
    ) {
      nextBirthday = new Date(
        currentYear,
        1,
        28
      );
    }

    nextBirthday.setHours(0, 0, 0, 0);

    const currentDay = today();

    if (nextBirthday < currentDay) {

      const nextYear = currentYear + 1;

      nextBirthday = new Date(
        nextYear,
        month,
        day
      );

      if (
        month === 1 &&
        day === 29 &&
        !isLeapYear(nextYear)
      ) {
        nextBirthday = new Date(
          nextYear,
          1,
          28
        );
      }

      nextBirthday.setHours(0, 0, 0, 0);
    }

    return nextBirthday;
  }


  function updateBirthdayCountdown() {

    if (!selectedBirthDate) {
      return;
    }

    const now = new Date();

    const nextBirthday =
      getNextBirthday(selectedBirthDate);

    const difference =
      nextBirthday.getTime() - now.getTime();

    const totalSeconds = Math.max(
      0,
      Math.floor(difference / 1000)
    );

    const days = Math.floor(
      totalSeconds / 86400
    );

    const hours = Math.floor(
      (totalSeconds % 86400) / 3600
    );

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60
    );

    const seconds =
      totalSeconds % 60;

    setText(countdownDays, days);
    setText(countdownHours, hours);
    setText(countdownMinutes, minutes);
    setText(countdownSeconds, seconds);

    setText(
      nextBirthdayText,
      days === 0
        ? "Your birthday is today!"
        : `${days} day${days === 1 ? "" : "s"} until your next birthday`
    );

    setText(
      nextBirthdayDate,
      formatDate(nextBirthday)
    );

    setText(
      nextBirthdayWeekday,
      WEEKDAYS[nextBirthday.getDay()]
    );

    setText(
      birthdayMessage,
      days === 0
        ? "Happy Birthday!"
        : `Your next birthday is on ${formatDate(nextBirthday)}.`
    );
  }


  /* =========================================================
     LIVE AGE
  ========================================================= */

  function updateLiveAge() {

    if (!selectedBirthDate) {
      return;
    }

    const now = new Date();

    const birth =
      new Date(
        selectedBirthDate.getFullYear(),
        selectedBirthDate.getMonth(),
        selectedBirthDate.getDate()
      );

    const difference =
      Math.max(0, now.getTime() - birth.getTime());

    const totalSeconds =
      Math.floor(difference / 1000);

    const days =
      Math.floor(totalSeconds / 86400);

    const hours =
      Math.floor((totalSeconds % 86400) / 3600);

    const minutes =
      Math.floor((totalSeconds % 3600) / 60);

    const seconds =
      totalSeconds % 60;

    setText(
      liveAge,
      `${days.toLocaleString("en-US")} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`
    );

    setText(
      liveAgeTime,
      `Last updated: ${now.toLocaleTimeString("en-US")}`
    );
  }


  function startCountdownTimer() {

    if (countdownTimer) {
      clearInterval(countdownTimer);
    }

    countdownTimer = setInterval(
      updateBirthdayCountdown,
      1000
    );
  }


  function startLiveAgeTimer() {

    if (liveAgeTimer) {
      clearInterval(liveAgeTimer);
    }

    liveAgeTimer = setInterval(
      updateLiveAge,
      1000
    );
  }


  /* =========================================================
     BIRTHDAY DROPDOWN ACTION
  ========================================================= */

  if (applyBirthdayButton) {

    applyBirthdayButton.addEventListener(
      "click",
      () => {

        const month =
          Number(birthMonth?.value);

        const day =
          Number(birthDay?.value);

        const year =
          Number(birthYear?.value);

        if (!month || !day || !year) {

          showBirthDateError(
            "Please select your birth month, day, and year."
          );

          return;
        }

        const date = new Date(
          year,
          month - 1,
          day
        );

        if (
          date.getFullYear() !== year ||
          date.getMonth() !== month - 1 ||
          date.getDate() !== day
        ) {

          showBirthDateError(
            "Please select a valid birthday."
          );

          return;
        }

        if (date > today()) {

          showBirthDateError(
            "Your date of birth cannot be in the future."
          );

          return;
        }

        if (birthDateInput) {
          birthDateInput.value =
            dateToInput(date);
        }

        clearBirthDateError();
        displayAgeResults(date);
      }
    );
  }


  /* =========================================================
     CALCULATOR FORM SUBMISSION
  ========================================================= */

  if (form) {

    form.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();

        const birthDate =
          getValidBirthDate();

        if (!birthDate) {
          return;
        }

        displayAgeResults(birthDate);
      }
    );
  }


  /* =========================================================
     CLEAR CALCULATOR
  ========================================================= */

  if (clearButton) {

    clearButton.addEventListener(
      "click",
      () => {

        if (form) {
          form.reset();
        }

        if (birthDateInput) {
          birthDateInput.value = "";
        }

        if (birthMonth) {
          birthMonth.value = "";
        }

        if (birthDay) {
          birthDay.value = "";
        }

        if (birthYear) {
          birthYear.value = "";
        }

        selectedBirthDate = null;

        clearBirthDateError();

        [
          resultSection,
          birthdayCountdown,
          birthdayInformation,
          timeLived,
          liveAgeSection
        ].forEach((section) => {

          if (section) {
            section.hidden = true;
          }
        });

        if (countdownTimer) {
          clearInterval(countdownTimer);
          countdownTimer = null;
        }

        if (liveAgeTimer) {
          clearInterval(liveAgeTimer);
          liveAgeTimer = null;
        }

        if (copyStatus) {
          copyStatus.textContent = "";
        }

        if (birthDateInput) {
          birthDateInput.focus();
        }
      }
    );
  }


  /* =========================================================
     COPY AGE RESULT
  ========================================================= */

  if (copyButton) {

    copyButton.addEventListener(
      "click",
      async () => {

        if (!selectedBirthDate) {
          setText(
            copyStatus,
            "Calculate your age first."
          );

          return;
        }

        const age =
          calculateAge(selectedBirthDate);

        if (!age) {
          return;
        }

        const textToCopy =
          `My age is ${age.years} years, ${age.months} months, and ${age.days} days.`;

        try {

          await navigator.clipboard.writeText(
            textToCopy
          );

          setText(
            copyStatus,
            "Age result copied!"
          );

        } catch (error) {

          setText(
            copyStatus,
            "Copy is unavailable in this browser. Please copy the result manually."
          );
        }
      }
    );
  }


  /* =========================================================
     INITIAL SETUP
  ========================================================= */

  if (birthDateError) {
    birthDateError.hidden = true;
  }

  [
    resultSection,
    birthdayCountdown,
    birthdayInformation,
    timeLived,
    liveAgeSection
  ].forEach((section) => {

    if (section) {
      section.hidden = true;
    }
  });

});
