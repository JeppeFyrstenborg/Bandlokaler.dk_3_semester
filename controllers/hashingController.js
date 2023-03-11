import argon2 from "argon2";
import crypto from "crypto";

const hashingConfig = {
  // based on OWASP cheat sheet recommendations (as of March, 2022)
  parallelism: 1,
  memoryCost: 64000, // 64 mb
  timeCost: 3, // number of itetations
};

/**
 * - This funktion i used for encrypting a password.
 * @param password - The password that needs to be hashed.
 * @returns - A hashed password + salt.
 */
export async function hashPassword(password) {
  let salt = crypto.randomBytes(16);
  return await argon2.hash(password, {
    ...hashingConfig,
    salt,
  });
}

/**Funtion to verify a password against a password in the db.
 *
 * @param {*} password -The password that needs to be checked.
 * @param {*} hash - The hash that the password needs to be checked against.
 * @returns Returns true if the password is correct, false otherwise.
 */
export async function verifyPasswordWithHash(password, hash) {
  return await argon2.verify(hash, password, hashingConfig);
}

// Test of a rdandom password.
// hashPassword("Fyrsten&1").then(async (hash) => {
//   console.log("Hash + salt of the password:", hash);
//   console.log(
//     "Password verification success:",
//     await verifyPasswordWithHash("Fyrsten&2", hash)
//   );
// });
