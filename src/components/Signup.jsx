import React, { useState } from "react"
import { useUserAuth } from "./UserAuth"
import { useNavigate, Link } from "react-router-dom"

const Signup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { signUp } = useUserAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (email.includes("@citymail.cuny.edu")) {
      try {
        await signUp(email, password);
        navigate("/login")
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log("Email must include @citymail.cuny.edu")
    }
  }

  return (
    <div className="signin-container">
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
        <button><Link to="/login">Login</Link></button>
    </div>
  )
}

export default Signup
