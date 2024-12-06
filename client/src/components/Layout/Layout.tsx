// import React from 'react'
import {Routes, Route, Link} from "react-router-dom"
import Login from "../../pages/Login/Login"
import Register from "../../pages/Register/Register"
import Profile from "../../pages/Profile/Profile"
import NotFound from '../../pages/NotFound/NotFound'
import styles from "./Layout.module.css"

export default function Layout() {
	return (
		<Routes>
				<Route path='/' element={<Link to="/login" className={styles.button}>Log in</Link>}/>
				<Route path="/login" element={<Login />}/>
				<Route path="/registration" element={<Register/>}/>
				<Route path="/me" element={<Profile />}/>
				<Route path='*' element={<NotFound />}/>
		</Routes>
	)
}
