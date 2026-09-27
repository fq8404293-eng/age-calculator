"use strict";


/* =========================================================
   PERCENTAGE CALCULATOR
   CalclyWorld
   ========================================================= */


/* ---------------------------------------------------------
   FORMAT NUMBER
   --------------------------------------------------------- */

function formatNumber(value) {

  return Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

}


/* ---------------------------------------------------------
   SHOW ERROR
   --------------------------------------------------------- */

function showError(element, message) {

  if (!element) {
    return;
  }

  element.textContent = message;

}


/* ---------------------------------------------------------
   CLEAR ERROR
   --------------------------------------------------------- */

function clearError(element) {

  if (!element) {
    return;
  }

  element.textContent = "";

}


/* ---------------------------------------------------------
   SCROLL TO RESULT
   --------------------------------------------------------- */

function scrollToResult(element) {

  if (!element) {
    return;
  }

  setTimeout(function () {

    element.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });

  }, 50);

}


/* =========================================================
   1. WHAT IS X% OF Y?
   ========================================================= */

const percentageOfForm =
  document.getElementById("percentage-of-form");


if (percentageOfForm) {

  percentageOfForm.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      const percentageInput =
        document.getElementById(
          "percentage-of-percent"
        );


      const numberInput =
        document.getElementById(
          "percentage-of-number"
        );


      const error =
        document.getElementById(
          "percentage-of-error"
        );


      const answer =
        document.getElementById(
          "percentage-of-answer"
        );


      const summary =
        document.getElementById(
          "percentage-of-summary"
        );


      const resultCard =
        document.getElementById(
          "percentage-of-result"
        );


      clearError(error);


      const percentage =
        parseFloat(percentageInput.value);


      const number =
        parseFloat(numberInput.value);


      if (
        !Number.isFinite(percentage) ||
        !Number.isFinite(number)
      ) {

        showError(
          error,
          "Please enter valid numbers."
        );

        return;

      }


      const result =
        (percentage * number) / 100;


      answer.textContent =
        formatNumber(result);


      summary.textContent =
        `${formatNumber(percentage)}% of ${formatNumber(number)} is ${formatNumber(result)}.`;


      scrollToResult(resultCard);

    }
  );


  percentageOfForm.addEventListener(
    "reset",
    function () {

      const answer =
        document.getElementById(
          "percentage-of-answer"
        );


      const summary =
        document.getElementById(
          "percentage-of-summary"
        );


      const error =
        document.getElementById(
          "percentage-of-error"
        );


      setTimeout(function () {

        answer.textContent = "—";

        summary.textContent =
          "Enter your values to calculate the result.";

        clearError(error);

      }, 0);

    }
  );

}


/* =========================================================
   2. X IS WHAT % OF Y?
   ========================================================= */

const percentageRatioForm =
  document.getElementById(
    "percentage-ratio-form"
  );


if (percentageRatioForm) {

  percentageRatioForm.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      const partInput =
        document.getElementById(
          "percentage-ratio-part"
        );


      const wholeInput =
        document.getElementById(
          "percentage-ratio-whole"
        );


      const error =
        document.getElementById(
          "percentage-ratio-error"
        );


      const answer =
        document.getElementById(
          "percentage-ratio-answer"
        );


      const summary =
        document.getElementById(
          "percentage-ratio-summary"
        );


      const resultCard =
        document.getElementById(
          "percentage-ratio-result"
        );


      clearError(error);


      const part =
        parseFloat(partInput.value);


      const whole =
        parseFloat(wholeInput.value);


      if (
        !Number.isFinite(part) ||
        !Number.isFinite(whole)
      ) {

        showError(
          error,
          "Please enter valid numbers."
        );

        return;

      }


      if (whole === 0) {

        showError(
          error,
          "The whole value cannot be zero."
        );

        return;

      }


      const result =
        (part / whole) * 100;


      answer.textContent =
        `${formatNumber(result)}%`;


      summary.textContent =
        `${formatNumber(part)} is ${formatNumber(result)}% of ${formatNumber(whole)}.`;


      scrollToResult(resultCard);

    }
  );


  percentageRatioForm.addEventListener(
    "reset",
    function () {

      const answer =
        document.getElementById(
          "percentage-ratio-answer"
        );


      const summary =
        document.getElementById(
          "percentage-ratio-summary"
        );


      const error =
        document.getElementById(
          "percentage-ratio-error"
        );


      setTimeout(function () {

        answer.textContent = "—";

        summary.textContent =
          "Enter your values to calculate the result.";

        clearError(error);

      }, 0);

    }
  );

}


/* =========================================================
   3. PERCENTAGE INCREASE / DECREASE
   ========================================================= */

const percentageChangeForm =
  document.getElementById(
    "percentage-change-form"
  );


if (percentageChangeForm) {

  percentageChangeForm.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      const originalInput =
        document.getElementById(
          "percentage-change-original"
        );


      const newInput =
        document.getElementById(
          "percentage-change-new"
        );


      const error =
        document.getElementById(
          "percentage-change-error"
        );


      const answer =
        document.getElementById(
          "percentage-change-answer"
        );


      const summary =
        document.getElementById(
          "percentage-change-summary"
        );


      const resultCard =
        document.getElementById(
          "percentage-change-result"
        );


      clearError(error);


      const original =
        parseFloat(originalInput.value);


      const newValue =
        parseFloat(newInput.value);


      if (
        !Number.isFinite(original) ||
        !Number.isFinite(newValue)
      ) {

        showError(
          error,
          "Please enter valid numbers."
        );

        return;

      }


      if (original === 0) {

        showError(
          error,
          "The original value cannot be zero when calculating percentage change."
        );

        return;

      }


      const change =
        ((newValue - original) / Math.abs(original)) * 100;


      const absoluteChange =
        newValue - original;


      if (change > 0) {

        answer.textContent =
          `${formatNumber(change)}% Increase`;


        summary.textContent =
          `The value increased by ${formatNumber(Math.abs(absoluteChange))}, which is a ${formatNumber(change)}% increase from the original value.`;

      }

      else if (change < 0) {

        const decrease =
          Math.abs(change);


        answer.textContent =
          `${formatNumber(decrease)}% Decrease`;


        summary.textContent =
          `The value decreased by ${formatNumber(Math.abs(absoluteChange))}, which is a ${formatNumber(decrease)}% decrease from the original value.`;

      }

      else {

        answer.textContent =
          "0.00% No Change";


        summary.textContent =
          "The original value and new value are the same.";

      }


      scrollToResult(resultCard);

    }
  );


  percentageChangeForm.addEventListener(
    "reset",
    function () {

      const answer =
        document.getElementById(
          "percentage-change-answer"
        );


      const summary =
        document.getElementById(
          "percentage-change-summary"
        );


      const error =
        document.getElementById(
          "percentage-change-error"
        );


      setTimeout(function () {

        answer.textContent = "—";

        summary.textContent =
          "Enter your values to calculate the result.";

        clearError(error);

      }, 0);

    }
  );

}


/* =========================================================
   CLEAR ERRORS WHILE TYPING
   ========================================================= */

const allInputs =
  document.querySelectorAll(
    "#percentage-of-form input, " +
    "#percentage-ratio-form input, " +
    "#percentage-change-form input"
  );


allInputs.forEach(function (input) {

  input.addEventListener(
    "input",
    function () {

      const form =
        input.closest("form");


      if (!form) {
        return;
      }


      const error =
        form.querySelector(".form-error");


      clearError(error);

    }
  );

});


/* =========================================================
   END
   ========================================================= */