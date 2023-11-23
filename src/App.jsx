import React, { useState } from "react"
import { Route, Routes } from "react-router-dom"

{/* Components */}
import { UserAuthContextProvider } from "./components/UserAuth"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Navbar from "./components/Navbar"
import CopyrightNotice from "./components/CopyrightNotice"
import ResetPassword from "./components/ResetPassword"

{/* Pages */}
import About from "./pages/AboutUs"
import LandingMap from "./pages/LandingMap"
import Contact from "./pages/Contact"
import NotFound from "./pages/NotFound"

{/* Component Stack */}
function App() {
  return (
    <UserAuthContextProvider>
      <Navbar />
      <Routes>
        {/* User Logged In = False : Routing */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />

        {/* User Logged In = True : Routing, Component must be wrapped by Protected Route to ensure User Auth check */}
        <Route path="/map" element={<ProtectedRoute><LandingMap /></ProtectedRoute>}/>
      </Routes>
      <CopyrightNotice />
    </UserAuthContextProvider>
  )
}

export default App
