import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export function useCheckToken(){
	const [isLogged, setIsLogged] = useState(false);
	const [isLoading, setIsLoading] = useState(true)

	const checkToken = async () => {
		const token = Cookies.get('token');

		const axiosInstance = axios.create({
			baseURL: `${import.meta.env.VITE_API_URL}`, 
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		try{
			const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/token`)
			if (response.statusText === "OK"){
				setIsLogged(true)
				setIsLoading(false)
			}
		}catch (e:unknown){
			Cookies.remove("token")
			setIsLoading(false)
			console.error(e)
		}
	}

	useEffect(() => {
		setIsLogged(false)
		if (Cookies.get("token") != undefined){
			checkToken()
		}else{
			setIsLoading(false)
		}
	}, [])

	return {isLogged, setIsLogged ,isLoading, setIsLoading}
}