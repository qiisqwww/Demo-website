import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { getAxiosInstance } from "../scripts/axiosInstance";

export function useCheckToken() {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkToken = async () => {
    const axiosInstance = getAxiosInstance();

    try {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_URL}/token`
      );
      if (response.statusText === "OK") {
        setIsLogged(true);
        setIsLoading(false);
      }
    } catch (e: unknown) {
      Cookies.remove("token");
      setIsLoading(false);
      console.error(e);
    }
  };

  useEffect(() => {
    setIsLogged(false);
    if (Cookies.get("token") != undefined) {
      checkToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  return { isLogged, setIsLogged, isLoading, setIsLoading };
}
