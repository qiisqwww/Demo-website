import axios from "axios";
import Cookies from "js-cookie";

export const getAxiosInstance = () => {
  const token = Cookies.get("token");

  const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return axiosInstance;
};
