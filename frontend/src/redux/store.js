import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice";
import workspaceReducer from "./workspace/workspaceSlice";
import boardReducer from "./board/boardSlice";
import columnReducer from "./column/columnSlice";
import taskReducer from "./task/taskSlice";
import toastReducer from "./toast/toastSlice";
import profileReducer from "./profile/profileSlice"
import workspaceMemberReducer from "./member/workspaceMemberSlice";
import workspaceInviteReducer from "./invite/workspaceInviteSlice";
import userSearchReducer from "./search/userSearchSlice";

import frontendLogger from "./middleware/logger";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    workspaces: workspaceReducer,
    boards: boardReducer,
    columns: columnReducer,
    tasks: taskReducer,
    toast: toastReducer,
    workspaceMembers: workspaceMemberReducer,
    workspaceInvites: workspaceInviteReducer,
    userSearch: userSearchReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(frontendLogger),
});