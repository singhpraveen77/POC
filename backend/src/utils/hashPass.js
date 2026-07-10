import bcrypt from "bcrypt";

export const hashPassword = (password) => {
  return bcrypt.hash(password, 10);
};

export const isMatch = (enteredPassword, storedHashedPassword) => {
  return bcrypt.compare(enteredPassword, storedHashedPassword);
};

