document.addEventListener("DOMContentLoaded", () => {

  const gradeItems = document.getElementById("grade-items");
  const addAssessmentButton = document.getElementById("add-assessment");
  const calculateButton = document.getElementById("calculate-grade");
  const resetButton = document.getElementById("reset-grade");
  const errorMessage = document.getElementById("grade-error");
  const resultBox = document.getElementById("grade-result");
  const resultContent = document.getElementById("grade-result-content");

  let assessmentCount = 2;


  function showError(message) {

    errorMessage.textContent = message;
    errorMessage.hidden = false;

    resultBox.hidden = true;

  }


  function clearError() {

    errorMessage.textContent = "";
    errorMessage.hidden = true;

  }


  function getLetterGrade(percentage) {

    if (percentage >= 90) {
      return "A";
    }

    if (percentage >= 80) {
      return "B";
    }

    if (percentage >= 70) {
      return "C";
    }

    if (percentage >= 60) {
      return "D";
    }

    return "F";

  }


  function getGradeDescription(letterGrade) {

    const descriptions = {
      A: "Excellent",
      B: "Good",
      C: "Satisfactory",
      D: "Needs Improvement",
      F: "Failing"
    };

    return descriptions[letterGrade];

  }


  function addAssessment() {

    assessmentCount++;

    const assessment = document.createElement("div");

    assessment.className = "grade-item";

    assessment.innerHTML = `

      <div class="form-group">

        <label for="assessment-name-${assessmentCount}">
          Assessment Name
        </label>

        <input
          type="text"
          id="assessment-name-${assessmentCount}"
          class="grade-name"
          placeholder="Example: Final Exam"
          autocomplete="off">

      </div>


      <div class="form-group">

        <label for="points-earned-${assessmentCount}">
          Points Earned
        </label>

        <input
          type="number"
          id="points-earned-${assessmentCount}"
          class="points-earned"
          min="0"
          step="any"
          placeholder="90">

      </div>


      <div class="form-group">

        <label for="points-possible-${assessmentCount}">
          Points Possible
        </label>

        <input
          type="number"
          id="points-possible-${assessmentCount}"
          class="points-possible"
          min="0"
          step="any"
          placeholder="100">

      </div>

    `;

    gradeItems.appendChild(assessment);

    assessment.querySelector(".grade-name").focus();

  }


  function calculateGrade() {

    clearError();

    const items = gradeItems.querySelectorAll(".grade-item");

    let totalEarned = 0;
    let totalPossible = 0;
    let completedItems = 0;

    for (let i = 0; i < items.length; i++) {

      const earnedInput =
        items[i].querySelector(".points-earned");

      const possibleInput =
        items[i].querySelector(".points-possible");

      const earnedText = earnedInput.value.trim();
      const possibleText = possibleInput.value.trim();

      const bothEmpty =
        earnedText === "" && possibleText === "";

      if (bothEmpty) {
        continue;
      }

      if (earnedText === "" || possibleText === "") {

        showError(
          `Please enter both points earned and points possible for assessment ${i + 1}.`
        );

        return;

      }

      const earned = Number(earnedText);
      const possible = Number(possibleText);

      if (
        !Number.isFinite(earned) ||
        !Number.isFinite(possible)
      ) {

        showError(
          `Please enter valid numbers for assessment ${i + 1}.`
        );

        return;

      }

      if (possible <= 0) {

        showError(
          `Points possible must be greater than 0 for assessment ${i + 1}.`
        );

        return;

      }

      if (earned < 0) {

        showError(
          `Points earned cannot be negative for assessment ${i + 1}.`
        );

        return;

      }

      if (earned > possible) {

        showError(
          `Points earned cannot be greater than points possible for assessment ${i + 1}.`
        );

        return;

      }

      totalEarned += earned;
      totalPossible += possible;

      completedItems++;

    }


    if (completedItems === 0) {

      showError(
        "Please enter at least one completed assessment."
      );

      return;

    }


    const percentage =
      (totalEarned / totalPossible) * 100;

    const letterGrade =
      getLetterGrade(percentage);

    const description =
      getGradeDescription(letterGrade);


    resultContent.innerHTML = `

      <div class="calculator-results-grid">

        <div class="result-card">

          <h3>
            Overall Percentage
          </h3>

          <p>
            <strong>
              ${percentage.toFixed(2)}%
            </strong>
          </p>

        </div>


        <div class="result-card">

          <h3>
            Letter Grade
          </h3>

          <p>
            <strong>
              ${letterGrade}
            </strong>
          </p>

        </div>


        <div class="result-card">

          <h3>
            Grade Level
          </h3>

          <p>
            <strong>
              ${description}
            </strong>
          </p>

        </div>


        <div class="result-card">

          <h3>
            Points Earned
          </h3>

          <p>
            <strong>
              ${formatNumber(totalEarned)}
            </strong>
          </p>

        </div>


        <div class="result-card">

          <h3>
            Points Possible
          </h3>

          <p>
            <strong>
              ${formatNumber(totalPossible)}
            </strong>
          </p>

        </div>


        <div class="result-card">

          <h3>
            Assessments Counted
          </h3>

          <p>
            <strong>
              ${completedItems}
            </strong>
          </p>

        </div>

      </div>


      <div class="info-box">

        <strong>
          Your estimated grade is ${letterGrade}
          with an overall score of ${percentage.toFixed(2)}%.
        </strong>

      </div>

    `;


    resultBox.hidden = false;


    resultBox.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }


  function formatNumber(number) {

    if (Number.isInteger(number)) {
      return number.toString();
    }

    return number.toFixed(2);

  }


  function resetCalculator() {

    assessmentCount = 2;

    gradeItems.innerHTML = `

      <div class="grade-item">

        <div class="form-group">

          <label for="assessment-name-1">
            Assessment Name
          </label>

          <input
            type="text"
            id="assessment-name-1"
            class="grade-name"
            placeholder="Example: Math Test 1"
            autocomplete="off">

        </div>


        <div class="form-group">

          <label for="points-earned-1">
            Points Earned
          </label>

          <input
            type="number"
            id="points-earned-1"
            class="points-earned"
            min="0"
            step="any"
            placeholder="80">

        </div>


        <div class="form-group">

          <label for="points-possible-1">
            Points Possible
          </label>

          <input
            type="number"
            id="points-possible-1"
            class="points-possible"
            min="0"
            step="any"
            placeholder="100">

        </div>

      </div>


      <div class="grade-item">

        <div class="form-group">

          <label for="assessment-name-2">
            Assessment Name
          </label>

          <input
            type="text"
            id="assessment-name-2"
            class="grade-name"
            placeholder="Example: Science Quiz"
            autocomplete="off">

        </div>


        <div class="form-group">

          <label for="points-earned-2">
            Points Earned
          </label>

          <input
            type="number"
            id="points-earned-2"
            class="points-earned"
            min="0"
            step="any"
            placeholder="45">

        </div>


        <div class="form-group">

          <label for="points-possible-2">
            Points Possible
          </label>

          <input
            type="number"
            id="points-possible-2"
            class="points-possible"
            min="0"
            step="any"
            placeholder="50">

        </div>

      </div>

    `;


    clearError();

    resultContent.innerHTML = "";

    resultBox.hidden = true;

  }


  addAssessmentButton.addEventListener(
    "click",
    addAssessment
  );


  calculateButton.addEventListener(
    "click",
    calculateGrade
  );


  resetButton.addEventListener(
    "click",
    resetCalculator
  );


  gradeItems.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Enter" &&
        event.target.matches("input")
      ) {

        event.preventDefault();

        calculateGrade();

      }

    }
  );

});