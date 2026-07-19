import express from "express";
import cors from "cors"
import errorHandler from "./src/middleware/errorHandler.js";
import morganMiddleware from "./src/middleware/morgon.middleware.js";
import cookieParser from "cookie-parser";
import authRoutes from "./src/routes/auth.routes.js";
import workspaceRoutes from "./src/routes/workspace.routes.js";
import boardRoutes from "./src/routes/board.routes.js";
import columnRoutes from "./src/routes/column.routes.js";
import taskRoutes from "./src/routes/task.routes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
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
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/columns", columnRoutes);
app.use("/api/tasks", taskRoutes);
app.use(errorHandler);

export default app;