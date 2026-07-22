import axiosInstance from "./axiosInstance";
import { logout } from "../redux/auth/authSlice";
import toast from "react-hot-toast";

export const setupAxiosInterceptors = (store) => {
  axiosInstance.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest = error.config;
    //       {
    //     url: "/auth/me",
    //     method: "get",
    //     headers: {...},
    //     _retry: undefined
    // }

      if (!error.response) { //if there is no response
        toast.error("Network error. Please check your connection.");
        return Promise.reject(error);
      }

      const status = error.response.status;

      // Handle expired access token
      if (status === 401) {
        // If refresh token is also invalid, logout
        if (originalRequest.url === "/auth/refresh-token") {
          store.dispatch(logout());
          return Promise.reject(error);
        }

        // Prevent infinite retry loop
        if (originalRequest._retry) {
          store.dispatch(logout());
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
          // Backend reads refresh token from HttpOnly cookie
          await axiosInstance.post("/auth/refresh-token");

          // Retry the original request
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          store.dispatch(logout());
          return Promise.reject(refreshError);
        }
      }

      if (status >= 500) {
        toast.error("Server error. Please try again later.");
      } else if ([400, 403, 409].includes(status)) {
        toast.error(error.response.data.message || "Invalid request.");
      }

      return Promise.reject(error);
    }
  );
};