import axios from "axios";

const BASE_URL = import.meta.env.VITE_local_BASE_URL;
// const BASE_URL = import.meta.env.VITE_prod_BASE_URL;
console.log("BaseUrl : ",BASE_URL);

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;