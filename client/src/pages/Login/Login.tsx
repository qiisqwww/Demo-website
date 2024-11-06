import React, { useState } from 'react'
import { Button, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import styles from "../Form.module.css"
import ErrorMessage from "../../components/ErrorMessage/Error"


const saveTokenInCookie = (token:string):void => {
	Cookies.set('token', token, {
		expires: 7, // Expiration in days
		secure: import.meta.env.NODE_ENV === 'production', // Secure in production
		sameSite: 'Strict', // Adjust according to your needs
	});
};

interface IFormValues {
	username: string
	password: string
}

export default function Login() {
	const [isLogged, setIsLogged] = useState(false);
	const [error, setError] = useState("");

	const onSubmit = async (values:IFormValues) => {
		console.log(values)
		try{
			const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { username: values.username, password: values.password });
			const token = response.data.token;
			saveTokenInCookie(token);
			setIsLogged(true);
			setError("")
		}catch(error:unknown){
			const e = error as AxiosError;
			console.error("Ошибка при логине: " + e);
			setError("Ошибка, попробуйте еще раз")
		}
		
	} 
	if (isLogged){
		return <Navigate to="/me" />;
	}else{
		return (
		<>
			<h1 className={styles.title}>Log in</h1>
			<div className={styles.modal}>
				<Form
					name="login"
					initialValues={{ remember: true }}
					style={{ width: 400 }}
					onFinish={onSubmit}
				>
				{error && <ErrorMessage error={error} />}

					<Form.Item
						name="username"
						rules={[{ required: true, message: 'Please input your Username!' }]}
					>
						<Input prefix={<UserOutlined />} placeholder="Username" />
					</Form.Item>
					<Form.Item
						name="password"
						rules={[{ required: true, message: 'Please input your Password!' }]}
					>
						<Input prefix={<LockOutlined />} type="password" placeholder="Password" />
					</Form.Item>

					<Form.Item className={styles.button}>
						<Button block type="primary" htmlType="submit">
							Log in
						</Button>
						or <Link to="/registration">Register now!</Link>
					</Form.Item>
				</Form>	
			</div>
		</>
	)}
}
