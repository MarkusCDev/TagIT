import React, { useState } from "react"
import { useUserAuth } from "./UserAuth"
import { useNavigate, Link } from "react-router-dom"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { logIn } = useUserAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (email.includes("@citymail.cuny.edu")) {
      try {
        await logIn(email, password);
        navigate("/")
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log("Email must include @citymail.cuny.edu");
    }
  }

  return (
    <div className="signin-container">
      <form onSubmit={handleSubmit}>
        <h1>Log In</h1>
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
        <button type="submit">Log In</button>
      </form>
      <button><Link to="/signup">Signup</Link></button>
    </div>
  )
}

export default Login
