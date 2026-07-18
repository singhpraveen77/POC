import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice";
import workspaceReducer from "./workspace/workspaceSlice";
import boardReducer from "./board/boardSlice";
import columnReducer from "./column/columnSlice";
import taskReducer from "./task/taskSlice";
import toastReducer from "./toast/toastSlice";

import frontendLogger from "./middleware/logger";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspaces: workspaceReducer,
    boards: boardReducer,
    columns: columnReducer,
    tasks: taskReducer,
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(frontendLogger),
});