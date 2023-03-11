//The message that appears on the bottom. It's a div-element in the document.
const passHintNode = document.getElementById("passHint");
/*
/ Function that retrieves the value from the input-fields and makes a data object with it 
/ that can be used by setDoc to update a document in the DB. 
*/
function getUserData() {
  const password = document.getElementById("newPassword").value;
  const email = document.getElementById("newMail").value;
  const bandname = document.getElementById("newBandname").value;
  const cities = document.getElementById("newCities").value;

  const data = {
    bandName: bandname,
    cities: [cities],
    email: email,
    password: password,
  };
  return data;
}

//Function to send new Userdata to server to update user with
async function update() {
  let password = document.getElementById("newPassword").value;
  let passwordCheck = document.getElementById("newPasswordCheck").value;
  let email = document.getElementById("newMail").value;
  let bandname = document.getElementById("newBandname").value;
  if (allFilledOut(password, email, bandname, passwordCheck)) {
    const data = getUserData();

    if (
      confirm("Du er ved at ændre dine oplysninger. Ønsker du at fortsætte?")
    ) {
      // Data to send to the server
      const response = await fetch("/editUser", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      try {
        const res = await response.json();
        if (response.status !== 201) {
          alert("Noget gik galt");
          window.location.href = "/editUser";
        } else {
          alert("Oplysninger opdateret!");
          window.location.href = "/editUser";
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}

/*
    / AllFilledOut checks if all the fields are filled out and if password is equal to password-check,
    / If not it returns false. This function is used by getUserData() as it uses getUserData()'s values as inputs  
    */
function allFilledOut(password, email, bandname, passwordCheck) {
  if (email == "" || !checkEmail(email)) {
    showPassHint("E-mail mangler eller forkert struktur!");
    return false;
  }
  if (!verifyPasswordInput(password)) {
    showPassHint("Password skal udfyldes!");
    return false;
  }
  if (password != passwordCheck) {
    showPassHint("Password og gentagelse af password stemmer ikke overens!");
    return false;
  }
  if (bandname == "" || bandname.length < 3) {
    showPassHint("Bandnavn mangler eller for kort!");
    return false;
  }
  return true;
}

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
