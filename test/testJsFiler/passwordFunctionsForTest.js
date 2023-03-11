export function verifyPasswordInput(password) {
  // Validate small letters
  if (
    password == password.toLowerCase() &&
    password != password.toUpperCase()
  ) {
    return false;
  }
  // Validate capital letters
  if (
    password != password.toLowerCase() &&
    password == password.toUpperCase()
  ) {
    return false;
  }
  // Validate length
  if (password.length < 8 || password.length > 30) {
    return false;
  }

  // Validate numbers
  const numbers = /[0-9]/;
  if (!numbers.test(password)) {
    return false;
  }
  // Validate special characters
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (!specialChars.test(password)) {
    return false;
  }
  return true;
}
