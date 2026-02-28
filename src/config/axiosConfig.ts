import axios from 'axios';
import type { AxiosInstance } from 'axios';

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: true,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});
