import app from "./app.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import logger from "./config/logger.js";
import prisma from "./config/prisma.js";

dotenv.config();

process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION!");
  logger.error(err);
  process.exit(1);
});

const startServer = async () => {
  try {
    
    await connectDB();

    const server = app.listen(process.env.PORT, () => {
      logger.info(` Server running on port ${process.env.PORT}`);
    });

    process.on("unhandledRejection", (err) => {
      logger.error("UNHANDLED REJECTION!");
      logger.error(err);

      server.close(() => {
        process.exit(1);
      });
    });

  } catch (err) {
    logger.error("Failed to connect to the database.");
    logger.error(err);
    process.exit(1);
  }
};

startServer();