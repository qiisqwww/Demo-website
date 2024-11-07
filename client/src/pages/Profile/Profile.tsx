// import React from 'react'

import axios from "axios"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import styles from "./Profile.module.css"

interface IProfileData{
	username: string
	email: string
	birthdate: string
}

export default function Profile() {
	const [user, setUser] = useState<IProfileData>({
		username: "",
		email: "",
		birthdate: ""
	})

	const token = Cookies.get('token');

// Создаем экземпляр Axios с заголовком Authorization
	const axiosInstance = axios.create({
		baseURL: 'https://your-api-url.com', // Замените на URL вашего API
		headers: {
			Authorization: `Bearer ${token}`, // Передаем токен как Bearer-токен
		},
	});

	const fetchData = async () => {
		try{
			const response = await axiosInstance.get<IProfileData>(`${import.meta.env.VITE_API_URL}/me`)
			console.log(response.data)
			setUser(response.data)
		}catch(e:unknown){
			console.error(e)
		}
	}

	useEffect(() => {
		fetchData()
	}, [])

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Profile</h1>
			<p className={styles.text}>Username:  <span className={styles.data}>{user.username}</span></p>
			<p className={styles.text}>Birthday:  <span className={styles.data}>{user.birthdate}</span></p>
			<p className={styles.text}>Email:  <span className={styles.data}>{user.email}</span></p>
		</div>
	)
}
