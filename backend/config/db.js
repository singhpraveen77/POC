import prisma from "./prisma.js";
import logger from "./logger.js";

export const connectDB = async () => {
  try {
    logger.info("Checking database connection...");
    await prisma.$connect();
    await prisma.$queryRaw`SELECT NOW()`;
    logger.info("Database connected successfully.");
  } catch (error) {
    logger.error("Database connection failed.");
    logger.error(error);
    process.exit(1);
  }
};