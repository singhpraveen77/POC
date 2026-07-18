import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import logger from "./config/logger.js";
import prisma from "./config/prisma.js";

process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION! 💥");
  logger.error(err);
  process.exit(1);
});

const startServer = async () => {
  try {
    
    await connectDB();

    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT}`);
    });

    process.on("unhandledRejection", (err) => {
      logger.error("UNHANDLED REJECTION! 💥");
      logger.error(err);

      server.close(() => {
        process.exit(1);
      });
    });

  } catch (err) {
    logger.error("❌ Failed to connect to the database.");
    logger.error(err);
    process.exit(1);
  }
};

startServer();