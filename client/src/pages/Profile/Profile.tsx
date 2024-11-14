// import React from 'react'
import axios, { AxiosError } from "axios"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import styles from "./Profile.module.css"
import { Navigate } from "react-router-dom"
import { message, Modal, Upload, UploadProps } from "antd"
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons"
import dayjs from 'dayjs';
import CustomModal from "../../components/CustomModal/CustomModal"
import { RcFile } from "antd/es/upload"

interface IProfileData{
	username: string
	email: string
	birthdate: dayjs.Dayjs,
	photo_url: string
}

export default function Profile() {
	const [isLogged, setIsLogged] = useState(true);
	const [modal, contextHolder] = Modal.useModal()
	const [age, setAge] = useState(0)
	const [user, setUser] = useState<IProfileData>({
		username: "",
		email: "",
		birthdate: dayjs(),
		photo_url: ""
	})
	const [loading, setLoading] = useState(true)

	const handleChange: UploadProps['onChange'] = (info) => {
		console.log(info)
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
			setLoading(false);
			return
    }
		if (info.file.status === 'error'){
			setLoading(false);
			return
		}
  };

	const changePhoto = async (file: RcFile): Promise<void> => {
		try{
			setLoading(true)
			const formData = new FormData();
    	formData.append('user_image', file);
			const response = await axiosInstance.post(`${import.meta.env.VITE_API_URL}/profile-image`, formData)
			setUser(response.data)
			setLoading(false)
		}catch(error: unknown){
			const e = error as AxiosError;
			if (e.request.status === 422){
				const message = JSON.parse(e.request.response)
				console.log(message)
			}
		}
	}

	const beforeUpload = (file: RcFile) => {
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
		if (!isJpgOrPng) {
			message.error('You can only upload JPG/PNG file!');
		}
		const isLt2M = file.size / 1024 / 1024 < 10;
		if (!isLt2M) {
			message.error('Image must smaller than 10MB!');
		}
	
		if (isJpgOrPng && isLt2M){
			changePhoto(file)
		}
		return false;
	};

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
			console.log(user.birthdate)
			setAge(dayjs().diff(user.birthdate, "year"))
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
							<Upload
								name="avatar"
								listType="picture-circle"
								className={styles.avatarUploader}
								showUploadList={false}
								beforeUpload={beforeUpload}
								onChange={handleChange}
							>
								<img src={import.meta.env.VITE_STATIC_URL + user.photo_url} alt="avatar" style={{ width: '100%' }} className={styles.avatar}/>
							</Upload>
							<div>
								<h2 className={styles.username}>{user.username}</h2>
								<div className={styles.flex}>
									<h3 className={styles.email}>{user.email}</h3>
									<span className={styles.birth}>(age: {age})</span>
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
