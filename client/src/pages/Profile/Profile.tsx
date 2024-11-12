// import React from 'react'

import axios from "axios"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import styles from "./Profile.module.css"
import { Navigate } from "react-router-dom"
import { Avatar, Card } from "antd"
import { LogoutOutlined } from "@ant-design/icons"

interface IProfileData{
	username: string
	email: string
	birthdate: string
}
export default function Profile() {
	const [isLogged, setIsLogged] = useState(true);

	const [user, setUser] = useState<IProfileData>({
		username: "",
		email: "",
		birthdate: ""
	})
	const [loading, setLoading] = useState(false)

	const token = Cookies.get('token');

	const axiosInstance = axios.create({
		baseURL: `${import.meta.env.VITE_API_URL}`, 
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const fetchData = async () => {
		try{
			const response = await axiosInstance.get<IProfileData>(`${import.meta.env.VITE_API_URL}/me`)
			setUser(response.data)
			setLoading(true)
		}catch(e:unknown){
			logout()
			console.error(e)
		}finally{
			setLoading(false)
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
			<>
			<h1>Profile card</h1>
			<Card loading={loading} actions={[<LogoutOutlined onClick={logout} key="edit" />]} style={{ minWidth: 300 }}>
        <Card.Meta
          avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
          title={user.username}
          description={
            <>
              <p className={styles.text}>Birthday:  <span className={styles.data}>{user.birthdate}</span></p>
							<p className={styles.text}>Email:  <span className={styles.data}>{user.email}</span></p>
            </>
          }
        />
      </Card>
			</>
		)
	}else{
		return <Navigate to="/login"/>
	}
	
}
