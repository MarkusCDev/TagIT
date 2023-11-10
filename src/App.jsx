import React, { useState } from "react"
import { Route, Routes } from 'react-router-dom'

/* Components */
import { UserAuthContextProvider } from "./components/UserAuth"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Navbar from "./components/Navbar"

/* Pages */
import Landing from "./pages/Landing"
import Home from "./pages/Home"
import Contact from "./pages/Contact"
import NotFound from "./pages/NotFound"

function App() {
  return (
    
    <UserAuthContextProvider>
      <Navbar />
        <Routes>
          <Route path="/login" element={ <Login /> } />
          <Route path="/signup" element={ <Signup /> } />
          <Route path="/" element={ <Landing /> } />
          <Route path="/contact" element={ <Contact /> } />
          <Route path="/home" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />

          <Route path="*" element={<NotFound/>} />
        </Routes>
    </UserAuthContextProvider>
  )
}

export default App