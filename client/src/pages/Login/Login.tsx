import { useState } from 'react'
import { Button, Form, Input } from 'antd';
import { LoadingOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Link, Navigate } from 'react-router-dom';
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import styles from "../Form.module.css"
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
}

export default function Login() {
	const [error, setError] = useState("");
	const {isLogged, setIsLogged, isLoading, setIsLoading} = useCheckToken();

	const onSubmit = async (values:IFormValues) => {
		try{
			setIsLoading(true)
			const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { username: values.username, password: values.password });
			const token = response.data.access_token;
			saveTokenInCookie(token);
			setError("")
			setIsLogged(true);
		}catch(error:unknown){
			const e = error as AxiosError;
			if (e.request.status === 401){
				const message = JSON.parse(e.request.response)
				setError(message.detail)
			}else{
				setError("Error, try again")
			}
		} finally {
			setIsLoading(false)
		}
	} 

	if (isLogged) return <Navigate to="/me" />;
	
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
						rules={[
							{ required: true, message: 'Please input your Username!' },
							{ 
								min: 3, 
								message: 'Username must be at least 3 characters long' 
							}
						]}
					>
						<Input prefix={<UserOutlined />} placeholder="Username" minLength={3}/>
					</Form.Item>
					<Form.Item
						name="password"
						rules={[
							{ required: true, message: 'Please input your Password!' },
							{ 
								min: 3, 
								message: 'Password must be at least 3 characters long' 
							}
						]}
					>
						<Input.Password prefix={<LockOutlined />} type="password" placeholder="Password" minLength={3}/>
					</Form.Item>

					<Form.Item className={styles.button}>
						{isLoading ? 
						<Button block type="primary" htmlType="submit" disabled>
							Log in
							<LoadingOutlined style={{position: "absolute", right: 10 }}/>
						</Button>
						:
						<Button block type="primary" htmlType="submit">
							Log in
						</Button>
						}
						
						or <Link to="/registration">Register now!</Link>
					</Form.Item>
				</Form>	
			</div>
		</>
	)
}
