import axiosInstance from './axiosInstance';
import { logout } from '../redux/auth/authSlice';
import toast from 'react-hot-toast';

export const setupAxiosInterceptors = (store) => {
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        if (error.response.status === 401) {
          toast.error('Session expired. Please log in again.');
          store.dispatch(logout());
        } else if (error.response.status >= 500) {
          toast.error('Server error. Please try again later.');
        } else if (error.response.status === 400 || error.response.status === 403 || error.response.status === 409) {

          toast.error(error.response.data.message || 'Invalid request.');
        }
      } else if (error.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('An unexpected error occurred.');
      }
      return Promise.reject(error);
    }
  );
};
