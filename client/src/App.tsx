import React from 'react'
import {Routes, Route, Link} from "react-router-dom"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import Profile from "./pages/Profile/Profile"
import styles from "./App.module.css"

function App() {
  return (
    <>
      <header className={styles.header}>
				<Link to="/registration">Regist</Link>
				<Link to="Login">Login</Link>
				<Link to="me">Me</Link>
			</header>
			<Routes>
				<Route path="/login" element={<Login />}/>
				<Route path="/registration" element={<Register />}/>
				<Route path="/me" element={<Profile />}/>
			</Routes>
    </>
  )
}

export default App
