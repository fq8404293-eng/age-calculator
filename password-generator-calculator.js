document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("password-generator-form");

  const lengthInput = document.getElementById("password-length");

  const uppercaseCheckbox = document.getElementById("include-uppercase");
  const lowercaseCheckbox = document.getElementById("include-lowercase");
  const numbersCheckbox = document.getElementById("include-numbers");
  const symbolsCheckbox = document.getElementById("include-symbols");

  const lengthError = document.getElementById("password-length-error");
  const characterTypesError = document.getElementById("character-types-error");

  const result = document.getElementById("password-result");
  const generatedPassword = document.getElementById("generated-password");
  const copyPasswordButton = document.getElementById("copy-password");

  const summaryLength = document.getElementById("summary-password-length");
  const summaryCharacterTypes = document.getElementById("summary-character-types");
  const summaryStrength = document.getElementById("summary-password-strength");

  const resultText = document.getElementById("password-result-text");
  const clearButton = document.getElementById("clear-password");

  const CHARACTER_SETS = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()-_=+[]{};:,.?/<>~"
  };

  function clearErrors() {
    lengthError.textContent = "";
    lengthError.hidden = true;

    characterTypesError.textContent = "";
    characterTypesError.hidden = true;
  }

  function getSelectedCharacterSets() {
    const sets = [];

    if (uppercaseCheckbox.checked) {
      sets.push({
        name: "Uppercase",
        characters: CHARACTER_SETS.uppercase
      });
    }

    if (lowercaseCheckbox.checked) {
      sets.push({
        name: "Lowercase",
        characters: CHARACTER_SETS.lowercase
      });
    }

    if (numbersCheckbox.checked) {
      sets.push({
        name: "Numbers",
        characters: CHARACTER_SETS.numbers
      });
    }

    if (symbolsCheckbox.checked) {
      sets.push({
        name: "Symbols",
        characters: CHARACTER_SETS.symbols
      });
    }

    return sets;
  }

  function secureRandomInt(max) {
    if (max <= 0) {
      return 0;
    }

    if (
      window.crypto &&
      typeof window.crypto.getRandomValues === "function"
    ) {
      const randomArray = new Uint32Array(1);

      const maxUint32 = 4294967296;
      const limit = maxUint32 - (maxUint32 % max);

      do {
        window.crypto.getRandomValues(randomArray);
      } while (randomArray[0] >= limit);

      return randomArray[0] % max;
    }

    return Math.floor(Math.random() * max);
  }

  function randomCharacter(characters) {
    return characters.charAt(
      secureRandomInt(characters.length)
    );
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = secureRandomInt(i + 1);

      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }

  function generatePassword(length, characterSets) {
    const allCharacters = characterSets
      .map(set => set.characters)
      .join("");

    const passwordCharacters = [];

    /*
     * Make sure the generated password contains at least
     * one character from every selected character type.
     */
    characterSets.forEach(set => {
      passwordCharacters.push(
        randomCharacter(set.characters)
      );
    });

    while (passwordCharacters.length < length) {
      passwordCharacters.push(
        randomCharacter(allCharacters)
      );
    }

    shuffleArray(passwordCharacters);

    return passwordCharacters.join("");
  }

  function getStrength(length, characterSetCount) {
    if (length >= 16 && characterSetCount >= 3) {
      return "Strong";
    }

    if (length >= 12 && characterSetCount >= 3) {
      return "Good";
    }

    if (length >= 12 && characterSetCount >= 2) {
      return "Moderate";
    }

    if (length >= 8 && characterSetCount >= 2) {
      return "Fair";
    }

    return "Basic";
  }

  function validate() {
    clearErrors();

    const length = Number(lengthInput.value);
    const characterSets = getSelectedCharacterSets();

    let valid = true;

    if (
      !Number.isInteger(length) ||
      length < 4 ||
      length > 128
    ) {
      lengthError.textContent =
        "Please enter a password length between 4 and 128 characters.";
      lengthError.hidden = false;

      valid = false;
    }

    if (characterSets.length === 0) {
      characterTypesError.textContent =
        "Please select at least one character type.";
      characterTypesError.hidden = false;

      valid = false;
    }

    if (
      valid &&
      characterSets.length > length
    ) {
      characterTypesError.textContent =
        "Password length must be at least as long as the number of selected character types.";
      characterTypesError.hidden = false;

      valid = false;
    }

    return {
      valid,
      length,
      characterSets
    };
  }

  form.addEventListener("submit", event => {
    event.preventDefault();

    const validation = validate();

    if (!validation.valid) {
      result.hidden = true;
      return;
    }

    const {
      length,
      characterSets
    } = validation;

    const password = generatePassword(
      length,
      characterSets
    );

    const characterTypeNames = characterSets
      .map(set => set.name)
      .join(", ");

    const strength = getStrength(
      length,
      characterSets.length
    );

    generatedPassword.value = password;

    summaryLength.textContent =
      `${length} characters`;

    summaryCharacterTypes.textContent =
      characterTypeNames;

    summaryStrength.textContent =
      strength;

    resultText.innerHTML =
      `A random <strong>${length}-character password</strong> was generated using ${characterTypeNames.toLowerCase()}.`;

    result.hidden = false;

    setTimeout(() => {
      result.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 50);
  });

  copyPasswordButton.addEventListener("click", async () => {
    const password = generatedPassword.value;

    if (!password) {
      return;
    }

    try {
      await navigator.clipboard.writeText(password);

      const originalText =
        copyPasswordButton.textContent;

      copyPasswordButton.textContent =
        "Copied!";

      setTimeout(() => {
        copyPasswordButton.textContent =
          originalText;
      }, 1500);

    } catch (error) {
      generatedPassword.focus();
      generatedPassword.select();

      try {
        document.execCommand("copy");

        const originalText =
          copyPasswordButton.textContent;

        copyPasswordButton.textContent =
          "Copied!";

        setTimeout(() => {
          copyPasswordButton.textContent =
            originalText;
        }, 1500);

      } catch (fallbackError) {
        copyPasswordButton.textContent =
          "Copy Failed";

        setTimeout(() => {
          copyPasswordButton.textContent =
            "Copy Password";
        }, 1500);
      }
    }
  });

  clearButton.addEventListener("click", () => {
    lengthInput.value = "16";

    uppercaseCheckbox.checked = true;
    lowercaseCheckbox.checked = true;
    numbersCheckbox.checked = true;
    symbolsCheckbox.checked = true;

    clearErrors();

    generatedPassword.value = "";

    summaryLength.textContent = "—";
    summaryCharacterTypes.textContent = "—";
    summaryStrength.textContent = "—";

    resultText.textContent = "";

    result.hidden = true;

    lengthInput.focus();
  });
});