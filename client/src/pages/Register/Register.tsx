import { useState } from 'react'
import { Button, DatePicker, Form, Input } from 'antd';
import { LoadingOutlined, LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import dayjs from 'dayjs';
import styles from "../Form.module.css"
import axios, { AxiosError } from 'axios';
import Cookies from "js-cookie";
import ErrorMessage from "../../components/ErrorMessage/Error"
import { useCheckToken } from '../../hooks/checkToken';

const saveTokenInCookie = (token:string):void => {
	Cookies.set('token', token, {
		expires: 7,
		secure: import.meta.env.NODE_ENV === 'production', 
		sameSite: 'Strict',
	});
};

interface IFormValues {
	username: string
	password: string
	email: string
	date: dayjs.Dayjs
}

export default function Register() {
	const [error, setError] = useState("");
	const [registered, setRegistered] = useState(false);
	const {isLogged, setIsLogged, isLoading, setIsLoading} = useCheckToken();

  const onSubmit = async (values:IFormValues) => {
		try{
			setIsLoading(true)
			const response = await axios.post(`${import.meta.env.VITE_API_URL}/registration`, { 
				username: values.username, 
				email: values.email,
				birthdate: values.date.format("YYYY-MM-DD"),
				password: values.password
			});
			const token = response.data.token;
			saveTokenInCookie(token);
			setError("")
			setRegistered(true)
			setIsLogged(false)
		}catch(error:unknown){
			const e = error as AxiosError;
			if (e.request.status === 422){
				const message = JSON.parse(e.request.response)
				setError(message.detail)
			}else{
				setError("Error, try again")
			}
		}finally{
			setIsLoading(false)
		}
	}

	if(registered) return <Navigate to="/login" />
	if(isLogged) return <Navigate to="/me" />
	
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
						rules={[
							{ required: true, message: 'Please input your username!' },
							{ min: 3, message: 'Username must be at least 3 characters long' }]}
					>
						<Input prefix={<UserOutlined />} placeholder="Username" minLength={3}/>
					</Form.Item>

					<Form.Item
						name="email"
						rules={[
							{ 
								required: true, 
								message: 'Please input your email!' 
							},
							{
								type: 'email',
								message: 'The input is not valid email!',
							},
							{ 
								min: 3, 
								message: 'email must be at least 3 characters long' 
							}
						]}
					>
						<Input prefix={<MailOutlined />} placeholder="Email" minLength={3}/>
					</Form.Item>

					<Form.Item
						name="date"
						hasFeedback
						rules={[
							{ 
								required: true, 
								message: 'Please input your birth!' 
							}
						]}
					>
						<DatePicker style={{width:"100%"}} placeholder="Birthday" format={"DD/MM/YY"}/>
					</Form.Item>

					<Form.Item
						name="password"
						hasFeedback
						rules={[
							{ required: true, message: 'Please input your password!' },
							{ 
								min: 3, 
								message: 'Password must be at least 3 characters long' 
							}
						]}
					>
						<Input.Password prefix={<LockOutlined />} type="password" placeholder="Password" minLength={3}/>
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
							{ 
								min: 3, 
								message: 'Password must be at least 3 characters long' 
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
						<Input.Password prefix={<LockOutlined />} type="password" placeholder="Confirm password" minLength={3}/>
					</Form.Item>

					<Form.Item className={styles.button}>
					{isLoading ? 
						<Button block type="primary" htmlType="submit" disabled>
							Register
							<LoadingOutlined style={{position: "absolute", right: 10 }}/>
						</Button>
						:
						<Button block type="primary" htmlType="submit">
							Register
						</Button>
						}
						or <Link to="/login">Log in now!</Link>
					</Form.Item>
				</Form>	
			</div>
		</>
	)
}
