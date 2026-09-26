document.addEventListener("DOMContentLoaded", () => {
  const coursesContainer = document.getElementById("gpa-courses");
  const addCourseButton = document.getElementById("add-gpa-course");
  const calculateButton = document.getElementById("calculate-gpa");
  const resetButton = document.getElementById("reset-gpa");

  const errorMessage = document.getElementById("gpa-error");
  const resultBox = document.getElementById("gpa-result");
  const resultContent = document.getElementById("gpa-result-content");

  const summaryGPA = document.getElementById("gpa-summary-value");
  const summaryCredits = document.getElementById("gpa-summary-credits");
  const summaryPoints = document.getElementById("gpa-summary-points");

  const gradeOptions = [
    { label: "A+", value: "4.0" },
    { label: "A", value: "4.0" },
    { label: "A-", value: "3.7" },
    { label: "B+", value: "3.3" },
    { label: "B", value: "3.0" },
    { label: "B-", value: "2.7" },
    { label: "C+", value: "2.3" },
    { label: "C", value: "2.0" },
    { label: "C-", value: "1.7" },
    { label: "D", value: "1.0" },
    { label: "F", value: "0.0" }
  ];

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
    resultBox.hidden = true;
  }

  function clearError() {
    errorMessage.textContent = "";
    errorMessage.hidden = true;
  }

  function updateCourseLabels() {
    const rows = document.querySelectorAll(".gpa-course-row");

    rows.forEach((row, index) => {
      const courseNumber = index + 1;

      const nameInput = row.querySelector(".gpa-course-name");
      const gradeSelect = row.querySelector(".gpa-grade");
      const creditsInput = row.querySelector(".gpa-credits");
      const removeButton = row.querySelector(".gpa-remove-course");

      if (nameInput) {
        nameInput.placeholder = `Course ${courseNumber}`;
        nameInput.setAttribute(
          "aria-label",
          `Course ${courseNumber} name`
        );
      }

      if (gradeSelect) {
        gradeSelect.setAttribute(
          "aria-label",
          `Course ${courseNumber} grade`
        );
      }

      if (creditsInput) {
        creditsInput.setAttribute(
          "aria-label",
          `Course ${courseNumber} credits`
        );
      }

      if (removeButton) {
        removeButton.setAttribute(
          "aria-label",
          `Remove Course ${courseNumber}`
        );
      }
    });
  }

  function createCourseRow() {
    const row = document.createElement("tr");

    row.className = "gpa-course-row";

    const gradeOptionsHTML = gradeOptions
      .map(
        grade =>
          `<option value="${grade.value}">${grade.label}</option>`
      )
      .join("");

    row.innerHTML = `
      <td>
        <input
          type="text"
          class="gpa-course-name"
          placeholder="Course"
          aria-label="Course name"
        >
      </td>

      <td>
        <select
          class="gpa-grade"
          aria-label="Course grade"
        >
          <option value="">Select Grade</option>
          ${gradeOptionsHTML}
        </select>
      </td>

      <td>
        <input
          type="number"
          class="gpa-credits"
          min="0.1"
          step="0.1"
          placeholder="3"
          aria-label="Course credits"
        >
      </td>

      <td>
        <button
          type="button"
          class="btn btn-secondary gpa-remove-course"
          aria-label="Remove course"
        >
          Remove
        </button>
      </td>
    `;

    return row;
  }

  function addCourse() {
    clearError();

    const row = createCourseRow();

    coursesContainer.appendChild(row);

    updateCourseLabels();

    const nameInput = row.querySelector(".gpa-course-name");

    if (nameInput) {
      nameInput.focus();
    }
  }

  function removeCourse(button) {
    const rows = document.querySelectorAll(".gpa-course-row");

    if (rows.length <= 1) {
      showError("At least one course is required.");
      return;
    }

    const row = button.closest(".gpa-course-row");

    if (row) {
      row.remove();
    }

    clearError();
    updateCourseLabels();
  }

  function calculateGPA() {
    clearError();

    const rows = document.querySelectorAll(".gpa-course-row");

    if (rows.length === 0) {
      showError("Please add at least one course.");
      return;
    }

    let totalCredits = 0;
    let totalGradePoints = 0;
    let validCourses = 0;

    const courseDetails = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      const courseNameInput = row.querySelector(".gpa-course-name");
      const gradeSelect = row.querySelector(".gpa-grade");
      const creditsInput = row.querySelector(".gpa-credits");

      const courseName =
        courseNameInput.value.trim() || `Course ${i + 1}`;

      const gradeValue = gradeSelect.value;
      const creditsValue = creditsInput.value.trim();

      if (!gradeValue) {
        showError(
          `Please select a grade for ${courseName}.`
        );
        gradeSelect.focus();
        return;
      }

      if (!creditsValue) {
        showError(
          `Please enter the credits for ${courseName}.`
        );
        creditsInput.focus();
        return;
      }

      const credits = Number(creditsValue);
      const gradePoints = Number(gradeValue);

      if (!Number.isFinite(credits) || credits <= 0) {
        showError(
          `Credits for ${courseName} must be greater than 0.`
        );
        creditsInput.focus();
        return;
      }

      if (!Number.isFinite(gradePoints)) {
        showError(
          `Please select a valid grade for ${courseName}.`
        );
        gradeSelect.focus();
        return;
      }

      const weightedPoints = gradePoints * credits;

      totalCredits += credits;
      totalGradePoints += weightedPoints;
      validCourses++;

      const selectedGrade =
        gradeSelect.options[gradeSelect.selectedIndex].text;

      courseDetails.push({
        name: courseName,
        grade: selectedGrade,
        gradePoints,
        credits,
        weightedPoints
      });
    }

    if (validCourses === 0 || totalCredits <= 0) {
      showError("Please enter valid course information.");
      return;
    }

    const gpa = totalGradePoints / totalCredits;

    const formattedGPA = gpa.toFixed(2);
    const formattedCredits = totalCredits.toFixed(1);
    const formattedPoints = totalGradePoints.toFixed(2);

    const courseRowsHTML = courseDetails
      .map(
        course => `
          <tr>
            <td>${escapeHTML(course.name)}</td>
            <td>${course.grade}</td>
            <td>${course.gradePoints.toFixed(1)}</td>
            <td>${course.credits.toFixed(1)}</td>
            <td>${course.weightedPoints.toFixed(2)}</td>
          </tr>
        `
      )
      .join("");

    resultContent.innerHTML = `
      <div class="calculator-results-grid">

        <div class="result-card">
          <h3>GPA</h3>
          <p>${formattedGPA}</p>
        </div>

        <div class="result-card">
          <h3>Total Credits</h3>
          <p>${formattedCredits}</p>
        </div>

        <div class="result-card">
          <h3>Total Grade Points</h3>
          <p>${formattedPoints}</p>
        </div>

      </div>

      <div class="table-wrapper">

        <table class="amortization-table">

          <thead>
            <tr>
              <th scope="col">Course</th>
              <th scope="col">Grade</th>
              <th scope="col">Grade Points</th>
              <th scope="col">Credits</th>
              <th scope="col">Weighted Points</th>
            </tr>
          </thead>

          <tbody>
            ${courseRowsHTML}
          </tbody>

        </table>

      </div>

      <div class="info-box">

        <p>
          <strong>GPA Calculation</strong>
        </p>

        <p>
          Total Grade Points:
          ${formattedPoints}
        </p>

        <p>
          Total Credits:
          ${formattedCredits}
        </p>

        <p>
          GPA =
          ${formattedPoints} ÷ ${formattedCredits}
          =
          <strong>${formattedGPA}</strong>
        </p>

      </div>
    `;

    summaryGPA.textContent = formattedGPA;
    summaryCredits.textContent = formattedCredits;
    summaryPoints.textContent = formattedPoints;

    resultBox.hidden = false;

    resultBox.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function resetCalculator() {
    coursesContainer.innerHTML = "";

    for (let i = 0; i < 3; i++) {
      coursesContainer.appendChild(createCourseRow());
    }

    clearError();

    resultBox.hidden = true;
    resultContent.innerHTML = "";

    summaryGPA.textContent = "—";
    summaryCredits.textContent = "—";
    summaryPoints.textContent = "—";

    updateCourseLabels();

    const firstNameInput =
      coursesContainer.querySelector(".gpa-course-name");

    if (firstNameInput) {
      firstNameInput.focus();
    }
  }

  function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;
  }

  addCourseButton.addEventListener("click", addCourse);

  calculateButton.addEventListener("click", calculateGPA);

  resetButton.addEventListener("click", resetCalculator);

  coursesContainer.addEventListener("click", event => {
    if (event.target.classList.contains("gpa-remove-course")) {
      removeCourse(event.target);
    }
  });

  coursesContainer.addEventListener("keydown", event => {
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault();
      calculateGPA();
    }
  });

  updateCourseLabels();
});