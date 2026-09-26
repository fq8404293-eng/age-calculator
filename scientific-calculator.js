document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const expressionDisplay = document.getElementById("scientific-expression");
  const resultDisplay = document.getElementById("scientific-result");
  const keypad = document.querySelector(".scientific-keypad");

  const degreeModeButton = document.getElementById("degree-mode");
  const radianModeButton = document.getElementById("radian-mode");
  const memoryIndicator = document.getElementById("memory-indicator");

  if (
    !expressionDisplay ||
    !resultDisplay ||
    !keypad ||
    !degreeModeButton ||
    !radianModeButton
  ) {
    return;
  }

  let expression = "";
  let lastAnswer = 0;
  let memory = 0;
  let angleMode = "DEG";
  let justCalculated = false;


  /* --------------------------------------------------
     Display
  -------------------------------------------------- */

  function updateDisplay() {
    expressionDisplay.textContent = expression || "";
    resultDisplay.textContent = expression ? expression : "0";
  }


  function showResult(value) {
    resultDisplay.textContent = formatNumber(value);
  }


  function formatNumber(value) {
    if (!Number.isFinite(value)) {
      return "Error";
    }

    if (Math.abs(value) < 1e-12) {
      value = 0;
    }

    const rounded = Number(value.toPrecision(12));

    return rounded.toLocaleString("en-US", {
      useGrouping: false,
      maximumFractionDigits: 12
    });
  }


  function displayExpression(expressionText) {
    return expressionText
      .replaceAll("*", "×")
      .replaceAll("/", "÷")
      .replaceAll("-", "−");
  }


  /* --------------------------------------------------
     Memory
  -------------------------------------------------- */

  function updateMemoryIndicator() {
    memoryIndicator.textContent = `Memory: ${formatNumber(memory)}`;
  }


  function getCurrentNumericValue() {
    try {
      if (!expression.trim()) {
        return lastAnswer;
      }

      return evaluateExpression(expression);
    } catch {
      return lastAnswer;
    }
  }


  /* --------------------------------------------------
     Angle conversion
  -------------------------------------------------- */

  function toRadians(value) {
    return angleMode === "DEG"
      ? value * Math.PI / 180
      : value;
  }


  function fromRadians(value) {
    return angleMode === "DEG"
      ? value * 180 / Math.PI
      : value;
  }


  /* --------------------------------------------------
     Factorial
  -------------------------------------------------- */

  function factorial(n) {
    if (!Number.isFinite(n)) {
      throw new Error("Invalid factorial");
    }

    if (n < 0 || !Number.isInteger(n)) {
      throw new Error("Factorial requires a non-negative integer");
    }

    if (n > 170) {
      throw new Error("Number too large");
    }

    let result = 1;

    for (let i = 2; i <= n; i++) {
      result *= i;
    }

    return result;
  }


  /* --------------------------------------------------
     Expression tokenizer
  -------------------------------------------------- */

  function tokenize(input) {
    const tokens = [];
    let i = 0;

    while (i < input.length) {
      const char = input[i];

      if (/\s/.test(char)) {
        i++;
        continue;
      }

      if (/[0-9.]/.test(char)) {
        let number = "";

        while (
          i < input.length &&
          /[0-9.eE+-]/.test(input[i])
        ) {
          const current = input[i];

          if (
            (current === "+" || current === "-") &&
            number &&
            !/[eE]$/.test(number)
          ) {
            break;
          }

          number += current;
          i++;
        }

        if (!/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(number)) {
          throw new Error("Invalid number");
        }

        tokens.push({
          type: "number",
          value: Number(number)
        });

        continue;
      }

      if (char === "π") {
        tokens.push({
          type: "number",
          value: Math.PI
        });

        i++;
        continue;
      }

      if (char === "e") {
        tokens.push({
          type: "number",
          value: Math.E
        });

        i++;
        continue;
      }

      if ("+-*/^(),".includes(char)) {
        tokens.push({
          type: char === "," ? "comma" : "operator",
          value: char
        });

        i++;
        continue;
      }

      throw new Error("Invalid character");
    }

    return tokens;
  }


  /* --------------------------------------------------
     Parser
  -------------------------------------------------- */

  function evaluateExpression(input) {
    let tokens = tokenize(input);
    let position = 0;

    function peek() {
      return tokens[position];
    }


    function consume() {
      return tokens[position++];
    }


    function match(value) {
      if (peek() && peek().value === value) {
        position++;
        return true;
      }

      return false;
    }


    function parseExpression() {
      let value = parseTerm();

      while (
        peek() &&
        (peek().value === "+" || peek().value === "-")
      ) {
        const operator = consume().value;
        const right = parseTerm();

        if (operator === "+") {
          value += right;
        } else {
          value -= right;
        }
      }

      return value;
    }


    function parseTerm() {
      let value = parsePower();

      while (
        peek() &&
        (peek().value === "*" || peek().value === "/")
      ) {
        const operator = consume().value;
        const right = parsePower();

        if (operator === "*") {
          value *= right;
        } else {
          if (right === 0) {
            throw new Error("Cannot divide by zero");
          }

          value /= right;
        }
      }

      return value;
    }


    function parsePower() {
      let value = parseUnary();

      if (match("^")) {
        const exponent = parsePower();
        value = Math.pow(value, exponent);
      }

      return value;
    }


    function parseUnary() {
      if (match("+")) {
        return parseUnary();
      }

      if (match("-")) {
        return -parseUnary();
      }

      return parsePrimary();
    }


    function parsePrimary() {
      const token = peek();

      if (!token) {
        throw new Error("Incomplete expression");
      }

      if (token.type === "number") {
        consume();
        return token.value;
      }

      if (match("(")) {
        const value = parseExpression();

        if (!match(")")) {
          throw new Error("Missing closing parenthesis");
        }

        return value;
      }

      throw new Error("Invalid expression");
    }


    const result = parseExpression();

    if (position < tokens.length) {
      throw new Error("Invalid expression");
    }

    if (!Number.isFinite(result)) {
      throw new Error("Result is not finite");
    }

    return result;
  }


  /* --------------------------------------------------
     Function helpers
  -------------------------------------------------- */

  function appendFunction(name) {
    if (justCalculated) {
      expression = "";
      justCalculated = false;
    }

    expression += `${name}(`;
    updateDisplay();
  }


  function applyFunction(callback, name) {
    try {
      const value = getCurrentNumericValue();
      const result = callback(value);

      if (!Number.isFinite(result)) {
        throw new Error("Invalid result");
      }

      expression = formatNumber(result);
      lastAnswer = result;
      justCalculated = true;

      expressionDisplay.textContent = `${name}(${formatNumber(value)})`;
      showResult(result);

    } catch {
      showError();
    }
  }


  /* --------------------------------------------------
     Scientific functions
  -------------------------------------------------- */

  function calculateSin(value) {
    return Math.sin(toRadians(value));
  }


  function calculateCos(value) {
    return Math.cos(toRadians(value));
  }


  function calculateTan(value) {
    const radians = toRadians(value);

    if (Math.abs(Math.cos(radians)) < 1e-12) {
      throw new Error("Undefined");
    }

    return Math.tan(radians);
  }


  function calculateAsin(value) {
    if (value < -1 || value > 1) {
      throw new Error("Domain error");
    }

    return fromRadians(Math.asin(value));
  }


  function calculateAcos(value) {
    if (value < -1 || value > 1) {
      throw new Error("Domain error");
    }

    return fromRadians(Math.acos(value));
  }


  function calculateAtan(value) {
    return fromRadians(Math.atan(value));
  }


  function calculateLog(value) {
    if (value <= 0) {
      throw new Error("Domain error");
    }

    return Math.log10(value);
  }


  function calculateLn(value) {
    if (value <= 0) {
      throw new Error("Domain error");
    }

    return Math.log(value);
  }


  /* --------------------------------------------------
     Error handling
  -------------------------------------------------- */

  function showError() {
    resultDisplay.textContent = "Error";
  }


  /* --------------------------------------------------
     Clear
  -------------------------------------------------- */

  function clearAll() {
    expression = "";
    lastAnswer = 0;
    justCalculated = false;
    updateDisplay();
  }


  function clearEntry() {
    expression = "";
    justCalculated = false;
    updateDisplay();
  }


  function backspace() {
    if (justCalculated) {
      expression = "";
      justCalculated = false;
      updateDisplay();
      return;
    }

    expression = expression.slice(0, -1);
    updateDisplay();
  }


  /* --------------------------------------------------
     Input handling
  -------------------------------------------------- */

  function appendValue(value) {
    if (justCalculated) {
      if (
        /^[0-9.]$/.test(value) ||
        value === "π" ||
        value === "e" ||
        value === "("
      ) {
        expression = "";
      }

      justCalculated = false;
    }

    expression += value;
    updateDisplay();
  }


  function calculate() {
    if (!expression.trim()) {
      return;
    }

    try {
      const result = evaluateExpression(expression);

      lastAnswer = result;

      expressionDisplay.textContent = displayExpression(expression);
      showResult(result);

      expression = formatNumber(result);
      justCalculated = true;

    } catch {
      showError();
      justCalculated = true;
    }
  }


  /* --------------------------------------------------
     Percentage
  -------------------------------------------------- */

  function applyPercent() {
    try {
      const value = getCurrentNumericValue();
      const result = value / 100;

      expression = formatNumber(result);
      lastAnswer = result;
      justCalculated = true;

      expressionDisplay.textContent = `${formatNumber(value)}%`;
      showResult(result);

    } catch {
      showError();
    }
  }


  /* --------------------------------------------------
     Sign
  -------------------------------------------------- */

  function changeSign() {
    try {
      const value = getCurrentNumericValue();
      const result = -value;

      expression = formatNumber(result);
      lastAnswer = result;
      justCalculated = true;

      showResult(result);

    } catch {
      showError();
    }
  }


  /* --------------------------------------------------
     Memory operations
  -------------------------------------------------- */

  function memoryClear() {
    memory = 0;
    updateMemoryIndicator();
  }


  function memoryRecall() {
    appendValue(formatNumber(memory));
  }


  function memoryAdd() {
    const value = getCurrentNumericValue();

    if (Number.isFinite(value)) {
      memory += value;
      updateMemoryIndicator();
    }
  }


  function memorySubtract() {
    const value = getCurrentNumericValue();

    if (Number.isFinite(value)) {
      memory -= value;
      updateMemoryIndicator();
    }
  }


  /* --------------------------------------------------
     Random number
  -------------------------------------------------- */

  function randomNumber() {
    const result = Math.random();

    expression = formatNumber(result);
    lastAnswer = result;
    justCalculated = true;

    expressionDisplay.textContent = "RAND";
    showResult(result);
  }


  /* --------------------------------------------------
     Button actions
  -------------------------------------------------- */

  function handleAction(action) {
    switch (action) {

      case "clear":
        clearAll();
        break;

      case "clear-entry":
        clearEntry();
        break;

      case "backspace":
        backspace();
        break;

      case "equals":
        calculate();
        break;

      case "sin":
        applyFunction(calculateSin, "sin");
        break;

      case "cos":
        applyFunction(calculateCos, "cos");
        break;

      case "tan":
        applyFunction(calculateTan, "tan");
        break;

      case "asin":
        applyFunction(calculateAsin, "sin⁻¹");
        break;

      case "acos":
        applyFunction(calculateAcos, "cos⁻¹");
        break;

      case "atan":
        applyFunction(calculateAtan, "tan⁻¹");
        break;

      case "log":
        applyFunction(calculateLog, "log");
        break;

      case "ln":
        applyFunction(calculateLn, "ln");
        break;

      case "sqrt":
        applyFunction(
          value => {
            if (value < 0) {
              throw new Error("Domain error");
            }

            return Math.sqrt(value);
          },
          "√"
        );
        break;

      case "square":
        applyFunction(
          value => Math.pow(value, 2),
          "x²"
        );
        break;

      case "factorial":
        applyFunction(
          value => factorial(value),
          "x!"
        );
        break;

      case "reciprocal":
        applyFunction(
          value => {
            if (value === 0) {
              throw new Error("Cannot divide by zero");
            }

            return 1 / value;
          },
          "1/"
        );
        break;

      case "percent":
        applyPercent();
        break;

      case "abs":
        applyFunction(
          value => Math.abs(value),
          "|x|"
        );
        break;

      case "exp":
        appendValue("e^");
        break;

      case "sign":
        changeSign();
        break;

      case "floor":
        applyFunction(
          value => Math.floor(value),
          "floor"
        );
        break;

      case "ceil":
        applyFunction(
          value => Math.ceil(value),
          "ceil"
        );
        break;

      case "ans":
        appendValue(formatNumber(lastAnswer));
        break;

      case "random":
        randomNumber();
        break;

      case "open-parenthesis":
        appendValue("(");
        break;

      case "close-parenthesis":
        appendValue(")");
        break;

      case "decimal":
        appendValue(".");
        break;

      case "memory-clear":
        memoryClear();
        break;

      case "memory-recall":
        memoryRecall();
        break;

      case "memory-add":
        memoryAdd();
        break;

      case "memory-subtract":
        memorySubtract();
        break;

      default:
        break;
    }
  }


  /* --------------------------------------------------
     Keypad click
  -------------------------------------------------- */

  keypad.addEventListener("click", event => {

    const button = event.target.closest(".scientific-key");

    if (!button) {
      return;
    }

    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action) {
      handleAction(action);
      return;
    }

    if (value === "=") {
      calculate();
      return;
    }

    if (value) {
      appendValue(value);
    }
  });


  /* --------------------------------------------------
     Angle mode
  -------------------------------------------------- */

  function setAngleMode(mode) {
    angleMode = mode;

    const degreeActive = mode === "DEG";

    degreeModeButton.classList.toggle(
      "active",
      degreeActive
    );

    radianModeButton.classList.toggle(
      "active",
      !degreeActive
    );

    degreeModeButton.setAttribute(
      "aria-pressed",
      degreeActive ? "true" : "false"
    );

    radianModeButton.setAttribute(
      "aria-pressed",
      degreeActive ? "false" : "true"
    );
  }


  degreeModeButton.addEventListener("click", () => {
    setAngleMode("DEG");
  });


  radianModeButton.addEventListener("click", () => {
    setAngleMode("RAD");
  });


  /* --------------------------------------------------
     Keyboard support
  -------------------------------------------------- */

  document.addEventListener("keydown", event => {

    const key = event.key;

    if (
      key >= "0" &&
      key <= "9"
    ) {
      appendValue(key);
      return;
    }

    if (
      key === "+" ||
      key === "-" ||
      key === "*" ||
      key === "/" ||
      key === "^" ||
      key === "(" ||
      key === ")" ||
      key === "." ||
      key === ","
    ) {
      appendValue(key);
      return;
    }

    if (key === "Enter" || key === "=") {
      event.preventDefault();
      calculate();
      return;
    }

    if (key === "Backspace") {
      event.preventDefault();
      backspace();
      return;
    }

    if (key === "Escape") {
      clearAll();
    }
  });


  /* --------------------------------------------------
     Initial state
  -------------------------------------------------- */

  setAngleMode("DEG");
  updateMemoryIndicator();
  updateDisplay();
});