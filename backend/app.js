import express from "express";

import { errorHandler }
from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server Running",
  });
});

app.use(errorHandler);

export default app;