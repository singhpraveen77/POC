import winston from "winston";
import path from "path";
import fs from "fs";

const logger = winston.createLogger({
  level: "info",

  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),

    winston.format.errors({
      stack: true,
    }),

    winston.format.printf(({ level, message, timestamp, stack }) => {
      return `${timestamp} [${level.toUpperCase()}] : ${stack || message}`;
    })
  ),

  transports: [
      new winston.transports.Console(),
  ],

  exceptionHandlers: [
      new winston.transports.Console(),
  ],
});

export default logger;