// import React from 'react'

import axios from "axios"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import styles from "./Profile.module.css"
import { Navigate } from "react-router-dom"
import { Avatar, Modal } from "antd"
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons"
import CustomModal from "../../components/CustomModal/CustomModal"

interface IProfileData{
	username: string
	email: string
	birthdate: string
}

export default function Profile() {
	const [isLogged, setIsLogged] = useState(true);
	const [modal, contextHolder] = Modal.useModal()

	const [user, setUser] = useState<IProfileData>({
		username: "",
		email: "",
		birthdate: ""
	})
	const [loading, setLoading] = useState(true)

	const token = Cookies.get('token');

	const axiosInstance = axios.create({
		baseURL: `${import.meta.env.VITE_API_URL}`, 
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const fetchData = async () => {
		try{
			setLoading(true)
			const response = await axiosInstance.get<IProfileData>(`${import.meta.env.VITE_API_URL}/me`)
			setUser(response.data)
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

	const confirm = () => {
		modal.confirm({
			title: 'Log out???',
			content: 'Are you sure you want to log out?',
			icon: <ExclamationCircleOutlined style={{color: "#D00"}}/>,
			okText: "Yes",
			cancelText: "No",
			centered: true,
			onOk: logout
		});
	}
	

	useEffect(() => {
		fetchData()
	}, [])

	if (isLogged){
		return (
			<>
				<div className={styles.page}>
					<h1 className={styles.title}>Profile</h1>
					<hr />
					{loading ?
						<LoadingOutlined style={{position: "absolute", left: "50%", fontSize: 30, marginTop: 20}}/>
						:
						<div className={styles.flex}>
							<Avatar className={styles.avatar} src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
							<div>
								<h2 className={styles.username}>{user.username}</h2>
								<div className={styles.flex}>
									<h3 className={styles.email}>{user.email}</h3>
									<span className={styles.birth}>({user.birthdate})</span>
								</div>
							</div>
							<button className={styles.button} onClick={confirm}>
								Log out
							</button>
						</div>
					}
				</div>
				<CustomModal />
				{contextHolder}
			</>
		)
	}else{
		return <Navigate to="/login"/>
	}
	
}
