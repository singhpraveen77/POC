import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice";
// import taskReducer from "./tasks/taskSlice";
// import themeReducer from "./theme/themeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer ,
    // tasks: taskReducer,
    // theme: themeReducer,
  },
});