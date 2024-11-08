// import React from 'react'

import axios from "axios"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import styles from "./Profile.module.css"
import { Navigate } from "react-router-dom"

interface IProfileData{
	username: string
	email: string
	birthdate: string
}

interface IProfileProps {
	isLogged: boolean
	setIsLogged: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Profile({isLogged, setIsLogged} : IProfileProps) {
	const [user, setUser] = useState<IProfileData>({
		username: "",
		email: "",
		birthdate: ""
	})

	const token = Cookies.get('token');

	const axiosInstance = axios.create({
		baseURL: `${import.meta.env.VITE_API_URL}`, 
		headers: {
			Authorization: `Bearer ${token}`, // Передаем токен как Bearer-токен
		},
	});

	const fetchData = async () => {
		try{
			const response = await axiosInstance.get<IProfileData>(`${import.meta.env.VITE_API_URL}/me`)
			setUser(response.data)
		}catch(e:unknown){
			console.error(e)
		}
	}

	const logout = () => {
		Cookies.remove("token")
		setIsLogged(false)
	}

	useEffect(() => {
		fetchData()
	}, [])

	if (isLogged){
		return (
			<div className={styles.container}>
				<h1 className={styles.title}>Profile</h1>
				<p className={styles.text}>Username:  <span className={styles.data}>{user.username}</span></p>
				<p className={styles.text}>Birthday:  <span className={styles.data}>{user.birthdate}</span></p>
				<p className={styles.text}>Email:  <span className={styles.data}>{user.email}</span></p>
				<button onClick={logout}>Log out</button>
			</div>
		)
	}else{
		return <Navigate to="/login"/>
	}
	
}
