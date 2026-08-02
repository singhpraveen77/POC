import axios from "axios";

// const BASE_URL = import.meta.env.VITE_local_BASE_URL;

const BASE_URL = import.meta.env.VITE_prod_BASE_URL;

export const axiosImageInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,

  headers: { "Content-Type": "multipart/form-data" },
 
});
