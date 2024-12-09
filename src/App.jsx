import React from "react"
import { Route, Routes } from "react-router-dom"

{/* Components */}
import { UserAuthContextProvider } from "./components/UserAuth"
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./components/Login"
import Signup from "./components/Signup"
import ResetPassword from "./components/ResetPassword"

{/* Pages */}
import About from "./pages/AboutUs"
import LandingMap from "./pages/LandingMap"
import Admin from "./pages/Admin"
import Contact from "./pages/Contact"
import NotFound from "./pages/NotFound"

{/* Layout */}
import MainLayout from "./layouts/MainLayout"
import MapLayout from "./layouts/MapLayout"

{/* Component Stack */}
function App() {
  return (
    <UserAuthContextProvider>
      <Routes>
        {/* User Logged In = False : Routing */}
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/signup" element={<MainLayout><Signup /></MainLayout>} />
        <Route path="/reset" element={<MainLayout><ResetPassword /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/" element={<MainLayout><About /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />

        {/* User Logged In = True : Routing, Component must be wrapped by Protected Route to ensure User Auth check */}
        <Route path="/map" element={<MapLayout><ProtectedRoute><LandingMap /></ProtectedRoute></MapLayout>}/>
        <Route path="/admin" element={<MapLayout><ProtectedRoute><Admin/></ProtectedRoute></MapLayout>}/>
      </Routes>
    </UserAuthContextProvider>
  )
}

export default App
