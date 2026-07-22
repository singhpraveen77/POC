import bcrypt from "bcrypt";
import crypto from "crypto";


export const hashPassword = (password) => {
  return bcrypt.hash(password, 10);
};

export const hashToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

export const isMatch = (enteredPassword, storedHashedPassword) => {
  return bcrypt.compare(enteredPassword, storedHashedPassword);
};

