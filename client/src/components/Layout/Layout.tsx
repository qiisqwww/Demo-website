// import React from 'react'
import {Routes, Route, Link} from "react-router-dom"
import Login from "../../pages/Login/Login"
import Register from "../../pages/Register/Register"
import Profile from "../../pages/Profile/Profile"
import NotFound from '../../components/NotFound/NotFound'
import styles from "./Layout.module.css"
import { useState } from "react"

export default function Layout() {
	const [isLogged, setIsLogged] = useState(false);

	return (
		<Routes>
				<Route path='/' element={<Link to="/login" className={styles.button}>Log in</Link>}/>
				<Route path="/login" element={<Login isLogged={isLogged} setIsLogged={setIsLogged}/>}/>
				<Route path="/registration" element={<Register isLogged={isLogged} setIsLogged={setIsLogged}/>}/>
				<Route path="/me" element={<Profile isLogged={isLogged} setIsLogged={setIsLogged}/>}/>
				<Route path='*' element={<NotFound />}/>
		</Routes>
	)
}
