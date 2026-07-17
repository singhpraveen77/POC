import axios from "axios";

const BaseUrl=import.meta.env.BASE_URL
const axiosInstance = axios.create({
  baseURL: BaseUrl,
  // timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;