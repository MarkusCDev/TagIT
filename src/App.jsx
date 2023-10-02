import React, { useState } from "react"
import { Route, Routes } from 'react-router-dom'

/* Components */
import { UserAuthContextProvider } from "./components/UserAuth"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./components/Login"
import Signup from "./components/Signup"

/* Pages */
import Home from "./pages/Home"

function App() {
  return (
    <UserAuthContextProvider>
      <Routes>
        <Route path="/login" element={ <Login /> } />
        <Route path="/" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
        <Route path="/signup" element={ <Signup /> } />
      </Routes>
    </UserAuthContextProvider>
  )
}

export default App