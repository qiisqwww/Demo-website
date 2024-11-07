import React from 'react'
import {Routes, Route, Link} from "react-router-dom"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import Profile from "./pages/Profile/Profile"
import NotFound from './components/NotFound/NotFound'
import style from "./App.module.css"

function App() {
  return (
    <>
			<Routes>
				<Route path='/' element={<Link to="/login" className={style.button}>Log in</Link>}/>
				<Route path="/login" element={<Login />}/>
				<Route path="/registration" element={<Register />}/>
				<Route path="/me" element={<Profile />}/>
				<Route path='*' element={<NotFound />}/>
			</Routes>
    </>
  )
}

export default App
