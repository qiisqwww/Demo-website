import React from 'react'
import { Button, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import styles from "../Form.module.css"


interface IFormValues {
	username: string
	password: string
}

export default function Login() {
	const onSubmit = (values:IFormValues) => {
		console.log(values)
	} 

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
	)
}
