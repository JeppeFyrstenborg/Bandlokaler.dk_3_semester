//The message that appears on the bottom. It's a div-element in the document.
const passHintNode = document.getElementById("passHint");

/**
 * Function changes the state of the passhint. It gets the class show, and it will appear in the bottom of the screen.
 * @param {String} Message to show in the passhint when it appears.
 */
function showPassHint(message) {
  passHintNode.textContent = message;
  passHintNode.className = "show";
  setTimeout(function () {
    passHintNode.className = passHintNode.className.replace("show", "");
  }, 3000);
}

/**
 * Function to check if all demands have been fulfilled.
 * @param {String} The password you wish to verify.
 * @returns True if all demands have been fulfilled otherwise false.
 */
function verifyPasswordInput(password) {
  if (password === "") {
    showPassHint(
      "Indtast adgangskode der indeholder: \r\n - Ét lille bogstav\r\n- Ét stort bogstav\r\n- Ét tal\r\n -Ét special tegn\r\n -Have en længde på minimum 8"
    );
    return false;
  }
  let missingInPass = ["Adgangskoden mangler:"];

  if (!checkForLowercaseLetter(password)) {
    missingInPass.push(" \r\n- Ét lille bogstav");
  }
  if (!checkForUppercaseLetter(password)) {
    missingInPass.push(" \r\n- Ét stort bogstav");
  }
  if (!checkForLength(password)) {
    missingInPass.push(" \r\n- Have en længde på minimum 8");
  }
  if (!checkForNumber(password)) {
    missingInPass.push(" \r\n- Ét tal");
  }
  if (!checkForSpecialChar(password)) {
    missingInPass.push(" \r\n- Ét special tegn");
  }

  if (missingInPass.length > 1) {
    showPassHint(missingInPass.join(" "));
    return false;
  }
  return true;
}
/**
 * Function to validate i a string contains lowercase letters.
 * @param {String} The string you wan't to validate.
 * @returns True if the string contains lowercase letters otherwise false.
 */
function checkForLowercaseLetter(password) {
  return /[a-z]/.test(password);
}
/**
 * A function to check for uppercase letters in a given string.
 * @param {String} The string you want to check.
 * @returns True if the string contains uppercase letters otherwise false.
 */
function checkForUppercaseLetter(password) {
  return /[A-Z]/.test(password);
}
/**
 * A function to validate the lenght of a string.
 * @param {String} The string you want to check.
 * @returns True if the string has a lenght between 8 and 30 otherwise false.
 */
function checkForLength(password) {
  return !(password.length < 8 || password.length > 30);
}
/**
 * A function to check if a string contains a number.
 * @param {String} The string you want to check.
 * @returns True if the string contains a number otherwise false.
 */
function checkForNumber(password) {
  const numbers = /[0-9]/;
  return numbers.test(password);
}
/**
 * Funtion to check if a string contains one special character of the ones below.
 * `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~
 * @param {String} The string you want to check.
 * @returns True if the string contains one special character otherwise false.
 */
function checkForSpecialChar(password) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  return specialChars.test(password);
}

/**
 * A function to check if an email have a correct structure.
 * Example: xxxx@xxxx.com
 * @param {String} The email you want to check.
 * @returns True if it follows the given pattern otherwise false.
 */
function checkEmail(email) {
  let validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return email.match(validRegex);
}

/**
 *Function to check e-mail and password.
 *Specific use for event in input field.
 *It will show a message onthe bottom of the form and change the color of a input.
 * @param {input} The input it needs to validate.
 */
function validateInput(input) {
  if (input.type == "email") {
    let validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!input.value.match(validRegex)) {
      showPassHint("E-mail er enten forkert eller mangler.");
      input.style.background = "#ef8a8a";
    } else {
      input.style.background = "#e9e4e4";
    }
  }
  if (input.type == "password") {
    if (!verifyPasswordInput(input.value)) {
      input.style.background = "#ef8a8a";
    } else {
      input.style.background = "#e9e4e4";
    }
  }
  if (input.type == "text") {
    if (input.value < 3) {
      input.style.background = "#ef8a8a";
    } else {
      input.style.background = "#e9e4e4";
    }
  }
}
/**
 * Function to check if all inputs are filled out.
 * @param form The form that needs checking.
 * @return Returns true or false.
 */
function allFilledOut(form) {
  if (!checkEmail(form.email.value)) {
    showPassHint("E-mail er enten forkert eller mangler.");
    form.email.focus();
    return false;
  }
  if (!verifyPasswordInput(form.password.value)) {
    form.password.focus();
    console.log("hmm...");
    return false;
  }
  if (!checkPassword(form)) {
    console.log("yes");
    showPassHint("Password og gentagelse af password stemmer ikke overens!");
    form.passwordCheck.focus();
    return false;
  }
  if (form.cities.value == "customSelect") {
    showPassHint("Valg af by mangler!");
    form.cities.focus();
    return false;
  }
  if (form.bandName.value.length < 3) {
    showPassHint("Bandnavn er for kort!");
    form.bandName.focus();
    return false;
  }
  return true;
}

/**
 * Function to check if password and checkpassword are the same.
 * @param form The form that needs checking.
 * @return Returns true or false.
 */
function checkPassword(form) {
  let password = form.password.value;
  let passwordCheck = form.passwordCheck.value;
  return passwordCheck == password;
}

/**
 * Function to check if email allready exists.
 * @param form The form that needs checking.
 */
async function checkUserAvai(form) {
  if (allFilledOut(form)) {
    const data = {
      email: form.email.value,
      password: form.password.value,
      city: form.cities.value,
      bandName: form.bandName.value,
    };

    // Data to send to the server
    const response = await fetch("/createUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    try {
      const res = await response.json(); // Data recieved from the server
      if (res.message == "User with email allready exist") {
        alert("E-mail allerede i brug!");
        form.email.focus();
      } else {
        console.log(res.message);
        window.location.replace("http://localhost:8080/calendar");
      }
    } catch (error) {
      console.log(error);
    }
  }
}
