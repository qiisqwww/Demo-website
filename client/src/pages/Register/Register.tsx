import React, { useState } from 'react'
import { Button, DatePicker, Form, Input } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import dayjs from 'dayjs';
import styles from "../Form.module.css"
import axios, { AxiosError } from 'axios';
import Cookies from "js-cookie";
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
	email: string
	date: dayjs.Dayjs
}

export default function Register() {
	const [isLogged, setIsLogged] = useState(false);
	const [error, setError] = useState("");

  const onSubmit = async (values:IFormValues) => {
		console.log(values)
		console.log(values.date.format("DD.MM.YYYY"))
		try{
			const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, { 
				username: values.username, 
				password: values.password,
				birthday: values.date.format("YYYY-MM-DD"),
				email: values.email
			});
			const token = response.data.token;
			saveTokenInCookie(token);
			setIsLogged(true)
			setError("")
		}catch(error:unknown){
			const e = error as AxiosError;
			console.error("Ошибка при регистрации: " + e)
			setError("Ошибка, попробуйте еще раз")
		}
	} 

	if(isLogged){
		return <Navigate to="/me" />
	}else{
		return (
		<>
			<h1 className={styles.title}>Registration</h1>
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
						name="email"
						rules={[
							{ 
								required: true, 
								message: 'Please input your Email!' },
							{
								type: 'email',
								message: 'The input is not valid Email!',
							},
						]}
					>
						<Input prefix={<MailOutlined />} placeholder="Email" />
					</Form.Item>

					<Form.Item
						name="date"
						hasFeedback
						rules={[{ required: true, message: 'Please input your birth!' }]}
					>
						<DatePicker style={{width:"100%"}} placeholder="Birthday" format={"DD/MM/YY"}/>
					</Form.Item>

					<Form.Item
						name="password"
						hasFeedback
						rules={[{ required: true, message: 'Please input your Password!' }]}
					>
						<Input.Password prefix={<LockOutlined />} type="password" placeholder="Password" />
					</Form.Item>

					<Form.Item
						name="confirm"
						dependencies={['password']}
						hasFeedback
						rules={[
							{
								required: true,
								message: 'Please confirm your password!',
							},
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue('password') === value) {
										return Promise.resolve();
									}
									return Promise.reject(new Error('The new password that you entered do not match!'));
								},
							}),
						]}
					>
						<Input.Password prefix={<LockOutlined />} type="password" placeholder="Confirm password" />
					</Form.Item>

					<Form.Item className={styles.button}>
						<Button block type="primary" htmlType="submit">
							Register
						</Button>
						or <Link to="/login">Log in now!</Link>
					</Form.Item>
				</Form>	
			</div>
		</>
	)}
}
