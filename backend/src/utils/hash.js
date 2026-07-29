import bcrypt from "bcrypt";
import crypto from "crypto";

const hashRounds = parseInt(process.env.Hash_Rounds, 10) || 10;
export const hashPassword = (password) => {
  return bcrypt.hash(password, hashRounds);
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