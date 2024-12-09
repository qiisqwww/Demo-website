// import React from 'react'
import { Routes, Route } from "react-router-dom";
import Login from "../../pages/Login/Login";
import Register from "../../pages/Register/Register";
import Profile from "../../pages/Profile/Profile";
import NotFound from "../../pages/NotFound/NotFound";
import Refills from "../../pages/Refills/Refills";
import Refill from "../../pages/Refill/Refill";
import Header from "../Header/Header";
import Landing from "../../pages/Landing/Landing";

export default function Layout() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/refills" element={<Refills />} />
        <Route path="/registration" element={<Register />} />
        <Route path="/refill/:id" element={<Refill />} />
        <Route path="/me" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
