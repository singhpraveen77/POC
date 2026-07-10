import express from "express";

import errorHandler from "./src/middleware/errorHandler.js";
import morganMiddleware from "./src/middleware/morgon.middleware.js";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.routes.js";

const app = express();

app.use(cors({
  origin: "*"
}));
app.use(cookieParser());
app.use(express.json());
app.use(morganMiddleware);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server Running",
  });
});

app.use("/api/auth", authRoutes);
app.use(errorHandler);

export default app;